"""Full R17 workflow fixtures. Installed packages/compilers/native output are synthetic.
Actual R17 guards, filesystem copies, subprocess isolation, server/frontend runners,
and the exact MMHB prompt loader execute; no npm, network, DB or application runs.
"""
from pathlib import Path
import base64,hashlib,importlib.util,json,os,re,shutil,subprocess,tempfile
HERE=Path(__file__).resolve().parent
NODE=shutil.which('node'); VERSION=subprocess.check_output([NODE,'--version'],text=True).strip()
spec=importlib.util.spec_from_file_location('front_fixture',HERE/'test-frontend-runner-r12.py')
front=importlib.util.module_from_spec(spec);spec.loader.exec_module(front)
raw=(HERE/'fresh-candidate-driver-r17.mjs').read_text()
PIN_NAMES=json.loads(re.search(r'const PINS = (\{.*?\n\});',raw,re.S).group(1))
ASSET_NAMES=json.loads(re.search(r'const ASSET_PINS = (\{.*?\n\});',raw,re.S).group(1))
HELPERS=json.loads(re.search(r'const HELPERS = (\{[^\n]+\});',raw).group(1))
RESULTS=[]; SECRET='MMHB_TEST_SECRET_MUST_NOT_REACH_CHILD'
def j(x):return json.dumps(x,separators=(',',':'))
def sha(b):return hashlib.sha256(b).hexdigest()
def write(root,rel,data,mode=0o644):
 p=root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data if isinstance(data,bytes) else data.encode());p.chmod(mode);return p
