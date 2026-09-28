# MMHB R14 verification kit

Scope: MyMentalHealthBuddy only. R13 actually assembled 603 files and passed copied bcrypt native compatibility. R14 collects selected current runtime source, package and asset metadata while preserving that passing candidate. It does not make a deployable-release or working-application claim.

## User action

Upload MMHB-RUNTIME-CONTRACT-R14.txt unchanged to /home/runner/workspace in the existing Replit project. Use the exact SHA-256 command in MMHB-Readiness-Ledger-2026-09-07.md. Preserve the passing R13 report at /tmp/mmhb-release-assembly-r13-1kpDjX and the R11D report at /tmp/mmhb-server-candidate-r11d-SRSfZ5. Finish uploads and edits before execution.

Return the complete terminal output. It contains compact findings and the hash and size of the detailed runtime-contract-evidence.json report. Keep that private report directory. Do not paste raw prompt/source files, environment values or credentials.

## Qualification

- 37 pure analysis-helper fixtures PASS.
- 29 orchestration fixtures PASS against the delivered driver.
- Bash/Node syntax, exact embedded driver/helper and 41 unchanged pins PASS.
- Independent integration review PASS.
- Actual R14 execution in Replit remains pending.

Orchestration fixtures substitute disposable inert roots, baselines and reviewed policies. They exercise the actual driver control flow using Node builtins and read-only Git calls. They do not execute MMHB application, dependency, native, compiler, install, database, browser or network code. The fixture setup creates its own disposable Git repositories.

To reproduce the local fixture checks from the extracted kit, using local Node and Python:

```bash
node source_review/test-runtime-contract-analysis-r14.mjs
python3 source_review/test-runtime-contract-r14.py
```

The file r14-preparation-record.json records command/source identities and exact test counts. Raw public source snapshots and mappings retain the evidence reviewed during preparation. They are reference material, not replacement application files. GitHub/upstream hashes do not establish current Replit identity; R14 performs that comparison. Resend installed distribution review remains open.

## Boundaries

This kit performs no package installation, source edit, rebuild, app startup, database connection, Git mutation or deployment in the Replit project. R14 writes only a new private report directory. Complete startup assets, MMHB branding, external dependency reachability, React-plugin alignment, real public frontend configuration, isolated runtime/browser acceptance, recovery and deployment identity remain open. Historical R11A preservation cannot be reconstructed from newer passing runs.
