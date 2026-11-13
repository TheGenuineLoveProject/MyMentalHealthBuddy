# Cloud repair and verification — 13 November 2026

This is the initial repair snapshot. For the subsequent dependency updates,
standalone production-bundle checks and GitHub/Replit transfer status, see
[`replit-transfer-2026-11-13.md`](replit-transfer-2026-11-13.md).

The cloud environment is operational. MyMentalHealthBuddy now starts without
Replit identity-provider configuration or an OpenAI credential. TheGenuineLoveProject's
missing logo imports are repaired using existing repository artwork. Both client
builds passed. This milestone does not qualify a production release.

## Source identity

| Repository | Baseline commit | Branch | Delivered state |
| --- | --- | --- | --- |
| MyMentalHealthBuddy | `ed35be885b6dd1d99d2a744455c67dbdd2970af1` | `work` | Working-tree repair, tests and qualification runner |
| TheGenuineLoveProject | `0de60d0810f2ea44e0f23041fad559b7cfb0d718` | `work` | Working-tree import repair and recovered source images |

Both working trees were clean before this work. The runtime evidence records
SHA-256 identities for the relevant candidate source files, including the four
changed backend modules. No commit, push, merge or deployment was performed.

## Repairs

1. **Unconfigured Replit provider blocked startup.** `setupAuth` previously
   attempted discovery on every host. It now keeps the session and Passport
   middleware available and only discovers Replit when `REPL_ID` is nonblank.
   Unconfigured provider login/callback routes explicitly return uncached 503
   responses; they never grant access. Configured discovery failures still
   reject startup. Local session logout retains its origin guard and destroys
   the session before redirecting locally. Provider logout redirects remain.
2. **Optional AI credentials blocked module import.** Three eagerly constructed
   OpenAI clients are now constructed only when their existing credential is
   present. Credential precedence and configured provider URLs are preserved.
   The mirror keeps its existing `local_fallback` label. Admin AI endpoints
   enforce authentication and administrator access before returning uncached
   503 responses when generation is unavailable. Other admin tools remain usable.
3. **GLP uploaded asset references broke the build.** Four logo components now
   import source PNGs recovered byte-for-byte from committed build assets. See
   TheGenuineLoveProject's `client/src/assets/brand/README.md` for original
   filenames, provenance, SHA-256 hashes, dimensions and placements. No artwork
   was generated or replaced with a substitute.
4. **Cloud build layout was incomplete.** The verified MMHB build was copied
   from `/workspace/.onboarding-builds/mmhb` into ignored `client/dist` so the
   actual backend and foundation verifier can use it. No tracked build outputs
   were overwritten. The generated platform-status document was restored, and
   the successful pipeline ran with `CI=true` to keep it unchanged.

## Verified results

| Evidence | Result | Practical limit |
| --- | --- | --- |
| MMHB `npm run build -- --outDir /workspace/.onboarding-builds/mmhb` | Passed | Client build, not deployment |
| MMHB selected Vitest run | 18 tests passed in 6 files | 5 provider tests, 4 optional-AI tests, 4 real-child cleanup tests, 5 existing tests; provider/storage fixtures where documented |
| Real application + disposable PostgreSQL qualification | 36 checks passed | Fresh local PostgreSQL 17.11, Node 24.22.1, `NODE_ENV=test`, synthetic accounts |
| Full repository `npm test` | Passed against a real ready local server | Includes compiler, source contracts and focused verifiers; not a full application, clinical or paid-service evaluation |
| MMHB browser smoke | Passed at widths 1280 and 390 | Fresh static build, rendered root, zero page errors, no horizontal overflow; external requests and service workers blocked |
| GLP repaired build | Passed | Local client build |
| GLP logo HTTP/browser checks | Passed | Matching image bytes, decoded logo instances on `/lumi-design-system` at desktop/mobile sizes; no production hosting verification |
| Diff whitespace checks | Passed for both repositories | Does not establish functional correctness |

The final runtime run is preserved in
[`evidence/cloud-runtime-2026-11-13.json`](evidence/cloud-runtime-2026-11-13.json).
Its check list includes actual registration and native bcrypt password storage;
private journal read/update/delete isolation; encrypted pending MFA enrollment;
real QR generation and TOTP activation; challenge/access-token separation;
invalid-code and consumed-challenge rejection; concurrent verification with one
winner; one-use recovery credentials; refresh-token revocation; and persistence
after a full application restart. The final check is the repository pipeline.
These are 36 named checks, not 36 unit tests. Counts from earlier failed attempts
and incompatible historical candidates are not added to this result.

