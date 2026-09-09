"""R18 genuine-Git integration fixtures, with actual reviewed dependency bytes.

No compiler or package-manager stand-in is needed. Handwritten esbuild-format
records describe a tiny inert bundle and retained source fixture. Production
logic is unchanged except fixture root/HEAD/Node/pin/observed artifact constants
and the GRAPH helper's root-path regex. Historical compiler temp is absent.
The node preload records/rejects child, transport and external write attempts;
only read-only Git is allowed. Existing bytes/modes are compared after every run.
"""
from pathlib import Path
import base64
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile

HERE = Path(__file__).resolve().parent
NODE = shutil.which('node')
VERSION = subprocess.check_output([NODE, '--version'], text=True).strip()
SECRET = 'MMHB_FIXTURE_SECRET_VALUE_DO_NOT_PRINT_18'
DRIVER_SOURCE = (HERE / 'runtime-contract-driver-r18.mjs').read_text()
RESULTS = []

def sha(value): return hashlib.sha256(value).hexdigest()
def compact(value): return json.dumps(value, separators=(',', ':'), ensure_ascii=False)
def write(base, name, content):
    file = base / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_bytes(content if isinstance(content, bytes) else content.encode())
    file.chmod(0o600)
    return file

def git(root, *args):
    return subprocess.check_output(['git', '-c', 'core.fsmonitor=false', '-c', 'core.untrackedCache=false', *args], cwd=root,
        env={**os.environ, 'GIT_CONFIG_NOSYSTEM':'1', 'GIT_CONFIG_GLOBAL':'/dev/null', 'GIT_OPTIONAL_LOCKS':'0'}, text=True).strip()

def declaration(source, name):
    match = re.search(r'const '+name+r'\s*=\s*', source)
    assert match, name
    return json.JSONDecoder().raw_decode(source[match.end():])[0]

def replace_const(source, name, value):
    result, count = re.subn(r'const '+name+r'\s*=\s*[^;]+;', lambda _: 'const '+name+' = '+compact(value)+';', source, count=1)
    assert count == 1, name
    return result

def row(root, file):
    p = root / file
    if p.is_symlink():
        link=os.readlink(p); target=p.resolve(); raw=target.read_bytes()
        return {'file':file,'type':'symlink','link':link,'mode':p.lstat().st_mode,'bytes':len(link.encode()),
            'linkSha256':sha(link.encode()),'target':str(target.relative_to(root)),'targetSha256':sha(raw),'targetBytes':len(raw)}
    return {'file':file,'type':'file','sha256':sha(p.read_bytes()),'bytes':p.stat().st_size,'mode':p.stat().st_mode}

def tree(root):
    rows = []
    def walk(base):
        for file in sorted(base.iterdir()):
            if file.is_dir() and not file.is_symlink(): walk(file)
            else: rows.append(row(root, str(file.relative_to(root))))
    walk(root)
    return {'rows':rows,'bytes':sum(r.get('bytes',0) for r in rows),'manifestSha256':sha(compact(rows).encode())}

def inventory(rows):
    return {'rows':rows,'bytes':sum(r.get('bytes',0) for r in rows),'manifestSha256':sha(compact(rows).encode())}

def original_files(root):
    return {str(p.relative_to(root)):('symlink',os.readlink(p),p.lstat().st_mode) if p.is_symlink()
        else ('file',sha(p.read_bytes()),p.stat().st_mode)
        for p in root.rglob('*') if p.is_file() or p.is_symlink()}

