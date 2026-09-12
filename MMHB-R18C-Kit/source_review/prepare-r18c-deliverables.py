from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / 'source_review'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

command = ROOT / 'MMHB-RUNTIME-CONTRACT-R18C.txt'
digest = sha(command)
driver = json.loads((HERE / 'r18c-driver-fixture-results.json').read_text())
graph = json.loads((HERE / 'r18c-graph-fixture-results.json').read_text())
scope = json.loads((HERE / 'r18c-scope-comparison.json').read_text())
assert driver['status'] == graph['status'] == scope['status'] == 'PASS'
assert driver['generatedDriverSha256'] == sha(HERE / 'runtime-contract-driver-r18c.mjs')
assert driver['embeddedGraphSha256'] == graph['graphSha256'] == sha(HERE / 'runtime-graph-policy-r18c.mjs')
assert scope['commandSha256'] == digest
run = f"""cd /home/runner/workspace &&
printf '%s\\n' '{digest}  MMHB-RUNTIME-CONTRACT-R18C.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RUNTIME-CONTRACT-R18C.txt"""

start = f"""MyMentalHealthBuddy — R18C

R18B identified the exact filename that stopped R18A:
node_modules/es6-symbol/lib/private/generate-name.js

Both saved graphs agree. The published es6-symbol 3.1.4 archive matches
the reported module hash and package.json hash. The directory name private
triggered the checker's rule; this demonstrated failure was a filename
false positive. R18B did not execute or repair the application.

R18C corrects that rule only for three individually reviewed JavaScript
modules in this exact package version. Their fixed hashes and package
identity must match the inventory and current retained bytes before any
graph PASS or helper execution. Other private/sensitive paths remain blocked.

1. Download MMHB-RUNTIME-CONTRACT-R18C.txt.
2. Upload ONLY that TXT into MyMentalHealthBuddy's Replit workspace beside
   package.json. Wait until the exact filename appears. Keep the optional
   ZIP and ledgers on your computer.
3. Open Replit Shell and paste:

{run}

4. Let it finish before editing or uploading more files into the workspace.
5. Return the complete output, including STATUS and REPORT_DIRECTORY.

Allow approximately 5–15 minutes to upload, run, and return. Replit AI is
not needed. If the checksum reports a missing file, finish uploading the
TXT with the exact filename before running the command again.

R18C uses the retained build and writes only a new diagnostic report.
It does not rebuild, install packages, edit application files, start the
application, send email, connect to a database, make AI requests, or deploy.
It may execute the existing exact-reviewed ws/pg and Resend synthetic tests
after all preceding checks pass. Attempt flags report whether they ran.

How to interpret the result:
- RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE: listed retained checks
  passed; application and deployment verification are still needed.
- RUNTIME_CONTRACT_REVIEW_REQUIRED: inspect the reported findings before
  continuing. Input-only external references are never silently accepted.
- RUNTIME_CONTRACT_FAILED: return the failed gate and complete output.

Locally verified: {graph['testCount']} graph tests, {driver['fixtureCount']} integration fixtures,
Node/Bash syntax, and unchanged 63 pins plus five non-graph helpers.
Integration success paths include 11 helper and 20 Resend synthetic cases.
Tests used Node {driver['node']}; the production command retains its exact
Replit Node v24.13.0 gate. No actual MMHB runtime was executed locally.

Current release status: publication acceptance remains open. The earlier
27–61 engineering-hour estimate is a low-confidence planning allowance for
the first release, assuming substantial existing implementation and no
major redesign. Expanded library/calendar/social/provider features and
external waiting are excluded. Reestimate after controlled startup.
"""
(ROOT / 'MMHB-R18C-Start.txt').write_text(start)

ledger = ROOT / 'MMHB-Readiness-Ledger-2026-09-07.md'
archive = HERE / 'r18b-ledger-handoff-archive.md'
if not archive.exists(): archive.write_bytes(ledger.read_bytes())
previous = archive.read_text()
history = previous[previous.index('## Completed and open gates'):]
lines = history.splitlines()
for i, line in enumerate(lines):
    if line.startswith('| R18A graph contract correction |'):
        lines[i] = '| R18A graph contract correction | FAILED in supplied Replit screenshots | Source 5,192, pins 63, candidate 625 and zero observed changes confirmed; private filename blocked graph before helper tests |'
    if line.startswith('| R18B exact input path inspection |'):
        lines[i] = '| R18B exact input path inspection | OBSERVED: exact path identified in both saved graphs | es6-symbol 3.1.4 generate-name.js; metadata stable; module contents not read and no application execution |'
        lines.insert(i + 1, '| R18C published private-module correction | PREPARED; 29 graph and 22 driver tests PASS locally | Three exact source identities; current-byte checks before graph PASS/helper execution; Replit execution pending |')
        break