The runner confirms its private PostgreSQL data directory and empty TCP listener
setting before application use. It creates an application role without superuser,
database-creation or role-creation rights. The child environment excludes inherited
application credentials and external-service keys. A generated credential is used
only with a fresh private Unix-socket database. Application and database shutdown
both passed. Private fixture logs and data remain in the `/tmp/mmhb-cloud-*`
directory identified by each command's output; the password input file was
removed. The copied evidence JSON contains no tokens,
passwords, recovery codes or connection strings.

The initial runtime attempt exposed the missing-AI-credential import failure.
After the code repairs, all 35 application checks passed but the foundation gate
found the absent served build. After correcting that layout, the complete run
passed. A separate fixture initialization attempt hit its original time budget;
the runner now allows sufficient initialization time. Review also identified
a signal-exit cleanup edge case and an inherited issuer setting in a provider
test. Cleanup now observes both exit codes and signals with bounded waits;
four tests exercise real subprocesses, including an isolated command group
that ignores SIGTERM and requires bounded SIGKILL escalation. The npm watchdog
also finishes its wait after bounded shutdown instead of waiting indefinitely.
The issuer is explicitly a fixture. The final evidence hashes the changed AI
modules, regression tests and cleanup helper and confirms unchanged source
through completion. Failures were resolved,
not counted as passes or hidden by bypassing a check.

## Reproduce the cloud qualification

The opt-in runner is `scripts/qualification/cloud-runtime.mjs`. It requires a
client build and PostgreSQL binaries. It never uses the configured live database.
Use the existing project dependencies and Node 24. On this cloud machine the
test-only PostgreSQL package is installed outside both application repositories:

```sh
npm install --prefix /workspace/.cloud-tools/postgres --cache /workspace/.npm-cache --ignore-scripts --no-audit --no-fund --save-exact @embedded-postgres/linux-x64@17.11.0-beta.19
node /workspace/.cloud-tools/postgres/node_modules/@embedded-postgres/linux-x64/scripts/hydrate-symlinks.js
```

The inspected package script restores bundled library symlinks. npm integrity and
TLS verification remain enabled. No application manifest or lockfile changed.
From `/workspace/MyMentalHealthBuddy`, build into its ignored client output if
needed, then run the qualification:

```sh
npm run build
MMHB_POSTGRES_BIN=/workspace/.cloud-tools/postgres/node_modules/@embedded-postgres/linux-x64/native/bin node scripts/qualification/cloud-runtime.mjs
```

Focused regression command, already run successfully:

```sh
./node_modules/.bin/vitest run --config server/test.config.mjs server/tests/optional-ai-startup.test.mjs server/tests/auth-provider-config.test.mjs server/tests/qualification-process-cleanup.test.mjs server/tests/mood.test.mjs server/tests/journal.test.mjs server/tests/auth.test.mjs
```

## Remaining release work

| Area | Current evidence | Next required evidence |
| --- | --- | --- |
| Configured remote PostgreSQL | Read-only `SELECT 1` failed during DNS resolution (`EAI_AGAIN`) | Supported connection, verified TLS, staging schema compatibility and restore rehearsal |
| Identity provider | Unconfigured behavior and simulated configured flow tested | Real provider flow if Replit sign-in is retained |
| AI | Startup and unavailable-capability behavior tested | Actual configured-provider integration and governed output evaluations |
| Billing and email | Existing repository contract checks passed; no external calls | Real sandbox checkout/webhook/delivery and retry evidence, then production account readiness |
| Privacy and accessibility | Journal isolation and two narrow browser checks passed | Remaining private-record journeys, export/deletion/retention and broader accessibility checks |
| Deployment | No deployment performed | Reviewed immutable source/artifact, CI, target configuration, rollback and production probes |
| Business automation | No new paid funnel or CRM automation activated | Verified checkout, delivery, consent, unsubscribe, refunds and operational alerts |

Do not infer production database availability from a ready environment-variable
binding or infer revenue from a successful test. No sale, bank deposit or payout
date is established. Overall platform completion remains unestimated until the
remaining integration and release work is bounded.
