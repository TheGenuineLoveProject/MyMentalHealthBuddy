# R17B preparation and verification

Command: `MMHB-REBUILD-CANDIDATE-R17B.txt`; SHA-256 `c39f7e0581d740152ecab4adc8e0f3cdf193199fd6fac9112640882783cb5207`.

Issue BUILD-INPUT-RETENTION-001. User R17A result: R17_BUILD_COPY_MISSING,
RETAINED_R17 phase; source/R16E preflight passed; no subprocesses; partial
preservation. See r17a-user-result-observation.json for normalized supplied facts.

R17B creates a project-retained snapshot and a separate equal-input `/tmp`
compiler tree. This preserves R17's compile ancestry: compiling inside ignored
evidence could alter Node fallback resolution and Tailwind automatic scanning.
See r17b-upstream-tailwind-scanner-provenance.json and its exact tagged source
plus MIT license. This is source-informed avoidance of a risk, not a measured
Tailwind failure. Vite/Rolldown source/contract basis is preserved from R17A.

Changes relative to R17: corrected unchanged R17A graph policy; new r17b worker
scope; direct frontend tool path checks; retained + temporary copy hashes and
identities; combined disk requirement if devices match; full frontend output
manifest saved before graph checking; final input/output checks on failures;
bounded graph diagnostics; explicit runtime external-requirement report.
The native helper changes only the owned report-prefix regex. All 41 original
source/tool pins, 22 asset pins, R16E policies and prompt runner are unchanged.

## Reproduce local fixture qualification

```bash
python3 source_review/build-fresh-candidate-command-r17b.py
node --check source_review/fresh-candidate-driver-r17b.mjs
bash -n MMHB-REBUILD-CANDIDATE-R17B.txt
python3 source_review/test-fresh-candidate-r17b.py
```

These commands are for the included preparation kit, not additional Replit
instructions. Local result: 22 checks pass (19 workflows and three worker boundary checks). The test uses
synthetic installed packages, compiler output and native result; it executes
the actual driver/workers/graph policy and exact 18-prompt loader. Test-only
workspace, Node and hash constants are adapted to fixtures; delivered command
retains Replit Node v24.13.0, original pins and expected Git identity. Local
Node v24.19.0. No real application, database, package installer or model call.
Unchanged graph policy has the earlier 18 focused contract-case results.

R17B's runtime output and candidate are not available in this preparation
environment. ReleaseReady remains false even on candidate success. Runtime
external imports, config, authentication, browser, data/AI safety, recovery and
deployed identity need subsequent evidence. No plugin integration is claimed.

## Retention and scope

The manifest links a new project-retained snapshot to the input identities used
in a new compiler directory. It does not revive the vanished R17 directory or
prove historical preservation. No old reports are edited or automatically
deleted; any future reuse must revalidate retained bytes. Project retention is
not an off-host backup. Tool internals are not an OS filesystem/network sandbox.

Rollback: the task only creates owned new report/candidate/input directories;
source/package/active-dependency rollback is unnecessary because no mutation
to them is requested. On failure preserve the new report and return the result;
do not delete unknown files or auto-repair concurrent edits.
