# Runtime Topology

> **Status:** Reality-only snapshot of the live MMHB runtime as observed on 2026-05-17.
> **Scope:** Describes the current system exactly as it boots and serves traffic. Contains no proposals, refactors, or future plans. Update only after a verified runtime change ships.

## Canonical Runtime Authority

- **Single source of truth for boot:** `server/app.mjs`
- **Single source of truth for deployment behavior:** `.replit`
- **Single source of truth for the workflow that runs in the Replit workspace:** `.replit` → `[[workflows.workflow]] name = "Start application"`
- **No alternate entrypoints are loaded at runtime.** Files matching `server/app.mjs.backup*` and `server/app.mjs.BEFORE_FINAL_SPA_FIX` exist on disk but are not referenced by any run/start/deploy command.

## Active Entrypoint

| Surface | Command |
|---|---|
| Dev workflow (`Start application`) | `node --import ./server/observability/preload.mjs server/app.mjs` (waits for port 5000) |
| `.replit` `entrypoint` | `server/app.mjs` |
| `package.json` `main` | `server/app.mjs` |
| `package.json` `scripts.dev` | `node server/app.mjs` |
| `package.json` `scripts.start` | `node server/app.mjs` |
| Deployment `run` (vm target) | `NODE_ENV=production exec node dist/server.mjs` |

The dev workflow is the only path that loads the OpenTelemetry preload. `npm run dev` / `npm run start` do not preload OTel.

## Startup Sequence

Order of effects when the dev workflow starts:

1. `node --import ./server/observability/preload.mjs` → `preload.mjs` dynamically imports `./tracing.mjs` inside a `try/catch`. Failures log `[otel] preload skipped` and continue.
2. Node loads `server/app.mjs`. Top-of-file side effects (lines 5–20) install:
   - `process.on('uncaughtException', …)` → console.error + dynamic alert via `observability/safetyAlerts.mjs`
   - `process.on('unhandledRejection', …)` → same shape
3. ESM imports resolve: express, cors, route modules, middleware modules, security modules, db client.
4. `const app = express()` is created.
5. `app.set("trust proxy", 1)`.
6. Fast-path `GET /healthz` and `HEAD /healthz` are registered (return `ok`, `Cache-Control: no-store`).
7. Middleware chain mounts in the order documented in **Middleware Chain** below.
8. Route mounts in the order documented in **Route Registration Order** below.
9. `app.use(express.static(CLIENT_DIST))` (line 219).
10. SPA fallback `app.get("*", …)` (lines 221–235).
11. `const server = app.listen(PORT, "0.0.0.0", …)` (line 247).
12. `SIGTERM` / `SIGINT` handlers register and call `gracefulShutdown(signal)` → `server.close` + 10s `setTimeout(...).unref()` force-exit (lines 255–278).

## Port Binding

- `PORT = process.env.PORT || 5000` (`server/app.mjs:248`)
- Bind host: `"0.0.0.0"` (`server/app.mjs:250`)
- Replit port map (`.replit`):
  - `localPort 5000 → externalPort 80`
  - `localPort 5099 → externalPort 3001`
  - `localPort 24678 → externalPort 3000`
- The dev workflow waits on `port 5000` before reporting ready.

## Health System

Two distinct authorities:

