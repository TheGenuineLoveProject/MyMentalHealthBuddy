# F-33.6 — Crisis Resource Resilience Implementation Plan

**Status:** Planning (no source modified)
**Severity:** S1
**Sprint:** 1 (mandatory first item per Phase 35 §3)
**Ledger:** `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
**Source of truth:** Phase 35
**Owner:** Architecture + Engineering (joint)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged by this plan)

---

## 1. Exact problem statement

The `/crisis` route currently returns HTTP **200** in production and renders the three required BHCE resources (**988** Suicide & Crisis Lifeline, **741741** Crisis Text Line, **911** emergency services) **only after** the client-side React bundle has finished loading and hydrating.

Evidence (Phase 33 §3.9):

```
/crisis status:                              200            ✓
/crisis raw HTML signature:                  identical to /  (SPA shell, md5 9197a81b…)
988  literals in raw HTML before hydration:  0              ✗
741741 literals in raw HTML before hydration: 0             ✗
911  literals in raw HTML before hydration:  0              ✗
```

Real browsers with JavaScript enabled hydrate normally and render the resources correctly — this is **not a v1.0.0 launch blocker** and was correctly graded as a non-blocking S1 finding in Phase 33. However:

- Any failure of the JS bundle (CDN incident, parser error, network interruption mid-download, browser extension blocking, deliberately JS-disabled user) leaves `/crisis` visually empty of crisis resources.
- The MMHB v7.4 governance kernel's BHCE clause requires the three resources to be **asymmetrically over-provided** — the cost of redundant display is zero, the cost of a single missed render in a real crisis is unbounded.
- The shipped SPA shell is **8,379 bytes** and does not contain the three literals. Adding them is structurally trivial.

## 2. Why F-33.6 is Sprint 1 priority

Per Phase 35 §3, F-33.6 is the **mandatory first Sprint 1 item**. No other Sprint 1 fix may merge ahead of it. Slips do not displace it — they push the rest of Sprint 1.

Reasons:

| Reason | Detail |
|---|---|
| **BHCE asymmetry** | Kernel clause: err toward resource provision. The three crisis numbers should be visible even if the entire React app fails to load. |
| **Lowest blast radius of any Sprint 1 fix** | The shipped change is a static HTML/CSS addition to one file (`client/index.html`) — no JS, no runtime branches, no React state, no auth, no DB. |
| **Cheapest gate** | Verifiable with a single `curl + grep`; no browser harness, no Lighthouse, no integration sweep required. |
| **Cheapest rollback** | Single git revert of one file edit; restores byte-identical pre-fix shell. |
| **Pairs cleanly with Sprint 1 F-33.3 and F-33.4** | All three Sprint 1 BHCE/security items are header- or shell-level edits with the same rollback shape. |
| **Removes a class of incident** | Eliminates any future "JS-failure left `/crisis` blank" incident class permanently. |

## 3. Current `/crisis` behavior

```
Network:    GET https://mymentalhealthbuddy.com/crisis  →  200
Headers:    cache-control: public, max-age=0
            content-security-policy: <full policy, no unsafe-eval>
            strict-transport-security: max-age=63072000; includeSubDomains
            (HSTS appears twice — TODO-18.4, separate ledger item)
Body:       8,379 bytes — byte-identical to GET /
            md5: 9197a81b92681cbc87309c45d7df6600
Contents:   <html lang="en">, theme-bootstrap IIFE, SEO meta tags,
            JSON-LD organization block, <div id="root"></div>,
            <script type="module" src="/assets/index-*.js"></script>
After JS:   React Router resolves /crisis → CrisisResources page,
            CrisisPanel mounts, renders 988 / 741741 / 911 with
            tel: + sms: links and supportive copy
