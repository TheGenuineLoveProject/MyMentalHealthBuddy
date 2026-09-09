"""Exercise the actual R14 orchestration with disposable inert fixtures.

Only expected root/head/Node/pins, retained-report paths and manifest hashes,
and the reviewed-source policy are transplanted. Optional write interception
injects concurrent drift or report collisions after an observed checkpoint.
No application, dependency, native binding, compiler, install, database, browser
or network is executed. The driver uses Node builtins and read-only Git calls.
"""
from pathlib import Path
import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile

HERE=Path(__file__).resolve().parent
DRIVER=HERE/'runtime-contract-driver-r14.mjs'
NODE_VERSION=subprocess.check_output(['node','--version'],text=True).strip()
SECRET='MMHB_FIXTURE_SECRET_VALUE_DO_NOT_PRINT'
PRIVATE='MMHB_FIXTURE_PRIVATE_CONTENT_DO_NOT_PRINT'
COUNT=0

def sha(value):return hashlib.sha256(value).hexdigest()
def js(value):return json.dumps(value,separators=(',',':'),ensure_ascii=False)
def write(root,name,value,mode=0o644):
    file=root/name;file.parent.mkdir(parents=True,exist_ok=True)
    file.write_text(value);file.chmod(mode);return file
def git(root,*args):
    return subprocess.check_output(['git',*args],cwd=root,text=True,stderr=subprocess.DEVNULL).strip()
def row(root,name):
    file=root/name
    return {'file':name,'sha256':sha(file.read_bytes()),'bytes':file.stat().st_size,'mode':file.stat().st_mode}
def snapshot(root):
    result={}
    for file in sorted(root.rglob('*')):
        if '.git' in file.relative_to(root).parts:continue
        rel=str(file.relative_to(root))
        if file.is_symlink():result[rel]=('LINK',os.readlink(file))
        elif file.is_file():result[rel]=(sha(file.read_bytes()),file.stat().st_mode)
    return result
def registry(engine):
    prefix='h' if engine=='healing' else 'b'
    return {'engine':engine,'version':'1.0.0','allowed_audiences':['owner'],
            'prompts':[{'id':prefix+'01_fixture','risk':'low'}]}

