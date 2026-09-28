#!/usr/bin/env python3
"""Checks control flow only. Full-run PostgreSQL is an explicit test double."""
from pathlib import Path
from types import SimpleNamespace
import contextlib, hashlib, importlib.util, io, json, os, subprocess, tempfile, shutil
P=Path;HERE=P(__file__).resolve().parent
script=HERE/'MMHB_REFRESH_ADAPTER_QUALIFY.py'
spec=importlib.util.spec_from_file_location('runner',script);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
checks=[]
def check(name,fn):
 try:fn();checks.append({'test':name,'pass':True})
 except Exception as e:checks.append({'test':name,'pass':False,'error':str(e)})
def require(x):
 if not x:raise AssertionError('fixture assertion failed')
def rejects(fn,word):
 try:fn()
 except Exception as e:require(word in str(e));return
 raise AssertionError('expected rejection absent')
check('python_compiles',lambda:compile(script.read_bytes(),str(script),'exec'))
for name in ['refreshFamilyAdapter.mjs','adapter-unit-tests.mjs','adapter-postgres-tests.mjs']:
 check('syntax_'+name,lambda n=name:require(subprocess.run(['node','--check',str(HERE/n)],capture_output=True).returncode==0))
p=subprocess.run(['python3','-I',str(script)],capture_output=True,text=True)
check('no_argument_never_starts_test',lambda:require(p.returncode==0 and 'DATABASE_OPERATIONS=NO' in p.stdout))
if os.geteuid()==0:
 p=subprocess.run(['python3','-I',str(script),'--test-local'],capture_output=True,text=True)
 check('root_test_run_refused',lambda:require(p.returncode==1 and 'REFUSE_ROOT_TEST_CLUSTER' in p.stdout))
