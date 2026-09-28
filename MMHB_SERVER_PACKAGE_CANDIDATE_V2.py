#!/usr/bin/env python3
"""Private server packaging for the pinned MMHB candidate.
Reuses the verified frontend; builds outside candidate dist; never starts MMHB.
Executes esbuild, an SDK-only fake-transport email probe, and a copied bcrypt native smoke test. Not an OS sandbox.
No npm install, network operation, live database, migration, git write or deployment is requested.
"""
from __future__ import annotations
import argparse, collections, datetime, hashlib, json, os, pathlib, re
import shutil, stat, subprocess, sys, tempfile, signal
P = pathlib.Path
ROOT = P('/home/runner/workspace')
WORK = ROOT / '.local/mmhb-candidates/a4-63ff8372'
STORE = ROOT / '.git/mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git'
CHECKPOINT = 'e23ee835f21198157b7aad4c248f768633814903'
PARENT = 'cb2e164a8fc19e7fab3a539a9facb4b4b562eaca'
FIX_REF = 'refs/mmhb-fixes/refresh-family-source-v1-da2a00f34c197fc9'
BASE = '63ff8372d07368a5434c11ff58bdf87bb468449d'
FRONTEND_AUDIT = STORE / 'mmhb-frontend-build-_sc9flef'
SCRIPT_PIN = '6863bbda9a2ebf00948ea299e69034e7baf255d2'
REPLIT_PIN = '2faf45177af39ee19760343eec81736cf0a09839'
SQL_SHA = '1feb46d6f7f142c34403032ca1a87e3f8a6f1e493e91a5b63cdf075624d4f340'
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 512 * 1024 * 1024
MAX_OUTPUT = 1024 * 1024
EXTERNAL = ['pg-native', 'pg-cloudflare', 'bufferutil', 'utf-8-validate', 'bcrypt']
NATIVE = ['bcrypt', 'node-gyp-build']
SQL_PATH = 'server/db/refresh-family/refresh-family-v1.sql'
CANONICAL = 'server/db/schema.canonical.sql'
CUTOVER = 'docs/security/refresh-family-cutover.md'

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


# Metadata resolution only: this code does not import the located packages.
RESOLVE = r'''
const fs=require('node:fs'), path=require('node:path');
function locate(name,base) {
 try {
  const entry=fs.realpathSync(require.resolve(name,{paths:[base]}));
  for(let p=path.dirname(entry);;p=path.dirname(p)) {
   const manifest=path.join(p,'package.json');
   if(fs.existsSync(manifest)) {
    const j=JSON.parse(fs.readFileSync(manifest,'utf8'));
    if(j.name===name)return {entry,manifest:fs.realpathSync(manifest),root:fs.realpathSync(p),version:j.version};
   }
   if(p===path.dirname(p))break;
  }
  return {error:'PACKAGE_MANIFEST_NOT_FOUND'};
 }catch(e){return {error:e.code||'PACKAGE_METADATA_UNREADABLE'};}
}
const tools={};
tools.esbuild=locate('esbuild',process.cwd());
tools.bcrypt=locate('bcrypt',process.cwd());
tools['node-gyp-build']=locate('node-gyp-build',tools.bcrypt.root||process.cwd());
console.log(JSON.stringify({tools,platform:process.platform,arch:process.arch,
 node:process.version,modules:process.versions.modules,napi:process.versions.napi,
 builtins:require('node:module').builtinModules}));
'''

SERVER_RUNNER = r'''
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const c=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(fs.realpathSync(process.cwd()),c.work);
assert.equal(process.env.NODE_ENV,'production');
assert.ok(!Object.keys(process.env).some(k=>k.startsWith('VITE_')||
 ['NODE_OPTIONS','NODE_PATH','DATABASE_URL','ESBUILD_BINARY_PATH'].includes(k)));
const esbuild=await import(pathToFileURL(c.esbuild.entry).href);
assert.equal(esbuild.version,c.esbuild.version);
const result=await esbuild.build({
 absWorkingDir:c.work,
 entryPoints:[path.join(c.work,'server/app.mjs')],
 bundle:true,platform:'node',format:'esm',target:'node24',
 outfile:path.join(c.dist,'server.mjs'),
 external:['pg-native','pg-cloudflare','bufferutil','utf-8-validate','bcrypt'],
 banner:{js:[
  "import { createRequire as __createRequire } from 'node:module';",
  'const require = __createRequire(import.meta.url);',
 ].join('\n')},
 logLevel:'info',metafile:true,
});
fs.writeFileSync(c.metafile,JSON.stringify(result.metafile,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(c.messages,JSON.stringify({warnings:result.warnings,errors:result.errors},null,2)+'\n',{flag:'wx'});
console.log('SERVER_ESBUILD_API_COMPLETE');
'''

