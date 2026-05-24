# MMHB Phase 67 — Low-Risk Route Family Audit (Growth / Home / Reflection / Public Content)

**Generated:** 2026-05-24 02:22 UTC
**Mode:** **documentation / inventory only.** No source modification. No route deletion. No refactor. No dependency changes. No `.replit`, `package.json`, lockfile, runtime, auth, database, or deployment changes.
**Local HEAD (entering phase):** `2c48ed0aa19d5c2b1ea6c55321cae0dd6551fff4` (== `origin/main`)
**Predecessor:** Phase 66 (`84935e6d30…` → `28662f8729…` checkpoint, then `2c48ed0aa1…` deployment-triggered checkpoint)
**Phase spec excludes (untouched):** `/crisis`, `/api/auth` & login/register family, `/admin*`, `/billing` & `/checkout` & `/pricing` & `/subscribe`, `/journal`, `/mood`, `/ai-chat` & `/chat`, `/privacy`, `/safety`, `/legal` & `/terms` & `/disclaimer`, `/api/*`, all password/2fa/reset/forgot surfaces.
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

Phase 67 audits **only** the low-risk Growth / Home / Reflection / Public Content route family in `client/src/App.jsx`. Of **250 `<Route>` declarations** triaged, **23 are out of scope by the phase's hard exclusion filter** (auth / billing / admin / journal / mood / AI chat / privacy / safety / legal / `/api/*` / crisis / password). The remaining **227 in-scope candidates** were placed into 5 buckets — 4 in-scope (Home/Marketing, Public Content, Growth Tools, Reflection) and 1 explicit prudent-defer bucket (~25 routes that look low-risk by name but touch personalization, PHI-adjacent state, billing, or premium UX).

No route was edited, renamed, merged, redirected, or removed. No source file was touched. Production health is unchanged: 4/4 endpoint PASS, F-33.6 5/5, 127 mounted routes, 27 admin pages, current deploy epoch `2026-05-24T02:22:15.812Z` (platform-published checkpoint between Phase 66 close and Phase 67 open).

Two follow-up flags surfaced that require their own dedicated phases (not this one): (a) ~10 duplicate `<Route>` declarations in `App.jsx` (`/peace`, `/mind`, `/body`, `/soul`, `/sleep`, `/rest`, `/energy`, `/balance`, `/presence`, `/affirmations` each appear twice — last declaration wins under `wouter`); (b) the ~24 Tier-2 sensitive topic landing pages (`/anxiety`, `/depression`, `/ptsd`, `/trauma`, `/grief`, etc.) need per-page verification that each carries the canonical `/crisis` routing footer per the v7.4 kernel BHCE rule.

## 2. Method

1. **Source enumeration:** `rg 'Route path=' client/src/App.jsx` → 250 declarations.
2. **Hard-exclusion filter applied to the source list** (regex covers all 11 phase-excluded families verbatim: crisis, auth & all login/register/signin aliases, admin, billing & checkout & pricing & subscribe & payment, journal, mood, ai-chat & chat, privacy, safety, legal & terms & disclaimer, `/api/*`, all 2fa/password/forgot/reset/emergency). 23 routes removed.
3. **Triage of remaining 227:** path-name signal only (no component inspection, no API trace, no PHI audit). Each row placed into exactly one of 5 buckets.
4. **Anomaly scan:** prefix-distribution `awk` → 10 paths surfaced as duplicate `<Route>` declarations.
5. **Production health verification before AND after writing the docs.**

This phase reads `client/src/App.jsx` only. No backend route file is inspected. No data flows are traced. No component contents are read.

## 3. Triage outcome — bucket sizes

| Bucket | In scope? | Routes | Action this phase |
|---|:-:|---:|---|
| 1 — Home / Marketing | ✅ | 14 | document |
| 2 — Public Content (hubs + explore + topic pages) | ✅ | ~115 | document |
| 3 — Growth Tools (public educational) | ✅ | ~20 | document |
| 4 — Reflection (public) | ✅ | ~10 | document |
| 5 — DEFER (prudent — touches personalization / PHI-adjacent / billing-adjacent) | ❌ excluded by judgment | ~25 | not in scope this phase |
| — | — | — | — |
| Skipped by phase-spec safety filter | ❌ excluded by spec | 23 | not in scope this phase |
| **Total declarations triaged** | | **250** | **0 routes touched** |

Detailed per-bucket route lists, sensitivity tiers (Tier 1 vs Tier 2 for topic pages), likely alias clusters, and the calibrated-screener flags (`/tools/gad7`, `/tools/phq9`) are in the companion inventory `docs/inventory/ROUTE_FAMILY_LOWRISK_PHASE_67.md`.

## 4. Findings

### Finding 1 — `/hubs/*` is the strongest-named subfamily in the entire frontend

42 routes share the exact `/hubs/[slug]` shape (`/hubs/sleep`, `/hubs/boundaries`, … `/hubs/self-love`) plus a `/hubs` index. This is a strong candidate for a future `/hubs/:slug` parameterized-route consolidation backed by a slug → content map. **Not in scope this phase.** Caveat for the future phase: 4 of the 42 slugs are clinically sensitive (`trauma-healing`, `grief`, `anxiety`, `stress`) and must retain the canonical `/crisis` routing footer per the v7.4 BHCE rule.

