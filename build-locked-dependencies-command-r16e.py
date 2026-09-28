from pathlib import Path
import base64
import hashlib

HERE = Path(__file__).resolve().parent
prefix = (HERE/'locked-dependencies-prefix-r16d.mjs').read_text().replace('CURRENT_R16D_OBSERVATIONS_ONLY','CURRENT_R16E_OBSERVATIONS_ONLY')
body = (HERE/'locked-dependencies-body-r16d.mjs').read_text()

def replace(old,new):
    global body
    assert body.count(old)==1,old[:100]
    body=body.replace(old,new,1)

replace("path.join(evidenceRoot,'r16d-')","path.join(evidenceRoot,'r16e-')")
replace('COMMAND_ID=MMHB-BUNDLE-AWARE-DEPENDENCIES-R16D','COMMAND_ID=MMHB-DEPENDENCY-METADATA-R16E')
replace('ISSUE_ID=EXCLUDED-WASM-BUNDLE-REPRESENTATION-001','ISSUE_ID=DEPENDENCY-WORKSPACE-METADATA-SCOPE-001')
replace("name+(name==='runner'?'-r16.mjs':'-r16d.mjs')","name+(name==='runner'?'-r16.mjs':name==='policy'?'-r16e.mjs':'-r16d.mjs')")
replace("  result.excludedBundledMembers=plan.excludedBundledMembers;","""  result.excludedBundledMembers=plan.excludedBundledMembers;
  result.dependencyWorkspaceMetadata=plan.proposedLockPolicy.dependencyWorkspaceMetadata;
  console.log('GATE=ROOT_WORKSPACE_BOUNDARY RESULT=PASS DEPENDENCY_METADATA_ENTRIES='+result.dependencyWorkspaceMetadata.length);""")
replace('platformExcludedBundledMembers:policy.platformExcludedBundledMembers}', 'platformExcludedBundledMembers:policy.platformExcludedBundledMembers,dependencyWorkspaceMetadata:policy.dependencyWorkspaceMetadata}')
replace("    'The parent archive retains its SHA-512 check.","    'Workspace fields on dependency entries are preserved as metadata. Root workspace configuration, link packages and non-registry dependency edges remain unsupported; npm runs with --workspaces=false and lifecycle scripts disabled.',\n    'The parent archive retains its SHA-512 check.")
replace('    excludedBundledMemberCount:result.excludedBundledMembers?.length,','    dependencyWorkspaceMetadata:result.dependencyWorkspaceMetadata,\n    excludedBundledMemberCount:result.excludedBundledMembers?.length,')

(HERE/'locked-dependencies-prefix-r16e.mjs').write_text(prefix)
(HERE/'locked-dependencies-body-r16e.mjs').write_text(body)
embedded=''
for key,file in [('POLICY','locked-dependency-policy-r16e.mjs'),('RUNNER','locked-npm-runner-r16.mjs'),('NORMALIZER','registry-archive-repair-r16d.mjs')]:
    raw=(HERE/file).read_bytes()
    embedded+=f"const {key}_B64 = '{base64.b64encode(raw).decode()}';\nconst {key}_SHA = '{hashlib.sha256(raw).hexdigest()}';\n"
driver=prefix+embedded+body
(HERE/'locked-dependencies-driver-r16e.mjs').write_text(driver)
command='''#!/usr/bin/env bash
# MMHB R16E: distinguish dependency metadata from active project workspaces,
# verify archive sources, then attempt npm ci in a fresh private stage.
# Root source/lock/dependencies preserved; lifecycle scripts disabled; no app start/deploy.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R16E_NODE'
'''+driver+'\nMMHB_R16E_NODE\n'
target=HERE.parent/'MMHB-DEPENDENCY-METADATA-R16E.txt'
target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
