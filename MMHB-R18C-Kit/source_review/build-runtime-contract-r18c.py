from pathlib import Path
import base64, hashlib, json

HERE=Path(__file__).resolve().parent
def sha(raw): return hashlib.sha256(raw).hexdigest()
mapping=json.loads((HERE/'r14-external-reviewed-mapping.json').read_text())
reviews=[]
for item in mapping['sources']:
    item=dict(item)
    if item['workspacePath']=='node_modules/pg/lib/native/client.js':
        item.update(sha256='9fe2f45918152531b1e76ff4cf54ff754fcd9651d85cfb997efd450a97d55917',
                    localSource='source_review/r15-pg-8.23.0-native-client.js')
    local=HERE.parent/item['localSource']
    assert sha(local.read_bytes())==item['sha256'],local
    reviews.append({'file':item['workspacePath'],'sha256':item['sha256'],'classification':item['classification']})
for name,expected in [('index.mjs','3b3514f7301900eb8614b05ef03d563b66e15d0b5b640a179fe8f7879553928c'),
                      ('index.cjs','66659b52d6b3350895d34b8bc290ccf07e4ceb7a0f0625d1a70f3850baf11806')]:
    local=HERE/('r18-resend-6.22.1-'+name)
    assert sha(local.read_bytes())==expected,local
    reviews.append({'file':'node_modules/resend/dist/'+name,'sha256':expected,
                    'classification':'PUBLISHED_6_22_1_DISTRIBUTION_REVIEWED_FIVE_CONDITIONAL_RENDER_APIS'})
assets=json.loads((HERE/'r14-assets-runtime-mapping.json').read_text())
for item in assets['consumerPins']:
    reviews.append({'file':item['file'],'sha256':item['sha256'],'classification':'SELECTED_REVIEWED_RUNTIME_ASSET_CONSUMER'})
reviewed=json.loads((HERE/'r17c-user-result-analysis.json').read_text())['historical']['rows']
assert len(reviewed)==42
packages=['ws','pg','resend','@react-email/render','bufferutil','utf-8-validate','pg-cloudflare','pg-native','bcrypt','node-gyp-build']
files={'BUILD':'fresh-build-policy-r17.mjs','SNAPSHOT':'preservation-snapshot-policy-r17c.mjs',
       'GRAPH':'runtime-graph-policy-r18c.mjs','PACKAGE':'runtime-contract-analysis-r14.mjs',
       'SMOKE':'r18-runtime-helper-smoke.mjs','RESEND':'r18-resend-smoke.mjs'}
helpers={key:{'sha256':sha((HERE/file).read_bytes()),'b64':base64.b64encode((HERE/file).read_bytes()).decode()} for key,file in files.items()}
prefix=(HERE/'fresh-candidate-prefix-r17.mjs').read_text()
constants={'HELPERS':helpers,'REVIEWED_ADDITIONS':reviewed,'SOURCE_REVIEWS':reviews,'ASSET_SETS':assets['assetSets'],'RUNTIME_PACKAGES':packages}
source=prefix+'\n'+''.join('const '+key+' = '+json.dumps(value)+';\n' for key,value in constants.items())+(HERE/'runtime-contract-body-r18c.mjs').read_text()
(HERE/'runtime-contract-driver-r18c.mjs').write_text(source)
command='''#!/usr/bin/env bash
# MyMentalHealthBuddy R18C: saved build and exact reviewed synthetic runtime checks.
# No application start, installation, build, database, email or AI request.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --experimental-vm-modules --input-type=module <<'MMHB_R18C_NODE'
'''+source+'\nMMHB_R18C_NODE\n'
target=HERE.parent/'MMHB-RUNTIME-CONTRACT-R18C.txt'
target.write_text(command)
print(sha(target.read_bytes())+'  '+target.name)