def seed(tmp, source):
    root = tmp / 'workspace'; root.mkdir()
    git(root, 'init', '-q', '-b', 'integration')
    git(root, 'config', 'user.email', 'fixture@example.invalid')
    git(root, 'config', 'user.name', 'MMHB Fixture')
    evidence = root / '.mmhb-release-evidence'; evidence.mkdir(mode=0o700)
    write(evidence, '.gitignore', '*\n')
    prior = evidence / 'r17b-q6rzGy'; prior.mkdir()
    retained = prior / 'build-input'; retained.mkdir()
    candidate = prior / 'candidate'; candidate.mkdir()
    reviews = declaration(source, 'SOURCE_REVIEWS')
    files_by_hash = {sha(p.read_bytes()):p for p in HERE.iterdir() if p.is_file()}
    source_names = ['server/app.mjs', 'server/routes/auth.mjs']
    for review in reviews:
        assert review['sha256'] in files_by_hash, review
        raw = files_by_hash[review['sha256']].read_bytes()
        write(retained, review['file'], raw)
        if not review['file'].startswith('node_modules/'):
            write(root, review['file'], raw)
            source_names.append(review['file'])
    inert = 'throw new Error('+compact(SECRET)+');\n'
    for file in ['server/app.mjs','server/routes/auth.mjs']:
        write(root,file,inert); write(retained,file,inert)
    write(root,'user-work.txt','UNRELATED_PREEXISTING_USER_WORK\n')
    packages = {'ws':'8.21.0','pg':'8.23.0','resend':'6.22.1','bcrypt':'6.0.0','node-gyp-build':'4.8.4'}
    lock_packages = {'':{'name':'mmhb-fixture','version':'1.0.0'}}
    for name, version in packages.items():
        value = {'name':name,'version':version}
        write(retained,'node_modules/'+name+'/package.json',compact(value))
        lock_packages['node_modules/'+name] = {**value,'resolved':'https://registry.npmjs.org/'+name+'/-/'+name+'-'+version+'.tgz',
            'integrity':'sha512-'+base64.b64encode(b'x'*64).decode()}
    package = compact({'name':'mmhb-fixture','version':'1.0.0','type':'module'})
    lock = compact({'name':'mmhb-fixture','version':'1.0.0','lockfileVersion':3,'packages':lock_packages})
    for file, contents in [('package.json',package),('package-lock.json',lock)]:
        write(root,file,contents); write(retained,file,contents)
    # Real .bin link metadata exists in the retained full inventory. It is never
    # an executable compiler input and must not invalidate the file-only graph.
    write(retained,'node_modules/node-gyp-build/bin.js',inert)
    (retained/'node_modules/.bin').mkdir()
    (retained/'node_modules/.bin/node-gyp-build').symlink_to('../node-gyp-build/bin.js')
    server = inert + '// '+('INERT_BUNDLE_PADDING_'*70)+'\n'
    write(candidate,'server.mjs',server); write(prior,'server-build/server.mjs',server)
    write(candidate,'client/dist/index.html','<div>Fixture</div>\n')
    write(prior,'fresh-candidate-evidence.json',compact({'project':'MyMentalHealthBuddy','status':'FRESH_CANDIDATE_FAILED',
        'failure':{'gate':'WORKTREE_PRESERVATION'}}))
    reviewed = declaration(source,'REVIEWED_ADDITIONS')
    historical = [{'file':r['file'],'kind':'ADDED_TO_OBSERVED_SET','before':{'state':'NOT_IN_OBSERVED_SET'},
        'after':{'state':'FILE','sha256':r['sha256'],'bytes':r['bytes'],'mode':33152},
        'scope':{'pinned':False,'inRecordedSourceCopy':False},'current':{'matchesAfter':True}} for r in reviewed]
    write(evidence,'r17c-tn3PWG/preservation-diagnostic-evidence.json',compact({'project':'MyMentalHealthBuddy',
        'status':'PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED','issues':[],
        'historicalRunStatus':'FRESH_CANDIDATE_FAILED','diagnosticPreservation':{'changedFileCount':0},
        'historicalChanges':{'components':['worktree','files'],'changedFileCount':42,'changes':historical}}))
    write(prior,'public-config.json',compact({'names':['VITE_PUBLIC_TEST'],'valuesReadOrForwarded':0}))
    source_names = sorted(set(source_names))
    graph_files = sorted(set(['server/app.mjs']+[r['file'] for r in reviews]))
    def refresh_records():
        source_manifest = inventory([row(retained,name) for name in source_names])
        full = tree(retained)
        full.update(directory=str(retained),sourceManifestSha256=source_manifest['manifestSha256'],
            compilerWorkingDirectory='/tmp/mmhb-build-r17b-Fixt18')
        write(prior,'source-manifest.json',compact(source_manifest))
        write(prior,'build-input-manifest.json',compact(full))
        edges = {'node_modules/ws/lib/buffer-util.js':['bufferutil'], 'node_modules/ws/lib/validation.js':['utf-8-validate'],
            'node_modules/pg/lib/stream.js':['net','tls','pg-cloudflare'], 'node_modules/pg/lib/native/client.js':['pg-native'],
            'node_modules/resend/dist/index.mjs':['@react-email/render']}
        inputs = {name:{'bytes':(retained/name).stat().st_size,'imports':[
            {'path':spec,'kind':'require-call','external':True} for spec in edges.get(name,[])],
            'format':'esm' if name.endswith('.mjs') else 'cjs'} for name in graph_files}
        inputs['server/app.mjs']['imports'] = [{'path':name,'kind':'import-statement'} for name in graph_files if name != 'server/app.mjs']
        imports = sorted(set(spec for specs in edges.values() for spec in specs))
        meta = {'inputs':inputs,'outputs':{str(prior/'server-build/server.mjs'):{'bytes':len(server.encode()),
            'imports':[{'path':spec,'kind':'require-call','external':True} for spec in imports],
            'exports':[],'entryPoint':'server/app.mjs','inputs':{name:{'bytesInOutput':1} for name in graph_files}}}}
        for name in ['meta-1.json','meta-2.json']: write(prior,'server-build/'+name,compact(meta))
        return meta
    initial_meta=refresh_records()
    prior_receipt=json.loads((prior/'fresh-candidate-evidence.json').read_text())
    prior_receipt['server']={'inputCount':len(initial_meta['inputs']),
        'externalImports':[r['path'] for r in next(iter(initial_meta['outputs'].values()))['imports']]}
    write(prior,'fresh-candidate-evidence.json',compact(prior_receipt))
    manifest = tree(candidate); write(prior,'candidate-manifest.json',compact(manifest))
    git(root,'add','--all'); git(root,'commit','-q','-m','Fixture baseline')
    pins = {name:sha((root/name).read_bytes()) for name in ['package.json','package-lock.json','server/routes/auth.mjs']}
    assets = {}
    for name,value in [('EXPECTED_ROOT',str(root)),('EXPECTED_HEAD',git(root,'rev-parse','HEAD')),
        ('EXPECTED_NODE',VERSION),('OBSERVED_SERVER_SHA',sha(server.encode())),('OBSERVED_CANDIDATE_SHA',manifest['manifestSha256']),
        ('PINS',pins),('ASSET_PINS',assets)]:
        source = replace_const(source,name,value)
    helpers = declaration(source,'HELPERS')
    graph = base64.b64decode(helpers['GRAPH']['b64']).decode()
    original = r'^\/home\/runner\/workspace\/\.mmhb-release-evidence\/r17b-'
    replacement = '^'+re.escape(str(root)).replace('/','\\/')+r'\/\.mmhb-release-evidence\/r17b-'
    assert original in graph
    graph = graph.replace(original,replacement)
    helpers['GRAPH'] = {'sha256':sha(graph.encode()),'b64':base64.b64encode(graph.encode()).decode()}
    source = replace_const(source,'HELPERS',helpers)
    return root, prior, retained, candidate, source, refresh_records

