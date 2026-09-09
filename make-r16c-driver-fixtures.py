from pathlib import Path

HERE=Path(__file__).resolve().parent
text=(HERE/'test-locked-dependencies-r16a.py').read_text()
text=text.replace('locked-dependencies-driver-r16a.mjs','locked-dependencies-driver-r16c.mjs').replace('locked-dependencies-prefix-r16a.mjs','locked-dependencies-prefix-r16c.mjs')
text=text.replace('LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE','REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE').replace("=='LOCKED_STAGE_METADATA_PASS'","=='REGISTRY_NORMALIZED_LOCKED_STAGE_METADATA_PASS'")
text=text.replace("for name in ['package.json','package-lock.json']:\n                assert (stage/name).read_bytes()==(ctx['root']/name).read_bytes()", """assert (stage/'package.json').read_bytes()==(ctx['root']/'package.json').read_bytes()
            original=json.loads((ctx['root']/'package-lock.json').read_text())
            staged=json.loads((stage/'package-lock.json').read_text())
            for file,entry in original['packages'].items():
                if file:staged['packages'][file]['resolved']=entry['resolved']
            assert staged==original,'private lock contains an unexpected non-URL change'
            assert result['archiveSources']['status']=='ARCHIVE_SOURCES_VERIFIED'""")

needle='    src = src.replace("const ROOT = fs.realpathSync(\'.\');","const ROOT = fs.realpathSync(\'.\');\\n"+injected,1)'
assert needle in text
injection='''    injected += "const fixtureRegistryMode="+js(mode)+";\\n"
    injected += r\'\'\'
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
  if(fixtureRegistryMode==='registry_lock_drift')fs.appendFileSync(path.join(ROOT,'package-lock.json'),'\\n');
  callback(response);
  if(!response.destroyed)response.end(JSON.stringify(value));
 });return request;
};
\'\'\'
'''
text=text.replace(needle,injection+needle,1)
text=text.replace("for marker in (SECRET,UNKNOWN,", "for marker in (SECRET,UNKNOWN,'FIXTURE_PRIVATE_URL_SECRET',")
text=text.replace("report=Path(reports[-1]) if reports else None", """report=Path(reports[-1]) if reports else None
        terminal=result
        if report and (report/'locked-dependencies-evidence.json').is_file():
            result=json.loads((report/'locked-dependencies-evidence.json').read_text())
            assert result['status']==terminal['status']
            assert result['npmProcess']['started']==terminal['npmProcess']['started']""")
text=text.replace("if inspect:inspect(ctx,report,result)","""if report and (report/'fixture-registry-requests.json').exists():
            requests=json.loads((report/'fixture-registry-requests.json').read_text())
            for request in requests:
                assert request['hostname']=='registry.npmjs.org'
                assert request['rejectUnauthorized'] is True
                assert request['method']=='GET'
                assert request['headerNames']==['Accept','Accept-Encoding','User-Agent']
        if inspect:inspect(ctx,report,result)""")
old="run('bad registry blocks before child',prepare=lambda c:rewrite_lock(c,lambda l:l['packages']['node_modules/resend'].update(resolved='https://example.invalid/resend.tgz')),expected_gate='ARCHIVE_URL_NOT_ALLOWED')"
new="""run('HTTP mirror URLs repaired and verified before private install',prepare=mirror,child_started=1,inspect=inspect_repair)
    run('public registry identity mismatch blocks npm',mode='registry_identity_mismatch',prepare=mirror,expected_gate='REGISTRY_TARBALL_IDENTITY_MISMATCH')
    run('public registry integrity mismatch blocks npm',mode='registry_integrity_mismatch',prepare=mirror,expected_gate='REGISTRY_INTEGRITY_MISMATCH')
    run('unpublished package 404 blocks npm',mode='registry_404',prepare=mirror,expected_gate='REGISTRY_HTTP_404')
    run('concurrent source edit during registry requests is preserved',mode='registry_input_drift',prepare=mirror,expected_gate='GIT_OR_WORKTREE_NOT_PRESERVED',expected_changes=['untracked.txt'])
    run('root lock edit during registry requests is preserved',mode='registry_lock_drift',prepare=mirror,expected_gate='OBSERVED_WORKSPACE_INPUT_CHANGED',expected_changes=['package-lock.json'])
    run('credential archive URL cannot be normalized',prepare=lambda c:rewrite_lock(c,lambda l:l['packages']['node_modules/resend'].update(resolved='https://FIXTURE_PRIVATE_URL_SECRET@mirror.invalid/archive')),expected_gate='ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED')"""
assert old in text
text=text.replace(old,new)
addition="""
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

"""
text=text.replace("if __name__=='__main__':",addition+"if __name__=='__main__':")
text=text.replace('r16a-driver-fixture-results.json','r16c-driver-fixture-results.json').replace('R16A_DRIVER_FIXTURE_TESTS','R16C_DRIVER_FIXTURE_TESTS').replace('ACTUAL_DRIVER_WITH_INERT_NPM_CLI_NO_REGISTRY_OR_APPLICATION','ACTUAL_R16C_DRIVER_WITH_INERT_NPM_CLI_AND_SYNTHETIC_HTTPS_NO_EXTERNAL_REGISTRY_OR_APPLICATION')
(HERE/'test-locked-dependencies-r16c.py').write_text(text)