| Path | Source | Behavior |
|---|---|---|
| `GET /healthz`, `HEAD /healthz` | `server/app.mjs:75-82` | Synchronous, dependency-free. `Cache-Control: no-store`. Returns `200 ok` (text/plain). Mounted **before** all heavy middleware so it stays available during boot warm-up. |
| `GET /api/health` | `server/routes/health.mjs:22` | Async. Pings DB (`SELECT 1`), reports environment, version, uptime (sec + formatted), `startedAt`, `database.connected`, `ai.available`, `softLaunch`, `platform`, `services.{stripe,resend,perplexity,sentry}`, `memory.{heapUsedMB,heapTotalMB,rssMB}`, `node`. Returns `200` on success, `500` on probe failure. |
| `GET /api/health/ready` | `server/routes/health.mjs:77` | Pings DB inside the detailed branch. |
| `GET /api/health/live` | `server/routes/health.mjs` | Returns `{status:"alive", uptime}`. |
| `GET /api/health/metrics` | `server/routes/health.mjs` | JSON metrics (uptime, db counts, memory, node info). Not Prometheus exposition format. |
| `POST /api/health/repair` | `server/routes/health.mjs` | Gated by `requireAdminForRepair` (`x-admin-token` header or `req.session.user.isAdmin`). |

Bare `/health`, `/ready`, `/live`, `/metrics` (without the `/api/` prefix) are not registered. They fall through to the SPA `app.get("*", …)` and return HTML 200.

## Auth System

- **Canonical middleware module:** `server/middleware/auth.mjs`
  - Exports used in `server/app.mjs`: `optionalAuth`, `requireAuth`, `requireAdmin` (line 39).
  - Also exports `signUserToken` (used by `server/routes/auth.mjs`).
- **Adult-only gate:** `server/middleware/requireAdult.mjs` (`requireAdult`).
- **Token utilities:** `server/utils/jwt.mjs`.
- **JWT secret source:** `process.env.JWT_SECRET`. `server/middleware/auth.mjs` refuses to boot if the secret is missing or shorter than 32 characters.
- **CSRF:** `server/security/csrf.mjs` exports `csrfProtection` (mounted globally after the session-boundary and health routes) and `issueCsrfToken` (assigned to `globalThis.issueCsrfToken` at app.mjs:47).
- **Refresh-token issuance:** None active in the runtime. `routes/auth.mjs:182` `POST /api/auth/refresh` re-signs the access JWT via `signUserToken`; no opaque refresh token is issued.
- **Admin auth surface:** `server/middleware/requireAdmin.mjs` (imported via `middleware/auth.mjs`).

## Middleware Chain

Live order in `server/app.mjs`:

```
L5    process.on(uncaughtException)        ← installed before any other side effect
L14   process.on(unhandledRejection)
L61   app.set("trust proxy", 1)
L75   GET /healthz  + HEAD /healthz        ← fast-path, no middleware before it
L80   cors                                  (env-driven origin allowlist; credentials:true)
L91   express.json                          (verify hook captures req.rawBody for HMAC webhooks)
L104  helmet                                (CSP branches on NODE_ENV)
L131  cookieParser
L141  requestId                             (dynamic import — middleware/requestId.mjs)
L142  observabilityContext                  (dynamic import — middleware/observabilityContext.mjs)
L146  app.use('/api/session-boundary', sessionBoundaryRoutes)
L147  app.use('/api/health',           healthRoutes)
L150  app.use(csrfProtection)               ← CSRF mounts AFTER session-boundary + health
L160  app.use('/api/ai', aiLimiter)         (express-rate-limit, 30/min)
…     admin rate limiters defined: adminLoginLimiter (10/min IP), adminLimiter (200/min identity-keyed)
L219  express.static(CLIENT_DIST)
L221  app.get('*', SPA fallback)
L247  app.listen(PORT, "0.0.0.0", …)
L274  process.on("SIGTERM", gracefulShutdown)
L275  process.on("SIGINT",  gracefulShutdown)
```

## Route Registration Order

`server/app.mjs` mounts in this order:

