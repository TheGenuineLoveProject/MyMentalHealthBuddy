"""Package the final, locally qualified R17C handoff and preserve ledger history."""
from pathlib import Path
import base64, hashlib, json, re, subprocess, zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sha = lambda b: hashlib.sha256(b).hexdigest()
command = ROOT / 'MMHB-PRESERVATION-INSPECT-R17C.txt'
command_sha = sha(command.read_bytes())
tests = json.loads((HERE / 'r17c-diagnostic-fixture-results.json').read_text())
assert tests['status'] == 'PASS' and tests['checks'] >= 20
assert all(r['result'] == 'PASS' for r in tests['results'])
driver = (HERE / 'preservation-diagnostic-driver-r17c.mjs').read_text()
helpers = json.loads(re.search(r'const HELPERS = (\{[^\n]+\});', driver).group(1))
assert len(helpers) == 3
for helper in helpers.values():
    assert sha(base64.b64decode(helper['b64'])) == helper['sha256']
prefix = (HERE / 'fresh-candidate-prefix-r17.mjs').read_text()
for name, count in [('PINS', 41), ('ASSET_PINS', 22)]:
    pattern = r'const ' + name + r' = (\{.*?\n\});'
    a = json.loads(re.search(pattern, prefix, re.S).group(1))
    b = json.loads(re.search(pattern, driver, re.S).group(1))
    assert a == b and len(b) == count
subprocess.run(['bash', '-n', str(command)], check=True)
subprocess.run(['node', '--check', str(HERE / 'preservation-diagnostic-driver-r17c.mjs')], check=True)
subprocess.run(['node', '--check', str(HERE / 'preservation-snapshot-policy-r17c.mjs')], check=True)
run = f"""cd /home/runner/workspace &&
printf '%s\\n' '{command_sha}  {command.name}' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc {command.name}"""

observation = {
    'project': 'MyMentalHealthBuddy', 'source': 'USER_SUPPLIED_R17B_TEXT; SELECTED_FIELDS_ONLY',
    'utc': '2026-09-09T07:14:41.344Z', 'report': '/home/runner/workspace/.mmhb-release-evidence/r17b-q6rzGy',
    'commandSha256': 'c39f7e0581d740152ecab4adc8e0f3cdf193199fd6fac9112640882783cb5207',
    'status': 'FRESH_CANDIDATE_FAILED', 'releaseReady': False,
    'failure': {'phase': 'FINAL_PRESERVATION', 'gate': 'WORKTREE_PRESERVATION'},
    'preservationStatus': 'FAILED', 'changedFileCount': 42,
    'server': {'sha256': 'd103e3532fe45af0d270c777310334a4672338fc2345660287033e9ecf98d2c7', 'inputCount': 1277, 'compilerInvocations': 2},
    'frontend': {'files': 554, 'bytes': 33758149, 'localReferences': 2968, 'externalReferences': 0,
        'manifestSha256': '1c3777d1fc93595a7e3ec2c93b35692b1ee324e4cffd3a27cd7c7086f49e6f78'},
    'graph': {'status': 'REPORTED_GRAPH_INPUTS_VERIFIED', 'issueCount': 0, 'moduleIds': 3158,
        'physicalFiles': 3142, 'virtualModuleIds': 13, 'viteOptionalPeerModules': 1,
        'watchCoverage': 'API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE',
        'observedOptionalPeer': '__vite-optional-peer-dep:@emotion/is-prop-valid:framer-motion', 'consumerRuntime': 'UNQUALIFIED'},
    'candidate': {'files': 625, 'bytes': 40486374,
        'manifestSha256': 'cb4c9c57fce1124f453110eb713d86b0f32855436df1030427cc32c2a2df0320'},
    'nativeStatus': 'NATIVE_CANDIDATE_SMOKE_PASS', 'promptStatus': 'PROMPT_ASSET_LOAD_PASS', 'moduleLoads': 18,
    'processes': [{'name': n, 'exitCode': 0, 'durationMs': ms} for n, ms in [
        ('server-build', 655), ('frontend-build', 20176), ('server-syntax', 128), ('native-bcrypt', 159), ('prompt-assets', 76)]],
    'missingCandidateExternalPackages': ['@react-email/render', 'bufferutil', 'pg-cloudflare', 'pg-native', 'utf-8-validate'],
    'externalRuntimeQualification': 'UNQUALIFIED', 'buildInputRetention': 'REQUIRES_REVALIDATION',
    'applicationRuntime': 'UNPROVEN', 'deployedArtifact': 'UNPROVEN',
    'limits': ['Full 42 change records were not included in supplied terminal summary.',
        'Pasted CSS filenames have formatting artifacts and are not used as exact identifiers.',
        'This is a selected transcription, not the original Replit evidence file or a new execution.']}
