import {spawn} from 'node:child_process';
import {builtinModules} from 'node:module';
const PRIOR_NAME='r16e-rHi4aw';
const PRIOR_BUILD='r17-u9BFmJ';
const OBSERVED_SERVER_SHA='d103e3532fe45af0d270c777310334a4672338fc2345660287033e9ecf98d2c7';
const OBSERVED_SERVER_INPUT_COUNT=1277;
const SOURCE_ROOTS=['server','client','shared','attached_assets'];
const SOURCE_FILES=['vite.config.js','tailwind.config.js','tsconfig.json','.gitignore','jsconfig.json'];
const REQUIRED_SERVER=['server/app.mjs','server/security/csrf.mjs','server/replit_integrations/auth/replitAuth.mjs'];
let reportDir,evidenceRoot,evidenceRootIdentity,buildRoot,candidateDir,baseline,before,sourcesBefore,priorInstalled,stageDir;
let policy,normalizer,buildPolicy,graphPolicy,lock,plan,failure,phase='PREFLIGHT';
let priorBuildDir,frontDir,frontBefore,buildRootIdentity,inputRows;
const retainedBuild=new Map();
const retained=new Map(),processes=[];
const result={project:'MyMentalHealthBuddy',status:'RETAINED_CANDIDATE_FAILED',releaseReady:false,
  applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',workspaceDependencyAlignment:'UNCHANGED_PENDING',
  sourceEdits:0,rootPackageEdits:0,packageInstalls:0,compilerInvocationsThisRun:0,processes};
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});}
function err(error,at){
  const raw=error.gate||error.code;return {phase:at,gate:typeof raw==='string'&&/^[A-Z0-9_]{1,100}$/.test(raw)?raw:'FRESH_CANDIDATE_ERROR',
    ...(typeof (error.file||error.detail?.file)==='string'?{file:label(error.file||error.detail.file)}:{})};
}
function readProof(rel){
  const prior=path.join(evidenceRoot,PRIOR_NAME);const id=buildPolicy.fileIdentity(prior,rel);
  gate(id.bytes<=64*1024**2,'PRIOR_JSON_LIMIT',{file:rel});
  const raw=fs.readFileSync(path.join(prior,rel));gate(hash(raw)===id.sha256,'PRIOR_READ_CHANGED',{file:rel});retained.set(rel,id);
  return JSON.parse(raw.toString('utf8'));
}
function sourceInventory(){
  const rows=[];let bytes=0;const absent=[];
  for(const name of SOURCE_ROOTS){const full=path.join(ROOT,name);if(!fs.existsSync(full)){absent.push(name);continue;}
    const tree=buildPolicy.regularTree(full,buildPolicy.sourceSkip);
    for(const row of tree.rows)rows.push({...row,file:name+'/'+row.file});bytes+=tree.bytes;
  }
  for(const rel of [...SOURCE_FILES,...Object.keys(ASSET_PINS)]) {
    if(!fs.existsSync(path.join(ROOT,rel))){gate(!Object.hasOwn(PINS,rel)&&!Object.hasOwn(ASSET_PINS,rel),'SOURCE_REQUIRED',{file:rel});absent.push(rel);continue;}
    const row=buildPolicy.fileIdentity(ROOT,rel);rows.push(row);bytes+=row.bytes;
  }
  rows.sort((a,b)=>a.file<b.file?-1:a.file>b.file?1:0);
  gate(rows.length<=30000&&bytes<=2*1024**3,'SOURCE_COPY_LIMIT');
  const map=new Map(rows.map(x=>[x.file,x]));gate(map.size===rows.length,'SOURCE_COPY_DUPLICATES');
  for(const [rel,sha] of Object.entries({...PINS,...ASSET_PINS}))if(map.has(rel))gate(map.get(rel).sha256===sha,'COPIED_SOURCE_PIN_DRIFT',{file:rel});
  gate(map.get('server/lib/promptEngine.mjs')?.sha256==='fbbd43eaab399b029b5d976508da8f1e055e25d69fd2ee65551e23d102363170','PROMPT_LOADER_PIN');
  return {rows,bytes,absent,manifestSha256:hash(JSON.stringify(rows))};
}
function spaceFor(full,needed){const s=fs.statfsSync(full);gate(Number(s.bavail)*Number(s.bsize)>=needed,'INSUFFICIENT_FREE_SPACE');}
function writeHelper(key,file){const raw=Buffer.from(HELPERS[key].b64,'base64');gate(hash(raw)===HELPERS[key].sha256,'HELPER_HASH');
  fs.writeFileSync(path.join(reportDir,file),raw,{flag:'wx',mode:0o600});return path.join(reportDir,file);}
