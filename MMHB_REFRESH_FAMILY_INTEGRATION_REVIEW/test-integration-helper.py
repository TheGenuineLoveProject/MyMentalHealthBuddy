#!/usr/bin/env python3
"""Disposable-repository tests for the integration helper.
Unrelated frozen account source and generator are explicit fixture sentinels;
production hashes remain unchanged in the shipped helper. No PostgreSQL tests here.
"""
from pathlib import Path
import tempfile,subprocess,hashlib,json,zipfile,types,sys,os,contextlib,io,ast
HERE=Path(__file__).resolve().parent
HP=HERE/'MMHB_REFRESH_FAMILY_INTEGRATE.py'
if len(sys.argv)>1:HP=Path(sys.argv[1]).resolve()
ASSETS=HERE
sha=lambda b:hashlib.sha256(b).hexdigest()
def module():
 m=types.ModuleType('helper_under_test');m.__file__=str(HP);exec(compile(HP.read_bytes(),str(HP),'exec'),m.__dict__)
 return m
# Each test fixture is explicitly isolated from /home/runner and the real evidence files.
FIX_SOURCE={str(p.relative_to(HERE/'fixture-source')):p.read_bytes() for p in (HERE/'fixture-source').rglob('*') if p.is_file()}
BEFORE_V=(ASSETS/'before/scripts/security/verify-auth-session-contracts.mjs').read_bytes()
PKG=(ASSETS/'before/package.json').read_bytes()
class Fixture:
 def __init__(self,root):
  self.m=module();m=self.m; self.root=root;self.work=root/'workspace/.local/mmhb-candidates/a4-63ff8372';self.outer=root/'workspace';self.store=self.outer/'.git/proof/restore.git'
  self.store.mkdir(parents=True)
  self.cmd(['git','init','--bare',str(self.store)])
  self.cmd(['git','--git-dir='+str(self.store),'config','user.name','Synthetic Test'])
  self.cmd(['git','--git-dir='+str(self.store),'config','user.email','test@example.invalid'])
  self.cmd(['git','--git-dir='+str(self.store),'worktree','add','--orphan','-b','fixture',str(self.work)])
  self.put('package.json',PKG);self.put('package-lock.json',json.dumps({'lockfileVersion':3,'packages':{'node_modules/pg':{'version':'8.23.0'},'node_modules/drizzle-orm':{'version':'0.45.2'}}}).encode())
  self.put('scripts/security/verify-auth-session-contracts.mjs',BEFORE_V)
  self.account=b'// SYNTHETIC FROZEN ACCOUNT FIXTURE, no runtime behavior\n'
  self.put('server/routes/account.mjs',self.account)
  self.put('scripts/generate-canonical-schema.mjs',b'// SYNTHETIC UNCHANGED GENERATOR FIXTURE\n')
  for n,b in FIX_SOURCE.items():self.put(n,b)
  # Set up two real commits; final helpers leave the baseline index/HEAD untouched.
  self.put('baseline-marker.txt',b'BASELINE\n');self.g('add','--all');self.g('commit','-m','fixture baseline');self.base=self.g('rev-parse','HEAD').decode().strip()
  self.put('baseline-marker.txt',b'PRIOR PARENT\n');self.g('add','baseline-marker.txt');self.g('commit','-m','prior parent');prior=self.g('rev-parse','HEAD').decode().strip()
  self.put('baseline-marker.txt',b'BASELINE\n');self.g('add','baseline-marker.txt');self.g('commit','-m','combined checkpoint');self.parent=self.g('rev-parse','HEAD').decode().strip()
  self.g('checkout','--detach',self.base)
  self.cmd(['git','--git-dir='+str(self.store),'worktree','lock','--reason','fixture keep',str(self.work)])
  self.cmd(['git','--git-dir='+str(self.store),'update-ref',m.PARENT_REF,self.parent])
  m.PROTECTED['server/routes/account.mjs']=sha(self.account)
  m.PAYLOAD[m.VERIFY_PATH]=m.PAYLOAD[m.VERIFY_PATH].replace(b'e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331',sha(self.account).encode())
  m.PAYLOAD_HASHES={k:sha(b) for k,b in m.PAYLOAD.items()};m.PAYLOAD_ID=sha(json.dumps(m.PAYLOAD_HASHES,sort_keys=True).encode())
  m.GENERATOR_BLOB=self.g('rev-parse',self.parent+':scripts/generate-canonical-schema.mjs').decode().strip();m.PRIOR_PARENT=prior
  self.proofs()
 def cmd(self,args):
  p=subprocess.run(args,env={**{k:v for k,v in os.environ.items() if not k.startswith('GIT_')},'GIT_CONFIG_GLOBAL':'/dev/null','GIT_CONFIG_NOSYSTEM':'1'},stdout=subprocess.PIPE,stderr=subprocess.PIPE)
  if p.returncode:raise AssertionError((args,p.stderr.decode()))
  return p.stdout
 def g(self,*a):return self.cmd(['git','-C',str(self.work),*a])
 def put(self,n,b):
  p=self.work/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
 def proofs(self):
  m=self.m;results=lambda n:[{'test':f'SYNTHETIC_HARNESS_ASSERTION_{i}','pass':True} for i in range(n)]
  s={'schema':'MMHB_REFRESH_FAMILY_POSTGRES_QUALIFICATION_V1','checkpoint':self.parent,'prototypeSqlSha256':m.SQL_SHA,'passed':31,'total':31,'results':results(31),'error':None,'testClusterStopped':True,'existingSourceAndCandidateMetadataUnchanged':True,'applicationSourceEdits':0,'liveDatabaseConnections':0,'fixtureOnly':True}
  sr=json.dumps(s).encode();(self.outer/m.SQL_REPORT).write_bytes(sr)
  lock=(self.work/'package-lock.json').read_bytes()
  a={'schema':'MMHB_REFRESH_ADAPTER_QUALIFICATION_V1','checkpoint':self.parent,'previousSqlEvidenceSha256':sha(sr),'sqlSha256':m.SQL_SHA,'adapterSha256':m.ADAPTER_SHA,'candidateLockfileSha256':sha(lock),'dependencyVersions':{'pg':'8.23.0','drizzle-orm':'0.45.2'},'node':'v24.13.0','boundary':{'total':33,'passed':33,'results':results(33)},'integration':{'planned':24,'total':24,'passed':24,'poolsClosed':True,'results':results(24)},'error':None,'testClusterStopped':True,'existingSourceAndMetadataUnchanged':True,'sourceEdits':0,'liveDatabaseConnections':0,'applicationStart':False,'applicationIntegration':'NOT_APPLIED','fixtureOnly':True}
  (self.outer/m.ADAPTER_REPORT).write_text(json.dumps(a))
 def execute(self,apply=True):
  out=io.StringIO()
  with contextlib.redirect_stdout(out):
   r=self.m.execute(root=self.outer,work=self.work,store=self.store,base=self.base,parent=self.parent,apply=apply,node_major=int(subprocess.check_output(['node','--version'],text=True).strip().split('.')[0][1:]))
  return r,out.getvalue()
 def snap(self):
  a=Path((self.work/'.git').read_text().strip()[8:]);
  return {str(p):sha(p.read_bytes()) for p in [self.work/'.git',a/'index',a/'HEAD',a/'locked',self.store/'config']}
 def stop(self,text):
  try:self.execute()
  except Exception as e:
   assert text in str(e),(text,str(e));return
  raise AssertionError('Did not stop:'+text)