(HERE / 'r17b-user-result-observation.json').write_text(json.dumps(observation, indent=2) + '\n')

new_top = f"""# MyMentalHealthBuddy — working first release

Updated September 9, 2026 after the supplied **R17B text output**. Scope: **MyMentalHealthBuddy only**. Current handoff: **{command.name}**. The full ledger is also available as **MMHB-Ledger.txt**, with a copy in **MMHB-R17C-Kit.zip**. No ledger download is required to run the command.

## Current decision

**R17B built the candidate and passed the listed smoke checks, then failed its final workspace preservation check.** The result remains `FRESH_CANDIDATE_FAILED`, `releaseReady: false`, `preservationStatus: FAILED`, `changedFileCount: 42`, phase `FINAL_PRESERVATION`, gate `WORKTREE_PRESERVATION`. Report: `/home/runner/workspace/.mmhb-release-evidence/r17b-q6rzGy`; start `2026-09-09T07:14:41.344Z`. The supplied command checksum matched.

| Latest Replit observation | Result and boundary |
|---|---|
| Server compiler process | Exit 0; 1,277 inputs; two same-machine bundles match |
| Frontend compiler and references | Exit 0; 554 files, 33,758,149 bytes; 2,968 local references |
| Reported module graph | 3,158 IDs; zero reported issues; watch-path coverage unavailable |
| Candidate assembly | 625 files, 40,486,374 bytes; manifest recorded |
| Copied native bcrypt smoke | PASS using synthetic credentials |
| Prompt assets | PASS; 18 loader calls |
| Final workspace preservation | FAILED; 42 different snapshot records |
| Application, browser, database, deployed release | UNPROVEN |

The graph reports one Vite optional-peer placeholder for `@emotion/is-prop-valid` consumed by framer-motion. Its classification passed; the consumer's runtime behavior is still unqualified. Missing candidate externals include `@react-email/render`, `bufferutil`, `pg-cloudflare`, `pg-native`, and `utf-8-validate`. Their presence in the external list does not establish whether each path will execute. Node built-ins do not require installing packages. No blind installation of these names is prescribed.

**Code-derived finding:** R17B's final `compareInputs()` precedes the failed workspace gate, so its selected source/pin, retained dependency, copied-input and frontend rechecks completed before the reported failure. That narrows the investigation; it does not identify the writer of the 42 changes or prove them harmless. `SOURCE_EDIT=0` records the script's intended action scope and cannot override the observed differences.

**Why inspect:** a snapshot difference can represent file bytes, mode, type, resolved location or which paths Git enumerated. Git's cached/other/exclude options select the observed path set; changing that set is not automatically a deletion. The old summary stored only the first 40 differences although its count was 42. The saved before/after snapshots contain the records needed to reconstruct all 42. References: [git-ls-files](https://git-scm.com/docs/git-ls-files) and [git-check-ignore](https://git-scm.com/docs/git-check-ignore).

**Prepared R17C:** reads those saved snapshots, validates their schema and internal digests, reconstructs every difference, then reports current tracked/ignore/path state and whether the file belongs to the pinned or recorded source set. It separately reports changes since R17B. It rechecks the 625-file candidate, frontend output, server hash, recorded source rows, all **41 source/tool pins and 22 prompt-asset pins**, retained build inputs and R16E dependencies. It does not need the old temporary compiler copy. Existing evidence and application files are read; only a new diagnostic report is written.

Current drift is reported for review rather than silently repaired. A failed current snapshot does not suppress valid historical records; its current-worktree coverage is explicitly unqualified. Malformed historical snapshots stop with a failure. Retained artifact inspection failures remain visible by section. The final observation checks report detected changes during the diagnostic. Matching current files cannot retroactively change historical R17B preservation to PASS or identify who changed a file.

**Local qualification:** {tests['checks']} workflow cases pass with the actual R17C driver. Tests first create an R17B failure containing exactly 42 differences using synthetic compiler/native packages and the actual prompt loader. Cases cover all 42 records, deletion versus ignore membership, sensitive-name redaction, current source/pin/candidate/dependency drift, missing temporary copy, symlink rejection, malformed identities/snapshots, unreadable current-snapshot coverage, package-row linkage and concurrent edits. Subprocess instrumentation permits only synchronous read-only Git calls. All three embedded helper hashes, the 63 unchanged pins and Bash/Node syntax are checked. This is local diagnostic qualification, not execution against the user's real Replit files.

**Release status: blocked.** Resolve the 42-record preservation finding first, then runtime packaging/configuration/startup, actual auth/session/data-isolation/core-user-flow/AI acceptance, recovery and deployed identity. Historical R11A preservation remains unresolved. Features exposed at launch must pass applicable acceptance checks or have an explicitly qualified restriction at both UI and API entry points. An overall completion percentage is not supported by a complete acceptance inventory.

**Planning estimate:** retain **27–61 engineering hours**, low confidence, for a first working release assuming substantial core features already exist and no major redesign is required. This excludes expanded content/library/calendar/social/provider work and external review/waiting. Re-estimate after the 42 changes and runtime scope are known. Allow approximately **5–15 operator minutes** for upload and the diagnostic; full-tree hashing depends on storage and file count.

No direct Replit Shell is connected here. Existing authorization covers this handoff. Upload **{command.name}** beside MMHB's package.json, open **Shell**, and run:

```bash
{run}
```

The expected completed inspection status is:

```text
STATUS=PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED
```

That status means the inspection completed; inspect its findings and per-section errors. It is not preservation approval or release readiness. Return the complete output from `COMMAND_ID` through `NEXT_ACTION`. No rebuild, npm install, Replit AI, app/database start, source repair, credential change, Git write or deployment is requested. Metadata and hashes are printed, not file bodies or environment values. Hash comparison is not independent provenance authentication, an editor lock, complete ignored-file coverage or an off-host backup.

## Expansion sequence after the first working release

1. **Publishable core:** qualify actual exposed MMHB journeys, access/data boundaries, necessary AI behavior, content availability and recovery/deployment operation.
2. **Content operation:** grow a source-linked mental-health library with evidence labels and review dates, editorial calendar and draft/approval states, original teaching examples/metaphors, accessible visuals, PPT/PDF exports, and disclosed book/affiliate links. Distinguish clinical education from spiritual/philosophical perspectives. Physics and quantum metaphors are not evidence of treatment effectiveness.
3. **Controlled integrations:** add the needed authorized providers, scheduled content workflows, social analytics and trend comparisons using accessible data. Set budgets and durable regression gates. Requested plugins are queued capabilities, not completed integrations. This step sends no email or social content.

## Reusable next ChatGPT prompt

```text
Continue MyMentalHealthBuddy only from the attached R17C result and ledger.
Classify every one of the 42 historical differences, separately from changes
since R17B and changes during R17C. Distinguish bytes, metadata, Git membership,
missing files, source scope and artifact integrity. Use actual paths/identities;
do not infer who wrote them. Keep historical failure and current validation
separate. Resolve the next evidenced blocker with the smallest tested Shell
change while preserving existing edits. Reuse qualified retained outputs and
dependencies. No automatic Git restore, broad ignore rule, blind install or
rebuild to conceal the finding. Replit AI remains a last resort. Provide exact
command, checksum, run steps, evidence boundaries and updated effort estimate.
Do not declare application or release success from build-only evidence.
```

"""
ledger = ROOT / 'MMHB-Readiness-Ledger-2026-09-07.md'
old = ledger.read_text()
archive_file = HERE / 'r17b-ledger-handoff-archive.md'
if not archive_file.exists():
    archive_file.write_text(old.split('## Completed and open gates\n', 1)[0])
