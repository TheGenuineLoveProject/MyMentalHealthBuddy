from pathlib import Path
import base64,hashlib,json
HERE=Path(__file__).resolve().parent
prefix=(HERE/'fresh-candidate-prefix-r17.mjs').read_text().replace('CURRENT_R17_OBSERVATIONS_ONLY','CURRENT_R17A_OBSERVATIONS_ONLY')
files={'POLICY':'locked-dependency-policy-r16e.mjs','NORMALIZER':'registry-archive-repair-r16d.mjs',
 'BUILD_POLICY':'fresh-build-policy-r17.mjs','GRAPH':'frontend-graph-policy-r17a.mjs',
 'SERVER':'server-build-runner-r17.mjs','FRONTEND':'frontend-build-runner-r17.mjs',
 'NATIVE':'native-candidate-runner-r17a.mjs','PROMPT':'prompt-asset-runner-r15.mjs'}
helpers={key:{'sha256':hashlib.sha256((HERE/file).read_bytes()).hexdigest(),'b64':base64.b64encode((HERE/file).read_bytes()).decode()} for key,file in files.items()}
source=prefix+'\nconst HELPERS = '+json.dumps(helpers)+';\n'+(HERE/'resumed-candidate-body-r17a.mjs').read_text()
(HERE/'resumed-candidate-driver-r17a.mjs').write_text(source)
command='''#!/usr/bin/env bash
# MMHB R17A: inspect graph IDs and finish the retained R17 candidate.
# No new compilation, package installation, root-source edit, app/DB start or deployment.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R17A_NODE'
'''+source+'\nMMHB_R17A_NODE\n'
target=HERE.parent/'MMHB-RESUME-CANDIDATE-R17A.txt';target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