def git(root,*args):return subprocess.check_output(['git',*args],cwd=root,text=True,stderr=subprocess.DEVNULL).strip()
def build_fixture(root,mode):
 for name in PIN_NAMES:write(root,name,'{}' if name.endswith('.json') else '// fixture\n')
 policy=json.loads((HERE/'r15-asset-repair-policy.json').read_text())
 edits={x['file']:x['newText'] for x in policy['replacements']}
 for rel in ASSET_NAMES:
  src=edits.get(rel)
  if src is None:src=(HERE/('r14-assets-'+rel.replace('/','-'))).read_text()
  write(root,rel,src)
 write(root,'server/lib/promptEngine.mjs',(HERE/'r14-assets-server-lib-promptEngine.mjs').read_bytes())
 write(root,'server/app.mjs',"throw Error('MMHB_APPLICATION_MUST_NOT_EXECUTE');\n")
 write(root,'client/index.html','<html></html>');write(root,'client/main.jsx','export{}')
 write(root,'client/src/.env.fixture',SECRET)
 write(root,'.gitignore','node_modules/\ndist/\nclient/dist/\nbundle-report.html\n.env*\n')
 write(root,'user-work.txt','PRESERVE_CURRENT_WORK\n')
 write(root,'vite.config.js',"import path from 'node:path';import {fileURLToPath} from 'node:url';const root=path.dirname(fileURLToPath(import.meta.url));export default {plugins:[{name:'react',fixturePreserved:true},{name:'visualizer'}],root:root+'/client',build:{rollupOptions:{input:root+'/client/index.html'}},define:{'process.env.NODE_ENV':'\\\"production\\\"'}};".replace('\\"','"'))
 stage=root/'.mmhb-release-evidence/r16e-rHi4aw/stage';stage.mkdir(parents=True,mode=0o700)
 (root/'.mmhb-release-evidence').chmod(0o700);write(root,'.mmhb-release-evidence/.gitignore','*\n',0o600)
 modules={
 '@vitejs/plugin-react':('6.1.0','export default ()=>({name:"react"})'),
 'resend':('6.22.1',"throw Error('RESEND_MUST_NOT_EXECUTE');"),
 'vite':('8.0.16',front.VITE_STUB.replace('__FIXTURE_MODE__',j('no_css' if mode=='no_css' else 'success'))),
 '@tailwindcss/postcss':('4.0.0',"export default ()=>({postcssPlugin:'@tailwindcss/postcss'});"),
 'autoprefixer':('10.4.0',"export default ()=>({postcssPlugin:'autoprefixer'});"),
 'rollup-plugin-visualizer':('6.0.0',"export const visualizer=options=>({name:'visualizer',options});"),
 'esbuild':('0.28.2',''), '@esbuild/linux-x64':('0.28.2','export{}'),
 'bcrypt':('6.0.0',"throw Error('NATIVE_FIXTURE_NOT_REAL_BINARY');"),
 'node-gyp-build':('4.8.4',"throw Error('NATIVE_FIXTURE_NOT_REAL_BINARY');")}
 stub="""import fs from 'node:fs';import path from 'node:path';let n=0;export const version='0.28.2';export function stop(){};
 export async function build(o){
 if(process.env.OPENAI_API_KEY||process.env.DATABASE_URL||process.env.HOME||process.env.NODE_OPTIONS)throw Error('SECRET_INHERITED');
 if(fs.existsSync(path.join(o.absWorkingDir,'client/src/.env.fixture')))throw Error('ENV_COPIED');
 __FAULT__
 n++;fs.writeFileSync(o.outfile,__OUTPUT__);const inputs=Object.fromEntries(['server/app.mjs','server/security/csrf.mjs','server/replit_integrations/auth/replitAuth.mjs'].map(x=>[x,{bytes:fs.statSync(path.join(o.absWorkingDir,x)).size}]));
 return {metafile:{inputs,outputs:{[o.outfile]:{imports:[{path:'bcrypt',external:true}]}}},warnings:[]};}
 """
 faults={'server_error':"throw Object.assign(new Error('PRIVATE_BUILD_ERROR'),{code:'SYNTHETIC_BUILD_ERROR'});",
 'timeout':'await new Promise(()=>setInterval(()=>{},1000));',
 'workspace_edit':f"fs.writeFileSync({j(str(root/'user-work.txt'))},'UNKNOWN_CONCURRENT_EDIT');",
 'prior_edit':f"fs.writeFileSync({j(str(stage/'node_modules/resend/index.js'))},'UNKNOWN_CONCURRENT_EDIT');",
 'copy_edit':"fs.writeFileSync(path.join(o.absWorkingDir,'node_modules/resend/index.js'),'COPY_MUTATION');"}
 stub=stub.replace('__FAULT__',faults.get(mode,'')).replace('__OUTPUT__',"'export const n='+n+';'" if mode=='nondeterministic' else j("throw Error('CANDIDATE_MUST_NOT_START');\n"))
 modules['esbuild']=('0.28.2',stub)
 if mode=='missing_ref':modules['vite']=(modules['vite'][0],modules['vite'][1].replace("new Set(['assets/a.css'])","new Set(['assets/missing.css'])"))
 if mode=='graph_escape':modules['vite']=(modules['vite'][0],modules['vite'][1].replace("[config.root + '/main.jsx']","['/etc/passwd']"))
 pkg={'name':'mymentalhealthbuddy','version':'1.0.0','type':'module','dependencies':{n:v for n,(v,_) in modules.items()}}
 packages={'':{k:v for k,v in pkg.items() if k!='type'}}
 integrity='sha512-'+base64.b64encode(bytes(64)).decode()
 for name,(version,src) in modules.items():
  packages['node_modules/'+name]={'version':version,'resolved':f'https://registry.npmjs.org/{name}/-/{name.split("/")[-1]}-{version}.tgz','integrity':integrity}
  write(stage,'node_modules/'+name+'/package.json',j({'name':name,'version':version,'type':'module','main':'index.js'}))
  write(stage,'node_modules/'+name+'/index.js',src)
 if mode!='missing_binary':write(stage,'node_modules/@esbuild/linux-x64/bin/esbuild','INERT_BINARY_NOT_EXECUTED',0o755)
 lock={'name':pkg['name'],'version':'1.0.0','lockfileVersion':3,'requires':True,'packages':packages}
 for base in [root,stage]:write(base,'package.json',j(pkg));write(base,'package-lock.json',json.dumps(lock,indent=2)+'\n')
 original=json.loads(j(lock));original['packages']['node_modules/resend']['resolved']='http://mirror.example.invalid/resend/6.22.1/archive'
 write(root,'package-lock.json',json.dumps(original,indent=2)+'\n')
 hidden={**lock,'packages':{k:v for k,v in packages.items() if k}}
 write(stage,'node_modules/.package-lock.json',j(hidden))
 if mode=='source_link':(root/'client/linked.jsx').symlink_to('/etc/passwd')
 git(root,'init','-q','-b','integration');git(root,'add','.');git(root,'-c','user.name=Fixture','-c','user.email=fixture@example.invalid','-c','commit.gpgsign=false','commit','-qm','fixture')
 write(root,'user-work.txt','EXISTING_UNCOMMITTED_WORK')
 prepare="""
 import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
 import * as p from __POLICY__; import * as normalizer from __NORMALIZER__; const [root,stage,h]=process.argv.slice(2),helpers=JSON.parse(h);const prior=path.dirname(stage);
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex'); const read=x=>fs.readFileSync(path.join(stage,x));
 const lock=JSON.parse(read('package-lock.json'));const installed=p.inspectInstalled(stage,lock);
 const save=(name,data)=>fs.writeFileSync(path.join(prior,name),JSON.stringify(data,null,2));
 save('installed-dependencies.json',installed);
 save('locked-dependencies-evidence.json',{project:'MyMentalHealthBuddy',status:'REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE',preservation:'OBSERVED_CURRENT_INPUTS_AND_AVAILABLE_EVIDENCE_PRESERVED',currentPreservation:{changedFileCount:0},npmProcess:{started:true,exitCode:0},stageDirectory:stage});
 save('install-inputs.json',{stageDirectory:stage,packageSha256:hash(read('package.json')),originalRootLockSha256:hash(fs.readFileSync(path.join(root,'package-lock.json'))),lockSha256:hash(read('package-lock.json')),policySha256:helpers.POLICY.sha256,normalizerSha256:helpers.NORMALIZER.sha256,runnerSha256:'6f28f812900febfc749e1779e73c23203cee089f1c0c160e61a794f450214c4f'});
 const plan=normalizer.planArchiveRepair(JSON.parse(read('package.json')),JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'))),p.validateLock,p.classifyExcludedBundles);
 save('archive-source-evidence.json',{status:'ARCHIVE_SOURCES_VERIFIED',uniqueSourcesVerified:plan.requests.length,receipts:plan.requests.map(r=>({name:r.name,version:r.version,paths:r.paths,tarball:r.url,integrity:r.integrity,verification:'REGISTRY_SHA512_METADATA_MATCH'}))});
 """.replace('__POLICY__',j((HERE/'locked-dependency-policy-r16e.mjs').as_uri())).replace('__NORMALIZER__',j((HERE/'registry-archive-repair-r16d.mjs').as_uri()))
 prep=write(root.parent,'prepare.mjs',prepare)
 subprocess.run([NODE,str(prep),str(root),str(stage),j(HELPERS)],check=True,capture_output=True)
 if mode=='receipt_mismatch':
  f=stage.parent/'archive-source-evidence.json';data=json.loads(f.read_text());data['receipts'][0]['integrity']='sha512-invalid';f.write_text(j(data))
 if mode=='tree_drift':write(stage,'node_modules/resend/index.js','AFTER_INSTALLED_SNAPSHOT')
 if mode=='lock_drift':write(stage,'package-lock.json',j(lock)+'\n ')
 if mode=='prior_failed':
  f=stage.parent/'locked-dependencies-evidence.json';data=json.loads(f.read_text());data['status']='LOCKED_DEPENDENCIES_FAILED';f.write_text(j(data))
 if mode=='missing_prior':(stage.parent/'locked-dependencies-evidence.json').unlink()
 return stage