async function child(name,args,cwd,timeoutMs=180000){
  const logFile=path.join(reportDir,name+'.log');const fd=fs.openSync(logFile,'wx',0o600);
  const info={name,attempted:true,started:false,timedOut:false,interrupted:false,logLimit:false};processes.push(info);
  const env={PATH:path.dirname(process.execPath)+':/usr/bin:/bin',LANG:'C',LC_ALL:'C',NODE_ENV:'production',
    NODE_DISABLE_COMPILE_CACHE:'1',TMPDIR:path.join(reportDir,'tmp'),HEAL_AUTO_ENABLED:'false',CI:'true'};
  await new Promise(resolve=>{
    let p,settled=false,killTimer; const started=Date.now();
    const terminate=()=>{if(p?.pid){try{process.kill(-p.pid,'SIGTERM');}catch{}
      killTimer??=setTimeout(()=>{try{process.kill(-p.pid,'SIGKILL');}catch{}},5000);}};
    const interrupt=()=>{info.interrupted=true;terminate();};
    const finish=(code,signal)=>{if(settled)return;settled=true;
      if(p?.pid&&(info.timedOut||info.interrupted||info.logLimit)){try{process.kill(-p.pid,'SIGKILL');}catch{}}
      clearTimeout(timer);clearInterval(heartbeat);clearTimeout(killTimer);
      process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);
      info.exitCode=code;info.signal=signal;info.durationMs=Date.now()-started;fs.closeSync(fd);resolve();};
    const timer=setTimeout(()=>{info.timedOut=true;terminate();},timeoutMs);
    const heartbeat=setInterval(()=>{console.log('BUILD_PROGRESS STEP='+name+' ELAPSED_SECONDS='+Math.floor((Date.now()-started)/1000));
      try{if(fs.statSync(logFile).size>16*1024**2){info.logLimit=true;terminate();}}catch{}},10000);
    try {p=spawn(process.execPath,args,{cwd,env,detached:true,stdio:['ignore',fd,fd]});
      p.once('spawn',()=>{info.started=true;});p.once('error',error=>{info.errorCode=/^[A-Z0-9_]+$/.test(error.code||'')?error.code:'SPAWN_ERROR';finish(null,null);});
      p.once('close',finish);process.on('SIGINT',interrupt);process.on('SIGTERM',interrupt);
    }catch(error){info.errorCode='SPAWN_ERROR';finish(null,null);}
  });
  if(info.exitCode!==0||info.timedOut||info.interrupted||info.logLimit){
    for(const [dir,file] of [['server-build','error.json'],['frontend-build','frontend-runner-error.json']]){
      const full=path.join(reportDir,dir,file);if(fs.existsSync(full)){const e=readJSON(full);info.diagnostic={phase:label(e.phase),code:label(e.code)};}}
    gate(false,'CHILD_FAILED',{file:name});
  }
  return logFile;
}
function compareInputs(){
  gate(JSON.stringify(checkPins())===JSON.stringify(baseline),'BASELINE_CHANGED');
  if(sourcesBefore)gate(JSON.stringify(sourceInventory())===JSON.stringify(sourcesBefore),'WORKSPACE_SOURCE_CHANGED');
  for(const [rel,id] of retainedBuild)gate(JSON.stringify(buildPolicy.fileIdentity(priorBuildDir,rel))===JSON.stringify(id),'R17_EVIDENCE_OR_OUTPUT_CHANGED',{file:rel});
  if(frontBefore)gate(JSON.stringify(buildPolicy.regularTree(frontDir))===JSON.stringify(frontBefore),'R17_FRONTEND_CHANGED');
  if(buildRootIdentity)verifyBuildCopy();
  for(const [rel,id] of retained)gate(JSON.stringify(buildPolicy.fileIdentity(path.join(evidenceRoot,PRIOR_NAME),rel))===JSON.stringify(id),'R16E_EVIDENCE_CHANGED',{file:rel});
  if(priorInstalled){const again=policy.inspectInstalled(stageDir,lock);gate(again.manifestSha256===priorInstalled.manifestSha256,'R16E_DEPENDENCIES_CHANGED');}
}

