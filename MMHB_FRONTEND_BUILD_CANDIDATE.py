#!/usr/bin/env python3
"""One private frontend build of the pinned MMHB candidate.
Build-tool/plugin execution, not an OS sandbox. No package installation, MMHB
startup, database migration, source edits, Git writes or publication requested.
"""
from __future__ import annotations
import argparse, collections, datetime, hashlib, json, os, pathlib, re
import shutil, stat, subprocess, sys, tempfile, signal
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
P = pathlib.Path
ROOT = P('/home/runner/workspace')
WORK = ROOT / '.local/mmhb-candidates/a4-63ff8372'
STORE = ROOT / '.git/mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git'
CHECKPOINT = 'e23ee835f21198157b7aad4c248f768633814903'
PARENT = 'cb2e164a8fc19e7fab3a539a9facb4b4b562eaca'
FIX_REF = 'refs/mmhb-fixes/refresh-family-source-v1-da2a00f34c197fc9'
BASE = '63ff8372d07368a5434c11ff58bdf87bb468449d'
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 512 * 1024 * 1024
MAX_OUTPUT = 1024 * 1024

class Stop(RuntimeError):
    pass

def need(ok, message):
    if not ok:
        raise Stop(message)

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def clean_env():
    return {'PATH': os.environ.get('PATH', '/usr/bin:/bin'),
            'LANG': 'C', 'LC_ALL': 'C', 'TZ': 'UTC', 'CI': 'true',
            'NODE_DISABLE_COMPILE_CACHE': '1', 'GIT_CONFIG_NOSYSTEM': '1',
            'GIT_CONFIG_GLOBAL': '/dev/null', 'GIT_NO_LAZY_FETCH': '1'}

def plain(path, limit=MAX_FILE):
    st = path.lstat()
    need(stat.S_ISREG(st.st_mode), 'NOT_REGULAR_FILE:' + str(path))
    need(st.st_size <= limit, 'FILE_SIZE_LIMIT:' + str(path))
    fd = os.open(path, os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0))
    try:
        current = os.fstat(fd)
        need((current.st_dev, current.st_ino) == (st.st_dev, st.st_ino), 'FILE_REPLACED:' + str(path))
        with os.fdopen(fd, 'rb', closefd=False) as f:
            raw = f.read(limit + 1)
        need(len(raw) <= limit, 'FILE_GREW:' + str(path))
        return raw
    finally:
        os.close(fd)

def run(cmd, cwd, timeout=30):
    r = subprocess.run(cmd, cwd=cwd, env=clean_env(), capture_output=True, timeout=timeout)
    need(r.returncode == 0, 'COMMAND_FAILED:' + P(str(cmd[0])).name + ':' + r.stderr.decode(errors='replace')[:300])
    return r.stdout

class Repo:
    def __init__(self, store):
        self.store = store
        self.git = shutil.which('git')
        need(self.git, 'GIT_MISSING_NO_INSTALL')
    def get(self, *args):
        return run([self.git, '--no-pager', '--no-replace-objects', '--no-optional-locks',
                    '-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null',
                    '--git-dir=' + str(self.store), *args], self.store)
    def text(self, *args):
        return self.get(*args).decode().strip()

