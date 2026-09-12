from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / 'source_review'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

command = ROOT / 'MMHB-RUNTIME-CONTRACT-R18A.txt'
digest = sha(command)
tests = json.loads((HERE / 'r18a-driver-fixture-results.json').read_text())
assert tests['status'] == 'PASS'
assert tests['generatedDriverSha256'] == sha(HERE / 'runtime-contract-driver-r18a.mjs')
count = tests['fixtureCount']
run = f"""cd /home/runner/workspace &&
printf '%s\\n' '{digest}  MMHB-RUNTIME-CONTRACT-R18A.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RUNTIME-CONTRACT-R18A.txt"""
start = f"""MyMentalHealthBuddy — R18A

Your second R18 attempt passed its checksum. It verified all 63 pins,
5,192 recorded source files, the 625-file retained candidate and current
workspace preservation. It stopped in the graph checker before package
review or dependency helper tests. The first missing-file attempt did not
run the driver.

R18A corrects the checker to distinguish source-input external references
from imports emitted into the final server bundle. Unrecognized input
references are retained as hashes, classes and owner locations for review.
They cannot silently become a pass. Final-bundle imports remain strictly
validated, and failures now identify the graph side and entry safely.

1. Download MMHB-RUNTIME-CONTRACT-R18A.txt.
2. Upload ONLY that TXT into MyMentalHealthBuddy's Replit workspace beside
   package.json. Keep the optional ZIP and ledger on your computer.
3. Open Replit Shell and paste:

{run}

4. Let the command finish before editing or uploading additional files.
5. Return the complete output, including STATUS and REPORT_DIRECTORY.

Allow about 5–15 minutes for download, upload, run and return. Replit AI
is not needed. If the checksum says the file is missing, finish uploading
the TXT with the exact filename before running this same command again.

This command reuses the retained build. It writes only a new diagnostic
report; it does not rebuild, install, edit application files, start the
application, send email, connect to a database, call AI, commit or deploy.

RUNTIME_CONTRACT_REVIEW_REQUIRED is an informative result: inspect the
listed input references or selected source differences before proceeding.
RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE covers only the listed
checks. RUNTIME_CONTRACT_FAILED identifies a failed prerequisite or test.
All results keep application runtime and deployment UNPROVEN.

Locally tested: {count} full driver fixtures plus 21 graph regression tests and
four actual esbuild 0.28.2 synthetic builds. This is not a successful Replit run.
Full driver fixtures include the 11 helper and 20 SDK synthetic behavior
cases from R18. No actual MMHB application was executed here.

Planning estimate: 27–61 engineering hours for a working first release,
low confidence, assuming substantial existing implementation and no major
redesign. Broader library/calendar/social/provider expansion and external
waiting are excluded; revise this estimate after controlled startup.
"""
(ROOT / 'MMHB-R18A-Start.txt').write_text(start)

ledger = ROOT / 'MMHB-Readiness-Ledger-2026-09-07.md'
archive = HERE / 'r18-ledger-handoff-archive.md'
if not archive.exists(): archive.write_bytes(ledger.read_bytes())
old = archive.read_text()
history = old[old.index('## Completed and open gates'):]
lines = history.splitlines()
for i, line in enumerate(lines):
    if line.startswith('| R18 retained runtime contract |'):
        lines[i] = '| R18 retained runtime contract | STOPPED in supplied Replit output | 63 pins, 5192 source files, candidate625 and preservation match; graph validator rejected an unidentified external specifier before helper tests |'
        lines.insert(i + 1, f'| R18A graph contract correction | PREPARED; {count} local driver cases PASS | Input-only opaque externals remain explicit review items; emitted output gate retained; actual Replit execution pending |')
        break
