from pathlib import Path
import hashlib,json,zipfile

ROOT=Path(__file__).resolve().parent.parent
HERE=ROOT/'source_review'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
command=ROOT/'MMHB-RUNTIME-CONTRACT-R18.txt'
digest=sha(command)
run=f"""cd /home/runner/workspace &&
printf '%s\\n' '{digest}  MMHB-RUNTIME-CONTRACT-R18.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RUNTIME-CONTRACT-R18.txt"""
tests=json.loads((HERE/'r18-driver-fixture-results.json').read_text())
assert tests['status']=='PASS'
assert tests['generatedDriverSha256']==sha(HERE/'runtime-contract-driver-r18.mjs')
count=tests['fixtureCount']
start=f"""MyMentalHealthBuddy — R18 next step

R17C result reviewed: all 42 historical source_review additions match the
previously delivered R17B kit. The 97 later differences also match delivered
R17C materials. The writer remains unknown; the original R17B failed receipt
is preserved. All 63 pins, 5,192 recorded source files, 625 candidate files,
and 82,136 retained input rows matched in your supplied R17C output.

1. Download MMHB-RUNTIME-CONTRACT-R18.txt.
2. Upload ONLY that TXT into MyMentalHealthBuddy's Replit workspace, beside
   package.json. Keep the optional source ZIP and ledger on your computer.
3. Open Replit Shell. Paste this exact command (no Replit AI required):

{run}

4. Let it finish before editing or uploading more files. Paste the complete
   output back into this ChatGPT conversation, including STATUS and report path.

What it does: reuses the retained R17B candidate; accounts for the exact42
review additions; checks current source/pins; joins saved compiler metadata
to retained bytes; checks selected packages and runtime assets; runs reviewed
WebSocket/PostgreSQL helpers and Resend SDK branches with synthetic transports.
Full evidence is saved in a new private r18 report directory.

It does not rebuild, install packages, modify source, start the application,
connect to a database, send email, call AI, commit, push, or deploy.
The Node VM flag enables only these reviewed synthetic tests. No unknown
dependency source is evaluated, and no environment values are printed.

Result meanings:
RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE = listed checks passed;
the application and deployed release are still unproven.
RUNTIME_CONTRACT_REVIEW_REQUIRED = collection finished, but selected bytes or
package metadata need review. Return output; no blind package installation.
RUNTIME_CONTRACT_FAILED = a prerequisite/test/preservation check failed.
Return output so the exact failed gate can be addressed.

Local verification: {count} driver fixtures; 13 graph-policy tests; 8 helper
tests (11 synthetic behavior cases/116 assertions); 20 Resend branch cases,
3 source/type refusals and missing-VM-flag refusal. Bash/Node syntax checked.
Fixtures use a genuine temporary Git repository and synthetic project/build
records; this is not a run against your live Replit application.

Release state: build and retained-candidate integrity qualified within their
reported scopes; runtime, user flows and deployment remain unproven.
Planning range: 27–61 engineering hours for a first working release, low
confidence and assuming substantial core features already exist. Expansion
of the library/calendar/social/provider features and external waiting are
excluded. Allow roughly 5–15 minutes for your upload/run/return step.
"""
(ROOT/'MMHB-R18-Start.txt').write_text(start)
ledger=ROOT/'MMHB-Readiness-Ledger-2026-09-07.md'
archive=HERE/'r17c-ledger-handoff-archive.md'
if not archive.exists():
    old=ledger.read_text();boundary=old.index('## Completed and open gates')
    archive.write_text(old[:boundary]);(HERE/'r18-ledger-retained-history.md').write_text(old[boundary:])
history=(HERE/'r18-ledger-retained-history.md').read_text()
history=history.replace('| R17C preservation diagnostic | PREPARED; 22 local cases PASS | Reconstructs all 42 changes and rechecks current artifacts; actual Replit diagnostic pending |',
    '| R17C preservation diagnostic | COMPLETE in supplied Replit output; exact42 review-material differences accounted for | All63 pins,5192 source files,candidate625 and82136 input rows match; diagnostic stable; historicalR17B failure retained |\n'
    f'| R18 retained runtime contract | PREPARED; {count} local driver cases PASS | Exact source/metafile linkage plus reviewed synthetic helper/SDK tests; actual Replit execution pending |')