def snapshot(root, work, store, checkpoint, parent, ref, base):
    for directory in (root, work, store):
        need(directory.is_dir() and directory.resolve() == directory, 'DIRECTORY_MISSING_OR_LINK:' + str(directory))
    raw_marker = plain(work / '.git', MAX_OUTPUT)
    marker = raw_marker.decode().strip()
    need(marker.startswith('gitdir: '), 'WORKTREE_MARKER_INVALID')
    admin = P(marker[8:])
    if not admin.is_absolute():
        admin = work / admin
    need(admin.resolve() == admin and admin.parent == store / 'worktrees', 'WORKTREE_WRONG_STORE')
    need(plain(admin / 'gitdir').decode().strip() == str(work / '.git'), 'WORKTREE_BACKLINK')
    need(plain(admin / 'HEAD').decode().strip() == base, 'BASE_HEAD_CHANGED')
    need((admin / 'locked').is_file(), 'WORKTREE_LOCK_MISSING')
    repo = Repo(store)
    need(repo.text('rev-parse', '--verify', checkpoint + '^{commit}') == checkpoint, 'CHECKPOINT_MISSING')
    need(repo.text('rev-parse', '--verify', ref) == checkpoint, 'CHECKPOINT_REF_CHANGED')
    need(repo.text('rev-list', '--parents', '-n', '1', checkpoint) == checkpoint + ' ' + parent, 'CHECKPOINT_PARENT_CHANGED')
    entries = repo.get('ls-tree', '-r', '-z', '--full-tree', checkpoint).split(b'\0')
    observed = {}
    total = 0
    for entry in entries:
        if not entry:
            continue
        metadata, relative = entry.split(b'\t', 1)
        mode, kind, oid = metadata.decode().split()
        name = relative.decode('utf-8')
        need(not name.startswith('/') and all(x not in ('', '.', '..') for x in name.split('/')), 'UNSAFE_TREE_PATH')
        need(kind == 'blob' and mode in ('100644', '100755', '120000'), 'UNSUPPORTED_TREE_ENTRY:' + name)
        path = work / name
        for directory in path.parents:
            if directory == work:
                break
            need(directory.is_dir() and not directory.is_symlink(), 'LINKED_SOURCE_PARENT:' + name)
        if mode == '120000':
            need(path.is_symlink(), 'SOURCE_LINK_CHANGED:' + name)
            raw = os.fsencode(os.readlink(path))
        else:
            raw = plain(path)
            need(bool(path.stat().st_mode & 0o111) == (mode == '100755'), 'SOURCE_MODE_CHANGED:' + name)
        total += len(raw)
        need(total <= MAX_TOTAL, 'SOURCE_BYTE_BUDGET')
        blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        need(blob == oid, 'WORKING_SOURCE_DIFFERS_FROM_CHECKPOINT:' + name)
        observed[name] = oid
    for name in ('package.json', 'package-lock.json', 'tsconfig.json'):
        need(name in observed, 'BUILD_INPUT_NOT_COMMITTED:' + name)
        need(not (work / name).is_symlink(), 'BUILD_INPUT_LINK:' + name)
    metadata_paths = [work / '.git', admin / 'HEAD', admin / 'index', admin / 'locked', store / 'config']
    outer = root / '.git'
    if outer.is_dir():
        metadata_paths += [outer / n for n in ('HEAD', 'index', 'config') if (outer / n).exists()]
    meta = {str(p): digest(plain(p, 128 * 1024 * 1024)) for p in metadata_paths}
    refs = digest(repo.get('for-each-ref', '--format=%(refname) %(objectname) %(symref)'))
    return {'entries': observed, 'metadata': meta, 'refs': refs, 'bytes': total}

# These references were read from the known repository baseline. They must match
# the integrated checkpoint too; a different config is reviewed, never overwritten.
CONFIG_PINS = {
    'vite.config.js': 'e43fe32649c84475bcc0e52acbb733327e82c6a7',
    'client/postcss.config.js': 'f69c5d4119626ef8d9bcf980b8635b3e75315b7b',
}
TOOLS = ('vite', '@vitejs/plugin-react', 'rollup-plugin-visualizer',
         '@tailwindcss/postcss', 'autoprefixer')

RESOLVE = r'''
const fs=require('node:fs'), path=require('node:path');
const names=JSON.parse(process.argv[1]), out={};
for(const name of names){
 const entry=require.resolve(name,{paths:[process.cwd()]});
 let dir=path.dirname(fs.realpathSync(entry)), found;
 while(dir!==path.dirname(dir)){
  const f=path.join(dir,'package.json');
  if(fs.existsSync(f)){
   const p=JSON.parse(fs.readFileSync(f,'utf8'));
   if(p.name===name){found={entry:fs.realpathSync(entry),manifest:fs.realpathSync(f),version:p.version};break;}
  }
  dir=path.dirname(dir);
 }
 if(!found)throw Error('PACKAGE_MANIFEST_NOT_FOUND:'+name);
 out[name]=found;
}
console.log(JSON.stringify(out));
'''

