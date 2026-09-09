from pathlib import Path
import base64, hashlib
HERE=Path(__file__).resolve().parent
prefix=(HERE/'locked-dependencies-prefix-r16.mjs').read_text()
body=(HERE/'locked-dependencies-body-r16.mjs').read_text()
embedded=''
for key,file in [('POLICY','locked-dependency-policy-r16.mjs'),('RUNNER','locked-npm-runner-r16.mjs')]:
    raw=(HERE/file).read_bytes()
    embedded+=f"const {key}_B64 = '{base64.b64encode(raw).decode()}';\nconst {key}_SHA = '{hashlib.sha256(raw).hexdigest()}';\n"
driver=prefix+embedded+body
(HERE/'locked-dependencies-driver-r16.mjs').write_text(driver)
command='''#!/usr/bin/env bash
# MyMentalHealthBuddy R16: fresh private installation from the unchanged root lock.
# Downloads public npm packages; disables lifecycle scripts. No workspace installation.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R16_NODE'
'''+driver+"\nMMHB_R16_NODE\n"
target=HERE.parent/'MMHB-LOCKED-DEPENDENCIES-R16.txt'
target.write_text(command)
print(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name)
