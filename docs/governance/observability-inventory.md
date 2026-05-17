# Observability Inventory

> **Status:** Reality-only snapshot of MMHB's existing monitoring, logging, health, readiness, metrics, and diagnostics surfaces as observed on 2026-05-17.
> **Companion document:** `docs/governance/runtime-topology.md`.
> **Scope:** Describes what exists today. Contains no proposals, redesigns, or new endpoints.

## Canonical Health Endpoints

| Endpoint | Method | Source | Response |
|---|---|---|---|
| `/healthz` | `GET`, `HEAD` | `server/app.mjs:75-82` (inline) | `200 ok` (text/plain), `Cache-Control: no-store`. Dependency-free. Mounted before all heavy middleware. |
| `/api/health` | `GET` | `server/routes/health.mjs:22` | `200` JSON: `status, environment, version, uptime (seconds), uptimeFormatted, startedAt (ISO), database.connected, ai.available, softLaunch, platform.{totalTools,totalRoutes,adminPages}, services.{stripe,resend,perplexity,sentry}, memory.{heapUsedMB,heapTotalMB,rssMB}, node`. Returns `500` if probe throws. |
| `/api/health/live` | `GET` | `server/routes/health.mjs:89` | `200 {status:"alive", uptime}`. |
| `/api/health/ready` | `GET` | `server/routes/health.mjs:77` | Issues `SELECT 1` when `DATABASE_URL` is set. Current live behavior returns `200 {status:"ready"}`. |
| `/api/health/detailed` | `GET` | `server/routes/health.mjs:93` | Aggregated check object: `checks.db.{ok,latencyMs}`, `checks.stripe.{configured,ok}`, `checks.openai.{configured,ok}`, `checks.sentry.{configured,ok}`. Returns `200` when `checks.db.ok` is true, else `503` with `status:"degraded"`. |
| `/api/health/metrics` | `GET` | `server/routes/health.mjs:132` | JSON metrics (see **Metrics Surface**). |
| `/api/health/repair` | `POST` | `server/routes/health.mjs:190` | Gated by `requireAdminForRepair`. Operational repair commands. |
| `/api/health/git-status` | `GET` | `server/routes/health.mjs:668` | Gated by `requireAdminForRepair`. |
| `/api/health/platform-integrity` | `GET` | `server/routes/health.mjs:693` | Gated by `requireAdminForRepair`. |

The bare paths `/health`, `/ready`, `/live`, `/metrics` are not registered. They fall through to the SPA `app.get("*", …)` fallback and return `200` `text/html` (`client/dist/index.html`).

## Readiness Surface

- **Authoritative readiness path:** `GET /api/health/ready` (`server/routes/health.mjs:77`).
  - When `DATABASE_URL` is set, performs `db.execute(sql\`SELECT 1\`)` inside the handler.
  - Current observed live response: `200 {"status":"ready"}`.
- **Detailed readiness path:** `GET /api/health/detailed` returns `503 {status:"degraded"}` when `checks.db.ok` is false; otherwise `200 {status:"ok"}`.
- **Liveness probe used by the dev workflow:** `GET /healthz` (workflow `waitForPort = 5000`; the workflow itself waits on port-open rather than path response).
- **Deployment liveness path:** None pinned in `.replit`. The platform's default port-open check applies.

## Metrics Surface

- **Endpoint:** `GET /api/health/metrics` (`server/routes/health.mjs:132`).
- **Format:** JSON (not Prometheus exposition format).
- **Fields emitted:**
  - `status`
  - `version` (`process.env.npm_package_version || "2.0.0"`)
  - `environment` (`process.env.NODE_ENV || "development"`)
  - `uptime.{seconds, formatted, startedAt}`
  - `database.{users, aiMessages}` (counts derived from `SELECT COUNT(*)` against `users` and `ai_messages` tables; gracefully falls through to `0` on query failure with `logger.warn`)
  - `memory.{heapUsedMB, heapTotalMB, rssMB}`
  - `node.{version, platform}`
- **Failure mode:** Returns `500 {error:"Failed to gather metrics"}` and emits `logger.error("Metrics error", …)`.

## Startup Logs

Emitted to stdout during normal boot, in observed order:

