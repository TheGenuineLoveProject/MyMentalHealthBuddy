const PRIOR_REPORT = '/tmp/mmhb-prompt-assets-r15-dlss23';
const EXPECTED_CANDIDATE_MANIFEST = '0a7b88ff831e4635b735f038a3538fba4069c21558915b84bd5bf241622f690f';
const EXPECTED_CANDIDATE_FILES = 625;
const EXPECTED_CANDIDATE_BYTES = 40501647;
const selectedNames = ['@vitejs/plugin-react','resend','vite','esbuild','pg','bcrypt','argon2'];
let reportDir,stageDir,before,baseline,priorTree,tool,policyModule,runnerModule,failure;
let phase='PREFLIGHT',stageInputsReady=false;
const observed=new Map();
const result={project:'MyMentalHealthBuddy',status:'LOCKED_DEPENDENCIES_FAILED',releaseReady:false,
  workspaceDependencyAlignment:'UNCHANGED_PENDING',privateDependencyAlignment:'NOT_STARTED',
  applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',npmProcess:{attempted:false,started:false}};
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2),{flag:'wx',mode:0o600});}
function observe(rel,expected=null){
  const id=identity(path.join(ROOT,rel),rel.startsWith('node_modules/'));
  observed.set(rel,id);
  if(expected)gate(id.sha256===expected,'R15_SOURCE_OR_SELECTED_INPUT_DRIFT',{file:label(rel)});
  return id;
}
function errorInfo(error,at){
  const code=error.gate||error.code;
  const safeCode=typeof code==='string'&&/^[A-Z][A-Z0-9_]{0,100}$/.test(code)?code:'UNEXPECTED_INSTALL_DRIVER_FAILURE';
  const detail={};
  if(error.detail&&typeof error.detail==='object')for(const key of ['reason','file','operation','code']){
    if(typeof error.detail[key]==='string')detail[key]=label(error.detail[key]);
  }
  if(typeof error.file==='string')detail.file=label(error.file);
  if(typeof error.path==='string'){
    const full=path.resolve(ROOT,error.path);
    const base=[reportDir,PRIOR_REPORT].find(x=>x&&(full===x||inside(x,full)));
    detail.file=base?'REPORT/'+label(path.relative(base,full)||'ROOT'):inside(ROOT,full)?label(path.relative(ROOT,full)):label(error.path);
  }
  return {gate:safeCode,phase:at,detail};
}
function selectedWorkspace(){
  return selectedNames.map(name=>{
    const rel='node_modules/'+name+'/package.json',id=observe(rel);
    const obj=id.state==='FILE'?readJSON(path.join(ROOT,rel),1024*1024):null;
    const value=obj?.version;
    return {name,state:id.state,version:typeof value==='string'&&/^[0-9A-Za-z.+-]{1,100}$/.test(value)?value:null,
      identity:id};
  });
}
function verifyCurrent(suffix){
  const problems=[];
  if(before)try{
    const after=snapshot(); save('git-'+suffix+'.json',after);
    result.currentPreservation=snapshotDifference(before,after);
    if(result.currentPreservation.components.length)problems.push({gate:'GIT_OR_WORKTREE_NOT_PRESERVED',phase:suffix});
  }catch(error){problems.push(errorInfo(error,suffix));}
  for(const [rel,prior] of observed)try{
    gate(JSON.stringify(identity(path.join(ROOT,rel),rel.startsWith('node_modules/')))===JSON.stringify(prior),
      'OBSERVED_WORKSPACE_INPUT_CHANGED',{file:label(rel)});
  }catch(error){problems.push(errorInfo(error,suffix));}
  for(const entry of retainedFiles.values())try{
    gate(JSON.stringify(artifactIdentity(entry.base,entry.rel))===JSON.stringify(entry.id),
      'RETAINED_R15_REPORT_CHANGED',{file:entry.rel});
  }catch(error){problems.push(errorInfo(error,suffix));}
  if(priorTree)try{sameTree(artifactTree(path.join(PRIOR_REPORT,'candidate')),priorTree,'R15_CANDIDATE_CHANGED');}
  catch(error){problems.push(errorInfo(error,suffix));}
  if(tool)try{
    gate(JSON.stringify(runnerModule.discoverNpm(process.env.PATH||'',process.execPath))===JSON.stringify(tool),
      'NPM_TOOL_IDENTITY_CHANGED');
  }catch(error){problems.push(errorInfo(error,suffix));}
  if(stageInputsReady)try{checkStageInputs();}catch(error){problems.push(errorInfo(error,suffix));}
  result.preservationScope={git:!!before,pins:!!baseline,promptAssets:22===Object.keys(ASSET_PINS).filter(x=>observed.has(x)).length,
    retainedCandidate:!!priorTree,npmTool:!!tool,ignoredWorkspaceDependencies:'SELECTED_IDENTITIES_ONLY'};
  if(problems.length){result.preservationFailures=problems;throw Object.assign(new Error('PRESERVATION_FAILED'),{gate:'PRESERVATION_FAILED'});}
  result.preservation=before&&baseline&&priorTree&&tool?'OBSERVED_WORKSPACE_R15_AND_NPM_TOOL_PRESERVED':'PARTIAL_OBSERVATIONS_ONLY';
}
function checkStageInputs(){
  for(const file of ['package.json','package-lock.json'])gate(artifactIdentity(stageDir,file).sha256===PINS[file],
    'STAGED_MANIFEST_CHANGED',{file});
}
try{
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');
  gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  gate(fs.realpathSync('/tmp')==='/tmp','TEMP_DIRECTORY_BOUNDARY');
  process.umask(0o077);
  reportDir=fs.mkdtempSync('/tmp/mmhb-locked-dependencies-r16-'); fs.chmodSync(reportDir,0o700);
  console.log('COMMAND_ID=MMHB-LOCKED-DEPENDENCIES-R16');console.log('UTC='+new Date().toISOString());
  console.log('ISSUE_ID=LOCKED-DEPENDENCY-RECONSTRUCTION-001');console.log('REPORT_DIRECTORY='+reportDir);
  const helperSources={policy:Buffer.from(POLICY_B64,'base64'),runner:Buffer.from(RUNNER_B64,'base64')};
  gate(hash(helperSources.policy)===POLICY_SHA&&hash(helperSources.runner)===RUNNER_SHA,'EMBEDDED_HELPER_IDENTITY');
  for(const [name,raw] of Object.entries(helperSources))fs.writeFileSync(path.join(reportDir,name+'-r16.mjs'),raw,{flag:'wx',mode:0o600});
  policyModule=await import('data:text/javascript;base64,'+POLICY_B64);
  runnerModule=await import('data:text/javascript;base64,'+RUNNER_B64);
  phase='CURRENT_R15_BASELINE';
  before=snapshot();save('git-before.json',before);
  gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');
  baseline=checkPins();for(const [rel,id] of Object.entries(baseline))observed.set(rel,id);
  for(const [rel,expected] of Object.entries(ASSET_PINS))observe(rel,expected);
  result.workspacePackages=selectedWorkspace();
  const evidence=retainedJSON(PRIOR_REPORT,'prompt-asset-repair-evidence.json');
  gate(evidence.project==='MyMentalHealthBuddy'&&evidence.status==='PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE'
    &&evidence.preservation==='EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED','R15_EVIDENCE_STATUS');
  const manifest=retainedJSON(PRIOR_REPORT,'candidate-manifest.json');
  gate(hash(JSON.stringify(manifest))===EXPECTED_CANDIDATE_MANIFEST,'R15_MANIFEST_IDENTITY');
  gate(evidence.candidateManifestSha256===EXPECTED_CANDIDATE_MANIFEST,'R15_EVIDENCE_MANIFEST');
  priorTree=artifactTree(path.join(PRIOR_REPORT,'candidate'));matchTree(priorTree,manifest.rows,'R15_CANDIDATE_IDENTITY');
  gate(priorTree.rows.length===EXPECTED_CANDIDATE_FILES&&priorTree.bytes===EXPECTED_CANDIDATE_BYTES,'R15_CANDIDATE_SIZE');
  save('r15-candidate-before.json',priorTree);save('workspace-inputs-before.json',Object.fromEntries(observed));
  console.log('GATE=CURRENT_SOURCE_AND_R15_CANDIDATE RESULT=PASS');
  phase='LOCK_AND_NPM_PREFLIGHT';
  const packageBytes=fs.readFileSync(path.join(ROOT,'package.json'));
  const lockBytes=fs.readFileSync(path.join(ROOT,'package-lock.json'));
  gate(hash(packageBytes)===PINS['package.json']&&hash(lockBytes)===PINS['package-lock.json'],'PACKAGE_COPY_SOURCE_DRIFT');
  const pkg=JSON.parse(packageBytes),lock=JSON.parse(lockBytes);
  const policy=policyModule.validateLock(pkg,lock);save('lock-policy.json',policy);
  result.lockPolicy={status:policy.status,packageCount:policy.packageCount,selectedLocked:policy.selectedLocked,optionalCount:policy.optionalCount,platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations};
  tool=runnerModule.discoverNpm(process.env.PATH||'',process.execPath);save('npm-tool-before.json',tool);
  result.tool=tool;
  stageDir=path.join(reportDir,'stage');fs.mkdirSync(stageDir,{mode:0o700});result.stageDirectory=stageDir;
  fs.writeFileSync(path.join(stageDir,'package.json'),packageBytes,{flag:'wx',mode:0o600});
  fs.writeFileSync(path.join(stageDir,'package-lock.json'),lockBytes,{flag:'wx',mode:0o600});
  checkStageInputs();stageInputsReady=true;save('install-inputs.json',{project:'MyMentalHealthBuddy',stageDirectory:stageDir,
    packageSha256:hash(packageBytes),lockSha256:hash(lockBytes),policySha256:POLICY_SHA,runnerSha256:RUNNER_SHA});
  verifyCurrent('before-install');
  console.log('GATE=LOCK_AND_PRIVATE_INSTALL_CONTRACT RESULT=PASS');
  phase='PRIVATE_NPM_CI';
  result.npmProcess={attempted:true,started:false};result.privateDependencyAlignment='INSTALL_ATTEMPTED_UNQUALIFIED';
  const npmResult=await runnerModule.runNpm(tool,stageDir,reportDir);
  result.npmProcess=npmResult;save('npm-process.json',npmResult);
  gate(npmResult.status==='NPM_CI_PROCESS_PASS_PENDING_TREE_VERIFICATION','PRIVATE_NPM_CI_FAILED');
  console.log('GATE=PRIVATE_NPM_CI RESULT=PASS');
  phase='INSTALLED_LOCK_VERIFICATION';result.privateDependencyAlignment='INSTALLED_PENDING_VERIFICATION';checkStageInputs();
  const installed=policyModule.inspectInstalled(stageDir,lock);gate(installed.status==='PRIVATE_LOCKED_DEPENDENCIES_INSPECTED','INSTALLED_LOCK_VERIFICATION_FAILED');save('installed-dependencies.json',installed);
  const {fileManifest,installed:allPackages,absentOptional,...summary}=installed;
  result.installed={...summary,absentOptionalCount:absentOptional.length,absentOptionalDisplayed:absentOptional.slice(0,12),
    selectedRuntimeFiles:fileManifest.filter(x=>['node_modules/resend/dist/index.mjs','node_modules/resend/dist/index.cjs','node_modules/pg/lib/native/client.js','node_modules/@vitejs/plugin-react/package.json','node_modules/esbuild/bin/esbuild'].includes(x.file))};
  result.privateDependencyAlignment='LOCKED_STAGE_METADATA_PASS';
  result.stageDirectory=stageDir;
  result.status='LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE';
  console.log('GATE=INSTALLED_LOCKED_DEPENDENCIES RESULT=PASS');
}catch(error){if(error.processResult)result.npmProcess=error.processResult;failure=errorInfo(error,phase);}
finally{
  if(reportDir)try{verifyCurrent('final');console.log('GATE=OBSERVED_WORKSPACE_AND_R15_PRESERVATION RESULT='+ (result.preservation==='OBSERVED_WORKSPACE_R15_AND_NPM_TOOL_PRESERVED'?'PASS':'PARTIAL'));}
  catch(error){failure={...errorInfo(error,'FINAL_PRESERVATION'),previousFailure:failure};result.preservation='FAILED';}
  if(failure)result.status='LOCKED_DEPENDENCIES_FAILED';
  result.failure=failure;
  result.limitations=[
    'This stage contains dependencies and package manifests only; no app source or candidate is rebuilt.',
    'The workspace still uses its original dependencies; R15 retains its older build-tool versions.',
    'npm installation executes the existing npm CLI and uses the network. Dependency lifecycle scripts are disabled.',
    'Registry URL validation and a minimal environment are not an OS filesystem/network sandbox.',
    'Archive integrity is checked by npm against the lockfile; no independent publisher/provenance or vulnerability audit is claimed.',
    'Absent optional packages are reported, not proven unnecessary. Native and build-tool readiness require subsequent tests.',
    'Before/after observations do not lock editors or cover every ignored workspace dependency.',
    'This does not qualify application, browser, database, AI safety, backup/restore or deployed identity.'
  ];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('locked-dependencies-evidence.json',result);}
  catch(error){result.failure={...errorInfo(error,'EVIDENCE_WRITE'),previousFailure:failure};failure=result.failure;result.evidenceWrite='FAILED';result.status='LOCKED_DEPENDENCIES_FAILED';}
  if(failure)console.log('FAILED_GATE='+failure.gate);
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_EDIT=0 WORKSPACE_PACKAGE_EDIT=0 WORKSPACE_PACKAGE_INSTALL=0 R15_CANDIDATE_MODIFIED=0');
  console.log('PRIVATE_NPM_INSTALL_ATTEMPTED='+(result.npmProcess.attempted?1:0)+' LIFECYCLE_SCRIPTS=DISABLED NETWORK_REQUEST_COUNT=NOT_MEASURED');
  console.log('BUILD=NOT_RUN APPLICATION_STARTED=0 AI_REQUEST=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0');
  console.log('CREDENTIAL_CHANGE=0 GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');process.exitCode=failure?1:0;
}
