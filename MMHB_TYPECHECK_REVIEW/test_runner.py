"""Disposable-repository tests. Uses already installed Node/TypeScript, no installs."""
import importlib.util, pathlib, tempfile, subprocess, json, shutil, sys, os, contextlib, io
P=pathlib.Path
helper=P(sys.argv[1] if len(sys.argv)>1 else '/mnt/data/MMHB_TYPECHECK_CANDIDATE.py')
spec=importlib.util.spec_from_file_location('runner',helper);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
node=shutil.which('node')
major=int(subprocess.check_output([node,'--version'],text=True).strip().split('.')[0][1:])
globalmods=P(node).resolve().parent.parent/'lib/node_modules'
tsver=json.loads((globalmods/'typescript/package.json').read_text())['version']
ENV={**os.environ,'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null',
     'GIT_AUTHOR_NAME':'Fixture','GIT_AUTHOR_EMAIL':'fixture@example.invalid',
     'GIT_COMMITTER_NAME':'Fixture','GIT_COMMITTER_EMAIL':'fixture@example.invalid'}
def g(cwd,*args,data=None):
 p=subprocess.run(['git',*args],cwd=cwd,env=ENV,input=data,capture_output=True)
 if p.returncode:raise RuntimeError(p.stderr.decode())
 return p.stdout.decode().strip()

def fixture(root,source='export const numberValue: number = 1;\n'):
 root.mkdir();g(root,'init','-q')
 (root/'src').mkdir();(root/'src/main.ts').write_text(source)
 (root/'package.json').write_text(json.dumps({'name':'fixture','scripts':{'typecheck':'tsc --noEmit'}}))
 (root/'package-lock.json').write_text(json.dumps({'lockfileVersion':3,'packages':{'node_modules/typescript':{'version':tsver}}}))
 (root/'tsconfig.json').write_text(json.dumps({'compilerOptions':{'strict':True,'target':'ES2020','module':'ESNext','types':[]},'files':['src/main.ts']}))
 g(root,'add','.');g(root,'commit','-qm','fixture base');base=g(root,'rev-parse','HEAD')
 store=root/'.git/independent.git'
 g(root,'clone','--bare','--no-hardlinks',str(root),str(store))
 work=root/'.local/candidate';work.parent.mkdir()
 g(root,'--git-dir='+str(store),'worktree','add','--detach',str(work),base)
 g(root,'--git-dir='+str(store),'worktree','lock',str(work))
 tree=g(root,'--git-dir='+str(store),'rev-parse',base+'^{tree}')
 commit=g(root,'--git-dir='+str(store),'commit-tree',tree,'-p',base,data=b'checkpoint\n')
 ref='refs/fixture/latest';g(root,'--git-dir='+str(store),'update-ref',ref,commit)
 (root/'node_modules').symlink_to(globalmods,target_is_directory=True)
 return dict(root=root,work=work,store=store,checkpoint=commit,parent=base,ref=ref,base=base,node_major=major)

results=[]
def test(name,fn):
 try:fn();results.append({'test':name,'pass':True})
 except Exception as e:results.append({'test':name,'pass':False,'error':repr(e)})

def execute(kw):
 with contextlib.redirect_stdout(io.StringIO()):return m.execute(**kw)

def compile_pass():
 with tempfile.TemporaryDirectory() as t:
  kw=fixture(P(t)/'root');report,code=execute(kw)
  assert code==0 and report['status']=='CONFIGURED_TYPESCRIPT_CHECK_PASS'
  assert report['trackedSourceAndCheckedMetadataUnchanged'] and report['configuredFiles']==1
  assert not list(kw['work'].rglob('*.js'))
  assert P(report['logFile']).parent.joinpath('typecheck.tsbuildinfo').exists()
  assert not list(kw['work'].rglob('*.tsbuildinfo'))

def compile_fail():
 with tempfile.TemporaryDirectory() as t:
  kw=fixture(P(t)/'root','export const numberValue: number = "wrong";\n');report,code=execute(kw)
  assert code!=0 and report['diagnosticCounts'].get('TS2322')==1
  assert report['trackedSourceAndCheckedMetadataUnchanged']
  assert 'TS2322' in P(report['logFile']).read_text()

def stops(name,mutate,expected):
 def f():
  with tempfile.TemporaryDirectory() as t:
   kw=fixture(P(t)/'root');mutate(kw)
   try:execute(kw)
   except (m.Stop,FileNotFoundError) as e:assert expected in str(e),(expected,str(e))
   else:raise AssertionError('Did not stop')
 test(name,f)

test('actual_compiler_success_and_buildinfo_outside_source',compile_pass)
test('actual_compiler_failure_retains_diagnostics_and_source',compile_fail)
stops('source_drift_refused',lambda k:(k['work']/'src/main.ts').write_text('different\n'),'WORKING_SOURCE_DIFFERS')
stops('missing_git_marker_refused',lambda k:(k['work']/'.git').unlink(),'.git')
stops('checkpoint_ref_drift_refused',lambda k:g(k['root'],'--git-dir='+str(k['store']),'update-ref',k['ref'],k['base']),'CHECKPOINT_REF_CHANGED')
stops('wrong_node_major_refused',lambda k:k.update(node_major=987),'NODE_24_REQUIRED')
stops('missing_source_file_refused',lambda k:(k['work']/'src/main.ts').unlink(),'main.ts')
def wrong_parent(k): k['parent']='0'*40
stops('wrong_checkpoint_parent_refused',wrong_parent,'CHECKPOINT_PARENT_CHANGED')
def mismatch(k):
 original=m.run
 def injected(cmd,cwd,timeout=30):
  data=original(cmd,cwd,timeout)
  if '-e' in cmd and m.RESOLVE in cmd:
   record=json.loads(data);record['version']='0.0.0';return json.dumps(record).encode()
  return data
 m.run=injected
stops('installed_compiler_version_mismatch_refused',mismatch,'TYPESCRIPT_VERSION_DIFFERS')
# Restore the module after this injection; subsequent tests use ordinary helpers.
spec.loader.exec_module(m)
def env_test():
 old={n:os.environ.get(n) for n in ('NODE_OPTIONS','DATABASE_URL','PGHOST','GIT_DIR','NODE_PATH')}
 try:
  for n in old:os.environ[n]='SYNTHETIC_MUST_NOT_PROPAGATE'
  assert all(n not in m.clean_env() for n in old)
 finally:
  for n,v in old.items():
   if v is None:os.environ.pop(n,None)
   else:os.environ[n]=v
test('runtime_secrets_and_preloads_not_forwarded',env_test)
report={'schema':'MMHB_TYPECHECK_HELPER_FIXTURE_RESULTS_V1','node':subprocess.check_output([node,'--version'],text=True).strip(),
 'typescript':tsver,'scope':'Two real compilations of tiny fixture projects plus preflight/preservation checks. NOT the MMHB project or Node 24 qualification.',
 'total':len(results),'passed':sum(r['pass'] for r in results),'results':results}
print(json.dumps(report,indent=2))
raise SystemExit(0 if report['passed']==report['total'] else 1)