NATIVE_PROBE = r'''
// Runs only copied dependency code, NOT the application server or database client.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const c=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const req=createRequire(path.join(c.dist,'server.mjs'));
const modules=fs.realpathSync(path.join(c.dist,'node_modules'));
const within=p=>{const r=path.relative(modules,fs.realpathSync(p));return r!==''&&!r.startsWith('..'+path.sep)&&r!=='..'&&!path.isAbsolute(r);};
const bcryptEntry=req.resolve('bcrypt');assert.ok(within(bcryptEntry),'BCRYPT_RESOLVED_OUTSIDE_PACKAGE');
const fromBcrypt=createRequire(bcryptEntry);
const loader=fromBcrypt.resolve('node-gyp-build');assert.ok(within(loader),'NATIVE_LOADER_OUTSIDE_PACKAGE');
const before=new Set(Object.keys(require.cache));
const bcrypt=req('bcrypt');
const sample='MMHB_SYNTHETIC_NATIVE_PROBE';
const hashed=bcrypt.hashSync(sample,4);
assert.equal(typeof hashed,'string');assert.equal(bcrypt.compareSync(sample,hashed),true);
assert.equal(bcrypt.compareSync(sample+'-wrong',hashed),false);
const added=Object.keys(require.cache).filter(p=>!before.has(p));
assert.ok(added.every(within),'NATIVE_PROBE_USED_OUTSIDE_PACKAGE');
const binaries=added.filter(p=>p.endsWith('.node'));
assert.ok(binaries.length>0,'NATIVE_BINARY_LOAD_NOT_OBSERVED');
const report={passed:true,scope:'Copied bcrypt hash/compare and native-module paths; not application startup or target VM compatibility',
 node:process.version,platform:process.platform,arch:process.arch,nodeModuleAbi:process.versions.modules,
 packageEntry:path.relative(c.dist,bcryptEntry),loader:path.relative(c.dist,loader),
 loadedFiles:added.map(p=>path.relative(c.dist,p)),nativeFiles:binaries.map(p=>path.relative(c.dist,p))};
fs.writeFileSync(c.nativeResult,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log('COPIED_BCRYPT_HASH_COMPARE=PASS');
'''

# A single conditional optional capability, NOT a wildcard external exemption.
EMAIL_TARGET = '@react-email/render'
RESEND_VERSION = '6.22.1'
EMAIL_PINS = {
    'server/services/email.mjs': '88217e1cd184a9e3a9a801ac7542820c3fd5fc8a',
    'server/utils/email.mjs': '9df253aefaf623010d94a49c54014c1f62417d67',
    'server/routes/blog.mjs': '64458c35dfa5179302f6d888604d935e025c58d0',
}
# Reviewed at df8137696e4c7b0a7c16a08347e1b92f85b85371. The integrated
# checkpoint MUST match these object IDs; a different caller stops, not auto-adopts.
RESEND_RESOLVE = r'''
const fs=require('node:fs'),path=require('node:path');
const entry=fs.realpathSync(require.resolve('resend',{paths:[process.cwd()]}));
let root=path.dirname(entry),found;
for(;;){
 const file=path.join(root,'package.json');
 if(fs.existsSync(file)){
  const p=JSON.parse(fs.readFileSync(file,'utf8'));
  if(p.name==='resend'){found={root:fs.realpathSync(root),manifest:fs.realpathSync(file),
    version:p.version,esmExport:p.exports?.['.']?.import?.default};break;}
 }
 const parent=path.dirname(root);if(parent===root)break;root=parent;
}
if(!found)throw Error('RESEND_PACKAGE_METADATA_MISSING');
console.log(JSON.stringify(found));
'''
EMAIL_PROBE = r'''
// SDK-only behavior test. No app modules, credentials, connector requests or real email.
// The Resend HTTP transport is replaced; renderer resolution is deliberately denied.
// These JavaScript guards are NOT an OS/network security sandbox.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {registerHooks,createRequire,syncBuiltinESMExports} from 'node:module';
const c=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
assert.equal(process.env.NODE_ENV,'production');
for(const k of ['RESEND_API_KEY','REPL_IDENTITY','WEB_REPL_RENEWAL','DATABASE_URL','NODE_OPTIONS','NODE_PATH'])
 assert.ok(!process.env[k],'Unexpected runtime configuration');
let rendererAttempts=0,networkAttempts=0;
const blockNetwork=()=>{networkAttempts++;throw Error('MMHB_PROBE_NETWORK_DISABLED');};
globalThis.fetch=async()=>blockNetwork();
const req=createRequire(import.meta.url);
for(const [name,keys] of [['node:http',['request','get']],['node:https',['request','get']],
 ['node:net',['connect','createConnection']],['node:tls',['connect']],['node:dns',['lookup','resolve']]]){
 const obj=req(name);for(const k of keys)obj[k]=blockNetwork;
}
req('node:net').Socket.prototype.connect=blockNetwork;
syncBuiltinESMExports();
const hooks=registerHooks({resolve(specifier,context,nextResolve){
 if(specifier==='@react-email/render'){
  rendererAttempts++;const error=new Error('MMHB_TEST_RENDERER_ABSENT');error.code='ERR_MODULE_NOT_FOUND';throw error;
 }
 return nextResolve(specifier,context);
}});
const checks=[],calls=[];
function ok(name,fn){fn();checks.push(name);}
try{
 const {Resend}=await import(pathToFileURL(c.sdkEntry).href);
 const sdk=new Resend('re_MMHB_SYNTHETIC_NOT_A_REAL_KEY');
 const response={data:{id:'mmhb-synthetic-id'},error:null};
 sdk.post=async(url,body,options)=>{calls.push({url,body,options});return response;};
 ok('sdk_import_and_constructor_do_not_require_renderer',()=>assert.equal(rendererAttempts,0));
 const base={from:'sender@example.invalid',to:'recipient@example.invalid',subject:'MMHB SDK-only test'};
 for(const [name,extra] of [
  ['html_without_renderer',{html:'<p>Synthetic HTML</p>'}],
  ['text_without_renderer',{text:'Synthetic text'}],
  ['html_and_text_without_renderer',{html:'<p>Synthetic HTML</p>',text:'Synthetic text'}],
  ['null_react_does_not_require_renderer',{html:'<p>Synthetic HTML</p>',react:null}]
 ]){
  const payload=Object.freeze({...base,...extra});const before=JSON.stringify(payload),n=calls.length;
  const out=await sdk.emails.send(payload);
  ok(name,()=>{
   assert.equal(out,response);assert.equal(calls.length,n+1);assert.equal(calls[n].url,'/emails');
   assert.equal(rendererAttempts,0);assert.equal(JSON.stringify(payload),before);
   if(extra.html)assert.equal(calls[n].body.html,extra.html);
   if(extra.text)assert.equal(calls[n].body.text,extra.text);
  });
 }
 const options={idempotencyKey:'mmhb-synthetic-idempotency'};
 await sdk.emails.send({...base,html:'<p>Options</p>'},options);
 ok('request_options_preserved',()=>assert.equal(calls.at(-1).options,options));
 const apiError={data:null,error:{name:'validation_error',message:'Synthetic failure',statusCode:422}};
 sdk.post=async()=>apiError;
 const failed=await sdk.emails.send({...base,html:'<p>Error result</p>'});
 ok('provider_error_result_is_not_converted_to_success',()=>assert.equal(failed,apiError));
 sdk.post=async(url,body,options)=>{calls.push({url,body,options});return response;};
 for(const [name,extra] of [
  ['react_payload_requires_unavailable_renderer',{react:{synthetic:true}}],
  ['html_does_not_hide_truthy_react_payload',{html:'<p>HTML</p>',react:{synthetic:true}}]
 ]){
  const count=calls.length;let message='';
  try{await sdk.emails.send({...base,...extra});}catch(e){message=String(e.message);}
  ok(name,()=>{assert.match(message,/Failed to render React component/);assert.equal(calls.length,count);assert.ok(rendererAttempts>0);});
 }
 ok('no_network_calls',()=>assert.equal(networkAttempts,0));
 assert.equal(checks.length,10);
 fs.writeFileSync(c.emailResult,JSON.stringify({schema:'MMHB_RESEND_OPTIONAL_PROBE_V1',passed:true,
  checks,assertions:10,rendererAttempts,networkAttempts,realEmailSent:false,
  scope:'Real installed SDK, fake HTTP transport and deliberately blocked optional renderer; not app email routes or delivery'},null,2)+'\n',{flag:'wx'});
 console.log('RESEND_OPTIONAL_PROBE=10_OF_10\nEMAIL_DELIVERY=NOT_TESTED\nREAL_EMAIL_SENT=NO');
}finally{hooks.deregister();}
'''