rest = old.split('## Completed and open gates\n', 1)[1]
old_row = '| R17B fresh candidate with retained inputs | PREPARED; 22 local checks PASS | Reuses R16E, retains snapshot and new output hashes, compiles a separate copy, graph/native/prompt qualification pending on Replit |'
new_row = '| R17B fresh candidate with retained inputs | Builds, graph and native/prompt smokes PASS; final preservation FAILED | 625 candidate files; 18 prompt loads; 42 workspace snapshot differences; application/deployment UNPROVEN |'
rest = rest.replace(old_row, new_row)
new_gate = f'| R17C preservation diagnostic | PREPARED; {tests["checks"]} local cases PASS | Reconstructs all 42 changes and rechecks current artifacts; actual Replit diagnostic pending |'
if '| R17C preservation diagnostic |' not in rest:
    rest = rest.replace(new_row, new_row + '\n' + new_gate)
archive_heading = '## Archived R17B preparation handoff — superseded by the actual result above'
if archive_heading not in rest:
    rest += '\n\n' + archive_heading + '\n\n' + archive_file.read_text()
ledger.write_text(new_top + '## Completed and open gates\n' + rest)
(ROOT / 'MMHB-Ledger.txt').write_bytes(ledger.read_bytes())

start = f"""MyMentalHealthBuddy — R17C next step

R17B passed its builds, graph review, native bcrypt smoke and all 18 prompt loads.
Its final preservation check failed with 42 different snapshot records.
Application operation and publication remain unverified.

1. Download {command.name}.
2. Upload it beside package.json in the existing MyMentalHealthBuddy Replit project.
3. Open Shell and paste the entire block below. Replit AI is not needed.

{run}

4. Allow approximately 5–15 operator minutes; hashing time varies.
5. Return all output from COMMAND_ID through NEXT_ACTION.

Expected completed inspection:
STATUS=PRESERVATION_DIAGNOSTIC_COMPLETE_REVIEW_REQUIRED

This is diagnostic completion, not release approval. Findings and per-section
inspection failures remain review items. The command prints all 42 historical
differences and current file/artifact metadata. It performs no repair, build,
installation, application/database start or deployment. A new report is saved.

Local qualification: {tests['checks']} workflow cases pass using synthetic project fixtures
and the actual diagnostic driver. Real Replit execution is pending.

Ledger fallback: MMHB-Ledger.txt or its copy in MMHB-R17C-Kit.zip.
The ledger download is optional for running the command.

First-release estimate: 27–61 engineering hours, low confidence, assuming core
features largely exist. Broader library/calendar/social integrations and
external review/waiting are additional. Re-estimate after change classification.
"""
(ROOT / 'MMHB-R17C-Start.txt').write_text(start)
readme = f"""# R17C preservation diagnostic qualification

Command SHA-256: `{command_sha}`.

## Reproduction

From the extracted kit root, with Python 3, Node 24 and Git available:

```bash
python source_review/build-preservation-diagnostic-r17c.py
python source_review/test-r17c.py
```

The tests adapt only workspace/runtime identity constants and fixture hashes;
they execute the actual diagnostic. The seed executes real R17B control flow
with synthetic compiler/native packages and the actual prompt loader. Test
fixtures deliberately create exactly 42 historical differences, including two
beyond the prior report's 40-record summary limit. Test mutations are confined
to disposable synthetic fixtures. The diagnostic never restores them.

Qualification result: **{tests['checks']} workflow cases PASS**. Details are in
`r17c-diagnostic-fixture-results.json`. Real Replit R17C has not run here.

Independent review produced and resolved five findings: tolerate a failed current
snapshot without losing historical evidence; enforce exact retained package rows
and stage package identity; reject unknown identity fields; redact unfamiliar
recorded graph/package metadata; repeat observed retained-file identities.

The prior build/runtime source and tests are included for reproducibility. Their
older statuses are historical. Only the root R17C command is the current handoff.
Git enumeration semantics were checked against official documentation:
https://git-scm.com/docs/git-ls-files
https://git-scm.com/docs/git-check-ignore

Scope: metadata diagnostics. No assertion of actor attribution, restored
historical preservation, full ignored-file inventory, independent provenance,
application/database/browser/clinical behavior, backup or deployment success.
"""
(HERE / 'R17C-Verification-README.md').write_text(readme)
record = {'command': command.name, 'commandSha256': command_sha, 'localWorkflowChecks': tests['checks'],
          'embeddedHelperHashesVerified': 3, 'unchangedSourceToolPins': 41, 'unchangedPromptPins': 22,
          'bashSyntax': 'PASS', 'nodeSyntax': 'PASS', 'realReplitExecution': 'PENDING',
          'runtimeQualification': 'UNPROVEN', 'releaseReady': False}
