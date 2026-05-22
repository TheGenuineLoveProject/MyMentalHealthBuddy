# MMHB Post-Launch Hardening Ledger

**Status:** Active
**Owner:** Engineering on-call + Architecture / Governance
**Launch state at ledger open:** ✅ **v1.0.0 public beta — GO** (per Phase 34, Phase 33 verification)
**Source of truth:** Phase 28 ledger + Phase 33 verification + Phase 34 finalization
**Companion docs:**
- `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (original 12 TODOs)
- `docs/reports/PHASE_33_HARDENING_VERIFICATION.md` (5 new findings)
- `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md` (Phase 34)
- `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

This document is the **single source of truth for post-launch hardening execution**. It consolidates Phase 28's 12 carried-forward TODOs with Phase 33's 5 newly-identified findings into a unified, severity-ranked, sprint-mapped execution ledger.

The launch decision is **not reopened** by this ledger. Every item below is non-blocking; the v1.0.0 public beta remains **GO** unchanged.

---

## 0. Launch state confirmation

```
v1.0.0 PUBLIC BETA STATUS:    ✅ GO (unchanged)
LAUNCH BLOCKERS:              0
LEDGER OPEN:                  17 items (0 S0, 5 S1, 7 S2, 5 S3)
HIGHEST PRIORITY:             F-33.6 — SSR BHCE resources into SPA shell
DEFERRED TODOs (no sprint):   TODO-18.1 (www→apex 301) — see §6
DEPENDENCY MODERATE FINDINGS: 4 in dev-only drizzle-kit→esbuild chain (§7)
```

This ledger does not modify production. It does not re-grade Phase 33. It is a planning artifact for Sprint 1–3.

---

## 1. Severity rubric (recap)

Severity is assigned per MMHB v7.4 kernel asymmetry — BHCE-adjacent risk and crisis-routing integrity dominate over performance and cosmetics.

| Severity | Definition | Time to fix |
|---|---|---|
| **S0** | Launch blocker. Crisis routing broken, apex down, data loss risk, security boundary breach. | Immediate — do not launch / immediate rollback |
| **S1** | Important post-launch. BHCE resilience, runtime dependency health, performance regressions, SEO completeness. | Within 30 days (Sprint 1) |
| **S2** | Quality / hygiene. Bundle splits, observability, hardening upgrades. | Within 60 days (Sprint 2) |
| **S3** | Cosmetic / cleanup. De-duplication, redirect polish, optional uploads. | Within 90 days (Sprint 3) or conditional |

**Current S0 count: 0.** Phase 33 confirmed and Phase 34 ratified.

---

## 2. Full open ledger (17 items)

Items prefixed `TODO-` are carried from Phase 28. Items prefixed `F-` are new findings from Phase 33 verification.

### Sprint 1 (within 30 days of launch)

| ID | Sev | One-line | Source |
|---|---|---|---|
| **F-33.6** | **S1** | **SSR BHCE three resources (988 / 741741 / 911) into SPA shell — JS-failure resilience** | **Phase 33 §3.9** |
| TODO-26.1 | S1 | AVIF avatar regions (image format upgrade) | Phase 28 |
| TODO-26.2 | S1 | AVIF brand logos (image format upgrade) | Phase 28 |
| F-33.3 | S3 | Trim `cdn.jsdelivr.net` from CSP `font-src` (Phase 26 found 0 runtime use) | Phase 33 §3.4 |
| F-33.4 | S3 | `/readyz` → `cache-control: no-store` (currently `public, max-age=0`) | Phase 33 §3.5 |
| TODO-26.3 | S3 | De-dupe 4 byte-identical asset pairs | Phase 28 |
| TODO-18.4 | S3 | Investigate duplicate HSTS header (edge + app); cosmetic | Phase 28 / re-confirmed Phase 33 §3.4 |

### Sprint 2 (within 60 days of launch)

