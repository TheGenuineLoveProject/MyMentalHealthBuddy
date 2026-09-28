from pathlib import Path
import tempfile,importlib.util,subprocess,hashlib,json,contextlib,io,os
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('guard',HERE/'MMHB_AUTH_STORAGE_GUARD_V2.py')
g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
BASE=(HERE/'storage.before.mjs').read_bytes()
results=[]

def git(root,*args,input=None):
    p=subprocess.run(['git','-C',str(root),*args],input=input,capture_output=True,check=True)
    return p.stdout

def fixture():
    t=tempfile.TemporaryDirectory(prefix='mmhb-storage-fixture-');root=Path(t.name)/'repo';root.mkdir()
    git(root,'init','-q');git(root,'config','user.name','Test');git(root,'config','user.email','fixture@example.invalid')
    path=root/g.RELATIVE;path.parent.mkdir(parents=True);path.write_bytes(BASE)
    (root/'unchanged.txt').write_text('KEEP\n');git(root,'add','.');git(root,'commit','-qm','Baseline')
    expected=git(root,'rev-parse','HEAD').decode().strip()
    h={'schema':'MMHB_AUTH_INTEGRATION_SOURCE_V1','project':'MyMentalHealthBuddy','commit':expected,
       'files':[{'path':g.RELATIVE,'bytes':len(BASE),'sha256':g.sha(BASE)}]}
    payload=(json.dumps(h,indent=2)+'\n\n--- '+g.RELATIVE+' ---\n').encode()+BASE+b'\n'
    report=Path(t.name)/'report.txt';report.write_bytes(payload)
    return t,root,report,expected,g.sha(payload)

def run(root,report,e,h,apply=True):
    out=io.StringIO()
    with contextlib.redirect_stdout(out): g.execute(root,report,e,h,apply)
    return out.getvalue()

def check(name,fn):
    try: fn();results.append({'name':name,'pass':True})
    except Exception as e: results.append({'name':name,'pass':False,'error':str(e)})

def basic():
    t,r,p,e,h=fixture()
    with t:
        head=git(r,'rev-parse','HEAD');index=(r/'.git/index').read_bytes()
        out=run(r,p,e,h)
        assert 'STORAGE_GUARD_APPLIED_WITH_LOCAL_CHECKPOINT' in out
        assert (r/g.RELATIVE).read_bytes()==g.transform(BASE)
        assert (r/'unchanged.txt').read_text()=='KEEP\n'
        assert git(r,'rev-parse','HEAD')==head and (r/'.git/index').read_bytes()==index
        assert git(r,'diff','--name-only').decode().strip()==g.RELATIVE
        refs=git(r,'for-each-ref','--format=%(refname)','refs/mmhb-fixes/').decode().splitlines();assert len(refs)==1
        commit=git(r,'rev-parse',refs[0]).decode().strip()
        assert git(r,'show',commit+':'+g.RELATIVE)==g.transform(BASE)
        assert git(r,'rev-parse',commit+'^').decode().strip()==e
check('Apply one file, preserve HEAD/index/other source, create exact local checkpoint',basic)

def repeat():
    t,r,p,e,h=fixture()
    with t:
        run(r,p,e,h);ref=git(r,'for-each-ref','--format=%(objectname)','refs/mmhb-fixes/')
        out=run(r,p,e,h);assert 'PATCH_WRITE=ALREADY_IDENTICAL' in out
        assert git(r,'for-each-ref','--format=%(objectname)','refs/mmhb-fixes/')==ref
check('Repeat execution reuses identical source and checkpoint',repeat)

def dry():
    t,r,p,e,h=fixture()
    with t:
        idx=(r/'.git/index').read_bytes();out=run(r,p,e,h,False)
        assert 'DRY_RUN_READY' in out and (r/g.RELATIVE).read_bytes()==BASE
        assert (r/'.git/index').read_bytes()==idx and not git(r,'for-each-ref','refs/mmhb-fixes/')
check('Default dry run does not write source/checkpoint/index',dry)

def rejected(change,pattern):
    t,r,p,e,h=fixture()
    with t:
        change(r,p);disk=(r/g.RELATIVE).read_bytes();head=git(r,'rev-parse','HEAD')
        try:run(r,p,e,h)
        except (g.Stop,OSError) as exc: assert pattern in str(exc),str(exc)
        else:raise AssertionError('Did not stop')
        assert (r/g.RELATIVE).read_bytes()==disk and git(r,'rev-parse','HEAD')==head
check('Report drift is refused',lambda:rejected(lambda r,p:p.write_bytes(p.read_bytes()+b'!'),'REPORT_HASH_DIFFERS'))
check('Working source drift is refused',lambda:rejected(lambda r,p:(r/g.RELATIVE).write_bytes(BASE+b'//changed\n'),'WORKING_STORAGE_DIFFERS'))
check('Unrelated tracked edits are refused',lambda:rejected(lambda r,p:(r/'unchanged.txt').write_text('edit'),'UNRELATED_TRACKED_EDITS'))
check('Staged edits are refused',lambda:rejected(lambda r,p:( (r/'unchanged.txt').write_text('edit'),git(r,'add','unchanged.txt')),'GIT_COMMAND_FAILED:diff'))
check('Unexpected candidate commit is refused',lambda:rejected(lambda r,p:git(r,'commit','--allow-empty','-qm','moved'),'CANDIDATE_COMMIT_CHANGED'))

def symlink(r,p):
    x=r/g.RELATIVE;x.unlink();other=r/'backup-storage';other.write_bytes(BASE);x.symlink_to(other)
check('Source symlink is refused',lambda:rejected(symlink,'SYMLINK_REFUSED'))

def hardlink(r,p): os.link(r/g.RELATIVE,r/'hardlink-source')
check('Source hardlink is refused',lambda:rejected(hardlink,'HARD_LINKED_SOURCE_REFUSED'))

def hookenv():
    t,r,p,e,h=fixture()
    with t:
        mark=Path(t.name)/'BAD';hook=r/'.git/hooks/reference-transaction';hook.write_text('#!/bin/sh\ntouch '+str(mark)+'\n');hook.chmod(0o755)
        env=dict(os.environ)
        try:
            os.environ['GIT_DIR']='/no/such/repository';os.environ['GIT_INDEX_FILE']='/no/index';os.environ['NODE_OPTIONS']='--invalid-mm-hb'
            out=run(r,p,e,h);assert 'STORAGE_GUARD_APPLIED_WITH_LOCAL_CHECKPOINT' in out and not mark.exists()
        finally:os.environ.clear();os.environ.update(env)
check('Inherited Git routing/Node options and reference hook are suppressed',hookenv)

def conflict():
    t,r,p,e,h=fixture()
    with t:
        ref='refs/mmhb-fixes/storage-guard-v2-'+g.sha(g.transform(BASE))[:16]
        git(r,'update-ref',ref,e)
        try:run(r,p,e,h)
        except g.Stop as exc: assert str(exc)=='EXISTING_CHECKPOINT_DIFFERS'
        else:raise AssertionError('Expected refusal')
        assert (r/g.RELATIVE).read_bytes()==BASE
check('Conflicting safety reference prevents source edit',conflict)
summary={'schema':'MMHB_STORAGE_PATCH_HELPER_TESTS_V1','tests':results,'total':len(results),'passed':sum(x['pass'] for x in results),
 'scope':'Disposable Git repositories using supplied storage body; no Replit or production database execution'}
(HERE/'helper-results.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2));assert summary['total']==summary['passed']
