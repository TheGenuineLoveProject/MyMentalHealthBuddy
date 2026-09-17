# MMHB refresh-family adapter qualification — TEST ONLY

## Current basis
The user reported 31/31 SQL assertions passing on PostgreSQL 16.10. The existing
SQL is retained byte for byte (SHA-256 in the local results manifest). This does
not imply that the MMHB application uses that SQL yet.

## Replit action
Keep the existing `MMHB_REFRESH_FAMILY_QUALIFY.py` and the successful report
`MMHB_REFRESH_FAMILY_RESULTS_20260917T021550_0451f0.json` in the workspace root.
Upload only `MMHB_REFRESH_ADAPTER_QUALIFY.py` beside them and use the checksum-
protected shell command provided in the response, with `--test-local`.
Do not copy the prototype SQL or the candidate service into the application.

The new runner checks the prior report, prior helper hash, current checkpoint,
six prior fixes, old refresh service, generator, and committed package lock.
It uses existing Node 24 and installed `pg`/`drizzle-orm` packages only. Installed
direct-package versions and entry locations must match the candidate lock. This
is not a full verification of dependency bytes or transitive lock conformance.
Missing/mismatched packages stop the run; nothing is automatically installed.

It starts a NEW private Unix-socket-only PostgreSQL cluster, creates synthetic
users/tables, uses the unchanged tested SQL, creates a separate non-owner runtime
role, runs the adapter boundary and real pg/Drizzle tests, closes pools, stops the
cluster, and checks the original source/metadata snapshot again. It does not
load the MMHB database client, `.env`, application routes, or live credentials.

## Execution layers
- 33 boundary assertions: completed here on Node 22.16.0. The adapter and SHA-256
  are real; the SQL tag and database responses are synthetic.
- 26 harness checks: completed here. Python/Node module resolution is real; the
  full-run PostgreSQL process/data is an explicit test double.
- 24 Node 24 + real pg/Drizzle + PostgreSQL tests: PREPARED, not executed here.
  They run in Replit with existing dependencies. Assertions include actual
  database lock waits, predecessor logout after rotation, transaction rollback,
  response conversion, query parameterization, and runtime-role restrictions.

`refreshTokens.service.CANDIDATE.mjs` is an uninstalled wrapper showing the
intended application connection. The test imports the pure adapter factory with
a test Drizzle database; it does not qualify the entire web application.

## Permissions are a test matrix, not a live grant script
Runtime functions keep invoker rights. The synthetic runtime role necessarily
has selected table DML privileges, including a column UPDATE permission on the
synthetic users table to permit SELECT FOR UPDATE. This is not a function-only
security boundary and not a claim that callers are isolated through SQL roles.
The backend must continue to authorize requests. Migration-marker writes,
DDL, the migration function, maintenance pruning, and credential-history
DELETE are not granted to this test runtime role. No production role is touched.

## Still pending
Approved cutover/backups and legacy-writer shutdown, real deployment role/grants,
UTC legacy timestamp validation, exact service wrapper integration, frozen-source
verifier updates, migration/readiness/rollback checks, Node 24 builds, HTTP and
browser/session/JWT checks, independent CI, and deployed artifact verification.
No production migration or application publication is approved by these tests.

## Local reproducibility
Run `node adapter-unit-tests.mjs unit-results.json` and
`python3 -I test-adapter-harness.py` from this review folder. PostgreSQL binaries
are not needed for these local fixture checks. These commands must not be
represented as real database qualification.