def run(mode,expected):
 with tempfile.TemporaryDirectory(prefix='mmhb-r17-fixture-') as tmp:
  root=Path(tmp)/'workspace';root.mkdir();stage=build_fixture(root,mode)
  src=raw
  for name,value in [('EXPECTED_ROOT',str(root)),('EXPECTED_HEAD',git(root,'rev-parse','HEAD')),('EXPECTED_NODE',VERSION)]:
   src=re.sub(r'const '+name+r" = '[^']*';",lambda _:'const '+name+' = '+j(value)+';',src,count=1)
  for key,names in [('PINS',PIN_NAMES),('ASSET_PINS',ASSET_NAMES)]:
   pins={f:sha((root/f).read_bytes()) for f in names}
   src=re.sub(r'const '+key+r' = \{.*?\n\};',lambda _:'const '+key+' = '+j(pins)+';',src,count=1,flags=re.S)
  helpers=json.loads(j(HELPERS))
  native="import fs from 'node:fs';import path from 'node:path';const [candidate,report]=process.argv.slice(2);fs.writeFileSync(path.join(report,'native-smoke-evidence.json'),JSON.stringify({status:'NATIVE_CANDIDATE_SMOKE_PASS'}));"
  if mode=='native_failure':native="process.exit(7)"
  helpers['NATIVE']={'sha256':sha(native.encode()),'b64':base64.b64encode(native.encode()).decode()}
  src=re.sub(r'const HELPERS = \{[^\n]+\};',lambda _:'const HELPERS = '+j(helpers)+';',src,count=1)
  if mode=='timeout':src=src.replace("timeoutMs=180000","timeoutMs=50")
  file=write(Path(tmp),'driver.mjs',src)
  before=sha((root/'package-lock.json').read_bytes())
  r=subprocess.run([NODE,str(file)],cwd=root,env={**os.environ,'OPENAI_API_KEY':SECRET,'DATABASE_URL':SECRET},capture_output=True,text=True,timeout=30)
  reports=list((root/'.mmhb-release-evidence').glob('r17-*'));assert len(reports)==1,(mode,r.stdout,r.stderr)
  report=reports[0];e=json.loads((report/'fresh-candidate-evidence.json').read_text())
  if expected is None:assert r.returncode==0 and e['status']=='FRESH_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE',(mode,e.get('failure'),e.get('processes'),r.stderr)
  else:assert r.returncode!=0 and (e.get('failure') or {}).get('gate')==expected,(mode,e.get('failure'),e.get('processes'),r.stderr)
  assert SECRET not in r.stdout+r.stderr
  assert sha((root/'package-lock.json').read_bytes())==before
  if mode=='workspace_edit':assert (root/'user-work.txt').read_text()=='UNKNOWN_CONCURRENT_EDIT'
  build=e.get('disposableBuildRoot')
  if build and Path(build).is_dir():shutil.rmtree(build)
  RESULTS.append({'case':mode,'result':'PASS','expectedGate':expected,'actualStatus':e['status']})
  print('PASS '+mode)