BUILD_RUNNER = r'''
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(fs.realpathSync(process.cwd()),cfg.work);
assert.equal(process.env.NODE_ENV,'production');
assert.ok(!Object.keys(process.env).some(k=>k.startsWith('VITE_')||['DATABASE_URL','NODE_OPTIONS','NODE_PATH'].includes(k)));
const load=p=>import(pathToFileURL(p).href);
const vite=await load(cfg.tools.vite.entry);
const {visualizer}=await load(cfg.tools['rollup-plugin-visualizer'].entry);
const tailwind=(await load(cfg.tools['@tailwindcss/postcss'].entry)).default;
const autoprefixer=(await load(cfg.tools.autoprefixer.entry)).default;
const original=(await load(path.join(cfg.work,'vite.config.js'))).default;
assert.equal(typeof original,'object');
assert.equal(original.root,path.join(cfg.work,'client'));
assert.equal(original.build.outDir,path.join(cfg.work,'client/dist'));
assert.equal(original.build.rollupOptions.input,path.join(cfg.work,'client/index.html'));
assert.equal(original.define['process.env.NODE_ENV'],'"production"');
const flat=[];
async function flatten(input){for(const item of input){const p=await item;if(Array.isArray(p))await flatten(p);else if(p)flat.push(p);}}
await flatten(original.plugins);
assert.equal(flat.filter(p=>p.name==='visualizer').length,1,'Unexpected visualizer config');
const plugins=flat.map(p=>p.name==='visualizer'?visualizer({filename:cfg.visualizer,template:'treemap',gzipSize:true,brotliSize:true,open:false}):p);
const observation={config:null,outputs:[],moduleIds:[]};
plugins.push({
 name:'mmhb-private-build-observer', enforce:'post',
 configResolved(c){
  assert.ok(!c.configFile,'Automatic Vite config discovery was not disabled');
  assert.equal(c.root,original.root);
  assert.equal(c.build.outDir,cfg.output);
  assert.equal(c.cacheDir,cfg.cache);
  assert.equal(c.envDir,false,'Environment-file loading must stay disabled');
  assert.ok(!c.build.watch && !c.build.ssr);
  assert.ok(Array.isArray(c.css.postcss.plugins));
  assert.ok(!Object.keys(c.env).some(k=>k.startsWith('VITE_')));
  observation.config={root:c.root,outDir:c.build.outDir,base:c.base,cacheDir:c.cacheDir,
    envDir:c.envDir,mode:c.mode,plugins:c.plugins.map(p=>p.name)};
 },
 generateBundle(_opts,bundle){
  for(const item of Object.values(bundle)){
   const refs=item.type==='chunk'?[...(item.imports||[]),...(item.dynamicImports||[]),
    ...(item.viteMetadata?.importedCss||[]),...(item.viteMetadata?.importedAssets||[])]:[];
   observation.outputs.push({file:item.fileName,type:item.type,isEntry:item.isEntry===true,refs});
  }
  if(typeof this.getModuleIds==='function')observation.moduleIds=[...this.getModuleIds()];
 }
});
const result=await vite.build({...original,plugins,configFile:false,envFile:false,envDir:false,
 mode:'production',clearScreen:false,cacheDir:cfg.cache,
 css:{...(original.css||{}),postcss:{plugins:[tailwind({}),autoprefixer({})]}},
 build:{...original.build,outDir:cfg.output,emptyOutDir:false,watch:null,manifest:true}});
assert.ok(result && typeof result.close!=='function','Unexpected watch build');
const returns=Array.isArray(result)?result:[result];
assert.ok(returns.every(r=>Array.isArray(r.output)),'Missing emitted-output inventory');
observation.returnedFiles=[...new Set(returns.flatMap(r=>r.output.map(x=>x.fileName)))];
assert.ok(observation.config && observation.outputs.length>0,'Incomplete build observations');
fs.writeFileSync(cfg.observations,JSON.stringify(observation,null,2)+'\n',{flag:'wx',mode:0o600});
console.log('VITE_BUILD_RETURNED=YES');
'''

# Scan only regular files; do not follow file/directory links. Existing outputs
# are preserved separately, including their absence. This is observation, not a
# filesystem access-control boundary for arbitrary third-party plugins.
def tree_snapshot(path, optional=False):
    if not os.path.lexists(path):
        need(optional, 'TREE_MISSING:' + str(path))
        return None
    need(not path.is_symlink(), 'TREE_SYMLINK:' + str(path))
    if path.is_file():
        return {'': digest(plain(path))}
    need(path.is_dir(), 'TREE_TYPE:' + str(path))
    out={}; total=0
    for folder, dirs, files in os.walk(path, followlinks=False):
        dirs.sort(); files.sort()
        dirs[:]=[d for d in dirs if d not in ('node_modules','.git')]
        for d in dirs:
            need(not (P(folder)/d).is_symlink(), 'DIRECTORY_LINK_IN_INPUT:'+str(P(folder)/d))
        for name in files:
            p=P(folder)/name
            need(not p.is_symlink(), 'FILE_LINK_IN_INPUT:'+str(p))
            raw=plain(p); total+=len(raw)
            need(total<=MAX_TOTAL and len(out)<20000, 'TREE_BUDGET:'+str(path))
            out[p.relative_to(path).as_posix()]=digest(raw)
    return out

class EntryHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.refs=[]; self.base=False
    def handle_starttag(self, tag, attributes):
        a=dict(attributes)
        if tag=='base': self.base=True
        if tag=='script' and a.get('src'):
            self.refs.append(('script',a['src']))
        if tag=='link' and a.get('href'):
            rel=set(a.get('rel','').lower().split())
            if rel & {'stylesheet','modulepreload'}:
                self.refs.append(('css' if 'stylesheet' in rel else 'preload',a['href']))

def validate_outputs(output, observations):
    inventory=tree_snapshot(output)
    need(inventory and 'index.html' in inventory,'HTML_OUTPUT_MISSING')
    html=plain(output/'index.html'); need(bool(html.strip()),'EMPTY_HTML')
    parser=EntryHTML(); parser.feed(html.decode('utf8'))
    need(not parser.base,'UNREVIEWED_HTML_BASE')
    checks=0; external=0; html_js=0; html_css=0
    base=observations.get('config',{}).get('base','/')
    need(base=='/', 'UNREVIEWED_OUTPUT_BASE:'+str(base))
    def check(name, kind=None):
        nonlocal checks,external
        need(isinstance(name,str) and name, 'INVALID_OUTPUT_REFERENCE')
        url=urlsplit(name)
        if url.scheme or url.netloc:
            external+=1; return False
        n=unquote(url.path).removeprefix('/')
        if n.startswith('./'): n=n[2:]
        need(n and '\\' not in n and all(x not in ('','..','.') for x in n.split('/')), 'UNSAFE_OUTPUT_REFERENCE:'+name)
        need(n in inventory,'MISSING_OUTPUT_REFERENCE:'+n)
        if kind in ('script','css','entry'):
            need((output/n).stat().st_size>0,'EMPTY_REQUIRED_OUTPUT:'+n)
        checks+=1; return True
    entries=observations.get('outputs',[])
    need(isinstance(entries,list) and entries,'EMPTY_BUNDLER_INVENTORY')
    entry_js=0; emitted_css=0
    for row in entries:
        name=row['file']; check(name,'entry' if row.get('isEntry') else None)
        if row.get('isEntry') and name.endswith(('.js','.mjs')): entry_js+=1
        if name.endswith('.css'):
            check(name,'css'); emitted_css+=1
        for ref in row.get('refs',[]): check(ref)
    for name in observations.get('returnedFiles',[]): check(name)
    for kind,name in parser.refs:
        local=check(name,kind)
        if local and kind=='script': html_js+=1
        if local and kind=='css': html_css+=1
    need(entry_js and emitted_css and html_js and html_css,'ENTRY_JS_OR_CSS_NOT_PROVEN')
    # Vite manifest is metadata, not an application route list.
    manifest=output/'.vite/manifest.json'
    need(manifest.is_file(),'VITE_MANIFEST_MISSING')
    data=json.loads(plain(manifest))
    need(isinstance(data,dict) and data,'VITE_MANIFEST_INVALID')
    for row in data.values():
        check(row['file'])
        for name in row.get('css',[])+row.get('assets',[]): check(name)
        for key in row.get('imports',[])+row.get('dynamicImports',[]):
            need(key in data,'MANIFEST_CHUNK_KEY_MISSING:'+key)
            check(data[key]['file'])
    return {'files':len(inventory),'localReferencesChecked':checks,
        'externalReferencesNotFetched':external,'entryJavaScriptChunks':entry_js,
        'cssFiles':emitted_css,'htmlSha256':digest(html),
        'manifestSha256':digest(plain(manifest)),'fileSha256':inventory,
        'scope':'Bundler-listed references, Vite manifest and HTML script/stylesheet/modulepreload; not every runtime URL or CSS URL'}

def build_env(audit):
    env=clean_env();env.update({'NODE_ENV':'production','HOME':str(audit/'home'),
        'TMPDIR':str(audit/'tmp'),'XDG_CACHE_HOME':str(audit/'cache-home')})
    return env