def email_preflight(root,work,lock,entries,node,pins=EMAIL_PINS):
    for name,oid in pins.items():
        actual=entries.get(name)
        need(actual==oid,'EMAIL_CALLER_REVIEW_REQUIRED:'+name+':expected='+oid+':actual='+str(actual))
    need(set(pins)==set(EMAIL_PINS),'EMAIL_CALLER_SET_CHANGED')
    packages=lock.get('packages',{})
    rec=packages.get('node_modules/resend',{})
    need(rec.get('version')==RESEND_VERSION and
         rec.get('peerDependencies',{}).get(EMAIL_TARGET)=='*' and
         rec.get('peerDependenciesMeta',{}).get(EMAIL_TARGET,{}).get('optional') is True,
         'RESEND_OPTIONAL_PEER_LOCK_REVIEW_REQUIRED')
    need(not any(k=='node_modules/'+EMAIL_TARGET or k.endswith('/node_modules/'+EMAIL_TARGET)
                 for k in packages),'RENDERER_NOW_LOCKED_REVIEW_REQUIRED')
    info=json.loads(run([node,'--input-type=commonjs','-e',RESEND_RESOLVE],work))
    print('RESEND_PACKAGE='+json.dumps({'expected':rec['version'],'actual':info.get('version'),
          'manifest':info.get('manifest')},sort_keys=True),flush=True)
    need(info.get('version')==rec['version'],'RESEND_INSTALLED_VERSION_DIFFERS')
    folder=P(info['root']);directory(folder)
    need(folder in (root/'node_modules/resend',work/'node_modules/resend'),'RESEND_PACKAGE_LOCATION_REVIEW_REQUIRED')
    need(info.get('manifest')==str(folder/'package.json') and info.get('esmExport')=='./dist/index.mjs',
         'RESEND_ESM_EXPORT_REVIEW_REQUIRED')
    manifest=json.loads(plain(folder/'package.json'))
    for field in ('dependencies','optionalDependencies','peerDependencies','peerDependenciesMeta'):
        need((manifest.get(field) or {})==(rec.get(field) or {}),'RESEND_LOCK_METADATA_DIFFERS:'+field)
    entry=folder/'dist/index.mjs';need(entry.is_file() and entry.resolve()==entry,'RESEND_ENTRY_UNSAFE')
    info['entry']=str(entry);inv=tree_inventory(folder)
    return info,inv

