from pathlib import Path
import base64
import hashlib

HERE = Path(__file__).resolve().parent
prefix = (HERE / 'locked-dependencies-prefix-r16a.mjs').read_text().replace('CURRENT_R16_OBSERVATIONS_ONLY', 'CURRENT_R16C_OBSERVATIONS_ONLY')
body = (HERE / 'locked-dependencies-body-r16a.mjs').read_text()

def replace(old, new):
    global body
    assert body.count(old) == 1, old[:100]
    body = body.replace(old, new, 1)

replace("let evidenceRootIdentity;", "let evidenceRootIdentity,stagePins,normalizerModule,archiveEvidence;\nconst sourceSummary=value=>{const {receipts,...summary}=value;return summary;};")
replace("artifactIdentity(stageDir,file).sha256===PINS[file]", "artifactIdentity(stageDir,file).sha256===stagePins[file]")
replace("path.join(evidenceRoot,'r16a-')", "path.join(evidenceRoot,'r16c-')")
replace('COMMAND_ID=MMHB-LOCKED-DEPENDENCIES-R16A', 'COMMAND_ID=MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C')
replace('ISSUE_ID=LOCKED-DEPENDENCY-RECONSTRUCTION-001', 'ISSUE_ID=REGISTRY-ARCHIVE-RELOCATION-001')
replace("runner:Buffer.from(RUNNER_B64,'base64')", "runner:Buffer.from(RUNNER_B64,'base64'),normalizer:Buffer.from(NORMALIZER_B64,'base64')")
replace("hash(helperSources.runner)===RUNNER_SHA,'EMBEDDED_HELPER_IDENTITY'", "hash(helperSources.runner)===RUNNER_SHA&&hash(helperSources.normalizer)===NORMALIZER_SHA,'EMBEDDED_HELPER_IDENTITY'")
replace("name+'-r16.mjs'", "name+(name==='normalizer'?'-r16c.mjs':'-r16.mjs')")
replace("runnerModule=await import('data:text/javascript;base64,'+RUNNER_B64);", "runnerModule=await import('data:text/javascript;base64,'+RUNNER_B64);\n  normalizerModule=await import('data:text/javascript;base64,'+NORMALIZER_B64);")
old = """  const pkg=JSON.parse(packageBytes),lock=JSON.parse(lockBytes);
  const policy=policyModule.validateLock(pkg,lock);save('lock-policy.json',policy);
  result.lockPolicy={status:policy.status,packageCount:policy.packageCount,selectedLocked:policy.selectedLocked,optionalCount:policy.optionalCount,platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations};
  tool=runnerModule.discoverNpm(process.env.PATH||'',process.execPath);save('npm-tool-before.json',tool);
  result.tool=tool;
"""
new = """  const pkg=JSON.parse(packageBytes),originalLock=JSON.parse(lockBytes);
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
  const lock=plan.normalized,normalizedLockBytes=Buffer.from(JSON.stringify(lock,null,2)+'\\n');
  stagePins={'package.json':hash(packageBytes),'package-lock.json':hash(normalizedLockBytes)};
  const policy=policyModule.validateLock(pkg,lock);save('lock-policy.json',policy);
  result.lockPolicy={status:policy.status,packageCount:policy.packageCount,selectedLocked:policy.selectedLocked,optionalCount:policy.optionalCount,platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations};
  result.archiveRepair={...result.archiveRepair,status:'VERIFIED_FOR_PRIVATE_COPY',stagedLockSha256:stagePins['package-lock.json'],
    changedFields:['packages[...].resolved'],versionsAndIntegrity:'UNCHANGED',rootLockChanged:false};
  verifyCurrent('after-registry');
  console.log('GATE=PUBLIC_REGISTRY_IDENTITY_AND_ORIGINAL_INTEGRITY RESULT=PASS');
  phase='PRIVATE_STAGE_PREPARATION';
"""
replace(old, new)
replace("path.join(stageDir,'package-lock.json'),lockBytes", "path.join(stageDir,'package-lock.json'),normalizedLockBytes")
replace("lockSha256:hash(lockBytes),policySha256:POLICY_SHA,runnerSha256:RUNNER_SHA", "lockSha256:hash(normalizedLockBytes),originalRootLockSha256:hash(lockBytes),changedArchiveEntries:plan.changedEntries,\n    policySha256:POLICY_SHA,runnerSha256:RUNNER_SHA,normalizerSha256:NORMALIZER_SHA")
replace("result.privateDependencyAlignment='LOCKED_STAGE_METADATA_PASS';", "result.privateDependencyAlignment='REGISTRY_NORMALIZED_LOCKED_STAGE_METADATA_PASS';")
replace("result.status='LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE';", "result.status='REGISTRY_LOCKED_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE';")
replace("'npm installation executes the existing npm CLI and uses the network. Dependency lifecycle scripts are disabled.',", "'Changed archive URLs are verified against official registry identity and the original SHA-512; only private lock resolved fields change.',\n    'Registry verification uses bounded built-in HTTPS requests without credentials or redirect following; the old archive URLs are never requested.',\n    'npm installation executes the existing npm CLI and uses the network. Dependency lifecycle scripts are disabled.',")
replace("'Archive integrity is checked by npm against the lockfile; no independent publisher/provenance or vulnerability audit is claimed.',", "'npm checks installed archive integrity against the normalized lock with original digests; no publisher/provenance or vulnerability audit is claimed.',")
replace("console.log('PRIVATE_NPM_INSTALL_ATTEMPTED='", "console.log('REGISTRY_REQUESTS='+(archiveEvidence?.requests??'NOT_COMPLETED')+' ARCHIVE_REPAIR_ENTRIES='+(result.archiveRepair?.changedEntries??'NOT_PLANNED'));\n  console.log('PRIVATE_NPM_INSTALL_ATTEMPTED='")
replace("console.log(JSON.stringify(result,null,2));", """const terminal={project:result.project,status:result.status,releaseReady:result.releaseReady,
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
  console.log(JSON.stringify(terminal,null,2));""")

(HERE/'locked-dependencies-prefix-r16c.mjs').write_text(prefix)
(HERE/'locked-dependencies-body-r16c.mjs').write_text(body)
embedded=''
for key,file in [('POLICY','locked-dependency-policy-r16.mjs'),('RUNNER','locked-npm-runner-r16.mjs'),('NORMALIZER','registry-archive-repair-r16c.mjs')]:
    raw=(HERE/file).read_bytes()
    embedded+=f"const {key}_B64 = '{base64.b64encode(raw).decode()}';\nconst {key}_SHA = '{hashlib.sha256(raw).hexdigest()}';\n"
driver=prefix+embedded+body
(HERE/'locked-dependencies-driver-r16c.mjs').write_text(driver)
command='''#!/usr/bin/env bash
# MMHB R16C: verify official registry sources, relocate archive URLs in a private
# lock copy, then attempt a private npm ci. Root source, lock and dependencies preserved.
# Network: public npm metadata/archives. Lifecycle scripts disabled. No app start/deploy.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R16C_NODE'
'''+driver+"\nMMHB_R16C_NODE\n"
target=HERE.parent/'MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C.txt'
target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