1. `app.get('/healthz')` (inline)
2. `app.use('/api/session-boundary', sessionBoundaryRoutes)` — mounted before CSRF
3. `app.use('/api/health', healthRoutes)` — mounted before CSRF
4. (CSRF protection becomes global here)
5. `app.use('/api/ai', aiLimiter)` rate limiter, then AI route mounts that follow
6. Additional route mounts imported at the top of `app.mjs`:
   - `aiRoutes`, `aiHealingRoutes`, `aiBusinessRoutes`
   - `streaksRoutes`, `telemetryRoutes`, `buddyRoutes`
   - `authRoutes` (`server/routes/auth.mjs`)
   - `adminRoutes` (`server/routes/admin.mjs`)
   - `adminBillingRoutes`, `adminPublishingRoutes`, `adminSecurityRoutes`
   - `registerAuthRoutes` from `server/replit_integrations/auth/index.mjs`
7. `app.use(express.static(CLIENT_DIST))`
8. `app.get('*', …)` SPA fallback

## SPA Fallback Behavior

Defined at `server/app.mjs:221-235`:

```js
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/"))    return next();
  if (req.path.startsWith("/assets/")) return next();
  const indexFile = path.join(CLIENT_DIST, "index.html");
  return res.sendFile(indexFile);
});
```

- Any non-`/api/` and non-`/assets/` GET is served `client/dist/index.html`.
- This is why bare `/health`, `/ready`, `/live`, `/metrics` currently return HTML 200.
- The fallback logs `[SPA ROUTE] <path>` and `[SPA INDEX] <file>` to stdout on every hit.

## Frontend Mount Flow

- **Build root:** `client/` (Vite `root: resolve(__dirname, 'client')`)
- **Entry HTML:** `client/index.html`
- **Entry script:** `client/src/main.jsx` (referenced from `index.html`)
- **Styles entry:** `client/src/main.css`
- **Build output:** `client/dist/` (Vite `outDir`, `emptyOutDir: true`)
- **Aliases:** `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`
- **Vendor chunking (vite.config.js):** `vendor-react`, `vendor-query`, `vendor-lucide`, `vendor-icons`, `vendor-charts`, `vendor-motion`, `vendor-date`, `vendor-confetti`, `vendor-router`, `vendor-forms`
- **Vite dev server** (`vite.config.js` `server` block): host `0.0.0.0`, port `5173`, `allowedHosts: true`. The dev workflow does **not** start the Vite dev server — Express serves `client/dist` directly via `express.static`.
- **Production serve path:** `app.use(express.static(path.join(process.cwd(), "client/dist")))` + SPA fallback.

## Observability Initialization

- **Preload entrypoint:** `server/observability/preload.mjs` (passed via `node --import`).
  - Dynamically imports `./tracing.mjs` inside `try/catch`.
  - On import or runtime failure logs `[otel] preload skipped (continuing without tracing)` and lets boot continue.
- **OTel module:** `server/observability/tracing.mjs` (8086 bytes).
- **Spans helpers:** `server/observability/spans.mjs`.
- **API helpers:** `server/observability/otelApi.mjs`.
- **Alerter:** `server/observability/alerter.mjs` (PagerDuty transport) consumed by `server/observability/safetyAlerts.mjs`.
- **Per-request correlation:** `server/middleware/requestId.mjs` stamps `req.requestId` (uuid). `server/middleware/observabilityContext.mjs` provides AsyncLocalStorage. `server/utils/sentry.mjs:57-58` tags every Sentry scope with `requestId`.
- **Crash dispatch:** `process.on('uncaughtException')` and `process.on('unhandledRejection')` both call `safetyAlerts.alertUncaught({kind, error})`. Neither calls `process.exit`.
- **Graceful shutdown logging:** `[SERVER] <signal> received — initiating graceful shutdown` → `[SERVER] graceful shutdown complete (<signal>)` or `[SERVER] graceful shutdown timed out after 10s (<signal>) — forcing exit`.

## Deployment Authority

From `.replit`:

```
[deployment]
deploymentTarget = "vm"
build = ["sh", "-c", "npm ci --no-audit --no-fund && npm run build && node scripts/build-server.mjs"]
run   = ["sh", "-c", "NODE_ENV=production exec node dist/server.mjs"]
```

