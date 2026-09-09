from pathlib import Path
import tempfile,subprocess,shutil,re,json,hashlib,os
HERE=Path(__file__).resolve().parent
DRIVER=HERE/'archive-url-diagnostic-r16b-driver.mjs'
NODE=shutil.which('node');VERSION=subprocess.check_output([NODE,'--version'],text=True).strip()
sha=lambda b:hashlib.sha256(b).hexdigest()
RESULTS=[]
SECRET='MMHB_PRIVATE_ENV_SENTINEL'
def run(case,mode='valid',expected=None):
 root=Path(tempfile.mkdtemp(prefix='mmhb-r16b-fixture-'))
 try:
  ev=root/'.mmhb-release-evidence';ev.mkdir(mode=0o700);(ev/'.gitignore').write_text('*\n');(ev/'.gitignore').chmod(0o600)
  pkg={'name':'mymentalhealthbuddy','version':'1.0.0'}
  archive='https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz'
  if mode=='encoded':archive=archive.replace('@','%40')
  if mode=='secret':archive+='?token='+SECRET
  entry={'version':'5.2.0','resolved':archive,'integrity':'sha512-'+'A'*86+'=='}
  lock={**pkg,'lockfileVersion':3,'packages':{'':pkg,'node_modules/@alloc/quick-lru':entry}}
  for f,v in [('package.json',pkg),('package-lock.json',lock)]: (root/f).write_text(json.dumps(v))
  (root/'.env').write_text(SECRET)
  (root/'server').mkdir();(root/'server/app.mjs').write_text("throw Error('APPLICATION_EXECUTED');")
  baseline={f:sha((root/f).read_bytes()) for f in ['package.json','package-lock.json']}
  src=DRIVER.read_text().replace("const EXPECTED_ROOT='/home/runner/workspace';",'const EXPECTED_ROOT='+json.dumps(str(root))+';').replace("const EXPECTED_NODE='v24.13.0';",'const EXPECTED_NODE='+json.dumps(VERSION)+';')
  src=re.sub(r'const PINS=\{[^\n]+\};','const PINS='+json.dumps(baseline)+';',src,count=1)
  # Fail if code reads secrets or imports app; inject faults only at named output boundary.
  injected="""const fixtureWrite=fs.writeFileSync,fixtureOpen=fs.openSync;
fs.openSync=function(file,...args){if(String(file).endsWith('/.env'))throw Error('SECRET_FILE_READ');return fixtureOpen.call(this,file,...args);};
"""
  if mode=='drift':injected+="fs.writeFileSync=function(file,...args){if(String(file).endsWith('/archive-url-findings.json'))fixtureWrite.call(this,process.cwd()+'/package.json','DRIFT');return fixtureWrite.call(this,file,...args);};\n"
  if mode=='evidence_error':injected+="fs.writeFileSync=function(file,...args){if(String(file).endsWith('/archive-url-diagnostic-evidence.json'))throw Object.assign(new Error('fail'),{code:'ENOSPC'});return fixtureWrite.call(this,file,...args);};\n"
  src=src.replace("const root=fs.realpathSync('.');","const root=fs.realpathSync('.');\n"+injected)
  if mode=='pin_drift':(root/'package-lock.json').write_text('{}')
  if mode=='ignore_conflict':(ev/'.gitignore').write_text('!keep\n')
  if mode=='lock_symlink':(root/'package-lock.json').rename(root/'keep-lock.json');(root/'package-lock.json').symlink_to('keep-lock.json')
  before={str(f.relative_to(root)):f.read_bytes() for f in root.rglob('*') if f.is_file()}
  proc=subprocess.run([NODE,'--input-type=module'],input=src,cwd=root,text=True,capture_output=True,timeout=15,env={**os.environ,'NODE_OPTIONS':'','NODE_DISABLE_COMPILE_CACHE':'1','DATABASE_URL':SECRET,'OPENAI_API_KEY':SECRET})
  out=proc.stdout+proc.stderr
  assert SECRET not in out and 'SECRET_FILE_READ' not in out and 'APPLICATION_EXECUTED' not in out,(case,out)
  start=proc.stdout.find('{');assert start>=0,(case,out)
  result=json.JSONDecoder().raw_decode(proc.stdout[start:])[0]
  if expected:
   assert proc.returncode==1 and result['failure']['gate']==expected,(case,result)
  else:
   assert proc.returncode==0 and result['status']=='ARCHIVE_URL_DIAGNOSTIC_COMPLETE_NOT_INSTALL',(case,result)
   assert result['diagnostic']['archiveRejectedCount']==(1 if mode in ('encoded','secret') else 0),(case,result)
   report=Path(re.findall(r'^REPORT_DIRECTORY=(.+)$',out,re.M)[-1]);assert report.parent==ev
   assert report.stat().st_mode&0o777==0o700
   for f in report.iterdir():
    assert f.stat().st_mode&0o777==0o600
    assert SECRET not in f.read_text(),(case,'saved secret')
  for f,b in before.items():
   if mode=='drift' and f=='package.json':assert (root/f).read_text()=='DRIFT'
   else:assert (root/f).read_bytes()==b,(case,'unexpected modification',f)
  assert result['npmStarted'] is False and result['releaseReady'] is False
  RESULTS.append({'case':case,'status':'PASS'})
 finally:shutil.rmtree(root)
run('canonical current archive collected')
run('encoded archive reason collected','encoded')
run('query payload remains private','secret')
run('manifest hash drift refuses inspection','pin_drift','CURRENT_MANIFEST_DRIFT')
run('manifest symlink refused','lock_symlink','READ_SYMLINK')
run('conflicting evidence ignore refused','ignore_conflict','EVIDENCE_IGNORE_BOUNDARY')
run('concurrent package edit preserved and reported','drift','OBSERVED_INPUT_CHANGED')
run('evidence write failure cannot claim complete','evidence_error','ENOSPC')
(HERE/'r16b-driver-test-results.json').write_text(json.dumps({'scope':'ACTUAL_DIAGNOSTIC_DRIVER_IN_DISPOSABLE_FIXTURES_NO_NPM_NETWORK_OR_APPLICATION','node':VERSION,'driverSha256':sha(DRIVER.read_bytes()),'harnessSha256':sha(Path(__file__).read_bytes()),'passed':len(RESULTS),'cases':RESULTS},indent=2)+'\n')
print('R16B_DRIVER_TESTS='+str(len(RESULTS))+'_PASS')
