const PRIOR_NAME='r17b-q6rzGy';
const STAGE_NAME='r16e-rHi4aw';
const OBSERVED_SERVER_SHA='d103e3532fe45af0d270c777310334a4672338fc2345660287033e9ecf98d2c7';
const OBSERVED_CANDIDATE_SHA='cb4c9c57fce1124f453110eb713d86b0f32855436df1030427cc32c2a2df0320';
const OBSERVED_FRONTEND_SHA='1c3777d1fc93595a7e3ec2c93b35692b1ee324e4cffd3a27cd7c7086f49e6f78';
const OBSERVED_CHANGED_FILES=42;
const OBSERVED_CANDIDATE_FILES=625;
const OBSERVED_CANDIDATE_BYTES=40486374;
let evidenceRoot,evidenceRootIdentity,reportDir,priorDir,currentBefore,currentAfter,buildPolicy,policy,snapshotPolicy,failure,phase='PREFLIGHT';
let candidateDir,frontDir,retainedRoot,stageDir,retainedLock;
const reads=new Map(),currentSourceReads=new Map(),observations={},issues=[];
const result={project:'MyMentalHealthBuddy',status:'PRESERVATION_DIAGNOSTIC_FAILED',releaseReady:false,
  historicalRunStatus:'FRESH_CANDIDATE_FAILED',historicalPreservation:'FAILED_REVIEW_REQUIRED',applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',issues};
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
function cleanError(e){const code=e.gate||e.code;return {gate:typeof code==='string'&&/^[A-Z0-9_]{1,100}$/.test(code)?code:'INSPECTION_ERROR',
  ...(typeof (e.file||e.detail?.file)==='string'?{file:label(e.file||e.detail.file)}:{})};}
function readAt(base,rel){
  const id=buildPolicy.fileIdentity(base,rel);gate(id.bytes<=64*1024**2,'PROOF_SIZE_LIMIT',{file:rel});
  const bytes=fs.readFileSync(path.join(base,rel));gate(hash(bytes)===id.sha256,'PROOF_CHANGED_DURING_READ',{file:rel});
  reads.set(path.join(base,rel),{base,rel,id});return JSON.parse(bytes.toString('utf8'));
}
const readProof=rel=>readAt(priorDir,rel);
function inspect(name,fn){try{const value=fn();result[name]=value;return value;}catch(e){const error=cleanError(e);issues.push({section:name,...error});result[name]={status:'INSPECTION_FAILED',...error};return null;}}
function currentIdentity(rel){try{return rawIdentity(rel);}catch(e){return {state:'UNOBSERVED',...cleanError(e)};}}
function currentPins(){const rows=[];for(const [file,expected] of Object.entries({...PINS,...ASSET_PINS})){
  const id=currentIdentity(file);rows.push({file:label(file),pathSha256:hash(file),matches:id.sha256===expected,state:id.state,
    ...(id.sha256===expected?{}:{expectedSha256:expected,actual:snapshotPolicy.publicIdentity(id)})});}
  return {status:rows.every(r=>r.matches)?'ALL_PINS_MATCH':'PIN_DIFFERENCES_REQUIRE_REVIEW',count:rows.length,mismatchCount:rows.filter(r=>!r.matches).length,rows:rows.filter(r=>!r.matches)};}
function ignoredNames(names){
  if(!names.length)return new Set();
  try{return new Set(execFileSync(GIT_BIN||'/usr/bin/git',['-c','core.fsmonitor=false','-c','core.untrackedCache=false',
    'check-ignore','--no-index','-z','--stdin'],{cwd:ROOT,env:MIN_ENV,input:names.join('\0')+'\0',encoding:'utf8',
    stdio:['pipe','pipe','pipe'],timeout:30000,maxBuffer:64*1024**2}).split('\0').filter(Boolean));}
  catch(e){if(e.status===1)return new Set();throw e;}
}
function publicComparison(diff){return {components:diff.components,changedFileCount:diff.changedFileCount,
  changes:diff.changes.map(r=>({file:label(r.file),pathSha256:hash(r.file),kind:r.kind,fields:r.fields,
    before:snapshotPolicy.publicIdentity(r.before),after:snapshotPolicy.publicIdentity(r.after)}))};}
function treeCheck(name,dir,recorded,expected){
  gate(recorded&&Array.isArray(recorded.rows)&&recorded.rows.length<=30000,'MANIFEST_SCHEMA');
  gate(recorded.manifestSha256===hash(JSON.stringify(recorded.rows)),'MANIFEST_SELF_CONSISTENCY');
  gate(recorded.rows.reduce((n,x)=>n+x.bytes,0)===recorded.bytes,'MANIFEST_BYTE_COUNT');
  if(expected)gate(recorded.manifestSha256===expected,'OBSERVED_MANIFEST_MISMATCH');
  const tree=buildPolicy.regularTree(dir);observations[name]={dir,tree};
  return {status:JSON.stringify(tree)===JSON.stringify(recorded)?'CURRENT_FILES_MATCH_RECORDED_MANIFEST':'CURRENT_FILES_DIFFER_FROM_RECORDED_MANIFEST',
    files:tree.rows.length,bytes:tree.bytes,manifestSha256:tree.manifestSha256,recordedManifestSha256:recorded.manifestSha256};
}
try{
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  gate(fs.realpathSync(git('rev-parse','--show-toplevel').trim())===ROOT,'GIT_ROOT');process.umask(0o077);
  evidenceRoot=prepareEvidenceRoot();reportDir=fs.mkdtempSync(path.join(evidenceRoot,'r17c-'));fs.chmodSync(reportDir,0o700);
  console.log('COMMAND_ID=MMHB-PRESERVATION-INSPECT-R17C');console.log('UTC='+new Date().toISOString());
  console.log('ISSUE_ID=R17B-WORKTREE-PRESERVATION-001');console.log('REPORT_DIRECTORY='+reportDir);
  for(const v of Object.values(HELPERS))gate(hash(Buffer.from(v.b64,'base64'))===v.sha256,'HELPER_HASH');
  buildPolicy=await import('data:text/javascript;base64,'+HELPERS.BUILD_POLICY.b64);
  policy=await import('data:text/javascript;base64,'+HELPERS.POLICY.b64);
  snapshotPolicy=await import('data:text/javascript;base64,'+HELPERS.SNAPSHOT.b64);
  phase='CURRENT_BASELINE';inspect('currentGitBaseline',()=>{
    const observed=snapshot();snapshotPolicy.validateSnapshot(observed);currentBefore=observed;save('current-before.json',currentBefore);
    return {headMatchesExpected:currentBefore.head===EXPECTED_HEAD,branchMatchesExpected:currentBefore.branch==='integration'};
  });
  priorDir=path.join(evidenceRoot,PRIOR_NAME);buildPolicy.directory(priorDir);
  phase='HISTORICAL_SNAPSHOTS';
  const prior=readProof('fresh-candidate-evidence.json'),before=readProof('git-before.json'),after=readProof('git-after.json');
  const diff=snapshotPolicy.compareSnapshots(before,after);result.historicalChanges=publicComparison(diff);
  save('historical-change-metadata.json',result.historicalChanges);
  gate(prior.project==='MyMentalHealthBuddy'&&prior.status==='FRESH_CANDIDATE_FAILED'&&prior.failure?.phase==='FINAL_PRESERVATION'
    &&prior.failure?.gate==='WORKTREE_PRESERVATION'&&prior.preservationStatus==='FAILED','R17B_FAILURE_RECEIPT');
  gate(diff.changedFileCount===OBSERVED_CHANGED_FILES&&prior.preservation?.changedFileCount===diff.changedFileCount
    &&JSON.stringify(prior.preservation.components)===JSON.stringify(diff.components),'HISTORICAL_CHANGE_COUNT_OR_COMPONENTS');
  gate(JSON.stringify(prior.preservation.changes)===JSON.stringify(diff.changes.slice(0,40).map(r=>({file:label(r.file),fields:r.fields}))),
    'HISTORICAL_CHANGE_SUMMARY');
  result.historicalChanges.summaryWasTruncated=diff.changedFileCount>prior.preservation.changes.length;
  result.historicalChanges.actor='UNKNOWN';
  const source=readProof('source-manifest.json');gate(source.manifestSha256===hash(JSON.stringify(source.rows)),'SOURCE_MANIFEST_DIGEST');
  const sourceNames=new Set(source.rows.map(r=>r.file)),now=new Map(currentBefore?.records||[]);
  const tracked=new Set(git('ls-files','--cached','-z').split('\0').filter(Boolean));
  const ignored=ignoredNames(diff.changes.map(r=>r.file));
  for(const row of result.historicalChanges.changes){
    const raw=diff.changes.find(r=>hash(r.file)===row.pathSha256),id=now.get(raw.file)||currentIdentity(raw.file);
    currentSourceReads.set(raw.file,id);
    row.current={inObservedSet:currentBefore?now.has(raw.file):null,tracked:tracked.has(raw.file),matchesIgnoreRules:ignored.has(raw.file),identity:snapshotPolicy.publicIdentity(id),
      matchesBefore:raw.before!==null&&JSON.stringify(id)===JSON.stringify(raw.before),matchesAfter:raw.after!==null&&JSON.stringify(id)===JSON.stringify(raw.after),
      visibility:!currentBefore?'CURRENT_SNAPSHOT_UNAVAILABLE':now.has(raw.file)?'IN_CURRENT_OBSERVED_SET':id.state==='ABSENT'?'PATH_ABSENT_NOW':id.state==='UNOBSERVED'?'CURRENT_PATH_UNOBSERVED':'PRESENT_BUT_NOT_IN_CURRENT_OBSERVED_SET'};
    row.scope={pinned:Object.hasOwn(PINS,raw.file)||Object.hasOwn(ASSET_PINS,raw.file),inRecordedSourceCopy:sourceNames.has(raw.file)};
  }
  save('historical-changes-with-current-state.json',result.historicalChanges);
  result.sinceR17B=currentBefore?publicComparison(snapshotPolicy.compareSnapshots(after,currentBefore)):{status:'CURRENT_SNAPSHOT_UNAVAILABLE'};
  save('changes-since-r17b.json',result.sinceR17B);
  console.log('GATE=ALL_HISTORICAL_CHANGES_RECONSTRUCTED RESULT=PASS COUNT='+diff.changedFileCount);
  phase='CURRENT_PINS';inspect('pins',currentPins);
  inspect('recordedSourceNow',()=>{
    const changed=[];for(const row of source.rows){const id=currentIdentity(row.file);currentSourceReads.set(row.file,id);
      if(id.state!=='FILE'||id.sha256!==row.sha256||id.bytes!==row.bytes||id.mode!==row.mode)changed.push({file:label(row.file),pathSha256:hash(row.file),actual:snapshotPolicy.publicIdentity(id)});}
    return {status:changed.length?'RECORDED_SOURCE_DIFFERS_NOW':'RECORDED_SOURCE_FILES_MATCH_NOW',checked:source.rows.length,changedFileCount:changed.length,changes:changed,
      scope:'RECORDED_SOURCE_ROWS_ONLY; NEW_WORKSPACE_FILES_ARE_SEPARATELY_IN_CURRENT_SNAPSHOT'};
  });
  phase='CANDIDATE';candidateDir=path.join(priorDir,'candidate');frontDir=path.join(priorDir,'frontend-build/frontend');
  inspect('candidate',()=>{
    gate(prior.candidate?.directory===candidateDir&&prior.candidate.manifestSha256===OBSERVED_CANDIDATE_SHA
      &&prior.candidate.files===OBSERVED_CANDIDATE_FILES&&prior.candidate.bytes===OBSERVED_CANDIDATE_BYTES,'OBSERVED_CANDIDATE_RECEIPT');
    const manifest=readProof('candidate-manifest.json');gate(manifest.rows.length===OBSERVED_CANDIDATE_FILES&&manifest.bytes===OBSERVED_CANDIDATE_BYTES,'OBSERVED_CANDIDATE_COUNTS');
    return treeCheck('candidate',candidateDir,manifest,OBSERVED_CANDIDATE_SHA);
  });
  inspect('frontend',()=>treeCheck('frontend',frontDir,readProof('frontend-output-manifest.json'),OBSERVED_FRONTEND_SHA));
  inspect('server',()=>{
    const id=buildPolicy.fileIdentity(path.join(priorDir,'server-build'),'server.mjs');
    reads.set(path.join(priorDir,'server-build/server.mjs'),{base:path.join(priorDir,'server-build'),rel:'server.mjs',id});
    return {status:id.sha256===OBSERVED_SERVER_SHA?'CURRENT_SERVER_MATCHES_OBSERVED_SHA':'CURRENT_SERVER_DIFFERS_FROM_OBSERVED_SHA',sha256:id.sha256,bytes:id.bytes};
  });
  phase='RETAINED_INPUTS';
  inspect('retainedInputs',()=>{
    const manifest=readProof('build-input-manifest.json'),r16=readProof('retained-r16e.json');
    retainedRoot=path.join(priorDir,'build-input');stageDir=path.join(evidenceRoot,STAGE_NAME,'stage');
    gate(manifest.directory===retainedRoot&&manifest.manifestSha256===hash(JSON.stringify(manifest.rows)),'BUILD_INPUT_MANIFEST');
    gate(manifest.sourceManifestSha256===source.manifestSha256&&r16.stageDirectory===stageDir,'RETAINED_LINKAGE');
    retainedLock=readAt(retainedRoot,'package-lock.json');
    const stageLockId=buildPolicy.fileIdentity(stageDir,'package-lock.json'),copyLockId=buildPolicy.fileIdentity(retainedRoot,'package-lock.json');
    reads.set(path.join(stageDir,'package-lock.json'),{base:stageDir,rel:'package-lock.json',id:stageLockId});
    gate(stageLockId.sha256===r16.lockSha256&&copyLockId.sha256===r16.lockSha256,'RETAINED_LOCK_IDENTITY');
    const stagePackageId=buildPolicy.fileIdentity(stageDir,'package.json');
    reads.set(path.join(stageDir,'package.json'),{base:stageDir,rel:'package.json',id:stagePackageId});
    gate(stagePackageId.sha256===r16.packageSha256&&r16.packageSha256===PINS['package.json'],'RETAINED_PACKAGE_IDENTITY');
    const recorded=readAt(path.join(evidenceRoot,STAGE_NAME),'installed-dependencies.json');
    gate(recorded.manifestSha256===hash(JSON.stringify(recorded.fileManifest))&&recorded.manifestSha256===manifest.dependencyManifestSha256
      &&recorded.manifestSha256===r16.manifestSha256,'RETAINED_DEPENDENCY_MANIFEST');
    const rows=new Map(manifest.rows.map(r=>[r.file,r]));gate(rows.size===manifest.rows.length,'BUILD_INPUT_DUPLICATE');
    gate(manifest.rows.length===source.rows.length+recorded.fileManifest.length+2,'BUILD_INPUT_ROW_COUNT');
    for(const row of [...source.rows,...recorded.fileManifest])gate(JSON.stringify(rows.get(row.file))===JSON.stringify(row),'BUILD_INPUT_LINKAGE');
    const linkedNames=new Set([...source.rows,...recorded.fileManifest].map(r=>r.file));
    const extraRows=manifest.rows.filter(r=>!linkedNames.has(r.file));
    gate(JSON.stringify(extraRows.map(r=>r.file).sort())===JSON.stringify(['package-lock.json','package.json'])
      &&rows.get('package.json')?.sha256===r16.packageSha256&&rows.get('package-lock.json')?.sha256===r16.lockSha256,'BUILD_INPUT_PACKAGE_ROWS');
    const changed=[];
    for(const row of manifest.rows.filter(r=>!r.file.startsWith('node_modules/'))){
      let id;try{id=buildPolicy.fileIdentity(retainedRoot,row.file);}catch(e){changed.push({file:label(row.file),...cleanError(e)});continue;}
      reads.set(path.join(retainedRoot,row.file),{base:retainedRoot,rel:row.file,id});
      if(JSON.stringify(id)!==JSON.stringify(row))changed.push({file:label(row.file),expectedSha256:row.sha256,actualSha256:id.sha256});
    }
    for(const [name,dir] of [['stage',stageDir],['copy',retainedRoot]]){
      const current=policy.inspectInstalled(dir,retainedLock);observations[name]={dir,manifestSha256:current.manifestSha256};
      if(current.manifestSha256!==recorded.manifestSha256)changed.push({section:name,expectedManifestSha256:recorded.manifestSha256,actualManifestSha256:current.manifestSha256});
    }
    return {status:changed.length?'RETAINED_INPUT_DIFFERENCES_REQUIRE_REVIEW':'RETAINED_INPUTS_MATCH_RECORDED_IDENTITIES_NOW',changes:changed,
      recordedRows:manifest.rows.length,temporaryCompilerCopyRequired:false,scope:'CURRENT_RECHECK_NOT_RETROACTIVE_HISTORICAL_PRESERVATION'};
  });
  inspect('recordedSmokesAndGraph',()=>{
    const native=readProof('native-smoke-evidence.json'),prompt=readProof('prompt-evidence.json'),graph=readProof('frontend-graph-review.json');
    const external=readProof('external-runtime-requirements.json');
    gate(native.status==='NATIVE_CANDIDATE_SMOKE_PASS'&&prompt.status==='PROMPT_ASSET_LOAD_PASS'&&prompt.moduleLoads===18&&graph.issueCount===0,'RECORDED_SMOKE_OR_GRAPH_RECEIPT');
    gate(graph.status==='REPORTED_GRAPH_INPUTS_VERIFIED'&&Array.isArray(graph.generatedModules)&&Array.isArray(external),'RECORDED_GRAPH_SCHEMA');
    const knownPackages=new Set(['@react-email/render','bcrypt','bufferutil','pg-cloudflare','pg-native','utf-8-validate']);
    return {nativeStatus:native.status,promptStatus:prompt.status,moduleLoads:prompt.moduleLoads,graphStatus:graph.status,issueCount:graph.issueCount,
      watchCoverage:graph.watchCoverage==='API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE'?graph.watchCoverage:'OTHER_RECORDED_COVERAGE_UNQUALIFIED',
      generatedModules:graph.generatedModules.map(x=>({
        id:x.id==='__vite-optional-peer-dep:@emotion/is-prop-valid:framer-motion'?x.id:'REDACTED_ID_'+hash(String(x.id)),
        classification:['VITE_OPTIONAL_PEER','VIRTUAL_MODULE','ROLLUP_VIRTUAL_MODULE'].includes(x.classification)?x.classification:'OTHER_CLASSIFICATION',consumerRuntime:'UNQUALIFIED'})),
      unqualifiedPackages:external.filter(x=>x.kind==='PACKAGE'&&x.candidatePackagePresent===false).map(x=>knownPackages.has(x.specifier)?x.specifier:'REDACTED_SPECIFIER_'+hash(String(x.specifier))),reexecuted:false};
  });
  result.status='PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED';
}catch(e){failure={phase,...cleanError(e)};}
finally{
  if(reportDir&&buildPolicy&&snapshotPolicy)try{
    phase='DIAGNOSTIC_PRESERVATION';verifyEvidenceRoot();
    if(result.pins)gate(JSON.stringify(currentPins())===JSON.stringify(result.pins),'PIN_OBSERVATIONS_CHANGED_DURING_DIAGNOSTIC');
    for(const [file,id] of currentSourceReads)gate(JSON.stringify(currentIdentity(file))===JSON.stringify(id),'SOURCE_CHANGED_DURING_DIAGNOSTIC',{file});
    for(const {base,rel,id} of reads.values())gate(JSON.stringify(buildPolicy.fileIdentity(base,rel))===JSON.stringify(id),'PROOF_CHANGED_DURING_DIAGNOSTIC',{file:rel});
    for(const [name,o] of Object.entries(observations)){
      if(o.tree)gate(JSON.stringify(buildPolicy.regularTree(o.dir))===JSON.stringify(o.tree),'ARTIFACT_CHANGED_DURING_DIAGNOSTIC',{file:name});
      else gate(policy.inspectInstalled(o.dir,retainedLock).manifestSha256===o.manifestSha256,'DEPENDENCIES_CHANGED_DURING_DIAGNOSTIC',{file:name});
    }
    if(currentBefore){
      currentAfter=snapshot();save('current-after.json',currentAfter);
      result.diagnosticPreservation=publicComparison(snapshotPolicy.compareSnapshots(currentBefore,currentAfter));
      gate(result.diagnosticPreservation.components.length===0,'CURRENT_WORKTREE_CHANGED_DURING_DIAGNOSTIC');
      result.diagnosticPreservation.status='OBSERVED_CURRENT_WORKTREE_AND_READ_ARTIFACTS_STABLE';
    }else result.diagnosticPreservation={status:'READ_ARTIFACTS_STABLE_CURRENT_WORKTREE_UNQUALIFIED'};
  }catch(e){failure={phase:'DIAGNOSTIC_PRESERVATION',...cleanError(e),previousFailure:failure};}
  if(failure){result.status='PRESERVATION_DIAGNOSTIC_FAILED';result.failure=failure;}
  result.limitations=['Read-only inspection of existing application, candidate and dependency files; only a new diagnostic report is written.',
    'No compiler, package manager, native binding, prompt loader, app server, database, AI request, source repair or deployment is invoked.',
    'Historical snapshot hashes are checked for self-consistency, not independently authenticated provenance. Supplied candidate/server/frontend hashes anchor current comparisons.',
    'Historical R17B preservation stays failed. Current stability or matching artifacts cannot identify the writer or retroactively make that run a pass.',
    'Observed-set changes are not necessarily content changes or deletions. Current ignore classification does not prove which ignore rule existed historically.',
    'Metadata/hashes only are printed; source content, environment values, link targets, diff hunks and Git configuration values are not printed.',
    'Before/after observations are not a concurrent-editor lock, OS sandbox, full ignored-workspace inventory or off-host backup.'];
  if(reportDir)try{result.evidenceWrite='SAVED';save('preservation-diagnostic-evidence.json',result);}catch(e){result.status='PRESERVATION_DIAGNOSTIC_FAILED';result.failure={phase:'SAVE',...cleanError(e)};result.evidenceWrite='FAILED';failure=result.failure;}
  console.log(JSON.stringify(result,null,2));
  console.log('COMPILER_INVOCATIONS=0 PACKAGE_INSTALL=0 APPLICATION_STARTED=0 DATABASE_CONNECTION=0 AI_REQUEST=0');
  console.log('SOURCE_EDIT=0 GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);console.log('STATUS='+result.status);
  console.log('NEXT_ACTION=RETURN_COMPLETE_OUTPUT_FOR_CHANGE_REVIEW');process.exitCode=failure?1:0;
}