- **Target:** Replit `vm`.
- **Build pipeline:** clean install → Vite build → `scripts/build-server.mjs` (bundles server into `dist/server.mjs`).
- **Run command in production:** `node dist/server.mjs` (NOT the same file path as dev; the dev workflow loads `server/app.mjs` directly with the OTel preload).
- **Post-merge hook:** `scripts/post-merge.sh`, 20 s timeout (`.replit` `[postMerge]`).
- **Build cache:** `node_modules`, `dist`, `.cache` (`.replit` `[build]`).

## Build Pipeline

- **Frontend:** `npm run build` → `vite build` → `client/dist/`.
- **Server bundle:** `scripts/build-server.mjs` → `dist/server.mjs` (deployment only).
- **Vite settings:** `target: 'es2020'`, `minify: 'esbuild'`, `sourcemap: false`, `chunkSizeWarningLimit: 1000`, manual vendor chunking listed under **Frontend Mount Flow**.
- **Nix channel:** `stable-25_05`, packages `tree`, `libwebp`, `lsof` (`.replit` `[nix]`).
- **Modules:** `nodejs-20`, `postgresql-16`, `python-3.11` (`.replit` `modules`).
- **No `replit.nix` file present** at repo root; Nix configuration lives inside `.replit`.

## Canonical Runtime Files

These files are loaded by the live boot path and must be preserved:

```
server/app.mjs                              ← entrypoint
server/observability/preload.mjs            ← --import target
server/observability/tracing.mjs
server/observability/safetyAlerts.mjs
server/observability/alerter.mjs
server/observability/otelApi.mjs
server/observability/spans.mjs
server/middleware/auth.mjs                  ← requireAuth, requireAdmin, optionalAuth, signUserToken
server/middleware/requireAdmin.mjs
server/middleware/requireAdult.mjs
server/middleware/requestId.mjs             ← mounted dynamically
server/middleware/observabilityContext.mjs  ← mounted dynamically
server/security/csrf.mjs                    ← csrfProtection, issueCsrfToken
server/db/client.mjs                        ← default-export db
server/utils/logger.mjs
server/utils/jwt.mjs
server/utils/aiClient.mjs                   ← isConfigured()
server/utils/sentry.mjs
server/routes/health.mjs                    ← /api/health{,/ready,/live,/metrics,/repair}
server/routes/session-boundary.mjs
server/routes/auth.mjs
server/routes/admin.mjs
server/routes/adminBilling.mjs
server/routes/admin-publishing.mjs
server/routes/admin-security.mjs
server/routes/ai.mjs
server/routes/ai.healing.mjs
server/routes/ai.business.mjs
server/routes/streaks.mjs
server/routes/telemetry.mjs
server/routes/buddy.mjs
server/replit_integrations/auth/index.mjs   ← registerAuthRoutes
client/index.html
client/src/main.jsx
client/src/main.css
client/dist/*                               ← produced by vite build
vite.config.js
package.json
.replit
```

## Archived Dead Systems

Non-destructively moved to `.local/sweep/auth-cleanup/` during cycles B1–B10 (2026-05-17). None are loaded by any live import or workflow:

| Cycle | Source path | Archive name |
|---|---|---|
| B1 | `server/auth/refresh.mjs` | `server-auth-refresh.mjs.bak` |
| B2 | `server/security/jwt.mjs` | `server-security-jwt.mjs.bak` |
| B3 | `server/security/tokens.mjs` | `server-security-tokens.mjs.bak` |
| B4 | `server/auth/authMiddleware.js` | `server-auth-authMiddleware.js.bak` |
| B5 | `server/auth/refreshFlow.mjs` | `server/auth/refreshFlow.mjs.bak` |
| B6 | `server/security/requireRole.mjs` | `server/security/requireRole.mjs.bak` |
| B7 | `server/middleware/requireAuth.mjs` | `server-middleware-requireAuth.mjs.bak` |
| B8 | `server/utils/envValidation.mjs` | `server-utils-envValidation.mjs.bak` |
| B9 | `server/services/tokens.mjs` | `server-services-tokens.mjs.bak` |
| B10 | `server/routes/github-auth.mjs` | `server-routes-github-auth.mjs.bak` |

