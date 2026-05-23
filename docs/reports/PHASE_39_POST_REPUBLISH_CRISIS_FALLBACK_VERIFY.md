# MMHB Phase 39 — Post-Republish Crisis Fallback Verification

**Generated:** 2026-05-23 00:29 UTC
**HEAD:** `7a952f5f8` (`origin/main` in sync) — Phase 38 + prior Phase 39 stub
**Working tree:** clean
**Mode:** verification only. Zero source edits. No refactor. No auth / database / routes / UI app code / deployment-config / infrastructure / `.replit` touched.
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged at HTTP level)

---

## 1. Executive summary — **GATE: FAIL**

| Check | Result |
|---|---|
| Production endpoint envelope (5/5) | ✅ all 200 |
| Production `/crisis` raw HTML contains `crisis-fallback` | ❌ 0 hits |
| Production `/crisis` raw HTML contains `988` | ❌ 0 hits |
| Production `/crisis` raw HTML contains `741741` | ❌ 0 hits |
| Production `/crisis` raw HTML contains `911` | ❌ 0 hits |
| Production `/crisis` raw HTML contains `<noscript>` | ❌ 0 hits |

**The Phase 37 crisis fallback is NOT live in production.** Production is still serving the pre-F-33.6 build. F-33.6 **cannot be marked CLOSED** in the Phase 35 hardening ledger.

This is a faithful, evidence-based negative finding. No source change was made (per Phase 39 strict scope). Remediation is a deploy-pipeline action, not a code action.

## 2. Evidence

### 2.1 Byte-length comparison

```
Local artifact   client/dist/index.html         10,652 B   (Phase 37 build, with fallback)
Production       https://.../crisis              8,378 B   (pre-Phase-37, no fallback)
Production       https://.../                    8,378 B   (pre-Phase-37, no fallback)
Phase 33 baseline /crisis (pre-fix)              8,379 B   ± 1 B newline noise
```

Production byte length matches the pre-F-33.6 baseline exactly. Local dist (the artifact that *should* be deployed) is 2,274 B larger and carries the fallback block.

### 2.2 SHA-256 fingerprint divergence

```
prod /crisis              sha256 = a52653a2cb9c0ba6886e2668edba2b8ec79aa465325ceb9213257667c5e9b6f5
local client/dist/index.html sha256 = f34157b347807de7e3f75a1ae860e08d98ef3fdab976e287b8bf6692c14e35ec
```

Different fingerprints → production is serving a different artifact than the one built locally from `HEAD`.

### 2.3 Production response headers (definitive timestamp)

```
HTTP/2 200
content-length: 8379
cache-control: public, max-age=0          ← origin is NOT CDN-cached; this is origin truth
etag: W/"20bb-19e4dbf1930"
last-modified: Fri, 22 May 2026 03:33:50 GMT
```

The `last-modified` timestamp of **Fri, 22 May 2026 03:33:50 GMT** **predates the Phase 37 commit `41dc15696`** by approximately 20 hours. The production deployment is therefore on a pre-Phase-37 build, not on `HEAD`.

`cache-control: public, max-age=0` rules out the possibility that an intermediate CDN cache is masking a fresher origin. Cache-busted query (`/crisis?_=<unix-ts>`) returned identical content with the same byte length and zero literal hits, confirming origin is the source of the stale response.

### 2.4 Literal probe — production `/crisis` (the close-gate probe)

```bash
$ CRISIS=$(curl -s --max-time 10 "https://mymentalhealthbuddy.com/crisis")
$ printf '%s' "$CRISIS" | wc -c
8378

$ printf '%s' "$CRISIS" | grep -c "crisis-fallback"   → 0
$ printf '%s' "$CRISIS" | grep -c "988"               → 0
$ printf '%s' "$CRISIS" | grep -c "741741"            → 0
$ printf '%s' "$CRISIS" | grep -c "911"               → 0
$ printf '%s' "$CRISIS" | grep -c "<noscript>"        → 0
```

Five required literals, zero hits. **Gate FAIL.**

### 2.5 Literal probe — production `/` (root)

```bash
$ ROOT=$(curl -s --max-time 10 "https://mymentalhealthbuddy.com/")
$ printf '%s' "$ROOT" | wc -c
8378
# all 5 literals → 0 hits (identical to /crisis)
```