def setup(base):
    root=Path(tempfile.mkdtemp(prefix='mmhb-r14-orchestration-fixture-'))
    prior=Path(tempfile.mkdtemp(prefix='mmhb-r14-fixture-prior-'))
    server=Path(tempfile.mkdtemp(prefix='mmhb-r14-fixture-server-'))
    names=json.loads(re.search(r'const PINS = (\{.*?\n\});',base,re.S).group(1))
    assert len(names)==41
    for name in names:
        write(root,name,'{}\n' if name.endswith('.json') else '// INERT_FIXTURE\n')
    write(root,'package.json',js({'name':'mmhb-inert-fixture','type':'module'}))
    write(root,'server/app.mjs',"throw Error('APPLICATION_MUST_NOT_EXECUTE');\n")
    write(root,'.gitignore','node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n')
    write(root,'.env.fixture',PRIVATE)
    write(root,'untracked.txt','PRESERVE_UNCOMMITTED_USER_WORK\n')
    sources=[]
    for file,classification in [('server/lib/promptEngine.mjs','RUNTIME_ASSET_CONSUMER'),
            ('node_modules/ws/lib/buffer-util.js','OPTIONAL_BUFFERUTIL_WITH_JS_FALLBACK')]:
        write(root,file,"throw Error('DEPENDENCY_MUST_NOT_EXECUTE');\n")
        sources.append({'file':file,'sha256':sha((root/file).read_bytes()),
            'classification':classification,'conditions':['FIXTURE_REVIEWED_SOURCE_ONLY']})
    assets=[]
    for engine in ['healing','business']:
        prefix='h' if engine=='healing' else 'b'
        for file,content in [('ai/'+engine+'/registry.json',js(registry(engine))),
                ('ai/'+engine+'/system.md',PRIVATE+' SYSTEM'),
                ('ai/'+engine+'/prompts/'+prefix+'01_fixture.md',PRIVATE+' PROMPT')]:
            write(root,file,content)
            assets.append({'file':file,'sha256':sha((root/file).read_bytes()),'bytes':len(content.encode()),
                'classification':'EXISTING_MMHB_FIXTURE_ASSET','observedBrandNames':['GLP'] if engine=='business' else []})
    write(root,'scripts/heal-self.mjs',"throw Error('HEAL_SCRIPT_MUST_NOT_EXECUTE');\n")
    package={'name':'@vitejs/plugin-react','version':'6.1.1','scripts':{'install':SECRET},
        'resolved':'https://user:'+SECRET+'@registry.npmjs.org/private.tgz',
        'integrity':SECRET,'dependencies':{'private-name':SECRET}}
    write(root,'node_modules/@vitejs/plugin-react/package.json',js(package))
    locked={**package,'version':'6.1.0'}
    write(root,'package-lock.json',js({'lockfileVersion':3,'packages':{'node_modules/@vitejs/plugin-react':locked}}))
    write(root,'node_modules/.package-lock.json',js({'lockfileVersion':3,'packages':{'node_modules/@vitejs/plugin-react':package}}))
    candidate=prior/'candidate'
    write(candidate,'server.mjs',"throw Error('CANDIDATE_MUST_NOT_EXECUTE');\n",0o600)
    write(candidate,'schema.canonical.sql','-- DATABASE_MUST_NOT_EXECUTE\n',0o600)
    write(candidate,'client/dist/index.html','<html>INERT</html>\n',0o600)
    write(candidate,'ai/healing/system.md',PRIVATE+' SYSTEM',0o600)
    rows=[row(candidate,str(f.relative_to(candidate))) for f in sorted(candidate.rglob('*')) if f.is_file()]
    assembly={'rows':rows,'bytes':sum(r['bytes'] for r in rows)}
    records={item['file']:{'state':'FILE','sha256':item['sha256']} for item in sources}
    inputs={'inputs':[item['file'] for item in sources],'records':records}
    policy={'sources':sources,'assets':assets,'unreviewedFiles':['scripts/heal-self.mjs'],
        'packages':['@vitejs/plugin-react','@fixture/missing'],
        'flags':['NODE_PG_FORCE_NATIVE','WS_NO_BUFFER_UTIL','WS_NO_UTF_8_VALIDATE','HEAL_AUTO_ENABLED']}
    git(root,'init','-q','-b','integration');git(root,'add','.')
    git(root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid',
        '-c','commit.gpgsign=false','commit','-qm','inert runtime contract fixture')
    write(root,'untracked.txt','PRESERVE_EXISTING_UNCOMMITTED_WORK\n')
    return {'root':root,'prior':prior,'server':server,'candidate':candidate,'names':names,
        'policy':policy,'assembly':assembly,'inputs':inputs,
        'evidence':{'status':'CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE',
            'preservation':'OBSERVED_INPUTS_AND_CANDIDATES_PRESERVED',
            'nativeSmoke':{'status':'NATIVE_CANDIDATE_SMOKE_PASS'}}}

def persist(ctx):
    for base,name,value in [('prior','assembly-evidence.json','evidence'),
            ('prior','assembly-manifest-before.json','assembly'),
            ('server','inputs-before-final-build.json','inputs')]:
        write(ctx[base],name,js(ctx[value]),0o600)