Also present on disk but **not loaded** by any run path:

- `server/app.mjs.backup`
- `server/app.mjs.BACKUP.1778985708`
- `server/app.mjs.BACKUP.1778986358`
- `server/app.mjs.BEFORE_FINAL_SPA_FIX`

## Known Stability Guarantees

These properties hold today and are relied upon by the system:

- `GET /healthz` always returns `200 ok` synchronously, with `Cache-Control: no-store`, with no middleware before it.
- `app.listen` is called exactly once, on `PORT` (env or 5000), bound to `0.0.0.0`.
- `express.static` is called exactly once, on `client/dist`.
- The SPA fallback `app.get('*', …)` excludes `/api/` and `/assets/` prefixes from the catch-all.
- `process.on('uncaughtException')` and `process.on('unhandledRejection')` log to stderr and fire a PagerDuty alert via dynamic import; the process does not exit from these handlers.
- `SIGTERM` and `SIGINT` trigger `server.close()` then `process.exit(0)`; if `server.close` does not complete within 10 s, the handler force-exits with code `1`. The force timer is `.unref()`-ed.
- `server/middleware/auth.mjs` refuses boot when `JWT_SECRET` is missing or `<32` chars.
- The dev workflow loads the OTel preload via `--import`; production deployment runs `dist/server.mjs` without it.
- Trust-proxy depth is `1` (Replit autoscale / single-proxy hop only).
- Session-boundary and health routes mount **before** CSRF protection.
- AI requests are rate-limited at 30/min (`/api/ai`); admin login at 10/min IP-keyed; admin dashboard at 200/min identity-keyed.

## Known Do-Not-Touch Areas

Documented in `replit.md` governance kernel and observed in active boot path:

- `server/app.mjs` — single canonical entrypoint, boot order is load-bearing.
- `server/observability/preload.mjs` — referenced by workflow `--import`; renaming or moving breaks tracing in dev.
- `server/middleware/auth.mjs` — canonical auth surface used by ~36 route files.
- `server/security/csrf.mjs` — global CSRF mount order is load-bearing (must run after session-boundary + health, before everything else).
- `vite.config.js` — entrypoint resolution and chunking are coupled to deploy bundle.
- `package.json` — scripts and dependency surface; modifications require workflow review.
- `.replit` — workflow, port map, deployment build/run commands.
- `server/routes/health.mjs` — `/api/health` shape is consumed by health-check tooling.
- `server/db/client.mjs` — default export is bound to `globalThis.db` at app.mjs:48.

## Verification Commands

These commands were executed during creation of this document and are the canonical drift-check set:

```bash
# Syntax
node --check server/app.mjs

# Build
npm run build

# Liveness fast-path
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/healthz

# Full health
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health

# SPA root
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/

# Crisis page (governance-mandated always-200)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/crisis

# Duplicate-listen / static guard (must each report exactly 1 live source hit)
rg -n "\.listen\(" server/ --glob '!*.backup' --glob '!*.BACKUP*' --glob '!*.BEFORE_*'
rg -n "express\.static" server/ --glob '!*.backup' --glob '!*.BACKUP*' --glob '!*.BEFORE_*'

# Crash handler presence
rg -n "uncaughtException|unhandledRejection|SIGTERM|SIGINT" server/app.mjs
```

Expected results: syntax `OK`; build `✓ built`; `/healthz`, `/api/health`, `/`, `/crisis` all `200`; each rg returns exactly one live hit in `server/app.mjs` (lines as documented in **Middleware Chain** above); crash-handler rg returns 4 distinct lines in `server/app.mjs`.