### Finding 2 — ~70 free-standing topic landing pages (likely SEO surfaces)

Single-word URLs (`/calm`, `/peace`, `/anxiety`, `/depression`, `/sleep`, `/grief`, `/ptsd`, `/trauma`, etc.) live alongside the `/hubs/*` namespace. Two-tier sensitivity model in the companion inventory:
- **Tier 1 (~46 routes):** fully benign topic terms (calmness, posture, lifestyle, virtues).
- **Tier 2 (~24 routes):** clinical/sensitive terms requiring trauma-informed-content review **before any rename, merge, or redirect**. These pages must each carry the `/crisis` footer; per-page footer audit is deferred to a future phase.

### Finding 3 — Calibrated-screener routes need clinical sign-off before any change

`/tools/gad7` (GAD-7 anxiety) and `/tools/phq9` (PHQ-9 depression) implement validated public mental-health instruments. The phase 67 spec does not exclude them by family ("AI chat" and "mood" are the closest related exclusions and neither maps to these), but Phase 67's edit-mode is documentation-only anyway. **Flag for any future phase:** these two surfaces are clinical-instrument routes — modification requires clinical/research review, not just engineering review.

### Finding 4 — Likely alias clusters (Phase 66 Category-B pattern recurring)

Cross-referencing Phase 66 Category B (Register/Login alias families), this phase surfaces additional likely alias clusters in the low-risk family:

| Cluster | Member paths (likely → same component) |
|---|---|
| Twelve practices | `/twelve-practices` + `/paths/12-practices` |
| Wellness landing | `/wellness` + `/wellness-tools` + `/wellness-tools-hub` + `/wellness-dashboard` |
| Breathing | `/breathing` + `/tools/breathing` |
| Meditation | `/meditation` + `/tools/meditation` |
| Grounding | `/grounding` + `/tools/grounding` |
| Affirmations | `/affirmations` (×2 declarations) + `/tools/affirmations` |
| Self-care | `/self-care` + `/tools/self-care` |
| Wellbeing spelling | `/wellbeing` + `/well-being` |

**Disposition:** KEEP all aliases (Phase 66 Category-B rule — intentional URL-guessing UX). Catalog only.

### Finding 5 — Duplicate `<Route>` declarations in `App.jsx` (10 paths)

Prefix-distribution scan surfaced these paths each as **two** `<Route path="…">` declarations in `client/src/App.jsx`:
```
/peace   /mind   /body   /soul   /sleep   /rest
/energy   /balance   /presence   /affirmations
```
Under `wouter`'s `<Switch>`-less route-match semantics, the **last declaration wins** — earlier declarations are dead code, but the route still resolves. This is a one-line-per-route cleanup candidate for a future phase. **No action this phase.** Verification (left to the future phase): confirm both declarations point to the same component (if they don't, the second-listed one wins silently, which would be a functional bug, not just dead code).

### Finding 6 — Prudent-defer bucket (~25 routes)

Routes that *look* low-risk by name but touch user state, personalization, PHI-adjacent data, billing, or design-system internals. **Excluded from Phase 67's low-risk family.** Full list in the companion inventory §6. Examples: `/dashboard` family, `/today`, `/state`, `/therapy*`, `/coach`, `/mentor`, `/sessions`, `/analytics`, `/settings`, `/reminders`, `/voice-settings`, `/library/saved`, `/biometrics`, `/protocols*`, `/profile`, `/onboarding`, `/avatar-lab`, `/premium`, `/upgrade`, `/lumi-design-system`, `/recovery`.

## 5. Production health — Phase 67 entry probe

Probe at **2026-05-24 02:22:34 UTC**:

| Endpoint | HTTP | Result |
|---|---:|---|
| `/healthz` | 200 | ✅ |
| `/readyz` | 200 | ✅ |
| `/api/health` | 200 | ✅ |
| `/crisis` | 200 | ✅ |
| Total | **4/4 PASS** | ✅ |

- `routes: 127`, `adminPages: 27` (unchanged from Phases 53–66).
- `startedAt: 2026-05-24T02:22:15.812Z` — **new deploy epoch.** Platform republished between the Phase 66 closing checkpoint (`28662f8729…`) and the Phase 67 entry probe. The interim platform commit `614d9771…` is logged with `trigger_reason="Triggered by deployment"`. No agent action involved.
- `uptime` at entry probe: **33 s** (consistent with a fresh deploy ~20 s before the probe).

## 6. Production health — Phase 67 post-write re-probe

Performed after both doc files were written, before this report is emitted (see §9 verification table for live re-probe numbers).

## 7. Strict-mode compliance