def review_optional_email(work,meta,entries,sdk,probe,pins=EMAIL_PINS):
    """Approve only the exact optional import from the reviewed SDK/callers."""
    need(probe.get('passed') is True and probe.get('assertions')==10 and
         len(probe.get('checks',[]))==10 and probe.get('networkAttempts')==0 and
         probe.get('realEmailSent') is False,'RESEND_PROBE_EVIDENCE_INCOMPLETE')
    for name,oid in pins.items():need(entries.get(name)==oid,'EMAIL_CALLER_REVIEW_REQUIRED:'+name)
    owners=[]
    for source,record in meta.get('inputs',{}).items():
        for imp in record.get('imports',[]):
            if imp.get('path')==EMAIL_TARGET and imp.get('external') is True:
                owners.append((source,imp.get('kind')))
    need(len(owners)==1 and owners[0][1]=='dynamic-import','OPTIONAL_RENDERER_OWNER_OR_KIND_CHANGED')
    owner=owners[0][0];need((work/owner).resolve()==P(sdk['entry']),'OPTIONAL_RENDERER_NOT_FROM_REVIEWED_SDK')
    callers=set()
    for source,record in meta.get('inputs',{}).items():
        for imp in record.get('imports',[]):
            if imp.get('external') is not True and (work/imp.get('path','')).resolve()==P(sdk['entry']):
                p=(work/source).resolve();need(p.is_relative_to(work),'UNREVIEWED_RESEND_IMPORTER')
                callers.add(p.relative_to(work).as_posix())
    need(callers==set(pins),'RESEND_CALLER_GRAPH_CHANGED:'+','.join(sorted(callers)))
    need(len(meta.get('outputs',{}))==1,'UNEXPECTED_SERVER_OUTPUT_SET')
    out=next(iter(meta['outputs'].values()))
    uses=[x for x in out.get('imports',[]) if x.get('path')==EMAIL_TARGET]
    need(len(uses)==1 and uses[0].get('external') is True and uses[0].get('kind')=='dynamic-import',
         'OPTIONAL_RENDERER_OUTPUT_CHANGED')
    need(out.get('inputs',{}).get(owner,{}).get('bytesInOutput',0)>0,'RESEND_SOURCE_NOT_IN_BUNDLE')
    return {'name':EMAIL_TARGET,'kind':'dynamic-import','owner':owner,'callers':sorted(callers),
        'callerObjectIds':pins,'resendVersion':sdk['version'],'sdkEntrySha256':digest(plain(P(sdk['entry']))),
        'policy':'Optional renderer deliberately not shipped. Reviewed callers provide HTML, not react.',
        'scope':'No assurance of email delivery, wrapper error reporting, escaping, branding or all dynamic runtime paths',
        'reactEmailRendering':'UNAVAILABLE_UNTIL_SEPARATELY_IMPLEMENTED_AND_QUALIFIED',
        'sdkProbe':probe}


def safe_name(name):
    need(isinstance(name,str) and name and not name.startswith('/') and '\\' not in name
         and not any(ord(c)<32 or ord(c)==127 for c in name)
         and all(p not in ('','.','..') for p in name.split('/')),'UNSAFE_RELATIVE_PATH')
    return name

def directory(path):
    need(path.is_dir() and path.resolve()==path,'DIRECTORY_MISSING_OR_LINK:'+str(path))


def tree_inventory(path, optional=False, observe_links=False):
    """Bounded complete file inventory, no link traversal. Includes .git/node_modules."""
    if not os.path.lexists(path):
        need(optional,'TREE_MISSING:'+str(path));return None
    out={};total=0
    def visit(p,rel,depth):
        nonlocal total
        need(depth<=40 and len(out)<30000,'TREE_BUDGET:'+str(path))
        st=p.lstat()
        if stat.S_ISLNK(st.st_mode):
            need(observe_links,'LINK_IN_PACKAGE_INPUT:'+str(p))
            b=os.fsencode(os.readlink(p));out[rel]={'kind':'link','sha256':digest(b),'bytes':len(b),'mode':'120000'};return
        if stat.S_ISREG(st.st_mode):
            b=plain(p);total+=len(b);need(total<=MAX_TOTAL,'TREE_BYTE_BUDGET:'+str(path))
            out[rel]={'kind':'file','sha256':digest(b),'bytes':len(b),'mode':'100755' if st.st_mode&0o111 else '100644'};return
        need(stat.S_ISDIR(st.st_mode),'SPECIAL_FILE_IN_INPUT:'+str(p))
        for child in sorted(p.iterdir()):
            n=child.name if not rel else rel+'/'+child.name
            safe_name(n);visit(child,n,depth+1)
    visit(path,'',0)
    return out


def hashes(inventory):
    return {k:v['sha256'] for k,v in inventory.items()}


def write_new(path,raw,mode=0o600):
    fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL|getattr(os,'O_NOFOLLOW',0),mode)
    try:
        with os.fdopen(fd,'wb',closefd=False) as f:f.write(raw);f.flush();os.fsync(fd)
    finally:os.close(fd)


def copy_inventory(src,dst,inventory):
    need(not os.path.lexists(dst),'COPY_DESTINATION_ALREADY_EXISTS')
    dst.mkdir(mode=0o700)
    for name,row in inventory.items():
        safe_name(name);need(row['kind']=='file','NONFILE_COPY_REFUSED')
        raw=plain(src/name)
        need(digest(raw)==row['sha256'],'COPY_INPUT_CHANGED:'+name)
        target=dst/name;target.parent.mkdir(parents=True,exist_ok=True,mode=0o700)
        write_new(target,raw,0o755 if row['mode']=='100755' else 0o644)
    need(tree_inventory(dst)==inventory,'COPIED_TREE_DIFFERS')