(HERE / 'r17c-preparation-record.json').write_text(json.dumps(record, indent=2) + '\n')
with zipfile.ZipFile(ROOT / 'MMHB-R17B-Kit.zip') as old_zip:
    entries = {name: old_zip.read(name) for name in old_zip.namelist() if name.startswith('source_review/')}
for p in HERE.iterdir():
    if p.is_file() and ('r17c' in p.name.lower() or p.name == 'r17b-user-result-observation.json'):
        entries['source_review/' + p.name] = p.read_bytes()
for name in [command.name, 'MMHB-R17C-Start.txt', ledger.name, 'MMHB-Ledger.txt']:
    entries[name] = (ROOT / name).read_bytes()
kit = ROOT / 'MMHB-R17C-Kit.zip'
with zipfile.ZipFile(kit, 'w', zipfile.ZIP_DEFLATED) as z:
    for name, data in sorted(entries.items()):
        z.writestr(name, data)
with zipfile.ZipFile(kit) as z:
    assert z.testzip() is None
    assert sha(z.read(command.name)) == command_sha
print(json.dumps({'checks': tests['checks'], 'kitEntries': len(entries), 'files': [
    {'file': p.name, 'bytes': p.stat().st_size, 'sha256': sha(p.read_bytes())}
    for p in [command, ROOT / 'MMHB-R17C-Start.txt', ledger, ROOT / 'MMHB-Ledger.txt', kit]]}, indent=2))
