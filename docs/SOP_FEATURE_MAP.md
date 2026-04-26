# Platform SOP Feature Map (v1)

**Purpose:** Single source of truth for "every feature must prove it works from entry → process → output → verify → evolve." This file is the human-readable contract; `server/routes/sop.mjs` is the machine-readable check runner; `client/src/components/admin/SOPMonitorPanel.jsx` is the visual readout.

**Last reviewed:** 2026-04-26 (Phase 5.2 — SOP Monitor v1)

**Owner domains:**
- `platform` — bootstrap, health, infra, build, deploy
- `healing` — AI chat, Buddy companion, crisis routing, wellness tools
- `business` — revenue, publishing, billing, paywall
- `admin` — dashboard, security, audit, soft-launch metrics
- `content` — public marketing pages, learning hub

---

## Public surfaces (no auth)

| Feature | Route / Page | API | Auth | Expected success | Expected error | Verification | Owner |
|---|---|---|---|---|---|---|---|
| Health probe | `/health` | `GET /health` | none | `200 application/json {ok:true,...}` | `503` if readiness gate trips | `curl -fsS https://thegenuineloveproject.replit.app/health` | platform |
| API metadata | `/api/_meta` | `GET /api/_meta` | none | `200 application/json` | n/a | `curl -fsS .../api/_meta` | platform |
| Landing | `/` | n/a (SSR static) | none | `200 text/html` | n/a | open in browser | content |
| Pricing | `/pricing` | n/a | none | renders pricing tiers | n/a | open in browser | business |
| Crisis | `/crisis` | n/a | none | renders crisis resources (always reachable) | NEVER 4xx | open in browser | healing |
| Community | `/community` | n/a | none | `200 text/html` | n/a | open in browser | content |
| Peace Scape | `/peacescape` | n/a (frontend route) | none | renders sanctuary | n/a | open in browser | healing |

## Authenticated user surfaces

| Feature | Route / Page | API | Auth | Expected success | Expected error | Verification | Owner |
|---|---|---|---|---|---|---|---|
| Current user | `/profile` | `GET /api/auth/user` | JWT | `200 {user}` | `401` if no/invalid token | with `Authorization: Bearer <jwt>` | platform |
| Start (AI entry) | `/start` | `POST /api/ai/chat` | JWT or guest | `200 {reply, source, modules, tool, paywall}` | `401`, `429`, `500` | functional E2E test | healing |
| Buddy companion | (embedded) | `GET /api/buddy/state` | JWT | `200 {state}` | `401` | with auth header | healing |
| Journal | `/journal` | `GET/POST /api/journal/*` | JWT | `200 [{entry}]` | `401` | with auth header | healing |
| Tools | `/tools` | `GET /api/tools/*` | JWT optional | `200 [{tool}]` | `401` for protected | with auth header | healing |
| Growth | `/growth` | `GET /api/growth/*` | JWT | `200 {stats}` | `401` | with auth header | healing |

## Admin surfaces (require admin role OR adminSessionToken)