| ID | Sev | One-line | Source |
|---|---|---|---|
| TODO-22.2 | S1 | OTel cluster coordinated bump | Phase 28 |
| F-33.1 | S2 | Per-route SSR/prerender of title / meta / canonical (SPA-hydrated today) | Phase 33 §3.3 |
| F-33.5 | S2 | CSP `'unsafe-inline'` → nonce/hash migration (script-src + style-src) | Phase 33 §3.6 |
| TODO-26.4 | S2 | Consolidate avatar source directories | Phase 28 |
| TODO-23.1 | S2 | Prometheus `/metrics` endpoint | Phase 28 |

### Sprint 3 (within 90 days of launch)

| ID | Sev | One-line | Source |
|---|---|---|---|
| TODO-22.1 | S1 | Express 4 → 5 migration | Phase 28 |
| TODO-24.2 | S3 | Sentry source-map upload (optional) | Phase 28 |

### Conditional (triggered if budget ceilings crossed)

| ID | Sev | Trigger | Source |
|---|---|---|---|
| TODO-24.1 | S2 | WellnessDashboard > 350 KB raw (currently 275 KB) | Phase 28 / Phase 33 §3.7 |
| TODO-24.3 | S2 | `_autopilot` / `AdvancedToolsPage` exceed split heuristic | Phase 28 / Phase 33 §3.7 |

### Deferred (no sprint — see §6)

| ID | Sev | Reason | Source |
|---|---|---|---|
| TODO-18.1 | S2 | www → apex 301 redirect — kept deferred per Phase 35 directive | Phase 28 |

**Totals:** 17 open · 0 S0 · 5 S1 · 7 S2 · 5 S3
**Of which:** 7 Sprint 1 · 5 Sprint 2 · 2 Sprint 3 · 2 conditional · 1 deferred

---

## 3. First safe sprint plan (Sprint 1)

Sprint 1 is the first 30 days post-launch. The plan is ordered by BHCE/crisis-routing priority first, then by ease/safety.

| Order | Item | Day target | Owner | Pre-merge gate |
|---|---|---|---|---|
| 1 | **F-33.6 — SSR BHCE resources** | D+7 | Architecture + Engineering (joint) | §4 gate F-33.6 |
| 2 | F-33.4 — `/readyz` `no-store` | D+10 | Engineering on-call | §4 gate F-33.4 |
| 3 | F-33.3 — trim `cdn.jsdelivr.net` from CSP | D+12 | Engineering on-call | §4 gate F-33.3 |
| 4 | TODO-26.3 — de-dupe byte-identical assets | D+14 | Engineering | §4 gate TODO-26.3 |
| 5 | TODO-18.4 — duplicate HSTS investigation | D+18 | Engineering | §4 gate TODO-18.4 |
| 6 | TODO-26.1 — AVIF avatar regions | D+22 | Engineering | §4 gate TODO-26.1 |
| 7 | TODO-26.2 — AVIF brand logos | D+28 | Engineering | §4 gate TODO-26.2 |

**Sprint discipline:**
- Items merge one at a time. No multi-item PRs.
- Every item must pass its §4 verification gate before merge.
- Every item must carry a §5 rollback rule.
- F-33.6 (BHCE) is the **mandatory first item** — no other Sprint 1 item may merge ahead of it. If F-33.6 slips, it carries its slip forward into the schedule rather than pushing other items.

---

## 4. Exact verification gate per item

Each gate is a single read-only command (or visible browser check) that must PASS before the item merges. All gates are Replit-native — no Docker, no external CI.

### Sprint 1

#### F-33.6 — SSR BHCE resources (highest priority)
```bash
# Pre-merge gate
PROD="https://mymentalhealthbuddy.com"
# 1. /crisis raw HTML must contain all three crisis literals
crisis=$(curl -s --max-time 8 "${PROD}/crisis")
echo "$crisis" | grep -E "988"     | wc -l   # expect >= 1
echo "$crisis" | grep -E "741741"  | wc -l   # expect >= 1
echo "$crisis" | grep -E "911"     | wc -l   # expect >= 1
# 2. Apex still 200; /crisis still 200
curl -s -o /dev/null -w "/ %{http_code}\n/crisis %{http_code}\n" --max-time 8 "${PROD}/" "${PROD}/crisis"
# 3. Browser visual: disable JS, load /crisis, confirm 988/741741/911 visible
```
**PASS criteria:** all three grep counts ≥ 1 AND both endpoints 200 AND JS-disabled browser load shows resources.