def frontend_evidence(frontend_audit,checkpoint):
    directory(frontend_audit)
    report_path=frontend_audit/'result.json'
    raw=plain(report_path,64*1024*1024);r=json.loads(raw)
    output=frontend_audit/'bundle';directory(output)
    need(r.get('schema')=='MMHB_PRIVATE_FRONTEND_BUILD_V1' and r.get('checkpoint')==checkpoint,
         'FRONTEND_EVIDENCE_IDENTITY')
    need(r.get('status')=='PRIVATE_FRONTEND_BUILD_PASS_NOT_RELEASE' and r.get('buildExitCode')==0
         and r.get('error') is None and r.get('preserved') is True,'FRONTEND_NOT_QUALIFIED')
    need(r.get('outputDirectory')==str(output) and r.get('publicViteValuesForwarded') is False,
         'FRONTEND_OUTPUT_IDENTITY_OR_CONFIG')
    inv=tree_inventory(output);recorded=r.get('outputs',{})
    need(inv and hashes(inv)==recorded.get('fileSha256') and len(inv)==recorded.get('files'),
         'FRONTEND_FILES_DIFFER_FROM_SUCCESS_REPORT')
    need('index.html' in inv and '.vite/manifest.json' in inv and inv['index.html']['bytes']>0,
         'FRONTEND_ENTRY_MISSING')
    need(inv['index.html']['sha256']==recorded.get('htmlSha256') and
         inv['.vite/manifest.json']['sha256']==recorded.get('manifestSha256'),'FRONTEND_ENTRY_HASH_DIFFERS')
    return {'reportSha256':digest(raw),'inventory':inv,'report':r,'output':output}


def lock_resolve(packages,parent_key,name):
    here=P(parent_key)
    while True:
        if here.name!='node_modules':
            key=(here/'node_modules'/name).as_posix()
            if key in packages:return key,packages[key]
        if str(here)=='.':break
        here=here.parent
    raise Stop('LOCK_DEPENDENCY_LOCATION_MISSING:'+name)


def tool_check(root,work,node,lock):
    info=json.loads(run([node,'--input-type=commonjs','-e',RESOLVE],work));tools=info['tools']
    packages=lock.get('packages',{});need(lock.get('lockfileVersion')==3,'LOCKFILE_V3_REQUIRED')
    keys={'esbuild':'node_modules/esbuild','bcrypt':'node_modules/bcrypt'}
    key,_=lock_resolve(packages,keys['bcrypt'],'node-gyp-build');keys['node-gyp-build']=key
    faults=[]
    for name,t in tools.items():
        expected=packages.get(keys[name],{}).get('version')
        print('PACKAGE='+json.dumps({'name':name,'expected':expected,'actual':t.get('version'),
              'error':t.get('error'),'manifest':t.get('manifest')},sort_keys=True),flush=True)
        if t.get('error') or not expected or t.get('version')!=expected:faults.append(name)
        if not t.get('error'):
            folder=P(t['root']);directory(folder)
            need(any(folder.is_relative_to(d) for d in (root/'node_modules',work/'node_modules')),
                 'PACKAGE_OUTSIDE_DEPENDENCIES:'+name)
            need(P(t['manifest']).parent==folder and P(t['entry']).is_relative_to(folder),'PACKAGE_PATH_MISMATCH:'+name)
    need(not faults,'SERVER_DEPENDENCY_VERSION_OR_RESOLUTION:'+','.join(faults))
    manifests={n:json.loads(plain(P(t['manifest']))) for n,t in tools.items()}
    deps=manifests['bcrypt'].get('dependencies',{})
    need('node-gyp-build' in deps and set(deps)<= {'node-gyp-build','node-addon-api'}
         and not manifests['bcrypt'].get('optionalDependencies'),'BCRYPT_RUNTIME_DEPENDENCY_REVIEW_REQUIRED')
    need(not manifests['node-gyp-build'].get('dependencies') and
         not manifests['node-gyp-build'].get('optionalDependencies'),'NATIVE_LOADER_DEPENDENCY_REVIEW_REQUIRED')
    # Includes installed package files, not registry archive verification. No scripts run.
    inventories={n:tree_inventory(P(t['root'])) for n,t in tools.items()}
    for n in NATIVE:
        for f in inventories[n]:
            need(not any(p in ('.git','.npmrc') or p=='.env' or p.startswith('.env.')
                         for p in f.split('/')),'PRIVATE_FILE_IN_NATIVE_PACKAGE:'+n)
    return info,inventories


def child_env(audit):
    e=clean_env();e.update({'NODE_ENV':'production','HOME':str(audit/'home'),
        'TMPDIR':str(audit/'tmp'),'XDG_CACHE_HOME':str(audit/'cache')})
    return e


def run_logged(cmd,cwd,audit,logname,timeout=240):
    with (audit/logname).open('xb') as f:
        p=subprocess.Popen(cmd,cwd=cwd,env=child_env(audit),stdout=f,stderr=subprocess.STDOUT,start_new_session=True)
        try:return p.wait(timeout=timeout)
        except (subprocess.TimeoutExpired,KeyboardInterrupt):
            try:os.killpg(p.pid,signal.SIGTERM)
            except ProcessLookupError:pass
            try:p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                try:os.killpg(p.pid,signal.SIGKILL)
                except ProcessLookupError:pass
                p.wait(timeout=5)
            raise


