# MyMentalHealthBuddy R16 verification kit

Prepared September 8, 2026. This is the next authorized Shell handoff after the user's actual R15 pass. It has not been run against the current Replit installation.

## Purpose and acceptance

R15 repaired six source-content files, packaged 22 prompt assets and loaded all 18 prompt modules. Its private candidate contains 625 files and 40,501,647 bytes. The current workspace still has React plugin 6.1.1 and Resend 6.24.0, while the root lock specifies 6.1.0 and 6.22.1.

R16 creates a fresh private dependency stage using exact copies of the current package.json and package-lock.json. It downloads public registry packages using the existing npm CLI with lifecycle scripts disabled. The expected success status is:

`LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE`

That status means the new stage passed locked package metadata and observed file/link checks. It does not mean workspace dependencies changed, build tools ran, R15 was rebuilt, the application started, or the platform was deployed.

## Operating contract

- Issue: `LOCKED-DEPENDENCY-RECONSTRUCTION-001`.
- Owner: the root lockfile controls the dependency versions for subsequent release builds.
- Authorized scope: new private `/tmp/mmhb-locked-dependencies-r16-*` files, public registry downloads, existing npm CLI execution, installed package metadata/file observations.
- Preserved: current source and Git observations; 41 pinned inputs; all 22 R15 prompt assets; selected current installed packages; retained R15 report identities and candidate bytes; observed npm CLI identities.
- Child configuration: fresh stage as cwd and explicit npm prefix; empty private user/global npm config; inspected builtin config; private cache/temp/captured log; no inherited application secrets; no HOME replacement.
- Scripts, audit, funding output and update checks disabled. Includes development, optional and peer dependencies. No force or legacy-peer retry.
- Maximum npm subprocess time: 15 minutes, with progress every 30 seconds. TERM then owned-child KILL after five seconds if needed. Captured npm log is capped at 16 MiB; npm debug logs are disabled.
- Root lock requires exact official HTTPS registry archives and canonical SHA-512 integrity; npm verifies archive integrity. No local/git/workspace/link/shrinkwrap install source is admitted.
- One narrow compatibility rule permits the bundle declaration for optional `@tailwindcss/oxide-wasm32-wasi` with cpu `["wasm32"]` on Linux x64. Its entire directory must remain absent. Installed bundled dependencies remain disallowed.
- Absent packages require `optional: true`; `devOptional` alone is insufficient because development dependencies are explicitly included.
- Successful extracted packages are compared with root lock names/versions and hidden-lock metadata. File hashes and contained relative `.bin` links are recorded without executing their targets.
- Recovery: the stage is disposable and failure leaves existing workspace dependencies/candidates in place. No automatic rollback of unrelated concurrent edits and no destructive cleanup of old reports. Keep the report directory for analysis. Interrupts and abrupt host termination are not a filesystem transaction.

## Local verification

**76 fixture checks PASS:** 49 policy/inventory, 15 npm-runner, 12 complete-driver workflow checks. Bash and Node syntax pass. The runner fixtures use an inert CLI file executed by real Node; they do not contact npm or install real packages. Timeout fixtures accelerate only test timers. Workflow fixtures transplant known identities into disposable Git repositories and preserve injected concurrent changes.

Coverage includes invalid registry/local dependency inputs, invalid integrity, required dependency omissions, wrong versions/names, valid explicit aliases, platform-specific optional handling, symlink escape/refusal, hidden-lock disagreement, fresh-stage enforcement, minimal environment, npm failure redaction, output limits, SIGTERM/timeout/EPIPE cleanup, source/candidate/evidence drift and final report-write failure.

Read `r16-release-review.md` and `r16-install-contract.md` for independent review and its resolved finding. Exact file hashes and the tested driver identity are retained in `r16-preparation-record.json` and the fixture results.

## Reproduce the local fixtures

From this kit's extracted directory with Node, Python 3 and Git available:

```bash
node source_review/test-locked-dependency-policy-r16.mjs
node source_review/test-locked-npm-runner-r16.mjs
python3 source_review/test-locked-dependencies-r16.py
```

These commands create and clean their own disposable fixtures. They are optional verification of the handoff, not the Replit instruction and not application tests.

`source_review/build-locked-dependencies-command-r16.py` assembles the exact driver and one-file Shell command from the included prefix, body and helper modules. It is a local packaging helper, not required on Replit.

## User instruction

Upload the supplied `MMHB-LOCKED-DEPENDENCIES-R16.txt` unchanged to `/home/runner/workspace`. Finish current edits and avoid editing the project during its observations. Run the checksum-verified command shown in the readiness ledger. Return the complete terminal summary and keep the private report directory. No Replit AI prompt, manual lockfile edit or root `npm ci` is required.

The raw npm log is kept privately; the terminal summary contains only selected npm error codes. If any gate fails, return that result rather than bypassing the gate or retrying with force/script flags.

## Limits and next step

Private paths and minimal environments are not OS filesystem/network isolation. npm itself executes and may request registry metadata in addition to tarballs. File integrity does not establish publisher identity or absence of vulnerabilities. The current full root lock is checked on Replit; older local snapshots are compatibility context only. Missing optional packages remain functionally unqualified. Native/tool postinstall requirements and actual builds need subsequent targeted qualification.

After a real R16 pass: qualify the installed build/native tools, rebuild the server/frontend with this locked stage, then complete remaining runtime assets/configuration and the release acceptance matrix. Existing R15 assets and source changes must be incorporated and freshly verified. Application/browser/database/AI-safety, recovery and deployed identity remain open.

The fetched public site's title still mentions The Genuine Love Project. This is a queued MMHB-branding review lead, not a browser-layout or deployment-provenance finding. No other platform is being edited.

## Primary references

- npm ci: https://docs.npmjs.com/cli/v11/commands/npm-ci/
- npm configuration files: https://docs.npmjs.com/cli/v11/configuring-npm/npmrc/
- npm configuration flags: https://docs.npmjs.com/cli/v11/using-npm/config/
- Lockfile metadata, including optional/devOptional: https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/
- Public title observation: https://mymentalhealthbuddy.com/

Documentation was checked September 8, 2026. The installed npm version and CLI identities are collected on Replit before execution; documentation is not proof of the user's runtime behavior.
