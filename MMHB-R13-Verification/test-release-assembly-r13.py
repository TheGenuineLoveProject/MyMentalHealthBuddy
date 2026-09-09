"""Run the actual R13 assembly driver against disposable inert artifacts.

Only expected root/head/Node/pins, retained-report paths, and embedded native
runner bytes are transplanted. Native smoke is an inert stub; the real Node
syntax checker runs on a fixture that throws if executed. No MMHB application,
native binary, package installation, database, browser or network is exercised.
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
DRIVER = HERE / 'release-assembly-driver-r13.mjs'
NODE_VERSION = subprocess.check_output(['node','--version'],text=True).strip()
SECRET = 'MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD'
PRIVATE = 'MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ'
COUNT = 0


def sha(value):
    return hashlib.sha256(value).hexdigest()


def js(value):
    return json.dumps(value,separators=(',',':'),ensure_ascii=False)


def write(root,name,value,mode=0o644):
    target=root/name
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(value)
    target.chmod(mode)
    return target


def git(root,*args):
    return subprocess.check_output(['git',*args],cwd=root,text=True,stderr=subprocess.DEVNULL).strip()


def snapshot(root):
    result={}
    for file in sorted(root.rglob('*')):
        if '.git' in file.relative_to(root).parts:
            continue
        rel=str(file.relative_to(root))
        if file.is_symlink(): result[rel]=('LINK',os.readlink(file))
        elif file.is_file(): result[rel]=(sha(file.read_bytes()),file.stat().st_mode)
    return result


def row(root,name,with_mode=False):
    file=root/name
    result={'file':name,'sha256':sha(file.read_bytes()),'bytes':file.stat().st_size}
    if with_mode:
        result.update(state='FILE',mode=file.stat().st_mode,resolved=name)
    return result


def setup(base):
    root=Path(tempfile.mkdtemp(prefix='mmhb-r13-parent-fixture-'))
    names=json.loads(re.search(r'const PINS = (\{.*?\n\});',base,re.S).group(1))
    assert len(names)==41
    for name in names:
        write(root,name,'{}\n' if name.endswith('.json') else '// INERT_FIXTURE\n')
    write(root,'package.json',js({'name':'mmhb-inert-fixture','type':'module'}))
    write(root,'server/app.mjs',"throw Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    write(root,'.gitignore','node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n')
    write(root,'untracked.txt','UNRELATED_USER_WORK\n')
    git(root,'init','-q','-b','integration')
    git(root,'add','.')
    git(root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','inert assembly fixture')
    write(root,'untracked.txt','PRESERVE_EXISTING_UNCOMMITTED_WORK\n')
    server=Path(tempfile.mkdtemp(prefix='mmhb-r13-fixture-retained-server-'))
    front=Path(tempfile.mkdtemp(prefix='mmhb-r13-fixture-retained-front-'))
    candidate=server/'candidate'
    web=front/'frontend'
    write(candidate,'server.mjs',"throw Error('APPLICATION_MUST_NOT_EXECUTE');\nexport const fixture=true;\n")
    write(candidate,'schema.canonical.sql','-- DATABASE_MUST_NOT_EXECUTE\n')
    write(candidate,'node_modules/bcrypt/package.json',js({'name':'bcrypt','version':'6.0.0','main':'bcrypt.js'}))
    write(candidate,'node_modules/bcrypt/bcrypt.js',"throw Error('NATIVE_MUST_NOT_EXECUTE');\n")
    write(candidate,'node_modules/node-gyp-build/package.json',js({'name':'node-gyp-build','version':'4.8.4','main':'index.js'}))
    write(candidate,'node_modules/node-gyp-build/index.js',"throw Error('NATIVE_LOADER_MUST_NOT_EXECUTE');\n",0o755)
    write(web,'index.html','<html><script src="/assets/main.js"></script></html>\n',0o600)
    write(web,'assets/main.js',"throw Error('FRONTEND_MUST_NOT_EXECUTE');\n",0o600)
    write(web,'assets/literal # * file.css','body{color:green}\n',0o600)
    write(web,'serviceWorker.js','// SERVICE_WORKER_MUST_NOT_EXECUTE\n',0o600)
    native=[row(candidate,str(f.relative_to(candidate)),True) for f in sorted((candidate/'node_modules').rglob('*')) if f.is_file()]
    rows=[row(web,str(f.relative_to(web))) for f in sorted(web.rglob('*')) if f.is_file()]
    manifest={'state':'DIRECTORY','bytes':sum(r['bytes'] for r in rows),'rows':rows}
    return {'root':root,'server':server,'front':front,'candidate':candidate,'web':web,'native':native,'manifest':manifest,
        'pins':{name:sha((root/name).read_bytes()) for name in names},
        'serverEvidence':{'status':'SERVER_CANDIDATE_ONLY_NOT_RELEASE','preservation':'OBSERVED_INPUTS_AND_GIT_STATE_PRESERVED','externalImports':['node:fs','bcrypt','@fixture/missing']},
        'frontEvidence':{'status':'FRONTEND_CANDIDATE_ONLY_NOT_RELEASE','preservation':'OBSERVED_SOURCES_TOOLS_AND_GIT_STATE_PRESERVED'}}


def stub(ctx,mode):
    return r'''
import fs from 'node:fs';
import path from 'node:path';
const mode=__MODE__, root=__ROOT__, retainedServer=__SERVER__, retainedFront=__FRONT__;
const candidate=process.argv[2],report=process.argv[3];
if(Object.values(process.env).some(x=>x.includes('MMHB_FIXTURE_INHERITED_SECRET_MUST_NOT_REACH_CHILD'))) throw Error('FIXTURE_CHILD_SECRET_LEAK');
fs.writeFileSync(path.join(report,'fixture-native-started'),'yes',{mode:0o600});
if(mode==='native_failure') {
  console.error('MMHB_FIXTURE_PRIVATE_CONTENT_MUST_NOT_BE_READ');
  fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),JSON.stringify({status:'NATIVE_CANDIDATE_SMOKE_FAILED',failure:{phase:'FIXTURE_LOAD',code:'FIXTURE_NATIVE_FAILURE'}}),{mode:0o600});
  process.exit(7);
}
if(mode==='native_missing_evidence') process.exit(0);
if(mode==='unrelated_drift') fs.appendFileSync(path.join(root,'untracked.txt'),'CONCURRENT_EDIT\n');
if(mode==='pin_drift') fs.appendFileSync(path.join(root,'server/app.mjs'),'// CONCURRENT_EDIT\n');
if(mode==='server_drift') fs.appendFileSync(path.join(retainedServer,'candidate/server.mjs'),'// CONCURRENT_EDIT\n');
if(mode==='frontend_drift') fs.appendFileSync(path.join(retainedFront,'frontend/index.html'),'CONCURRENT_EDIT\n');
if(mode==='report_drift') fs.appendFileSync(path.join(retainedServer,'server-candidate-evidence.json'),' ');
if(mode==='candidate_drift') fs.appendFileSync(path.join(candidate,'server.mjs'),'// CONCURRENT_EDIT\n');
if(mode==='candidate_new_file') fs.writeFileSync(path.join(candidate,'unexpected.txt'),'UNEXPECTED_OUTPUT');
if(mode==='candidate_mode_drift') fs.chmodSync(path.join(candidate,'server.mjs'),0o600);
if(mode==='candidate_symlink') {fs.unlinkSync(path.join(candidate,'server.mjs'));fs.symlinkSync(path.join(retainedServer,'candidate/server.mjs'),path.join(candidate,'server.mjs'));}
if(mode==='preservation_save_collision') fs.writeFileSync(path.join(report,'assembly-manifest-after.json'),'DO_NOT_OVERWRITE');
if(mode==='final_save_collision') fs.writeFileSync(path.join(report,'assembly-evidence.json'),'DO_NOT_OVERWRITE');
fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),JSON.stringify({status:mode==='native_bad_evidence'?'NOT_PASS':'NATIVE_CANDIDATE_SMOKE_PASS',fixture:'INERT_NOT_NATIVE_COMPATIBILITY_PROOF'}),{mode:0o600});
'''.replace('__MODE__',js(mode)).replace('__ROOT__',js(str(ctx['root']))).replace('__SERVER__',js(str(ctx['server']))).replace('__FRONT__',js(str(ctx['front'])))


def adapted(base,ctx,mode):
    src=re.sub(r'const PINS = \{.*?\n\};',lambda _: 'const PINS = '+js(ctx['pins'])+';',base,count=1,flags=re.S)
    for name,value in {'EXPECTED_ROOT':str(ctx['root']),'EXPECTED_HEAD':git(ctx['root'],'rev-parse','HEAD'),'EXPECTED_NODE':NODE_VERSION,'SERVER_REPORT':str(ctx['server']),'FRONTEND_REPORT':str(ctx['front'])}.items():
        src,count=re.subn(r'const '+name+r" = '[^']*';",lambda _: 'const '+name+' = '+js(value)+';',src,count=1)
        assert count==1,name
    pins={'server':row(ctx['candidate'],'server.mjs'),'schema':row(ctx['candidate'],'schema.canonical.sql'),
          'nativeManifest':sha(js(ctx['native']).encode()),'frontendManifest':sha(js(ctx['manifest']).encode()),
          'frontendFiles':len(ctx['manifest']['rows']),'frontendBytes':ctx['manifest']['bytes'],'nativeFiles':len(ctx['native'])}
    pins['server'].pop('file');pins['schema'].pop('file')
    src,count=re.subn(r'const ARTIFACT_PINS = \{.*?\n\};',lambda _: 'const ARTIFACT_PINS = '+js(pins)+';',src,count=1,flags=re.S)
    assert count==1
    encoded=base64.b64encode(stub(ctx,mode).encode()).decode()
    src,count=re.subn(r"const NATIVE_RUNNER_B64 = '[^']*';",lambda _: "const NATIVE_RUNNER_B64 = '"+encoded+"';",src,count=1)
    assert count==1
    return src


def persist(ctx):
    for key,base,name in [('native','server','native-copy-manifest.json'),('serverEvidence','server','server-candidate-evidence.json'),('frontEvidence','front','frontend-candidate-evidence.json'),('manifest','front','output-manifest.json')]:
        write(ctx[base],name,js(ctx[key]),0o600)


def run(label,mode='success',prepare=None,tamper=None,expected_gate=None,runs=2,changes=(),hook=None):
    global COUNT
    ctx=setup(DRIVER.read_text());report=None
    try:
        if prepare: prepare(ctx)
        persist(ctx)
        src=adapted(DRIVER.read_text(),ctx,mode)
        if hook: src=src.replace("const ROOT = fs.realpathSync('.');","const ROOT = fs.realpathSync('.');\n"+hook,1)
        if tamper: tamper(ctx)
        before=snapshot(ctx['root'])
        env={**os.environ,'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1','GIT_OPTIONAL_LOCKS':'0','DATABASE_URL':SECRET,'OPENAI_API_KEY':SECRET,'VITE_SECRET':SECRET,'BCRYPT_PREBUILD':SECRET,'PREBUILDS_ONLY':SECRET,'npm_config_arch':SECRET,'LIBC':SECRET}
        execution=subprocess.run(['node','--input-type=module'],input=src,cwd=ctx['root'],capture_output=True,text=True,env=env,timeout=45)
        output=execution.stdout+execution.stderr
        for marker in [SECRET,PRIVATE,'APPLICATION_MUST_NOT_EXECUTE','NATIVE_MUST_NOT_EXECUTE','NATIVE_LOADER_MUST_NOT_EXECUTE','FRONTEND_MUST_NOT_EXECUTE']:
            assert marker not in output,(label,'leaked output or unintended execution',marker)
        start=execution.stdout.find('\n{')
        assert start>=0,(label,'no JSON result',output[-4000:])
        result,_=json.JSONDecoder().raw_decode(execution.stdout[start+1:])
        reports=re.findall(r'^REPORT_DIRECTORY=(.+)$',execution.stdout,re.M)
        assert reports,(label,'no report path')
        report=Path(reports[-1])
        assert len(result['processes'])==runs,(label,'wrong processes',result)
        assert all(p['started'] for p in result['processes']),(label,result)
        if expected_gate:
            assert execution.returncode==1 and result['status']=='CORE_CANDIDATE_ASSEMBLY_FAILED',(label,result)
            assert result['failure']['gate']==expected_gate,(label,result)
        else:
            assert execution.returncode==0 and result['status']=='CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE',(label,result)
            assert result['preservation']=='OBSERVED_INPUTS_AND_CANDIDATES_PRESERVED',(label,result)
            assert result['dependencyAlignment']=='PENDING' and result['applicationRuntime']=='UNPROVEN' and result['deployedArtifact']=='UNPROVEN'
            assembled=report/'candidate'
            expected={str(f.relative_to(ctx['candidate'])) for f in ctx['candidate'].rglob('*') if f.is_file()}
            expected|={'client/dist/'+r['file'] for r in ctx['manifest']['rows']}
            actual={str(f.relative_to(assembled)) for f in assembled.rglob('*') if f.is_file()}
            assert actual==expected and result['files']==len(expected),(label,'bad layout',actual,expected)
            for name in expected:
                source=ctx['web']/name.removeprefix('client/dist/') if name.startswith('client/dist/') else ctx['candidate']/name
                assert (assembled/name).read_bytes()==source.read_bytes()
                assert (assembled/name).stat().st_mode==source.stat().st_mode
            evidence=json.loads((report/'assembly-manifest-before.json').read_text())
            assert sha(js(evidence).encode())==result['assemblyManifestSha256']
            assert evidence==json.loads((report/'assembly-manifest-after.json').read_text())
            assert result['externalResolution'][0]['state']=='NODE_BUILTIN'
            assert result['externalResolution'][1]['state']=='RESOLVES_INSIDE_CANDIDATE'
            assert result['externalResolution'][2]['state']=='NOT_RESOLVED_BY_COMMONJS'
        after=snapshot(ctx['root'])
        changed={name for name in set(before)|set(after) if before.get(name)!=after.get(name)}
        assert changed==set(changes),(label,'unexpected workspace changes',changed)
        assert report.stat().st_mode&0o777==0o700
        for name in ('worktree-before.json','worktree-after.json','worktree-comparison.json'):
            assert (report/name).is_file() and (report/name).stat().st_mode&0o777==0o600,(label,name)
        if not changes:
            assert json.loads((report/'worktree-before.json').read_text())==json.loads((report/'worktree-after.json').read_text())
        if mode=='final_save_collision':
            assert result['evidenceWrite']=='FAILED'
            assert (report/'assembly-evidence.json').read_text()=='DO_NOT_OVERWRITE'
        elif result['evidenceWrite']=='SAVED':
            assert json.loads((report/'assembly-evidence.json').read_text())==result
            assert (report/'assembly-evidence.json').stat().st_mode&0o777==0o600
        assert (report/'fixture-native-started').exists()==(runs==2),(label,'unexpected native child')
        assert not (ctx['root']/'FILTER_EXECUTED').exists()
        COUNT+=1
        print('CASE='+label+' RESULT=PASS',flush=True)
        return result
    finally:
        for target in [ctx['root'],ctx['server'],ctx['front'],report]:
            if target: shutil.rmtree(target,ignore_errors=True)


def main():
    run('assembly_exact_layout_modes_hashes_private_reports_and_no_app_execution')
    run('workspace_pin_drift_stops_before_children',tamper=lambda c:write(c['root'],'server/app.mjs','DRIFT'),expected_gate='R10A_BASELINE_DRIFT',runs=0)
    run('server_status_rejected',prepare=lambda c:c['serverEvidence'].update(status='SERVER_CANDIDATE_FAILED'),expected_gate='RETAINED_CANDIDATE_STATUS',runs=0)
    run('frontend_status_rejected',prepare=lambda c:c['frontEvidence'].update(status='FRONTEND_CANDIDATE_FAILED'),expected_gate='RETAINED_CANDIDATE_STATUS',runs=0)
    run('native_manifest_pin_mismatch',tamper=lambda c:write(c['server'],'native-copy-manifest.json','[]'),expected_gate='NATIVE_MANIFEST_PIN',runs=0)
    run('frontend_manifest_pin_mismatch',tamper=lambda c:write(c['front'],'output-manifest.json','{}'),expected_gate='FRONTEND_MANIFEST_PIN',runs=0)
    run('server_bundle_pin_mismatch',tamper=lambda c:write(c['candidate'],'server.mjs','// CHANGED\n'),expected_gate='SERVER_ARTIFACT_MISMATCH',runs=0)
    run('schema_pin_mismatch',tamper=lambda c:write(c['candidate'],'schema.canonical.sql','-- CHANGED\n'),expected_gate='SERVER_ARTIFACT_MISMATCH',runs=0)
    run('frontend_file_pin_mismatch',tamper=lambda c:write(c['web'],'index.html','CHANGED'),expected_gate='FRONTEND_ARTIFACT_MISMATCH',runs=0)
    run('native_file_mode_mismatch',tamper=lambda c:(c['candidate']/'node_modules/bcrypt/bcrypt.js').chmod(0o700),expected_gate='SERVER_ARTIFACT_MISMATCH',runs=0)
    run('unexpected_server_file_rejected',tamper=lambda c:write(c['candidate'],'unexpected.txt','EXTRA'),expected_gate='SERVER_ARTIFACT_MISMATCH',runs=0)
    run('missing_frontend_file_rejected',tamper=lambda c:(c['web']/'assets/main.js').unlink(),expected_gate='FRONTEND_ARTIFACT_MISMATCH',runs=0)
    for name in ['../escape','/tmp/escape','assets/../escape','assets//escape','assets/.env.fixture','assets/secret.pem','assets/back\\slash','assets/control\x01']:
        run('manifest_unsafe_path_'+sha(name.encode())[:8],prepare=lambda c,n=name:c['manifest']['rows'][0].update(file=n),expected_gate='MANIFEST_ROW_INVALID',runs=0)
    run('manifest_duplicate_path',prepare=lambda c:c['manifest']['rows'].append(c['manifest']['rows'][0]),expected_gate='MANIFEST_ROW_INVALID',runs=0)
    run('native_manifest_scope_rejected',prepare=lambda c:c['native'][0].update(file='node_modules/unrelated/package.json'),expected_gate='NATIVE_MANIFEST_SCOPE',runs=0)
    run('frontend_file_symlink_rejected',tamper=lambda c:(c['web']/'link').symlink_to('/etc/passwd'),expected_gate='ARTIFACT_SYMLINK',runs=0)
    run('frontend_directory_symlink_rejected',tamper=lambda c:(c['web']/'linkdir').symlink_to('/etc'),expected_gate='ARTIFACT_SYMLINK',runs=0)
    def report_link(c):
        file=c['server']/'native-copy-manifest.json';file.rename(c['server']/'original.json');file.symlink_to('original.json')
    run('retained_report_symlink_rejected',tamper=report_link,expected_gate='ARTIFACT_SYMLINK',runs=0)
    def missing_service_worker(c):
        (c['web']/'serviceWorker.js').unlink()
        c['manifest']['rows']=[r for r in c['manifest']['rows'] if r['file']!='serviceWorker.js']
        c['manifest']['bytes']=sum(r['bytes'] for r in c['manifest']['rows'])
    run('required_service_worker_layout_missing',prepare=missing_service_worker,expected_gate='REQUIRED_RUNTIME_LAYOUT_FILE_MISSING',runs=0)
    run('actual_syntax_checker_rejects_invalid_js',prepare=lambda c:write(c['candidate'],'server.mjs','export const = ;\n'),expected_gate='CANDIDATE_CHILD_FAILED',runs=1)
    fail=run('native_failure_hides_raw_log',mode='native_failure',expected_gate='CANDIDATE_CHILD_FAILED')
    assert fail['failure']['detail']['rawLog']=='PRIVATE_NOT_PRINTED'
    assert fail['failure']['detail']['nativeFailure']=={'phase':'FIXTURE_LOAD','code':'FIXTURE_NATIVE_FAILURE'}
    assert fail['nativeSmoke']['failure']=={'phase':'FIXTURE_LOAD','code':'FIXTURE_NATIVE_FAILURE'}
    run('native_success_exit_requires_pass_evidence',mode='native_bad_evidence',expected_gate='NATIVE_SMOKE_EVIDENCE')
    run('native_missing_evidence_structured_failure',mode='native_missing_evidence',expected_gate='UNEXPECTED_ASSEMBLY_FAILURE')
    run('unrelated_worktree_drift_detected',mode='unrelated_drift',expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',changes=('untracked.txt',))
    run('pinned_source_drift_detected',mode='pin_drift',expected_gate='PINNED_FILE_NOT_PRESERVED',changes=('server/app.mjs',))
    run('retained_server_drift_detected',mode='server_drift',expected_gate='RETAINED_SERVER_NOT_PRESERVED')
    run('retained_frontend_drift_detected',mode='frontend_drift',expected_gate='RETAINED_FRONTEND_NOT_PRESERVED')
    run('retained_report_drift_detected',mode='report_drift',expected_gate='RETAINED_REPORT_NOT_PRESERVED')
    run('assembled_candidate_drift_detected',mode='candidate_drift',expected_gate='ASSEMBLED_CANDIDATE_NOT_PRESERVED')
    run('assembled_candidate_new_file_detected',mode='candidate_new_file',expected_gate='ASSEMBLED_CANDIDATE_NOT_PRESERVED')
    run('assembled_candidate_mode_drift_detected',mode='candidate_mode_drift',expected_gate='ASSEMBLED_CANDIDATE_NOT_PRESERVED')
    run('assembled_candidate_symlink_detected',mode='candidate_symlink',expected_gate='ARTIFACT_SYMLINK')
    run('preservation_save_error_fails_closed',mode='preservation_save_collision',expected_gate='PRESERVATION_CHECK_FAILED')
    run('final_evidence_error_kept_on_stdout',mode='final_save_collision',expected_gate='EVIDENCE_WRITE_FAILED')
    def clean_filter(c):
        write(c['root'],'.gitattributes','untracked.txt filter=fixture\n')
        git(c['root'],'config','filter.fixture.clean','touch FILTER_EXECUTED; cat')
    run('git_clean_filter_never_runs',tamper=clean_filter)
    print('R13_PARENT_FIXTURE_CASES='+str(COUNT)+' RESULT=PASS')
    print('SCOPE=ACTUAL_PARENT_ORCHESTRATION_WITH_INERT_NATIVE_CHILD_AND_SYNTHETIC_ARTIFACTS_NOT_MMHB_RUNTIME_OR_NATIVE_ABI_PROOF')


if __name__=='__main__':
    main()
