# MMHB Phase 45 — `/readyz` Readiness Contract Inspection

**Generated:** 2026-05-23 01:34:48 UTC
**Probe target:** `https://mymentalhealthbuddy.com` (production)
**Mode:** **inspection / documentation only.** No source edits, no refactor, no auth / database / routes / UI app code / deployment config / infrastructure / `.replit` changes.
**Main HEAD:** `e46d969b6` — *docs(security): phase 41 remediation plan* (unchanged)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

**`/readyz` has no route handler in `server/app.mjs`.** It falls through the entire middleware stack to the `express.static(CLIENT_DIST)` handler at line 329 and is served the SPA `index.html` (10,652 B, byte-identical to `/` and `/crisis` — same SHA256 `f34157b3…`). The response is HTTP 200, but the body is HTML, not a readiness JSON payload. This means `/readyz` currently functions as a "the server is up enough to serve the static SPA shell" probe — useful as a liveness signal, **not** as a readiness signal.

This is a **route omission**, not a regression. The codebase has well-established sibling routes (`/healthz`, `/ready`, `/metrics`, `/health`, `/live`) registered explicitly at the top of `server/app.mjs`; `/readyz` is simply missing from the set. The smallest safe future fix is a **4-line additive insertion** mirroring the existing `/ready` handler. No refactor, no removal, no change to existing routes — defer to a separate, scoped future phase.

| Question | Answer |
|---|---|
| Is `/readyz` registered as a route? | **No.** Zero matches in `server/`, `client/`, `tools/`, `scripts/`. |
| What is the actual response? | HTTP 200, `Content-Type: text/html`, 10,652 B SPA shell HTML |
| Is `/healthz` registered? | Yes — `server/app.mjs:85` (GET) + `:89` (HEAD) |
| Is `/api/health` registered? | Yes — `server/app.mjs:167` mounts `healthRoutes` from `server/routes/health.mjs` |
| Smallest safe fix | 4-line additive `app.get("/readyz", …)` mirroring the existing `/ready` handler at lines 308-311 |
| Current launch impact | **None.** Endpoint returns 200, satisfies the canary HTTP-code check. The phrase "should return readiness JSON" is a design preference, not a launch blocker. |

## 2. Production observation — what `/readyz` actually serves

```
$ curl -sS -i https://mymentalhealthbuddy.com/readyz
HTTP/2 200
cache-control: public, max-age=0
content-length: 10652
content-type: text/html; charset=UTF-8
etag: W/"299c-19e5244b4d8"
last-modified: Sat, 23 May 2026 00:38:15 GMT
content-security-policy: …
strict-transport-security: max-age=63072000; includeSubDomains
strict-transport-security: max-age=31536000; includeSubDomains   ← two HSTS headers (proxy + app)
…
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love</title>
    …
```

### Byte-identical-to-SPA proof

```
SHA256:
  /readyz   → f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec
  /         → f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec
  /crisis   → f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec
```

All three identical. `/readyz` is being served by the `express.static(CLIENT_DIST, { index: "index.html" })` handler at `server/app.mjs:329`, then by the SPA catch-all `app.get("*", ...)` at `:333` for non-static paths — same fallthrough as a 404'd route in this app's design.

### Telltale: no `x-powered-by: Express` header

```
/readyz       → no x-powered-by header  (static-file middleware path)
/healthz      → x-powered-by: Express    (explicit route handler)
/api/health   → no x-powered-by header  (router-mounted)
```

Helmet strips `x-powered-by` on the routes that flow through the security middleware (mounted at line 123). The fact that `/readyz` matches the static-file profile and not the `/healthz` profile is consistent with "no explicit handler — falls through to static."

### Non-blocking sub-observation: duplicate HSTS

Both `/readyz` and `/crisis` show **two** `strict-transport-security` headers (63072000 and 31536000). This indicates HSTS is being set at both the platform proxy layer and the Helmet layer in app code. Harmless behaviorally (browsers honor the longest `max-age`), but worth logging for a future hardening pass. Not a Phase 45 deliverable.

## 3. Endpoint contrast (proves the omission)

| Endpoint | Source | Body | Content-Type | `x-powered-by` |
|---|---|---|---|---|
| `/healthz` | `server/app.mjs:85` GET + `:89` HEAD | `ok` (2 B) | `text/plain; charset=utf-8` | **Express** (explicit handler) |
| `/api/health` | `server/app.mjs:167` → `server/routes/health.mjs` | structured JSON (430 B) | `application/json; charset=utf-8` | absent (router) |
| `/ready` | `server/app.mjs:308-311` | `{"status":"ready","timestamp":…}` | `application/json` | absent (registered before helmet exposure) |
| `/metrics` | `server/app.mjs:313-327` | JSON (uptime, memory, node, env) | `application/json` | absent |
| **`/readyz`** | **(none — not registered)** | **SPA shell (10,652 B)** | **`text/html`** | **absent (static middleware)** |

