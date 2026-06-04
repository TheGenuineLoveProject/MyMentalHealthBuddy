---
name: Billing response contract mismatch
description: MMHB billing endpoints vs clients disagree on response envelope shape; the rule for which helper to use.
---

# Billing response envelope contract

`server/utils/response.mjs` exposes two success-shaped helpers that produce DIFFERENT envelopes:
- `ok(res, data)` → `{ success: true, ...data }` (payload spread at **top level**)
- `success(res, data)` → `{ ok: true, data: { ...data } }` (payload **nested under `data`**)

**The mismatch:** the billing client surfaces all read payload fields at the **top level**
(e.g. `data.url`, `subData.plan`). They are: `client/src/pages/Pricing.jsx`,
`client/src/pages/Upgrade.jsx`, `client/src/pages/account/Billing.jsx` (checkout + portal),
and `client/src/pages/account/Subscription.jsx` (portal + subscription-status). But several
`server/routes/billing.mjs` handlers historically used `success()`, which nests under `data`,
so the client reads `undefined`.

**Why it matters:** when `/checkout` used `success()`, `data.url` was always undefined and the
redirect to Stripe never fired — i.e. **no user could complete a purchase**, with no error
surfaced. This class of bug is invisible to the build/route/duplicate/copyright diagnostics
(they all pass green) and only shows up by tracing the server-helper-vs-client-read contract.

**Rule:** for any billing endpoint whose response is read top-level by these clients, use
`ok()` (top-level spread), not `success()`. If you must keep `success()`, the client must read
`res.data.<field>`. Keep the two sides in lockstep.

**Status: RESOLVED — all of `billing.mjs` now uses `ok()` (top-level).** Every route
(`/checkout`, `/portal`, `/subscription-status`, `/invoices`, `/plans`, `/current-plan`) returns
the top-level envelope, matching how every client consumer reads them. The unused `success`
import was dropped from `billing.mjs`. `/plans` + `/current-plan` had zero client consumers but
were standardized anyway to kill the latent hazard (a future top-level reader would silently
break). Verified live: `/api/billing/plans` returns `{"success":true,"plans":[...]}`.

**Both helpers still coexist project-wide** (`ok` top-level, `success` nested-under-data), so
this mismatch class can recur in any *other* router. When wiring a new endpoint, match the
server helper to how the client reads it. Consider collapsing to one canonical helper to retire
the bug class entirely.

**Related bug class — `apiRequest` argument order (RESOLVED):** canonical signature is
`apiRequest(method, url, data)` (method-first); `data` is a plain object that `apiRequest`
JSON-stringifies internally — never pass `JSON.stringify(...)` or a `{method, body}` options
object. Six call sites were url-first (`apiRequest(url, {method, body})`), which silently broke
them (fetch got the URL as the HTTP method): `components/JournalAI.jsx`, `account/DeleteAccount.jsx`,
and `account/Security.jsx` (2fa setup/verify/disable + password). All fixed to method-first with
plain-object payloads. `Subscription.jsx` was already correct (the earlier "wrong signature" note
on it was false). Grep guard for regressions: `apiRequest\(\s*["'](/api|/)` should return zero hits.

**CRITICAL build gotcha:** the server serves a PREBUILT `client/dist` via `express.static` —
`npm run dev` is just `node server/app.mjs`, there is NO vite dev middleware. Any `client/src`
change requires `npm run build` (vite build, ~50s) before it is visible. Server-side `.mjs`
changes only need a workflow restart. Don't assume client edits hot-reload.
