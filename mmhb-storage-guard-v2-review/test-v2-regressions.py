from pathlib import Path
import contextlib, hashlib, importlib.util, io, json, subprocess, tempfile
HERE=Path(__file__).resolve().parent

def module(name, filename):
    spec=importlib.util.spec_from_file_location(name,HERE/filename)
    m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
old=module('old','V1_original_helper.py')
g=module('new','MMHB_AUTH_STORAGE_GUARD_V2.py')
BASE=(HERE/'storage.before.mjs').read_bytes()
UPPER=(HERE/'V1_incorrect_fixture.mjs').read_bytes()
results=[]

def git(root,*args,data=None):
    p=subprocess.run(['git','-C',str(root),*args],input=data,capture_output=True,check=True)
    return p.stdout

def report(root, expected, body, directory):
    head={'schema':'MMHB_AUTH_INTEGRATION_SOURCE_V1','project':'MyMentalHealthBuddy','commit':expected,
          'files':[{'path':g.RELATIVE,'bytes':len(body),'sha256':g.sha(body)}]}
    payload=(json.dumps(head,indent=2)+'\n\n--- '+g.RELATIVE+' ---\n').encode()+body+b'\n'
    p=directory/'report.txt';p.write_bytes(payload);return p,g.sha(payload)

def fixture(directory,body=BASE,linked=False):
    source=directory/'source';source.mkdir()
    git(source,'init','-q');git(source,'config','user.name','MMHB Fixture');git(source,'config','user.email','fixture@example.invalid')
    target=source/g.RELATIVE;target.parent.mkdir(parents=True);target.write_bytes(body)
    (source/'keep.txt').write_bytes(b'unchanged\n');git(source,'add','.');git(source,'commit','-qm','fixture')
    e=git(source,'rev-parse','HEAD').decode().strip();root=source
    if linked:
        bare=directory/'restored.git'
        subprocess.run(['git','clone','--bare','--local',str(source),str(bare)],check=True,capture_output=True)
        root=directory/'candidate'
        git(bare,'worktree','add','--detach',str(root),e)
    p,h=report(root,e,body,directory)
    return root,p,e,h

def run(m,root,p,e,h,apply=True):
    output=io.StringIO()
    with contextlib.redirect_stdout(output):m.execute(root,p,e,h,apply)
    return output.getvalue()

def snapshot(root):
    gitdir=Path(git(root,'rev-parse','--absolute-git-dir').decode().strip())
    common=Path(git(root,'rev-parse','--path-format=absolute','--git-common-dir').decode().strip())
    return {'source':(root/g.RELATIVE).read_bytes(),'index':(gitdir/'index').read_bytes(),
            'head':git(root,'rev-parse','HEAD'),'refs':git(root,'for-each-ref'),
            'config':(common/'config').read_bytes()}

def check(name,fn):
    try: detail=fn();results.append({'name':name,'pass':True,**(detail or {})})
    except Exception as exc:results.append({'name':name,'pass':False,'error':str(exc)})

def blob_identity():
    assert BASE.replace(b'@replit.auth',b'@Replit.auth')==UPPER
    obj=hashlib.sha1(b'blob '+str(len(BASE)).encode()+b'\0'+BASE).hexdigest()
    assert obj=='dc3ff519e39f3f0c33e9fbe42ffeff7656e7191e'
    return {'bytes':len(BASE),'github_blob_id':obj,'source_sha256':g.sha(BASE),'difference':'one R/r character in fallback-email string'}
check('Immutable GitHub blob identity and one-character fixture mismatch',blob_identity)

def reproduce():
    with tempfile.TemporaryDirectory() as d:
        r,p,e,h=fixture(Path(d));before=snapshot(r)
        try:run(old,r,p,e,h)
        except old.Stop as exc:assert str(exc)=='UNREVIEWED_STORAGE_BODY'
        else:raise AssertionError('Original helper unexpectedly accepted actual baseline')
        assert snapshot(r)==before
        assert not list((r/'.git').glob('mmhb-storage-guard*'))
        return {'observed_stop':'UNREVIEWED_STORAGE_BODY','source_head_index_refs_config':'unchanged'}
check('Reproduce original reported stop after valid report/commit checks, before writes',reproduce)

def refuse_body(body):
    with tempfile.TemporaryDirectory() as d:
        r,p,e,h=fixture(Path(d),body);before=snapshot(r)
        try:run(g,r,p,e,h)
        except g.Stop as exc:assert str(exc)=='UNREVIEWED_STORAGE_BYTES',str(exc)
        else:raise AssertionError('Unreviewed baseline accepted')
        assert snapshot(r)==before
check('V2 rejects uppercase reference even with internally consistent fixture report/commit',lambda:refuse_body(UPPER))
check('V2 rejects even whitespace drift rather than normalizing the JavaScript source',lambda:refuse_body(BASE+b'\n'))
check('V2 rejects semantic code change rather than updating its expected fingerprint',lambda:refuse_body(BASE.replace(b"role: shouldBeAdmin ? 'admin' : 'user',",b"role: 'admin',")))

def linked():
    with tempfile.TemporaryDirectory() as d:
        r,p,e,h=fixture(Path(d),linked=True);before=snapshot(r)
        out=run(g,r,p,e,h)
        after=snapshot(r)
        assert 'STORAGE_GUARD_APPLIED_WITH_LOCAL_CHECKPOINT' in out
        assert all(before[x]==after[x] for x in ('head','index','config'))
        assert after['source']==g.transform(BASE)
        assert b'@replit.auth' in after['source'] and b'@Replit.auth' not in after['source']
        refs=git(r,'for-each-ref','--format=%(refname)','refs/mmhb-fixes/').decode().splitlines()
        assert len(refs)==1 and refs[0].startswith('refs/mmhb-fixes/storage-guard-v2-')
        assert git(r,'diff-tree','--no-commit-id','--name-only','-r',refs[0]).decode().strip()==g.RELATIVE
        assert git(r,'cat-file','blob',refs[0]+':'+g.RELATIVE)==after['source']
        again=run(g,r,p,e,h)
        assert 'PATCH_WRITE=ALREADY_IDENTICAL' in again
        return {'mode':'detached worktree attached to independent bare repository','new_checkpoint_files':1}
check('Apply and repeat in restored detached-worktree layout; exact one-file checkpoint',linked)

def split():
    with tempfile.TemporaryDirectory() as d:
        r,p,e,h=fixture(Path(d),linked=True)
        git(r,'update-index','--split-index');before=snapshot(r)
        run(g,r,p,e,h);after=snapshot(r)
        assert all(before[x]==after[x] for x in ('head','index','config'))
        assert after['source']==g.transform(BASE)
check('Split-index detached worktree preserves existing index',split)

summary={'schema':'MMHB_STORAGE_V2_REGRESSION_TESTS','tests':results,'total':len(results),'passed':sum(x['pass'] for x in results)}
(HERE/'regression-results.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2));assert summary['passed']==summary['total']
