from pathlib import Path
import base64,hashlib,json
HERE=Path(__file__).resolve().parent
prefix=(HERE/'fresh-candidate-prefix-r17.mjs').read_text().replace('CURRENT_R17_OBSERVATIONS_ONLY','CURRENT_R17C_OBSERVATIONS_ONLY')
files={'POLICY':'locked-dependency-policy-r16e.mjs','BUILD_POLICY':'fresh-build-policy-r17.mjs','SNAPSHOT':'preservation-snapshot-policy-r17c.mjs'}
helpers={key:{'sha256':hashlib.sha256((HERE/file).read_bytes()).hexdigest(),'b64':base64.b64encode((HERE/file).read_bytes()).decode()} for key,file in files.items()}
source=prefix+'\nconst HELPERS = '+json.dumps(helpers)+';\n'+(HERE/'preservation-diagnostic-body-r17c.mjs').read_text()
(HERE/'preservation-diagnostic-driver-r17c.mjs').write_text(source)
command='''#!/usr/bin/env bash
# MMHB R17C: inspect all R17B worktree differences and retained candidate identities.
# No source repair, build, install, application/database start or deployment.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R17C_NODE'
'''+source+'\nMMHB_R17C_NODE\n'
target=HERE.parent/'MMHB-PRESERVATION-INSPECT-R17C.txt';target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
