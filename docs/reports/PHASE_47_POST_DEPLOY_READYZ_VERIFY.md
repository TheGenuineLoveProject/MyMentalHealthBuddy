# MMHB Phase 47 — Post-Deploy `/readyz` Production Verification

**Generated:** 2026-05-23 01:59:56 UTC
**Probe target:** `https://mymentalhealthbuddy.com` (production)
**Mode:** **verification / documentation only.** No source edits, no refactor, no auth / database / UI / routes / deployment config / `.replit` / infrastructure / dependency changes.
**HEAD on main:** `368dd1ce4` *Add a readiness check endpoint for the application* (Phase 46 platform checkpoint)
**Production server uptime:** 4716 s (≈ 1 h 18 m 36 s), startedAt `2026-05-23T00:41:32.434Z`
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary — REDEPLOY HAS NOT YET OCCURRED

The Phase 46 `/readyz` JSON contract is committed on `main` (commit `e1128bb22`, platform checkpoint `368dd1ce4`), but **production has not been redeployed since the fix landed**. The production server's `startedAt` timestamp is `2026-05-23T00:41:32.434Z`, which is **1 hour 2 minutes 29 seconds before** commit `e1128bb22` (`01:44:01.000Z`). The currently-running deploy is still serving the pre-fix build.

Consequently, the four Phase 47 acceptance criteria for the new `/readyz` JSON contract fail in production:

| Acceptance criterion | Result | Evidence |
|---|---|---|
| Task 2 — `/readyz` HTTP 200 | ✅ PASS (technically) | HTTP/2 200 — but only because the SPA static fallback returns 200, not because the new JSON handler is responding |
| Task 3 — `/readyz` JSON body includes `status: ready` | ❌ **FAIL** | Body is `<!doctype html>…` — 10,652 B SPA shell, no JSON, no `status` field |
| Task 4 — `/readyz` `Cache-Control: no-store` | ❌ **FAIL** | Header is `cache-control: public, max-age=0` (express.static default, not the explicit `no-store` from the new handler) |

The three pre-existing endpoints (`/ready`, `/healthz`, `/api/health`) **all behave correctly** because they were present in the deployed build — confirming the deploy itself is healthy and the only gap is the missing republish to promote the new commits.

