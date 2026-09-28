from pathlib import Path
import base64,hashlib,json
HERE=Path(__file__).resolve().parent
prefix=(HERE/'locked-dependencies-prefix-r16e.mjs').read_text().split('const ASSET_PINS = ')[0]
prefix=prefix.replace('CURRENT_R16E_OBSERVATIONS_ONLY','CURRENT_R17_OBSERVATIONS_ONLY')
prefix+='const ASSET_PINS = '+(HERE/'locked-dependencies-prefix-r16e.mjs').read_text().split('const ASSET_PINS = ')[1]
body=(HERE/'locked-dependencies-body-r16e.mjs').read_text()
prefix+=body[body.index('function prepareEvidenceRoot(){'):body.index('\nfunction save(name,value)')]
files={'POLICY':'locked-dependency-policy-r16e.mjs','NORMALIZER':'registry-archive-repair-r16d.mjs',
 'BUILD_POLICY':'fresh-build-policy-r17.mjs','SERVER':'server-build-runner-r17.mjs','FRONTEND':'frontend-build-runner-r17.mjs',
 'NATIVE':'native-candidate-runner-r17.mjs','PROMPT':'prompt-asset-runner-r15.mjs'}
helpers={key:{'sha256':hashlib.sha256((HERE/file).read_bytes()).hexdigest(),'b64':base64.b64encode((HERE/file).read_bytes()).decode()} for key,file in files.items()}
(HERE/'fresh-candidate-prefix-r17.mjs').write_text(prefix)
source=prefix+'\nconst HELPERS = '+json.dumps(helpers)+';\n'+(HERE/'fresh-candidate-body-r17.mjs').read_text()
(HERE/'fresh-candidate-driver-r17.mjs').write_text(source)
command='''#!/usr/bin/env bash
# MMHB R17: fresh private build from the retained, verified R16E dependencies.
# No root-source/package changes, package installation, app/database start or deployment.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R17_NODE'
'''+source+'\nMMHB_R17_NODE\n'
target=HERE.parent/'MMHB-FRESH-CANDIDATE-R17.txt';target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