#### F-33.4 — `/readyz` `no-store`
```bash
curl -sI --max-time 8 "https://mymentalhealthbuddy.com/readyz" | grep -i "cache-control"
# expected: cache-control: no-store
```

#### F-33.3 — trim `cdn.jsdelivr.net`
```bash
curl -sI --max-time 8 "https://mymentalhealthbuddy.com/" | grep -i content-security-policy | grep -c "cdn.jsdelivr.net"
# expected: 0
# AND no font 404s in browser network tab on /, /pricing, /crisis
```

#### TODO-26.3 — de-dupe byte-identical assets
```bash
# Pre-merge gate: confirm pre/post diff
# 1. Build artifact passes existing budgets (Phase 33 §3.7)
ls client/dist/assets | wc -l        # post < pre (4 fewer)
find client/dist -name "*.map" | wc -l   # 0
# 2. Apex + /crisis still 200 post-deploy
```

#### TODO-18.4 — duplicate HSTS
```bash
curl -sI --max-time 8 "https://mymentalhealthbuddy.com/" | grep -ic "strict-transport-security"
# expected: 1 (was 2)
# AND HSTS max-age remains >= 31536000
```

#### TODO-26.1 / TODO-26.2 — AVIF
```bash
# Build artifact gate: AVIF files emitted + PNG/JPG fallbacks retained
find client/dist -name "*.avif" | wc -l    # expect > 0
# Visual: avatar regions render correctly in Chrome + Safari + Firefox
# Bundle: total dist remains <= 50 MB (Phase 26 ceiling)
du -sh client/dist
```

### Sprint 2

#### TODO-22.2 — OTel cluster coordinated bump
```bash
# Pre-merge: dependency check + restart smoke
npm ls @opentelemetry/api @opentelemetry/sdk-node 2>&1 | head -5
# Post-deploy:
curl -s --max-time 8 "https://mymentalhealthbuddy.com/api/health" | grep -o '"sentry":[a-z]*'
# expected: "sentry":true (observability still healthy)
```

#### F-33.1 — per-route SSR meta
```bash
# Post-deploy: / and /crisis must have DIFFERENT canonical
root_canon=$(curl -s --max-time 8 "https://mymentalhealthbuddy.com/" | grep -oE '<link rel="canonical"[^>]*>')
crisis_canon=$(curl -s --max-time 8 "https://mymentalhealthbuddy.com/crisis" | grep -oE '<link rel="canonical"[^>]*>')
[ "$root_canon" != "$crisis_canon" ] && echo "PASS" || echo "FAIL"
```

#### F-33.5 — CSP nonce/hash migration
```bash
# Pre-merge gate
csp=$(curl -sI --max-time 8 "https://mymentalhealthbuddy.com/" | grep -i content-security-policy)
echo "$csp" | grep -o "'unsafe-inline'" | wc -l   # expect 0
echo "$csp" | grep -oE "'nonce-[^']+'" | wc -l    # expect >= 1
# AND CSP-Report-Only run for 7 days first with zero violations
```

#### TODO-26.4 — consolidate avatar source dirs
```bash
# Pre-merge: build artifact unchanged on disk (same hashes)
ls client/dist/assets/*.{js,css,png,svg,webp} 2>/dev/null | wc -l
# Source-only refactor; runtime output identical.
```

#### TODO-23.1 — Prometheus `/metrics`
```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 8 "https://mymentalhealthbuddy.com/metrics"
# expected: 200 AND requires ADMIN_TOKEN OR is bound to localhost
# Public access MUST be guarded — confirm with: curl without auth → 401/403
```

### Sprint 3

#### TODO-22.1 — Express 4 → 5
```bash
# Pre-merge: full smoke + all Phase 33 §3.1-3.5 commands
# Post-deploy: § 5 of decision doc full health checklist must PASS
# Required: integration-test sweep against all 127 routes (no regressions)
```