1. `[boot] mode=<development|production> (NODE_ENV=<value|<unset>>)` — `server/app.mjs:102`.
2. `[SPA] CLIENT_DIST = <resolved-path>` — `server/app.mjs:217`.
3. `[SERVER] Listening on port <PORT>` — `server/app.mjs:251` (inside `app.listen` callback).
4. `[SERVER] http://0.0.0.0:<PORT>` — `server/app.mjs:252`.

OpenTelemetry preload only emits if it fails:

- `[otel] preload skipped (continuing without tracing): <message>` — `server/observability/preload.mjs` (synchronous import failure).
- `[otel] startTracing() rejected asynchronously: <message>` — `server/observability/preload.mjs` (async rejection).

Graceful-shutdown lifecycle (emitted on SIGTERM/SIGINT, `server/app.mjs:255-278`):

- `[SERVER] <signal> received — initiating graceful shutdown`
- `[SERVER] graceful shutdown complete (<signal>)` — clean path
- `[SERVER] server.close error during <signal>: <err>` — error path
- `[SERVER] graceful shutdown timed out after 10s (<signal>) — forcing exit` — timeout path

SPA fallback emits on every catch-all hit (`server/app.mjs:232-233`):

- `[SPA ROUTE] <req.path>`
- `[SPA INDEX] <indexFile>`

Crash handlers (`server/app.mjs:5-20`):

- `UNCAUGHT ERROR: <err>` — `process.on('uncaughtException')`
- `UNHANDLED PROMISE: <err>` — `process.on('unhandledRejection')`
- Both follow up with a fire-and-forget PagerDuty alert via dynamic import of `server/observability/safetyAlerts.mjs` → `alertUncaught({kind, error})`. Neither calls `process.exit`.

## Runtime Verification Commands

