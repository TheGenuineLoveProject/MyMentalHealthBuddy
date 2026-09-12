from pathlib import Path
import hashlib,json,os,subprocess,tempfile
HERE=Path(__file__).resolve().parent
SOURCE=(HERE/'inspect-input-path-r18b.mjs').read_text()
sha=lambda b:hashlib.sha256(b).hexdigest()
def packed(v):return json.dumps(v,separators=(',',':'))
results=[]
for case in ['private_module','sensitive_filename','wrong_fingerprint','repeat_missing','package_changed','metadata_symlink']:
 with tempfile.TemporaryDirectory(prefix='mmhb-path-fixture-') as d:
  root=Path(d); prior=root/'.mmhb-release-evidence/r17b-q6rzGy'; prior.mkdir(parents=True)
  key='node_modules/example/private/index.js' if case!='sensitive_filename' else 'node_modules/example/.env.production'
  target=sha(key.encode()); code=SOURCE.replace("const ROOT='/home/runner/workspace';",'const ROOT='+json.dumps(str(root))+';')
  code=code.replace("const TARGET='c4c8b0e9f50a3e6490cdce714f0cfe8b89563962cc4a3709a00a11e80704258b';",'const TARGET='+json.dumps(target)+';')
  code=code.replace('const TARGET_BYTES=52;',f'const TARGET_BYTES={len(key.encode())};')
  def write(file,value):
   file.parent.mkdir(parents=True,exist_ok=True);file.write_text(packed(value))
  module=prior/'build-input'/key;module.parent.mkdir(parents=True,exist_ok=True);module.write_text('PRIVATE_CONTENT_CANARY_NOT_TO_READ')
  package=prior/'build-input/node_modules/example/package.json';write(package,{'name':'example','version':'1.2.3','secret':'PRIVATE_CONTENT_CANARY_NOT_TO_READ'})
  rows=[{'file':key,'type':'file','bytes':module.stat().st_size,'sha256':sha(module.read_bytes())},
        {'file':'node_modules/example/package.json','type':'file','bytes':package.stat().st_size,'sha256':sha(package.read_bytes())}]
  write(prior/'build-input-manifest.json',{'rows':rows,'manifestSha256':sha(packed(rows).encode()),'compilerWorkingDirectory':'/tmp/mmhb-build-r17b-Fixt18'})
  receipt={'project':'MyMentalHealthBuddy','status':'RUNTIME_CONTRACT_FAILED','failure':{'gate':'RUNTIME_INPUT_PRIVATE_OR_INVALID',
   'graphDetails':{'metadataIndex':1,'graphSide':'INPUT','specifierSha256':target,'specifierBytes':len(key.encode())}}}
  if case=='wrong_fingerprint':receipt['failure']['graphDetails']['specifierSha256']='0'*64
  write(root/'.mmhb-release-evidence/r18a-8GxfuU/runtime-contract-evidence.json',receipt)
  for i in [1,2]:write(prior/f'server-build/meta-{i}.json',{'inputs':{} if case=='repeat_missing' and i==2 else {key:{'bytes':module.stat().st_size}}})
  if case=='package_changed':write(package,{'name':'example','version':'2.0.0'})
  if case=='metadata_symlink':
   f=prior/'server-build/meta-1.json';f.rename(prior/'server-build/actual.json');f.symlink_to('actual.json')
  script=root/'inspect.mjs';script.write_text(code)
  # Guard the application's module contents; package metadata remains readable.
  guard=root/'guard.mjs';guard.write_text("import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';const original=fs.readFileSync;fs.readFileSync=(p,...a)=>{if(String(p)==="+json.dumps(str(module))+")throw Error('MODULE_CONTENTS_READ');return original(p,...a)};syncBuiltinESMExports();")
  before={str(p):sha(p.read_bytes()) for p in root.rglob('*') if p.is_file()}
  proc=subprocess.run(['node','--import',str(guard),str(script)],cwd=root,capture_output=True,text=True,timeout=10,
    env={**os.environ,'NODE_OPTIONS':'','NODE_PATH':''})
  result=json.JSONDecoder().raw_decode(proc.stdout)[0]
  assert 'PRIVATE_CONTENT_CANARY_NOT_TO_READ' not in proc.stdout+proc.stderr
  after={str(p):sha(p.read_bytes()) for p in root.rglob('*') if p.is_file()}
  assert before==after
  if case in ['private_module','sensitive_filename']:
   assert proc.returncode==0 and result['status']=='INPUT_PATH_IDENTIFIED_REVIEW_REQUIRED'
   if case=='private_module':assert result['matches'][0]['inputPath']==key and result['matches'][0]['package']['version']=='1.2.3'
   else:assert result['matches'][0]['inputPath']=='REDACTED_NON_MODULE_PATH' and '.env.production' not in proc.stdout
  else:
   expected={'wrong_fingerprint':'R18A_RECEIPT','repeat_missing':'TARGET_INPUT_NOT_UNIQUE','package_changed':'PACKAGE_METADATA_CHANGED','metadata_symlink':'METADATA_SYMLINK'}[case]
   assert proc.returncode==1 and result['gate']==expected,(case,result)
  results.append({'case':case,'status':'PASS','observedStatus':result['status'],'moduleContentRead':False,'filesChanged':0})
out={'status':'PASS','cases':results,'scriptSha256':sha(SOURCE.encode()),'scope':'SYNTHETIC_METADATA_FIXTURES_NOT_REPLIT_EXECUTION'}
(HERE/'r18b-inspection-test-results.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out))