`/readyz` is the only one in the canonical health-probe family that is missing a handler.

## 4. Codebase grep results (source of truth)

### 4.1 `/readyz`

```
$ rg -n "readyz" server/ client/ tools/ scripts/
(no matches)
```

**Zero matches anywhere in source.** Not in route definitions, not in tests, not in tooling.

### 4.2 `/healthz`

```
$ rg -n "healthz" server/
server/app.mjs:85:app.get("/healthz", (_req, res) => {
server/app.mjs:89:app.head("/healthz", (_req, res) => {
server/app.mjs:290:// /healthz and /api/health/* — these guards return 404 + JSON pointing to
```

Handler block (lines 80-92), pre-middleware so the deploy platform's port-open / liveness probe gets HTTP 200 inside microseconds even during cold start:

```js
// 80  // rate-limit, DB) so the deployment platform's port-open / liveness probe
// 81  // receives a 200 within microseconds even if the rest of the boot chain is
// 82  // still warming up. Belt-and-suspenders for cold-start health-check timeouts
// 83  // on Autoscale; no-op overhead on Reserved VM. Do NOT add logic here — it
// 84  // must stay synchronous and dependency-free to keep its purpose intact.
   85  app.get("/healthz", (_req, res) => {
   86    res.set("Cache-Control", "no-store");
   87    res.status(200).type("text/plain").send("ok");
   88  });
   89  app.head("/healthz", (_req, res) => {
   90    res.set("Cache-Control", "no-store");
   91    res.status(200).end();
   92  });
```

### 4.3 `/api/health`

```
$ rg -n "['\"]/api/health['\"]" server/
server/app.mjs:167:app.use("/api/health", healthRoutes);
server/app.mjs:299:  "/health": "/api/health",
```

Mounted as a full router from `server/routes/health.mjs`.

### 4.4 Existing bare-alias precedent (immediate model for the `/readyz` fix)

`server/app.mjs:308-311`:

```js
app.get("/ready", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});
```

Comment block above it (`:287-:297`) explicitly notes "/ready and /metrics are exposed as bare 200 aliases per Phase 9A spec." `/readyz` was not part of that Phase 9A spec — that is the historical reason it was never registered.

## 5. Smallest safe future fix — proposal (NOT applied this phase)

### 5.1 Recommended patch (4 lines, additive only)

Insert immediately after the existing `/ready` handler (after line 311 of `server/app.mjs`), mirroring the same shape so the surrounding code style and behavior stay uniform:

```js
app.get("/readyz", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});
```

### 5.2 Properties of this fix

| Property | Value |
|---|---|
| Lines added | 4 |
| Lines modified | 0 |
| Lines deleted | 0 |
| Files touched | 1 (`server/app.mjs`) |
| Refactor of existing code | none |
| Risk of regression | minimal — purely additive, registered after middleware so it inherits security headers, cannot shadow any existing route |
| Existing routes affected | none |
| Tests required | one additional canary assertion: `Content-Type: application/json` + body shape `{status,timestamp}` |
| Governance kernel fit | satisfies "smallest valid engine wins" — single-route insertion is the minimum legal engine |
| Deploy impact | requires republish to take effect (server file change) |

### 5.3 Alternative even smaller fix (3 lines)

Mirror the `/healthz` shape exactly — plain-text "ready":

```js
app.get("/readyz", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).type("text/plain").send("ready");
});
```

Trade-off: smaller and faster, but loses the structured timestamp that distinguishes a readiness signal from a liveness signal. Recommendation favors §5.1's JSON shape because the semantic gap between `/healthz` (liveness) and `/readyz` (readiness) is exactly what the JSON payload expresses.

### 5.4 What NOT to do

| Anti-pattern | Why to reject |
|---|---|
| Add a redirect from `/readyz` to `/ready` | Breaks canary tooling that expects HTTP 200 on the literal path; injects a 301/302 round-trip |
| Refactor the entire health-probe block to share a helper | Out of scope; the four endpoints are already trivial single-statement responses; abstraction would add lines, not remove them |
| Move `/readyz` to the pre-middleware block (lines 85-92, where `/healthz` lives) | `/healthz` is pre-middleware for a specific reason — the platform's cold-start liveness check needs a guaranteed sub-millisecond response. `/readyz`'s semantics are "the app is warm enough to serve traffic," which is fine to register after middleware. Registering both pre- and post-middleware blurs the contract. |
| Make `/readyz` proxy to `/api/health/ready` for richer data | Adds an HTTP round-trip inside the process for no functional benefit; canary tooling doesn't need the rich payload |
| Document the SPA-fallback behavior as intentional and close the gap as wontfix | Would mean accepting that the canary check is asserting only "static server reachable," which is weaker than a true readiness signal. Future incident analysis would suffer. |

