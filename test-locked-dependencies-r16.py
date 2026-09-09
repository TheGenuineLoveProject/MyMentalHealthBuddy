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
DRIVER = HERE / 'locked-dependencies-driver-r16.mjs'
NODE = shutil.which('node')
NODE_VERSION = subprocess.check_output([NODE, '--version'], text=True).strip()
PREFIX = (HERE / 'locked-dependencies-prefix-r16.mjs').read_text()
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
        if '.git' in rel.parts:
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
 const directory=path.join(stage,relative);
 fs.mkdirSync(directory,{recursive:true});
 const parts=relative.split('/node_modules/').pop().replace(/^node_modules\//,'');
 const pkg={name:parts,version:mode==='target_mismatch'&&parts==='@vitejs/plugin-react'?'6.1.1':meta.version};
 if(meta.dependencies)pkg.dependencies=meta.dependencies;
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
        for marker in (SECRET,UNKNOWN,'APPLICATION_MUST_NOT_EXECUTE','CANDIDATE_MUST_NOT_EXECUTE','DATABASE_MUST_NOT_EXECUTE','DEPENDENCY_MUST_NOT_EXECUTE','PACKAGE_BIN_MUST_NOT_EXECUTE','SECRET_READ_FORBIDDEN'):
            assert marker not in output,(label,'raw contents/secret/execution leaked',marker,output[-1500:])
        start=execution.stdout.find('\n{')
        assert start>=0,(label,'result JSON absent',output[-3000:])
        result,_=json.JSONDecoder().raw_decode(execution.stdout[start+1:])
        reports=re.findall(r'^REPORT_DIRECTORY=(.+)$',execution.stdout,re.M)
        assert reports,(label,'report path absent')
        report=Path(reports[-1]);receipt=report/'fixture-npm-invocation.json'
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
            assert result['status']=='LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE',(label,result)
            assert result['privateDependencyAlignment']=='LOCKED_STAGE_METADATA_PASS'
            assert result['preservation']=='OBSERVED_WORKSPACE_R15_AND_NPM_TOOL_PRESERVED'
            stage=Path(result['stageDirectory'])
            for name,version in [('@vitejs/plugin-react','6.1.0'),('resend','6.22.1')]:
                assert json.loads((stage/'node_modules'/name/'package.json').read_text())['version']==version
            for name in ['package.json','package-lock.json']:
                assert (stage/name).read_bytes()==(ctx['root']/name).read_bytes()
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
        if inspect:inspect(ctx,report,result)
        COUNT+=1;RESULTS.append({'case':label,'status':'PASS','childStarted':child_started})
        print('PASS',label,flush=True)
    finally:
        for file in [ctx['root'],ctx['prior'],ctx['tool'],report]:
            if file and file.exists():shutil.rmtree(file)


def rewrite_lock(ctx,change):
    lock=json.loads((ctx['root']/'package-lock.json').read_text());change(lock)
    write(ctx['root'],'package-lock.json',js(lock))


def secret_log(ctx,report,result):
    assert result['npmProcess']['errorCodes']==['ERESOLVE']
    raw=Path(result['npmProcess']['logFile']).read_text()
    assert SECRET in raw
    assert 'MMHB_FIXTURE_SECRET_NEVER_PRINT' not in json.dumps(result)


if __name__=='__main__':
    assert DRIVER.exists(),'Parent driver must be assembled before this fixture suite runs.'
    run('successful private locked stage preserves workspace and R15',child_started=1)
    run('root lock drift blocks before child',tamper=lambda c:write(c['root'],'package-lock.json','{}'),expected_gate='R10A_BASELINE_DRIFT')
    run('R15 source asset drift blocks before child',tamper=lambda c:write(c['root'],c['asset'],'DRIFT'),expected_gate='R15_SOURCE_OR_SELECTED_INPUT_DRIFT')
    run('bad registry blocks before child',prepare=lambda c:rewrite_lock(c,lambda l:l['packages']['node_modules/resend'].update(resolved='https://example.invalid/resend.tgz')),expected_gate='ARCHIVE_URL_NOT_ALLOWED')
    run('npm exit failure exposes only safe code',mode='npm_failure',expected_gate='PRIVATE_NPM_CI_FAILED',child_started=1,inspect=secret_log)
    run('staged lock drift fails after child',mode='stage_lock_drift',expected_gate='STAGED_MANIFEST_CHANGED',child_started=1)
    run('installed target version mismatch fails',mode='target_mismatch',expected_gate='INSTALLED_VERSION_MISMATCH',child_started=1)
    run('concurrent workspace edit preserved and reported',mode='workspace_drift',expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',child_started=1,expected_changes=['untracked.txt'])
    run('concurrent R15 asset edit preserved and reported',mode='asset_drift',expected_gate='OBSERVED_WORKSPACE_INPUT_CHANGED',child_started=1,expected_changes=['ASSET'])
    run('retained candidate drift is detected',mode='retained_drift',expected_gate='R15_CANDIDATE_CHANGED',child_started=1,candidate_changed=True)
    run('retained R15 evidence drift is detected',mode='retained_report_drift',expected_gate='RETAINED_R15_REPORT_CHANGED',child_started=1)
    run('final report write failure cannot claim pass',mode='report_write_failure',expected_gate='ENOSPC',child_started=1)
    (HERE/'r16-driver-fixture-results.json').write_text(json.dumps({'scope':'ACTUAL_DRIVER_WITH_INERT_NPM_CLI_NO_REGISTRY_OR_APPLICATION','driverSha256':sha(DRIVER.read_bytes()),'harnessSha256':sha(Path(__file__).read_bytes()),'node':NODE_VERSION,'passed':COUNT,'cases':RESULTS},indent=2)+'\n')
    print(f'R16_DRIVER_FIXTURE_TESTS={COUNT}_PASS')