tests=[];register=lambda name,fn:tests.append((name,fn));
def basic(f):
 before=f.snap();r,out=f.execute();assert r['sourceWrites']==7;assert before==f.snap();assert r['priorGuardsPreserved'];
 assert 'UPDATED_AUTH_SOURCE_VERIFIER=PASS' in out
 for p,b in f.m.PAYLOAD.items():assert (f.work/p).read_bytes()==b
 assert f.g('rev-parse','HEAD').decode().strip()==f.base
 return r
register('fresh_integration_preserves_head_index_and_six_guards',basic)
def repeat(f):
 r=basic(f);r2,out=f.execute();assert r2['sourceWrites']==0 and r2['checkpoint']==r['checkpoint']
register('repeat_reuses_checkpoint_and_writes_zero',repeat)
def dry(f):
 snap=f.snap();refs=f.g('for-each-ref');r,o=f.execute(False);assert r['status']=='DRY_RUN';assert snap==f.snap();assert refs==f.g('for-each-ref')
 assert not (f.work/f.m.ADAPTER_PATH).exists()
register('dry_run_changes_no_source_or_refs',dry)
def partial(f):
 for n in [f.m.ADAPTER_PATH,f.m.SERVICE_PATH]:f.put(n,f.m.PAYLOAD[n])
 r,o=f.execute();assert r['sourceWrites']==5
register('known_partial_application_resumes',partial)
def test_missing(f):
 (f.outer/f.m.ADAPTER_REPORT).unlink();f.stop('No such file')
register('missing_evidence_stops_without_recreating_results',test_missing)
def proof_tamper(f):
 p=f.outer/f.m.ADAPTER_REPORT;a=json.loads(p.read_bytes());a['integration']['results'][0]['pass']=False;p.write_text(json.dumps(a));f.stop('ADAPTER_REPORT_INCOMPLETE')