def run_child(node,runner,config,work,audit,timeout=240):
    log=audit/'build.log'
    with log.open('xb') as stream:
        p=subprocess.Popen([node,str(runner),str(config)],cwd=work,env=build_env(audit),
            stdout=stream,stderr=subprocess.STDOUT,start_new_session=True)
        try:
            return p.wait(timeout=timeout)
        except (subprocess.TimeoutExpired, KeyboardInterrupt):
            try: os.killpg(p.pid,signal.SIGTERM)
            except ProcessLookupError: pass
            try: p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                try: os.killpg(p.pid,signal.SIGKILL)
                except ProcessLookupError: pass
                p.wait(timeout=5)
            raise

def execute(root=ROOT,work=WORK,store=STORE,checkpoint=CHECKPOINT,
            parent=PARENT,ref=FIX_REF,base=BASE,node_major=24,pins=CONFIG_PINS):
    root,work,store=map(P,(root,work,store))
    before=snapshot(root,work,store,checkpoint,parent,ref,base)
    for name,oid in pins.items():
        actual=before['entries'].get(name)
        need(actual==oid,'BUILD_CONFIG_REVIEW_REQUIRED:'+name+':expected='+oid+':actual='+str(actual))
    pkg=json.loads(plain(work/'package.json'))
    need(pkg.get('scripts',{}).get('build')=='vite build','BUILD_COMMAND_CHANGED')
    lock=json.loads(plain(work/'package-lock.json'))
    node=shutil.which('node');need(node,'NODE_MISSING_NO_INSTALL')
    version=run([node,'--version'],work).decode().strip()
    need(re.fullmatch(fr'v{node_major}\.\d+\.\d+',version),'NODE_24_REQUIRED_NO_INSTALL')
    tools=json.loads(run([node,'--input-type=commonjs','-e',RESOLVE,json.dumps(TOOLS)],work))
    observed_tools={}
    for name,t in tools.items():
        expected=lock.get('packages',{}).get('node_modules/'+name,{}).get('version')
        need(expected and expected==t['version'],'BUILD_TOOL_VERSION_DIFFERS:'+name)
        allowed=[(root/'node_modules').resolve(),(work/'node_modules').resolve()]
        need(any(P(t['entry']).is_relative_to(d) for d in allowed),'BUILD_TOOL_OUTSIDE_DEPENDENCIES:'+name)
        for key in ('entry','manifest'): observed_tools[t[key]]=digest(plain(P(t[key])))
    saved_outputs={str(p):tree_snapshot(p,True) for p in (work/'client/dist',work/'dist',work/'bundle-report.html')}
    observed_inputs={str(p):tree_snapshot(p,True) for p in (work/'client/src',work/'client/public',work/'shared',work/'attached_assets')}
    public_names=set()
    for name in before['entries']:
        if name.startswith('client/') and name.endswith(('.js','.jsx','.mjs','.ts','.tsx','.html')):
            raw=plain(work/name).decode(errors='replace')
            public_names.update(re.findall(r'\bVITE_[A-Z0-9_]+\b',raw))
    audit=P(tempfile.mkdtemp(prefix='mmhb-frontend-build-',dir=store))
    for name in ('bundle','home','tmp','cache','cache-home'): (audit/name).mkdir(mode=0o700)
    config={'work':str(work),'tools':tools,'output':str(audit/'bundle'),
        'visualizer':str(audit/'bundle-report.html'),'cache':str(audit/'cache'),
        'observations':str(audit/'build-observations.json')}
    (audit/'build-config.json').write_text(json.dumps(config,indent=2)+'\n')
    (audit/'build-runner.mjs').write_text(BUILD_RUNNER)
    print('CHECKPOINT='+checkpoint+'\nTRACKED_ENTRIES_VERIFIED='+str(len(before['entries'])),flush=True)
    print('NODE='+version+'\nBUILD_CONFIGS=REVIEWED_EXACT_MATCH',flush=True)
    print('BUILD_TOOL_VERSIONS='+json.dumps({k:v['version'] for k,v in tools.items()},sort_keys=True),flush=True)
    print('AUDIT_DIR='+str(audit)+'\nPUBLIC_VITE_NAMES='+json.dumps(sorted(public_names)),flush=True)
    report={'schema':'MMHB_PRIVATE_FRONTEND_BUILD_V1','checkpoint':checkpoint,'node':version,
        'tools':tools,'configPins':pins,'publicViteNames':sorted(public_names),
        'publicViteValuesForwarded':False,'dependencyVerification':'Direct package versions, entry locations and entry/manifest hashes; not full transitive dependency verification',
        'applicationSourceEditOperations':0,'applicationStarted':False,'databaseOperations':0,
        'installationOperations':0,'pushOperations':0,'deploymentOperations':0,
        'executionScope':'Build-tool/plugin code in a sanitized child, not an OS filesystem/network sandbox',
        'error':None,'preserved':False,'buildExitCode':None}
    code=1
    try:
        report['buildExitCode']=run_child(node,audit/'build-runner.mjs',audit/'build-config.json',work,audit)
        need(report['buildExitCode']==0,'VITE_BUILD_FAILED')
        observations=json.loads(plain(audit/'build-observations.json',64*1024*1024))
        report['outputs']=validate_outputs(audit/'bundle',observations)
        need((audit/'bundle-report.html').is_file() and (audit/'bundle-report.html').stat().st_size>0,'VISUALIZER_REPORT_MISSING')
        code=0
    except Exception as exc:
        report['error']=type(exc).__name__+':'+str(exc)
    finally:
        try:
            need(snapshot(root,work,store,checkpoint,parent,ref,base)==before,'TRACKED_SOURCE_OR_METADATA_CHANGED')
            need({p:digest(plain(P(p))) for p in observed_tools}==observed_tools,'BUILD_TOOL_ENTRY_CHANGED')
            need({p:tree_snapshot(P(p),True) for p in saved_outputs}==saved_outputs,'PREVIOUS_BUILD_OUTPUT_CHANGED')
            need({p:tree_snapshot(P(p),True) for p in observed_inputs}==observed_inputs,'OBSERVED_SOURCE_INPUT_CHANGED')
            report['preserved']=True
        except Exception as exc:
            code=1;report['error']=(report['error'] or '')+';POSTCHECK:'+str(exc)
        report['status']='PRIVATE_FRONTEND_BUILD_PASS_NOT_RELEASE' if code==0 else 'FRONTEND_BUILD_NOT_PASSED'
        report['logFile']=str(audit/'build.log');report['outputDirectory']=str(audit/'bundle')
        result=audit/'result.json';result.write_text(json.dumps(report,indent=2)+'\n')
        print('BUILD_EXIT_CODE='+str(report['buildExitCode']),flush=True)
        if code:
            print('ERROR='+str(report['error']),flush=True)
            print('BUILD_MESSAGES=RETAINED_IN_PRIVATE_LOG',flush=True)
        else:
            out=report['outputs']
            print('OUTPUT_FILES='+str(out['files'])+'\nLOCAL_REFERENCES_CHECKED='+str(out['localReferencesChecked']),flush=True)
            print('NONEMPTY_HTML_JS_CSS=YES\nBUNDLER_AND_MANIFEST_REFERENCES=PASS',flush=True)
        print('FULL_LOG='+str(audit/'build.log')+'\nRESULTS_FILE='+str(result)+'\nPRIVATE_FRONTEND_OUTPUT='+str(audit/'bundle'),flush=True)
        print('TRACKED_SOURCE_METADATA_AND_OBSERVED_INPUTS_OUTPUTS_UNCHANGED='+('YES' if report['preserved'] else 'NO'),flush=True)
        print('APPLICATION_SOURCE_EDITS=NO\nMMHB_APPLICATION_START=NO\nDATABASE_OPERATIONS=NO\nINSTALL=NO\nSERVER_BUILD=NOT_RUN\nFULL_NPM_TEST=NOT_RUN\nPUBLIC_CONFIGURATION=NOT_DEPLOYMENT_VALIDATED\nBROWSER_RENDERING=NOT_TESTED\nPUSH=NO\nDEPLOY=NO',flush=True)
        print('STATUS='+report['status'],flush=True)
    return report,code

if __name__=='__main__':
    os.umask(0o077)
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--build',action='store_true')
    args=ap.parse_args()
    print('COMMAND=MMHB_FRONTEND_BUILD_CANDIDATE',flush=True)
    if not args.build:
        print('ACTION_REQUIRED=--build');sys.exit(0)
    try:
        _,code=execute();sys.exit(code)
    except (Exception,KeyboardInterrupt) as exc:
        print('STOP='+type(exc).__name__+':'+str(exc),flush=True)
        print('STATUS=FRONTEND_PREFLIGHT_OR_RUN_STOPPED',flush=True);sys.exit(1)
