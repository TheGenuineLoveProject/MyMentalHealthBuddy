"""Run the actual R16 driver in disposable inert Git fixtures.

The driver source and embedded helpers are exercised unchanged apart from known
workspace/head/Node/report identities, fixture file pins and candidate sizes.
The existing npm CLI is replaced by an inert fixture CLI reached through the
actual discovery/runner path. It writes a tiny synthetic dependency tree; no npm,
registry fetch, package lifecycle, build, application, AI or database is executed.
Fixture-only fault injection changes actual files at workflow boundaries.
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
DRIVER = HERE / 'locked-dependencies-driver-r16e.mjs'
NODE = shutil.which('node')
NODE_VERSION = subprocess.check_output([NODE, '--version'], text=True).strip()
PREFIX = (HERE / 'locked-dependencies-prefix-r16e.mjs').read_text()
PIN_NAMES = json.loads(re.search(r'const PINS = (\{.*?\n\});', PREFIX, re.S).group(1))
ASSET_NAMES = json.loads(re.search(r'const ASSET_PINS = (\{.*?\n\});', PREFIX, re.S).group(1))
SECRET = 'MMHB_FIXTURE_SECRET_NEVER_PRINT'
UNKNOWN = 'CONCURRENT_UNKNOWN_EDIT_PRESERVE'
COUNT = 0
RESULTS = []


def sha(value):
    return hashlib.sha256(value).hexdigest()


def js(value):
    return json.dumps(value, separators=(',', ':'), ensure_ascii=False)


def write(root, name, value, mode=0o644):
    file = root / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_bytes(value if isinstance(value, bytes) else value.encode())
    file.chmod(mode)
    return file


def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, text=True, stderr=subprocess.DEVNULL).strip()


def snapshot(root):
    result = {}
    for file in sorted(root.rglob('*')):
        rel = file.relative_to(root)
        if '.git' in rel.parts or '.mmhb-release-evidence' in rel.parts:
            continue
        if file.is_symlink():
            result[str(rel)] = ('LINK', os.readlink(file))
        elif file.is_file():
            result[str(rel)] = (sha(file.read_bytes()), file.stat().st_mode)
    return result


STUB_NPM = r'''#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path');
const settings=JSON.parse(fs.readFileSync(path.join(__dirname,'../package.json'),'utf8')).fixture;
const stage=process.cwd(),report=path.dirname(stage);
const receipt={cwd:stage,args:process.argv.slice(2),inheritedSecret:false,entries:fs.readdirSync(stage).sort()};
for(const name of ['DATABASE_URL','OPENAI_API_KEY','NODE_OPTIONS','NODE_ENV','NPM_CONFIG_REGISTRY','NPM_TOKEN','HEAL_AUTO_ENABLED','HOME']){
 if(Object.hasOwn(process.env,name))receipt.inheritedSecret=true;
}
fs.writeFileSync(path.join(report,'fixture-npm-invocation.json'),JSON.stringify(receipt));
const mode=settings.mode;
if(mode==='npm_failure'){
 process.stdout.write('MMHB_FIXTURE_SECRET_NEVER_PRINT stdout\n');
 process.stderr.write('npm error code ERESOLVE\nMMHB_FIXTURE_SECRET_NEVER_PRINT stderr\n');
 process.exit(7);
}
const lock=JSON.parse(fs.readFileSync(path.join(stage,'package-lock.json'),'utf8'));
for(const [relative,meta] of Object.entries(lock.packages)){
 if(!relative)continue;
 if((relative==='node_modules/@tailwindcss/oxide-wasm32-wasi'||relative.startsWith('node_modules/@tailwindcss/oxide-wasm32-wasi/'))&&mode!=='bundle_present')continue;
 const directory=path.join(stage,relative);
 fs.mkdirSync(directory,{recursive:true});
 const parts=relative.split('/node_modules/').pop().replace(/^node_modules\//,'');
 const pkg={name:parts,version:mode==='target_mismatch'&&parts==='@vitejs/plugin-react'?'6.1.1':meta.version};
 if(meta.dependencies)pkg.dependencies=meta.dependencies;
 if(Object.hasOwn(meta,'workspaces'))pkg.workspaces=meta.workspaces;
 if(meta.bin)pkg.bin=meta.bin;
 fs.writeFileSync(path.join(directory,'package.json'),JSON.stringify(pkg));
 fs.writeFileSync(path.join(directory,'index.js'),"throw Error('DEPENDENCY_MUST_NOT_EXECUTE');\n");
 if(meta.bin){
  const bins=typeof meta.bin==='string'?{[parts.replace(/^@[^/]+\//,'')]:meta.bin}:meta.bin;
  for(const [name,target] of Object.entries(bins)){
   const destination=path.join(directory,target);fs.mkdirSync(path.dirname(destination),{recursive:true});
   fs.writeFileSync(destination,"#!/usr/bin/env node\nthrow Error('PACKAGE_BIN_MUST_NOT_EXECUTE');\n");fs.chmodSync(destination,0o755);
   const binDir=path.join(stage,'node_modules/.bin');fs.mkdirSync(binDir,{recursive:true});
   fs.symlinkSync(path.relative(binDir,destination),path.join(binDir,name));
  }
 }
}
const hidden={name:lock.name,version:lock.version,lockfileVersion:3,requires:true,packages:{...lock.packages}};
delete hidden.packages[''];
fs.writeFileSync(path.join(stage,'node_modules/.package-lock.json'),JSON.stringify(hidden));
if(mode==='stage_lock_drift')fs.appendFileSync(path.join(stage,'package-lock.json'),'\n');
if(mode==='workspace_drift')fs.writeFileSync(path.join(settings.root,'untracked.txt'),'CONCURRENT_UNKNOWN_EDIT_PRESERVE');
if(mode==='asset_drift')fs.writeFileSync(path.join(settings.root,settings.asset),'CONCURRENT_UNKNOWN_EDIT_PRESERVE');
if(mode==='prior_appears')fs.mkdirSync(settings.prior);
if(mode==='retained_drift')fs.writeFileSync(path.join(settings.prior,'candidate/server.mjs'),'CONCURRENT_UNKNOWN_EDIT_PRESERVE');
if(mode==='retained_report_drift')fs.writeFileSync(path.join(settings.prior,'prompt-asset-repair-evidence.json'),'{}');
process.stdout.write('Synthetic fixture installation only; no registry access.\n');
'''


def setup(mode):
    root = Path(tempfile.mkdtemp(prefix='mmhb-r16-driver-fixture-'))
    prior = Path(tempfile.mkdtemp(prefix='mmhb-r16-fixture-r15-'))
    tool = Path(tempfile.mkdtemp(prefix='mmhb-r16-fixture-tool-'))
    for file in PIN_NAMES:
        write(root, file, '{}\n' if file.endswith('.json') else '// INERT_FIXTURE\n')
    for file in ASSET_NAMES:
        write(root, file, 'INERT_R15_PROMPT_ASSET\n')
    for name, version in {'@vitejs/plugin-react':'6.1.1','resend':'6.24.0','vite':'8.0.16','esbuild':'0.28.2','pg':'8.23.0','bcrypt':'6.0.0','argon2':'0.44.0'}.items():
        write(root, 'node_modules/'+name+'/package.json', js({'name':name,'version':version}))
    package = {'name':'mymentalhealthbuddy','version':'1.0.0','type':'module',
               'dependencies':{'@vitejs/plugin-react':'6.1.0','resend':'6.22.1'}}
    root_meta = {k:v for k,v in package.items() if k!='type'}
    integrity = 'sha512-' + base64.b64encode(bytes(64)).decode()
    lock = {'name':package['name'],'version':package['version'],'lockfileVersion':3,'requires':True,
            'packages':{'':root_meta,
             'node_modules/@vitejs/plugin-react':{'version':'6.1.0','resolved':'https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-6.1.0.tgz','integrity':integrity},
             'node_modules/resend':{'version':'6.22.1','resolved':'https://registry.npmjs.org/resend/-/resend-6.22.1.tgz','integrity':integrity,'bin':{'resend':'bin/cli.js'}}}}
    write(root, 'package.json', js(package))
    write(root, 'package-lock.json', js(lock))
    write(root, 'server/app.mjs', "throw Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    write(root, '.gitignore', 'node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n')
    write(root, '.env.fixture', SECRET)
    write(root, 'untracked.txt', 'USER_WORK_PRESERVE\n')
    candidate = prior / 'candidate'
    write(candidate, 'server.mjs', "throw Error('CANDIDATE_MUST_NOT_EXECUTE');\n", 0o600)
    write(candidate, 'schema.canonical.sql', '-- DATABASE_MUST_NOT_EXECUTE\n', 0o600)
    write(candidate, 'client/dist/index.html', '<html>INERT_CORE_FIXTURE</html>\n', 0o600)
    rows = [{'file':str(p.relative_to(candidate)),'sha256':sha(p.read_bytes()),'bytes':p.stat().st_size,'mode':p.stat().st_mode}
            for p in sorted(candidate.rglob('*')) if p.is_file()]
    assembly = {'rows':rows,'bytes':sum(r['bytes'] for r in rows)}
    manifest_sha = sha(js(assembly).encode())
    evidence = {'project':'MyMentalHealthBuddy','status':'PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE',
                'preservation':'EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED','candidateManifestSha256':manifest_sha}
    write(prior, 'candidate-manifest.json', js(assembly), 0o600)
    write(prior, 'prompt-asset-repair-evidence.json', js(evidence), 0o600)
    settings = {'mode':mode,'root':str(root),'prior':str(prior),'asset':next(iter(ASSET_NAMES))}
    write(tool,'npm/package.json',js({'name':'npm','version':'11.6.0','fixture':settings}))
    cli = write(tool,'npm/bin/npm-cli.js',STUB_NPM,0o755)
    (tool/'bin').mkdir()
    (tool/'bin/npm').symlink_to(cli)
    git(root,'init','-q','-b','integration')
    git(root,'add','.')
    git(root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','inert R16 fixture')
    write(root,'untracked.txt','PRESERVE_EXISTING_UNCOMMITTED_WORK\n')
    return {'root':root,'prior':prior,'candidate':candidate,'tool':tool,'assembly':assembly,
            'lock':lock,'package':package,'manifest_sha':manifest_sha,'asset':settings['asset']}


def adapted(ctx, mode):
    src = DRIVER.read_text()
    for name, names in [('PINS',PIN_NAMES),('ASSET_PINS',ASSET_NAMES)]:
        pins = {file:sha((ctx['root']/file).read_bytes()) for file in names}
        src,n = re.subn(r'const '+name+r' = \{.*?\n\};',lambda _: 'const '+name+' = '+js(pins)+';',src,count=1,flags=re.S)
        assert n==1,name
    constants = {'EXPECTED_ROOT':str(ctx['root']),'EXPECTED_HEAD':git(ctx['root'],'rev-parse','HEAD'),
                 'EXPECTED_NODE':NODE_VERSION,'PRIOR_REPORT':str(ctx['prior']),
                 'EXPECTED_CANDIDATE_MANIFEST':ctx['manifest_sha']}
    for name,value in constants.items():
        src,n = re.subn(r'const '+name+r" = '[^']*';",lambda _:'const '+name+' = '+js(value)+';',src,count=1)
        assert n==1,name
    for name,value in [('EXPECTED_CANDIDATE_FILES',len(ctx['assembly']['rows'])),('EXPECTED_CANDIDATE_BYTES',ctx['assembly']['bytes'])]:
        src,n = re.subn(r'const '+name+r' = \d+;',lambda _:'const '+name+' = '+str(value)+';',src,count=1)
        assert n==1,name
    injected = '''
const fixtureOriginalWrite=fs.writeFileSync,fixtureOriginalRead=fs.readFileSync,fixtureOriginalOpen=fs.openSync;
fs.readFileSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('SECRET_READ_FORBIDDEN');return fixtureOriginalRead.call(this,file,...args);};
fs.openSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('SECRET_READ_FORBIDDEN');return fixtureOriginalOpen.call(this,file,...args);};
'''
    if mode=='report_write_failure':
        injected += "fs.writeFileSync=function(file,...args){if(String(file).endsWith('/locked-dependencies-evidence.json'))throw Object.assign(new Error('PRIVATE_OUTPUT_WRITE_FAILED'),{code:'ENOSPC'});return fixtureOriginalWrite.call(this,file,...args);};\n"
    injected += "const fixtureRegistryMode="+js(mode)+";\n"
    injected += r'''
import fixtureHttps from 'node:https';
import {EventEmitter as FixtureEmitter} from 'node:events';
import {PassThrough as FixtureStream} from 'node:stream';
const fixtureRegistryRequests=[];
fixtureHttps.request=(options,callback)=>{
 const request=new FixtureEmitter();request.destroy=()=>{};
 request.end=()=>queueMicrotask(()=>{
  fixtureRegistryRequests.push({hostname:options.hostname,path:options.path,rejectUnauthorized:options.rejectUnauthorized,
    method:options.method,headerNames:Object.keys(options.headers).sort()});
  fs.writeFileSync(path.join(reportDir,'fixture-registry-requests.json'),JSON.stringify(fixtureRegistryRequests));
  const chunks=options.path.slice(1).split('/'),version=decodeURIComponent(chunks.pop()),name=decodeURIComponent(chunks.join('/'));
  const dist={tarball:'https://registry.npmjs.org/'+name+'/-/'+name.split('/').pop()+'-'+version+'.tgz',integrity:'sha512-'+Buffer.alloc(64).toString('base64')};
  if(fixtureRegistryMode==='registry_integrity_mismatch')dist.integrity='sha512-'+Buffer.alloc(64,1).toString('base64');
  if(fixtureRegistryMode==='registry_identity_mismatch')dist.tarball='https://untrusted.invalid/FIXTURE_PRIVATE_URL_SECRET';
  const value={name,version,dist};
  const response=new FixtureStream();response.statusCode=fixtureRegistryMode==='registry_404'?404:200;response.headers={};response.complete=true;
  if(fixtureRegistryMode==='registry_input_drift')fs.writeFileSync(path.join(ROOT,'untracked.txt'),'CONCURRENT_UNKNOWN_EDIT_PRESERVE');
  if(fixtureRegistryMode==='registry_lock_drift')fs.appendFileSync(path.join(ROOT,'package-lock.json'),'\n');
  callback(response);
  if(!response.destroyed)response.end(JSON.stringify(value));
 });return request;
};
'''
    src = src.replace("const ROOT = fs.realpathSync('.');","const ROOT = fs.realpathSync('.');\n"+injected,1)
    return src


def all_gates(value):
    found=set()
    if isinstance(value,dict):
        if isinstance(value.get('gate'),str):found.add(value['gate'])
        for item in value.values():found |= all_gates(item)
    elif isinstance(value,list):
        for item in value:found |= all_gates(item)
    return found


def run(label, mode='success', prepare=None, tamper=None, expected_gate=None, child_started=0,
        expected_changes=(), candidate_changed=False, inspect=None):
    global COUNT
    ctx=setup(mode)
    report=None
    try:
        if prepare:prepare(ctx)
        src=adapted(ctx,mode)
        if tamper:tamper(ctx)
        before=snapshot(ctx['root']);prior_before=snapshot(ctx['candidate'])
        git_before=(git(ctx['root'],'rev-parse','HEAD'),git(ctx['root'],'ls-files','--stage'),sha((ctx['root']/'.git/index').read_bytes()))
        env={**os.environ,'PATH':str(ctx['tool']/'bin')+os.pathsep+os.environ['PATH'],
             'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1','GIT_OPTIONAL_LOCKS':'0',
             'DATABASE_URL':SECRET,'OPENAI_API_KEY':SECRET,'NPM_TOKEN':SECRET,'NPM_CONFIG_REGISTRY':'https://credential.invalid/',
             'HEAL_AUTO_ENABLED':'true'}
        execution=subprocess.run([NODE,'--input-type=module'],input=src,cwd=ctx['root'],capture_output=True,text=True,env=env,timeout=45)
        output=execution.stdout+execution.stderr
        for marker in (SECRET,UNKNOWN,'FIXTURE_PRIVATE_URL_SECRET','APPLICATION_MUST_NOT_EXECUTE','CANDIDATE_MUST_NOT_EXECUTE','DATABASE_MUST_NOT_EXECUTE','DEPENDENCY_MUST_NOT_EXECUTE','PACKAGE_BIN_MUST_NOT_EXECUTE','SECRET_READ_FORBIDDEN'):
            assert marker not in output,(label,'raw contents/secret/execution leaked',marker,output[-1500:])
        start=execution.stdout.find('\n{')
        assert start>=0,(label,'result JSON absent',output[-3000:])
        result,_=json.JSONDecoder().raw_decode(execution.stdout[start+1:])
        reports=re.findall(r'^REPORT_DIRECTORY=(.+)$',execution.stdout,re.M)
        report=Path(reports[-1]) if reports else None
        terminal=result
        if report and (report/'locked-dependencies-evidence.json').is_file():
            result=json.loads((report/'locked-dependencies-evidence.json').read_text())
            assert result['status']==terminal['status']
            assert result['npmProcess']['started']==terminal['npmProcess']['started']
        receipt=report/'fixture-npm-invocation.json' if report else ctx['tool']/'absent-receipt'
        assert bool(result['npmProcess']['started'])==bool(child_started),(label,'incorrect child count',result)
        assert receipt.exists()==bool(child_started),(label,'actual child receipt differs')
        if receipt.exists():
            invocation=json.loads(receipt.read_text())
            assert invocation['inheritedSecret'] is False,(label,'private child received inherited configuration')
            assert invocation['entries']==['package-lock.json','package.json']
            for flag in ['ci','--ignore-scripts=true','--audit=false','--fund=false','--workspaces=false','--legacy-peer-deps=false','--force=false','--registry=https://registry.npmjs.org/']:
                assert flag in invocation['args'],(label,'missing install contract flag',flag)
            assert invocation['cwd']==str(report/'stage')
        if expected_gate:
            assert execution.returncode==1 and result['status']=='LOCKED_DEPENDENCIES_FAILED',(label,'unexpected success',result)
            assert expected_gate in all_gates(result),(label,'wrong gate',all_gates(result),result)
        else:
            assert execution.returncode==0,(label,'driver failed',result)
            assert result['status']=='REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE',(label,result)
            assert result['privateDependencyAlignment']=='REGISTRY_NORMALIZED_LOCKED_STAGE_METADATA_PASS'
            assert result['preservation']=='OBSERVED_CURRENT_INPUTS_AND_AVAILABLE_EVIDENCE_PRESERVED'
            stage=Path(result['stageDirectory'])
            for name,version in [('@vitejs/plugin-react','6.1.0'),('resend','6.22.1')]:
                assert json.loads((stage/'node_modules'/name/'package.json').read_text())['version']==version
            assert (stage/'package.json').read_bytes()==(ctx['root']/'package.json').read_bytes()
            original=json.loads((ctx['root']/'package-lock.json').read_text())
            staged=json.loads((stage/'package-lock.json').read_text())
            for file,entry in original['packages'].items():
                if file and 'resolved' in entry:staged['packages'][file]['resolved']=entry['resolved']
            assert staged==original,'private lock contains an unexpected non-URL change'
            assert result['archiveSources']['status']=='ARCHIVE_SOURCES_VERIFIED'
            assert (stage/'node_modules/.bin/resend').is_symlink()
        assert result['releaseReady'] is False
        assert result['workspaceDependencyAlignment']=='UNCHANGED_PENDING'
        assert result['applicationRuntime']==result['deployedArtifact']=='UNPROVEN'
        after=snapshot(ctx['root'])
        changes={name for name in set(before)|set(after) if before.get(name)!=after.get(name)}
        expected={ctx['asset'] if x=='ASSET' else x for x in expected_changes}
        assert changes==expected,(label,'unexpected workspace mutation',changes,expected)
        assert (snapshot(ctx['candidate'])!=prior_before)==candidate_changed,(label,'candidate preservation assertion')
        git_after=(git(ctx['root'],'rev-parse','HEAD'),git(ctx['root'],'ls-files','--stage'),sha((ctx['root']/'.git/index').read_bytes()))
        assert git_before==git_after,(label,'Git mutation')
        if report:
            assert report.parent == ctx['root']/'.mmhb-release-evidence'
            assert report.parent.stat().st_mode & 0o777 == 0o700
            assert (report.parent/'.gitignore').read_text() == '*\n'
            assert git(ctx['root'],'check-ignore','--',str(report.relative_to(ctx['root'])))
        if report and (report/'fixture-registry-requests.json').exists():
            requests=json.loads((report/'fixture-registry-requests.json').read_text())
            for request in requests:
                assert request['hostname']=='registry.npmjs.org'
                assert request['rejectUnauthorized'] is True
                assert request['method']=='GET'
                assert request['headerNames']==['Accept','Accept-Encoding','User-Agent']
        if inspect:inspect(ctx,report,result)
        COUNT+=1;RESULTS.append({'case':label,'status':'PASS','childStarted':child_started})
        print('PASS',label,flush=True)
    finally:
        for file in [ctx['root'],ctx['prior'],ctx['tool'],report]:
            if file and file.is_symlink():file.unlink()
            elif file and file.exists():shutil.rmtree(file)


def rewrite_lock(ctx,change):
    lock=json.loads((ctx['root']/'package-lock.json').read_text());change(lock)
    write(ctx['root'],'package-lock.json',js(lock))


def secret_log(ctx,report,result):
    assert result['npmProcess']['errorCodes']==['ERESOLVE']
    raw=Path(result['npmProcess']['logFile']).read_text()
    assert SECRET in raw
    assert 'MMHB_FIXTURE_SECRET_NEVER_PRINT' not in json.dumps(result)



def mirror(ctx):
    def mutate(lock):
        for file,entry in lock['packages'].items():
            if file:entry['resolved']='http://mirror.invalid/archive/'+file+'/'+entry['version']
    rewrite_lock(ctx,mutate)

def inspect_repair(ctx,report,result):
    assert result['archiveRepair']['changedEntries']==2
    assert result['archiveSources']['uniqueSourcesVerified']==2
    assert result['archiveRepair']['rootLockChanged'] is False
    assert result['archiveRepair']['versionsAndIntegrity']=='UNCHANGED'
    assert (report/'archive-source-evidence.json').is_file()
    assert (report/'archive-repair-plan.json').is_file()
    stage=Path(result['stageDirectory'])
    installed=json.loads((stage/'package-lock.json').read_text())
    assert all(e.get('resolved','https://registry.npmjs.org/').startswith('https://registry.npmjs.org/') for e in installed['packages'].values())

WASM='node_modules/@tailwindcss/oxide-wasm32-wasi'
CORE=WASM+'/node_modules/@emnapi/core'
def bundle(ctx, mutate=lambda l:None):
    def change(lock):
        lock['packages'][WASM]={'version':'4.3.3','optional':True,'cpu':['wasm32'],'bundleDependencies':['@emnapi/core'],
            'resolved':'http://mirror.invalid/tailwind','integrity':'sha512-'+base64.b64encode(bytes(64)).decode()}
        lock['packages'][CORE]={'version':'1.11.3','inBundle':True,'optional':True}
        mutate(lock)
    rewrite_lock(ctx,change)

def inspect_bundle(ctx,report,result):
    assert len(result['excludedBundledMembers'])==1
    assert result['archiveSources']['uniqueSourcesVerified']==1
    assert result['archiveRepair']['changedEntries']==1
    assert result['lockRepresentation']['entriesWithoutIntegrity']==1
    stage=Path(result['stageDirectory'])
    assert not (stage/WASM).exists()
    installed=json.loads((stage/'package-lock.json').read_text())
    assert installed['packages'][CORE]=={'version':'1.11.3','inBundle':True,'optional':True}
    assert len(result['installed']['platformExcludedBundledMembers'])==1
    requests=json.loads((report/'fixture-registry-requests.json').read_text())
    assert len(requests)==1 and '@emnapi' not in requests[0]['path']

def dependency_workspace(ctx, mutate=lambda l:None):
    def change(lock):
        lock['packages']['node_modules/eslint']={'version':'9.39.1','workspaces':['packages/*'],
            'resolved':'http://mirror.invalid/eslint','integrity':'sha512-'+base64.b64encode(bytes(64)).decode()}
        mutate(lock)
    rewrite_lock(ctx,change)

def inspect_workspace(ctx,report,result):
    stage=Path(result['stageDirectory'])
    assert result['dependencyWorkspaceMetadata'][0]['file']=='node_modules/eslint'
    assert result['archiveSources']['uniqueSourcesVerified']==1
    original=json.loads((ctx['root']/'package-lock.json').read_text())
    staged=json.loads((stage/'package-lock.json').read_text())
    assert staged['packages']['node_modules/eslint']['workspaces']==original['packages']['node_modules/eslint']['workspaces']
    assert json.loads((stage/'node_modules/eslint/package.json').read_text())['workspaces']==['packages/*']
    invocation=json.loads((report/'fixture-npm-invocation.json').read_text())
    assert '--workspaces=false' in invocation['args']
    assert '--ignore-scripts=true' in invocation['args']
    assert not (stage/'packages').exists()

if __name__=='__main__':
    assert DRIVER.exists(),'Parent driver must be assembled before this fixture suite runs.'
    run('published ESLint workspace metadata preserved through verified private install',prepare=dependency_workspace,child_started=1,inspect=inspect_workspace)
    run('root workspace still blocks before npm',prepare=lambda c:dependency_workspace(c,lambda l:l['packages'][''].update(workspaces=['packages/*'])),expected_gate='WORKSPACES_UNSUPPORTED')
    run('linked dependency with workspace metadata still blocks',prepare=lambda c:dependency_workspace(c,lambda l:l['packages']['node_modules/eslint'].update(link=True)),expected_gate='LOCK_SOURCE_FEATURE_UNSUPPORTED')
    run('local dependency under workspace metadata still blocks',prepare=lambda c:dependency_workspace(c,lambda l:l['packages']['node_modules/eslint'].update(dependencies={'local':'file:../local'})),expected_gate='DEPENDENCY_SOURCE_UNSUPPORTED')
    run('bundled contents preserved while parent archive verified and excluded from private install',prepare=bundle,child_started=1,inspect=inspect_bundle)
    run('present excluded bundle blocks success after npm',prepare=bundle,mode='bundle_present',child_started=1,expected_gate='PLATFORM_EXCLUDED_PACKAGE_PRESENT')
    run('missing bundled marker stops before npm',prepare=lambda c:bundle(c,lambda l:l['packages'][CORE].pop('inBundle')),expected_gate='EXCLUDED_BUNDLE_MARKER_MISSING')
    run('bundle child archive field stops before npm',prepare=lambda c:bundle(c,lambda l:l['packages'][CORE].update(integrity=None)),expected_gate='EXCLUDED_BUNDLE_ARCHIVE_FIELDS_UNSUPPORTED')
    run('missing parent checksum stops before npm',prepare=lambda c:bundle(c,lambda l:l['packages'][WASM].pop('integrity')),expected_gate='ARCHIVE_INTEGRITY_INVALID')
    run('nonexcluded WASM parent does not exempt bundled checksum',prepare=lambda c:bundle(c,lambda l:l['packages'][WASM].update(cpu=['x64'])),expected_gate='ARCHIVE_INTEGRITY_INVALID')
    run('successful private locked stage preserves workspace and R15',child_started=1)
    run('root lock drift blocks before child',tamper=lambda c:write(c['root'],'package-lock.json','{}'),expected_gate='R10A_BASELINE_DRIFT')
    run('R15 source asset drift blocks before child',tamper=lambda c:write(c['root'],c['asset'],'DRIFT'),expected_gate='R15_SOURCE_OR_SELECTED_INPUT_DRIFT')
    run('HTTP mirror URLs repaired and verified before private install',prepare=mirror,child_started=1,inspect=inspect_repair)
    run('public registry identity mismatch blocks npm',mode='registry_identity_mismatch',prepare=mirror,expected_gate='REGISTRY_TARBALL_IDENTITY_MISMATCH')
    run('public registry integrity mismatch blocks npm',mode='registry_integrity_mismatch',prepare=mirror,expected_gate='REGISTRY_INTEGRITY_MISMATCH')
    run('unpublished package 404 blocks npm',mode='registry_404',prepare=mirror,expected_gate='REGISTRY_HTTP_404')
    run('concurrent source edit during registry requests is preserved',mode='registry_input_drift',prepare=mirror,expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',expected_changes=['untracked.txt'])
    run('root lock edit during registry requests is preserved',mode='registry_lock_drift',prepare=mirror,expected_gate='OBSERVED_WORKSPACE_INPUT_CHANGED',expected_changes=['package-lock.json'])
    run('credential archive URL cannot be normalized',prepare=lambda c:rewrite_lock(c,lambda l:l['packages']['node_modules/resend'].update(resolved='https://FIXTURE_PRIVATE_URL_SECRET@mirror.invalid/archive')),expected_gate='ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED')
    run('npm exit failure exposes only safe code',mode='npm_failure',expected_gate='PRIVATE_NPM_CI_FAILED',child_started=1,inspect=secret_log)
    run('staged lock drift fails after child',mode='stage_lock_drift',expected_gate='STAGED_MANIFEST_CHANGED',child_started=1)
    run('installed target version mismatch fails',mode='target_mismatch',expected_gate='INSTALLED_VERSION_MISMATCH',child_started=1)
    run('concurrent workspace edit preserved and reported',mode='workspace_drift',expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',child_started=1,expected_changes=['untracked.txt'])
    run('concurrent R15 asset edit preserved and reported',mode='asset_drift',expected_gate='OBSERVED_WORKSPACE_INPUT_CHANGED',child_started=1,expected_changes=['ASSET'])
    run('retained candidate drift is detected',mode='retained_drift',expected_gate='R15_CANDIDATE_CHANGED',child_started=1,candidate_changed=True)
    run('retained R15 evidence drift is detected',mode='retained_report_drift',expected_gate='RETAINED_R15_REPORT_CHANGED',child_started=1)
    run('final report write failure cannot claim pass',mode='report_write_failure',expected_gate='ENOSPC',child_started=1)
    run('absent R15 does not block locked dependency preparation',tamper=lambda c:shutil.rmtree(c['prior']),child_started=1,
        inspect=lambda c,p,r: (r['priorCandidate']=='ABSENT_NOT_RECOVERED_FRESH_REBUILD_REQUIRED') or (_ for _ in ()).throw(AssertionError('absent report misreported')))
    run('absent R15 appearing during install fails',mode='prior_appears',tamper=lambda c:shutil.rmtree(c['prior']),child_started=1,expected_gate='R15_REPORT_APPEARED_DURING_RUN')
    run('present corrupt R15 manifest still blocks',tamper=lambda c:write(c['prior'],'candidate-manifest.json','{}'),expected_gate='R15_MANIFEST_IDENTITY')
    run('tracked evidence root blocked before npm',prepare=lambda c:(write(c['root'],'.mmhb-release-evidence/existing.txt','KEEP'),git(c['root'],'add','.mmhb-release-evidence')),expected_gate='EVIDENCE_ROOT_TRACKED')
    run('conflicting evidence directory blocked',prepare=lambda c:write(c['root'],'.mmhb-release-evidence/existing.txt','KEEP'),expected_gate='EVIDENCE_ROOT_BOUNDARY')
    run('symlink evidence root blocked',prepare=lambda c:(c['root']/'.mmhb-release-evidence').symlink_to(c['tool'],target_is_directory=True),expected_gate='EVIDENCE_ROOT_BOUNDARY')
    def prior_link(c):
        shutil.rmtree(c['prior'])
        c['prior'].symlink_to(c['tool'],target_is_directory=True)
    run('symlink prior report remains rejected',tamper=prior_link,expected_gate='ARTIFACT_DIRECTORY_BOUNDARY')
    def valid_root(c):
        folder=c['root']/'.mmhb-release-evidence'
        folder.mkdir(mode=0o700)
        write(folder,'.gitignore','*\n',0o600)
        write(folder,'previous-run/result.json','{}',0o600)
    run('existing private evidence root reused without old report changes',prepare=valid_root,child_started=1,
        inspect=lambda c,p,r: (c['root']/'.mmhb-release-evidence/previous-run/result.json').read_text()=='{}' or (_ for _ in ()).throw(AssertionError('old run changed')))
    (HERE/'r16e-driver-fixture-results.json').write_text(json.dumps({'scope':'ACTUAL_R16E_DRIVER_WITH_INERT_NPM_CLI_AND_SYNTHETIC_HTTPS_NO_EXTERNAL_REGISTRY_OR_APPLICATION','driverSha256':sha(DRIVER.read_bytes()),'harnessSha256':sha(Path(__file__).read_bytes()),'node':NODE_VERSION,'passed':COUNT,'cases':RESULTS},indent=2)+'\n')
    print(f'R16E_DRIVER_FIXTURE_TESTS={COUNT}_PASS')
