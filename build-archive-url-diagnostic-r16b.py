from pathlib import Path
import base64,hashlib
p=Path(__file__).resolve().parent
raw=(p/'archive-url-diagnostic-r16b-helper.mjs').read_bytes()
constants="const DIAGNOSTIC_HELPER_B64='"+base64.b64encode(raw).decode()+"';\nconst DIAGNOSTIC_HELPER_SHA='"+hashlib.sha256(raw).hexdigest()+"';\n"
driver=constants+(p/'archive-url-diagnostic-r16b-body.mjs').read_text()
(p/'archive-url-diagnostic-r16b-driver.mjs').write_text(driver)
out=p.parent/'MMHB-ARCHIVE-URL-DIAGNOSTIC-R16B.txt'
out.write_text("""#!/usr/bin/env bash
# MMHB R16B: inspect archive URL reasons; no installation or application execution.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_R16B_NODE'
"""+driver+"\nMMHB_R16B_NODE\n")
print(hashlib.sha256(out.read_bytes()).hexdigest()+'  '+out.name)