def preload(tmp, root, mode):
    trace = tmp/'operation-trace.jsonl'
    src = """import cp from 'node:child_process';import fs from 'node:fs';import net from 'node:net';
import tls from 'node:tls';import dns from 'node:dns';import {syncBuiltinESMExports} from 'node:module';
const trace=__TRACE__,root=__ROOT__,mode=__MODE__,original=cp.execFileSync,write=fs.writeFileSync;
const log=v=>{const fd=fs.openSync(trace,'a');try{fs.writeSync(fd,JSON.stringify(v)+'\\n');}finally{fs.closeSync(fd);}};let observations=0;
for(const name of ['spawn','spawnSync','exec','execSync','execFile','fork'])cp[name]=()=>{log({kind:'child',allowed:false});throw Error('UNEXPECTED_CHILD_PROCESS');};
cp.execFileSync=(file,args,options)=>{
 if(args.includes('--cached')&&args.includes('--others')&&++observations===2&&mode==='concurrent_change')
   write(root+'/user-work.txt','TEST_PRELOAD_CONCURRENT_USER_EDIT');
 let i=0;while(args[i]==='-c')i+=2;const command=args[i];
 const allowed=String(file).endsWith('/git')&&['rev-parse','branch','ls-files','check-ignore'].includes(command)
   &&(command!=='branch'||args[i+1]==='--show-current');log({kind:'child',command,allowed});
 if(!allowed)throw Error('UNEXPECTED_CHILD_PROCESS');return original(file,args,options);
};
const transport=()=>{log({kind:'transport',allowed:false});throw Error('UNEXPECTED_REAL_TRANSPORT');};
globalThis.fetch=transport;net.connect=transport;net.createConnection=transport;net.Socket.prototype.connect=transport;
tls.connect=transport;dns.lookup=transport;dns.resolve=transport;
fs.writeFileSync=(file,...args)=>{
 const target=String(file),allowed=target.startsWith(root+'/.mmhb-release-evidence/r18-');
 log({kind:'write',allowed});if(!allowed)throw Error('UNEXPECTED_WRITE');
 if(mode==='evidence_write_failure'&&target.endsWith('/runtime-contract-evidence.json')){
   const e=new Error('DO_NOT_PRINT_INTERNAL_ERROR');e.code='EACCES';throw e;
 }return write(file,...args);
};syncBuiltinESMExports();
""".replace('__TRACE__',compact(str(trace))).replace('__ROOT__',compact(str(root))).replace('__MODE__',compact(mode))
    return write(tmp,'operation-guard.mjs',src), trace

