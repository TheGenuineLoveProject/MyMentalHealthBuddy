# Replit transfer — 13 November 2026

Uploading a ZIP to Replit only stores the archive. It does not install the repairs,
apply a patch, or deploy the application. Applying source files also does not
establish production readiness.

The cloud repairs are already applied in this workspace; do not reapply them here.
The [cloud repair note](cloud-repair-2026-11-13.md) describes the repairs and the
limits of the existing evidence.

Both separate GitHub repair branches have been pushed and verified. Use them as
the primary integration route for their matching Replit projects:

| Replit application | GitHub repository | Intended repair branch | Transfer status |
| --- | --- | --- | --- |
| MyMentalHealthBuddy (MMHB) | `TheGenuineLoveProject/MyMentalHealthBuddy` | `codex/cloud-startup-repair-20261113` | Repair commit pushed and remote SHA verified: `8f4f0ec77a01284b64bc55efb28bc95bde765f59`; Replit sync not performed |
| TheGenuineLoveProject (GLP) | `TheGenuineLoveProject/TheGenuineLoveProject` | `codex/restore-brand-assets-20261113` | Pushed and remote SHA verified: `93d8d7efc58781722c5cb106eeea2f6b76659a13`; Replit sync not performed |

Before syncing in Replit, confirm the project's repository and review the repair
branch diff. No completed Replit import, remote merge, or deployment is recorded
by this note.

For the MMHB project, these commands fetch and display the repair branch:

```sh
git fetch origin codex/cloud-startup-repair-20261113
git show --stat --oneline FETCH_HEAD
```

For the GLP project:

```sh
git fetch origin codex/restore-brand-assets-20261113
git show --stat --oneline FETCH_HEAD
```

Fetching does not replace working files. Confirm the repository identity and
preserve existing edits before switching branches or integrating changes. The
code repairs and evidence are committed together; a later documentation-only
commit may follow the repair commit listed above. No production branch was
advanced: MMHB `integration` remained at `ed35be885b6dd1d99d2a744455c67dbdd2970af1`,
MMHB `main` at `c6642e4cb7f2d7ec50455f891820ae42d0a39729`, and GLP `main` at
`0de60d0810f2ea44e0f23041fad559b7cfb0d718` when checked.

Direct Replit file access is not connected to this cloud task. GitHub REST API
access returned `Forbidden`, so no pull request or remote CI result is claimed.
Native Git push/read access succeeded. GitHub's push warnings describe the
unchanged default branches and can differ from the current repair branch's
production-only npm audit.

## Current follow-up verification

The MMHB repair includes the startup/authentication changes, a CI startup fix,
the qualification runner, and compatible dependency updates. CI no longer sets
a fake Replit client ID that would trigger real provider discovery. It runs the
six selected regression files and retains every existing audit, lint, build,
safety, readiness and repository-cleanliness gate. Workflow YAML, shell syntax
and preservation of those steps were checked locally; GitHub Actions has not
been run or confirmed here.

| MMHB dependency | Before | Resolved version |
| --- | --- | --- |
| `body-parser` | 1.20.6 | 1.20.9 |
| `compression` | 1.8.1 | 1.8.2 |
| `dompurify` | 3.4.13 | 3.4.17 |
| `proxy-addr` | 2.0.7 | 2.0.8 |
| `source-map-js` | 1.2.1 | 1.2.2 |
| `systeminformation` | 5.33.2 | 5.33.22 |
| `vite` | 8.0.16 | 8.3.8 |
| `zod` | 4.4.3 | 4.6.7 |

The two exact pins for DOMPurify and Vite changed; the other updates remain in
their existing declared ranges. The lockfile also records required build-tool
and platform-package changes. A fresh `npm ci` installed the exact updated lock.
The production audit changed from six high/two critical entries to zero high
and zero critical. Fourteen moderate and one low entry remain; this is not a
claim that the dependency graph is free of advisories. The unchanged production
security gate returned `ALLOW / NO_HIGH_OR_CRITICAL_FINDINGS`.

