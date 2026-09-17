#!/usr/bin/env python3
"""Stage only the locked React plugin in MMHB candidate-local node_modules.
No npm invocation, dependency scripts, application import, build, or DB operation.
The public registry archive is checked against the committed SHA-512 integrity.
Shared workspace node_modules and application source are not replaced.
"""
from __future__ import annotations
import argparse, base64, ctypes, errno, gzip, hashlib, io, json
import os, pathlib, re, shutil, ssl, stat, subprocess, sys, tarfile, tempfile
import time, urllib.request, urllib.error
from urllib.parse import urlsplit, unquote
P = pathlib.Path
ROOT = P('/home/runner/workspace')
WORK = ROOT / '.local/mmhb-candidates/a4-63ff8372'
STORE = ROOT / '.git/mmhb-a4-backup-lcyKVK/recheck-7g_es8ex/restore.git'
CHECKPOINT = 'e23ee835f21198157b7aad4c248f768633814903'
PARENT = 'cb2e164a8fc19e7fab3a539a9facb4b4b562eaca'
FIX_REF = 'refs/mmhb-fixes/refresh-family-source-v1-da2a00f34c197fc9'
BASE = '63ff8372d07368a5434c11ff58bdf87bb468449d'
NAME = '@vitejs/plugin-react'
VERSION = '6.1.0'
TOOLS = ('vite', NAME, 'rollup-plugin-visualizer', '@tailwindcss/postcss', 'autoprefixer')
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 512 * 1024 * 1024
MAX_OUTPUT = 1024 * 1024
ARCHIVE_LIMIT = 8 * 1024 * 1024
UNPACK_LIMIT = 32 * 1024 * 1024
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

RESOLVE = r'''
const fs=require('node:fs'),path=require('node:path');
const requests=JSON.parse(process.argv[1]),out=[];
for(const [name,base] of requests){
 try{
  const entry=fs.realpathSync(require.resolve(name,{paths:[base]}));
  let d=path.dirname(entry),found;
  while(true){
   const f=path.join(d,'package.json');
   if(fs.existsSync(f)){
    const m=fs.realpathSync(f), st=fs.statSync(m);
    if(!st.isFile()||st.size>1048576)throw Error('MANIFEST_BUDGET');
    const p=JSON.parse(fs.readFileSync(m,'utf8'));
    if(p.name===name){found={name,version:p.version,entry,manifest:m,base,dependencies:p.dependencies||{},optionalDependencies:p.optionalDependencies||{}};break;}
   }
   if(d===path.dirname(d))break;d=path.dirname(d);
  }
  if(!found)throw Error('MANIFEST_NOT_FOUND');out.push(found);
 }catch(e){out.push({name,base,error:e.code||'METADATA_UNAVAILABLE'});}
}
console.log(JSON.stringify(out));
'''

def resolve_packages(node, requests, cwd):
    return json.loads(run([node,'--input-type=commonjs','-e',RESOLVE,json.dumps(requests)],cwd))

def directory_plain(p):
    need(p.is_dir() and not p.is_symlink() and p.resolve()==p,'DEPENDENCY_DIRECTORY_MISSING_OR_SYMLINK:'+str(p))

def safe_parents(work,target,create=False):
    directory_plain(work)
    cur=work
    for part in target.parent.relative_to(work).parts:
        cur=cur/part
        if not os.path.lexists(cur):
            if create:cur.mkdir(mode=0o755)
            else:continue
        if os.path.lexists(cur):directory_plain(cur)
    need(not target.is_symlink(),'EXISTING_PLUGIN_SYMLINK_REFUSED')

def tree_bytes(p):
    directory_plain(p)
    result={};total=0
    for here,dirs,files in os.walk(p,followlinks=False):
        for n in dirs:directory_plain(P(here)/n)
        for n in files:
            f=P(here)/n; st=f.lstat()
            need(stat.S_ISREG(st.st_mode) and st.st_nlink==1,'UNSAFE_PACKAGE_FILE:'+str(f))
            b=plain(f,UNPACK_LIMIT);total+=len(b)
            need(total<=UNPACK_LIMIT and len(result)<2000,'PACKAGE_TREE_BUDGET')
            result[f.relative_to(p).as_posix()]=(b,0o755 if st.st_mode&0o111 else 0o644)
    return result