def run(mode):
    with tempfile.TemporaryDirectory(prefix='mmhb-r18-driver-fixture-') as name:
        tmp=Path(name)
        source=DRIVER_SOURCE
        root,prior,retained,candidate,source,refresh=seed(tmp,source)
        if mode=='candidate_tamper': write(candidate,'server.mjs','CHANGED_CANDIDATE')
        elif mode=='source_tamper': write(root,'server/app.mjs','PRESERVE_USER_EDIT')
        elif mode=='pin_tamper': write(root,'server/routes/auth.mjs','PRESERVE_AUTH_EDIT')
        elif mode=='dependency_tamper': write(retained,'node_modules/ws/lib/buffer-util.js','CHANGED_DEPENDENCY')
        elif mode=='unknown_source_hash':
            write(retained,'node_modules/ws/lib/buffer-util.js','throw Error('+compact(SECRET)+');\n');refresh()
        elif mode=='unknown_resend_hash':
            write(retained,'node_modules/resend/dist/index.cjs','throw Error('+compact(SECRET)+');\n');refresh()
        elif mode=='malformed_output':
            file=prior/'server-build/meta-2.json';value=json.loads(file.read_text());out=next(iter(value['outputs'].values()))
            out['imports'].append({'path':'https://example.invalid/'+SECRET,'kind':'dynamic-import','external':True})
            file.write_text(compact(value))
        elif mode=='history_mismatch':
            file=root/'.mmhb-release-evidence/r17c-tn3PWG/preservation-diagnostic-evidence.json';value=json.loads(file.read_text())
            value['historicalChanges']['changes'][0]['after']['sha256']='0'*64;file.write_text(compact(value))
        script=write(tmp,'driver.mjs',source)
        guard,trace=preload(tmp,root,mode)
        before=original_files(root)
        env={**os.environ,'OPENAI_API_KEY':SECRET,'DATABASE_URL':SECRET,'RESEND_API_KEY':SECRET,
            'VITE_PUBLIC_TEST':SECRET,'NODE_PG_FORCE_NATIVE':SECRET,'WS_NO_BUFFER_UTIL':SECRET,
            'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1'}
        env.pop('NODE_PATH',None); env.pop('NODE_V8_COVERAGE',None)
        result=subprocess.run([NODE,'--experimental-vm-modules','--import',str(guard),str(script)],cwd=root,
            env=env,capture_output=True,text=True,timeout=30)
        assert SECRET not in result.stdout+result.stderr,(mode,result.stdout,result.stderr)
        start=result.stdout.index('{\n  "project":')
        evidence=json.JSONDecoder().raw_decode(result.stdout[start:])[0]
        assert trace.exists(), (mode, result.stdout, result.stderr)
        operations=[json.loads(line) for line in trace.read_text().splitlines()]
        assert operations and all(row['allowed'] for row in operations), (mode,operations)
        assert not any(row['kind']=='transport' for row in operations),mode
        assert not Path('/tmp/mmhb-build-r17b-Fixt18').exists(),'Historical compiler temp must stay absent'
        after=original_files(root)
        expected_changed=['user-work.txt'] if mode=='concurrent_change' else []
        changed=[file for file,value in before.items() if after.get(file)!=value]
        assert changed==expected_changed,(mode,changed)
        new_files=set(after)-set(before)
        assert all(re.fullmatch(r'\.mmhb-release-evidence/r18-[A-Za-z0-9]{6}/[^/]+\.json',file) for file in new_files),(mode,new_files)
        assert evidence['releaseReady'] is False and evidence['applicationRuntime']=='UNPROVEN' and evidence['deployedArtifact']=='UNPROVEN'
        assert evidence['historicalR17BStatus']=='FRESH_CANDIDATE_FAILED'
        if mode in ['success_absent_tmp','unknown_source_hash','unknown_resend_hash']:
            assert result.returncode==0,(mode,evidence,result.stderr)
            assert evidence['preservation']['changedFileCount']==0
            if mode=='success_absent_tmp':
                assert evidence['status']=='RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE',evidence
                assert evidence['helperSmokes']['checkCount']==11
                assert evidence['resendSmoke']['caseCount']==20
                assert evidence['resendSmoke']['forbiddenFetchAttempts']==0
            elif mode=='unknown_source_hash':
                assert evidence['status']=='RUNTIME_CONTRACT_REVIEW_REQUIRED'
                assert evidence['helperSmokes']['status']=='NOT_RUN_UNREVIEWED_BYTES'
            else:
                assert evidence['status']=='RUNTIME_CONTRACT_REVIEW_REQUIRED'
                assert evidence['resendSmoke']['status']=='NOT_RUN_UNREVIEWED_DISTRIBUTION'
        else:
            expected={'candidate_tamper':'CANDIDATE_DRIFT','source_tamper':'RETAINED_INPUT_CHANGED',
                'pin_tamper':'PIN_DRIFT','dependency_tamper':'RETAINED_INPUT_CHANGED','malformed_output':'RUNTIME_EXTERNAL_SPECIFIER',
                'history_mismatch':'R17C_CHANGE_REVIEW_MISMATCH','concurrent_change':'WORKTREE_CHANGED','evidence_write_failure':'EACCES'}[mode]
            assert result.returncode==1 and evidence['status']=='RUNTIME_CONTRACT_FAILED',(mode,evidence,result.stderr)
            assert evidence['failure']['gate']==expected,(mode,evidence['failure'])
        if mode=='evidence_write_failure': assert evidence['evidenceWrite']=='FAILED'
        else:
            reports=list((root/'.mmhb-release-evidence').glob('r18-*/runtime-contract-evidence.json'))
            assert len(reports)==1
            saved=json.loads(reports[0].read_text())
            assert saved['status']==evidence['status'] and saved['preservation']==evidence['preservation']
            assert SECRET not in reports[0].read_text()
        item={'case':mode,'status':'PASS','observedStatus':evidence['status'],'existingFilesChecked':len(before),
            'expectedTestHookChanges':expected_changed,'allowedReadOnlyGitCalls':sum(r['kind']=='child' for r in operations),
            'realTransportAttempts':0,'applicationCanaryExecuted':False,'historicalTemporaryCompilerDirectoryPresent':False}
        RESULTS.append(item)
        print(json.dumps(item),flush=True)

if __name__=='__main__':
    for mode in ['success_absent_tmp','candidate_tamper','source_tamper','pin_tamper','dependency_tamper',
        'unknown_source_hash','unknown_resend_hash','malformed_output','history_mismatch','concurrent_change','evidence_write_failure']:
        run(mode)
    final={'status':'PASS','fixtureCount':len(RESULTS),'node':VERSION,'generatedDriverSha256':sha(DRIVER_SOURCE.encode()),'fixtures':RESULTS,
        'scope':'GENUINE_GIT_HANDWRITTEN_RETAINED_EVIDENCE_AND_ACTUAL_REVIEWED_HELPERS_NOT_REAL_MMHB_BUILD_OR_RUNTIME'}
    (HERE/'r18-driver-fixture-results.json').write_text(json.dumps(final,indent=2)+'\n')
    print(json.dumps({'status':'PASS','fixtureCount':len(RESULTS)}))
