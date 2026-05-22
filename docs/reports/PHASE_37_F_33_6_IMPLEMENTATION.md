# MMHB Phase 37 — F-33.6 Crisis-Resource Resilience Implementation

**Generated:** 2026-05-22
**HEAD at start:** `9053448e8` (Phase 36 plan)
**Mode:** minimal implementation. One source file modified (`client/index.html`). No refactor. No deps installed. No `npm audit fix --force`. No auth / db / routes / deployment-config / infrastructure / `.replit` touched.
**Source of truth:** Phase 36 (`docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md`)
**Launch state at finalize:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. What changed

| File | Change | Lines | Notes |
|---|---|---|---|
| `client/index.html` | Added inline `<style>` + `<noscript>` + `<aside class="crisis-fallback">` block immediately after `<div id="root"></div>` | **+42 / -0** | Approach A from Phase 36 §5 |

Single-file, additive-only edit. Zero deletions. Zero refactors. Zero other files touched.

```
$ git diff --stat client/index.html
 client/index.html | 42 ++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 42 insertions(+)
```

## 2. Implementation

The fix uses a **pure-CSS auto-hide** mechanism — no JavaScript, no React change, no dependency, no route coupling, no server change.

### Visibility logic (CSS only)

```css
#root:not(:empty) ~ .crisis-fallback { display: none; }
```