with tempfile.TemporaryDirectory(prefix='mmhb-adapter-fixtures-') as td:
 root=P(td);m.HELPER=root/'prior.py'
 m.HELPER.write_bytes((HERE/'MMHB_REFRESH_FAMILY_QUALIFY.py').read_bytes())
 h=m.load_support()
 check('prior_helper_and_qualified_sql_exact',lambda:require(m.sha(h.PROTOTYPE_SQL.encode())==m.SQL_SHA))
 raw=m.HELPER.read_bytes();m.HELPER.write_bytes(raw+b'\n')
 check('modified_prior_helper_rejected',lambda:rejects(m.load_support,'PRIOR_QUALIFIER_CHECKSUM_DIFFERS'))
 m.HELPER.write_bytes(raw)
 m.EVIDENCE=root/'evidence.json'
 good={'schema':'MMHB_REFRESH_FAMILY_POSTGRES_QUALIFICATION_V1','checkpoint':h.COMMIT,'prototypeSqlSha256':m.SQL_SHA,
  'passed':31,'total':31,'results':[{'test':str(i),'pass':True} for i in range(31)],'error':None,
  'testClusterStopped':True,'existingSourceAndCandidateMetadataUnchanged':True,'applicationSourceEdits':0,'liveDatabaseConnections':0}
 m.EVIDENCE.write_text(json.dumps(good))
 check('prior_success_report_accepted',lambda:require(m.validate_evidence(h)==m.sha(m.EVIDENCE.read_bytes())))
 for name,change in [('wrong_checkpoint',{'checkpoint':'0'*40}),('wrong_sql',{'prototypeSqlSha256':'0'*64}),
     ('incomplete_tests',{'passed':30}),('cluster_running',{'testClusterStopped':False}),
     ('source_changes',{'applicationSourceEdits':1}),('live_connections',{'liveDatabaseConnections':1}),
     ('hidden_error',{'error':'error'})]:
  m.EVIDENCE.write_text(json.dumps({**good,**change}))
  check('rejects_evidence_'+name,lambda:rejects(lambda:m.validate_evidence(h),'SQL_EVIDENCE'))
 m.EVIDENCE.write_text(json.dumps(good))
 # Real Node module resolution; fake modules are deliberately non-executable.
 bases=[root/'candidate',root/'outer']
 for base in bases:
  base.mkdir();(base/'package.json').write_text('{"name":"fixture","type":"module"}')
  for pkg,ver in [('pg','8.20.0'),('drizzle-orm','0.45.2')]:
   p=base/'node_modules'/pkg;p.mkdir(parents=True)
   manifest={'name':pkg,'version':ver,'main':'index.cjs'}
   if pkg=='drizzle-orm':manifest['exports']={'.':'./index.cjs','./node-postgres':'./driver.cjs','./pg-core':'./core.cjs'}
   (p/'package.json').write_text(json.dumps(manifest))
   for name in ['index.cjs','driver.cjs','core.cjs']:(p/name).write_text("throw Error('MODULE_MUST_NOT_EXECUTE_DURING_PREFLIGHT');")
 conf={'bases':list(map(str,bases)),'versions':{'pg':'8.20.0','drizzle-orm':'0.45.2'}}
 def resolve():return subprocess.run(['node','--input-type=module','-e',m.RESOLVE_JS,json.dumps(conf)],capture_output=True,text=True)
 r=resolve()
 check('dependency_preflight_resolves_without_importing_modules',lambda:require(r.returncode==0 and json.loads(r.stdout)['base']==str(bases[0])))
 manifest=bases[0]/'node_modules/pg/package.json';obj=json.loads(manifest.read_text());obj['version']='8.0.0';manifest.write_text(json.dumps(obj))
 r=resolve()
 check('dependency_preflight_falls_back_only_to_matching_version',lambda:require(r.returncode==0 and json.loads(r.stdout)['base']==str(bases[1])))
 obj['version']='8.0.0';(bases[1]/'node_modules/pg/package.json').write_text(json.dumps(obj));r=resolve()
 check('unmatched_dependencies_stop_no_install',lambda:require(r.returncode!=0 and 'MATCHED_EXISTING_DEPENDENCIES_NOT_FOUND' in r.stdout))
 # Full runner control-flow doubles. Do not report these as PostgreSQL tests.
 m.ROOT=root
 class Cluster:
  def __init__(self,folder):self.base=None;self.stopped=False;self.executed=[]
  def start(self):
   self.base=P(tempfile.mkdtemp(prefix='mmhb-refresh-test-',dir='/tmp'));self.sock=self.base/'socket';self.sock.mkdir()
  def sql(self,s):self.executed.append(s)
  def stop(self):self.stopped=True;return True
 cbox=[]
 def cluster(folder):c=Cluster(folder);cbox.append(c);return c
 snap={'same':'source-and-metadata'}
 stub=SimpleNamespace(COMMIT=h.COMMIT,PROTOTYPE_SQL=h.PROTOTYPE_SQL,FIXTURE=h.FIXTURE,
   repository_snapshot=lambda:dict(snap),binaries=lambda x:(root/'bin','(PostgreSQL) 16.10'),Cluster=cluster)
 saved=(m.load_support,m.validate_evidence,m.prepare_node,m.subprocess.run,m.os.geteuid)
 m.load_support=lambda:stub;m.validate_evidence=lambda x:'fixture-evidence'
 sentinel='PRODUCTION_SENTINEL_MUST_NOT_BE_FORWARDED'
 old={k:os.environ.get(k) for k in ['DATABASE_URL','PGHOST','PGSERVICEFILE','NODE_OPTIONS']}
 for k in old:os.environ[k]=sentinel
 realrun=saved[3];seen=[];pg_failure=False
 m.prepare_node=lambda x:('node',{'PATH':os.environ['PATH'],'NODE_DISABLE_COMPILE_CACHE':'1'},
   {'versions':{'pg':'8.20.0','drizzle-orm':'0.45.2'},'base':'fixture','pgEntry':'fake','drizzleEntry':'fake','drizzlePgEntry':'fake','pgCoreEntry':'fake'},'v24.13.0','lock-fixture')
 def simulated_run(argv,**kwargs):
  seen.append(kwargs['env'])
  if argv[1].endswith('adapter-unit-tests.mjs'):return realrun(argv,**kwargs)
  require(argv[1].endswith('adapter-postgres-tests.mjs'))
  report={'schema':'MMHB_NODE_PG_DRIZZLE_ADAPTER_V1','planned':24,'total':24 if not pg_failure else 1,
      'passed':24 if not pg_failure else 0,'poolsClosed':True,'results':[], 'scope':'HARNESS FAKE ONLY'}
  (P(kwargs['cwd'])/'adapter-pg-results.json').write_text(json.dumps(report))
  return subprocess.CompletedProcess(argv,1 if pg_failure else 0,b'ADAPTER_TEST=HARNESS_FAKE_ONLY PASS\n',b'')
 m.subprocess.run=simulated_run;m.os.geteuid=lambda:1000
 try:
  cap=io.StringIO()
  with contextlib.redirect_stdout(cap):m.run_local()
  check('full_control_flow_stops_only_its_private_cluster',lambda:require(cbox[-1].stopped))
  check('qualified_sql_is_used_byte_for_byte',lambda:require(m.sha(cbox[-1].executed[1].encode())==m.SQL_SHA))
  check('node_child_receives_no_production_connection_settings',lambda:require(all(not any(k in e for k in old) for e in seen)))
  check('test_roles_do_not_receive_migration_execute',lambda:require('adopt_legacy' not in m.GRANTS and 'GRANT UPDATE' in m.GRANTS))
  check('no_candidate_source_is_written_by_control_flow',lambda:require('APPLICATION_SOURCE_EDITS=NO' in cap.getvalue()))
  pg_failure=True
  cap=io.StringIO()
  with contextlib.redirect_stdout(cap):check('failed_driver_suite_stops_and_does_not_report_success',lambda:rejects(m.run_local,'ADAPTER_POSTGRES_TESTS_FAILED'))
  check('failed_driver_suite_still_stops_its_cluster',lambda:require(cbox[-1].stopped and 'STATUS=REFRESH_ADAPTER_QUALIFIED_LOCALLY' not in cap.getvalue()))
 finally:
  m.load_support,m.validate_evidence,m.prepare_node,m.subprocess.run,m.os.geteuid=saved
  for k,v in old.items():
   if v is None:os.environ.pop(k,None)
   else:os.environ[k]=v
  for c in cbox:
   if c.base:shutil.rmtree(c.base)
report={'schema':'MMHB_REFRESH_ADAPTER_HARNESS_LOCAL_V1','scope':'Python control flow, actual Node 22 module resolution and adapter unit tests; PostgreSQL process/database is a test double in full-run fixtures',
 'realPostgreSQLExecutedHere':False,'realDrizzleDriverExecutedHere':False,'total':len(checks),'passed':sum(x['pass'] for x in checks),'results':checks}
(HERE/'harness-results.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if report['total']!=report['passed']:raise SystemExit(1)