front=f"""# MyMentalHealthBuddy — working first release

Updated September 9, 2026 after the supplied **R17C output**. Scope: **MyMentalHealthBuddy.com only**. Next command: **MMHB-RUNTIME-CONTRACT-R18.txt**. Replit AI is not needed for this step. R18 has been prepared and tested here; it has not run in the user's Replit workspace.

## Current decision

**The 42 preservation differences are accounted for as exact delivered review-file additions.** The source and candidate findings support moving to runtime dependency qualification. No application-source restoration or new build is indicated by these differences.

R17C report: `/home/runner/workspace/.mmhb-release-evidence/r17c-tn3PWG`, UTC `2026-09-09T08:20:09.797Z`, status `PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED`, issues `[]`. The supplied R17C command checksum matched. The raw report is not locally available; this analysis uses the user-pasted report and retained delivered ZIP bytes. Names, hashes and byte counts were transcribed and compared, with Markdown underscore escapes normalized.

| Observed or reviewed item | Result | Evidence boundary |
| --- | --- | --- |
| Historical42 differences | 42/42 match R17B kit by path, SHA256 and bytes | All added under source_review; untracked, unignored, outside pins/source copy; actor unknown |
| Later97 differences | 86 nested R17C kit files +10 root review additions +1 updated ledger | Exact delivered-content correspondence; creation/extraction actor not established |
| Current source/tool and prompt pins | 63/63 match | R17C observation |
| Recorded source | 5192 files; zero changes | Recorded row set only |
| Candidate | 625 files;40,486,374 bytes; manifest matches | Current artifact bytes, not running application |
| Retained build input inventory | 82,136 rows match | Current recheck; no historical compiler temp needed |
| R17C preservation | Stable;zero differences | Before/after observation, not a concurrent-editor lock |
| Original R17B receipt | Remains FRESH_CANDIDATE_FAILED | Historical workspace gate is not rewritten |
| Application/browser/database/AI/deployment | UNPROVEN | Requires real runtime and feature acceptance |

Candidate SHA256: `cb4c9c57fce1124f453110eb713d86b0f32855436df1030427cc32c2a2df0320`. Frontend SHA256: `1c3777d1fc93595a7e3ec2c93b35692b1ee324e4cffd3a27cd7c7086f49e6f78`. Server SHA256: `d103e3532fe45af0d270c777310334a4672338fc2345660287033e9ecf98d2c7`.

## R18 implementation and qualification

R18 checks the known R17C classification, establishes a new current baseline, preserves the63 pins, rechecks recorded workspace/retained source and candidate, and interprets both saved esbuild metafiles using the historical compiler working directory. It verifies actual retained input hashes, compares repeat graphs, and ties output bytes/input count/external lists to the existing bundle receipt. It reports selected package metadata, exact source matches, direct package importers and external import owners. Static compiler membership remains distinct from runtime reachability. See [esbuild metadata](https://esbuild.github.io/api/#metafile).

The published Resend6.22.1 archive was retrieved from the official npm registry without installation. Its SHA512 and SHA1 matched registry metadata; ESM/CJS sources and MIT license were retained. Exact renderer code review covers **emails.send, batch.send, broadcasts.create, broadcasts.update and templates.create**. These paths render for truthy React payloads. Missing renderer errors block their transport; HTML/text branches avoid that renderer in the reviewed implementation. This is source/fixture evidence, not proof that all application callers meet those conditions. The [Resend API](https://resend.com/docs/api-reference/emails/send-email) documents HTML/text/React inputs; exact version evidence is included in the source kit.

Reviewed ws helpers have caught optional-addon paths; pg transport selection is conditional. R18 runs **11 helper behavior cases/116 assertions**, including valid/invalid UTF8 and fake Node/Cloudflare transports, plus **20 Resend branch cases**. Only exact reviewed bytes execute. SDK dependencies and transports are inert fixtures. These tests make no real network/email/database/AI calls. Resend uses its reviewed CJS entry for the synthetic test; the saved build's emitted ESM behavior remains to be exercised. [Node VM documentation](https://nodejs.org/api/vm.html) explains the API and that VM is not an OS security boundary.

Local verification: **{count} complete driver fixtures**,13 graph-policy tests,8 helper tests,20 SDK branches,3 invalid-source/type refusals and the missing-VM-flag refusal; Bash/Node syntax. Fixtures use genuine temporary Git repositories and synthetic project/build metadata, with the actual reviewed dependency source bytes. Replit Node24.13.0 is required by the handoff; local fixture runtime is Node24.19.0. Application behavior is not inferred from those tests. Source/test ZIP contains exact code, provenance and results.

The command writes only a new private diagnostic directory. It does not change current source, root manifests, active dependencies, old evidence, Git state or deployment. It does not run the full application, compiler, package manager, prompt loader or native binding. Current Shell flags are reported as booleans; public configuration values are not exposed or forwarded. Input or source differences are reported or stop the appropriate gate. A new build is not requested.

## Next action

Download and upload **only MMHB-RUNTIME-CONTRACT-R18.txt** beside MMHB's package.json. Keep the optional ZIP/ledger on your computer. Open **Replit Shell** and run:

```bash
{run}
```

Let the command finish before editing/uploading more files. Return its complete output. No further authorization statement is required. No direct Replit Shell is connected here; the user-run output is the missing environment evidence.

`RETAINED_RUNTIME_CONTRACT_CHECKS_PASS_NOT_RELEASE` qualifies only the listed checks. `RUNTIME_CONTRACT_REVIEW_REQUIRED` means evidence was collected but selected bytes/metadata need review. `RUNTIME_CONTRACT_FAILED` identifies a failed prerequisite, test or preservation gate. All retain `releaseReady:false` and application/deployment `UNPROVEN`.

## Remaining first-release work and estimates

There is no defensible overall completion percentage without a complete acceptance inventory. Current state is **build/artifact qualification completed within scope; runtime/release acceptance open**. Planning estimate remains **27–61 engineering hours**, low confidence, assuming substantial core implementation exists and no major redesign is required. These are planning allowances, not measured remaining work:

| Work | Planning hours | Completion evidence |
| --- | ---: | --- |
| Runtime packaging/configuration/startup | 8–18 | Exact bundled entry works from deployed layout; required dependencies/assets/config verified |
| Auth/data isolation/core flows/AI safety | 12–26 | Real request/browser/database acceptance of exposed features |
| Mobile/accessibility/performance/content review | 4–10 | Relevant launch pages and content pass reviewed acceptance |
| Recovery/CI/deployment/domain verification | 3–7 | Restore/rollback proven; served artifact matches qualified release |

This excludes external review/waiting and expansion scope. Re-estimate after R18 and the first controlled startup. The public-domain fetch on September9 returned a page title, with no inspectable body through the search tool; this does not verify deployment health or link it to the candidate.

## Three development levels

1. **Working first release:** finish runtime and acceptance gates, publish the defined MMHB feature set, and verify the live result.
2. **Content and teaching system:** source-linked mental-health library with evidence labels, clinical review where appropriate, plain-language explanations/examples/metaphors, presenter notes, slide/PDF exports, book/affiliate content and MMHB branding. Distinguish research-supported care from spiritual/philosophical material and speculative claims. Physics/quantum language must not become unsupported treatment claims.
3. **Editorial and integration automation:** calendar/assistant, drafts and review stages, daily content workflow, authorized social scheduling, provider adapters and trend analytics. Measure useful audience outcomes and operating costs. Each actual provider connection needs configuration, tests and deployment evidence; mentioning a plugin does not integrate it into the app.

These levels are queued requirements, not implemented features certified by R18. Existing authorization supports necessary bounded engineering; outgoing messages/posts and high-impact production actions require concrete scope. Replit Shell remains the preferred execution path and Replit AI remains a last resort.

## Reusable next ChatGPT prompt

> Continue MyMentalHealthBuddy only. Review the attached complete R18 output. R17C accounted for42 exact review-material additions; preserve the originalR17B failed receipt. Reuse the retained candidate and input tree. State which checks actually passed, what remains unproven, and the single next bounded runtime requirement. Preserve the63 pins and existing auth/prompt repairs. Provide the smallest tested Shell command with SHA256 and clear steps; Replit AI only if a Shell solution is unavailable. Do not infer full runtime, clinical effectiveness, delivery, deployment or overall completion from static graphs or synthetic tests. After runtime succeeds, verify exposed user flows, privacy/auth/AI behavior, recovery and live artifact identity before expanding content/calendar/social integrations.

"""
ledger.write_text(front+history+'\n\n## Superseded R17C preparation handoff — archived\n\n'+archive.read_text())
(ROOT/'MMHB-Ledger.txt').write_bytes(ledger.read_bytes())
readme=f"""# R18 verification archive

Prepared for MyMentalHealthBuddy only. The executable handoff has SHA256 `{digest}`.
Upload only the standalone command TXT to Replit; this archive is for review and reproduction.

Driver integration cases: {count}. Supporting checks:13 graph tests,8 helper tests,
11 helper behavior cases/116 assertions,20 SDK branch cases plus hash/type/flag refusals.
All are local fixtures. Real Replit runtime is not qualified.

To reproduce from the extracted kit root with Node24/Python3/Git available:

```bash
python3 source_review/build-runtime-contract-r18.py
node --test source_review/test-runtime-graph-policy-r18.mjs
node --test source_review/test-r18-runtime-helper-smoke.mjs
node --experimental-vm-modules source_review/test-r18-resend-smoke.mjs
node source_review/test-r18-resend-smoke.mjs --without-vm-flag
python3 source_review/test-r18-driver.py
bash -n MMHB-RUNTIME-CONTRACT-R18.txt
node --check source_review/runtime-contract-driver-r18.mjs
```

Fixtures replace environment-specific constants only inside temporary generated
copies. Production command pins remain unchanged. Third-party reviewed files
carry MIT notices and provenance in the archive. The R17C classification JSON
uses user-pasted observations, not a locally retrieved raw Replit report.
"""
(HERE/'R18-Verification-README.md').write_text(readme)
# Explicit reusable dependency/source set; no workspace inventory is uploaded.
files=set(HERE.glob('*r18*'))
files.update(HERE.glob('*R18*'))
for name in ['fresh-candidate-prefix-r17.mjs','fresh-build-policy-r17.mjs','preservation-snapshot-policy-r17c.mjs',
             'runtime-contract-analysis-r14.mjs','r14-external-reviewed-mapping.json','r14-assets-runtime-mapping.json',
             'r14-external-review.md','r15-dependency-review.json','r15-pg-8.23.0-native-client.js',
             'r17c-user-result-analysis.json','r17c-ledger-handoff-archive.md']:
    files.add(HERE/name)