function readR17(rel,json=true){
  const id=buildPolicy.fileIdentity(priorBuildDir,rel);retainedBuild.set(rel,id);
  if(!json)return id;
  gate(id.bytes<=64*1024**2,'R17_JSON_LIMIT',{file:rel});
  const raw=fs.readFileSync(path.join(priorBuildDir,rel));gate(hash(raw)===id.sha256,'R17_READ_CHANGED',{file:rel});
  return JSON.parse(raw.toString('utf8'));
}
function verifyBuildCopy(){
  buildPolicy.directory(buildRoot);const st=fs.lstatSync(buildRoot);
  gate(st.uid===process.getuid()&&(st.mode&0o777)===0o700&&st.dev===buildRootIdentity.dev&&st.ino===buildRootIdentity.ino,'R17_BUILD_COPY_IDENTITY');
  for(const row of sourcesBefore.rows)gate(JSON.stringify(buildPolicy.fileIdentity(buildRoot,row.file))===JSON.stringify(row),'R17_COPIED_SOURCE_CHANGED',{file:row.file});
  for(const rel of ['package.json','package-lock.json'])gate(JSON.stringify(buildPolicy.fileIdentity(buildRoot,rel))===JSON.stringify(buildPolicy.fileIdentity(stageDir,rel)),'R17_COPIED_MANIFEST_CHANGED',{file:rel});
  gate(policy.inspectInstalled(buildRoot,lock).manifestSha256===priorInstalled.manifestSha256,'R17_COPIED_DEPENDENCIES_CHANGED');
}
function graphSummary(g){return {status:g.status,counts:g.counts,issueCount:g.issueCount,issues:g.issues.slice(0,40),
  generatedModules:g.generatedModules.map(m=>({...m,consumers:m.consumers.slice(0,20),consumerCount:m.consumers.length})),
  watchCoverage:g.watchCoverage,physicalManifestSha256:g.physicalManifestSha256,scope:g.scope};}
