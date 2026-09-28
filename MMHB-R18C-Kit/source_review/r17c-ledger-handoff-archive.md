# MyMentalHealthBuddy — working first release

Updated September 9, 2026 after the supplied **R17B text output**. Scope: **MyMentalHealthBuddy only**. Current handoff: **MMHB-PRESERVATION-INSPECT-R17C.txt**. The full ledger is also available as **MMHB-Ledger.txt**, with a copy in **MMHB-R17C-Kit.zip**. No ledger download is required to run the command.

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

**Local qualification:** 22 workflow cases pass with the actual R17C driver. Tests first create an R17B failure containing exactly 42 differences using synthetic compiler/native packages and the actual prompt loader. Cases cover all 42 records, deletion versus ignore membership, sensitive-name redaction, current source/pin/candidate/dependency drift, missing temporary copy, symlink rejection, malformed identities/snapshots, unreadable current-snapshot coverage, package-row linkage and concurrent edits. Subprocess instrumentation permits only synchronous read-only Git calls. All three embedded helper hashes, the 63 unchanged pins and Bash/Node syntax are checked. This is local diagnostic qualification, not execution against the user's real Replit files.

**Release status: blocked.** Resolve the 42-record preservation finding first, then runtime packaging/configuration/startup, actual auth/session/data-isolation/core-user-flow/AI acceptance, recovery and deployed identity. Historical R11A preservation remains unresolved. Features exposed at launch must pass applicable acceptance checks or have an explicitly qualified restriction at both UI and API entry points. An overall completion percentage is not supported by a complete acceptance inventory.

**Planning estimate:** retain **27–61 engineering hours**, low confidence, for a first working release assuming substantial core features already exist and no major redesign is required. This excludes expanded content/library/calendar/social/provider work and external review/waiting. Re-estimate after the 42 changes and runtime scope are known. Allow approximately **5–15 operator minutes** for upload and the diagnostic; full-tree hashing depends on storage and file count.

No direct Replit Shell is connected here. Existing authorization covers this handoff. Upload **MMHB-PRESERVATION-INSPECT-R17C.txt** beside MMHB's package.json, open **Shell**, and run:

```bash
cd /home/runner/workspace &&
printf '%s\n' '244214493d285410fbf04c2410a8495b8c961c55634a67b98fc7e3409e2dd214  MMHB-PRESERVATION-INSPECT-R17C.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-PRESERVATION-INSPECT-R17C.txt
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