#### TODO-24.2 — Sentry source maps
```bash
# Pre-merge: source maps uploaded to Sentry only, NOT shipped in dist
find client/dist -name "*.map" | wc -l       # expect 0 (unchanged)
# Sentry dashboard: most recent error has resolved frames
```

### Conditional

#### TODO-24.1 / TODO-24.3 — bundle splits
```bash
# Trigger condition (monitored monthly):
ls -l client/dist/assets/WellnessDashboard-*.js | awk '{print $5}'   # > 358400 (350 KB)?
# If trigger fires, apply split; gate:
for f in client/dist/assets/WellnessDashboard*.js; do wc -c < $f; done
# expected: each <= 200 KB raw post-split
# Initial path combined gz remains <= 150 KB (Phase 33 baseline 99,386 B)
```

---

## 5. Rollback rule per future fix

Every item in this ledger ships with a **per-item rollback rule**. The pattern is uniform: **identify last known-good deploy → Replit Deployments → Restore → re-run §5 health checklist of decision doc → preserve failing artifact → open post-mortem.**

| Item | Rollback trigger | Rollback action | Preserve |
|---|---|---|---|
| **F-33.6 BHCE SSR** | `/crisis` 200 but resources missing in raw HTML OR JS-disabled load broken | Immediate (5-min SLO) Replit Restore to pre-F-33.6 deploy | Failing artifact + `POST_INCIDENT_BHCE_<TS>.md` within 24h |
| F-33.4 `/readyz` | `/readyz` returns non-200 OR breaks deployment health probe | Restore to pre-fix; revert is a 1-line server change | INC ticket, post-mortem within 48h |
| F-33.3 CSP `font-src` | Font 404s in browser network tab on any page | Restore (CSP is header-only; no runtime side effect) | Browser console screenshot |
| TODO-26.3 asset de-dupe | Any asset 404 in production | Restore (de-dupe changes asset paths) | List of broken paths |
| TODO-18.4 HSTS | HSTS count goes to 0 (regression beyond fix) OR max-age drops below 31536000 | Restore immediately; HSTS removal is a security regression | INC + 48h post-mortem |
| TODO-26.1/26.2 AVIF | AVIF fails to render in Safari (most likely failure mode) OR bundle > 50 MB | Restore; ensure PNG/JPG fallback was retained | Browser matrix screenshot |
| TODO-22.2 OTel bump | `/api/health` `services.sentry` flips to false OR observability gap > 5 min | Restore; re-pin previous OTel cluster | Health output log |
| F-33.1 per-route meta | Crawler errors in Search Console OR /, /crisis return non-200 | Restore; meta change is pure SSR-shell edit | Crawler error report |
| F-33.5 CSP nonce | CSP violations in CSP-Report-Only > 0 during 7d soak | **Do not promote** from Report-Only to enforced; revert at planning time | Violation report |
| TODO-26.4 avatar dirs | Source-only refactor — runtime output should be identical; any visual diff = failure | Restore (git revert of refactor commit) | Visual diff screenshot |
| TODO-23.1 `/metrics` | Endpoint exposed without auth OR leaks secret/PII | **Immediate P0 restore** (security boundary breach) | INC + 24h post-mortem |
| TODO-22.1 Express 5 | Any 127-route regression in integration sweep | Full restore; Express 5 migration is high-blast-radius — restore decision authority lies with Architecture signer | Integration sweep log + 7d post-mortem |
| TODO-24.2 Sentry maps | Source maps accidentally shipped in dist (find = nonzero) | Restore; this is a source-leak risk | Phase 24 baseline reaffirmed |
| TODO-24.1 / 24.3 splits | Initial-path gz > 150 KB OR any chunk > 350 KB OR TTFB regression > 50% | Restore; bundle splits are reversible by reverting Vite config | Bundle stats + TTFB sample |

