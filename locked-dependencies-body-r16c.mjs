const PRIOR_REPORT = '/tmp/mmhb-prompt-assets-r15-dlss23';
const EXPECTED_CANDIDATE_MANIFEST = '0a7b88ff831e4635b735f038a3538fba4069c21558915b84bd5bf241622f690f';
const EXPECTED_CANDIDATE_FILES = 625;
const EXPECTED_CANDIDATE_BYTES = 40501647;
const selectedNames = ['@vitejs/plugin-react','resend','vite','esbuild','pg','bcrypt','argon2'];
let reportDir,stageDir,before,baseline,priorTree,tool,policyModule,runnerModule,failure;
let phase='PREFLIGHT',stageInputsReady=false,priorAbsent=false,evidenceRoot;
let evidenceRootIdentity,stagePins,normalizerModule,archiveEvidence;
const sourceSummary=value=>{const {receipts,...summary}=value;return summary;};
const observed=new Map();
const result={project:'MyMentalHealthBuddy',status:'LOCKED_DEPENDENCIES_FAILED',releaseReady:false,
  workspaceDependencyAlignment:'UNCHANGED_PENDING',privateDependencyAlignment:'NOT_STARTED',
  applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',npmProcess:{attempted:false,started:false}};

function priorExists(){
  try{fs.lstatSync(PRIOR_REPORT);return true;}catch(error){if(error.code==='ENOENT')return false;throw error;}
}
function prepareEvidenceRoot(){
  const rel='.mmhb-release-evidence',full=path.join(ROOT,rel);
  gate(git('ls-files','--cached','--',rel).length===0,'EVIDENCE_ROOT_TRACKED');
  let st;
  try{st=fs.lstatSync(full);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(!st){
    fs.mkdirSync(full,{mode:0o700});
    fs.writeFileSync(path.join(full,'.gitignore'),'*\n',{flag:'wx',mode:0o600});
    result.evidenceDirectoryCreated=true;
  }
  st=fs.lstatSync(full);
  gate(st.isDirectory()&&!st.isSymbolicLink()&&st.uid===process.getuid()&&(st.mode&0o777)===0o700,'EVIDENCE_ROOT_BOUNDARY');
  const ignore=path.join(full,'.gitignore'),ig=fs.lstatSync(ignore);
  gate(ig.isFile()&&!ig.isSymbolicLink()&&ig.uid===process.getuid()&&ig.size===2&&(ig.mode&0o777)===0o600,'EVIDENCE_IGNORE_BOUNDARY');
  gate(fs.readFileSync(ignore,'utf8')==='*\n','EVIDENCE_IGNORE_CONTENT');
  gate(git('check-ignore','--',rel+'/.gitignore').trim()===rel+'/.gitignore','EVIDENCE_NOT_IGNORED');
  evidenceRootIdentity={dev:st.dev,ino:st.ino};
  return full;
}
function verifyEvidenceRoot(){
  const st=fs.lstatSync(evidenceRoot),ignore=fs.lstatSync(path.join(evidenceRoot,'.gitignore'));
  gate(st.isDirectory()&&!st.isSymbolicLink()&&st.dev===evidenceRootIdentity.dev&&st.ino===evidenceRootIdentity.ino
    &&st.uid===process.getuid()&&(st.mode&0o777)===0o700,'EVIDENCE_ROOT_CHANGED');
  gate(ignore.isFile()&&!ignore.isSymbolicLink()&&ignore.size===2&&ignore.uid===process.getuid()&&(ignore.mode&0o777)===0o600
    &&fs.readFileSync(path.join(evidenceRoot,'.gitignore'),'utf8')==='*\n','EVIDENCE_IGNORE_CHANGED');
  gate(git('ls-files','--cached','--','.mmhb-release-evidence').length===0,'EVIDENCE_ROOT_TRACKED');
}

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
  if(evidenceRoot)try{verifyEvidenceRoot();}catch(error){problems.push(errorInfo(error,suffix));}
  if(priorAbsent)try{gate(!priorExists(),'R15_REPORT_APPEARED_DURING_RUN');}catch(error){problems.push(errorInfo(error,suffix));}
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
  result.preservation=before&&baseline&&(priorTree||priorAbsent)&&tool?'OBSERVED_CURRENT_INPUTS_AND_AVAILABLE_EVIDENCE_PRESERVED':'PARTIAL_OBSERVATIONS_ONLY';
}
function checkStageInputs(){
  for(const file of ['package.json','package-lock.json'])gate(artifactIdentity(stageDir,file).sha256===stagePins[file],
    'STAGED_MANIFEST_CHANGED',{file});
}
try{
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');
  gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  process.umask(0o077);
  evidenceRoot=prepareEvidenceRoot();
  reportDir=fs.mkdtempSync(path.join(evidenceRoot,'r16c-'));  fs.chmodSync(reportDir,0o700);
  console.log('COMMAND_ID=MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C');console.log('UTC='+new Date().toISOString());
  console.log('ISSUE_ID=REGISTRY-ARCHIVE-RELOCATION-001');console.log('REPORT_DIRECTORY='+reportDir);
  const helperSources={policy:Buffer.from(POLICY_B64,'base64'),runner:Buffer.from(RUNNER_B64,'base64'),normalizer:Buffer.from(NORMALIZER_B64,'base64')};
  gate(hash(helperSources.policy)===POLICY_SHA&&hash(helperSources.runner)===RUNNER_SHA&&hash(helperSources.normalizer)===NORMALIZER_SHA,'EMBEDDED_HELPER_IDENTITY');
  for(const [name,raw] of Object.entries(helperSources))fs.writeFileSync(path.join(reportDir,name+(name==='normalizer'?'-r16c.mjs':'-r16.mjs')),raw,{flag:'wx',mode:0o600});
  policyModule=await import('data:text/javascript;base64,'+POLICY_B64);
  runnerModule=await import('data:text/javascript;base64,'+RUNNER_B64);
  normalizerModule=await import('data:text/javascript;base64,'+NORMALIZER_B64);
  phase='CURRENT_R15_BASELINE';
  before=snapshot();save('git-before.json',before);
  gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');
  baseline=checkPins();for(const [rel,id] of Object.entries(baseline))observed.set(rel,id);
  for(const [rel,expected] of Object.entries(ASSET_PINS))observe(rel,expected);
  result.workspacePackages=selectedWorkspace();
  priorAbsent=!priorExists();
  result.priorCandidate=priorAbsent?'ABSENT_NOT_RECOVERED_FRESH_REBUILD_REQUIRED':'PRESENT_PENDING_VERIFICATION';
  if(!priorAbsent){
  const evidence=retainedJSON(PRIOR_REPORT,'prompt-asset-repair-evidence.json');
  gate(evidence.project==='MyMentalHealthBuddy'&&evidence.status==='PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE'
    &&evidence.preservation==='EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED','R15_EVIDENCE_STATUS');
  const manifest=retainedJSON(PRIOR_REPORT,'candidate-manifest.json');
  gate(hash(JSON.stringify(manifest))===EXPECTED_CANDIDATE_MANIFEST,'R15_MANIFEST_IDENTITY');
  gate(evidence.candidateManifestSha256===EXPECTED_CANDIDATE_MANIFEST,'R15_EVIDENCE_MANIFEST');
  priorTree=artifactTree(path.join(PRIOR_REPORT,'candidate'));matchTree(priorTree,manifest.rows,'R15_CANDIDATE_IDENTITY');
  gate(priorTree.rows.length===EXPECTED_CANDIDATE_FILES&&priorTree.bytes===EXPECTED_CANDIDATE_BYTES,'R15_CANDIDATE_SIZE');
  save('r15-candidate-before.json',priorTree);
  result.priorCandidate='PRESENT_IDENTITIES_VERIFIED';
  }
  save('workspace-inputs-before.json',Object.fromEntries(observed));
  console.log('GATE=CURRENT_SOURCE_AND_PRIOR_AVAILABILITY RESULT=PASS');
  phase='LOCK_AND_NPM_PREFLIGHT';
  const packageBytes=fs.readFileSync(path.join(ROOT,'package.json'));
  const lockBytes=fs.readFileSync(path.join(ROOT,'package-lock.json'));
  gate(hash(packageBytes)===PINS['package.json']&&hash(lockBytes)===PINS['package-lock.json'],'PACKAGE_COPY_SOURCE_DRIFT');
  const pkg=JSON.parse(packageBytes),originalLock=JSON.parse(lockBytes);
  const plan=normalizerModule.planArchiveRepair(pkg,originalLock,policyModule.validateLock);
  save('archive-repair-plan.json',{status:plan.status,originalLockSha256:hash(lockBytes),
    originalObjectSha256:plan.originalObjectSha256,normalizedObjectSha256:plan.normalizedObjectSha256,
    changedEntries:plan.changedEntries,packageCount:plan.packageCount,changes:plan.changes});
  result.archiveRepair={status:'PLANNED_NOT_VERIFIED',changedEntries:plan.changedEntries,
    uniqueSourcesRequired:plan.requests.length,originalLockSha256:hash(lockBytes)};
  tool=runnerModule.discoverNpm(process.env.PATH||'',process.execPath);save('npm-tool-before.json',tool);
  result.tool=tool;
  verifyCurrent('before-registry');
  console.log('GATE=PROPOSED_LOCK_STRUCTURE_AND_NPM_TOOL RESULT=PASS');
  console.log('ARCHIVE_URLS_TO_REPAIR='+plan.changedEntries+' UNIQUE_SOURCES_TO_VERIFY='+plan.requests.length);
  phase='PUBLIC_REGISTRY_SOURCE_VERIFICATION';
  const sourceController=new AbortController();
  const sourceInterrupt=()=>sourceController.abort();
  process.on('SIGINT',sourceInterrupt);process.on('SIGTERM',sourceInterrupt);
  try{
    archiveEvidence=await normalizerModule.verifyArchiveSources(plan,{signal:sourceController.signal,
      onProgress:p=>console.log('REGISTRY_VERIFY_PROGRESS VERIFIED='+p.verified+' TOTAL='+p.total+' REQUESTS='+p.requests+' ELAPSED_SECONDS='+p.elapsedSeconds)});
  }catch(error){
    if(error.sourceResult){archiveEvidence=error.sourceResult;result.archiveSources=sourceSummary(archiveEvidence);save('archive-source-evidence.json',archiveEvidence);}
    throw error;
  }finally{process.removeListener('SIGINT',sourceInterrupt);process.removeListener('SIGTERM',sourceInterrupt);}
  result.archiveSources=sourceSummary(archiveEvidence);save('archive-source-evidence.json',archiveEvidence);
  normalizerModule.assertOnlyResolvedChanges(originalLock,plan);
  const lock=plan.normalized,normalizedLockBytes=Buffer.from(JSON.stringify(lock,null,2)+'\n');
  stagePins={'package.json':hash(packageBytes),'package-lock.json':hash(normalizedLockBytes)};
  const policy=policyModule.validateLock(pkg,lock);save('lock-policy.json',policy);
  result.lockPolicy={status:policy.status,packageCount:policy.packageCount,selectedLocked:policy.selectedLocked,optionalCount:policy.optionalCount,platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations};
  result.archiveRepair={...result.archiveRepair,status:'VERIFIED_FOR_PRIVATE_COPY',stagedLockSha256:stagePins['package-lock.json'],
    changedFields:['packages[...].resolved'],versionsAndIntegrity:'UNCHANGED',rootLockChanged:false};
  verifyCurrent('after-registry');
  console.log('GATE=PUBLIC_REGISTRY_IDENTITY_AND_ORIGINAL_INTEGRITY RESULT=PASS');
  phase='PRIVATE_STAGE_PREPARATION';
  stageDir=path.join(reportDir,'stage');fs.mkdirSync(stageDir,{mode:0o700});result.stageDirectory=stageDir;
  fs.writeFileSync(path.join(stageDir,'package.json'),packageBytes,{flag:'wx',mode:0o600});
  fs.writeFileSync(path.join(stageDir,'package-lock.json'),normalizedLockBytes,{flag:'wx',mode:0o600});
  checkStageInputs();stageInputsReady=true;save('install-inputs.json',{project:'MyMentalHealthBuddy',stageDirectory:stageDir,
    packageSha256:hash(packageBytes),lockSha256:hash(normalizedLockBytes),originalRootLockSha256:hash(lockBytes),changedArchiveEntries:plan.changedEntries,
    policySha256:POLICY_SHA,runnerSha256:RUNNER_SHA,normalizerSha256:NORMALIZER_SHA});
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
  result.privateDependencyAlignment='REGISTRY_NORMALIZED_LOCKED_STAGE_METADATA_PASS';
  result.stageDirectory=stageDir;
  result.status='REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE';
  console.log('GATE=INSTALLED_LOCKED_DEPENDENCIES RESULT=PASS');
}catch(error){if(error.processResult)result.npmProcess=error.processResult;failure=errorInfo(error,phase);}
finally{
  if(reportDir)try{verifyCurrent('final');console.log('GATE=OBSERVED_CURRENT_INPUT_PRESERVATION RESULT='+ (result.preservation==='OBSERVED_CURRENT_INPUTS_AND_AVAILABLE_EVIDENCE_PRESERVED'?'PASS':'PARTIAL'));}
  catch(error){failure={...errorInfo(error,'FINAL_PRESERVATION'),previousFailure:failure};result.preservation='FAILED';}
  if(failure)result.status='LOCKED_DEPENDENCIES_FAILED';
  result.failure=failure;
  result.limitations=[
    'Generated evidence is project-local and Git-ignored; it is not an off-host backup.',
    'An absent old R15 report is recorded, not reconstructed or certified preserved. Present R15 evidence must still verify.',
    'This stage contains dependencies and package manifests only; no app source or candidate is rebuilt.',
    'The active workspace dependency tree is unchanged. This private stage requires a fresh application build; historical candidates are not upgraded.',
    'Changed archive URLs are verified against official registry identity and the original SHA-512; only private lock resolved fields change.',
    'Registry verification uses bounded built-in HTTPS requests without credentials or redirect following; the old archive URLs are never requested.',
    'npm installation executes the existing npm CLI and uses the network. Dependency lifecycle scripts are disabled.',
    'Registry URL validation and a minimal environment are not an OS filesystem/network sandbox.',
    'npm checks installed archive integrity against the normalized lock with original digests; no publisher/provenance or vulnerability audit is claimed.',
    'Absent optional packages are reported, not proven unnecessary. Native and build-tool readiness require subsequent tests.',
    'Before/after observations do not lock editors or cover every ignored workspace dependency.',
    'This does not qualify application, browser, database, AI safety, backup/restore or deployed identity.'
  ];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('locked-dependencies-evidence.json',result);}
  catch(error){result.failure={...errorInfo(error,'EVIDENCE_WRITE'),previousFailure:failure};failure=result.failure;result.evidenceWrite='FAILED';result.status='LOCKED_DEPENDENCIES_FAILED';}
  if(failure)console.log('FAILED_GATE='+failure.gate);
  const terminal={project:result.project,status:result.status,releaseReady:result.releaseReady,
    archiveRepairStatus:result.archiveRepair?.status,archiveUrlsToRepair:result.archiveRepair?.changedEntries,
    registryStatus:result.archiveSources?.status,registrySourcesRequired:result.archiveSources?.uniqueSourcesRequired,
    registrySourcesVerified:result.archiveSources?.uniqueSourcesVerified,registryRequests:result.archiveSources?.requests,
    npmProcess:{attempted:result.npmProcess.attempted,started:result.npmProcess.started,
      exitCode:result.npmProcess.exitCode,status:result.npmProcess.status,errorCodes:result.npmProcess.errorCodes,
      timedOut:result.npmProcess.timedOut,interrupted:result.npmProcess.interrupted},
    privateDependencyAlignment:result.privateDependencyAlignment,workspaceDependencyAlignment:result.workspaceDependencyAlignment,
    selectedInstalledVersions:result.installed?.selected?.map(x=>({name:x.name,version:x.version})),
    priorCandidate:result.priorCandidate,preservation:result.preservation,
    changedFileCount:result.currentPreservation?.changedFileCount,
    applicationRuntime:result.applicationRuntime,deployedArtifact:result.deployedArtifact,
    stageDirectory:result.stageDirectory,evidenceWrite:result.evidenceWrite,
    evidenceFile:reportDir?path.join(reportDir,'locked-dependencies-evidence.json'):undefined,
    failure:result.failure};
  console.log(JSON.stringify(terminal,null,2));
  console.log('SOURCE_EDIT=0 ROOT_PACKAGE_EDIT=0 ACTIVE_NODE_MODULES_MODIFIED=0 PRIVATE_STAGE_ONLY=1');
  console.log('REGISTRY_REQUESTS='+(archiveEvidence?.requests??'NOT_COMPLETED')+' ARCHIVE_REPAIR_ENTRIES='+(result.archiveRepair?.changedEntries??'NOT_PLANNED'));
  console.log('PRIVATE_NPM_INSTALL_ATTEMPTED='+(result.npmProcess.attempted?1:0)+' LIFECYCLE_SCRIPTS=DISABLED NETWORK_REQUEST_COUNT=NOT_MEASURED');
  console.log('BUILD=NOT_RUN APPLICATION_STARTED=0 AI_REQUEST=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0');
  console.log('CREDENTIAL_CHANGE=0 GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');process.exitCode=failure?1:0;
}