else: raise AssertionError('R18 ledger row not found')
history = '\n'.join(lines) + '\n'
front = f"""# MyMentalHealthBuddy — working first release

Updated September 9, 2026 after the supplied **R18 output**. Scope: **MyMentalHealthBuddy.com only**. Next command: **MMHB-RUNTIME-CONTRACT-R18A.txt**. R18A is prepared and tested locally; it has not run on the user's Replit workspace.

## Current result and decision

**R18 stopped in the diagnostic graph checker.** It did not report a compiler failure, changed source, or a failed application startup. The first attempt could not find the uploaded command file and did not invoke the driver. The second attempt passed SHA256 verification and ran at `2026-09-09T08:55:31.234Z`, writing `/home/runner/workspace/.mmhb-release-evidence/r18-WfDN1S`.

The returned failure is `RETAINED_BUILD_LINKAGE / RUNTIME_EXTERNAL_SPECIFIER`. The offending value and whether it arose from an input import, output import, or inferred package name were not included in the original diagnostic. Do not claim an exact offending import from this output.

| Evidence | Current finding | Boundary |
| --- | --- | --- |
| R18 command checksum | Passed on second attempt | Exact delivered command ran |
| Source/tool/prompt pins | 63 match | R18 observation |
| Recorded source | 5,192 current and retained source files match | Recorded row set |
| Retained candidate | 625 files; recorded manifest and server hash match | Artifact identity, not running behavior |
| R17B preservation differences | 42 exact delivered review additions accounted for | Actor unknown; original failure receipt preserved |
| R18 current preservation | Stable; zero observed changes | Compared workspace and read artifacts |
| R18 graph qualification | Stopped at external-specifier validator | Exact rejected ID unknown |
| R18 package/helper/SDK checks | Not reached | Inferred from driver control flow and returned failure phase |
| App, browser, database, AI and deployment | UNPROVEN | Real acceptance still required |

The R18 synthetic-execution footer described permitted test scope; it did not prove those tests ran. R18A adds explicit attempted flags. R17B's earlier server/frontend builds, graph/reference checks and native/prompt smokes remain historical passes within their original scope. R18 did not rerun them.

## Correction and evidence

R18 used one restrictive naming rule for every external edge in both input and emitted-output metadata, and for package names inferred from input paths. An isolated reproduction with the official **esbuild 0.28.2** compiler proves that a successful build can retain a relative optional require in an input record even when it is absent from emitted output imports. The old R18 checker rejects that legitimate metadata shape. This reproduces a checker defect; the actual Replit offending entry remains unobserved. Official API reference: https://esbuild.github.io/api/#metafile and https://esbuild.github.io/api/#external.

R18A retains unrecognized but well-formed input externals as SHA256, byte count, class, import index and owner metadata. They participate in repeat-graph comparison and force `RUNTIME_CONTRACT_REVIEW_REQUIRED`. No dependency is installed, path resolved, file loaded, or reachability claim made from an opaque reference. Owner output bytes are reported as context; zero output bytes do not establish complete dynamic unreachability. Malformed imports, graph differences, changed inputs and unqualified emitted output specifiers still fail. Inferred package-name failures now have their own gate. Failure diagnostics carry safe location and identity fields without printing rejected values.

The corrected graph feeds the existing retained-source, selected-package, reviewed ws/pg helper, Resend SDK, filesystem and public-configuration checks. Current source, candidate identity, all 63 pins, output-byte linkage, repeat metadata and before/after preservation remain enforced. R18A writes a new `r18a-*` report and preserves all previous reports and artifacts.

Local validation includes **{count} complete driver integration fixtures**, **21 graph regression tests**, and **four actual-compiler synthetic metadata reproductions**. The integration fixtures run in genuine temporary Git repositories using actual reviewed dependency snippets and handwritten project evidence. They include candidate/source/pin/dependency drift, opaque input review and comparison, output-specifier diagnostics, malformed package diagnostics, concurrent-edit preservation and evidence-write failure. Their success path runs 11 helper behavior cases and 20 Resend SDK cases with synthetic transports. Test fixtures do not establish deployed app behavior. Full sources and results are in MMHB-R18A-Kit.zip.

## Run R18A

Upload only the new TXT beside MMHB's package.json, open **Replit Shell**, and run:

```bash
{run}
```

Return the complete output. Allow roughly 5–15 operator minutes. There is no direct Replit Shell connection here; the user-run result supplies the missing environment evidence. Replit AI is not needed for this step. Further authorization is not needed for this already authorized diagnostic.

## Remaining first-release work

No defensible overall completion percentage is available without an acceptance inventory. The current state is **retained build present and source stable; runtime and release acceptance open**. The previous planning range remains **27–61 engineering hours**, low confidence, assuming substantial core implementation already exists and no major redesign is needed. This is a planning allowance, not measured remaining work.

| Work | Planning hours | Required evidence |
| --- | ---: | --- |
| Runtime packaging, configuration and controlled startup | 8–18 | Real bundled entry works from the deployment layout |
| Authentication, data isolation, core flows and AI safety | 12–26 | Relevant browser/API/database acceptance |
| Mobile, accessibility, performance and launch content | 4–10 | Tested exposed pages and reviewed content |
| Recovery, CI, deployment and domain | 3–7 | Verified restore/rollback and served artifact identity |

Expansion and external waiting are excluded. Revise after R18A and the first controlled startup. Do not start the full application blindly: previously reviewed startup paths can perform schema work and background actions; qualify the current entry and configuration first.

## Three development levels

1. **Working first release:** finish runtime and acceptance, publish the defined MMHB feature set, verify the live result.
2. **Content and teaching system:** a growing source-linked library with evidence labels, plain-language explanations, examples and metaphors, reviewer workflow, presenter notes, slide/PDF exports and MMHB book/affiliate content. Keep clinical claims distinct from spiritual/philosophical material. Quantum or physics language must not imply unproven treatment powers.
3. **Editorial and integration automation:** content calendar and assistant, draft/review/post workflow, configured provider adapters and trend analytics. Verify actual connections and delivery; plugin mentions are requirements, not completed integrations.

The broader features are queued; their implementation status is not established by build or diagnostic reports. Keep other platforms separate. Use Replit AI only if a practical Shell path is unavailable.

## Reusable next ChatGPT prompt

> Continue MyMentalHealthBuddy only. Review the complete R18A output. Preserve all 63 pins, existing auth/prompt work, retained candidate and historical receipts. Distinguish input-only external review items from emitted runtime dependencies; use reported owner/hash/class evidence. State actual passes, failures and unproven behavior. Resolve the smallest demonstrated runtime blocker with a tested Shell command, SHA256 and clear steps; Replit AI is a last resort. Do not infer runtime, clinical effectiveness, integration or deployment from synthetic tests. After controlled startup, verify core exposed flows and recovery before expanding the content library, teaching exports, calendar and social automation.

"""
ledger.write_text(front + history)
(ROOT / 'MMHB-Ledger.txt').write_bytes(ledger.read_bytes())