for item in json.loads((HERE/'r14-external-reviewed-mapping.json').read_text())['sources']:
    files.add(ROOT/item['localSource'])
byHash={sha(p):p for p in HERE.iterdir() if p.is_file()}
for item in json.loads((HERE/'r14-assets-runtime-mapping.json').read_text())['consumerPins']:
    files.add(byHash[item['sha256']])
files.update([command,ROOT/'MMHB-R18-Start.txt',ledger,ROOT/'MMHB-Ledger.txt'])
files={p for p in files if p.is_file()}
record={'project':'MyMentalHealthBuddy','preparedOnly':True,'commandSha256':digest,'localDriverCases':count,
        'ledgerSha256':sha(ledger),'files':[{'file':str(p.relative_to(ROOT)),'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(files)]}
recordPath=HERE/'r18-preparation-record.json';recordPath.write_text(json.dumps(record,indent=2)+'\n');files.add(recordPath)
kit=ROOT/'MMHB-R18-Kit.zip'
with zipfile.ZipFile(kit,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(files):z.write(p,'MMHB-R18-Kit/'+str(p.relative_to(ROOT)))
with zipfile.ZipFile(kit) as z:
    assert len(z.namelist())==len(files)
    for p in files: assert z.read('MMHB-R18-Kit/'+str(p.relative_to(ROOT)))==p.read_bytes()
print(json.dumps({'commandSha256':digest,'kitSha256':sha(kit),'kitFiles':len(files),'ledgerSha256':sha(ledger),'driverCases':count}))