def signature(files):
    return {name:{'sha256':digest(b),'mode':mode} for name,(b,mode) in sorted(files.items())}

def validated_url(url):
    need(isinstance(url,str),'LOCK_ARCHIVE_URL_MISSING')
    u=urlsplit(url)
    need(u.scheme=='https' and u.hostname=='registry.npmjs.org' and
         u.port in (None,443) and not u.username and not u.password and
         not u.query and not u.fragment and
         unquote(u.path)=='/@vitejs/plugin-react/-/plugin-react-6.1.0.tgz',
         'UNAPPROVED_LOCK_ARCHIVE_URL')
    return url

def expected_integrity(value):
    need(isinstance(value,str) and re.fullmatch(r'sha512-[A-Za-z0-9+/]+={0,2}',value) is not None,'SHA512_LOCK_INTEGRITY_REQUIRED')
    try:raw=base64.b64decode(value[7:],validate=True)
    except Exception:raise Stop('INVALID_LOCK_INTEGRITY')
    need(len(raw)==64,'INVALID_LOCK_INTEGRITY')
    return raw

def verified_archive(raw,integrity):
    need(0<len(raw)<=ARCHIVE_LIMIT,'ARCHIVE_SIZE_LIMIT')
    need(hashlib.sha512(raw).digest()==expected_integrity(integrity),'ARCHIVE_INTEGRITY_MISMATCH')
    return raw

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):raise Stop('REGISTRY_REDIRECT_REFUSED')

def download(url):
    validated_url(url)
    # Default certificate validation stays on. Proxy/auth/cookie handlers and
    # npm configuration are deliberately not used for this public GET.
    opener=urllib.request.build_opener(urllib.request.ProxyHandler({}),NoRedirect(),
        urllib.request.HTTPSHandler(context=ssl.create_default_context()))
    req=urllib.request.Request(url,headers={'User-Agent':'MMHB-Locked-Package-Stage/1','Accept-Encoding':'identity'},method='GET')
    start=time.monotonic(); chunks=[];count=0
    try:
        with opener.open(req,timeout=20) as r:
            need(r.status==200 and r.geturl()==url,'UNEXPECTED_REGISTRY_RESPONSE')
            while True:
                b=r.read(min(65536,ARCHIVE_LIMIT+1-count))
                if not b:break
                count+=len(b);need(count<=ARCHIVE_LIMIT,'ARCHIVE_SIZE_LIMIT')
                need(time.monotonic()-start<60,'ARCHIVE_DOWNLOAD_TIME_LIMIT')
                chunks.append(b)
    except urllib.error.HTTPError as e:raise Stop('REGISTRY_HTTP_'+str(e.code)) from None
    except urllib.error.URLError:raise Stop('REGISTRY_DOWNLOAD_FAILED_NO_TLS_BYPASS') from None
    return b''.join(chunks)

