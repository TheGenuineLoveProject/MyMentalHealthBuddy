from pathlib import Path
import types,tempfile,subprocess,json,hashlib
HERE=Path(__file__).resolve().parent
p=HERE/'test-integration-helper.py'
ns=types.ModuleType('fixture_support');ns.__file__=str(p);exec(compile(p.read_text().split('\nout=[]\n')[0],str(p),'exec'),ns.__dict__)
results=[]
def record(name,fn):
 try:fn();results.append({'test':name,'pass':True});print('PASS',name)
 except Exception as e:results.append({'test':name,'pass':False,'error':repr(e)});print('FAIL',name,repr(e))
with tempfile.TemporaryDirectory(prefix='mmhb-verifier-mutations-') as d:
 f=ns.Fixture(Path(d));r,out=f.execute();m=f.m
 initial={n:(f.work/n).read_bytes() for n in m.PAYLOAD};package=(f.work/'package.json').read_bytes()
 def restore():
  for n,b in initial.items():(f.work/n).write_bytes(b)
  (f.work/'package.json').write_bytes(package)
 def run():
  return subprocess.run(['node',m.VERIFY_PATH],cwd=f.work,env=m.clean_env(),capture_output=True,text=True,timeout=20)
 def baseline():
  restore();p=run();assert p.returncode==0,p.stdout+p.stderr
  assert p.stdout.count('SELF_TEST=')==17 and p.stdout.count('GATE=')==16
 record('updated_verifier_all_17_selftests_and_16_gates',baseline)
 def drift():
  restore();p=f.work/m.ADAPTER_PATH;p.write_bytes(p.read_bytes()+b'\n');r=run();assert r.returncode!=0
 record('adapter_file_drift_rejected',drift)
 def bypass():
  restore();p=f.work/'package.json';x=json.loads(p.read_bytes());x['scripts']['test']+=' || true';p.write_text(json.dumps(x));assert run().returncode!=0
 record('pipeline_error_swallowing_rejected',bypass)
 def hook():
  restore();p=f.work/'package.json';x=json.loads(p.read_bytes());x['scripts']['preverify:auth-session-contracts']='exit 0';p.write_text(json.dumps(x));assert run().returncode!=0
 record('verifier_pre_hook_injection_rejected',hook)
 def sql():
  restore();p=f.work/m.SQL_PATH;p.write_bytes(p.read_bytes()+b'\n');assert run().returncode!=0
 record('qualified_sql_file_drift_rejected',sql)
 def mutation_executor():
  restore();p=f.work/m.ADAPTER_PATH;original=p.read_bytes();changed=original.replace(b'executor.execute(statement)',b'db.execute(statement)');assert original!=changed;p.write_bytes(changed)
  v=f.work/m.VERIFY_PATH;v.write_bytes(v.read_bytes().replace(hashlib.sha256(original).hexdigest().encode(),hashlib.sha256(changed).hexdigest().encode()))
  r=run();assert r.returncode!=0 and 'ADAPTER_BOUNDARY_ASSERTIONS=' in r.stdout,r.stdout+r.stderr
 record('boundary_tests_detect_executor_regression_even_after_fixture_hash_rebaseline',mutation_executor)
 def mutation_facade():
  restore();p=f.work/m.SERVICE_PATH;original=p.read_bytes();changed=original.replace(b'  revokeAllRefreshTokens,\n',b'');assert changed!=original;p.write_bytes(changed)
  v=f.work/m.VERIFY_PATH;v.write_bytes(v.read_bytes().replace(hashlib.sha256(original).hexdigest().encode(),hashlib.sha256(changed).hexdigest().encode()))
  r=run();assert r.returncode!=0 and 'SERVICE_WIRING_ASSERTIONS=' in r.stdout
 record('facade_tests_detect_missing_export_even_after_fixture_hash_rebaseline',mutation_facade)
 restore()
r={'schema':'MMHB_REFRESH_SOURCE_VERIFIER_MUTATIONS_V1','total':len(results),'passed':sum(x['pass'] for x in results),
'scope':'Local Node 22.16; synthetic repository; two tests deliberately rebaseline fixture hashes to prove behavior assertions catch weakened implementations. Shipping hashes never changed.', 'results':results}
(HERE/'MMHB_REFRESH_INTEGRATION_VERIFIER_TESTS_RERUN.json').write_text(json.dumps(r,indent=2)+'\n')
assert r['total']==r['passed']