Used to confirm a running app is healthy:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/healthz             # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health          # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/ready    # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/live     # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/metrics  # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/                    # → 200 (SPA)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/crisis              # → 200 (governance-mandated)
```

JSON inspection commands (smoke tests):

```bash
curl -s http://localhost:5000/api/health           | head -c 500
curl -s http://localhost:5000/api/health/metrics   | head -c 500
curl -s http://localhost:5000/api/health/detailed  | head -c 500
```

## Build Verification Commands

```bash
node --check server/app.mjs    # syntax gate
npm run build                  # → "✓ built in N.NNs" (Vite bundle to client/dist)
```

`package.json` scripts available:

| Script | Command | Purpose |
|---|---|---|
| `dev` | `node server/app.mjs` | Local dev start (no OTel preload) |
| `start` | `node server/app.mjs` | Equivalent to `dev` |
| `build` | `vite build` | Frontend bundle to `client/dist/` |
| `verify` | `bash scripts/verify.sh` | Declared but `scripts/verify.sh` is not present on disk (see **Known Non-Canonical Surfaces**) |
| `pretest` | `bash scripts/check-contract-routes.sh` | Declared but script not present on disk |
| `routes:manifest` | `node scripts/generate-route-manifest.mjs` | Declared but script not present on disk |
| `governor` | `bash scripts/governor/run-governor.sh` | Declared but script not present on disk |
| `governor:schema` | `bash scripts/governor/schema-validator.sh` | Declared but script not present on disk |
| `governor:contract` | `bash scripts/governor/api-contract-enforcer.sh` | Declared but script not present on disk |
| `governor:prompts` | `bash scripts/governor/prompt-registry-linter.sh` | Declared but script not present on disk |
| `governor:refactor-report` | `bash scripts/governor/auto-refactor-report.sh` | Declared but script not present on disk |

The deployment build pipeline (`.replit` `[deployment].build`) additionally references `node scripts/build-server.mjs`, which is also not present in the working tree. Existing `dist/` artifacts predate this state.

## Diagnostic Artifacts

Pre-existing diagnostic snapshots on disk (read-only inputs to humans/agents auditing the runtime):

`client/docs/diagnostics/`:

- `domain-firewall-scan.txt`
- `entrypoint-candidates.txt`
- `health-route-scan.txt`
- `listen-port-scan.txt`
- `node-version.txt`
- `npm-version.txt`
- `package.snapshot.json`
- `platform-tree.txt`
- `prompt-files.txt`
- `pwd.txt`
- `replit-nix.snapshot.txt`
- `replit.snapshot.txt`

`docs/governance/`:

- `MMHB_v7.4_ARCHIVAL_KERNEL.md` — governance kernel.
- `PHASE12_DRIFT_AUDIT.md` — historical drift audit.
- `runtime-topology.md` — companion canonical runtime topology document (created Phase C1).
- `PLATFORMSAFETYARCHITECTURE.md`, `V6_IMPLEMENTATION_SPEC.md`, `AVATAR_V4.2_EXECUTION_PLAN.md`.

`docs/registry/`:

- `db-schema.md`, `endpoints.md`, `feature-map.md`, `ui-routes.md`.

`docs/duplicates/`:

- `scan-latest.json`, `scan-latest.md` — most recent duplicate-file scan (1213 files scanned, 4 exact-duplicate groups, 52 name-duplicate groups, 0 shadow copies, 5 risky directories; timestamp `2026-01-26T16:56:34.822Z`).
- `collisions-latest.json`, `collisions-latest.md` — name-collision report.
- `decisions.md`, `locks.md`, `quarantine-log.md`, `README.md`.

`reports/`:

- `app-mounts.txt`, `auth-guest-history-final.txt`, `command-center-log.json`
- `crisis-csrf-verify-report.txt`, `crisis-entrypoints.txt`, `csrf-usage.txt`
- `db-entrypoints.txt`, `drift-audit.txt`
- `final-e2e-verification.txt`, `final-round-verify.txt`
- `incomplete-pages.md`, `live-crisis-facade-report.txt`
- `prod-final-verification.txt`, `rate-limit-usage.txt`
- `route-auth-usage.txt`, `route-files.txt`
- `routes.config.snapshot.json`, `routes.config.sha256`
- `routes.generated.json` (generated `2026-01-24T05:31:47.691Z`), `routes.generated.sha256`, `routes.perRouteHashes.json`
- `session-boundary-crisis-verify-report.txt`, `stable-checkpoint.txt`
- `wellness-shell-analysis.md`, `wellness-shell-patch-report.md`
- `admin-review/`, `governor/` (contains `auto-refactor-report.txt`, `canonical-runtime-promotion-plan.txt`, `archive-manifest.sh`), `keepers/`, `safe-doc-backups/`, `safe-mode/`

## Route Visibility

- **Generated route manifest:** `reports/routes.generated.json` (last generated `2026-01-24T05:31:47.691Z`).
- **Per-route hash ledger:** `reports/routes.perRouteHashes.json`.
- **Snapshot for drift comparison:** `reports/routes.config.snapshot.json` + matching `.sha256` digests.
- **Live route mount list:** `reports/route-files.txt` enumerates the active route module file paths.
- **Authoritative live order:** `server/app.mjs` (see `runtime-topology.md` — *Route Registration Order*).
- **Endpoint registry (human-readable):** `docs/registry/endpoints.md`.
- **The `routes:manifest` npm script that would regenerate these artifacts is declared but the underlying `scripts/generate-route-manifest.mjs` is not present on disk today.** Existing artifacts are last-known-good snapshots.

## Duplicate Detection Reports

- **Duplicate-file scan:** `docs/duplicates/scan-latest.json` and `scan-latest.md` — 1213 files, 4 exact-dup groups, 52 name-dup groups, 0 shadow copies, 5 risky directories, timestamp `2026-01-26T16:56:34.822Z`.
- **Collision report:** `docs/duplicates/collisions-latest.{json,md}`.
- **Decision log:** `docs/duplicates/decisions.md`.
- **Quarantine log:** `docs/duplicates/quarantine-log.md`.
- **Lock list:** `docs/duplicates/locks.md`.
- **Live duplicate-listen / duplicate-static guard:** `rg "\\.listen\\(" server/` and `rg "express\\.static" server/` — each returns exactly one live source hit (`server/app.mjs:247` and `:219` respectively); additional matches all live in inert backup files.

## Replit Visibility

From `.replit`:

- **Workflow:** `Start application` (mode parallel under `Project` run button).
  - Task: `shell.exec` with args `node --import ./server/observability/preload.mjs server/app.mjs`.
  - `waitForPort = 5000`.
  - `outputType = "webview"` (`[workflows.workflow.metadata]`).
- **Port map:**
  - `localPort 5000 → externalPort 80`
  - `localPort 5099 → externalPort 3001`
  - `localPort 24678 → externalPort 3000`
- **Deployment target:** `vm`.
- **Deployment build:** `npm ci --no-audit --no-fund && npm run build && node scripts/build-server.mjs`.
- **Deployment run:** `NODE_ENV=production exec node dist/server.mjs`.
- **Post-merge hook:** `scripts/post-merge.sh`, `timeoutMs = 20000`.
- **Build cache:** `node_modules`, `dist`, `.cache`.
- **Modules pinned:** `nodejs-20`, `postgresql-16`, `python-3.11`.
- **Nix channel:** `stable-25_05`; packages `tree`, `libwebp`, `lsof`.
- **Agent mode:** `expertMode = true`.

## Current Monitoring Guarantees

These properties hold today and are relied on:

- `GET /healthz` always responds `200 ok` synchronously, with `Cache-Control: no-store`, with no middleware in front of it.
- `GET /api/health` always returns full status JSON or `500 {status:"unhealthy"}` on probe failure; never crashes the process.
- Every `process.on('uncaughtException')` and `process.on('unhandledRejection')` event logs to stderr (`UNCAUGHT ERROR:` / `UNHANDLED PROMISE:`) and asynchronously dispatches a PagerDuty alert via `safetyAlerts.alertUncaught`. The process is not exited from these handlers.
- `SIGTERM` and `SIGINT` trigger `server.close()` then `process.exit(0)`; if `server.close` does not complete within 10 seconds the process force-exits with code `1`. The force timer is `.unref()`-ed.
- The structured logger (`server/utils/logger.mjs`) emits JSON when `NODE_ENV === "production"` and colored human-readable lines otherwise. All metadata is passed through `redactObject` (`server/utils/logRedaction.mjs`) before serialization.
- `req.requestId` (uuid) is stamped on every request by `server/middleware/requestId.mjs` (mounted `server/app.mjs:141`).
- AsyncLocalStorage observability context is mounted directly after the request-id middleware (`server/app.mjs:142`), exposed via `server/middleware/observabilityContext.mjs`.
- Sentry scopes are tagged with `requestId` at `server/utils/sentry.mjs:57-58`.
- OpenTelemetry tracing initialization (`server/observability/tracing.mjs`) is loaded via `--import` and wrapped in `try/catch` inside `server/observability/preload.mjs`; a missing OTel peer dependency surfaces as a warning, not a boot crash.
- Slow-request threshold (`SLOW_REQUEST_THRESHOLD_MS`, default `1000`) is read by the logger from env on import.
- Safety-class alert wrappers exist for: `alertCrisisPipelineFailure`, `alertPHQ9EscalationFailure`, `alertWebhookSignatureFailure`, `alertBiometricIngestionFailure`, `alertConstitutionalViolation`, `alertSchemaFailure`, `alertUncaught` (all in `server/observability/safetyAlerts.mjs`).
- The PagerDuty alerter (`server/observability/alerter.mjs`) exports `sendAlert`, `resolveAlert`, `getAlerterState`, `isAlerterDegraded`, `sendTestAlert`, and the constant `RECOVERY_WINDOW_MS`.
- Exactly one `app.listen()` and exactly one `express.static()` call execute at runtime — both in `server/app.mjs` (lines 247 and 219).

## Known Non-Canonical Surfaces

These exist or are referenced today but do not currently affect the live observability path:

- **`server/utils/logger.mjs` exports `requestLogger`** (lines 47–73). This middleware would emit per-request structured logs and warn on slow requests, but it is **not mounted in `server/app.mjs`**. There is currently no per-request access-log line emitted by the runtime.
- **Bare paths `/health`, `/ready`, `/live`, `/metrics`** are not registered as routes. They fall through to the SPA catch-all and return `200 text/html`. External monitors expecting JSON at those paths would silently pass.
- **`scripts/` directory is empty on disk.** The following scripts are referenced by `package.json` / `.replit` but do not exist in the working tree: `scripts/verify.sh`, `scripts/check-contract-routes.sh`, `scripts/generate-route-manifest.mjs`, `scripts/build-server.mjs`, `scripts/post-merge.sh`, `scripts/governor/*.sh`. Running their corresponding npm scripts (`npm run verify`, `npm run pretest`, `npm run routes:manifest`, `npm run governor`, etc.) will fail with `No such file or directory`. The deployment build (`node scripts/build-server.mjs`) likewise references an absent file.
- **`reports/routes.generated.json`** is dated `2026-01-24` — older than the last code change in this branch. It is a snapshot, not a live source of truth.
- **`docs/duplicates/scan-latest.{json,md}`** is dated `2026-01-26` and includes references to files that have since been archived under `.local/sweep/auth-cleanup/` (e.g., `server/services/tokens.mjs`). Treat as a historical snapshot.
- **OpenTelemetry preload is only active in the dev workflow.** Production deployment runs `node dist/server.mjs` without the `--import` flag, so OTel auto-instrumentation does not initialize in deployed builds via this path.
- **5 stale `server/app.mjs.backup*` / `BEFORE_FINAL_SPA_FIX` files** carry their own copies of crash handlers, `app.listen`, and `express.static`. They are not loaded by any run command but inflate the output of any `rg`/`grep` audit run without `--glob` exclusions.

## Do-Not-Modify Observability Areas

These surfaces are load-bearing and governed by `replit.md` + `runtime-topology.md`:

- `server/app.mjs:75-82` — fast-path `/healthz` handler. Must remain synchronous, dependency-free, and pre-middleware.
- `server/app.mjs:5-20` — `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers (must remain top-of-file; dynamic import of `safetyAlerts.mjs` avoids circular boot ordering).
- `server/app.mjs:141-142` — `requestId` and `observabilityContext` middleware mount order.
- `server/app.mjs:247` — single `app.listen(PORT, "0.0.0.0", …)` call.
- `server/app.mjs:255-278` — graceful-shutdown block (Observability O1).
- `server/observability/preload.mjs` — workflow `--import` target; renaming or moving breaks dev-mode tracing.
- `server/observability/tracing.mjs`, `safetyAlerts.mjs`, `alerter.mjs`, `otelApi.mjs`, `spans.mjs` — observability core; consumed dynamically by crash handlers.
- `server/middleware/requestId.mjs` — dynamic-import target at boot.
- `server/middleware/observabilityContext.mjs` — dynamic-import target at boot.
- `server/utils/logger.mjs` — referenced by `~20+ modules`; signature changes ripple system-wide.
- `server/routes/health.mjs` — `/api/health` JSON shape is a public contract for health-check tooling.
- `.replit` — workflow command, port map, deployment build/run commands.
- `package.json` — `dev`, `start`, and `build` scripts.

## Verification Commands

These commands were executed during creation of this document and form the canonical drift-check set:

```bash
# Syntax
node --check server/app.mjs                                                          # → OK

# Build
npm run build                                                                        # → ✓ built

# Health surface
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/healthz               # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health            # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/ready      # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/live       # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/metrics    # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/api/health/detailed   # → 200 when DB OK; 503 when DB down

# Single-listen / single-static guard (excluding inert backups)
rg -n "\\.listen\\("    server/ --glob '!*.backup' --glob '!*.BACKUP*' --glob '!*.BEFORE_*'
rg -n "express\\.static" server/ --glob '!*.backup' --glob '!*.BACKUP*' --glob '!*.BEFORE_*'

# Crash + signal handler presence
rg -n "uncaughtException|unhandledRejection|SIGTERM|SIGINT" server/app.mjs

# Health endpoint inventory
rg -n "router\\.(get|post|put|delete)" server/routes/health.mjs
```

Expected results: syntax `OK`; build `✓ built`; the four primary health probes all `200`; each `rg` for `.listen(` and `express.static` returns exactly one live hit in `server/app.mjs`; the crash-handler `rg` returns four distinct lines (lines 5, 14, 274, 275); the health endpoint inventory returns eight rows (`/`, `/ready`, `/live`, `/detailed`, `/metrics`, `/repair`, `/git-status`, `/platform-integrity`).