def validate_server_meta(work,dist,meta,entries,builtins,optional_email=None):
    """Static packaging checks; does not claim dynamic imports are all self-contained."""
    output=dist/'server.mjs'
    need(output.is_file() and len(plain(output))>0,'SERVER_OUTPUT_MISSING_OR_EMPTY')
    outs=meta.get('outputs',{});need(isinstance(outs,dict) and len(outs)==1,'UNEXPECTED_SERVER_OUTPUT_SET')
    output_name,row=next(iter(outs.items()))
    need((work/output_name).resolve()==output.resolve() and row.get('entryPoint')=='server/app.mjs',
         'SERVER_OUTPUT_OR_ENTRYPOINT_DIFFERS')
    need(row.get('bytes')==output.stat().st_size,'SERVER_OUTPUT_SIZE_DIFFERS')
    inputs=meta.get('inputs',{});need(isinstance(inputs,dict) and inputs,'SERVER_INPUTS_MISSING')
    needed=['server/app.mjs','server/services/refreshTokens.service.mjs','server/services/refreshFamilyAdapter.mjs']
    included={str((work/p).resolve()):v for p,v in row.get('inputs',{}).items()}
    for name in needed:
        need(str(work/name) in included and included[str(work/name)].get('bytesInOutput',0)>0,
             'INTEGRATED_SERVER_SOURCE_NOT_BUNDLED:'+name)
    builtin=set(builtins);builtin|={'node:'+x for x in list(builtin) if not x.startswith('node:')}
    external=[]
    for item in row.get('imports',[]):
        name=item.get('path');need(isinstance(name,str) and item.get('external') is True,'UNEXPECTED_SERVER_CHUNK_IMPORT')
        ok=name in builtin or name in EXTERNAL or any(name.startswith(n+'/') for n in EXTERNAL)
        if name==EMAIL_TARGET and optional_email is not None:
            ok=optional_email.get('name')==name and item.get('kind')=='dynamic-import'
        need(ok,'UNREVIEWED_EXTERNAL_IMPORT:'+name);external.append(name)
    observed={}
    for name,item in inputs.items():
        p=(work/name).resolve();need(p.is_file(),'SERVER_BUILD_INPUT_MISSING')
        # Only committed application files or installed dependency files may enter.
        if 'node_modules' not in p.parts:
            need(p.is_relative_to(work),'UNREVIEWED_BUILD_INPUT_LOCATION')
            rel=p.relative_to(work).as_posix();need(rel in entries,'UNCOMMITTED_SERVER_BUILD_INPUT:'+rel)
        else:
            need(p.is_relative_to(work/'node_modules') or p.is_relative_to(work.parents[2]/'node_modules'),
                 'UNREVIEWED_DEPENDENCY_LOCATION')
        raw=plain(p);need(len(raw)==item.get('bytes'),'BUNDLED_INPUT_SIZE_CHANGED')
        if p.is_relative_to(work) and p.relative_to(work).as_posix() in entries:
            rel=p.relative_to(work).as_posix()
            oid=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
            need(oid==entries[rel],'BUNDLED_TRACKED_INPUT_CHANGED:'+rel)
        observed[str(p)]=digest(raw)
    return {'inputs':len(inputs),'externalImports':sorted(set(external)),
        'inputSha256AfterBuild':observed,'serverSha256':digest(plain(output)),
        'scope':'esbuild metafile inputs/externals plus nonempty output; dynamic runtime paths and all runtime assets not proven'}