**Universal rollback discipline:** rollback within 5 minutes of P0 confirmation. Preserve the failing artifact (do NOT delete). Open a post-incident document on the timeline defined in `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md` §6.

**BHCE asymmetry preserved:** any item whose failure touches `/crisis` reachability or BHCE resource rendering escalates immediately to P0 BHCE — the Architecture / Governance signer's veto authority from Phase 30 §5 applies to every Sprint 1–3 fix, not just the launch decision.

---

## 6. Deferred items — www → apex 301 (TODO-18.1)

Per Phase 35 directive, **TODO-18.1 (www → apex 301 redirect) is kept deferred** beyond Sprint 1–3.

| Item | Status | Reason |
|---|---|---|
| TODO-18.1 — www → apex 301 redirect | **DEFERRED** (no sprint assignment) | Both apex and www currently return 200 (Phase 33 §3.1 maintained). The redirect is a SEO polish item, not a launch or operational gate. Holding it allows future hosting-config decisions (CDN, multi-region) to be made before fixing the redirect topology. |

Re-evaluation trigger: if Sprint 1–3 hardening introduces multi-host routing, OR if Search Console reports www-vs-apex duplicate-content penalties, this item re-enters the active sprint queue at S2.

---

## 7. Dependency moderate findings — dev-chain only (no runtime risk)

Per Phase 33 §3.10 + Phase 35 directive, the **4 moderate npm audit findings are confirmed non-runtime, dev-chain only**. They do not block launch, do not appear in production deps, and are not fixed by Sprint 1–3.

```
4 moderate severity vulnerabilities (per npm audit --omit=dev)
  esbuild  <= 0.24.2
    └─ @esbuild-kit/core-utils
       └─ @esbuild-kit/esm-loader
          └─ drizzle-kit              ← build-time tooling only
```

- **0 critical, 0 high** in production deps (Phase 33 §3.10 confirmed).
- All 4 moderate findings sit in the `drizzle-kit` toolchain, which runs only at schema-push / migration time. The runtime production server (Express + the bundled client) does not load this code path.
- `npm audit fix --force` would install `drizzle-kit@0.18.1` (breaking change) — **NOT executed** per strict mode.
- Re-evaluation trigger: if `drizzle-kit` upstream ships a non-breaking fix, the bump moves into Sprint 2 dependency hygiene.

**Net runtime risk: zero.** This finding is tracked here so future audits do not re-discover it as if it were new.

---

## 8. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:        ✅ GO (re-confirmed)
LAUNCH BLOCKERS:                   0
PHASE 33 EVIDENCE:                 unchanged (HEAD at ledger open: 2e04d1dcf, Phase 34 finalization)
PHASE 34 DECISION:                 unchanged
BHCE GATE:                          ✅ /crisis 200; F-33.6 ledgered as Sprint 1 highest-priority resilience upgrade
NEW S0:                             0
NEW S1:                             0 (F-33.6 already ledgered at Phase 33)
LEDGER ROLE:                        planning artifact only; does not change runtime state
```

This ledger is read-only with respect to runtime. It does not deploy anything, does not change configuration, does not modify a single byte of `client/dist`. Phase 34's GO decision stands intact.

---

## 9. References

- Phase 28 post-launch TODO ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`
- Phase 33 hardening verification: `docs/reports/PHASE_33_HARDENING_VERIFICATION.md`
- Phase 34 launch decision: `docs/launch/V1_PUBLIC_BETA_LAUNCH_DECISION.md`
- Phase 34 finalization report: `docs/reports/PHASE_34_PUBLIC_BETA_LAUNCH_FINALIZATION.md`
- Phase 32 production hardening checklist: `docs/operations/PRODUCTION_HARDENING_CHECKLIST.md`
- Phase 30 launch approval matrix: `docs/operations/LAUNCH_APPROVAL_MATRIX.md`
- Phase 29 production probe checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md`
- Phase 27 launch operations runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md`
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Active hardening ledger. Documentation only. No source code, no refactor, no auth/db/routes/UI/.replit/deployment-config/infrastructure changes. v1.0.0 launch state: GO, unchanged.*