register('failed_adapter_assertion_refused',proof_tamper)
def proof_link(f):
 p=f.outer/f.m.SQL_REPORT;p.write_bytes(p.read_bytes()+b' ');f.stop('ADAPTER_REPORT_IDENTITY')
register('evidence_chain_hash_mismatch_refused',proof_link)
def source_drift(f):
 p=f.work/'server/routes/auth.mjs';p.write_bytes(p.read_bytes()+b'\n');f.stop('PROTECTED_SOURCE_CHANGED')
register('previous_http_fix_drift_refused',source_drift)
def original_drift(f):
 p=f.work/f.m.SERVICE_PATH;p.write_bytes(p.read_bytes()+b'\n');f.stop('UNREVIEWED_WORKING_EDIT')
register('unreviewed_service_edit_refused',original_drift)
def missing_marker(f):
 (f.work/'.git').unlink();f.stop('No such file')
register('missing_git_marker_no_upward_fallback',missing_marker)
def symlink(f):
 p=f.work/f.m.ADAPTER_PATH;p.symlink_to('/tmp/mmhb-dont-follow-missing');f.stop('SYMLINK_REFUSED')
register('symlink_new_destination_refused',symlink)
def hardlink(f):
 p=f.work/f.m.SERVICE_PATH;os.link(p,f.outer/'hardlink-copy');f.stop('HARDLINK_REFUSED')
register('hardlinked_source_refused',hardlink)
def unrelated(f):
 p=f.work/'baseline-marker.txt';p.write_bytes(b'UNRELATED\n');f.stop('UNRELATED_TRACKED_EDITS')
register('unrelated_tracked_edit_refused',unrelated)
def staged(f):
 f.put('stage.txt',b'UNREVIEWED\n');f.g('add','stage.txt');f.stop('GIT_FAILED:diff')
register('unrelated_staged_change_refused',staged)
def ref_conflict(f):
 ref='refs/mmhb-fixes/refresh-family-source-v1-'+f.m.PAYLOAD_ID[:16]
 f.g('update-ref',ref,f.base);before=(f.work/f.m.SERVICE_PATH).read_bytes();f.stop('CHECKPOINT_REF_CONFLICT');assert (f.work/f.m.SERVICE_PATH).read_bytes()==before
register('conflicting_checkpoint_ref_does_not_write_source',ref_conflict)
def current_lock(f):
 p=f.work/'package-lock.json';p.write_bytes(p.read_bytes()+b'\n');f.stop('UNCHANGED_BUILD_INPUT_CHANGED')
register('lockfile_drift_refused',current_lock)
def modified_sql(f):
 f.m.PAYLOAD[f.m.SQL_PATH]+=b'\n';f.stop('PACKAGED_PAYLOAD_CHANGED')
register('packaged_sql_change_refused',modified_sql)
def injector(f):
 os.environ['NODE_OPTIONS']='--require /tmp/SHOULD_NOT_LOAD';os.environ['GIT_DIR']='/tmp/WRONG';os.environ['DATABASE_URL']='postgres://not-forwarded'
 try:basic(f)
 finally:
  for k in ['NODE_OPTIONS','GIT_DIR','DATABASE_URL']:os.environ.pop(k,None)
register('inherited_runtime_and_git_overrides_not_forwarded',injector)
def new_dir_conflict(f):
 p=f.work/'server/db/refresh-family';p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b'not a directory')
 f.stop('UNSAFE_PARENT_DIRECTORY')
register('existing_file_blocks_new_directory',new_dir_conflict)
def missing_guard(f):
 (f.work/'client/src/api/authGeneration.js').unlink();f.stop('TRACKED_FILE_MISSING')
register('missing_existing_client_guard_refused',missing_guard)

out=[]
for name,fn in tests:
 with tempfile.TemporaryDirectory(prefix='mmhb-integration-fixture-') as d:
  try:
   f=Fixture(Path(d));fn(f);out.append({'test':name,'pass':True});print('PASS',name,flush=True)
  except Exception as e:
   out.append({'test':name,'pass':False,'error':repr(e)});print('FAIL',name,repr(e),flush=True)
r={'schema':'MMHB_REFRESH_SOURCE_HELPER_TESTS_V1','node':subprocess.check_output(['node','--version'],text=True).strip(),
 'scope':'Disposable repositories; real Git and Node; synthetic proof JSON, account and generator sentinels. No PostgreSQL or Replit operations.',
 'total':len(out),'passed':sum(x['pass'] for x in out),'results':out}
(HERE/'MMHB_REFRESH_INTEGRATION_HELPER_TESTS_RERUN.json').write_text(json.dumps(r,indent=2)+'\n')
if r['passed']!=r['total']:sys.exit(1)
