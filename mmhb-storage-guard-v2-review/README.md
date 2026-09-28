# MMHB storage guard V2

Corrects the original helper's uppercase placeholder-email fixture, not the application's placeholder domain. The verified source contains `@replit.auth`. V1 embedded a canonical fingerprint for `@Replit.auth` and refused the real baseline. V2 requires the exact reviewed raw bytes, the original full report hash, and equality with the recovered Git commit. It does not dynamically adopt a new hash or lowercase source code.

## Source provenance
Reviewed immutable GitHub baseline: `TheGenuineLoveProject/MyMentalHealthBuddy`, commit `df8137696e4c7b0a7c16a08347e1b92f85b85371`, file `server/replit_integrations/auth/storage.mjs`. Git blob ID: `dc3ff519e39f3f0c33e9fbe42ffeff7656e7191e`.
The target recovered snapshot is `63ff8372d07368a5434c11ff58bdf87bb468449d`. Before applying, V2 requires this recovered blob, the collector's report entry, and the reviewed raw bytes to be identical. The fixture tests do not replace this Replit check.

## Changes
Only `server/replit_integrations/auth/storage.mjs` is patched. Public sign-in creates ordinary users, never automatically administrators; a new subject colliding with an existing email is refused rather than implicitly linked. Previously linked accounts keep their existing update path and roles. The lowercase fallback-email string remains unchanged. User-profile field filtering, explicit account-linking flows, administrator provisioning, existing-role audits, and credential revocation are NOT resolved by this patch.

## Local fixture tests
Requires Python 3, Node (tested here on 22.16.0), and Git. No package installation is needed. Run:

    python3 -I test-helper.py
    python3 -I test-v2-regressions.py
    python3 -I run-behavior.py

Database/Drizzle operations are mocked in memory. No real SQL, application boot, OIDC discovery, email, or browser is used. The regression tests reproduce V1's stop, exercise a detached worktree backed by an independent bare repository and split index, and refuse source variants. Some successful assertions demonstrate the OLD unsafe behavior rather than validate security.

## Applying in Replit
Use the checksum-pinned command supplied in chat. The helper's default is dry run; `--apply` enables writing one candidate file. Before replacing it, the helper saves evidence and creates a separate local checkpoint using a temporary index. The current candidate HEAD and index do not move, so the working file is modified, with the patched snapshot retained under `refs/mmhb-fixes/storage-guard-v2-...`. On a successful repeated run the file is already identical and the checkpoint is reused. A STOP output must not be bypassed.

The helper performs no network request, database operation, dependency install, application start, build, push, or deployment. It is not a production migration or release qualification. Keep the existing baseline source report unchanged; do not rerun the baseline collector against a patched working file.

The review package includes the original V1 helper and its incorrect fixture solely to reproduce the failure. Do NOT upload/run V1 in Replit again.