def inspect_archive(raw,record):
    # Bounded decompression first; never call tar.extract or extractall.
    with gzip.GzipFile(fileobj=io.BytesIO(raw)) as z:
        inflated=z.read(UNPACK_LIMIT+1)
    need(len(inflated)<=UNPACK_LIMIT,'ARCHIVE_UNPACK_LIMIT')
    files={};seen=set();total=0
    with tarfile.open(fileobj=io.BytesIO(inflated),mode='r:') as tar:
        for member in tar:
            name=member.name.rstrip('/') if member.isdir() else member.name
            need(len(seen)<2000 and len(name)<1024 and not any(ord(c)<32 or ord(c)==127 for c in name), 'ARCHIVE_PATH_BUDGET')
            need('\\' not in name and not name.startswith('/') and
                all(x not in ('','.','..') for x in name.split('/')),'ARCHIVE_UNSAFE_PATH')
            parts=name.split('/')
            need(parts[0]=='package' and name not in seen,'ARCHIVE_ROOT_OR_DUPLICATE');seen.add(name)
            need(member.isfile() or member.isdir(),'ARCHIVE_LINK_OR_SPECIAL_FILE')
            if member.isdir():continue
            need(len(parts)>1 and not any(x in ('.git','.npmrc','node_modules','npm-shrinkwrap.json','package-lock.json') for x in parts[1:]),'ARCHIVE_UNEXPECTED_PACKAGE_CONTENT')
            need(0<=member.size<=8*1024*1024,'ARCHIVE_MEMBER_SIZE');total+=member.size
            need(total<=UNPACK_LIMIT,'ARCHIVE_UNPACK_LIMIT')
            f=tar.extractfile(member);need(f is not None,'ARCHIVE_UNREADABLE_MEMBER')
            b=f.read(member.size+1);need(len(b)==member.size,'ARCHIVE_MEMBER_SIZE_MISMATCH')
            rel='/'.join(parts[1:]);files[rel]=(b,0o755 if member.mode&0o111 else 0o644)
    need('package.json' in files and 'dist/index.js' in files,'PLUGIN_ENTRY_MISSING')
    for name in files:
        need(not any('/'.join(name.split('/')[:i]) in files for i in range(1,len(name.split('/')))),'ARCHIVE_FILE_DIRECTORY_COLLISION')
    p=json.loads(files['package.json'][0])
    need(p.get('name')==NAME and p.get('version')==VERSION,'PACKAGE_IDENTITY_DIFFERS')
    need(p.get('type')=='module' and p.get('exports',{}).get('.')=='./dist/index.js','PACKAGE_EXPORT_REVIEW_REQUIRED')
    need(not p.get('bin') and not p.get('bundleDependencies') and not p.get('bundledDependencies'),'PACKAGE_INSTALL_REVIEW_REQUIRED')
    scripts=p.get('scripts',{})
    need(isinstance(scripts,dict) and not any(k in scripts for k in ('preinstall','install','postinstall','prepare')),'PACKAGE_LIFECYCLE_REVIEW_REQUIRED')
    for field in ('dependencies','optionalDependencies','peerDependencies','peerDependenciesMeta'):
        need((p.get(field) or {})==(record.get(field) or {}),'PACKAGE_LOCK_METADATA_DIFFERS:'+field)
    # This operation is deliberately limited to the reviewed plugin dependency.
    need(p.get('dependencies')=={'@rolldown/pluginutils':'^1.0.1'} and not p.get('optionalDependencies'), 'PLUGIN_DEPENDENCY_REVIEW_REQUIRED')
    need(p.get('peerDependencies',{}).get('vite')=='^8.0.0','PLUGIN_VITE_PEER_REVIEW_REQUIRED')
    need(all(k=='vite' or p.get('peerDependenciesMeta',{}).get(k,{}).get('optional') is True for k in p.get('peerDependencies',{})), 'PLUGIN_REQUIRED_PEER_REVIEW_REQUIRED')
    return files,p

def lock_resolve(packages,parent_key,name):
    # npm's package locations follow Node's node_modules ancestor search.
    here=P(parent_key)
    while True:
        if here.name!='node_modules':
            key=(here/'node_modules'/name).as_posix()
            if key in packages:return key,packages[key]
        if str(here)=='.':break
        here=here.parent
    raise Stop('DEPENDENCY_LOCK_ENTRY_MISSING:'+name)

