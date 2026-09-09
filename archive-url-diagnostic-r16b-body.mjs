import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const EXPECTED_ROOT='/home/runner/workspace';
const EXPECTED_NODE='v24.13.0';
const PINS={'package.json':'0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0','package-lock.json':'648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287'};
const PRIOR_RUN='r16a-1jiu7A';
const PRIOR_COMMAND_SHA='747d455e65568aac111328ef25adef876346270f990434b0ed5b8e841af62ae9';
const PRIOR_POLICY_SHA='0d32a375e7f43b58a809f5f902e971d6030512729927b4f4f19668610c0f7404';
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const gate=(ok,code)=>{if(!ok)throw Object.assign(new Error(code),{code});};
let reportDir,before={},complete=false,phase='PREFLIGHT';
const observed=new Map();
const result={project:'MyMentalHealthBuddy',status:'ARCHIVE_URL_DIAGNOSTIC_FAILED',releaseReady:false,npmStarted:false,workspaceDependencyAlignment:'UNCHANGED_PENDING',applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN'};
const root=fs.realpathSync('.');
function readSafe(rel,limit=32*1024*1024,optional=false){
  let file=root;
  for(const part of rel.split('/')){
    gate(part&&part!=='.'&&part!=='..','READ_PATH_INVALID');file=path.join(file,part);
    let st;try{st=fs.lstatSync(file);}catch(e){if(optional&&e.code==='ENOENT')return {identity:{state:'ABSENT'}};throw e;}
    gate(!st.isSymbolicLink(),'READ_SYMLINK');
  }
  const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
  try{
    const st=fs.fstatSync(fd);gate(st.isFile()&&st.size<=limit,'READ_FILE_LIMIT');
    const raw=fs.readFileSync(fd),after=fs.fstatSync(fd);
    gate(st.dev===after.dev&&st.ino===after.ino&&st.mtimeMs===after.mtimeMs&&st.size===after.size&&raw.length===st.size,'INPUT_CHANGED_DURING_READ');
    return {identity:{state:'FILE',sha256:hash(raw),bytes:raw.length,mode:st.mode},raw};
  }finally{fs.closeSync(fd);}
}
function observe(rel,limit,optional=false){const r=readSafe(rel,limit,optional);observed.set(rel,{identity:r.identity,limit,optional});return r;}
function safeCode(e){return typeof e.code==='string'&&/^[A-Z][A-Z0-9_]{0,100}$/.test(e.code)?e.code:'DIAGNOSTIC_DRIVER_FAILURE';}
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
try{
  gate(root===EXPECTED_ROOT,'WORKSPACE_IDENTITY');gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  // R16A already created this reserved private directory. Never recreate old runs.
  const ev=path.join(root,'.mmhb-release-evidence'),st=fs.lstatSync(ev);
  gate(st.isDirectory()&&!st.isSymbolicLink()&&fs.realpathSync(ev)===ev&&st.uid===process.getuid()&&(st.mode&0o777)===0o700,'EVIDENCE_DIRECTORY_BOUNDARY');
  const ig=observe('.mmhb-release-evidence/.gitignore',16);
  gate(ig.raw.toString()==='*\n'&&(ig.identity.mode&0o777)===0o600,'EVIDENCE_IGNORE_BOUNDARY');
  process.umask(0o077);reportDir=fs.mkdtempSync(path.join(ev,'r16b-'));
  console.log('COMMAND_ID=MMHB-ARCHIVE-URL-DIAGNOSTIC-R16B');console.log('UTC='+new Date().toISOString());console.log('REPORT_DIRECTORY='+reportDir);
  phase='CURRENT_MANIFEST_IDENTITIES';
  const pair={};
  for(const [file,expected] of Object.entries(PINS)){
    pair[file]=observe(file);before[file]=pair[file].identity;
    gate(pair[file].identity.sha256===expected,'CURRENT_MANIFEST_DRIFT');
  }
  result.inputs=before;
  const manifest=JSON.parse(pair['package.json'].raw),lock=JSON.parse(pair['package-lock.json'].raw);
  gate(manifest.name==='mymentalhealthbuddy'&&lock.name===manifest.name&&lock.lockfileVersion===3,'LOCK_IDENTITY');
  phase='VERIFIER_IDENTITY_OBSERVATION';
  result.verifierObservations=[];
  for(const [file,expected] of [['MMHB-LOCKED-DEPENDENCIES-R16A.txt',PRIOR_COMMAND_SHA],['.mmhb-release-evidence/'+PRIOR_RUN+'/policy-r16.mjs',PRIOR_POLICY_SHA]]){
    const r=observe(file,2*1024*1024,true);
    result.verifierObservations.push({file,state:r.identity.state,sha256:r.identity.sha256,expectedSha256:expected,matches:r.identity.state==='FILE'?r.identity.sha256===expected:null});
  }
  phase='ARCHIVE_CLASSIFICATION';
  const helperRaw=Buffer.from(DIAGNOSTIC_HELPER_B64,'base64');gate(hash(helperRaw)===DIAGNOSTIC_HELPER_SHA,'DIAGNOSTIC_HELPER_IDENTITY');
  const helper=await import('data:text/javascript;base64,'+DIAGNOSTIC_HELPER_B64);
  const full=helper.diagnoseAll(lock);
  save('archive-url-findings.json',full);
  result.diagnostic={...full,failed:undefined,rejectedExamples:full.failed.slice(0,12),allFindingsFile:'archive-url-findings.json',helperSha256:DIAGNOSTIC_HELPER_SHA};
  result.priorEvidence='R16A_REPORTED_ARCHIVE_URL_NOT_ALLOWED_NPM_NOT_STARTED';
  complete=true;
}catch(e){result.failure={gate:safeCode(e),phase};}
finally{
  const changed=[];
  for(const [file,prior] of observed)try{
    const current=readSafe(file,prior.limit,prior.optional).identity;
    if(JSON.stringify(current)!==JSON.stringify(prior.identity))changed.push(file);
  }catch(e){changed.push(file);}
  result.preservation={scope:'SELECTED_MANIFEST_VERIFIER_AND_IGNORE_FILE_OBSERVATIONS_ONLY',changedFiles:changed,observedFiles:observed.size,fullWorktree:'NOT_OBSERVED'};
  if(changed.length){result.failure={gate:'OBSERVED_INPUT_CHANGED',phase:'FINAL_PRESERVATION',previousFailure:result.failure};complete=false;}
  result.status=complete?'ARCHIVE_URL_DIAGNOSTIC_COMPLETE_NOT_INSTALL':'ARCHIVE_URL_DIAGNOSTIC_FAILED';
  result.limitations=['Archive classification only; no URL is approved, rewritten or fetched.','Arbitrary URLs, credentials, query and fragment values are not printed or saved.','Current root package manifests must match the prior reported hashes. Source trees and all dependencies are not requalified.','Selected before/after observations do not lock editors or enforce operating-system isolation.','The missing R15 candidate is not recreated; fresh builds remain required.'];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('archive-url-diagnostic-evidence.json',result);}catch(e){result.evidenceWrite='FAILED';result.failure={gate:safeCode(e),phase:'EVIDENCE_WRITE'};complete=false;result.status='ARCHIVE_URL_DIAGNOSTIC_FAILED';}
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_EDIT=0 PACKAGE_EDIT=0 PACKAGE_INSTALL=0 NPM_STARTED=0 NETWORK_REQUEST=0 APPLICATION_STARTED=0 DATABASE_CONNECTION=0');
  console.log('GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=RETURN_COMPLETE_TERMINAL_SUMMARY');process.exitCode=complete?0:1;
}
