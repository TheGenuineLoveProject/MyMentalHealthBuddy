"""Build a finite delivered-byte catalog and a narrowly changed R18C successor."""
from pathlib import Path, PurePosixPath
import hashlib, json, zipfile

ROOT=Path(__file__).resolve().parent.parent
HERE=ROOT/'source_review'
sha=lambda b:hashlib.sha256(b).hexdigest()
blob=lambda b:hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
catalog={}
archives=[]
def add(name, raw):
    p=PurePosixPath(name)
    assert not p.is_absolute() and '..' not in p.parts and '\\' not in name
    catalog.setdefault(name,set()).add(blob(raw))

# Explicitly finite set, ending before this successor. These are delivered
# review artifacts, not an allowlist for arbitrary application directories.
names=['R11D-Verification','R12-Verification','R12A-Verification','R13-Verification',
       'R14-Verification','R15-Verification','R16-Verification','R16A-Verification',
       'R16B-Verification','R16C-Verification','R16D-Verification','R16E-Verification',
       'R17-Kit','R17A-Kit','R17B-Kit','R17C-Kit','R18-Kit','R18A-Kit','R18B-Kit','R18C-Kit']
for suffix in names:
    file=ROOT/('MMHB-'+suffix+'.zip')
    archives.append({'file':file.name,'sha256':sha(file.read_bytes())})
    add(file.name,file.read_bytes())
    with zipfile.ZipFile(file) as z:
        for member in z.infolist():
            if member.is_dir():continue
            assert not ((member.external_attr>>16)&0o170000)==0o120000
            name=member.filename
            # Some earlier kits omit their enclosing folder in the archive.
            relative=name[len(file.stem)+1:] if name.startswith(file.stem+'/') else name
            raw=z.read(member)
            add(file.stem+'/'+relative,raw)
            # Copies extracted directly at the workspace root are eligible
            # only for known review paths or a named MMHB artifact.
            if relative.startswith('source_review/') or ('/' not in relative and relative.startswith('MMHB-')):
                add(relative,raw)
catalog={name:sorted(ids) for name,ids in sorted(catalog.items())}
(HERE/'r18f-delivered-review-blobs.json').write_text(json.dumps(catalog,indent=2)+'\n')
(HERE/'r18f-catalog-provenance.json').write_text(json.dumps({'archives':archives,'paths':len(catalog),
  'scope':'Exact Git blob IDs computed from prior local delivery archive bytes. No application path prefix is authorized.'},indent=2)+'\n')

old=(HERE/'runtime-contract-driver-r18c.mjs').read_text()
assert sha((ROOT/'MMHB-RUNTIME-CONTRACT-R18C.txt').read_bytes())=='645d7f9d1c39f31308714090d6f728b6208166ad20ec10058eb42116036c6128'
assert sha(old.encode())=='69bd9782413f52ba436db4e72e0b5a3e4faf4637f1324828ba0edae247dd6baf'
body=(HERE/'runtime-contract-body-r18c.mjs').read_text()
assert old.endswith(body)
gate="gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');"
assert body.count(gate)==1
body=body.replace(gate,"phase='COMMITTED_CHANGE_REVIEW';reviewCommittedAdditions();",1)
body=body.replace('MMHB-RUNTIME-CONTRACT-R18C','MMHB-RUNTIME-CONTRACT-R18F').replace('R18C-PUBLISHED-PRIVATE-MODULE-001','R18F-REVIEWED-COMMIT-CONTINUATION-001')
body=body.replace("'r18c-'","'r18f-'")
(HERE/'runtime-contract-body-r18f.mjs').write_text(body)
constants={'OBSERVED_HEAD':'15afbd26287e028bb1a1146cad06f08fa77208ce','EXPECTED_COMMITTED_CHANGES':508,'DELIVERED_REVIEW_BLOBS':catalog}
source=old[:-len((HERE/'runtime-contract-body-r18c.mjs').read_text())]+''.join('const '+k+' = '+json.dumps(v,separators=(',',':'))+';\n' for k,v in constants.items())+(HERE/'commit-review-r18f.mjs').read_text()+body
(HERE/'runtime-contract-driver-r18f.mjs').write_text(source)
command='''#!/usr/bin/env bash
# R18F: verify all committed additions, then reuse R18C retained runtime checks.
set -Eeuo pipefail
cd /home/runner/workspace || exit 1
umask 077
env -u NODE_PATH -u NODE_V8_COVERAGE NODE_OPTIONS= NODE_DISABLE_COMPILE_CACHE=1 node --experimental-vm-modules --input-type=module <<'MMHB_R18F_NODE'
'''+source+'\nMMHB_R18F_NODE\n'
(ROOT/'MMHB-RUNTIME-CONTRACT-R18F.txt').write_text(command)
print(json.dumps({'catalogPaths':len(catalog),'commandBytes':len(command.encode()),'commandSha256':sha(command.encode())},indent=2))