readme = f"""# R18A verification

This is the diagnostic checker correction for R18's external-specifier failure.
Actual Replit output is pending. No application-source patch is contained here.

Build the standalone Shell command and run local regression fixtures from the
extracted kit root (Node24, Python3 and Git required):

```bash
python3 source_review/build-runtime-contract-r18a.py
node --test source_review/test-runtime-graph-policy-r18a.mjs
python3 source_review/test-r18a-driver.py
bash -n MMHB-RUNTIME-CONTRACT-R18A.txt
node --check source_review/runtime-contract-driver-r18a.mjs
```

Command SHA256: {digest}
Driver fixture count: {count}

The actual-compiler reproduction's script and provenance describe its separate
bounded download of the official esbuild0.28.2 binary into a private scratch
directory. No binary is bundled here; no application build is run by R18A.
See r18a-esbuild-reproduction-results.json and r18a-independent-analysis.md.

Original R18 sources remain for before/after reproduction; the new command uses
only its embedded R18A graph policy and unchanged reviewed helper dependencies.
Fixtures replace environment constants and artifact pins in temporary copies;
the delivered command retains the production expected values and 63 pins.
All tests are scoped evidence. Application runtime and deployment stay UNPROVEN.
"""
(HERE / 'R18A-Verification-README.md').write_text(readme)

# Reuse the exact prior source kit's explicit source set, then add this repair.
# Reports, commands and ledgers are selected explicitly; no repo is uploaded.
with zipfile.ZipFile(ROOT / 'MMHB-R18-Kit.zip') as old_zip:
    source_names = [name.split('/', 1)[1] for name in old_zip.namelist()
                    if name.startswith('MMHB-R18-Kit/source_review/')]
files = {ROOT / name for name in source_names}
files.update(HERE.glob('*r18a*'))
files.update(HERE.glob('*R18A*'))
files.update([HERE / 'r18-user-result-analysis.json', archive, command,
              ROOT / 'MMHB-R18A-Start.txt', ledger, ROOT / 'MMHB-Ledger.txt'])
record_path = HERE / 'r18a-preparation-record.json'
files.discard(record_path)
assert all(p.is_file() for p in files)
record = {'project':'MyMentalHealthBuddy','preparedOnly':True,'commandSha256':digest,
          'generatedDriverSha256':sha(HERE / 'runtime-contract-driver-r18a.mjs'),
          'localDriverCases':count,'ledgerSha256':sha(ledger),
          'files':[{'file':str(p.relative_to(ROOT)),'sha256':sha(p),'bytes':p.stat().st_size}
                   for p in sorted(files)]}
record_path.write_text(json.dumps(record, indent=2) + '\n')
files.add(record_path)
kit = ROOT / 'MMHB-R18A-Kit.zip'
with zipfile.ZipFile(kit, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in sorted(files): z.write(p, 'MMHB-R18A-Kit/' + str(p.relative_to(ROOT)))
with zipfile.ZipFile(kit) as z:
    assert len(z.namelist()) == len(files)
    for p in files: assert z.read('MMHB-R18A-Kit/' + str(p.relative_to(ROOT))) == p.read_bytes()
print(json.dumps({'commandSha256':digest,'kitSha256':sha(kit),'kitFiles':len(files),
                  'ledgerSha256':sha(ledger),'driverCases':count}))