def check_related(node,root,work,lock,manifest,target):
    checked=[]; queue=[('node_modules/'+NAME,str(target),manifest['dependencies'])];seen=set()
    while queue:
        key,location,deps=queue.pop(0)
        need(len(seen)<64,'DEPENDENCY_GRAPH_REVIEW_LIMIT')
        for name in sorted(deps):
            need(re.fullmatch(r'(?:@[a-z0-9._-]+/)?[a-z0-9._-]+',name) is not None,'UNSAFE_DEPENDENCY_NAME')
            expected_key,rec=lock_resolve(lock['packages'],key,name)
            r=resolve_packages(node,[(name,location)],work)[0]
            need(not r.get('error'),'RELATED_DEPENDENCY_MISSING:'+name)
            need(rec.get('version')==r.get('version') and not rec.get('link'),'RELATED_DEPENDENCY_VERSION_DIFFERS:'+name+':expected='+str(rec.get('version'))+':actual='+str(r.get('version')))
            entry=P(r['entry']);mf=P(r['manifest'])
            need(any(entry.is_relative_to(d) and mf.is_relative_to(d) for d in (root/'node_modules',work/'node_modules')),'RELATED_DEPENDENCY_OUTSIDE_WORKSPACE:'+name)
            need((rec.get('dependencies') or {})==r['dependencies'],'RELATED_DEPENDENCY_METADATA_DIFFERS:'+name)
            need(not r['optionalDependencies'],'RELATED_OPTIONAL_DEPENDENCY_REVIEW_REQUIRED:'+name)
            checked.append(r)
            pair=(expected_key,str(mf))
            if pair not in seen:
                seen.add(pair);queue.append((expected_key,str(mf.parent),r['dependencies']))
    return checked

def rename_no_replace(source,target):
    # Linux atomic publication with no replacement, including an empty directory
    # created concurrently by another process. Fail rather than use a weaker move.
    libc=ctypes.CDLL(None,use_errno=True)
    func=getattr(libc,'renameat2',None)
    need(func is not None,'ATOMIC_NO_REPLACE_UNAVAILABLE')
    func.argtypes=[ctypes.c_int,ctypes.c_char_p,ctypes.c_int,ctypes.c_char_p,ctypes.c_uint]
    func.restype=ctypes.c_int
    code=func(-100,os.fsencode(source),-100,os.fsencode(target),1)
    if code!=0:
        err=ctypes.get_errno()
        need(False,'PLUGIN_TARGET_ALREADY_EXISTS' if err==errno.EEXIST else 'ATOMIC_PUBLICATION_FAILED:'+str(err))


def new_file(p,raw,mode=0o600):
    fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL|getattr(os,'O_NOFOLLOW',0),mode)
    with os.fdopen(fd,'wb') as f:f.write(raw);f.flush();os.fsync(f.fileno())