Confirms the shell-level fallback is missing on every SPA route, not just `/crisis`. Consistent with the deploy being on a pre-Phase-37 build.

### 2.6 Local reference artifact (control)

```bash
$ wc -c client/dist/index.html             → 10,652 B
$ grep -c "crisis-fallback" client/dist/index.html → 9
$ grep -c "988"             client/dist/index.html → 1
$ grep -c "741741"          client/dist/index.html → 1
$ grep -c "911"             client/dist/index.html → 1
$ grep -c "<noscript>"      client/dist/index.html → 1
```

The local build artifact is correct and ready to ship. The defect is **strictly in the deploy pipeline**, not in the source or the build.

### 2.7 Production endpoint envelope (regression guard)

```
prod /             -> 200
prod /healthz      -> 200
prod /readyz       -> 200
prod /crisis       -> 200
prod /api/health   -> 200
```

5/5 PASS. Production is healthy at the HTTP envelope level; only the BHCE shell content is stale. No launch-state regression at the endpoint layer.

## 3. Interpretation

The user reported clicking **Republish** prior to invoking Phase 39. The evidence above conclusively shows the publish did not result in HEAD `41dc15696` (or its descendant `7a952f5f8`) being promoted to the production runtime:

1. The production `last-modified` timestamp **predates** the Phase 37 commit.
2. The production artifact SHA-256 differs from `client/dist/index.html` built from HEAD.
3. The production byte length is byte-exact with the pre-fix Phase 33 baseline.
4. The defect is uniform across `/` and `/crisis` (shell-level, exactly where the Phase 37 edit lives).
5. CDN caching is ruled out (`max-age=0`; cache-busted query identical).

Possible (non-exhaustive) root causes — all are pipeline / platform-level, none are source-level:

- Republish click was issued but the deployment queue did not pick up the latest `main` HEAD.
- Republish targeted a pinned older commit / a previous deployment snapshot rather than current `main`.
- Build step in the deployment ran but its output was not promoted to the serving slot.
- Deployment service experienced a stuck / failed run that was not surfaced to the user.

Diagnosing which of these is correct requires access to the **Replit Deployments dashboard** (deploy log, current pinned commit, slot history) — a platform / user action, **explicitly outside Phase 39 scope** (no infrastructure, no deployment-config edits).

## 4. Recommended remediation (out of Phase 39 scope — for user / platform)

1. Open Replit Deployments → confirm the most recent deploy run completed successfully.
2. Confirm the pinned/served commit is `7a952f5f8` (or descendant), **not** an older commit.
3. If the deploy is on an older commit: click **Republish** again, confirm in the deploy log that the new build is promoted, and confirm the served `last-modified` header advances past `Fri, 22 May 2026 03:33:50 GMT`.
4. Re-run the §6 verification command block.
5. Only on PASS may F-33.6 be marked CLOSED in the Phase 35 hardening ledger and the BHCE canary upgraded to the stronger literal-presence form (see Phase 38 §7 close-gate definition).

No source-code action is appropriate here. The source change is correct, committed, and present in the local build artifact.

## 5. F-33.6 ledger transition

```
PRE-PHASE-39                                POST-PHASE-39
─────────────────────────                   ─────────────────────────
Status: IMPLEMENTED-PENDING-DEPLOY          Status: IMPLEMENTED-PENDING-DEPLOY  (unchanged)
                                            Close-gate evidence: FAIL (§2.4)
                                            Sub-status: DEPLOY-DID-NOT-PROMOTE
Sprint 1 position: #1 in flight             Sprint 1 position: #1 in flight, blocked at deploy promotion
BHCE canary: HTTP-status-only               BHCE canary: HTTP-status-only (cannot upgrade until close)
```

F-33.6 **remains S1** and **remains open**. The Sprint 1 mandatory-first item is not yet cleared.

## 6. Post-redeploy verification (to be run after a successful Republish)