else: raise AssertionError('R18B ledger entry missing')
history = '\n'.join(lines) + '\n'
front = f"""# MyMentalHealthBuddy — working first release

Updated after the supplied R18B result. Scope: **MyMentalHealthBuddy.com only**. Next command: **MMHB-RUNTIME-CONTRACT-R18C.txt**. R18C is prepared and tested locally; its Replit execution is pending.

## Current evidence and correction

R18B ran with the expected command checksum. It identified `node_modules/es6-symbol/lib/private/generate-name.js` in both saved build metadata maps. The raw input spelling's SHA256 is `c4c8b0e9f50a3e6490cdce714f0cfe8b89563962cc4a3709a00a11e80704258b` (52 bytes). The normalized module is 789 bytes with SHA256 `ac714f2cc6f1595a5b7bc967d411ca41e320e1a599690c383d4a2b492857b8d4`. Package version is 3.1.4 and package.json SHA256 is `a37d9a643a92e8c58675a3e03b2bae12df95215b6a45889e752e0018f60fd525`. The read metadata stayed stable. R18B did not read the module contents, run helpers, start the application, or write a report.

The published npm archive now independently matches those module and package identities. Its SHA512 integrity matches the registry metadata. Three published JavaScript modules use `lib/private`: generate-name.js, setup/standard-symbols.js, and setup/symbol-registry.js. All three were inspected and their exact hashes retained. The two siblings are verified published files; their presence in MMHB's graph is not assumed. See `source_review/r18c-es6-symbol-review.md` and provenance JSON for source and scope.

R18C provides a narrow internal-filename exception for those three exact identities. Inventory checks alone cannot authorize changed bytes: the driver separately hashes current retained modules and package.json, checks package name/version and the pinned lockfile version, and then permits graph evidence/PASS and existing synthetic tests. Every other private/sensitive path remains subject to the old rule. External specifier and inferred package-name validation are unchanged. No npm install or version upgrade is needed for this demonstrated checker failure.

The latest full source/pin/candidate comparison remains R18A: 63 pins, 5,192 source files, a 625-file candidate and zero observed changes. R18C will recheck them. The original R17B preservation failure remains part of the historical evidence; its 42 delivered review-file additions were separately accounted for. Application startup, real user flows and deployed artifact remain **UNPROVEN**. No overall completion percentage is defensible yet.

## Run R18C

Upload only the TXT beside MMHB's package.json, wait until its exact filename is visible, and run:

```bash
{run}
```

Let it finish without concurrent edits/uploads; return all output. Replit AI is unnecessary. Allow 5–15 operator minutes. This session has no direct Replit Shell connection. R18C writes a new diagnostic report and leaves active application files, dependencies and old reports unchanged.

Local qualification: **29 graph tests**, **22 full driver integration fixtures**, syntax checks and unchanged-prefix/pin/helper comparison. Success fixtures execute the existing 11 helper and 20 Resend synthetic cases. Eight new integration failure cases cover current or recorded module/package changes, refreshed-manifest tampering, lock version mismatch, module/directory symlinks, and unknown private paths. They stop before graph PASS or helper execution. Secret canaries are absent from output and reports, with no real transport or app execution in these fixtures. Local Node {driver['node']} differs from the retained Replit v24.13.0 gate; actual Replit qualification is still required.

## Remaining work and estimates

The first-release **27–61 engineering-hour** range remains a low-confidence planning allowance, not measured progress or a commitment. It assumes substantial existing implementation and no major redesign. Expanded content/integrations and external waiting are excluded.

| Work | Planning hours | Acceptance evidence |
| --- | ---: | --- |
| Runtime packaging, configuration, controlled startup | 8–18 | Real bundle starts with intended assets/dependencies and controlled side effects |
| Authentication, data isolation, core flows, AI safety | 12–26 | User-flow and failure-case evidence on the intended runtime |
| Mobile, accessibility, performance, launch content | 4–10 | Exposed routes usable and content reviewed |
| Recovery, CI, deployment, domain verification | 3–7 | Restore/rollback works and intended artifact serves the domain |

Reestimate after controlled startup. A retained graph or synthetic helper pass is not a production launch. Queue the growing sourced library, calendar assistant, daily content drafts, teaching visuals/slides/PDFs, book/affiliate workflows and configured providers after the working release baseline. Keep MMHB separate from other platforms. Clinical evidence labels, editorial review, consent, source rights and plain-language explanations belong in content workflows; metaphors or spiritual/quantum language do not establish treatment efficacy. Mentioned plugins are not completed integrations.

## Continuation prompt

Continue MyMentalHealthBuddy only. Review the complete R18C result. Preserve all 63 pins, auth/prompt work, retained artifacts and historical receipts. Confirm the exact published private modules pass current-byte/package checks, then review any remaining input-only external references using the reported owner/hash/class. Distinguish synthetic helper results from real startup and deployment. Resolve the next demonstrated runtime blocker with a tested, bounded Shell command, exact SHA256 and clear instructions; use Replit AI only as a last resort. Keep expanded content/calendar/social features queued until the first release is verified.

"""
ledger.write_text(front + history)
(ROOT / 'MMHB-Ledger.txt').write_bytes(ledger.read_bytes())