```

**Failure modes (current):**

1. JS bundle fails to download → blank page, no crisis resources visible.
2. JS parse error on older browser → blank page.
3. Browser extension blocks the React bundle → blank page.
4. User has JS disabled → blank page.
5. CDN edge incident during hydration → partial render, possibly without crisis content.

In all five failure modes, the three resources are **not visible**. The crisis route fails open (200) with empty content rather than failing closed (5xx) with operator alerting.

## 4. Target behavior if JavaScript fails

After F-33.6 ships, the same five failure modes must result in this state:

```
Network:    GET https://mymentalhealthbuddy.com/crisis  →  200  (unchanged)
Body:       8,379 + ~600 bytes — includes inline BHCE block
After JS:   React mounts and hides the inline BHCE block (display: none
            via class swap once #root is hydrated), then renders the
            full CrisisPanel UI as before.
Without JS: The inline BHCE block remains visible. User sees:

              ╔════════════════════════════════════════════════════╗
              ║  If you are in crisis right now, you are not alone. ║
              ║                                                      ║
              ║  Call 988  — Suicide & Crisis Lifeline (US)         ║
              ║  Text 741741 — Crisis Text Line                      ║
              ║  Dial 911  — Emergency services                     ║
              ║                                                      ║
              ║  These resources are free, confidential, and        ║
              ║  available 24/7.                                     ║
              ╚════════════════════════════════════════════════════╝
```

**Acceptance properties:**

- Raw HTML of `/crisis` contains the literals `988`, `741741`, `911` regardless of JS execution.
- With JS enabled, the React CrisisPanel takes over the visible surface; the inline block is hidden or replaced.
- With JS disabled, the inline block remains the visible UI.
- `tel:` and `sms:` links work without JS (native `<a href>`).
- No layout shift to the hydrated UI (no flash of inline content jumping).
- No CSP violation (inline `<style>` blocks for the fallback must use the same allowance as the existing theme-bootstrap IIFE, or live in a hashed/referenced stylesheet — see §5 below).
- Apex `/` and every other route remain byte-identical to today (the inline block is added only to the crisis surface, or — if added globally to the shell — is gated by route in CSS so it only appears on `/crisis`).

## 5. Smallest safe implementation plan

The implementation is **deliberately the smallest possible engine** per the MMHB v7.4 kernel "smallest valid engine wins" clause.

### Approach A (preferred): SSR-aware shell edit

Add a small static HTML block inside the shell `client/index.html` that is:

1. Always shipped in the raw HTML of every route (zero per-route SSR work — keeps the SPA architecture intact).
2. Hidden by default via a CSS class on `<body>` (`.js-loaded .crisis-fallback { display: none }`).
3. Shown only when the page is `/crisis` AND JS has not yet hydrated (CSS attribute selector on `<html data-route>` set by the existing route detection).
4. Hidden permanently once React mounts (one-line `useEffect` in the root layout that adds `.js-loaded` to `<body>`).

**Why this is the smallest engine:**
- No new routes, no SSR framework introduction, no server-side rendering of React.
- One file changed (`client/index.html`), one small `useEffect` added (or the existing theme-bootstrap IIFE extended by ~3 lines).
- The fallback block exists in HTML; CSS controls visibility; JS controls the visibility-flip class only.
- Zero new dependencies. Zero CSP changes. Zero header changes. Zero route changes. Zero auth/db/UI surface changes.

### Approach B (alternative): per-route static prerender

Pre-render `/crisis` at build time as a separate static HTML file (the crisis content baked into the served HTML for that route only). Requires Vite SSR plugin or a tiny custom build step. **Heavier** than Approach A; deferred unless Approach A is somehow blocked.

**Decision:** Approach A is the default unless implementation discovery (Phase 37) reveals a structural reason to switch to Approach B.

### Out-of-scope for F-33.6

- Per-route SSR meta (that is F-33.1, Sprint 2).
- CSP nonce migration (F-33.5, Sprint 2).
- Any refactor of `client/src/lumi-crisis/` or `client/src/pages/CrisisResources.jsx` — the existing hydrated UI is unchanged.
- Any change to crisis-detection logic (`client/src/companion-voice/engine/crisisDetector.ts`, `client/src/governance/interactions/CrisisOverrideEngine.ts`) — those govern in-app conversational escalation, not the static `/crisis` page.

## 6. Files likely to inspect before editing (read-only, Phase 37)

Inspection only — Phase 36 does not touch any of these. Phase 37 (implementation) will read these to confirm Approach A integrates cleanly.

| File | Why inspect |
|---|---|
| `client/index.html` | The SPA shell. Theme-bootstrap IIFE pattern is the prior art for inline shell logic. CSP `'unsafe-inline'` allowance for this file is documented in `server/app.mjs:138`. |
| `client/src/pages/CrisisResources.jsx` | The hydrated React crisis page. Confirm canonical resource copy, tel/sms link patterns, and any visual chrome the fallback should mirror. |
| `client/src/components/CrisisStabilizer.jsx` | Crisis-adjacent component. Confirm the fallback copy does not contradict the in-app stabilizer wording. |
| `client/src/lumi-crisis/resources/crisisResources.ts` | Canonical source of the three resource records (988 / 741741 / 911). Fallback literals must match exactly. |
| `client/src/lumi-crisis/components/CrisisPanel.tsx` | Hydrated panel that takes over the surface post-mount. Confirm mount selector and any portal logic that could conflict with the inline block. |
| `client/src/lumi-crisis/governance/crisisSafetyRules.ts` | Governance constraints on crisis copy. Fallback wording must pass these rules. |
| `client/src/governance/interactions/CrisisOverrideEngine.ts` | Crisis-override behavior. Not changed; confirm fallback does not interfere. |
| `client/src/App.tsx` (if present) | Route mounting. Confirm where to attach the `.js-loaded` class on the body. |
| `server/app.mjs` (lines ~280–350) | Static-serve + SPA fallback. Confirm `index.html` is served unmodified by the server (it is — `res.sendFile(indexFile)`). No server edit required for Approach A. |
| `server/routes/sop.mjs` (lines 110–135, 310–330) | SOP guardrails that already assert `index.html` cache headers. Confirm the SOP rules are not broken by a shell edit. |
| `public/index.html`, `client/analytics/index.html`, `static-export/index.html` | Adjacent shell files. Confirm whether F-33.6 should apply to them (likely scope = `client/index.html` only). |
| `client/src/styles/*.css` (whichever holds globals) | Confirm where to place the small `.crisis-fallback { … }` rule, or whether to inline it into the shell. |

**Estimated inspection time:** 30–60 minutes for a senior engineer pairing with Architecture.

## 7. Files likely to modify in a future phase (Phase 37 implementation)

The implementation phase (a separate, future phase — **not Phase 36**) is expected to touch a minimal set:

| File | Expected change | Approx size |
|---|---|---|
| `client/index.html` | Add `<noscript>`-wrapped + always-visible-on-`/crisis` inline BHCE block with three resource entries + scoped `<style>` rule. | ~30–50 lines added |
| `client/src/App.tsx` *(or the root layout if differently named)* | One-line `useEffect` to add `.js-loaded` to `document.body` on mount. | 1–3 lines |
| `client/src/styles/<global>.css` *(if global CSS is the chosen home)* | `.js-loaded .crisis-fallback { display: none }` rule, plus a route-scoped show rule for `/crisis`. | ~5 lines |

**Total expected delta:** ~40–60 added lines across 2–3 files. **Zero deletions.** **Zero refactors.**

**Explicitly NOT touched in Phase 37:**
- `server/app.mjs` (no server edit)
- Any `server/routes/*.mjs` (no API edit)
- `shared/schema.ts` (no DB edit)
- `drizzle.config.ts` (no migration)
- `.replit`, `vite.config.ts`, `package.json` (no infra/build/deps edit)
- Auth code paths
- `client/src/pages/CrisisResources.jsx` and `client/src/lumi-crisis/**` (hydrated UI unchanged)

## 8. Exact verification commands

All commands are Replit-native, read-only, and runnable from the Shell tab. Identical to the Phase 35 §4 gate for F-33.6, expanded with edge-case probes.

### 8.1 Pre-merge gate (must PASS before Phase 37 merges)

```bash
PROD="https://mymentalhealthbuddy.com"

# Gate 1 — Raw HTML contains all three crisis literals on /crisis
crisis=$(curl -s --max-time 8 "${PROD}/crisis")
n988=$(echo "$crisis"     | grep -c "988")
n741=$(echo "$crisis"     | grep -c "741741")
n911=$(echo "$crisis"     | grep -c "911")
echo "988:    ${n988}  (expect >= 1)"
echo "741741: ${n741}  (expect >= 1)"
echo "911:    ${n911}  (expect >= 1)"
[ "$n988" -ge 1 ] && [ "$n741" -ge 1 ] && [ "$n911" -ge 1 ] && echo "GATE 1 PASS" || echo "GATE 1 FAIL"

# Gate 2 — Apex still 200, /crisis still 200
for path in / /crisis; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "${PROD}${path}")
  echo "${path}  ->  ${code}  (expect 200)"
done

# Gate 3 — Apex raw HTML does NOT contain inline BHCE block (scoping check)
# (Approach A scopes the block to /crisis; if it leaks to /, layout will shift on apex.)
root=$(curl -s --max-time 8 "${PROD}/")
# Expect the fallback marker is absent or display:none-ed; this is a soft check:
echo "$root" | grep -c "crisis-fallback"      # informational — should be 0 or only in CSS

# Gate 4 — Headers unchanged
curl -sI --max-time 8 "${PROD}/crisis" | grep -iE "content-security-policy|strict-transport-security|x-content-type-options|x-frame-options"
# expected: identical set to pre-F-33.6 baseline

# Gate 5 — Bundle budgets unchanged (Phase 33 §3.7 baselines)
du -sh client/dist                                     # <= 50 MB
find client/dist -name "*.map" | wc -l                  # 0
ls client/dist/assets/vendor-*.js | wc -l               # 8

# Gate 6 — Browser visual verification (manual, required)
# Open Chrome DevTools → Network → "Disable cache" + "Offline" toggle off
# Settings → Debugger → "Disable JavaScript" → reload /crisis
# Confirm: 988, 741741, 911 all visible
# Confirm: tel: and sms: links are clickable
# Re-enable JS, reload
# Confirm: full CrisisPanel renders; no flash of fallback content
```

**PASS criteria for Phase 37 merge:** Gates 1–5 PASS via shell; Gate 6 PASS via 3-browser matrix (Chrome / Safari / Firefox), captured as screenshots attached to the Phase 37 report.

### 8.2 Post-deploy probe (run within 5 minutes of deploy)

```bash
PROD="https://mymentalhealthbuddy.com"
# Production canary — same Gate 1 against live edge
crisis=$(curl -s --max-time 8 "${PROD}/crisis")
echo "$crisis" | grep -c "988"     # >= 1
echo "$crisis" | grep -c "741741"  # >= 1
echo "$crisis" | grep -c "911"     # >= 1
# AND deployment-log scan for ERROR|FATAL since deploy timestamp (via fetch_deployment_logs)
```

### 8.3 BHCE canary (recurring, T+0 through T+72h, per Phase 34 §6)

```bash
curl -s -o /dev/null -w "/crisis %{http_code}\n" --max-time 8 "https://mymentalhealthbuddy.com/crisis"
# AND grep the body for 988, 741741, 911 (now strengthened by F-33.6 — must always succeed)
```

After F-33.6 ships, the BHCE canary is upgraded from "HTTP status only" to "HTTP status + raw-HTML literal presence" — a strictly stronger probe.

## 9. Rollback plan

Per Phase 35 §5 rollback rules + per-item entry for F-33.6.

### 9.1 Rollback trigger

Any one of:
- Post-deploy Gate 1 grep returns 0 for any of `988`, `741741`, `911`.
- `/crisis` returns non-200.
- Browser visual (Gate 6) shows broken layout (e.g., fallback block visible behind hydrated UI; flash of inline content; CSP violation in console).
- Apex `/` layout regression (inline block leaked to non-crisis route).

### 9.2 Rollback action (5-minute SLO)

```
STEP   ACTION                                                   VERIFY
─────  ──────────────────────────────────────────────────────  ──────────────────────────
  1    Announce in launch channel: "F-33.6 rollback in flight"  Posted within 60s
  2    Open Replit Deployments → Deployment history             Last 5 deploys visible
  3    Identify the deploy immediately PRIOR to F-33.6           Cross-ref deploy log
  4    Click "Restore" on that prior deploy                      Panel: "deploying"
  5    Wait for restore to complete                              Panel: "deployed"
  6    Re-run §8.2 post-deploy probe                              All gates PASS
  7    Re-run BHCE HTTP-only canary                                /crisis 200
  8    Post in channel: "Rolled back to <prior version>"          Posted
  9    Preserve the F-33.6 deploy artifact                        DO NOT delete
 10    Open POST_INCIDENT_BHCE_<TS>.md within 24h                 File created
```

### 9.3 What rollback restores

Restores the pre-F-33.6 state where:
- `/crisis` returns 200 and renders crisis resources **after** JS hydrates (the same state that shipped at v1.0.0 launch).
- The known JS-failure gap is **reopened** as an active S1 ledger item.
- F-33.6 is re-queued at the top of the next safe sprint window for re-implementation.

### 9.4 Why rollback is safe

- F-33.6 ships a pure additive change to one file (`client/index.html`) plus a small CSS rule and one `useEffect`. Rolling back deletes the addition; no schema, no data, no third-party state to reconcile.
- The pre-fix state is the verified v1.0.0 launch state — there is no version-skew risk.
- The 5-minute SLO is easily met by the Replit Deployments Restore flow.

### 9.5 BHCE post-incident requirement

Any F-33.6 rollback triggers an automatic **P0 BHCE** classification (per Phase 30 §5 + Phase 35 §5). A `POST_INCIDENT_BHCE_<TS>.md` must be filed within 24 hours, signed by Architecture / Governance.

## 10. No clinical autonomy reminder

This plan, and every artifact downstream of it, is bound by the MMHB v7.4 governance kernel:

> **MMHB is not a medical device, not a therapist, not a diagnosis, not a treatment.** It is an educational, trauma-informed wellness companion that provides **gentle company**, **routing to crisis resources**, and **non-clinical reflective tools**.

F-33.6 strengthens the **routing** dimension only. The fallback block must:

- Route to **988**, **741741**, **911** — exactly the three resources canonicalized in `client/src/lumi-crisis/resources/crisisResources.ts`.
- Use the phrase: *"If you are in crisis right now, you are not alone."* (or equivalent calm, consent-based language already vetted by `client/src/lumi-crisis/governance/crisisSafetyRules.ts`).
- **Must not** include clinical triage instructions (e.g., "If your symptoms are X, do Y"), diagnostic language (e.g., "You may be experiencing…"), treatment claims (e.g., "This will help with…"), or any framing that positions MMHB as an alternative to professional care.
- **Must not** make autonomy claims for MMHB ("we can help", "we will keep you safe") — the autonomy belongs to the user and to the professional resources we route them to.
- **Must** be original copy authored by The Genuine Love Project, not derived from copyrighted clinical materials.
- **Must** comply with WCAG AA (contrast, focus, tab-order, semantic landmarks).

This reminder is non-optional and applies to every line of copy, CSS class name, ARIA label, and `tel:`/`sms:` link in the fallback block.

## 11. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
PHASE 36 NEW CONTRACTS:       0
PHASE 36 NEW TODOs:           0
F-33.6 STATUS:                Sprint 1 #1 (planning complete, implementation pending)
BHCE GATE:                    ✅ (current /crisis returns 200; resilience upgrade ledgered)
```

Phase 36 does not deploy anything. It does not modify a single byte of production. It is a planning artifact for the Sprint 1 implementation of F-33.6. The v1.0.0 GO decision from Phase 34 stands intact.

## 12. References

- Post-Launch Hardening Ledger (Phase 35): `docs/operations/POST_LAUNCH_HARDENING_LEDGER.md`
- Phase 33 verification report (origin of F-33.6): `docs/reports/PHASE_33_HARDENING_VERIFICATION.md`
- Phase 34 launch decision: `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md`
- Phase 30 launch approval matrix (BHCE veto authority): `docs/operations/LAUNCH_APPROVAL_MATRIX.md`
- Phase 29 production probe checklist (rollback procedure): `docs/operations/PRODUCTION_PROBE_CHECKLIST.md`
- Phase 27 launch operations runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Crisis-resource resilience implementation plan. Documentation only. No source code, no refactor, no auth/db/UI/.replit/deployment-config/infrastructure changes. v1.0.0 launch state: GO, unchanged.*