**Action required by user (outside this phase's scope):** trigger a republish via the Replit Deployments panel. Once the redeploy completes, re-run this Phase 47 protocol to confirm the new contract is live. Same operational pattern as the Phase 37 → 38 cycle.

## 2. Endpoint matrix — observed at 2026-05-23 01:59:56 UTC

| Endpoint | HTTP | Size | Content-Type | Cache-Control | `x-powered-by` | Body shape |
|---|---|---|---|---|---|---|
| `/readyz` | **200** | **10,652 B** | **`text/html; charset=UTF-8`** | **`public, max-age=0`** | absent (static middleware path) | SPA `<!doctype html>` shell |
| `/ready` | 200 | 57 B | `application/json; charset=utf-8` | `no-store` | absent | `{"status":"ready","timestamp":"2026-05-23T01:59:56.173Z"}` |
| `/healthz` | 200 | 2 B | `text/plain; charset=utf-8` | `no-store` | **Express** (explicit route, pre-middleware) | `ok` |
| `/api/health` | 200 | 433 B | `application/json; charset=utf-8` | absent | absent | full JSON status (see §3.4) |

`/readyz` matches the static-middleware signature exactly: no `x-powered-by`, identical 10,652 B body to `/`, `last-modified` from the build artifact (`Sat, 23 May 2026 00:38:15 GMT`), `etag: W/"299c-19e5244b4d8"`. This is the same response Phase 44 baselined and Phase 45 inspected — the new handler has not yet been promoted to production.

## 3. Per-endpoint detail

### 3.1 `/readyz` — pre-fix SPA shell still active

```
HTTP/2 200
cache-control: public, max-age=0
content-length: 10652
content-type: text/html; charset=UTF-8
etag: W/"299c-19e5244b4d8"
last-modified: Sat, 23 May 2026 00:38:15 GMT
strict-transport-security: max-age=63072000; includeSubDomains
strict-transport-security: max-age=31536000; includeSubDomains
x-request-id: d182acff-6131-4d59-93ee-5de6a535e37a
via: 1.1 google
…

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love</title>
    …
```

- HTTP 200 (Task 2 — technically PASS, but trivially: any path that falls through to the SPA static handler returns 200)
- JSON body — **FAIL**: body is HTML, contains no `status` field, no `timestamp` field
- `cache-control: no-store` — **FAIL**: header is `public, max-age=0` (express.static default)
- `last-modified` timestamp (`Sat, 23 May 2026 00:38:15 GMT`) is byte-identical to the Phase 44 / Phase 45 / Phase 46 baselines — the response has not changed since 01:38 GMT, confirming no redeploy

### 3.2 `/ready` — sibling control endpoint, confirms deploy is healthy

```
HTTP/2 200
cache-control: no-store
content-type: application/json; charset=utf-8
content-length: 57
etag: W/"39-hO5oWDJdihJQ4YFScT78o0mQ9ao"

{"status":"ready","timestamp":"2026-05-23T01:59:56.173Z"}
```

Exactly the response we expected `/readyz` to produce. This proves:
1. The Express app process is alive and serving JSON correctly.
2. The `cache-control: no-store` header path works end-to-end (helmet/CSP middleware does not strip it).
3. The deploy itself is not broken — only the new `/readyz` route is missing from the running build.

### 3.3 `/healthz` — liveness probe, unchanged

```
HTTP/2 200
cache-control: no-store
content-type: text/plain; charset=utf-8
content-length: 2
x-powered-by: Express
strict-transport-security: max-age=63072000; includeSubDomains

ok
```

2-byte plain-text `ok`, exactly as defined at `server/app.mjs:85-92`. `x-powered-by: Express` is present because this is the pre-middleware ultra-cheap liveness handler. Untouched by the Phase 46 work, as expected.

### 3.4 `/api/health` — full structured status, **smoking-gun evidence of stale deploy**

```
HTTP/2 200
content-type: application/json; charset=utf-8
content-length: 433

{
  "status": "healthy",
  "environment": "production",
  "version": "2.0.0",
  "uptime": 4716,
  "uptimeFormatted": "1h 18m 36s",
  "startedAt": "2026-05-23T00:41:32.434Z",
  "database": { "connected": true },
  "ai": { "available": true },
  "softLaunch": false,
  "platform": { "totalTools": 127, "totalRoutes": 127, "adminPages": 27 },
  "services": { … (truncated by curl capture window) }
}
```

The `startedAt` timestamp is **`2026-05-23T00:41:32.434Z`**. The Phase 46 fix commit landed at **`2026-05-23T01:44:01.000Z`**. The deployed server process is therefore **62 minutes, 29 seconds older than the fix commit**, which means the deploy has not been restarted/redeployed since the patch was pushed.

Database (`connected: true`) and AI (`available: true`) checks both pass — confirming the runtime is otherwise healthy. The only gap is the missing republish.

## 4. Reconciliation against expected post-deploy contract

The Phase 46 §5 republish contract specified:

| Property | Expected (post-republish) | Observed (current) | Match? |
|---|---|---|---|
| HTTP | 200 | 200 | ✅ |
| Size | ~57 B (± 30%) | 10,652 B | ❌ |
| Content-Type | `application/json; charset=utf-8` | `text/html; charset=UTF-8` | ❌ |
| Body regex `^\{"status":"ready","timestamp":"\d{4}-\d{2}-\d{2}T.+Z"\}$` | match | does not match (HTML body) | ❌ |
| Cache-Control | `no-store` | `public, max-age=0` | ❌ |
| `last-modified` | unset or fresh (~now) | `Sat, 23 May 2026 00:38:15 GMT` (unchanged across phases) | ❌ |
| `x-powered-by: Express` | absent (mounted after helmet) | absent (but for the wrong reason — static-middleware path) | ⚠️ ambiguous |

5 of 7 contract properties fail. The remaining 2 (HTTP code, absent `x-powered-by`) match for incidental reasons unrelated to the new handler — both behaviors are coincidentally exhibited by the static-fallback path that is currently serving `/readyz`.

## 5. What is NOT broken

This phase is reporting a **promotion gap**, not a regression. The following confirm the system is otherwise healthy:

- ✅ Database connected, AI available, all 127 routes loaded, soft-launch disabled
- ✅ `/ready` returns the exact JSON `/readyz` should return (proves the handler pattern works end-to-end)
- ✅ `/healthz` returns 2-byte liveness as designed
- ✅ `/api/health` returns full structured status
- ✅ Phase 44 canary baseline (6/6 endpoints HTTP 200) remains intact — `/readyz` still returns 200, just with the old contract
- ✅ Crisis-routing literals (F-33.6, Phase 37) still present in deployed `index.html` (10,652 B, SHA256 `f34157b3…` consistent across phases 37 → 47)
- ✅ Source state on `main` is correct: `server/app.mjs:313-316` contains the `/readyz` JSON handler

The only outstanding action is the redeploy itself, which is the user's manual trigger.

## 6. Phase 47 task compliance

| Task | Result | Notes |
|---|---|---|
| Task 1 — Curl `/readyz`, `/ready`, `/healthz`, `/api/health` | ✅ all four captured, raw responses saved to `.local/phase47-verify/*.full` | full headers + bodies in §2-§3 |
| Task 2 — Confirm `/readyz` HTTP 200 | ✅ PASS (200 returned, but via static fallback — see §3.1) | acceptance met by letter; not by spirit |
| Task 3 — Confirm `/readyz` JSON body includes `status: ready` | ❌ **FAIL** | body is HTML SPA shell, no JSON, no `status` field |
| Task 4 — Confirm `/readyz` `Cache-Control: no-store` | ❌ **FAIL** | header is `public, max-age=0` |
| Task 5 — Generate this report | ✅ this file |
| Task 6 — Commit report only | ✅ via platform checkpoint on `main` (this is the only new artifact) |
| Task 7 — Stop | ✅ §8 |

## 7. Strict-mode compliance

| Rule | Compliance |
|---|---|
| Do not modify source code | ✅ zero source touches |
| Do not refactor | ✅ zero |
| Do not touch auth / database / UI / routes / deployment config / infrastructure / dependencies / `.replit` | ✅ none touched |
| Generate report only | ✅ only this report (`.local/phase47-verify/*.full` are local diagnostic captures, gitignored under `.local/`) |

## 8. Launch state and next action

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
PROD /readyz CONTRACT:        ❌ FAIL (HTML SPA shell, 10,652 B) — redeploy required
PROD /ready CONTRACT:         ✅ PASS (JSON, 57 B, status:ready, no-store)
PROD /healthz CONTRACT:       ✅ PASS (text/plain "ok", 2 B)
PROD /api/health CONTRACT:    ✅ PASS (433 B JSON, database+AI healthy, uptime 4716s)
DEPLOY UPTIME:                4716 s — older than fix commit by 62 m 29 s
SECURITY POSTURE:             S0 HOLD (unchanged)
MAIN HEAD:                    368dd1ce4 (Phase 46 platform checkpoint)
NEW SOURCE EDITS:             0
NEW DOC ARTIFACTS:            1 (this report)
NEXT ACTION:                  user triggers a republish via the Replit Deployments panel;
                              once redeploy completes, re-run this Phase 47 protocol to confirm
                              the new contract is live. After PASS, recalibrate the Phase 44
                              /readyz canary tolerance from 10,652 B ± 5% to ~57 B ± 30% with
                              the JSON body regex from §4.
```

## 9. References

- Phase 44 (production canary baseline; tolerance to recalibrate post-republish): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Phase 45 (`/readyz` contract inspection — identified the omission): `docs/reports/PHASE_45_READYZ_CONTRACT_INSPECTION.md`
- Phase 46 (`/readyz` JSON contract applied on `main`): `docs/reports/PHASE_46_READYZ_JSON_CONTRACT.md`
- Phase 37 → 38 republish-gap precedent: `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`, `docs/reports/PHASE_38_DEPLOYED_CRISIS_FALLBACK_VERIFY.md`
- Source — `/readyz` handler (on main, not yet deployed): `server/app.mjs:313-316`
- Source — `/ready` handler (deployed and serving correctly): `server/app.mjs:308-311`
- Source — `/healthz` handler (deployed, pre-middleware liveness): `server/app.mjs:85-92`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`
- Local diagnostic captures (gitignored): `.local/phase47-verify/readyz.full`, `ready.full`, `healthz.full`, `api_health.full`

---

*Phase 47 post-deploy verification complete. Production has NOT been redeployed since Phase 46 — the running server's `startedAt` (`2026-05-23T00:41:32.434Z`) precedes the fix commit `e1128bb22` (`2026-05-23T01:44:01.000Z`) by 62 m 29 s. `/readyz` consequently still serves the pre-fix 10,652 B SPA HTML shell with `cache-control: public, max-age=0` — fails 5 of 7 contract properties (passes only HTTP-code and the incidental absent-`x-powered-by`, both for static-fallback reasons). Sibling endpoints `/ready`, `/healthz`, `/api/health` all PASS, confirming the running deploy is otherwise healthy. Action required: user triggers a republish, then re-run this Phase 47 protocol. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