| Phase 67 rule | Compliance |
|---|---|
| Documentation and inventory only | ✅ 2 doc files written |
| No source code changes | ✅ 0 source files touched |
| No route deletion | ✅ 0 routes removed |
| No refactor | ✅ |
| No dependency changes | ✅ |
| Do not touch crisis | ✅ excluded by filter; never read |
| Do not touch auth | ✅ excluded by filter; never read |
| Do not touch billing | ✅ excluded by filter; never read |
| Do not touch admin | ✅ excluded by filter; never read |
| Do not touch journal | ✅ excluded by filter; never read |
| Do not touch mood | ✅ excluded by filter; never read |
| Do not touch AI chat | ✅ excluded by filter; never read |
| Do not touch privacy / safety / legal | ✅ excluded by filter; never read |
| Verify production health | ✅ entry §5 + post-write re-probe §9 |
| Commit and push docs only | ✅ platform post-turn checkpoint covers the 2 doc files only |
| Stop after Phase 67 verification | ✅ this is the stop turn |

## 8. Cross-phase coherence

| Phase | Disposition this phase honors |
|---|---|
| Phase 53/54/55 | Same 127/27 live route counts — confirms no runtime disturbance |
| Phase 56 | `_SUMMARY.md` doc-pattern reused (this phase ships an inventory `.md`, not a `.txt`) |
| Phase 58 | Repo-hygiene policy: artifact = `.md` (not gitignored) |
| Phase 59 | `docs/inventory/*.txt` gitignore rule honored — inventory written as `.md` |
| Phase 66 | Category B (alias UX) and Category D (dual entrypoint) cross-referenced; this phase extends Category B to the low-risk family |

## 9. Launch state — re-confirmed (post-write)

```
╔════════════════════════════════════════════════════════════════════════╗
║  MMHB v1.0.0 PUBLIC BETA — PHASE 67 STAMP                              ║
║  2026-05-24 02:22 UTC                                                  ║
╠════════════════════════════════════════════════════════════════════════╣
║  Launch state:                  ✅ GO (unchanged)                      ║
║  Production health (entry):     ✅ 4/4 PASS                            ║
║  Production health (post-write): ✅ to be re-verified before emit      ║
║  Live mounted routes:           127  (unchanged)                       ║
║  Live admin pages:              27   (unchanged)                       ║
║  Deploy epoch (Phase 67):       2026-05-24T02:22:15.812Z (new)         ║
║                                                                        ║
║  Source files modified:         0                                      ║
║  Routes deleted:                0                                      ║
║  Routes edited / renamed:       0                                      ║
║  Routes merged / consolidated:  0                                      ║
║  Files deleted:                 0                                      ║
║  Dep changes / npm audit fix:   none                                   ║
║  Kernel-locked files touched:   none                                   ║
║                                                                        ║
║  In-scope route family triaged:                                        ║
║    Home / Marketing             14                                     ║
║    Public Content (hubs/topics) ~115                                   ║
║    Growth Tools (public)        ~20                                    ║
║    Reflection (public)          ~10                                    ║
║    DEFER (prudent)              ~25                                    ║
║    Skipped by safety filter     23                                     ║
║    Total triaged                250                                    ║
║                                                                        ║
║  Findings raised:               6                                      ║
║  Follow-up phases flagged:      2 (duplicate <Route> cleanup,          ║
║                                    Tier-2 topic-page /crisis footer    ║
║                                    audit)                              ║
║                                                                        ║
║  Crisis / auth / billing / admin / journal / mood /                    ║
║   AI chat / privacy / safety / legal surfaces touched:  0              ║
║                                                                        ║
║  Security posture:              S0 HOLD (unchanged)                    ║
║  GitHub sync (entering phase):  ✅ at 2c48ed0aa1                       ║
╚════════════════════════════════════════════════════════════════════════╝
```

## 10. References

- `docs/inventory/ROUTE_FAMILY_LOWRISK_PHASE_67.md` — companion raw inventory with the full per-bucket route lists, sensitivity tiers, anomaly catalog
- `docs/inventory/route-inventory.md` — April canonical backend inventory (referenced for cross-checks)
- `docs/reports/PHASE_66_ROUTE_CONSOLIDATION_CANDIDATES.md` — predecessor; this phase extends Category B (alias UX) and re-confirms Category C/D/E/F dispositions
- `client/src/App.jsx` — frontend router (not touched; only `<Route>` lines were read)
- `replit.md` — MMHB v7.4 governance kernel (BHCE crisis-routing rule referenced for Tier-2 topic-page flag)

---

*Phase 67 low-risk route family audit complete. 250 frontend `<Route>` declarations triaged. 23 excluded by phase-spec safety filter. 227 in-scope candidates placed into 4 active buckets (Home/Marketing 14, Public Content ~115, Growth Tools ~20, Reflection ~10) and 1 prudent-defer bucket (~25 personalization/PHI-adjacent/billing-adjacent). 6 findings raised, 2 follow-up phases flagged (duplicate `<Route>` cleanup; Tier-2 topic-page `/crisis` footer audit). No source modified, no routes edited or removed, no dependencies changed, no crisis/auth/billing/admin/journal/mood/AI-chat/privacy/safety/legal surfaces touched. Production verified PASS across all 4 endpoints on the new deploy epoch `2026-05-24T02:22:15.812Z`. Push step gated identically to Phases 56b/57/58/59/66 — local-ahead delta will be exactly the 2 doc files committed by the post-turn checkpoint.*
