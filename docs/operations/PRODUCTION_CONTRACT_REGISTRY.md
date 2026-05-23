# MMHB Production Endpoint Contract Registry

**Baseline established:** 2026-05-23 (Phase 48)
**Probe target:** `https://mymentalhealthbuddy.com`
**Authority:** MMHB v7.4 Governance Kernel (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Owner:** Operations / Release Engineering
**Review cadence:** every release that touches `server/app.mjs`, `server/routes/health.mjs`, `client/src/`, or any crisis content surface
**Related artifacts:**
- Phase 44 production canary baseline → `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 45 `/readyz` inspection → `docs/reports/PHASE_45_READYZ_CONTRACT_INSPECTION.md`
- Phase 46 `/readyz` JSON contract → `docs/reports/PHASE_46_READYZ_JSON_CONTRACT.md`
- Phase 47 post-deploy verify → `docs/reports/PHASE_47_POST_DEPLOY_READYZ_VERIFY.md`
- F-33.6 crisis fallback → `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`

---

## 0. Purpose

This registry is the **single source of truth** for what every public production endpoint of MyMentalHealthBuddy is contracted to return. Each entry defines:

- HTTP method(s) and status code
- Response size band (with tolerance)
- `Content-Type`
- `Cache-Control`
- Body shape (exact text, JSON shape, or content-literal requirements)
- Acceptable / required headers
- What constitutes a contract violation
- Owning source file and line range

Use this registry to:
1. **Author canary checks** — every contract below maps to a measurable assertion.
2. **Validate deploys** — re-run the assertions in §10 after every republish.
3. **Recognize promotion gaps** — when source on `main` advances but production lags, contract drift is the symptom (see Phase 47 for a worked example).
4. **Anchor incident response** — when an endpoint misbehaves, compare observed response to the contract row below to scope the regression.

Contracts are descriptive (what the deployed app guarantees today), not aspirational. Promote a row only after the deploy has been verified against it.

## 1. Endpoint inventory and contract status

| Endpoint | Verb(s) | Status | Source file:lines | Production deploy state (as of 2026-05-23) |
|---|---|---|---|---|
| `/` | GET | live | `server/app.mjs:334` (static) + `client/dist/index.html` | ✅ deployed |
| `/crisis` | GET | live | SPA route in `client/src/App.tsx` → served by static fallback | ✅ deployed |
| `/healthz` | GET, HEAD | live | `server/app.mjs:85-92` | ✅ deployed |
| `/ready` | GET | live | `server/app.mjs:308-311` | ✅ deployed |
| `/readyz` | GET | live (source); **pending republish** | `server/app.mjs:313-316` (commit `e1128bb22`) | ⏳ source on `main`, NOT yet promoted to production (Phase 47 §1) |
| `/api/health` | GET | live | `server/app.mjs:167` → `server/routes/health.mjs` | ✅ deployed |
| `/metrics` | GET | live | `server/app.mjs:318-332` | ✅ deployed |

## 2. Contract — `/`

| Field | Contract |
|---|---|
| **Methods** | GET (HEAD acceptable via static middleware) |
| **HTTP status** | `200` |
| **Size** | `10,652 B` ± **5 %** (`10,119` – `11,184` B) |
| **Content-Type** | `text/html; charset=UTF-8` |
| **Cache-Control** | `public, max-age=0` (express.static default — acceptable for SPA shell) |
| **Body** | Vite-built SPA shell (`client/dist/index.html`); contains `<!doctype html>` opener and `<title>MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love</title>` |
| **SHA256 (current build)** | `f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec` |
| **Required headers** | `strict-transport-security` (≥ 1 instance), `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, `content-security-policy` (Phase 41 lockdown) |
| **Required body literals** | §4 (F-33.6 crisis fallback set) — must be present in the bundled HTML/JS |
| **Owning code** | `server/app.mjs:334` (`express.static(CLIENT_DIST, …)`); build output `client/dist/index.html` |
| **Contract violation if** | HTTP ≠ 200; size outside band; `text/html` missing; SPA shell missing; any F-33.6 literal missing |

## 3. Contract — `/crisis`

| Field | Contract |
|---|---|
| **Methods** | GET |
| **HTTP status** | `200` |
| **Size** | `10,652 B` ± **5 %** (same SPA shell as `/`) |
| **Content-Type** | `text/html; charset=UTF-8` |
| **Cache-Control** | `public, max-age=0` |
| **Body** | byte-identical to `/` (same SPA shell); client-side routing renders the `/crisis` view in-browser |
| **SHA256 (current build)** | `f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec` (must match `/`) |
| **Required headers** | same as `/` |
| **Required body literals** | §4 (F-33.6 crisis fallback) — **mandatory** on this endpoint specifically; failure here is a P0 launch blocker |
| **Owning code** | `server/app.mjs:329-334` (SPA catch-all); `client/src/App.tsx` (`/crisis` route definition); `client/src/pages/crisis.tsx` (page component) |
| **Contract violation if** | HTTP ≠ 200; size outside band; SHA256 ≠ `/`; any F-33.6 literal missing; `text/html` missing |

## 4. Crisis fallback literal requirements (F-33.6)

The bundled production HTML/JS payload that backs **both `/` and `/crisis`** must contain all of the following text literals. This is the BHCE (Behavioral Healing Crisis Escalation) hard contract from the v7.4 governance kernel — if a user lands anywhere on the site with JavaScript disabled or before the SPA hydrates, the crisis hotline numbers must still be human-readable in the page source.

| # | Literal | Purpose | Confirmed live (Phase 44, re-confirmed Phase 48) |
|---|---|---|---|
| 1 | `988` | US Suicide & Crisis Lifeline (phone) | ✅ present in `client/dist/index.html` |
| 2 | `741741` | Crisis Text Line short code | ✅ present |
| 3 | `911` | US emergency dispatch | ✅ present |
| 4 | `/crisis` | in-app crisis route literal — guarantees the SPA can self-link to its crisis page | ✅ present |
| 5 | `Crisis Text Line` | descriptive label for the 741741 short code | ✅ present |

### 4.1 Verification command

```
$ curl -sS https://mymentalhealthbuddy.com/crisis \
    | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' \
    | sort -u | wc -l
5     ← required
```

### 4.2 Contract rules

- **Asymmetric risk:** an extra hotline literal is harmless; a missing one is a P0. Err toward over-inclusion.
- **No removal without explicit governance approval.** Any PR that strips one of these literals must be flagged for v7.4 kernel review before merge.
- **Bundle-level audit, not source-level:** the literals must survive minification and tree-shaking. Verify against `client/dist/index.html` (and any chunk it loads), not against `client/src/`.
- **Both `/` and `/crisis` must pass.** Since they share an HTML shell today, a single check suffices — but if a future build emits a separate `/crisis` shell, both endpoints must be tested independently.
- **Hash anchor:** the SPA shell SHA256 `f34157b3…` is the current build's fingerprint. After every rebuild, recompute and update the SHA256 in §2 and §3. The hash must be **identical** between `/` and `/crisis` while they share a bundle.

## 5. Contract — `/healthz` (liveness probe)

| Field | Contract |
|---|---|
| **Methods** | GET, **HEAD** |
| **HTTP status** | `200` |
| **Size** | exactly `2 B` (GET); `0 B` (HEAD) |
| **Content-Type** | `text/plain; charset=utf-8` (GET); unset (HEAD) |
| **Cache-Control** | `no-store` |
| **Body** | literal `ok` (GET); empty (HEAD) |
| **Required headers** | `cache-control: no-store`; `x-powered-by: Express` is **expected** here (handler is pre-middleware, before helmet strips it) |
| **Owning code** | `server/app.mjs:85-92` |
| **Purpose** | sub-millisecond liveness signal for deploy platform; runs **before** any other middleware (rate-limit, security, DB) so cold-start probes succeed |
| **Contract violation if** | HTTP ≠ 200; body ≠ `ok` on GET; size > 2 B on GET; `cache-control` not `no-store`; HEAD does not return 200 with empty body |
| **Must NOT** | acquire any DB connection, invoke any async I/O, parse any cookies, or run any business logic. Stays synchronous and dependency-free by governance contract. |

## 6. Contract — `/ready` (readiness — JSON)

| Field | Contract |
|---|---|
| **Methods** | GET |
| **HTTP status** | `200` |
| **Size** | **57 B** ± **30 %** (`40` – `74` B) — variance dominated by `timestamp` ISO width |
| **Content-Type** | `application/json; charset=utf-8` |
| **Cache-Control** | `no-store` |
| **Body** | JSON matching `{"status":"ready","timestamp":"<ISO8601 UTC>"}` |
| **Body regex** | `^\{"status":"ready","timestamp":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z"\}$` |
| **Required headers** | `cache-control: no-store`; absent `x-powered-by` (helmet strips it on post-middleware routes) |
| **Owning code** | `server/app.mjs:308-311` |
| **Purpose** | readiness — the app process is warm enough to serve traffic |
| **Contract violation if** | HTTP ≠ 200; body fails regex; `status` ≠ `"ready"`; `timestamp` not parseable as ISO-8601 UTC; `Content-Type` not JSON; `Cache-Control` not `no-store` |

## 7. Contract — `/readyz` (readiness alias — JSON)

| Field | Contract |
|---|---|
| **Methods** | GET |
| **HTTP status** | `200` |
| **Size** | **57 B** ± **30 %** (`40` – `74` B) |
| **Content-Type** | `application/json; charset=utf-8` |
| **Cache-Control** | `no-store` |
| **Body** | JSON matching `{"status":"ready","timestamp":"<ISO8601 UTC>"}` — **byte-for-byte identical shape to `/ready`** |
| **Body regex** | `^\{"status":"ready","timestamp":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z"\}$` |
| **Required headers** | `cache-control: no-store`; absent `x-powered-by` |
| **Owning code** | `server/app.mjs:313-316` (commit `e1128bb22`) |
| **Purpose** | Kubernetes-convention readiness alias; mirrors `/ready` so external probes can use either path |
| **Deploy state** | ⏳ **PENDING REPUBLISH as of 2026-05-23 02:00 UTC.** Currently still returns the pre-fix SPA shell in production (10,652 B `text/html`, `public, max-age=0`) — see Phase 47 §3.1. Promote this row's `live` status only after a successful Phase 47 re-run. |
| **Contract violation if** | (post-republish) HTTP ≠ 200; body fails regex; size outside band; `Content-Type` not JSON; `Cache-Control` not `no-store`; or response equals the SPA shell (10,652 B `text/html`) which indicates the route is unregistered and falling through to `express.static` |

## 8. Contract — `/api/health` (full structured status)

| Field | Contract |
|---|---|
| **Methods** | GET |
| **HTTP status** | `200` when `database.connected: true` and `ai.available: true`; degraded statuses TBD by `server/routes/health.mjs` |
| **Size** | `~430` B ± **30 %** (`300` – `560` B) — variance from `uptime`/`startedAt`/`memory` numeric width |
| **Content-Type** | `application/json; charset=utf-8` |
| **Cache-Control** | unset (deliberate — proxy may cache for 0s) |
| **Body shape (required keys)** | `status`, `environment`, `version`, `uptime`, `uptimeFormatted`, `startedAt`, `database.connected`, `ai.available`, `softLaunch`, `platform.totalTools`, `platform.totalRoutes`, `platform.adminPages`, `services.stripe`, `services.resend`, `services.perplexity`, `services.sentry`, `memory.heapUsedMB`, `memory.heapTotalMB`, `memory.rssMB`, `node` |
| **Body invariants (production)** | `status: "healthy"`; `environment: "production"`; `database.connected: true`; `softLaunch: false`; `platform.totalTools: 127`; `platform.totalRoutes: 127`; `platform.adminPages: 27`; `node: "v20.20.0"` (matches deploy runtime) |
| **Owning code** | `server/app.mjs:167` mounts → `server/routes/health.mjs` |
| **Purpose** | rich structured status for ops dashboards; doubles as a forensic anchor (`startedAt` reveals deploy promotion gaps — see Phase 47 §3.4) |
| **Contract violation if** | HTTP ≠ 200 with no degraded-status reason; any required key missing; `status` not in `{"healthy", "degraded"}`; `environment` ≠ `"production"`; `database.connected: false` with no incident filed; `platform.totalTools` deviates ± 5 from baseline (route-count drift requires conscious approval) |

### 8.1 Diagnostic use — detecting a promotion gap

If a fix is committed at time `T_fix` but `/api/health` reports `startedAt < T_fix`, the deploy has not been republished since the fix. This pattern surfaced Phase 47's gap (`startedAt: 2026-05-23T00:41:32.434Z` vs fix at `01:44:01Z` → 62 m 29 s stale).

## 9. Contract — `/metrics`

| Field | Contract |
|---|---|
| **Methods** | GET |
| **HTTP status** | `200` |
| **Size** | `~200` B ± **30 %** (`140` – `260` B) — variance from numeric widths |
| **Content-Type** | `application/json; charset=utf-8` |
| **Cache-Control** | `no-store` |
| **Body shape (required keys)** | `uptime` (integer seconds), `memory.heapUsedMB`, `memory.heapTotalMB`, `memory.rssMB` (all rounded MB), `node_version` (e.g. `"v20.20.0"`), `timestamp` (ISO-8601 UTC), `environment` (`"production"` or `"development"`) |
| **Body regex (timestamp)** | `"timestamp":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z"` |
| **Owning code** | `server/app.mjs:318-332` |
| **Purpose** | lightweight process-level metrics; used by canary tooling for trend lines (memory growth, restart detection via `uptime` resets) |
| **Contract violation if** | HTTP ≠ 200; any required key missing; `Content-Type` not JSON; `Cache-Control` not `no-store`; `node_version` not matching deploy runtime (`v20.20.0` today) |

## 10. Canary assertion suite (executable verification of this registry)

Each contract above maps to one or more assertions runnable from any shell with `curl` + `grep`/`jq`. Suite is intended for post-deploy verification and continuous monitoring. Pass = green; fail = re-open the relevant phase or open a new one.

```bash
BASE="https://mymentalhealthbuddy.com"
PASS=0; FAIL=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; PASS=$((PASS+1)); else echo "FAIL $1 (expected=$2 got=$3)"; FAIL=$((FAIL+1)); fi; }

# §2 /
check "/_http_200" 200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/)"
check "/_ct_html"  "text/html; charset=UTF-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/)"

# §3 /crisis
check "/crisis_http_200" 200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/crisis)"
check "/crisis_ct_html"  "text/html; charset=UTF-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/crisis)"

# §4 F-33.6 literals (must equal 5)
check "f33.6_literals_count" 5 "$(curl -sS $BASE/crisis | grep -oE '(988|741741|911|/crisis|Crisis Text Line)' | sort -u | wc -l | tr -d ' ')"

# §5 /healthz
check "/healthz_http_200"  200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/healthz)"
check "/healthz_body_ok"   "ok" "$(curl -sS $BASE/healthz)"
check "/healthz_size_2"    2   "$(curl -sS -o /dev/null -w '%{size_download}' $BASE/healthz)"

# §6 /ready
check "/ready_http_200"    200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/ready)"
check "/ready_ct_json"     "application/json; charset=utf-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/ready)"
curl -sS $BASE/ready | grep -qE '^\{"status":"ready","timestamp":"[0-9TZ:.-]+"\}$' \
  && echo "PASS /ready_body_regex" || echo "FAIL /ready_body_regex"

# §7 /readyz (POST-REPUBLISH ONLY — current production fails this set, see Phase 47)
check "/readyz_http_200"   200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/readyz)"
check "/readyz_ct_json"    "application/json; charset=utf-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/readyz)"
curl -sS $BASE/readyz | grep -qE '^\{"status":"ready","timestamp":"[0-9TZ:.-]+"\}$' \
  && echo "PASS /readyz_body_regex" || echo "FAIL /readyz_body_regex"

# §8 /api/health
check "/api/health_http_200" 200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/api/health)"
check "/api/health_ct_json"  "application/json; charset=utf-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/api/health)"
curl -sS $BASE/api/health | grep -q '"database":{"connected":true}' \
  && echo "PASS /api/health_db_connected" || echo "FAIL /api/health_db_connected"
curl -sS $BASE/api/health | grep -q '"environment":"production"' \
  && echo "PASS /api/health_env_prod" || echo "FAIL /api/health_env_prod"

# §9 /metrics
check "/metrics_http_200" 200 "$(curl -sS -o /dev/null -w '%{http_code}' $BASE/metrics)"
check "/metrics_ct_json"  "application/json; charset=utf-8" "$(curl -sS -o /dev/null -w '%{content_type}' $BASE/metrics)"

echo "---"
echo "Total: $((PASS+FAIL))  Pass: $PASS  Fail: $FAIL"
```

Expected today: **15 PASS / 3 FAIL** (the 3 `/readyz` assertions fail until republish — see Phase 47).
Expected post-republish: **18 PASS / 0 FAIL**.

## 11. Change-control rules

| Action | Required process |
|---|---|
| Add a new endpoint to this registry | Open a phase; capture the live response; promote the row only after deploy-verified |
| Tighten a tolerance | Doc-only PR; reference the phase report establishing the new bound |
| Loosen a tolerance | Requires Sr review; document the runtime variability that justified the loosening |
| Remove a required body literal (especially §4) | **Governance kernel review required.** F-33.6 literals are P0 launch blockers; removal needs explicit approval |
| Rename / remove an endpoint | Open a deprecation phase; provide ≥ 30 days of soft-fail logging before contract removal |
| Promote `/readyz` row from "pending republish" to "live" | Run §10 canary, require all 18 PASS, link the passing-run report from the row's `Deploy state` cell |

## 12. Promotion checklist — `/readyz` (open as of 2026-05-23)

- [ ] User triggers republish via Replit Deployments panel
- [ ] Wait for deploy completion + `/api/health` `startedAt` advances past `2026-05-23T01:44:01Z`
- [ ] Run §10 canary suite — all 18 assertions PASS
- [ ] Recalibrate Phase 44 `/readyz` canary tolerance from `10,652 B ± 5%` to `~57 B ± 30%` with §7 body regex
- [ ] Update §7 `Deploy state` row to `✅ deployed` with the verifying phase reference
- [ ] Open a new phase report capturing the passing canary run

---

*Registry baseline complete. 7 endpoints documented, 5 F-33.6 crisis literals enumerated, 18-assertion canary suite provided. Current production state: 15 of 18 assertions PASS; the 3 `/readyz` JSON-contract assertions remain pending republish (Phase 47 §1). Promote contract-state rows only after deploy-verified per §11.*
