// R18A: reuse the retained candidate, link selected source to compiler inputs,
// and exercise only byte-reviewed dependency helpers with synthetic transports.
const PRIOR_NAME='r17b-q6rzGy';
const DIAGNOSTIC_NAME='r17c-tn3PWG';
const OBSERVED_SERVER_SHA='d103e3532fe45af0d270c777310334a4672338fc2345660287033e9ecf98d2c7';
const OBSERVED_CANDIDATE_SHA='cb4c9c57fce1124f453110eb713d86b0f32855436df1030427cc32c2a2df0320';
let evidenceRoot,evidenceRootIdentity,reportDir,priorDir,retainedRoot,candidateDir,before,candidateBefore;
let buildPolicy,graphPolicy,snapshotPolicy,packagePolicy,helperSmoke,resendSmoke,failure,phase='PREFLIGHT';
const reads=new Map(),pinsBefore=new Map(),absences=new Map(),reviewTexts={},issues=[];
const result={project:'MyMentalHealthBuddy',status:'RUNTIME_CONTRACT_FAILED',releaseReady:false,
  historicalR17BStatus:'FRESH_CANDIDATE_FAILED',execution:{helperTestsAttempted:false,resendTestsAttempted:false},applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',issues};
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
function graphFailureDetails(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return undefined;
  const safe={};
  if([1,2].includes(value.metadataIndex))safe.metadataIndex=value.metadataIndex;
  if(['INPUT','OUTPUT','PACKAGE'].includes(value.graphSide))safe.graphSide=value.graphSide;
  if(typeof value.owner==='string')safe.owner=label(value.owner);
  if(typeof value.ownerSha256==='string'&&/^[a-f0-9]{64}$/.test(value.ownerSha256))safe.ownerSha256=value.ownerSha256;
  if(Number.isSafeInteger(value.ownerBytes)&&value.ownerBytes>=0)safe.ownerBytes=value.ownerBytes;
  if(Number.isSafeInteger(value.importIndex)&&value.importIndex>=0)safe.importIndex=value.importIndex;
  if(typeof value.kind==='string'&&/^[a-z-]{1,40}$/.test(value.kind))safe.kind=value.kind;
  if(typeof value.specifierSha256==='string'&&/^[a-f0-9]{64}$/.test(value.specifierSha256))safe.specifierSha256=value.specifierSha256;
  if(Number.isSafeInteger(value.specifierBytes)&&value.specifierBytes>=0)safe.specifierBytes=value.specifierBytes;
  if(typeof value.specifierClass==='string'&&/^[A-Z_]{1,50}$/.test(value.specifierClass))safe.specifierClass=value.specifierClass;
  return Object.keys(safe).length?safe:undefined;
}
function cleanError(e){const c=e.gate||e.code;return {phase,gate:typeof c==='string'&&/^[A-Z0-9_]{1,100}$/.test(c)?c:'RUNTIME_CONTRACT_ERROR',
  ...(graphFailureDetails(e.details)?{graphDetails:graphFailureDetails(e.details)}:{}),
  ...(typeof (e.file||e.detail?.file)==='string'?{file:label(e.file||e.detail.file)}:{})};}
function readFile(base,rel,max=64*1024**2){
  gate(!privatePath(rel)&&buildPolicy.safeRelative(rel),'READ_PATH');
  const id=buildPolicy.fileIdentity(base,rel);gate(id.bytes<=max,'READ_SIZE_LIMIT',{file:rel});
  const key=path.join(base,rel),old=reads.get(key);gate(!old||JSON.stringify(old.id)===JSON.stringify(id),'READ_CHANGED',{file:rel});
  const bytes=fs.readFileSync(key);gate(hash(bytes)===id.sha256,'READ_CHANGED',{file:rel});
  reads.set(key,{base,rel,id});return {id,text:bytes.toString('utf8')};
}
function readJson(base,rel,max){return JSON.parse(readFile(base,rel,max).text);}
function optionalFile(base,rel,max){try{return readFile(base,rel,max);}catch(e){if(e.code!=='ENOENT')throw e;
  // Missing may only be accepted after checking all existing path components for links.
  let at=base;buildPolicy.directory(base);
  for(const part of rel.split('/')){at=path.join(at,part);try{gate(!fs.lstatSync(at).isSymbolicLink(),'OPTIONAL_SYMLINK');}catch(x){if(x.code==='ENOENT')break;throw x;}}
  absences.set(path.join(base,rel),{base,rel});return null;}}
function checkedManifest(value,max=100000,allowLinks=false){
  gate(value&&Array.isArray(value.rows)&&value.rows.length>0&&value.rows.length<=max,'MANIFEST_SCHEMA');
  const names=new Set();let bytes=0;
  for(const row of value.rows){gate(row&&buildPolicy.safeRelative(row.file)&&!privatePath(row.file)&&!names.has(row.file)
    &&Number.isSafeInteger(row.bytes)&&row.bytes>=0&&row.bytes<=512*1024**2&&Number.isSafeInteger(row.mode),'MANIFEST_ROW');
    if(row.type==='file')gate(/^[a-f0-9]{64}$/.test(row.sha256),'MANIFEST_FILE_HASH');
  else gate(allowLinks&&row.type==='symlink'&&row.file.startsWith('node_modules/')&&path.posix.basename(path.posix.dirname(row.file))==='.bin'&&typeof row.link==='string'
      &&row.link.length<=4096&&!path.isAbsolute(row.link)&&!/[\x00-\x1f\x7f\\]/.test(row.link)
      &&hash(row.link)===row.linkSha256&&Buffer.byteLength(row.link)===row.bytes
      &&buildPolicy.safeRelative(row.target)&&row.target.startsWith('node_modules/')
      &&path.posix.normalize(path.posix.join(path.posix.dirname(row.file),row.link))===row.target
      &&/^[a-f0-9]{64}$/.test(row.targetSha256)&&Number.isSafeInteger(row.targetBytes)&&row.targetBytes>=0,'MANIFEST_LINK');
    names.add(row.file);bytes+=row.bytes;}
  gate(value.manifestSha256===hash(JSON.stringify(value.rows)),'MANIFEST_DIGEST');
  if(value.bytes!==undefined)gate(value.bytes===bytes,'MANIFEST_BYTES');return new Map(value.rows.map(r=>[r.file,r]));
}
function compareId(id,row){gate(row&&id.sha256===row.sha256&&id.bytes===row.bytes&&id.mode===row.mode,'RETAINED_INPUT_CHANGED',{file:id.file});}
function selectedReview(item,inputMap,graphMap){
  const found=optionalFile(retainedRoot,item.file,2*1024**2),listed=graphMap.get(item.file);
  if(found){compareId(found.id,inputMap.get(item.file));reviewTexts[item.file]=found.text;}
  const match=found?.id.sha256===item.sha256;
  return {file:item.file,state:found?'FILE':'ABSENT',sha256:found?.id.sha256,reviewedSourceMatch:match,
    listedCompilerInput:Boolean(listed),bytesInOutput:listed?.bytesInOutput||0,
    classification:match?item.classification:'REVIEW_REQUIRED',
    scope:'EXACT_SOURCE_AND_COMPILER_INPUT_ONLY_NOT_COMPLETE_RUNTIME_REACHABILITY'};
}
console.log('COMMAND_ID=MMHB-RUNTIME-CONTRACT-R18A');console.log('UTC='+new Date().toISOString());
console.log('ISSUE_ID=R18-EXTERNAL-GRAPH-CONTRACT-001');
try{
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  gate(fs.realpathSync(git('rev-parse','--show-toplevel').trim())===ROOT,'GIT_ROOT');process.umask(0o077);
  // Prior evidence must already exist. R18A does not introduce or widen ignore rules.
  gate(fs.lstatSync(path.join(ROOT,'.mmhb-release-evidence')).isDirectory(),'PRIOR_EVIDENCE_REQUIRED');
  evidenceRoot=prepareEvidenceRoot();reportDir=fs.mkdtempSync(path.join(evidenceRoot,'r18a-'));fs.chmodSync(reportDir,0o700);
  console.log('REPORT_DIRECTORY='+reportDir);
  for(const v of Object.values(HELPERS))gate(hash(Buffer.from(v.b64,'base64'))===v.sha256,'HELPER_HASH');
  const load=key=>import('data:text/javascript;base64,'+HELPERS[key].b64);
  buildPolicy=await load('BUILD');snapshotPolicy=await load('SNAPSHOT');graphPolicy=await load('GRAPH');
  packagePolicy=await load('PACKAGE');helperSmoke=await load('SMOKE');resendSmoke=await load('RESEND');
  before=snapshot();snapshotPolicy.validateSnapshot(before);save('git-before.json',before);
  gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');
  phase='CURRENT_PINS';
  for(const [file,expected] of Object.entries({...PINS,...ASSET_PINS})){
    const id=rawIdentity(file);gate(id.state==='FILE'&&id.sha256===expected,'PIN_DRIFT',{file});pinsBefore.set(file,id);}
  result.pins={status:'ALL_PINS_MATCH',count:pinsBefore.size};
  priorDir=path.join(evidenceRoot,PRIOR_NAME);retainedRoot=path.join(priorDir,'build-input');candidateDir=path.join(priorDir,'candidate');
  buildPolicy.directory(priorDir);buildPolicy.directory(retainedRoot);
  phase='REVIEWED_PRESERVATION_DIFFERENCES';
  const diagnostic=readJson(path.join(evidenceRoot,DIAGNOSTIC_NAME),'preservation-diagnostic-evidence.json');
  gate(diagnostic.project==='MyMentalHealthBuddy'&&diagnostic.status==='PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED'
    &&Array.isArray(diagnostic.issues)&&diagnostic.issues.length===0&&diagnostic.diagnosticPreservation?.changedFileCount===0,'R17C_RECEIPT');
  gate(JSON.stringify(diagnostic.historicalChanges?.components)===JSON.stringify(['worktree','files'])
    &&diagnostic.historicalRunStatus==='FRESH_CANDIDATE_FAILED','R17C_HISTORICAL_SCOPE');
  const changes=diagnostic.historicalChanges?.changes;
  gate(Array.isArray(changes)&&changes.length===REVIEWED_ADDITIONS.length&&diagnostic.historicalChanges.changedFileCount===42,'R17C_CHANGE_COUNT');
  const byName=new Map(changes.map(r=>[r.file,r]));gate(byName.size===changes.length,'R17C_DUPLICATE_CHANGE');
  for(const reviewed of REVIEWED_ADDITIONS){const c=byName.get(reviewed.file);
    gate(c&&c.kind==='ADDED_TO_OBSERVED_SET'&&c.before?.state==='NOT_IN_OBSERVED_SET'&&c.after?.state==='FILE'
      &&c.after.sha256===reviewed.sha256&&c.after.bytes===reviewed.bytes&&c.after.mode===33152
      &&c.scope?.pinned===false&&c.scope?.inRecordedSourceCopy===false&&c.current?.matchesAfter===true,'R17C_CHANGE_REVIEW_MISMATCH');}
  result.preservationReview={status:'42_EXACT_DELIVERED_REVIEW_FILE_ADDITIONS_ACCOUNTED_FOR',actor:'UNKNOWN',
    historicalRunRewritten:false,scope:'SUPPLIED_R17C_RECORDS_AND_PREVIOUSLY_DELIVERED_KIT_BYTES'};
  phase='RETAINED_CANDIDATE';
  const prior=readJson(priorDir,'fresh-candidate-evidence.json');
  gate(prior.project==='MyMentalHealthBuddy'&&prior.status==='FRESH_CANDIDATE_FAILED'
    &&prior.failure?.gate==='WORKTREE_PRESERVATION','R17B_RECEIPT');
  const manifest=readJson(priorDir,'candidate-manifest.json');checkedManifest(manifest,5000);
  gate(manifest.manifestSha256===OBSERVED_CANDIDATE_SHA,'CANDIDATE_MANIFEST_PIN');
  candidateBefore=buildPolicy.regularTree(candidateDir);gate(JSON.stringify(candidateBefore)===JSON.stringify(manifest),'CANDIDATE_DRIFT');
  const server=readFile(candidateDir,'server.mjs');gate(server.id.sha256===OBSERVED_SERVER_SHA,'SERVER_PIN');
  const builtServer=readFile(path.join(priorDir,'server-build'),'server.mjs');gate(builtServer.id.sha256===OBSERVED_SERVER_SHA,'BUILT_SERVER_PIN');
  result.candidate={status:'RETAINED_CANDIDATE_MATCHES',files:candidateBefore.rows.length,manifestSha256:candidateBefore.manifestSha256,serverSha256:server.id.sha256};
  phase='RETAINED_BUILD_LINKAGE';
  const inputs=readJson(priorDir,'build-input-manifest.json'),source=readJson(priorDir,'source-manifest.json');
  const inputMap=checkedManifest(inputs,100000,true),sourceMap=checkedManifest(source,30000);
  gate(inputs.directory===retainedRoot&&inputs.sourceManifestSha256===source.manifestSha256,'BUILD_SOURCE_LINKAGE');
  for(const [file,row] of sourceMap){gate(JSON.stringify(inputMap.get(file))===JSON.stringify(row),'SOURCE_ROW_LINKAGE');
    compareId(readFile(ROOT,file).id,row);compareId(readFile(retainedRoot,file).id,row);}
  result.source={status:'RECORDED_WORKSPACE_AND_RETAINED_SOURCE_MATCH',checked:sourceMap.size};
  const lock=readJson(retainedRoot,'package-lock.json',32*1024**2);
  compareId(readFile(retainedRoot,'package-lock.json').id,inputMap.get('package-lock.json'));
  compareId(readFile(retainedRoot,'package.json').id,inputMap.get('package.json'));
  gate(readFile(retainedRoot,'package.json').id.sha256===PINS['package.json']&&lock.packages,'RETAINED_PACKAGE_CONTRACT');
  const meta1=readJson(path.join(priorDir,'server-build'),'meta-1.json'),meta2=readJson(path.join(priorDir,'server-build'),'meta-2.json');
  const graph=graphPolicy.analyzeRuntimeGraph(meta1,meta2,{compilerWorkingDirectory:inputs.compilerWorkingDirectory,reportDirectory:priorDir,inputRows:inputs.rows});
  gate(graph.outputBytes===server.id.bytes&&graph.outputBytes===builtServer.id.bytes
    &&graph.inputCount===prior.server?.inputCount&&JSON.stringify(graph.externalImports)===JSON.stringify(prior.server?.externalImports),'GRAPH_TO_BUNDLE_RECEIPT');
  const graphMap=new Map(graph.inputs.map(r=>[r.file,r]));
  for(const item of graph.inputs)compareId(readFile(retainedRoot,item.file).id,inputMap.get(item.file));
  save('runtime-graph.json',graph);
  result.graph={status:graph.status,inputCount:graph.inputCount,externalImports:graph.externalImports,
    externalOwners:graph.externalOwners.map(r=>({...r,owner:label(r.owner)})),
    externalInputReview:graph.externalInputReview.map(r=>({...r,...(typeof r.owner==='string'?{owner:label(r.owner)}:{})})),
    requiresReview:graph.requiresReview,scope:graph.scope};
  if(graph.requiresReview)issues.push({gate:'INPUT_EXTERNAL_SPECIFIERS_REQUIRE_REVIEW',count:graph.externalInputReview.length,
    scope:'RECORDED_INPUT_EDGES_NOT_AUTOMATICALLY_EMITTED_RUNTIME_REQUIREMENTS'});
  console.log('GATE=RETAINED_CANDIDATE_AND_COMPILER_INPUTS RESULT=PASS');
  phase='SELECTED_PACKAGE_AND_SOURCE_REVIEW';
  result.packages=RUNTIME_PACKAGES.map(name=>{const file='node_modules/'+name+'/package.json';
    const observed=optionalFile(retainedRoot,file,1024**2);if(observed)compareId(observed.id,inputMap.get(file));
    const summary=packagePolicy.r14PackageSummary(name,observed?.text??null,lock.packages[file.replace(/\/package\.json$/,'')]||null,null);
    const packaged=optionalFile(candidateDir,file,1024**2);
    return {name,retained:summary.installed.version,locked:summary.locked.version,retainedState:summary.installed.state,
      versionMatchesLock:summary.comparisons.installedToLock.versionMatch,candidatePackagePresent:Boolean(packaged),
      ...(packaged?{candidatePackageSha256:packaged.id.sha256}:{}),runtimeReachability:'UNQUALIFIED'};});
  result.sourceReviews=SOURCE_REVIEWS.map(item=>selectedReview(item,inputMap,graphMap));
  result.selectedPackageImporters=graph.packages.filter(p=>['pg','resend','ws'].includes(p.name))
    .map(p=>({...p,importedBy:p.importedBy.map(label)}));
  for(const p of result.packages)if(p.versionMatchesLock===false)issues.push({gate:'RETAINED_PACKAGE_VERSION_DIFFERS_FROM_LOCK',package:p.name});
  const reviewByName=new Map(result.sourceReviews.map(r=>[r.file,r]));
  phase='BYTE_REVIEWED_SYNTHETIC_HELPERS';
  const helperPaths=['node_modules/ws/lib/buffer-util.js','node_modules/ws/lib/validation.js','node_modules/pg/lib/stream.js'];
  if(helperPaths.every(f=>reviewByName.get(f)?.reviewedSourceMatch)){
    result.execution.helperTestsAttempted=true;
    result.helperSmokes=await helperSmoke.runHelperSmokes(Object.fromEntries(helperPaths.map(f=>[f,reviewTexts[f]])));
  }else{result.helperSmokes={status:'NOT_RUN_UNREVIEWED_BYTES'};issues.push({gate:'HELPER_SOURCE_REVIEW_REQUIRED'});}
  const cjs='node_modules/resend/dist/index.cjs',esm='node_modules/resend/dist/index.mjs';
  if(reviewByName.get(cjs)?.reviewedSourceMatch&&reviewByName.get(esm)?.reviewedSourceMatch){
    result.execution.resendTestsAttempted=true;
    result.resendSmoke=await resendSmoke.runResendSmoke(reviewTexts[cjs]);
    result.resendSmoke.entryScope='REVIEWED_CJS_SYNTHETIC_TRANSPORT; BUNDLED_ESM_BEHAVIOR_NOT_EXECUTED';
  }else{result.resendSmoke={status:'NOT_RUN_UNREVIEWED_DISTRIBUTION'};issues.push({gate:'RESEND_DISTRIBUTION_REVIEW_REQUIRED'});}
  for(const review of result.sourceReviews)if(!review.reviewedSourceMatch)issues.push({gate:'SELECTED_SOURCE_REVIEW_REQUIRED',file:review.file});
  phase='REMAINING_FILESYSTEM_AND_CONFIGURATION';
  const candidateNames=new Set(candidateBefore.rows.map(r=>r.file));
  result.filesystem=ASSET_SETS.map(set=>({consumer:set.consumer,consumerListed:graphMap.has(set.consumer),
    consumerReviewMatch:reviewByName.get(set.consumer)?.reviewedSourceMatch===true,requiredCwd:set.root,
    files:set.files.map(file=>({file,inCandidate:candidateNames.has(file),inRetainedSource:sourceMap.has(file)})),
    scope:'SELECTED_PATH_AVAILABILITY_ONLY_NOT_COMPLETE_FILESYSTEM_OR_ROUTE_REACHABILITY'}));
  const publicConfig=readJson(priorDir,'public-config.json');
  gate(publicConfig.valuesReadOrForwarded===0&&Array.isArray(publicConfig.names)&&publicConfig.names.length<=500
    &&publicConfig.names.every(x=>/^VITE_[A-Z0-9_]{1,100}$/.test(x)),'PUBLIC_CONFIG_NAMES');
  result.publicConfiguration={names:publicConfig.names,buildValuesForwarded:publicConfig.valuesReadOrForwarded,
    qualification:'BUILD_PUBLIC_VALUES_REQUIRE_DEPLOYMENT_REVIEW'};
  result.shellFlags=['NODE_PG_FORCE_NATIVE','WS_NO_BUFFER_UTIL','WS_NO_UTF_8_VALIDATE','HEAL_AUTO_ENABLED'].map(name=>({name,
    present:Object.hasOwn(process.env,name),nonempty:Boolean(process.env[name]),exactLowercaseTrue:process.env[name]==='true'}));
  result.shellFlagScope='CURRENT_SHELL_BOOLEANS_ONLY_NOT_DEPLOYMENT_CONFIG; TESTS_USE_SYNTHETIC_ENVIRONMENT';
  result.openReleaseRequirements=['Real bundled entry startup and emitted ESM behavior','Complete email/broadcast/template and native-client caller reachability',
    'Remaining filesystem assets, public configuration and deployed working directory','Browser optional peer, auth/session/data isolation and core flows',
    'Database and AI behavior, recovery, CI and deployed artifact identity'];
  result.status=issues.length?'RUNTIME_CONTRACT_REVIEW_REQUIRED':'RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE';
}catch(e){failure=cleanError(e);}
finally{
  const failures=[];const attempt=(at,fn)=>{try{phase=at;fn();}catch(e){failures.push(cleanError(e));}};
  if(reportDir&&buildPolicy){
    attempt('FINAL_EVIDENCE_ROOT',()=>verifyEvidenceRoot());
    attempt('FINAL_READ_IDENTITIES',()=>{for(const {base,rel,id} of reads.values())gate(JSON.stringify(buildPolicy.fileIdentity(base,rel))===JSON.stringify(id),'READ_ARTIFACT_CHANGED',{file:rel});});
    attempt('FINAL_ABSENCES',()=>{for(const {base,rel} of absences.values()){
      let at=base;buildPolicy.directory(base);for(const part of rel.split('/')){at=path.join(at,part);try{gate(!fs.lstatSync(at).isSymbolicLink(),'OPTIONAL_SYMLINK');}catch(e){if(e.code==='ENOENT')break;throw e;}}
      try{fs.lstatSync(path.join(base,rel));gate(false,'MISSING_PATH_APPEARED',{file:rel});}catch(e){if(e.code!=='ENOENT')throw e;}}});
    attempt('FINAL_PINS',()=>{for(const [file,id] of pinsBefore)gate(JSON.stringify(rawIdentity(file))===JSON.stringify(id),'PIN_CHANGED',{file});});
    if(candidateBefore)attempt('FINAL_CANDIDATE',()=>gate(JSON.stringify(buildPolicy.regularTree(candidateDir))===JSON.stringify(candidateBefore),'CANDIDATE_CHANGED'));
    if(before)attempt('FINAL_WORKSPACE',()=>{const after=snapshot();save('git-after.json',after);
      const diff=snapshotPolicy.compareSnapshots(before,after);save('worktree-comparison.json',diff);
      result.preservation={status:diff.components.length?'FAILED':'OBSERVED_CURRENT_WORKSPACE_AND_READ_ARTIFACTS_STABLE',
        changedFileCount:diff.changedFileCount,components:diff.components};gate(!diff.components.length,'WORKTREE_CHANGED');});
  }
  if(failures.length){result.preservationFailures=failures;failure={...failures[0],previousFailure:failure};}
  if(failure){result.status='RUNTIME_CONTRACT_FAILED';result.failure=failure;}
  result.limitations=['Original R17B failure receipt remains unchanged; 42 delivered review-file additions are separately accounted for.',
    'Source hashes and reported import edges do not prove every dynamic caller or deployed runtime.',
    'Only exact reviewed dependency helper/SDK bytes are evaluated with synthetic dependencies and transport objects. No application module is loaded.',
    'VM contexts bound these tests; they are not an OS security boundary for arbitrary code.',
    'No rebuild, install, database/email/AI request, source edit, Git write or deployment is requested.',
    'Current snapshots do not lock editors or inventory all ignored files. Current read set is checked before and after.',
    'Current metadata is compared with retained records; local record self-consistency is not independent historical provenance.'];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('runtime-contract-evidence.json',result);}catch(e){failure=cleanError(e);result.failure=failure;result.status='RUNTIME_CONTRACT_FAILED';result.evidenceWrite='FAILED';}
  // Keep the full evidence file; terminal output gives the next review's facts.
  const terminal={...result,
    graph:result.graph?{...result.graph,externalOwners:result.graph.externalOwners.filter(r=>
      ['@react-email/render','bcrypt','bufferutil','utf-8-validate','pg-cloudflare','pg-native'].includes(r.specifier))}:undefined,
    helperSmokes:result.helperSmokes?{status:result.helperSmokes.status,checkCount:result.helperSmokes.checkCount,
      assertions:result.helperSmokes.assertions,checks:result.helperSmokes.checks?.map(c=>({name:c.name,status:c.status}))}:undefined,
    resendSmoke:result.resendSmoke?{status:result.resendSmoke.status,caseCount:result.resendSmoke.caseCount,
      allCasesPassed:result.resendSmoke.cases?.every(c=>c.passed===true),dynamicImportRequests:result.resendSmoke.dynamicImportRequests,
      forbiddenFetchAttempts:result.resendSmoke.forbiddenFetchAttempts,entryScope:result.resendSmoke.entryScope}:undefined,
    detailedEvidence:'runtime-contract-evidence.json'};
  console.log(JSON.stringify(terminal,null,2));
  console.log('COMPILER_INVOCATIONS=0 PACKAGE_INSTALL=0 APPLICATION_STARTED=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0 EMAIL_SENT=0 AI_REQUEST=0');
  console.log('SOURCE_EDIT=0 ROOT_PACKAGE_EDIT=0 ACTIVE_NODE_MODULES_MODIFIED=0 GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  console.log('HELPER_TESTS_ATTEMPTED='+Number(result.execution.helperTestsAttempted)+' RESEND_TESTS_ATTEMPTED='+Number(result.execution.resendTestsAttempted)+' APPLICATION_RUNTIME=UNPROVEN');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=RETURN_COMPLETE_OUTPUT_FOR_RUNTIME_REVIEW');
  process.exitCode=failure?1:0;
}