(HERE / 'R18C-Verification-README.md').write_text(f"""# R18C verification

Issue: R18C-PUBLISHED-PRIVATE-MODULE-001. Prepared command SHA256: {digest}.

Local tests passed: {graph['testCount']} graph tests and {driver['fixtureCount']} genuine-Git driver fixtures. The generated driver hash and embedded graph hash are tied to the saved test receipts. The 63 existing pins, five non-graph helpers, fixed prefix and selected source reviews are unchanged. No actual MMHB runtime was tested.

Reproduce from the extracted kit's root using existing Python 3, Git and Node 24:

```bash
python3 source_review/build-runtime-contract-r18c.py
node --test --test-reporter=tap source_review/test-runtime-graph-policy-r18c.mjs
python3 source_review/test-r18c-driver.py
node --check source_review/runtime-contract-driver-r18c.mjs
bash -n MMHB-RUNTIME-CONTRACT-R18C.txt
```

These are local reproduction instructions, not extra steps for the Replit operator. Upload only the standalone TXT into Replit. The fixture harness creates disposable repositories and substitutes fixture roots/HEAD/Node and application pins; published private-module identity constants remain unchanged. The success fixtures include 11 reviewed ws/pg helper cases and 20 reviewed Resend cases with synthetic transports.

The upstream module/package bytes, ISC license, archive integrity record, R18B observation, graph tests, integration tests, preservation comparison and generated command are included. Source review does not imply package security certification or application/runtime reachability. R18C may still report unrelated review findings. All outcomes retain releaseReady=false and applicationRuntime=UNPROVEN.
""")

with zipfile.ZipFile(ROOT / 'MMHB-R18A-Kit.zip') as previous_kit:
    old_sources = [name.split('/', 1)[1] for name in previous_kit.namelist() if '/source_review/' in name]
files = {ROOT / name for name in old_sources}
files.update(p for p in HERE.glob('*r18c*') if p.is_file())
files.update(p for p in (HERE / 'r18c-es6-symbol-3.1.4').rglob('*') if p.is_file())
files.update([HERE / 'R18C-Verification-README.md', HERE / 'r18b-user-result-analysis.json', archive,
              command, ROOT / 'MMHB-R18C-Start.txt', ledger, ROOT / 'MMHB-Ledger.txt'])
record = HERE / 'r18c-preparation-record.json'
files.discard(record)
record.write_text(json.dumps({'project':'MyMentalHealthBuddy','status':'PREPARED_AND_LOCALLY_TESTED_REPLIT_PENDING',
    'releaseReady':False,'applicationRuntime':'UNPROVEN','commandSha256':digest,
    'graphTests':graph['testCount'],'driverFixtures':driver['fixtureCount'],
    'files':[{'file':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(files)]},indent=2)+'\n')
files.add(record)
kit = ROOT / 'MMHB-R18C-Kit.zip'
with zipfile.ZipFile(kit,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(files): z.write(p,'MMHB-R18C-Kit/'+str(p.relative_to(ROOT)))
with zipfile.ZipFile(kit) as z:
    assert len(z.namelist()) == len(files)
    for p in files: assert z.read('MMHB-R18C-Kit/'+str(p.relative_to(ROOT))) == p.read_bytes()
print(json.dumps({'commandSha256':digest,'kitFiles':len(files),'kitBytes':kit.stat().st_size,
    'deliverables':[p.name for p in [command,ROOT/'MMHB-R18C-Start.txt',ledger,ROOT/'MMHB-Ledger.txt',kit]]}))
