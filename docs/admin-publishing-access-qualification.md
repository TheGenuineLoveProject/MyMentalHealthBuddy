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
- Real JWT middleware accepts synthetic administrator account/session tokens and
  rejects missing, ordinary-user, invalid, and expired credentials. Server policies
  are unchanged. Browser-session bearer overrides are scoped to the audited API
  families; no operational administrator token is sent.

## Current reachable social-console failure

`client/src/App.jsx` mounts **AdminSocial** at both `/admin/social` and
`/admin/social/ops`, not NarrativeOpsConsole. The synthetic verifier exercises
AdminSocial's actual loading effect: enterprise reads omit Authorization, and
would fail the declared router guards. In the current app the enterprise router
is not mounted at all; synthetic 404 responses are swallowed into empty panels.
Do not interpret NarrativeOpsConsole's passing transport checks as working access
to those browser routes.

The proposed social-console restoration must address both
`client/src/pages/admin/AdminSocial.jsx` and registration of
`server/routes/social-enterprise.mjs` in `server/app.mjs` (or intentionally route
to a replacement console). Qualify real handler safety and persistence with
disposable services before exposing the router. Section-level failures also need
visible errors rather than empty data. Activation and that UI behavior are not
changed by this request-contract qualification.