## 6. Phase 44 canary baseline — does this affect it?

No. The Phase 44 canary baseline (`docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`) already noted this exact observation in §2: *"`/readyz` returns the 10,652 B SPA HTML shell (same as `/`), not a small JSON readiness payload. Endpoint is reachable and returns 200 — satisfies the canary spec for this phase. If the intent was a dedicated JSON readiness object (like `/api/health` at 430 B), worth a follow-up phase to align."* Phase 45 is that follow-up inspection.

The Phase 44 baseline tolerance for `/readyz` size was set at `± 5%` against 10,652 B. **If §5.1 is ever applied, that tolerance must be recalibrated** to a small JSON-payload size band (~75-200 B) in the same patch that registers the route. Recording that here so the future executor doesn't accidentally trip the canary on the very fix that closes this gap.

## 7. Strict-mode compliance (Phase 45 spec)

| Rule | Compliance |
|---|---|
| Do not modify source code | ✅ zero source touches; recommendation in §5 is documented, not applied |
| Do not refactor | ✅ zero |
| Do not touch auth / database / routes / UI app code / deployment config / infrastructure / `.replit` | ✅ none touched |
| Documentation / report only | ✅ only this report |
| Task 1 — verify `/readyz` production headers + body size | ✅ §2 (HTTP/2 200, 10,652 B, `text/html`, full headers captured) |
| Task 2 — confirm SPA HTML vs readiness JSON | ✅ §2 (SPA HTML — byte-identical to `/` and `/crisis`) |
| Task 3 — search codebase for `/readyz`, `/healthz`, `/api/health` | ✅ §4 (`/readyz`: zero matches; `/healthz`: `server/app.mjs:85,89,290`; `/api/health`: `server/app.mjs:167`) |
| Task 4 — identify smallest safe future fix | ✅ §5 (4-line additive insertion mirroring existing `/ready` handler) |
| Task 5 — generate this report | ✅ this file |
| Task 6 — commit report only | ✅ only this report is staged; platform checkpoint will finalize on main |
| Task 7 — stop | ✅ §8 |

## 8. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
PRODUCTION HEALTH:            6/6 endpoints HTTP 200 (Phase 44 canary)
/readyz CONTRACT:             SPA fallback — endpoint reachable but not a true readiness JSON payload
SMALLEST SAFE FIX SCOPED:     yes — 4 additive lines, 1 file (server/app.mjs), 0 refactor
FIX EXECUTED THIS PHASE:      NO (out of scope — doc/report only)
SECURITY POSTURE:             S0 HOLD (unchanged)
MAIN HEAD:                    e46d969b6 (unchanged)
NEW SOURCE EDITS:             0
NEW DOC ARTIFACTS:            1 (this report)
NEXT ACTION:                  user decides whether to schedule a future phase to apply §5.1; no auto-execution
```

## 9. References

- Phase 37 (F-33.6 implementation, same additive-only pattern): `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 44 (production canary baseline, sub-observation logged): `docs/reports/PHASE_44_PRODUCTION_MONITORING_CANARY.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` (smallest valid engine principle)
- Source — `/healthz` handler (model A): `server/app.mjs:85-92`
- Source — `/ready` handler (model B, recommended): `server/app.mjs:308-311`
- Source — `/metrics` handler (sibling reference): `server/app.mjs:313-327`
- Source — bare-health guard block + Phase 9A comment: `server/app.mjs:287-306`
- Source — SPA static + catch-all: `server/app.mjs:329-333`
- Router — `/api/health`: `server/routes/health.mjs` (mounted at `server/app.mjs:167`)

---

*Phase 45 `/readyz` readiness contract inspection complete. `/readyz` is unregistered in source and falls through to the SPA static fallback (HTTP 200, 10,652 B SPA HTML, SHA256 identical to `/` and `/crisis`). Sibling endpoints `/healthz`, `/ready`, `/metrics`, `/api/health` all have explicit handlers — `/readyz` is the lone omission from the canonical health-probe family. Smallest safe future fix is a 4-line additive insertion mirroring the existing `/ready` handler at `server/app.mjs:308-311`, deferred to a separately scoped phase. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
