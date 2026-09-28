# Admin publishing access qualification

Run `node scripts/operations/verify-admin-publishing-access.mjs` in a writable
workspace. It creates and removes temporary esbuild bundles under node_modules
for dependency resolution. All responses and identities are synthetic; it does
not boot the app, connect to a database, or execute publishing handlers.

## Qualified request contracts

- AdminPublishingToday reads and writes use the shared session-aware helper.
- BlogDraftViewer's protected draft read uses the same helper.
- NarrativeOpsConsole's reads and writes use that helper and consume its already
  parsed responses, rather than calling `.json()` again.
- `/admin/social` and `/admin/social/ops` are guarded and render
  `NarrativeOpsConsole`. The social enterprise API is mounted with `requireAuth`
  and `requireAdmin`, and its routes retain their authentication checks.
- Real JWT middleware accepts synthetic administrator account/session tokens and
  rejects missing, ordinary-user, invalid, and expired credentials. Server policies
  are unchanged. Browser-session bearer overrides are scoped to the audited API
  families; no operational administrator token is sent.

## Scope

This is a synthetic request-contract qualification. It exercises the actual
`NarrativeOpsConsole` and `AdminPublishingToday` request callbacks against
in-memory responses and synthetic JWTs, and verifies the social console's source
mounts. It does not boot the app, connect to a database, execute publishing
handlers, or qualify real handler safety and persistence. Use disposable services
for those integration checks; no real service or credential is accessed here.

## Real-handler qualification

The console is activated rather than retired: both social entry points use the
already session-qualified NarrativeOpsConsole, rather than expanding the legacy
AdminSocial transport.

Run the isolated router checks with:

```sh
node node_modules/vitest/vitest.mjs run server/tests/social-enterprise.test.mjs --config server/test.config.mjs
env -u DATABASE_URL -u PGHOST -u PGSERVICE bash scripts/security/test-social-enterprise-isolated.sh
```

The second command creates a disposable, Unix-socket-only PostgreSQL cluster,
loads the five required tables from canonical SQL, exercises real Drizzle queries,
JWT middleware, publishing validation and route handlers, then destroys the
cluster. It requires local PostgreSQL binaries. It does not boot the full app or
call external publishing services. The ordinary test runner skips the SQL suite
unless this isolated environment is present.

Qualified: admin-only route inventory (including the root health handler),
draft/edit/review/approve/mark-posted transitions, persisted audit events, unsafe
content and crisis-reference rejection, campaigns, scheduling, UTM construction,
blog-derived drafts, and populated signals with null themes excluded.
Mark-posted is exercised only against disposable rows.

Administrator-token login has no account ID. The publishing router explicitly
uses a stable namespaced UUID derived from the verified session's timestamp and
issued-at claims for its author field, with `admin-token-session:<uuid>` actor
labels. This is a session identity, not a users-table account or attribution to
an individual person. Account-token authors retain their actual account IDs.
No account records are provisioned and no shared-token permissions are expanded.
The browser contract checks use the real no-ID session shape, including when an
account token is also present; real-SQL checks cover draft and blog-derived draft
creation for that session.

Results: isolated handler checks and PostgreSQL integration checks pass,
along with the request-contract verifier and frontend build. Preview startup and
anonymous API rejection were checked; no authenticated live publishing operation
was used. This does not certify an existing deployment's schema: canonical table
creation cannot add missing columns to legacy tables. Concurrent administrator
edits/approvals also need separate transactional qualification.