def execute(root=ROOT,work=WORK,store=STORE,checkpoint=CHECKPOINT,parent=PARENT,
            ref=FIX_REF,base=BASE,node_major=24,fetch=download):
    root,work,store=map(P,(root,work,store))
    before=snapshot(root,work,store,checkpoint,parent,ref,base)
    lock=json.loads(plain(work/'package-lock.json'))
    need(lock.get('lockfileVersion')==3,'LOCKFILE_V3_REQUIRED')
    rec=lock.get('packages',{}).get('node_modules/'+NAME)
    need(isinstance(rec,dict) and rec.get('version')==VERSION and not rec.get('link') and not rec.get('hasInstallScript'),'LOCKED_PLUGIN_REVIEW_REQUIRED')
    url=validated_url(rec.get('resolved'));expected_integrity(rec.get('integrity'))
    node=shutil.which('node');need(node,'NODE_MISSING')
    nv=run([node,'--version'],work).decode().strip()
    need(re.fullmatch(fr'v{node_major}\.\d+\.\d+',nv),'NODE_24_REQUIRED_NO_INSTALL')
    target=work/'node_modules'/NAME;safe_parents(work,target)
    need(not target.exists() or target.is_dir(),'EXISTING_PLUGIN_NOT_DIRECTORY')
    need(not any(n.startswith('node_modules/') for n in before['entries']),'TRACKED_NODE_MODULES_REFUSED')
    tools=resolve_packages(node,[(n,str(work)) for n in TOOLS],work)
    watched={}
    for t in tools:
        n=t['name'];need(not t.get('error'),'BUILD_TOOL_METADATA_UNAVAILABLE:'+n)
        expected=lock['packages'].get('node_modules/'+n,{}).get('version')
        print('TOOL='+json.dumps({'name':n,'expected':expected,'actual':t['version']},sort_keys=True),flush=True)
        if n!=NAME:need(t['version']==expected,'ADDITIONAL_BUILD_TOOL_MISMATCH:'+n)
        else:need(t['version'] in ('6.1.0','6.1.1'),'UNEXPECTED_INSTALLED_PLUGIN_VERSION')
        for label in ('entry','manifest'):
            p=P(t[label]);need(any(p.is_relative_to(d) for d in (root/'node_modules',work/'node_modules')),'BUILD_TOOL_OUTSIDE_WORKSPACE:'+n)
            watched[str(p)]=digest(plain(p))
    shared=root/'node_modules'/NAME
    shared_before=signature(tree_bytes(shared))
    for p in (root/'package.json',root/'package-lock.json',root/'node_modules/.package-lock.json',work/'node_modules/.package-lock.json'):
        if os.path.lexists(p):watched[str(p)]=digest(plain(p))
    # Never overwrite a currently visible local plugin. Validate an identical one.
    original_target=signature(tree_bytes(target)) if target.exists() else None
    audit=P(tempfile.mkdtemp(prefix='mmhb-react-plugin-',dir=store));print('AUDIT_DIR='+str(audit),flush=True)
    stage=None;installed=False;network=False;error=None;post=None
    try:
        raw=None
        for p in sorted(store.glob('mmhb-react-plugin-*/package.tgz'),reverse=True)[:50]:
            if p==audit/'package.tgz':continue
            try: raw=verified_archive(plain(p,ARCHIVE_LIMIT),rec['integrity']);break
            except (Stop,OSError):continue
        if raw is None:
            network=True;raw=verified_archive(fetch(url),rec['integrity'])
        new_file(audit/'package.tgz',raw)
        files,manifest=inspect_archive(raw,rec)
        related=check_related(node,root,work,lock,manifest,target)
        for t in related:
            for label in ('entry','manifest'):watched[t[label]]=digest(plain(P(t[label])))
        print('ARCHIVE_SHA512=LOCKFILE_MATCH\nPACKAGE_NAME_VERSION=VERIFIED',flush=True)
        print('RELATED_DEPENDENCY_VERSIONS=LOCKFILE_MATCH\nDEPENDENCY_SCOPE=PLUGIN_REQUIRED_DEPENDENCIES_AND_DIRECT_BUILD_TOOLS',flush=True)
        need(snapshot(root,work,store,checkpoint,parent,ref,base)==before,'SOURCE_CHANGED_BEFORE_STAGING')
        need(signature(tree_bytes(shared))==shared_before,'SHARED_PLUGIN_CHANGED')
        need(all(digest(plain(P(p)))==h for p,h in watched.items()),'OBSERVED_INPUT_CHANGED')
        safe_parents(work,target)
        if target.exists():
            need(signature(tree_bytes(target))==signature(files),'EXISTING_LOCAL_PLUGIN_DIFFERS_NO_OVERWRITE')
            action='ALREADY_EXACT'
        else:
            safe_parents(work,target,create=True)
            stage=P(tempfile.mkdtemp(prefix='.mmhb-react-stage-',dir=target.parent))
            for name,(body,mode) in files.items():
                p=stage/name;p.parent.mkdir(parents=True,exist_ok=True)
                new_file(p,body,mode)
            need(signature(tree_bytes(stage))==signature(files),'STAGED_BYTES_DIFFER')
            need(not os.path.lexists(target),'PLUGIN_APPEARED_DURING_STAGING')
            rename_no_replace(stage,target);stage=None;installed=True;action='STAGED_ONE_PACKAGE'
        result=resolve_packages(node,[(n,str(work)) for n in TOOLS],work)
        for t in result:need(not t.get('error') and t['version']==lock['packages']['node_modules/'+t['name']]['version'],'POSTCHECK_BUILD_TOOL_DIFFERS:'+t['name'])
        plugin=next(x for x in result if x['name']==NAME)
        need(plugin['manifest']==str(target/'package.json') and plugin['entry']==str(target/'dist/index.js'),'PLUGIN_NOT_RESOLVING_CANDIDATE_LOCAL')
        need(signature(tree_bytes(target))==signature(files),'LOCAL_PLUGIN_BYTES_CHANGED')
        need(signature(tree_bytes(shared))==shared_before,'SHARED_PLUGIN_CHANGED')
        # The originally resolved plugin stays where it was; if it was already
        # local, its exact contents must also still match the archive.
        need(all(digest(plain(P(p)))==h for p,h in watched.items()),'OBSERVED_INPUT_CHANGED')
        need(snapshot(root,work,store,checkpoint,parent,ref,base)==before,'TRACKED_SOURCE_OR_METADATA_CHANGED')
        post={'schema':'MMHB_REACT_PLUGIN_ALIGNMENT_V1','checkpoint':checkpoint,'package':NAME,'version':VERSION,
              'destination':str(target),'action':action,'archiveSha256':digest(raw),'integrity':rec['integrity'],
              'lockfileSha256':digest(plain(work/'package-lock.json')),'files':signature(files),
              'tools':result,'relatedDependencies':related,'registryDownload':network,
              'sourceAndCheckedMetadataUnchanged':True,'sharedPluginUnchanged':True,
              'verificationScope':'Archive integrity and contents for plugin; version/entry/manifest checks for dependencies, not full dependency-tree integrity',
              'packageScriptsExecuted':False,'buildRun':False,'databaseOperations':0}
        new_file(audit/'result.json',(json.dumps(post,indent=2)+'\n').encode())
        print('PLUGIN_LOCATION='+str(target)+'\nPLUGIN_VERSION='+VERSION+'\nACTION='+action,flush=True)
        print('FIVE_DIRECT_BUILD_TOOL_VERSIONS=LOCKFILE_MATCH\nSHARED_REACT_PLUGIN=UNCHANGED\nTRACKED_SOURCE_AND_CHECKED_METADATA=UNCHANGED',flush=True)
        print('RESULTS_FILE='+str(audit/'result.json'),flush=True)
        print('REGISTRY_DOWNLOAD='+('ONE_VERIFIED_ARCHIVE' if network else 'REUSED_VERIFIED_LOCAL_ARCHIVE'),flush=True)
        print('APPLICATION_SOURCE_EDITS=NO\nLOCKFILE_EDITS=NO\nPACKAGE_SCRIPTS=NOT_RUN\nNPM_INSTALL=NOT_RUN\nBUILD=NOT_RUN\nAPPLICATION_START=NO\nDATABASE_OPERATIONS=NO\nPUSH=NO\nDEPLOY=NO\nSTATUS=CANDIDATE_REACT_PLUGIN_ALIGNED',flush=True)
        return post
    except BaseException as e:
        error=str(e)
        if not isinstance(e,Stop):error=type(e).__name__
        try:new_file(audit/'stopped.json',(json.dumps({'status':'STOPPED','reason':error,'candidatePackageWasAdded':installed,'registryDownloadAttempted':network})+'\n').encode())
        except OSError:pass
        raise
    finally:
        # Remove only our unpublished staging directory, never an existing plugin.
        if stage and stage.is_dir() and not stage.is_symlink():shutil.rmtree(stage)

if __name__=='__main__':
    os.umask(0o077)
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--stage',action='store_true')
    args=ap.parse_args()
    print('COMMAND=MMHB_REACT_PLUGIN_ALIGN',flush=True)
    if not args.stage:
        print('ACTION_REQUIRED=--stage\nBUILD=NOT_RUN');sys.exit(0)
    try:execute()
    except (Exception,KeyboardInterrupt) as e:
        msg=str(e) if isinstance(e,Stop) else type(e).__name__
        print('STOP='+msg,flush=True);print('STATUS=REACT_PLUGIN_ALIGNMENT_STOPPED',flush=True);sys.exit(1)