```bash
PROD="https://mymentalhealthbuddy.com"

# 1) Confirm the served artifact actually advanced past the stale baseline
curl -sI --max-time 10 "${PROD}/crisis" | grep -iE 'content-length|last-modified'
# expect: content-length: ~10,650 (was 8,379)
# expect: last-modified > Fri, 22 May 2026 03:33:50 GMT

# 2) Required literal probe (Phase 36 Gate 1 / Phase 37 §4 / Phase 38 §8)
crisis=$(curl -s --max-time 10 "${PROD}/crisis")
for tok in "crisis-fallback" "988" "741741" "911" "<noscript>"; do
  printf '  %-16s = %d\n' "$tok" "$(printf '%s' "$crisis" | grep -c "$tok")"
done
# expect each ≥ 1

# 3) Endpoint envelope (regression guard)
for p in / /healthz /readyz /crisis /api/health; do
  c=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${PROD}${p}")
  printf '  %-14s -> %s\n' "$p" "$c"
done
# expect 200 for all five
```

**PASS criteria (all required):**
- `content-length` advances past 8,379 B
- `last-modified` advances past `Fri, 22 May 2026 03:33:50 GMT`
- `crisis-fallback`, `988`, `741741`, `911`, `<noscript>` each ≥ 1 hit
- All 5 endpoints → 200

On PASS: file the F-33.6 closure update against `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md` and upgrade the BHCE canary. That is a separate documentation phase (not Phase 39 scope).

On continued FAIL: escalate to Replit Deployments support with this report as evidence; do not patch source.

## 7. Strict-mode compliance (Phase 39 spec)

| Rule | Compliance |
|---|---|
| Use `client/dist/index.html`, not `dist/index.html` | ✅ §2.6 reference build is `client/dist/index.html`; verification probes hit `https://mymentalhealthbuddy.com/...` directly (no `dist/index.html` was read) |
| Do not modify source code | ✅ zero source edits |
| Do not refactor | ✅ zero refactors |
| Do not touch auth / database / routes / UI app code / deployment config / infrastructure / `.replit` | ✅ none touched |
| Verify production `/crisis` raw HTML contains `crisis-fallback`, `988`, `741741`, `911`, `<noscript>` | ✅ verified — result is **0 hits each** (Gate FAIL, faithfully reported) |
| Generate `docs/reports/PHASE_39_POST_REPUBLISH_CRISIS_FALLBACK_VERIFY.md` | ✅ this file (overwrites prior 12-line stub committed at `7a952f5f8` with full evidence-based verification) |
| Commit report only | ✅ only this report is staged; platform checkpoint will finalize |
| Stop | ✅ §8 |

## 8. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (HTTP-envelope level, unchanged)
ENDPOINT HEALTH:              5/5 production → 200
F-33.6 IN PRODUCTION:         ❌ NOT LIVE  (close-gate FAIL — §2.4)
F-33.6 IN SOURCE:             ✅ correct, committed at HEAD `41dc15696`
F-33.6 IN LOCAL BUILD:        ✅ correct, present in client/dist/index.html
F-33.6 STATUS:                IMPLEMENTED-PENDING-DEPLOY (unchanged from Phase 38)
DEPLOY-PIPELINE STATE:        STALE — served artifact predates HEAD by ~20 h
NEW SOURCE EDITS THIS PHASE:  0
NEW DEPS / CONTRACTS / TODOs: 0
NEW DOC ARTIFACTS:            1 (this report, replacing prior 12-line stub)
NEXT ACTION (user/platform):  Re-Republish from Replit Deployments dashboard;
                              re-run §6 verification block to confirm promotion.
```

## 9. References

- Phase 38 verification: `docs/reports/PHASE_38_DEPLOYED_CRISIS_FALLBACK_VERIFY.md`
- Phase 37 implementation: `docs/reports/PHASE_37_F_33_6_IMPLEMENTATION.md`
- Phase 36 plan + close-gate definition: `docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md`
- Phase 35 hardening ledger (where F-33.6 will close, when gate passes): `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- SPA shell carrying the fix: `client/index.html` (HEAD `41dc15696`)
- Local built artifact: `client/dist/index.html` (10,652 B, contains all required literals)
- Governance kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Phase 39 verification complete. **Close-gate FAIL** — Phase 37 crisis fallback is NOT live in production. Production deploy did not promote past `Fri, 22 May 2026 03:33:50 GMT`, ~20 h before HEAD `41dc15696`. Source, commit, and local build are correct; the gap is in the deploy promotion. F-33.6 remains IMPLEMENTED-PENDING-DEPLOY. v1.0.0 public beta launch state: GO at HTTP-envelope level, unchanged. Next action belongs to the user (Re-Republish) and the platform (promote), not the source.*