def interception(ctx,mode):
    actions={
        'pin_drift':"originalWrite.call(fs,path.join(fixtureRoot,'server/app.mjs'),'CONCURRENT_PIN_EDIT');",
        'selected_drift':"originalWrite.call(fs,path.join(fixtureRoot,'ai/healing/system.md'),'CONCURRENT_ASSET_EDIT');",
        'absent_selected_created':"originalWrite.call(fs,path.join(fixtureRoot,'scripts/heal-self.mjs'),'CONCURRENT_NEW_SELECTED_FILE');",
        'worktree_drift':"originalWrite.call(fs,path.join(fixtureRoot,'untracked.txt'),'CONCURRENT_WORKTREE_EDIT');",
        'retained_drift':"originalWrite.call(fs,path.join(fixturePrior,'assembly-evidence.json'),'{}');",
        'candidate_drift':"originalWrite.call(fs,path.join(fixturePrior,'candidate/server.mjs'),'CONCURRENT_CANDIDATE_EDIT');",
        'candidate_extra':"originalWrite.call(fs,path.join(fixturePrior,'candidate/unexpected.txt'),'UNEXPECTED_FILE');",
        'final_save_collision':"originalWrite.call(fs,path.join(path.dirname(file),'runtime-contract-evidence.json'),'DO_NOT_OVERWRITE',{mode:0o600});",
        'preservation_save_collision':"originalWrite.call(fs,path.join(path.dirname(file),'selected-file-identities-after.json'),'DO_NOT_OVERWRITE',{mode:0o600});",
    }
    action=actions.get(mode,'')
    return '''
const fixtureRoot=__ROOT__,fixturePrior=__PRIOR__;
const originalWrite=fs.writeFileSync,originalRead=fs.readFileSync,originalOpen=fs.openSync;
fs.readFileSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('PRIVATE_ASSET_READ_FORBIDDEN');return originalRead.call(this,file,...args);};
fs.openSync=function(file,...args){if(String(file).endsWith('/.env.fixture'))throw Error('PRIVATE_ASSET_READ_FORBIDDEN');return originalOpen.call(this,file,...args);};
fs.writeFileSync=function(file,...args){const value=originalWrite.call(this,file,...args);
if(String(file).endsWith('/selected-file-identities-before.json')){__ACTION__}
return value;};
'''.replace('__ROOT__',js(str(ctx['root']))).replace('__PRIOR__',js(str(ctx['prior']))).replace('__ACTION__',action)

def adapted(base,ctx,mode):
    pins={file:sha((ctx['root']/file).read_bytes()) for file in ctx['names']}
    src,count=re.subn(r'const PINS = \{.*?\n\};',lambda _: 'const PINS = '+js(pins)+';',base,count=1,flags=re.S)
    assert count==1
    constants={'EXPECTED_ROOT':str(ctx['root']),'EXPECTED_HEAD':git(ctx['root'],'rev-parse','HEAD'),
        'EXPECTED_NODE':NODE_VERSION,'PRIOR_REPORT':str(ctx['prior']),'SERVER_REPORT':str(ctx['server']),
        'EXPECTED_ASSEMBLY_MANIFEST':sha(js(ctx['assembly']).encode()),
        'EXPECTED_SERVER_INPUT_MANIFEST':sha(js(ctx['inputs']).encode())}
    for name,value in constants.items():
        src,count=re.subn(r'const '+name+r" = '[^']*';",lambda _: 'const '+name+' = '+js(value)+';',src,count=1)
        assert count==1,name
    src,count=re.subn(r'const POLICY = \{.*?\n\};',lambda _: 'const POLICY = '+js(ctx['policy'])+';',src,count=1,flags=re.S)
    assert count==1
    src=src.replace("const ROOT = fs.realpathSync('.');","const ROOT = fs.realpathSync('.');\n"+interception(ctx,mode),1)
    return src

