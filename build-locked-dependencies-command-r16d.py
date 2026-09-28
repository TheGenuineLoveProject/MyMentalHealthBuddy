from pathlib import Path
import base64
import hashlib

HERE = Path(__file__).resolve().parent
prefix = (HERE / 'locked-dependencies-prefix-r16c.mjs').read_text().replace('CURRENT_R16C_OBSERVATIONS_ONLY', 'CURRENT_R16D_OBSERVATIONS_ONLY')
body = (HERE / 'locked-dependencies-body-r16c.mjs').read_text()

def replace(old, new):
    global body
    assert body.count(old) == 1, old[:100]
    body = body.replace(old, new, 1)

replace("path.join(evidenceRoot,'r16c-')", "path.join(evidenceRoot,'r16d-')")
replace('COMMAND_ID=MMHB-REGISTRY-LOCKED-DEPENDENCIES-R16C', 'COMMAND_ID=MMHB-BUNDLE-AWARE-DEPENDENCIES-R16D')
replace('ISSUE_ID=REGISTRY-ARCHIVE-RELOCATION-001', 'ISSUE_ID=EXCLUDED-WASM-BUNDLE-REPRESENTATION-001')
replace("name+(name==='normalizer'?'-r16c.mjs':'-r16.mjs')", "name+(name==='runner'?'-r16.mjs':'-r16d.mjs')")
replace("  const plan=normalizerModule.planArchiveRepair(pkg,originalLock,policyModule.validateLock);", """  const archiveLess=Object.entries(originalLock.packages||{}).filter(([file,entry])=>file&&entry&&typeof entry==='object'&&entry.integrity===undefined);
  result.lockRepresentation={entriesWithoutIntegrity:archiveLess.length,displayed:archiveLess.slice(0,25).map(([file,entry])=>({
    file:label(file),inBundle:entry.inBundle===true,optional:entry.optional===true,
    resolvedPresent:Object.hasOwn(entry,'resolved')})),scope:'CURRENT_LOCK_METADATA_ONLY'};
  save('lock-representation.json',result.lockRepresentation);
  const plan=normalizerModule.planArchiveRepair(pkg,originalLock,policyModule.validateLock,policyModule.classifyExcludedBundles);
  result.excludedBundledMembers=plan.excludedBundledMembers;
  console.log('GATE=EXCLUDED_WASM_BUNDLE_CONTRACT RESULT=PASS MEMBERS='+plan.excludedBundledMembers.length);
""")
replace('packageCount:plan.packageCount,changes:plan.changes}', 'packageCount:plan.packageCount,changes:plan.changes,excludedBundledMembers:plan.excludedBundledMembers}')
replace('platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations}', 'platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations,platformExcludedBundledMembers:policy.platformExcludedBundledMembers}')
replace("    'Absent optional packages are reported, not proven unnecessary. Native and build-tool readiness require subsequent tests.',", """    'Bundled contents without archive fields are accepted only inside the declared optional Tailwind wasm32 bundle, with reachable names and a required absent parent directory on Linux x64.',
    'The parent archive retains its SHA-512 check. Bundled members and every other non-URL lock field remain unchanged; independent package integrity requirements are unchanged.',
    'Absent optional packages are reported, not proven unnecessary. Native and build-tool readiness require subsequent tests.',""")
replace('    archiveRepairStatus:result.archiveRepair?.status,', '    excludedBundledMemberCount:result.excludedBundledMembers?.length,lockRepresentation:failure?result.lockRepresentation:undefined,\n    archiveRepairStatus:result.archiveRepair?.status,')

(HERE / 'locked-dependencies-prefix-r16d.mjs').write_text(prefix)
(HERE / 'locked-dependencies-body-r16d.mjs').write_text(body)
embedded = ''
for key, file in [('POLICY','locked-dependency-policy-r16d.mjs'),('RUNNER','locked-npm-runner-r16.mjs'),('NORMALIZER','registry-archive-repair-r16d.mjs')]:
    raw = (HERE / file).read_bytes()
    embedded += f"const {key}_B64 = '{base64.b64encode(raw).decode()}';\nconst {key}_SHA = '{hashlib.sha256(raw).hexdigest()}';\n"
driver = prefix + embedded + body
(HERE / 'locked-dependencies-driver-r16d.mjs').write_text(driver)
command = '''#!/usr/bin/env bash
# MMHB R16D: recognize excluded Tailwind bundled contents, verify archive sources,
# and attempt npm ci in a fresh private stage. Root source/lock/dependencies preserved.
# Public npm network access; lifecycle scripts disabled; no application start/deploy.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R16D_NODE'
''' + driver + '\nMMHB_R16D_NODE\n'
target = HERE.parent / 'MMHB-BUNDLE-AWARE-DEPENDENCIES-R16D.txt'
target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest() + '  ' + target.name)