| Feature | Route / Page | API | Auth | Expected success | Expected error | Verification | Owner |
|---|---|---|---|---|---|---|---|
| Admin dashboard | `/admin` | `GET /api/admin/dashboard` | admin | `200 {metrics}` | **MUST 401/403 unauthenticated** | `curl .../api/admin/dashboard` should return 401 JSON | admin |
| Admin health | `/admin` | `GET /api/admin/health` | admin | `200 {ok,checks}` | `401/403` | `curl .../api/admin/health` returns 401 JSON | admin |
| Admin health-deep | `/admin/system` | `GET /api/admin/health-deep` | admin | `200 {db, redis, openai, ...}` | `401/403` | as above | admin |
| Admin stats | `/admin` | `GET /api/admin/stats` | admin | `200 {users, sessions, ...}` | `401/403` | as above | admin |
| Publishing today | `/admin/publishing` | `GET /api/admin/publishing` | admin | `200 {drafts, scheduled}` | `401/403` | as above | business |
| Revenue | `/admin/revenue` | `GET /api/admin/revenue` | admin | `200 {mrr, arr, churn}` | `401/403` | as above | business |
| Billing viewer | `/admin/billing` | `GET /api/admin/billing/*` | admin | `200 {invoices}` | `401/403` | as above | business |
| Audit logs | `/admin/audit` | `GET /api/admin/audit-logs` | admin | `200 [{entry}]` | `401/403` | as above | admin |
| Security overview | `/admin/security` | `GET /api/admin/security/overview` | admin | `200 {alerts, posture}` | `401/403` | as above | admin |
| Social studio | `/admin/social` | `GET /api/admin/social/*` | admin | `200 {drafts, calendar}` | `401/403` | as above | business |
| Social enterprise | `/admin/social/enterprise` | `GET /api/admin/social/enterprise/*` | admin | `200 {campaigns}` | `401/403` | as above | business |
| Soft-launch metrics | `/admin/soft-launch` | `GET /api/admin/soft-launch-metrics` | admin | `200 {opens, clicks, signups}` | `401/403` | as above | admin |

## SOP self-check

| Feature | Route / Page | API | Auth | Expected success | Expected error | Verification | Owner |
|---|---|---|---|---|---|---|---|
| SOP Monitor (panel) | `/admin` → SOP Monitor tab | `GET /api/admin/sop/status` | admin | `200 {ok, checks: [...]}` | `401/403` | `curl .../api/admin/sop/status` returns 401 JSON | admin |

---

## Verification commands (one-liners)

```bash
# Local dev (workflow port 5000)
curl -fsS http://localhost:5000/health
curl -fsS http://localhost:5000/api/_meta
curl -sS  http://localhost:5000/api/admin/dashboard | head -c 200   # expect 401 JSON

# Live deployment
curl -fsS https://thegenuineloveproject.replit.app/health
curl -sS  https://thegenuineloveproject.replit.app/api/admin/sop/status | head -c 200   # 401 JSON without auth
```

## Pass / Warn / Fail definitions

- **pass** — endpoint returned a status code in the route's `expected` set within the timeout
- **warn** — endpoint returned a status code outside `expected` but still in the 2xx/3xx/4xx valid range (route exists but behaving unexpectedly)
- **fail** — connection error, timeout (>3s), or 5xx response (route is broken or unmounted)

Routes that **MUST** be auth-gated (e.g. `/api/admin/*`) treat a `200` without credentials as a **fail** — that would mean security is bypassed.

## Update rule

When you add a new feature/route:
1. Add a row to the appropriate table above.
2. Add a `CHECKS` entry in `server/routes/sop.mjs`.
3. Restart the workflow and verify it appears in `/api/admin/sop/status`.
4. Confirm the SOP Monitor panel renders it.

## Static checks (v1.1, Apr-26)

Some platform invariants can't be probed via HTTP — they need to inspect source code or runtime config. SOP Monitor supports these via `type: "static"` entries with a `staticCheck()` function. The runner dispatches HTTP probes vs static checks automatically; results land in the same panel with the same pass/warn/fail vocabulary.

Currently tracked:

| Check | Domain | Status target | Notes |
|---|---|---|---|
| `csrf-middleware-active` | platform | warn (tracked debt) | `server/app.mjs:101` calls `app.use(csrfProtection)` instead of `app.use(csrfProtection())` — middleware is a no-op. Per advisor, intentionally tracked as WARNING; do NOT fix until SOP-driven release plan addresses it. CSRF cookies are still issued correctly to clients, so the visible flow looks intact. |

To add a new static check, append a `CHECKS` entry like:
```js
{
  id: "my-check",
  name: "Human-readable name",
  domain: "platform",
  type: "static",
  staticCheck: async () => ({ status: "pass" | "warn" | "fail", message: "...", endpoint: "static:where" }),
  remediation: "What to do if this fails",
}
```