The new frontend and server bundles built successfully. All 18 selected tests
passed. ESLint completed with zero errors and 169 warnings; those warnings
remain separate cleanup work. The standalone `dist` copy passed all 36 application/database checks,
including the full repository `npm test` pipeline. Native bcrypt, Speakeasy and
QRCode resolve inside that copy, parent dependency directories are absent, and
global Node package searching is disabled for its child process. The artifact
contains 939 files; its identity and package entrypoints are recorded in the
bundle evidence. Both fixture processes stopped successfully. This run uses a
fresh private PostgreSQL database and `NODE_ENV=test`, without live credentials
or external providers; it is not production deployment qualification.

After the dependency update, desktop/mobile frontend checks passed at 1280 and
390 pixels without uncaught page errors or horizontal overflow. Browser checks
using the actual Blog sanitizer configuration preserved ordinary markup and safe
links and removed the tested scripts, forbidden elements, event handlers,
JavaScript URLs and data attributes. These synthetic cases are not exhaustive
XSS proof. The clinical taxonomy source verifier also passed; it is not a
clinical efficacy evaluation.

Evidence:

- [Standalone bundle and source identity](evidence/cloud-bundle-2026-11-13.json)
- [Current production audit](evidence/production-audit-2026-11-13.json)
- [Audit before dependency updates](evidence/production-audit-before-security-update-2026-11-13.json)
- [Updated browser and sanitizer checks](evidence/browser-security-2026-11-13.json)
- [Lint result](evidence/lint-2026-11-13.json)
- [GLP dependency backlog](evidence/glp-production-audit-summary-2026-11-13.json)

The separate GLP audit found one critical, twenty high and forty-eight moderate
production dependency entries. Its asset repair does not change that graph.
Some OpenTelemetry updates cross declared compatibility ranges and need their
own integration work. This is a release blocker to resolve, not evidence of
demonstrated exploitation. Do not combine these counts with GitHub's broader
default-branch alert inventory.

Current release blockers still include remote database connectivity and verified
TLS, migration/restore and external encrypted-backup proof, real billing/email
and AI/provider integration checks, the GLP dependency backlog, remote CI and
deployment identity. No paid order, bank deposit or payout date is established.

If using the ZIP/patch fallback:

1. Keep ZIPs, patch bundles, and evidence in a private transfer directory outside
   the served `public`, `client/public`, `client/dist`, and `dist` directories.
   Do not unzip over application files. Extract into a separate private directory.
2. Match each patch to its application: the MMHB patch belongs in
   MyMentalHealthBuddy; the GLP patch belongs in TheGenuineLoveProject.
3. In the matching Replit repository, run `git status --short` and confirm the
   working tree is clean. If it contains work, preserve that work before
   proceeding; do not reset, clean, or overwrite files to force a match.
4. Review the patch and its expected base revision. From the matching repository
   root, use `git apply --stat /private/transfer/repair.patch` and
   `git apply --check /private/transfer/repair.patch` with the actual patch path.
   If the base, contents, or check do not match, stop and reconcile while
   preserving current work. Do not force or blindly reapply the patch.
5. Only after those checks pass, apply the reviewed patch with
   `git apply /private/transfer/repair.patch`, then inspect `git diff` and
   `git status --short`. Review any separately supplied files before adding them.
   Evidence files document checks; copying them does not repeat those checks.

Replit AI credits pay for use of Replit's AI tools. Uploading evidence, applying a
patch, or syncing GitHub is a separate integration task; credits do not establish
that a repair was integrated, tested, deployed, or production-qualified.

Keep all existing CI and [production launch gates](production-launch-gate-checklist.md).
Release still requires the applicable health/readiness, typecheck, tests, build,
route contracts, safety, billing, rate-limit, HealthKit, backup/restore,
observability, and incident-response checks. Missing production secrets, external
encrypted backup storage, unresolved SEV-1 incidents, failed checks, or unknown
deployment status remain hard blockers. The isolated CI startup check uses
synthetic session/JWT secrets and empty Replit/AI configuration; it does not
qualify live provider integrations or production operation.
