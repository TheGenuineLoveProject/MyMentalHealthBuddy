"""R18F integration against genuine Git and existing R18C retained-data fixtures."""
from pathlib import Path
import hashlib, importlib.util, json, os, re, subprocess, tempfile, zipfile

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('r18c_fixture',HERE/'test-r18c-driver.py')
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
SOURCE=(HERE/'runtime-contract-driver-r18f.mjs').read_text()
catalog=f.declaration(SOURCE,'DELIVERED_REVIEW_BLOBS')
raws={}
for p in json.loads((HERE/'r18f-catalog-provenance.json').read_text())['archives']:
    zpath=HERE.parent/p['file']
    with zipfile.ZipFile(zpath) as z:
        for m in z.infolist():
            if m.is_dir():continue
            rel=m.filename.removeprefix(zpath.stem+'/')
            name=zpath.stem+'/'+rel
            raws[name]=z.read(m)
selected=sorted(raws)[:508]
assert len(selected)==508
for name in selected:
    raw=raws[name]
    assert hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest() in catalog[name]

def run(mode):
    with tempfile.TemporaryDirectory(prefix='mmhb-r18f-fixture-') as d:
        tmp=Path(d)
        root,prior,retained,candidate,source,refresh=f.seed(tmp,SOURCE)
        old=f.git(root,'rev-parse','HEAD')
        names=selected[:-1] if mode in ['unknown_application_addition','modified_tracked_source','deleted_tracked_source','count_mismatch'] else selected
        for name in names:f.write(root,name,raws[name])
        if mode=='changed_delivered_bytes':f.write(root,names[0],b'UNREVIEWED_CHANGED_BYTES')
        elif mode=='unknown_application_addition':f.write(root,'server/unknown-added.mjs',b'throw Error("MUST_NOT_EXECUTE");')
        elif mode=='modified_tracked_source':f.write(root,'server/app.mjs',b'MODIFIED_APP_MUST_NOT_EXECUTE')
        elif mode=='deleted_tracked_source':(root/'user-work.txt').unlink()
        elif mode=='executable_addition':(root/names[0]).chmod(0o700)
        elif mode=='symlink_addition':
            (root/names[0]).unlink();(root/names[0]).symlink_to(root/'user-work.txt')
        if mode=='wrong_parent':f.git(root,'commit','--allow-empty','-qm','extra parent')
        f.git(root,'add','--all');f.git(root,'commit','-qm','delivered review additions')
        new=f.git(root,'rev-parse','HEAD')
        source=f.replace_const(source,'OBSERVED_HEAD',new)
        assert f.declaration(source,'EXPECTED_HEAD')==old
        if mode=='current_source_drift':f.write(root,'server/app.mjs',b'USER_WORK_MUST_BE_PRESERVED')
        script=f.write(tmp,'driver.mjs',source)
        guard,trace=f.preload(tmp,root,'normal')
        guard_source=guard.read_text().replace('r18c-','r18f-')
        guard_source=guard_source.replace("let i=0;while(args[i]==='-c')i+=2;const command=args[i];",
          "let i=0;while(args[i]==='-c'||args[i]?.startsWith('--no-')){i+=args[i]==='-c'?2:1;}const command=args[i];")
        guard_source=guard_source.replace("['rev-parse','branch','ls-files','check-ignore']",
          "['rev-parse','branch','ls-files','check-ignore','rev-list','diff']")
        guard.write_text(guard_source)
        before=f.original_files(root)
        env={**os.environ,'OPENAI_API_KEY':f.SECRET,'DATABASE_URL':f.SECRET,'RESEND_API_KEY':f.SECRET,
             'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1'}
        env.pop('NODE_PATH',None);env.pop('NODE_V8_COVERAGE',None)
        proc=subprocess.run([f.NODE,'--experimental-vm-modules','--import',str(guard),str(script)],cwd=root,
                            env=env,text=True,capture_output=True,timeout=60)
        assert f.SECRET not in proc.stdout+proc.stderr,mode
        start=proc.stdout.index('{\n  "project":')
        result=json.JSONDecoder().raw_decode(proc.stdout[start:])[0]
        ops=[json.loads(line) for line in trace.read_text().splitlines()]
        assert all(x['allowed'] for x in ops),(mode,ops)
        assert not any(x['kind'] in ['transport','applicationModuleLoad'] for x in ops)
        after=f.original_files(root)
        assert all(after.get(k)==v for k,v in before.items()),mode
        added=set(after)-set(before)
        assert all(re.fullmatch(r'\.mmhb-release-evidence/r18f-[A-Za-z0-9]{6}/[^/]+\.json',name) for name in added),added
        assert result['releaseReady'] is False and result['applicationRuntime']=='UNPROVEN'
        if mode=='success_508_known_additions':
            assert proc.returncode==0,(result,proc.stderr)
            assert result['gitBaselineReview']['matchedAdditions']==508
            assert result['gitBaselineReview']['unmatchedCount']==0
            assert sum(x['paths'] for x in result['gitBaselineReview']['groups'])==508
            assert result['status']=='RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE'
            assert result['execution']=={'helperTestsAttempted':True,'resendTestsAttempted':True}
            assert result['helperSmokes']['checkCount']==11 and result['resendSmoke']['caseCount']==20
        else:
            failure={'count_mismatch':'COMMITTED_CHANGE_COUNT','wrong_parent':'OBSERVED_COMMIT_PARENT',
                     'current_source_drift':'RETAINED_INPUT_CHANGED'}.get(mode,'COMMITTED_CHANGES_REQUIRE_REVIEW')
            assert proc.returncode==1 and result['failure']['gate']==failure,(mode,result)
            assert result['execution']=={'helperTestsAttempted':False,'resendTestsAttempted':False},mode
            if failure=='COMMITTED_CHANGES_REQUIRE_REVIEW':
                review=result['gitBaselineReview']
                assert review['changedPaths']==508 and review['unmatchedCount']==1,(mode,review)
                assert len(review['unmatched'])==1
        for name in added:assert f.SECRET not in (root/name).read_text(),name
        item={'case':mode,'status':'PASS','observedStatus':result['status'],'failure':result.get('failure'),
              'existingFilesPreserved':len(before),'execution':result['execution'],'realTransportAttempts':0}
        print(json.dumps(item),flush=True)
        return item

results=[run(mode) for mode in ['success_508_known_additions','changed_delivered_bytes','unknown_application_addition',
          'modified_tracked_source','deleted_tracked_source','executable_addition','symlink_addition',
          'count_mismatch','wrong_parent','current_source_drift']]
record={'status':'PASS','fixtureCount':len(results),'node':f.VERSION,'driverSha256':f.sha(SOURCE.encode()),
        'scope':'LOCAL_REAL_GIT_AND_RETAINED_FIXTURES_NOT_REPLIT_OR_LIVE_APP','fixtures':results}
(HERE/'r18f-driver-fixture-results.json').write_text(json.dumps(record,indent=2)+'\n')