def execute(root=ROOT,work=WORK,store=STORE,checkpoint=CHECKPOINT,parent=PARENT,
            ref=FIX_REF,base=BASE,frontend_audit=FRONTEND_AUDIT,node_major=24,
            script_pin=SCRIPT_PIN,replit_pin=REPLIT_PIN,email_pins=EMAIL_PINS):
    root,work,store,frontend_audit=map(P,(root,work,store,frontend_audit))
    before=snapshot(root,work,store,checkpoint,parent,ref,base)
    need(before['entries'].get('scripts/build-server.mjs')==script_pin,'SERVER_SCRIPT_REVIEW_REQUIRED')
    need(before['entries'].get('.replit')==replit_pin,'DEPLOYMENT_CONFIG_REVIEW_REQUIRED')
    need(digest(plain(work/SQL_PATH))==SQL_SHA,'QUALIFIED_REFRESH_SQL_CHANGED')
    front=frontend_evidence(frontend_audit,checkpoint)
    lock=json.loads(plain(work/'package-lock.json'))
    node=shutil.which('node');need(node,'NODE_MISSING_NO_INSTALL')
    version=run([node,'--version'],work).decode().strip()
    need(re.fullmatch(fr'v{node_major}\.\d+\.\d+',version),'NODE_24_REQUIRED_NO_INSTALL')
    info,package_inputs=tool_check(root,work,node,lock)
    sdk,sdk_inventory=email_preflight(root,work,lock,before['entries'],node,email_pins)
    old_outputs={str(p):tree_inventory(p,True,True) for p in
        (work/'client/dist',work/'dist',work/'bundle-report.html',root/'client/dist',root/'dist')}
    canonical=plain(work/CANONICAL);cutover=plain(work/CUTOVER);sql=plain(work/SQL_PATH)
    audit=P(tempfile.mkdtemp(prefix='mmhb-server-package-v2-',dir=store))
    for name in ('home','tmp','cache','package'):(audit/name).mkdir(mode=0o700)
    package=audit/'package';dist=package/'dist';dist.mkdir(mode=0o700)
    config={'work':str(work),'dist':str(dist),'esbuild':info['tools']['esbuild'],
        'metafile':str(audit/'server-metafile.json'),'messages':str(audit/'build-messages.json'),
        'nativeResult':str(audit/'native-result.json'),
        'sdkEntry':sdk['entry'],'emailResult':str(audit/'email-result.json')}
    write_new(audit/'config.json',(json.dumps(config,indent=2)+'\n').encode())
    write_new(audit/'build-server-private.mjs',SERVER_RUNNER.encode())
    write_new(audit/'native-probe.cjs',NATIVE_PROBE.encode())
    write_new(audit/'email-probe.mjs',EMAIL_PROBE.encode())
    report={'schema':'MMHB_PRIVATE_SERVER_PACKAGE_V2','checkpoint':checkpoint,'node':version,
        'frontendReportSha256':front['reportSha256'],'frontendSource':str(front['output']),
        'tools':info['tools'],'platform':info['platform'],'arch':info['arch'],
        'dependencyVerification':'Installed versions, copied package file hashes and resolution; not lock-integrity verification of full transitive tree',
        'auditDirectory':str(audit),'packageDirectory':str(package),'error':None,'preserved':False,
        'serverBuildExitCode':None,'syntaxCheckExitCode':None,'nativeProbeExitCode':None,
        'applicationStarted':False,'databaseOperations':0,'installationOperations':0,
        'deploymentOperations':0,'sourceEditOperations':0,'frontendRebuilt':False,
        'executionScope':'esbuild, SDK-only fake-transport probe and copied bcrypt execute with a restricted environment, NOT an OS sandbox',
        'runtimeQualification':'NOT_STARTED','databaseCutover':'NOT_APPLIED'}
    print('CHECKPOINT='+checkpoint+'\nTRACKED_ENTRIES_VERIFIED='+str(len(before['entries'])),flush=True)
    print('NODE='+version+'\nSERVER_SCRIPT=REVIEWED_EXACT_MATCH\nFRONTEND_EVIDENCE=VERIFIED',flush=True)
    print('FRONTEND_FILES_TO_REUSE='+str(len(front['inventory']))+'\nAUDIT_DIR='+str(audit),flush=True)
    code=1;checked_inputs={}
    try:
        report['emailProbeExitCode']=run_logged([node,str(audit/'email-probe.mjs'),str(audit/'config.json')],work,audit,'email-probe.log',30)
        need(report['emailProbeExitCode']==0,'RESEND_OPTIONAL_PROBE_FAILED')
        email_probe=json.loads(plain(audit/'email-result.json'))
        need(tree_inventory(P(sdk['root']))==sdk_inventory,'RESEND_SOURCE_CHANGED_DURING_PROBE')
        print('EMAIL_CALLER_SOURCES=REVIEWED_EXACT_MATCH\nRESEND_OPTIONAL_PROBE=10_OF_10\nREAL_EMAIL_SENT=NO',flush=True)
        report['serverBuildExitCode']=run_logged([node,str(audit/'build-server-private.mjs'),str(audit/'config.json')],work,audit,'server-build.log')
        need(report['serverBuildExitCode']==0,'SERVER_BUNDLE_BUILD_FAILED')
        meta=json.loads(plain(audit/'server-metafile.json'))
        email_exception=review_optional_email(work,meta,before['entries'],sdk,email_probe,email_pins)
        checked=validate_server_meta(work,dist,meta,before['entries'],info['builtins'],email_exception)
        report['optionalEmailCapability']=email_exception
        print('OPTIONAL_EXTERNAL_REVIEW=EXACT_RESEND_DYNAMIC_IMPORT_ONLY',flush=True)
        checked_inputs=checked.pop('inputSha256AfterBuild');report['bundleChecks']=checked
        messages=json.loads(plain(audit/'build-messages.json'))
        report['buildWarningCount']=len(messages.get('warnings',[]));report['warningIds']=dict(collections.Counter(w.get('id','') for w in messages.get('warnings',[])))
        (dist/'client').mkdir(mode=0o700)
        copy_inventory(front['output'],dist/'client/dist',front['inventory'])
        write_new(dist/'schema.canonical.sql',canonical,0o644)
        (dist/'node_modules').mkdir(mode=0o700)
        for name in NATIVE:copy_inventory(P(info['tools'][name]['root']),dist/'node_modules'/name,package_inputs[name])
        # This is an artifact copy, NOT an automatic boot migration.
        (package/'deployment').mkdir(mode=0o700)
        write_new(package/'deployment/refresh-family-v1.sql',sql,0o600)
        write_new(package/'deployment/refresh-family-cutover.md',cutover,0o600)
        report['syntaxCheckExitCode']=run_logged([node,'--check',str(dist/'server.mjs')],package,audit,'syntax.log',30)
        need(report['syntaxCheckExitCode']==0,'SERVER_SYNTAX_CHECK_FAILED')
        report['nativeProbeExitCode']=run_logged([node,str(audit/'native-probe.cjs'),str(audit/'config.json')],package,audit,'native-probe.log',30)
        need(report['nativeProbeExitCode']==0,'COPIED_NATIVE_BCRYPT_CHECK_FAILED')
        native=json.loads(plain(audit/'native-result.json'))
        need(native.get('passed') is True and native.get('nativeFiles'),'NATIVE_TEST_REPORT_INCOMPLETE')
        report['native']=native
        need(tree_inventory(dist/'client/dist')==front['inventory'],'PACKAGED_FRONTEND_CHANGED')
        for name in NATIVE:need(tree_inventory(dist/'node_modules'/name)==package_inputs[name],'PACKAGED_NATIVE_FILES_CHANGED:'+name)
        need(plain(dist/'schema.canonical.sql')==canonical and plain(package/'deployment/refresh-family-v1.sql')==sql,
             'PACKAGED_SQL_CHANGED')
        report['packagedFiles']=tree_inventory(package)
        manifest={
            'schema':'MMHB_PRIVATE_RELEASE_ARTIFACT_MANIFEST_V1','checkpoint':checkpoint,
            'frontendReportSha256':front['reportSha256'],'frontendHtmlSha256':front['inventory']['index.html']['sha256'],
            'node':version,'platform':info['platform'],'arch':info['arch'],'nodeModuleAbi':info['modules'],
            'lockfileSha256':digest(plain(work/'package-lock.json')),'files':report['packagedFiles'],
            'externalImports':checked['externalImports'],'optionalEmailCapability':email_exception,
            'status':'PACKAGING_ONLY_NOT_RELEASE_APPROVED','databaseCutover':'NOT_APPLIED',
            'publicConfiguration':'FRONTEND_BUILD_USED_NO_DEPLOYMENT_VITE_VALUES',
            'notProven':['Full application startup','Target deployment native compatibility','Dynamic runtime assets',
                'Optional-native fallback behavior','Browser and HTTP routes','Live database cutover','Full npm test',
                'Email delivery and application email error handling','MMHB-only email branding and content review']}
        write_new(package/'release-manifest.json',(json.dumps(manifest,indent=2)+'\n').encode())
        report['manifestSha256']=digest(plain(package/'release-manifest.json'))
        code=0
    except (Exception,KeyboardInterrupt) as exc:
        report['error']=str(exc) if isinstance(exc,Stop) else type(exc).__name__
    finally:
        try:
            need(snapshot(root,work,store,checkpoint,parent,ref,base)==before,'TRACKED_SOURCE_OR_METADATA_CHANGED')
            need(tree_inventory(P(sdk['root']))==sdk_inventory,'RESEND_SOURCE_CHANGED')
            need(digest(plain(frontend_audit/'result.json',64*1024*1024))==front['reportSha256'] and
                 tree_inventory(front['output'])==front['inventory'],'SUCCESSFUL_FRONTEND_CHANGED')
            for name,inv in package_inputs.items():
                need(tree_inventory(P(info['tools'][name]['root']))==inv,'INSTALLED_PACKAGE_CHANGED:'+name)
            for name,inv in old_outputs.items():need(tree_inventory(P(name),True,True)==inv,'EXISTING_DIST_CHANGED:'+name)
            for name,h in checked_inputs.items():need(digest(plain(P(name)))==h,'OBSERVED_BUNDLED_INPUT_CHANGED')
            report['preserved']=True
        except Exception as exc:
            code=1;report['error']=(report['error'] or '')+';POSTCHECK:'+(str(exc) if isinstance(exc,Stop) else type(exc).__name__)
        report['status']='PRIVATE_SERVER_PACKAGE_PASS_NOT_RELEASE' if code==0 else 'PRIVATE_SERVER_PACKAGE_NOT_PASSED'
        write_new(audit/'result.json',(json.dumps(report,indent=2)+'\n').encode())
        print('SERVER_BUILD_EXIT_CODE='+str(report['serverBuildExitCode']),flush=True)
        if not code:
            print('SERVER_SYNTAX=PASS\nFRESH_FRONTEND_COPY=BYTE_IDENTICAL\nCOPIED_BCRYPT_HASH_COMPARE=PASS',flush=True)
            print('SERVER_BUILD_WARNINGS='+str(report['buildWarningCount']),flush=True)
            print('EXTERNAL_IMPORTS='+json.dumps(report['bundleChecks']['externalImports']),flush=True)
            print('RELEASE_MANIFEST='+str(package/'release-manifest.json')+'\nMANIFEST_SHA256='+report['manifestSha256'],flush=True)
        else:print('ERROR='+str(report['error'])+'\nBUILD_MESSAGES=RETAINED_IN_PRIVATE_LOGS',flush=True)
        print('RESULTS_FILE='+str(audit/'result.json')+'\nFULL_LOG='+str(audit/'server-build.log')+
              '\nNATIVE_LOG='+str(audit/'native-probe.log')+'\nPRIVATE_PACKAGE='+str(package),flush=True)
        print('SOURCE_METADATA_EXISTING_ARTIFACTS_AND_CHECKED_DEPENDENCIES_UNCHANGED='+('YES' if report['preserved'] else 'NO'),flush=True)
        print('REACT_EMAIL_RENDERING=NOT_SHIPPED\nEMAIL_DELIVERY=NOT_TESTED\nAPPLICATION_SOURCE_EDITS=NO\nFRONTEND_REBUILD=NO\nMMHB_APPLICATION_START=NO\nDATABASE_OPERATIONS=NO\nINSTALL=NO\nFULL_NPM_TEST=NOT_RUN\nDATABASE_CUTOVER=NOT_APPLIED\nBROWSER_RENDERING=NOT_TESTED\nPUSH=NO\nDEPLOY=NO',flush=True)
        print('STATUS='+report['status'],flush=True)
    return report,code

if __name__=='__main__':
    os.umask(0o077)
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--package',action='store_true')
    args=ap.parse_args();print('COMMAND=MMHB_SERVER_PACKAGE_CANDIDATE_V2',flush=True)
    if not args.package:print('ACTION_REQUIRED=--package');sys.exit(0)
    try:
        _,code=execute();sys.exit(code)
    except (Exception,KeyboardInterrupt) as exc:
        print('STOP='+(str(exc) if isinstance(exc,Stop) else type(exc).__name__),flush=True)
        print('STATUS=SERVER_PACKAGE_PREFLIGHT_OR_RUN_STOPPED',flush=True);sys.exit(1)