def run(label,mode='success',prepare=None,tamper=None,expected_gate=None,changes=(),inspect=None):
    global COUNT
    base=DRIVER.read_text()
    assert 'R14_PURE_HELPERS_PLACEHOLDER' not in base,'Wait for parent to embed pure helpers before running fixtures'
    ctx=setup(base);report=None
    try:
        if prepare:prepare(ctx)
        persist(ctx);src=adapted(base,ctx,mode)
        if tamper:tamper(ctx)
        before=snapshot(ctx['root']);candidate_before=snapshot(ctx['candidate'])
        env={**os.environ,'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1','GIT_OPTIONAL_LOCKS':'0',
            'DATABASE_URL':SECRET,'OPENAI_API_KEY':SECRET,'VITE_SECRET':SECRET,
            'NODE_PG_FORCE_NATIVE':SECRET,'WS_NO_BUFFER_UTIL':'','WS_NO_UTF_8_VALIDATE':'false','HEAL_AUTO_ENABLED':'true'}
        execution=subprocess.run(['node','--input-type=module'],input=src,cwd=ctx['root'],
            capture_output=True,text=True,env=env,timeout=45)
        output=execution.stdout+execution.stderr
        for marker in [SECRET,PRIVATE,'APPLICATION_MUST_NOT_EXECUTE','DEPENDENCY_MUST_NOT_EXECUTE',
                'HEAL_SCRIPT_MUST_NOT_EXECUTE','CANDIDATE_MUST_NOT_EXECUTE','PRIVATE_ASSET_READ_FORBIDDEN']:
            assert marker not in output,(label,'raw data leaked or unintended execution',marker)
        start=execution.stdout.find('\n{')
        assert start>=0,(label,'no result JSON',output[-4000:])
        terminal,_=json.JSONDecoder().raw_decode(execution.stdout[start+1:])
        reports=re.findall(r'^REPORT_DIRECTORY=(.+)$',execution.stdout,re.M)
        assert reports,(label,'no report path');report=Path(reports[-1])
        result=terminal if mode=='final_save_collision' else json.loads((report/'runtime-contract-evidence.json').read_text())
        assert terminal['status']==result['status'] and terminal['evidenceWrite']==result['evidenceWrite'],(label,'terminal result mismatch')
        if mode!='final_save_collision':
            raw=(report/'runtime-contract-evidence.json').read_bytes()
            assert terminal['detailedEvidence']=={'file':'runtime-contract-evidence.json','sha256':sha(raw),'bytes':len(raw)},(label,'terminal evidence identity')
        assert 'packageMetadata' not in terminal and 'assetReviews' not in terminal,(label,'terminal detail compaction missing')
        if expected_gate:
            assert execution.returncode==1 and result['status']=='RUNTIME_CONTRACT_EVIDENCE_FAILED',(label,result)
            assert result['failure']['gate']==expected_gate,(label,result)
        else:
            assert execution.returncode==0 and result['status']=='RUNTIME_CONTRACT_EVIDENCE_COMPLETE',(label,result)
            assert result['preservation']=='OBSERVED_INPUTS_AND_R13_CANDIDATE_PRESERVED',(label,result)
            assert result['releaseReady'] is False and result['dependencyAlignment']=='PENDING'
            assert result['applicationRuntime']=='UNPROVEN' and result['deployedArtifact']=='UNPROVEN'
            assert result['assetSummary']['packagingPerformed'] is False
            assert result['unreviewedSelectedFiles'][0]['review']=='REVIEW_REQUIRED'
            assert result['unreviewedSelectedFiles'][0]['executed'] is False
            if label!='malformed_installed_package_is_invalid_json':
                assert result['packageMetadata'][0]['comparisons']['installedToLock']['versionMatch'] is False
            assert result['packageMetadata'][1]['installed']['state']=='ABSENT'
            assert result['shellFlags']==[
                {'name':'NODE_PG_FORCE_NATIVE','present':True,'nonempty':True,'exactLowercaseTrue':False},
                {'name':'WS_NO_BUFFER_UTIL','present':True,'nonempty':False,'exactLowercaseTrue':False},
                {'name':'WS_NO_UTF_8_VALIDATE','present':True,'nonempty':True,'exactLowercaseTrue':False},
                {'name':'HEAL_AUTO_ENABLED','present':True,'nonempty':True,'exactLowercaseTrue':True}]
        after=snapshot(ctx['root'])
        changed={file for file in set(before)|set(after) if before.get(file)!=after.get(file)}
        assert changed==set(changes),(label,'unexpected workspace edits',changed)
        if mode not in ['candidate_drift','candidate_extra']:
            assert snapshot(ctx['candidate'])==candidate_before,(label,'unexpected candidate edits')
        assert report.stat().st_mode&0o777==0o700
        for name in ['worktree-before.json','worktree-after.json','worktree-comparison.json']:
            assert (report/name).is_file() and (report/name).stat().st_mode&0o777==0o600,(label,name)
        if mode=='final_save_collision':
            assert result['evidenceWrite']=='FAILED'
            assert (report/'runtime-contract-evidence.json').read_text()=='DO_NOT_OVERWRITE'
        else:
            assert result['evidenceWrite']=='SAVED'
            assert json.loads((report/'runtime-contract-evidence.json').read_text())==result
            assert (report/'runtime-contract-evidence.json').stat().st_mode&0o777==0o600
        assert not (report/'candidate').exists(),(label,'collector copied assets')
        assert not any(file.suffix=='.log' for file in report.iterdir()),(label,'unexpected child process log')
        if inspect:inspect(result)
        COUNT+=1;print('CASE='+label+' RESULT=PASS',flush=True)
        return result
    finally:
        for file in [ctx['root'],ctx['prior'],ctx['server'],report]:
            if file:shutil.rmtree(file,ignore_errors=True)

