# Refresh-family source integration: NOT A LIVE MIGRATION AUTHORIZATION

## State and scope
The source facade now calls the qualified adapter through the existing db/sql/hashToken
imports. No dynamic legacy fallback, alternate pool, or automatic schema installation
is introduced. The seven exported service names and caller-supplied transaction
parameters are retained. The SQL and adapter bytes are the previously qualified
payloads. Route, cookie, JWT, OIDC, MFA, and existing schema-generator behavior is
not changed by this integration step.

The SQL is deliberately stored under server/db/refresh-family/, NOT the automatic
Drizzle migrations directory and NOT schema.canonical.sql. Its original qualification
warning remains. Do not run it on an existing database from a shell paste.
Applying source alone does not provision mmhb_refresh_v1. Authentication calls fail
rather than falling back if the schema, grants, or installation marker is absent.
The existing best-effort bootstrap is not an authorization to run this migration.

## Evidence, not release certification
The prior private PostgreSQL suite reported 31/31 SQL assertions; the separate
Node 24/pg/Drizzle suite reported 24/24 database assertions and 33/33 synthetic
boundary assertions. These counts are distinct scopes, not end-to-end release gates.
The source verifier now freezes reviewed source hashes and runs the 33 boundary
checks and 12 facade-wiring checks. It keeps the existing test command/pipeline
checks, including rejection of bypasses and pre/post verifier hooks.
Those checks do not load the application database client. The facade wiring test
uses Node VM modules and synthetic db/sql/hash modules, never a real environment.
The existing HTTP/client/storage guards are retained and frozen, not retested in a
real browser by this step. Full npm test, typecheck, build and deployed behavior
are still pending.

## Required database transition before application activation
The following are review requirements, not automatic actions by the source helper:
1. Back up and independently restore-test the actual target database; identify its
   owner/runtime roles, PostgreSQL version, timezone conventions and existing table
   constraints. Do not infer production row counts from synthetic tests.
2. Inventory every writer and reader of legacy refresh_tokens, including startup,
   jobs, admin code, password/account deletion and all active deployments. Stop and
   drain legacy writers before adoption. A mixed old/new deployment is not supported.
3. Approve legacy handling. The adoption function retains legacy rows, copies their
   available identities as distinct families, refuses duplicate hashes/orphans/bad
   metadata, and interprets old timestamps as UTC. Already-deleted predecessor
   relationships cannot be reconstructed; in-flight old requests must be drained.
   Long-expired deleted links and browser-held old credentials need an explicit
   transition policy. No automatic sign-out-all or silent data cleanup is authorized.
4. Review runtime grants, including invoker function execution and required table
   privileges, separately from migration ownership. Do not give the web role schema
   ownership, adopt_legacy, installation-marker writes or maintenance permissions
   merely to make errors disappear. The supplied test-role grants are not a full
   application-role grant specification.
5. Apply the versioned DDL, approved grants and explicit adoption only through a
   reviewed transactional deployment procedure. Its CREATE SCHEMA step is not
   rerunnable; interrupted installation and concurrent operators need explicit
   handling. The installation marker is set only by successful adopt_legacy.
6. Verify schema/function identities, grants, marker and rollback behavior on the
   target before enabling these service calls. /healthz is not that evidence.
7. Run actual route/browser tests: sign-in, cookie reception, rotated predecessor
   logout, cross-origin rejection, incomplete logout/retry, concurrent tabs and
   password/account-security transactions. Test through the intended proxy/TLS path.
8. Record the migration and package artifacts in a release manifest; update database
   disaster-recovery/bootstrap/schema tooling intentionally. The existing generator
   and its three legacy backfills have not been rewritten to install this schema.

## Rollback and lifetime caveats
Do not roll back only JavaScript after adoption: the SQL trigger blocks legacy
writes, including no-op deletes. Returning to old writers or to pre-cutover data
can resurrect sessions or lose current state; requires an approved rollback plan.

Ordinary logout revokes one logical sign-in family. Account revocation remains a
separate operation. Consumed predecessor hashes are retained while the family is
live. Families use the existing sliding 720-hour refresh validity; an actively
renewed family can retain history indefinitely without a separately approved
absolute lifetime. Bounded prune_expired limits work per call but does not by
itself define a complete storage-retention policy. Review volume, cleanup schedule
and retention explicitly. Existing refresh-cookie lifetime remains seven days.

Duplicate refresh is denied without automatic family revocation, preserving the
existing conflict policy. This is not strict OAuth replay-triggered revocation.
Already-issued access JWTs and Replit/OIDC sessions have separate validation and
logout lifecycles. Refresh-family revocation alone does not instantly revoke them.
No performance, HIPAA, clinical-safety or production-compliance certification is
implied by these source/database test results.