- **Default** (page just loaded, React hasn't mounted): `#root` is empty → fallback **visible**
- **After hydration** (React renders into `#root`): `#root` is no longer empty → fallback **hidden**
- **JS disabled**: `#root` stays empty forever → fallback **visible**
- **JS bundle fails to load/parse/run**: `#root` stays empty → fallback **visible**
- **Browser extension blocks the bundle**: `#root` stays empty → fallback **visible**

`<noscript>` carries a `display: block !important` override as a belt-and-suspenders guard for the JS-disabled case where some CSS engines might evaluate selectors differently.

### Content (mirrors `client/src/lumi-crisis/resources/crisisResources.ts`)

```
─── If you are in crisis right now, you are not alone. ─────────────
    Free, confidential support is available 24/7.
    You do not need an account.

    • Call or text 988    — Suicide & Crisis Lifeline (US, 24/7)
    • Text HOME to 741741 — Crisis Text Line (US, 24/7)
    • Dial 911            — for an immediate emergency in the US

    MyMentalHealthBuddy is an educational wellness companion.
    It does not diagnose, assess suicidality, or replace emergency
    services. If you are in danger, please contact the resources above.
────────────────────────────────────────────────────────────────────
```

`tel:988`, `sms:741741?body=HOME`, `tel:911` links work without JavaScript (native `<a href>`).

### Clinical-autonomy compliance

| Rule | Compliance |
|---|---|
| AI must not diagnose | ✅ explicit note: "does not diagnose" |
| AI must not assess suicidality | ✅ explicit note: "does not assess suicidality" |
| AI must not replace emergency services | ✅ explicit note: "does not replace emergency services" |
| AI must not make clinical decisions | ✅ block is static HTML — no AI, no decision logic |
| Calm, consent-based language | ✅ "you are not alone", "if you are in danger" |
| Educational only | ✅ "educational wellness companion" |
| Original writing | ✅ authored for The Genuine Love Project |
| Routes to 988 / 741741 / 911 | ✅ all three present |
| WCAG AA | ✅ `<aside role="complementary" aria-label="Crisis resources">`; semantic `<h1>`, `<ul>`, `<a>`; contrast ≥ 4.5:1 |

## 3. Verification — local

### 3.1 Build

```
$ npm run build
...
✓ built in 53.12s
```

PASS — clean build, no new warnings, no new errors.

### 3.2 dist artifact — raw HTML literal probe (Phase 36 §8 Gate 1 + Gate 5)

```
$ find . -path '*/dist/index.html' -not -path '*/node_modules/*' | head -1
./client/dist/index.html

$ wc -c client/dist/index.html
10652 client/dist/index.html                    (was 8,379 → +2,273 B / +27 %)

$ grep -c "988"            client/dist/index.html      → 1     ✓ (Gate 1)
$ grep -c "741741"         client/dist/index.html      → 1     ✓ (Gate 1)
$ grep -c "911"            client/dist/index.html      → 1     ✓ (Gate 1)
$ grep -c "crisis-fallback" client/dist/index.html     → 9     ✓ (CSS rules + element + comments)
$ grep -c "<noscript>"     client/dist/index.html      → 1     ✓ (belt-and-suspenders)
```

**Gate 1 PASS** — raw HTML contains all three crisis literals.

### 3.3 Bundle budgets (Phase 33 §3.7 baseline)

```
$ du -sh client/dist                                    → 36M       ≤ 50 MB    ✓
$ find client/dist -name "*.map" | wc -l                → 0         = 0        ✓
$ ls client/dist/assets/vendor-*.js | wc -l             → 8         = 8        ✓

Top chunks (raw / gz):
  WellnessDashboard       275.14 KB / 89.13 KB    ≤ 350 KB raw    ✓
  _autopilot              257.93 KB / 62.53 KB                    ✓
  AdvancedToolsPage       210.00 KB / 45.82 KB                    ✓
  index                   187.48 KB / 42.36 KB                    ✓
  vendor-react            182.94 KB / 58.02 KB                    ✓

Initial path combined gz (index + vendor-react):       ~99.4 KB   ≤ 150 KB   ✓
```

**Gate 5 PASS** — every Phase 24/25/26 bundle budget held exactly. Zero new chunks, zero new source maps, zero new vendor splits. The fix is shell-only and does not change a single JS/CSS chunk on disk.

### 3.4 Production baseline (pre-deploy of this change)

```
$ for p in / /healthz /readyz /crisis /api/health; do
    curl -s -o /dev/null -w "$p -> %{http_code}\n" "https://mymentalhealthbuddy.com$p"
  done
/             ->  200
/healthz      ->  200
/readyz       ->  200
/crisis       ->  200
/api/health   ->  200
```

5/5 PASS — production baseline unchanged. Phase 33 §3.1 state preserved.

## 4. Verification — post-deploy (run within 5 min of deploy)

To be executed by on-call after this change is promoted. Identical to Phase 36 §8.2.

```bash
PROD="https://mymentalhealthbuddy.com"
crisis=$(curl -s --max-time 8 "${PROD}/crisis")
echo "988:    $(echo "$crisis" | grep -c '988')"        # expect >= 1
echo "741741: $(echo "$crisis" | grep -c '741741')"     # expect >= 1
echo "911:    $(echo "$crisis" | grep -c '911')"        # expect >= 1
curl -s -o /dev/null -w "/ %{http_code}\n/crisis %{http_code}\n" \
     --max-time 8 "${PROD}/" "${PROD}/crisis"           # expect 200 200
```

PASS criteria: all three grep counts ≥ 1 AND both endpoints 200.

**Browser visual (Gate 6, 3-browser matrix):**
- Chrome / Safari / Firefox
- DevTools → Settings → Debugger → "Disable JavaScript" → load `/crisis`
- Confirm: 988, 741741, 911 visible; `tel:` and `sms:` links clickable
- Re-enable JS, reload → confirm full CrisisPanel renders and fallback is hidden (no flash, no layout shift)

## 5. Rollback

Identical to Phase 36 §9. Single-click Replit Deployments → Restore to the pre-F-33.6 deploy. 5-minute SLO. Any rollback triggers automatic P0 BHCE classification and a `POST_INCIDENT_BHCE_<TS>.md` filing within 24 hours, signed by Architecture / Governance.

The change is purely additive to one file — rolling back deletes the addition and restores byte-identical pre-fix state. No schema, no data, no third-party state to reconcile.

## 6. Strict mode compliance

| Rule | Compliance |
|---|---|
| Modify only the minimum required files | ✅ 1 file (`client/index.html`) |
| Prefer `client/index.html` fallback shell | ✅ Approach A |
| Do not touch auth, database, routes, deployment config, infrastructure, or `.replit` | ✅ none touched |
| Do not refactor | ✅ additive-only |
| Do not run `npm audit fix --force` | ✅ not invoked |
| Preserve launch state: GO, blockers 0 | ✅ §9 |
| AI must not diagnose, assess suicidality, replace emergency services, or make clinical decisions | ✅ §2 explicit disclaimer in copy |
| Add no new dependency | ✅ no `npm install`, no package.json edit |
| Keep change around 40–60 lines | ✅ +42 lines, 0 deletions |
| `npm run build` succeeds | ✅ §3.1 |
| Raw HTML contains 988 / 741741 / 911 | ✅ §3.2 |
| Production health still green | ✅ §3.4 (pre-deploy baseline 5/5) |

## 7. Governance kernel alignment

- **Primary law (domain isolation)** — change touches the BHCE crisis surface only. No business logic, no platform debugging, no healing-content drift.
- **BHCE override** — the entire change exists to strengthen BHCE asymmetry. Resources are now visible **even if the entire React app fails to load**. Cost of redundant display: 2.3 KB on the shell; cost saved on a single missed crisis render: unbounded.
- **Smallest valid engine** — CSS-only auto-hide on a single shell file. No JS, no React, no server, no dep, no route. Cannot be smaller.
- **Execution discipline** — single edit → local build → dist literal probe → bundle budget probe → production baseline probe → report. No multi-blocker, no skipped gate.
- **Replit mode** — shell for build + verification (mechanical); no AI generation in the runtime. Adapter mode: preserves existing shell structure, thin additive wrapper, zero breaking changes.
- **Output contract** — §1 What changed (files + lines) / §3 Before (Phase 33 baseline) and After / §3.1 Build status / §4 Next step (post-deploy verification). No speculation.
- **Circuit breaker** — §5 rollback rule names the post-incident document required if the change ever needs to revert.

All 7 kernel clauses honored.

## 8. F-33.6 ledger transition

```
PRE-PHASE-37                              POST-PHASE-37
─────────────────────────                 ────────────────────
F-33.6 status: planned (Phase 36)         F-33.6 status: IMPLEMENTED (locally), pending deploy + Gate 1 live
Severity: S1                              Severity: S1 (unchanged; closes on post-deploy gate PASS)
Sprint 1 position: #1 mandatory first     Sprint 1 position: #1 cleared; remainder of Sprint 1 unblocks
BHCE canary: HTTP-status-only             BHCE canary: HTTP-status + raw-HTML literal presence (stronger)
```

After deploy + post-deploy gate PASS, the Phase 35 hardening ledger will be updated to mark F-33.6 **CLOSED** and to upgrade the recurring BHCE canary to its stronger form. That ledger update is a separate documentation phase (not included here per the strict scope of Phase 37).

## 9. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
PRODUCTION STATE:             5/5 endpoints 200 at finalize time (§3.4)
LOCAL BUILD:                  PASS (§3.1)
DIST ARTIFACT:                contains 988, 741741, 911 (§3.2)
BUNDLE BUDGETS:               unchanged (§3.3)
NEW CONTRACTS:                0
NEW TODOs:                    0
NEW DEPENDENCIES:             0
FILES MODIFIED:               1 (client/index.html, +42 / -0)
```

The change is implementation-complete and ready to deploy. v1.0.0 public beta launch state remains **GO**, blockers remain **0**.

## 10. References

- F-33.6 implementation plan: `docs/operations/F_33_6_CRISIS_RESOURCE_RESILIENCE_PLAN.md` (Phase 36)
- Phase 35 post-launch hardening ledger: `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 34 launch decision: `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md`
- Phase 33 hardening verification (F-33.6 origin): `docs/reports/PHASE_33_HARDENING_VERIFICATION.md`
- Canonical crisis resource records: `client/src/lumi-crisis/resources/crisisResources.ts`
- SPA shell: `client/index.html`
- React mount: `client/src/main.jsx` (untouched)
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*F-33.6 implementation complete. One source file modified (`client/index.html`, +42 / -0). Build PASS. dist artifact contains 988 / 741741 / 911 in raw HTML. Bundle budgets unchanged. Production baseline 5/5 healthy. v1.0.0 public beta launch state: GO, unchanged.*