try {
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  gate(fs.realpathSync(git('rev-parse','--show-toplevel').trim())===ROOT,'GIT_ROOT');process.umask(0o077);
  evidenceRoot=prepareEvidenceRoot();reportDir=fs.mkdtempSync(path.join(evidenceRoot,'r17a-'));fs.chmodSync(reportDir,0o700);
  console.log('COMMAND_ID=MMHB-RESUME-CANDIDATE-R17A');console.log('UTC='+new Date().toISOString());console.log('ISSUE_ID=BUILD-GRAPH-ID-CONTRACT-001');console.log('REPORT_DIRECTORY='+reportDir);
  for(const key of ['POLICY','NORMALIZER','BUILD_POLICY','GRAPH'])gate(hash(Buffer.from(HELPERS[key].b64,'base64'))===HELPERS[key].sha256,'EMBEDDED_HELPER_HASH');
  policy=await import('data:text/javascript;base64,'+HELPERS.POLICY.b64);
  normalizer=await import('data:text/javascript;base64,'+HELPERS.NORMALIZER.b64);
  buildPolicy=await import('data:text/javascript;base64,'+HELPERS.BUILD_POLICY.b64);
  graphPolicy=await import('data:text/javascript;base64,'+HELPERS.GRAPH.b64);
  phase='CURRENT_SOURCE';before=snapshot();save('git-before.json',before);gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');baseline=checkPins();
  save('pins-before.json',baseline);sourcesBefore=sourceInventory();save('source-manifest.json',sourcesBefore);
  phase='RETAINED_R16E';
  const prior=readProof('locked-dependencies-evidence.json'),inputs=readProof('install-inputs.json');
  gate(prior.project==='MyMentalHealthBuddy'&&prior.status==='REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE'
    &&prior.preservation==='OBSERVED_CURRENT_INPUTS_AND_AVAILABLE_EVIDENCE_PRESERVED'&&prior.currentPreservation?.changedFileCount===0
    &&prior.npmProcess?.exitCode===0&&prior.npmProcess?.started===true,'R16E_PASS_REQUIRED');
  stageDir=path.join(evidenceRoot,PRIOR_NAME,'stage');buildPolicy.directory(stageDir);
  gate(prior.stageDirectory===stageDir&&inputs.stageDirectory===stageDir,'R16E_STAGE_PATH');
  const manifest=readJSON(path.join(ROOT,'package.json')),original=readJSON(path.join(ROOT,'package-lock.json'));
  plan=normalizer.planArchiveRepair(manifest,original,policy.validateLock,policy.classifyExcludedBundles);lock=plan.normalized;
  const expectedLock=hash(Buffer.from(JSON.stringify(lock,null,2)+'\n'));
  gate(inputs.packageSha256===PINS['package.json']&&inputs.originalRootLockSha256===PINS['package-lock.json']&&inputs.lockSha256===expectedLock
    &&inputs.policySha256===HELPERS.POLICY.sha256&&inputs.normalizerSha256===HELPERS.NORMALIZER.sha256
    &&inputs.runnerSha256==='6f28f812900febfc749e1779e73c23203cee089f1c0c160e61a794f450214c4f','R16E_INSTALL_INPUTS');
  gate(buildPolicy.fileIdentity(stageDir,'package.json').sha256===inputs.packageSha256&&buildPolicy.fileIdentity(stageDir,'package-lock.json').sha256===expectedLock,'R16E_MANIFEST_DRIFT');
  retained.set('stage/package.json',buildPolicy.fileIdentity(path.join(evidenceRoot,PRIOR_NAME),'stage/package.json'));
  retained.set('stage/package-lock.json',buildPolicy.fileIdentity(path.join(evidenceRoot,PRIOR_NAME),'stage/package-lock.json'));
  const sources=readProof('archive-source-evidence.json');
  gate(sources.status==='ARCHIVE_SOURCES_VERIFIED'&&sources.uniqueSourcesVerified===plan.requests.length&&sources.receipts.length===plan.requests.length,'R16E_REGISTRY_EVIDENCE');
  const receipts=new Map(sources.receipts.map(r=>[r.name+'@'+r.version,r]));gate(receipts.size===plan.requests.length,'R16E_RECEIPT_DUPLICATE');
  for(const req of plan.requests){const r=receipts.get(req.name+'@'+req.version);gate(r&&r.integrity===req.integrity&&r.tarball===req.url
    &&JSON.stringify(r.paths)===JSON.stringify(req.paths)&&['REGISTRY_SHA512_METADATA_MATCH','REGISTRY_ARCHIVE_BYTES_SHA512_MATCH'].includes(r.verification),'R16E_RECEIPT_MISMATCH');}
  const recorded=readProof('installed-dependencies.json');priorInstalled=policy.inspectInstalled(stageDir,lock);
  gate(recorded.status===priorInstalled.status&&recorded.manifestSha256===priorInstalled.manifestSha256
    &&hash(JSON.stringify(recorded.fileManifest))===priorInstalled.manifestSha256,'R16E_INSTALLED_TREE_DRIFT');
  save('retained-r16e.json',{report:PRIOR_NAME,stageDirectory:stageDir,packageSha256:inputs.packageSha256,lockSha256:expectedLock,
    files:priorInstalled.files,bytes:priorInstalled.bytes,manifestSha256:priorInstalled.manifestSha256,
    selected:priorInstalled.selected,registrySources:receipts.size,changedArchiveEntries:plan.changedEntries});
  console.log('GATE=RETAINED_R16E_AND_CURRENT_SOURCE RESULT=PASS');

  phase='RETAINED_R17';priorBuildDir=path.join(evidenceRoot,PRIOR_BUILD);buildPolicy.directory(priorBuildDir);
  const old=readR17('fresh-candidate-evidence.json');
  gate(old.project==='MyMentalHealthBuddy'&&old.status==='FRESH_CANDIDATE_FAILED'&&old.releaseReady===false
    &&old.failure?.phase==='FRONTEND_BUILD'&&old.failure?.gate==='GRAPH_NONPHYSICAL_ID'
    &&old.preservationStatus==='CURRENT_SOURCE_AND_R16E_PRESERVED'&&old.preservation?.changedFileCount===0,'R17_EXPECTED_FAILURE_REQUIRED');
  gate(Array.isArray(old.processes)&&old.processes.length===2,'R17_PROCESS_EVIDENCE');
  for(const name of ['server-build','frontend-build']){
    const matches=old.processes.filter(p=>p.name===name);gate(matches.length===1,'R17_PROCESS_EVIDENCE');const p=matches[0];
    gate(p.attempted===true&&p.started===true&&p.exitCode===0&&p.timedOut===false&&p.interrupted===false&&p.logLimit===false,'R17_BUILD_EXIT_REQUIRED');
  }
  gate(JSON.stringify(readR17('source-manifest.json'))===JSON.stringify(sourcesBefore),'R17_SOURCE_BASELINE_CHANGED');
  gate(JSON.stringify(readR17('pins-before.json'))===JSON.stringify(baseline),'R17_PINS_CHANGED');
  const oldBefore=readR17('git-before.json'),oldAfter=readR17('git-after.json');
  gate(oldBefore.head===EXPECTED_HEAD&&oldBefore.branch==='integration'&&snapshotDifference(oldBefore,oldAfter).components.length===0,'R17_PRESERVATION_EVIDENCE');
  const oldDeps=readR17('retained-r16e.json');
  gate(oldDeps.manifestSha256===priorInstalled.manifestSha256&&oldDeps.lockSha256===expectedLock&&oldDeps.stageDirectory===stageDir,'R17_DEPENDENCY_BASELINE_CHANGED');
  buildRoot=old.disposableBuildRoot;
  gate(typeof buildRoot==='string'&&/^\/tmp\/mmhb-build-r17-[A-Za-z0-9]{6}$/.test(buildRoot),'R17_BUILD_COPY_PATH');
  gate(fs.existsSync(buildRoot),'R17_BUILD_COPY_MISSING');buildPolicy.directory(buildRoot);
  const br=fs.lstatSync(buildRoot);buildRootIdentity={dev:br.dev,ino:br.ino};verifyBuildCopy();
  result.disposableBuildRoot=buildRoot;result.retainedReport=PRIOR_BUILD;result.retainedBuildProcesses=old.processes;
  const packageRows=['package.json','package-lock.json'].map(rel=>buildPolicy.fileIdentity(stageDir,rel));
  inputRows=[...sourcesBefore.rows,...packageRows,...priorInstalled.fileManifest];
  for(const [key,file] of [['SERVER','server-runner.mjs'],['FRONTEND','frontend-runner.mjs']])
    gate(readR17(file,false).sha256===HELPERS[key].sha256,'R17_BUILD_RUNNER_IDENTITY',{file});
  console.log('GATE=RETAINED_R17_INPUTS_AND_BUILD_EXIT_CODES RESULT=PASS');
  phase='RETAINED_SERVER';
  const meta1=readR17('server-build/meta-1.json'),meta2=readR17('server-build/meta-2.json');
  const serverInputs=buildPolicy.verifyBuildInputs(meta1,buildRoot,inputRows);
  gate(JSON.stringify(serverInputs)===JSON.stringify(buildPolicy.verifyBuildInputs(meta2,buildRoot,inputRows)),'SERVER_INPUT_SET_CHANGED');
  for(const rel of REQUIRED_SERVER)gate(serverInputs.includes(rel),'AUTH_INPUT_NOT_BUNDLED',{file:rel});
  for(const meta of [meta1,meta2])gate(Object.keys(meta.outputs).every(k=>path.resolve(buildRoot,k)===path.join(priorBuildDir,'server-build/server.mjs')),'SERVER_OUTPUT_BOUNDARY');
  const serverBuild=readR17('server-build/build.json'),serverFile=readR17('server-build/server.mjs',false);
  gate(serverBuild.status==='SERVER_BUILD_PASS'&&serverBuild.builds.length===2&&serverBuild.builds[0].sha256===serverBuild.builds[1].sha256
    &&serverFile.sha256===serverBuild.builds[1].sha256&&old.server?.bundleSha256===serverFile.sha256
    &&serverFile.sha256===OBSERVED_SERVER_SHA&&serverInputs.length===OBSERVED_SERVER_INPUT_COUNT,'SERVER_RETAINED_IDENTITY');
  result.server={bundleSha256:serverFile.sha256,inputCount:serverInputs.length,retainedCompilerInvocations:2,compilerInvocationsThisRun:0,
    externalImports:[...new Set(Object.values(meta2.outputs).flatMap(x=>(x.imports||[]).filter(y=>y.external).map(y=>y.path)))].sort(),
    scope:'REVALIDATED_RETAINED_R17_SERVER_NOT_RUNTIME_REACHABILITY'};
  phase='RETAINED_FRONTEND';
  const frontEvidence=readR17('frontend-build/frontend-build-evidence.json');
  frontDir=path.join(priorBuildDir,'frontend-build/frontend');
  const config=frontEvidence.resolvedConfig;
  gate(config&&config.root===path.join(buildRoot,'client')&&config.outDir===frontDir&&config.mode==='production'
    &&config.envDir===false&&config.envFile===false&&config.configFile===null&&frontEvidence.compilerInvocations===1,'R17_FRONTEND_BUILD_CONTEXT');
  const front=buildPolicy.verifyFrontend(frontDir,frontEvidence);frontBefore=front.tree;
  const currentFiles=new Map(front.tree.rows.map(row=>[row.file,row]));
  for(const emitted of frontEvidence.emitted)gate(currentFiles.get(emitted.fileName)?.bytes===emitted.bytes,'R17_EMITTED_SIZE_CHANGED',{file:emitted.fileName});
  save('retained-frontend-current-manifest.json',front.tree);
  result.frontend={files:front.tree.rows.length,bytes:front.tree.bytes,localReferences:front.localReferences,externalReferences:front.externalReferences,
    cssDiagnostics:frontEvidence.cssDiagnostics,publicConfiguration:'VALUES_NOT_FORWARDED_UNQUALIFIED',
    integrityScope:'FIRST_FULL_OUTPUT_HASH_MANIFEST_OBSERVED_IN_R17A; R17_REPORTED_OUTPUT_SIZES_AND_REFERENCES_MATCH'};
  phase='FRONTEND_GRAPH';
  const graph=readR17('frontend-build/frontend-graph.json');
  gate(frontEvidence.moduleCount===graph.modules?.length&&frontEvidence.watchFileCount===graph.watchFiles?.length,'R17_GRAPH_COUNTS');
  const reviewed=graphPolicy.inspectGraph(graph,{buildRoot,inputs:inputRows,fileIdentity:buildPolicy.fileIdentity,directory:buildPolicy.directory});
  save('frontend-graph-review.json',reviewed);result.graph=graphSummary(reviewed);
  console.log('GRAPH_REVIEW_STATUS='+reviewed.status+' ISSUES='+reviewed.issueCount);
  gate(reviewed.issueCount===0,'GRAPH_REVIEW_REQUIRED');
  result.retainedOutputsReused=true;
  console.log('GATE=RETAINED_FRONTEND_AND_REPORTED_GRAPH RESULT=PASS');
  save('retained-r17-observations.json',{project:'MyMentalHealthBuddy',report:PRIOR_BUILD,sourceManifestSha256:sourcesBefore.manifestSha256,
    dependencyManifestSha256:priorInstalled.manifestSha256,server:result.server,frontend:result.frontend,graph:result.graph,
    retainedFileIdentities:[...retainedBuild.values()],historicalLimit:'The supplied R17 screenshots pin the server hash. R17 did not persist a complete frontend output hash manifest; R17A records current hashes and verifies current sizes/references.'});
  spaceFor(evidenceRoot,front.tree.bytes+serverFile.bytes+128*1024**2);
  fs.mkdirSync(path.join(reportDir,'tmp'),{mode:0o700});
  const nativeRunner=writeHelper('NATIVE','native-runner.mjs'),promptRunner=writeHelper('PROMPT','prompt-runner.mjs');
  phase='ASSEMBLE_CANDIDATE';candidateDir=path.join(reportDir,'candidate');fs.mkdirSync(candidateDir,{mode:0o700});
  buildPolicy.copyRows(path.join(priorBuildDir,'server-build'),candidateDir,[buildPolicy.fileIdentity(path.join(priorBuildDir,'server-build'),'server.mjs')]);
  fs.copyFileSync(path.join(buildRoot,'server/db/schema.canonical.sql'),path.join(candidateDir,'schema.canonical.sql'),fs.constants.COPYFILE_EXCL);
  gate(buildPolicy.fileIdentity(candidateDir,'schema.canonical.sql').sha256===PINS['server/db/schema.canonical.sql'],'CANDIDATE_SCHEMA');
  fs.mkdirSync(path.join(candidateDir,'client/dist'),{recursive:true,mode:0o700});buildPolicy.copyRows(frontDir,path.join(candidateDir,'client/dist'),front.tree.rows);
  const nativeRows=priorInstalled.fileManifest.filter(r=>r.file.startsWith('node_modules/bcrypt/')||r.file.startsWith('node_modules/node-gyp-build/'));
  gate(nativeRows.length>0&&nativeRows.every(r=>r.type==='file'),'NATIVE_PACKAGE_COPY_CONTRACT');buildPolicy.copyRows(buildRoot,candidateDir,nativeRows);
  buildPolicy.copyRows(buildRoot,candidateDir,sourcesBefore.rows.filter(r=>Object.hasOwn(ASSET_PINS,r.file)));
  const candidateBefore=buildPolicy.regularTree(candidateDir);save('candidate-before-smoke.json',candidateBefore);
  phase='CANDIDATE_SYNTAX';await child('server-syntax',['--check',path.join(candidateDir,'server.mjs')],candidateDir,30000);
  phase='NATIVE_BCRYPT_SMOKE';await child('native-bcrypt',[nativeRunner,candidateDir,reportDir],candidateDir,30000);
  const native=readJSON(path.join(reportDir,'native-smoke-evidence.json'));gate(native.status==='NATIVE_CANDIDATE_SMOKE_PASS','NATIVE_BCRYPT_NOT_QUALIFIED');result.native=native;
  phase='PROMPT_ASSET_SMOKE';
  const assets=Object.keys(ASSET_PINS).map(file=>{const row=buildPolicy.fileIdentity(candidateDir,file);return {file,sha256:row.sha256,bytes:row.bytes};});
  const engines=Object.fromEntries(['healing','business'].map(engine=>{const r=readJSON(path.join(candidateDir,'ai',engine,'registry.json'));return [engine,{version:r.version,prompts:r.prompts.map(({id,risk})=>({id,risk}))}];}));
  save('prompt-manifest.json',{project:'MyMentalHealthBuddy',schemaVersion:1,assets,engines});
  const promptLog=await child('prompt-assets',[promptRunner,path.join(buildRoot,'server/lib/promptEngine.mjs'),path.join(reportDir,'prompt-manifest.json')],candidateDir,30000);
  const prompt=JSON.parse(fs.readFileSync(promptLog,'utf8').trim());gate(prompt.status==='PROMPT_ASSET_LOAD_PASS'&&prompt.moduleLoads===18,'PROMPT_ASSET_NOT_QUALIFIED');save('prompt-evidence.json',prompt);result.prompt=prompt;
  gate(JSON.stringify(buildPolicy.regularTree(candidateDir))===JSON.stringify(candidateBefore),'CANDIDATE_CHANGED_DURING_SMOKE');
  for(const row of sourcesBefore.rows)gate(buildPolicy.fileIdentity(buildRoot,row.file).sha256===row.sha256,'BUILD_SOURCE_CHANGED',{file:row.file});
  gate(policy.inspectInstalled(buildRoot,lock).manifestSha256===priorInstalled.manifestSha256,'BUILD_DEPENDENCIES_CHANGED');
  save('candidate-manifest.json',candidateBefore);
  result.candidate={directory:candidateDir,files:candidateBefore.rows.length,bytes:candidateBefore.bytes,manifestSha256:candidateBefore.manifestSha256};

  const builtins=new Set(builtinModules.map(x=>x.replace(/^node:/,'')));
  result.externalRuntimeRequirements=result.server.externalImports.map(specifier=>{
    const builtin=builtins.has(specifier.replace(/^node:/,''));
    const packageName=specifier.startsWith('@')?specifier.split('/').slice(0,2).join('/'):specifier.split('/')[0];
    const copied=builtin?false:buildPolicy.safeRelative(packageName)&&fs.existsSync(path.join(candidateDir,'node_modules',packageName,'package.json'));
    return {specifier,kind:builtin?'NODE_BUILTIN':'PACKAGE',candidatePackagePresent:copied,
      qualification:builtin?'NODE_BUILTIN':copied?'COPIED_SYNTHETIC_SMOKE_ONLY':'RUNTIME_REACHABILITY_AND_PACKAGING_UNQUALIFIED'};
  });
  save('external-runtime-requirements.json',result.externalRuntimeRequirements);
  result.status='RETAINED_CANDIDATE_BUILD_AND_SMOKE_PASS_NOT_RELEASE';console.log('GATE=RESUMED_CANDIDATE_NATIVE_AND_PROMPT_SMOKES RESULT=PASS');
}catch(error){failure=err(error,phase);}
finally {
  if(reportDir)try {
    verifyEvidenceRoot();if(baseline)compareInputs();
    if(before){const after=snapshot();save('git-after.json',after);result.preservation=snapshotDifference(before,after);gate(result.preservation.components.length===0,'WORKTREE_PRESERVATION');}
    result.preservationStatus=baseline&&priorInstalled&&frontBefore&&buildRootIdentity?'CURRENT_SOURCE_R16E_AND_OBSERVED_R17_PRESERVED':'PARTIAL_OBSERVATIONS_ONLY';
  }catch(error){failure={...err(error,'FINAL_PRESERVATION'),previousFailure:failure};result.preservationStatus='FAILED';}
  if(failure)result.status='RETAINED_CANDIDATE_FAILED';result.failure=failure;
  result.remaining=['Public VITE values, consumers of generated browser/optional-peer stubs, unavailable watch coverage and deployed working-directory contract','Runtime external/dynamic imports including @react-email/render, Resend distribution and missing optional-package reachability',
    'Eight kernel references and inactive RSS content outside reviewed prompt assets','Application/browser/auth/database/AI-safety acceptance','Backup/restore, deployment procedure and deployed identity'];
  result.limitations=['Private candidate only. No application server, database, AI request, npm install, migration, commit, push or deployment is invoked.',
    'The reviewed prompt loader and copied bcrypt native binding execute. This continuation invokes no compiler, package installation or dependency lifecycle scripts.',
    'Minimal child environments and before/after hashes are not an OS filesystem/network sandbox or concurrent-editor lock.',
    'No registry/provider/network request is invoked. Network requests internal to loaded code are not measured.',
    'Source copy covers server/client/shared/attached_assets, selected root configuration and 22 reviewed prompts; nested dependency/build directories, environment files and private key/config names are excluded.',
    'A single retained R16E npm install and the R17 outputs are reused. The R17 server hash is checked against the screenshot; frontend hashes are first recorded here, with retained output sizes/references rechecked.',
    'The retained /tmp build copy must still exist and match its original inputs. Candidate/report files are project-local and are not an off-host backup.',
    'Successful module loading and synthetic password comparisons do not qualify role enforcement, clinical safety, browser behavior, authentication flows or runtime configuration.'];
  if(reportDir)try{result.evidenceWrite='SAVED';save('resumed-candidate-evidence.json',result);}catch(error){failure=err(error,'EVIDENCE_WRITE');result.status='RETAINED_CANDIDATE_FAILED';result.failure=failure;result.evidenceWrite='FAILED';}
  console.log(JSON.stringify({project:result.project,status:result.status,releaseReady:false,server:result.server,frontend:result.frontend,graph:result.graph,externalRuntimeRequirements:result.externalRuntimeRequirements,
    nativeStatus:result.native?.status,promptStatus:result.prompt?.status,moduleLoads:result.prompt?.moduleLoads,candidate:result.candidate,
    preservationStatus:result.preservationStatus,changedFileCount:result.preservation?.changedFileCount,compilerInvocationsThisRun:0,processes,failure:result.failure,
    applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',evidenceWrite:result.evidenceWrite},null,2));
  console.log('COMPILER_INVOCATIONS_THIS_RUN=0 RETAINED_OUTPUTS_REUSED='+(result.retainedOutputsReused?1:0));
  console.log('SOURCE_EDIT=0 ROOT_PACKAGE_EDIT=0 ACTIVE_NODE_MODULES_MODIFIED=0 PACKAGE_INSTALL=0');
  console.log('APPLICATION_STARTED=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0 AI_REQUEST=0 CREDENTIAL_CHANGE=0');
  console.log('STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0 NETWORK_REQUEST_COUNT=NOT_MEASURED');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');process.exitCode=failure?1:0;
}