if __name__=='__main__':
 for mode,expected in [('success',None),('missing_prior','ENOENT'),('prior_failed','R16E_PASS_REQUIRED'),('lock_drift','R16E_MANIFEST_DRIFT'),('tree_drift','R16E_INSTALLED_TREE_DRIFT'),
   ('receipt_mismatch','R16E_RECEIPT_MISMATCH'),('source_link','SOURCE_OR_OUTPUT_SYMLINK'),('missing_binary','CHILD_FAILED'),('server_error','CHILD_FAILED'),('nondeterministic','CHILD_FAILED'),
   ('no_css','CHILD_FAILED'),('missing_ref','FRONTEND_LOCAL_REFERENCE_MISSING'),('graph_escape','GRAPH_INPUT_OUTSIDE_COPY'),('native_failure','CHILD_FAILED'),
   ('workspace_edit','WORKTREE_PRESERVATION'),('prior_edit','R16E_DEPENDENCIES_CHANGED'),('copy_edit','BUILD_DEPENDENCIES_CHANGED'),('timeout','CHILD_FAILED')]:run(mode,expected)
 (HERE/'r17-driver-fixture-results.json').write_text(json.dumps({'status':'PASS','checks':len(RESULTS),'scope':'SYNTHETIC_PACKAGE_AND_COMPILER_WORKFLOW; ACTUAL_PROMPT_LOADER; NO_APPLICATION_DATABASE_OR_NETWORK','results':RESULTS},indent=2)+'\n')