def expect(value,message='fixture expectation'):
    assert value,message

def main():
    run('metadata_only_success_no_project_execution',inspect=lambda r:expect(
        all(s['reviewedSourceMatch'] and s['listedCompilerInput'] and s['retainedInputIdentityMatches'] for s in r['sourceReviews'])
        and all(s['valid'] for s in r['registries'])
        and r['assetSummary']['presentInWorkspace']==6 and r['assetSummary']['presentInCoreCandidate']==1))
    run('unknown_reviewed_source_is_not_qualified',prepare=lambda c:c['policy']['sources'][0].update(sha256='0'*64),
        inspect=lambda r:expect(r['sourceReviews'][0]['classification']=='CURRENT_BYTES_REQUIRE_REVIEW'
            and r['sourceReviews'][0]['conditions']==[] and r['sourceReviews'][0]['reviewedSourceMatch'] is False))
    run('reviewed_source_not_listed_is_distinct',prepare=lambda c:c['inputs']['inputs'].remove('server/lib/promptEngine.mjs'),
        inspect=lambda r:expect(r['sourceReviews'][0]['reviewedSourceMatch'] and not r['sourceReviews'][0]['listedCompilerInput']))
    run('retained_source_identity_mismatch_is_distinct',prepare=lambda c:c['inputs']['records']['server/lib/promptEngine.mjs'].update(sha256='0'*64),
        inspect=lambda r:expect(r['sourceReviews'][0]['reviewedSourceMatch'] and not r['sourceReviews'][0]['retainedInputIdentityMatches']))
    run('candidate_hash_mismatch_stops',tamper=lambda c:write(c['candidate'],'server.mjs','CHANGED'),expected_gate='R13_CANDIDATE_CHANGED')
    run('r13_status_required',prepare=lambda c:c['evidence'].update(status='FAILED'),expected_gate='R13_SUCCESS_REQUIRED')
    run('retained_assembly_hash_mismatch',tamper=lambda c:write(c['prior'],'assembly-manifest-before.json','{}'),expected_gate='R13_ASSEMBLY_MANIFEST_PIN')
    run('retained_input_hash_mismatch',tamper=lambda c:write(c['server'],'inputs-before-final-build.json','{}'),expected_gate='R11D_INPUT_MANIFEST_PIN')
    run('malformed_retained_json_saved_error_without_text',tamper=lambda c:write(c['server'],'inputs-before-final-build.json',PRIVATE+'{'),expected_gate='UNEXPECTED_CONTRACT_FAILURE')
    run('retained_input_shape_rejected',prepare=lambda c:c['inputs'].update(inputs='INVALID'),expected_gate='RETAINED_INPUT_FORMAT')
    run('initial_source_pin_mismatch',tamper=lambda c:write(c['root'],'server/app.mjs','PIN_DRIFT'),expected_gate='R10A_BASELINE_DRIFT')
    run('selected_source_symlink_rejected',prepare=lambda c:((c['root']/'server/lib/promptEngine.mjs').unlink(),
        (c['root']/'server/lib/promptEngine.mjs').symlink_to(c['root']/'.env.fixture')),expected_gate='INPUT_SYMLINK')
    run('candidate_symlink_rejected',tamper=lambda c:(c['candidate']/'external').symlink_to('/etc/passwd'),expected_gate='ARTIFACT_SYMLINK')
    run('asset_absence_is_reported_without_copy',prepare=lambda c:(c['root']/'ai/healing/system.md').unlink(),
        inspect=lambda r:expect(r['assetSummary']['presentInWorkspace']==5 and not r['registries'][0]['valid']
            and any(i['code']=='SYSTEM_ASSET_MISSING_OR_EMPTY' for i in r['registries'][0]['issues'])))
    run('unreviewed_file_absence_is_observed',prepare=lambda c:(c['root']/'scripts/heal-self.mjs').unlink(),
        inspect=lambda r:expect(r['unreviewedSelectedFiles'][0]['current']['state']=='ABSENT'))
    run('malformed_registry_does_not_echo_text',prepare=lambda c:write(c['root'],'ai/healing/registry.json',PRIVATE+'{'),
        inspect=lambda r:expect(not r['registries'][0]['valid'] and any(i['code']=='REGISTRY_INVALID_JSON' for i in r['registries'][0]['issues'])))
    run('registry_traversal_id_never_reads_private_file',prepare=lambda c:write(c['root'],'ai/healing/registry.json',js({
        **registry('healing'),'prompts':[{'id':'../../.env.fixture','risk':SECRET}]})),
        inspect=lambda r:expect(not r['registries'][0]['valid'] and any(i['code']=='PROMPT_ID_INVALID' for i in r['registries'][0]['issues'])))
    run('malformed_hidden_lock_is_metadata_only',prepare=lambda c:write(c['root'],'node_modules/.package-lock.json',PRIVATE+'{'),
        inspect=lambda r:expect(r['hiddenInstallLock']=='INVALID_JSON'))
    run('malformed_installed_package_is_invalid_json',prepare=lambda c:write(c['root'],'node_modules/@vitejs/plugin-react/package.json',PRIVATE+'{'),
        inspect=lambda r:expect(r['packageMetadata'][0]['installed']['state']=='INVALID_JSON'
            and r['packageMetadata'][0]['comparisons']['installedToLock']['versionMatch'] is None))
    run('malformed_root_lock_rejected_without_text',prepare=lambda c:write(c['root'],'package-lock.json',PRIVATE+'{'),expected_gate='ROOT_LOCK_PACKAGES_REQUIRED')
    run('pin_drift_caught','pin_drift',expected_gate='PINNED_FILE_NOT_PRESERVED',changes=['server/app.mjs'])
    run('selected_asset_drift_caught','selected_drift',expected_gate='SELECTED_FILES_NOT_PRESERVED',changes=['ai/healing/system.md'])
    run('absent_selected_file_creation_caught','absent_selected_created',prepare=lambda c:(c['root']/'scripts/heal-self.mjs').unlink(),
        expected_gate='SELECTED_FILES_NOT_PRESERVED',changes=['scripts/heal-self.mjs'])
    run('retained_report_drift_caught','retained_drift',expected_gate='RETAINED_REPORT_NOT_PRESERVED')
    run('candidate_content_drift_caught','candidate_drift',expected_gate='R13_CANDIDATE_NOT_PRESERVED')
    run('candidate_extra_file_caught','candidate_extra',expected_gate='R13_CANDIDATE_NOT_PRESERVED')
    run('unrelated_worktree_drift_caught','worktree_drift',expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',changes=['untracked.txt'])
    run('preservation_report_collision_saved_failure','preservation_save_collision',expected_gate='PRESERVATION_CHECK_FAILED')
    run('final_evidence_collision_stdout_failure','final_save_collision',expected_gate='EVIDENCE_WRITE_FAILED')
    print('FIXTURES='+str(COUNT)+' PASS; ACTUAL_R14_ORCHESTRATION_INERT_DATA_ONLY; PROJECT_CODE_EXECUTED=0 NETWORK=0 DATABASE=0')

if __name__=='__main__':main()
