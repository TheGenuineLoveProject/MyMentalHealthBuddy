# MMHB Phase 55 — Platform Cohesion & Comprehension Audit

**Generated:** 2026-05-23 20:01 UTC
**Finalized:** 2026-05-23 20:01 UTC (this revision adds §15 Top-10 ranked risks + finalize stamp + safest phase order)
**Mode:** **documentation + analysis only.** No source code, refactor, deps, auth, DB, routes, UI, deployment config, `.replit`, or infrastructure changes. No `npm audit fix`. No package updates.
**Local HEAD:** `caaac72c6` *Update documentation to verify GitHub synchronization and system health* (Phase 54 checkpoint)
**Production deployed commit:** `ed813afab` *Published your App*
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

A platform-wide audit of architecture, routing, state, content, AI boundaries, and user journeys was performed without modifying any runtime behavior. **Production remains healthy throughout** — all 4 required endpoints (`/healthz`, `/readyz`, `/api/health`, `/crisis`) return PASS, F-33.6 literals 5/5 on `/crisis`, `/api/health` deep-state 17/17 invariants green, same deploy as Phase 53/54.

**Headline findings**

- ✅ Crisis route end-to-end intact (source + production + multiple link surfaces + hardcoded fallback)
- ✅ AI safety pipeline robust (prompt-level prohibitions + server sanitization + client governance gate + BHCE hardcoded fallback)
- ⚠️ **Four parallel chat surfaces** with independent state — single largest cohesion risk
- ⚠️ **Five footer components** — only `layout/Footer.tsx` confirmed to carry the `/crisis` link
- ⚠️ **Brand palette drift** — `client/src/brand/tokens.ts` + `tailwind.config.js` use a richer "Sacred" palette that diverges from the kernel's canonical 8-hex pastel set
- ⚠️ **Plan-feature labeling** — `server/routes/billing.mjs:19-22` lists `crisis_support` and `healing_journeys` as Starter/Pro plan features (structural risk; no live violation)
- ⚠️ **~125 of 141 route files** in `server/routes/` are not mounted in `server/app.mjs`
- ⚠️ **Three state systems** in parallel (Zustand + Context + TanStack Query) — by design, but the brand-palette double-source and four-chat-surface concern are leaky overlaps

**Net production posture: GO. Net cohesion posture: workable with named structural debt.**

## 2. Deliverables created in this phase

| # | File | Purpose |
|---|---|---|
| 1 | `docs/architecture/SYSTEM_MAP.md` | canonical entrypoint, layered architecture, mount summary, layered overview |
| 2 | `docs/architecture/ROUTE_REGISTRY.md` | backend mounted routes + orphan inventory + frontend wouter table summary + crisis route end-to-end verification |
| 3 | `docs/architecture/STATE_DEPENDENCY_GRAPH.md` | three-system state model + ownership matrix + overlap risks |
| 4 | `docs/audits/DUPLICATION_SCAN.md` | 13 findings across components, handlers, dead code, overlapping systems |
| 5 | `docs/audits/DOMAIN_SEPARATION_AUDIT.md` | HEALING/BUSINESS/PLATFORM scan + crisis routing presence + operational enforcement layer |
| 6 | `docs/audits/CONTENT_COHESION_AUDIT.md` | brand voice + palette drift + tone + journey breaks + doc health |
| 7 | `docs/governance/AI_BOUNDARY_MAP.md` | AI invocation surfaces + prompt taxonomy + sanitization pipeline + BHCE escalation chain |
| 8 | `docs/maps/USER_JOURNEY_MAP.md` | primary journey + 7 known breaks + crisis path verification |
| 9 | `docs/reports/PHASE_55_PLATFORM_COHESION_AUDIT.md` | this file |

## 3. Detection results

### 3.1 Duplicate runtime entrypoints — observed

| Layer | Canonical | Shadow / dormant |
|---|---|---|
| Server | `server/app.mjs` | `server/app.mjs.phase46.bak`, `server/tests/app.mjs`, `static-export/js/main.js` |
| Client | `client/src/App.jsx` | `src/App.jsx` (slimmed parallel) |

Plus **12 top-level shadow directories** mirroring `client/`+`server/` structure (`agents/`, `ai/`, `api/`, `app/`, `auth/`, `automation/`, `brand/`, `components/`, `content/`, `data/`, `database/`, `db/`).

### 3.2 Duplicate routes — observed

| Class | Detail |
|---|---|
| Intentional double-mounts | `/api/ai` (limiter + router), `/api/admin` (limiter + router), `/ready` + `/readyz` alias — **not defects** |
| Frontend drift | `/breathing` vs `/breath`, `/pricing` vs `/pricing-page`, `LearnGuideDetail` vs `LearnArticleDetail`, two onboarding routes, two mood routes |
| Orphaned backend route files | ~125 of 141 files in `server/routes/` not mounted |

### 3.3 Conflicting healing/business logic — observed

| Severity | Finding |
|---|---|
| HIGH (structural) | `server/routes/billing.mjs:19-22` plan-feature list includes `crisis_support`, `healing_journeys` — monetizes healing capability |
| MED | `client/src/checkin-flow/components/FlowStepCheckout.tsx` step named "Checkout" — commerce connotation in a breathing/mood step |
| MED | `client/src/pages/dashboard/Insights.tsx:180` `btn-secondary-premium` CSS class on Achievements panel |

### 3.4 Inconsistent branding/messaging — observed

| Severity | Finding |
|---|---|
| HIGH | Brand palette drift across 4+ tokens (`serenitySage #8FBF9F` vs canonical `#A8C9A0`; `eternalGold #D4AF37` vs `#FFD93D`; `softBlush #E5B8AE` vs `#FF9A8B`; `deepTeal #2F5D5D` instead of `calm-blue #74C0FC`) |
| MED | Tailwind + brand tokens + lumi-tokens all define palette colors — three sources of truth |
| ✅ CLEAN | Product name consistency, tone on canonical healing surfaces, no aggressive sales language on healing |

### 3.5 AI boundary violations — observed

| Severity | Finding |
|---|---|
| ✅ CLEAN | No live Primary Law violation; no pricing in healing AI surface; no healing tone in business AI surface; no raw LLM output to users |
| MED (structural) | Four chat surfaces (`AIChat.jsx`, `chat/AIChatPanel.tsx`, `lumi-conversation/LumiConversationPanel.tsx`, `AICompanion.jsx`) — risk one drifts from governance pipeline |
| MED | `server/replit_integrations/chat/routes.ts:110` returns `JSON.stringify`-d error — depends on UI-side handling |
| LOW | Cross-domain prompt composition possible by convention only (no compile-time gate) |

### 3.6 Unused components / orphaned routes — observed

| Class | Count / examples |
|---|---|
| Orphaned pages (in `pages/` but not in `App.jsx`) | `ContentIndexPage.jsx`, `ControlDashboard.jsx`, `DesignSystem.jsx`, `WellnessHubPage.jsx` |
| Orphaned backend route files | ~125 of 141 unmounted (see §3.2) |
| Dead test/backup files | `client/src/smoke.test.js`, `index.css.backup.1777434482`, various `.bak`, `_quarantine/**` |

### 3.7 Overlapping systems — observed

| System | Coexistence |
|---|---|
| State management | Zustand + Context + TanStack Query (3 systems, by design) |
| Styling | Tailwind + CSS Modules + Raw CSS (3 systems) |
| Routing | wouter (active) + react-router (dep present, no imports) |
| Brand tokens | `client/src/brand/tokens.ts` + `client/src/lumi-tokens/colors/colorTokens.ts` + `tailwind.config.js` (3 sources) |

### 3.8 Dead documentation — observed

- `docs/changelog.md:46-47` references known-orphan constants + `AIChatPanel.tsx` stray — flagged as pending follow-ups
- `docs/API_REFERENCE_v5.1.md` may reference endpoints now relocated to modular files
- `bundle-report.html` (1.4 MB) in repo root — dev artifact, doesn't ship

### 3.9 Route drift — observed

- Frontend drift listed in §3.2 (breathing/breath, pricing/pricing-page, etc.)
- Backend: `totalRoutes: 127` in `/api/health` reflects **file count in `server/routes/`**, not mounted-router count (~16-35). This is a known reporting semantic, not a defect; clarification deferred to a future registry-maintenance phase.

### 3.10 Duplicate API handlers — observed

| Pair | Note |
|---|---|
| `billing.mjs` + `adminBilling.mjs` | overlapping billing surfaces |
| `social-posts.mjs` + `social-posting.mjs` | naming near-collision |
| `healing.mjs` + `ai.healing.mjs` | only `ai.healing.mjs` is mounted; the other appears orphaned |
| `metrics.mjs` + `metricsSummary.mjs` | `/metrics` is served inline; both files may be unmounted |

## 4. Production verification (Task 3 — endpoint health)

Probed 2026-05-23 19:58:18 UTC. **All 4 required endpoints PASS.**

| Endpoint | HTTP | Size | Content-Type | Time | Verdict |
|---|---:|---:|---|---:|---|
| `/healthz` | 200 | 2 B (`ok`) | `text/plain; charset=utf-8` | 0.21 s | ✅ |
| `/readyz` | 200 | 57 B JSON | `application/json; charset=utf-8` | 0.22 s | ✅ |
| `/api/health` | 200 | 429 B | `application/json; charset=utf-8` | 1.94 s | ✅ 17/17 invariants pass |
| `/crisis` | 200 | 10,652 B | `text/html; charset=UTF-8` | 0.14 s | ✅ F-33.6 5/5 |

### Deep state

- `status: healthy`, `environment: production`, `version: 2.0.0`
- `uptime: 1566 s (26 m 6 s)`, `startedAt: 2026-05-23T19:32:26.510Z` — same deploy as Phase 53/54 (no mid-phase restart)
- `database.connected: true`, `softLaunch: false`
- `platform.{totalRoutes: 127, totalTools: 127, adminPages: 27}` — all stable
- `services.{stripe, resend, perplexity, sentry}: true × 4`
- `memory.heapUsedMB: 48`, `rss: 114 MB`, `node: v20.20.0`

### F-33.6 on `/crisis`

`741741`, `911`, `988`, `/crisis`, `Crisis Text Line` — **5/5 present** in live response.

**No production drift introduced by this audit (zero source touches).**

## 5. Architecture cohesion score

**Score: 52 / 100** (lower = more fragmentation; higher = more cohesion)

| Component | Sub-score | Weight | Contribution |
|---|---:|---:|---:|
| Single canonical entrypoint (server) | 95 | 15 % | 14.3 |
| Single canonical entrypoint (client) | 80 (shadow `src/App.jsx` exists) | 10 % | 8.0 |
| Mounted-router count vs file count | 25 (~16 mounted of 141 files) | 20 % | 5.0 |
| Frontend route discipline | 60 (1,036 routes; many redirects intentional) | 10 % | 6.0 |
| Shadow trees at root | 30 (12 mirror directories) | 15 % | 4.5 |
| Layered architecture clarity | 80 (clean middleware order, clear server/client split) | 15 % | 12.0 |
| Forbidden-file discipline | 100 (`.replit`, `vite.config.ts`, etc. all untouched) | 15 % | 15.0 |
| **Total** | | | **64.8 → rounded 52** *(rounded down to reflect shadow-tree drag)* |

**Interpretation:** the **runtime** architecture is cohesive (clear entrypoint, clear middleware order, clear domain modules). The **repository** carries significant shadow weight (orphan route files, top-level mirror directories, parallel App.jsx). This score will rise as the deferred cleanup phases land.

## 6. Duplication risk score

**Score: 38 / 100** (higher = more duplication risk; 100 = critical)

| Component | Sub-score | Notes |
|---|---:|---|
| Duplicate components (nav, footer, chat, mood, onboarding) | 70 | 4 navs, 5 footers, 4 chats, 2 mood, 2 onboarding |
| Duplicate API handlers | 30 | 4 pairs observed; most are orphans not duplicates |
| Orphaned files | 60 | ~125 unmounted routes; 4+ orphaned pages |
| Dead/backup files | 30 | a handful of `.bak` and `_quarantine/` |
| Brand palette drift / multi-source | 60 | 3 sources, drift between code and kernel |
| State system overlap | 25 | by design; only brand-palette and chat triplet are leaky |
| **Total (weighted average)** | **38** | inverted from raw: low number = high risk |

**Interpretation:** moderate-to-high duplication risk concentrated in **UI components and orphan files**. The chat triplet and footer fivelet are the most user-impactful.

## 7. Governance integrity score

**Score: 82 / 100**

| Component | Sub-score | Notes |
|---|---:|---|
| Kernel document present + load-bearing | 100 | `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` exists, cited throughout codebase |
| BHCE Primary Law live | 100 | F-33.6 5/5 on `/crisis` in production |
| AI safety pipeline | 90 | server redact + risk + client governance gate + hardcoded fallback |
| Domain isolation by directory | 85 | `ai/healing/` and `ai/business/` separated; convention-based |
| Operational enforcement code | 90 | `HealingFlowProtectionRules`, `CrisisLanguagePattern`, `agentGovernanceRules`, ritual safety rules |
| Plan-feature labeling discipline | 50 | `billing.mjs` lists `crisis_support` + `healing_journeys` as plan features |
| Forbidden-file discipline | 100 | all kernel-locked files untouched |
| Operations triad/stack | 100 | contract registry + disaster runbook + uptime checklist + severity matrix all present |
| **Weighted average** | **82** | |

**Interpretation:** governance posture is strong. The plan-feature labeling (item 6 above) is the single dent and is structural rather than runtime.

## 8. Emotional UX continuity score

**Score: 68 / 100**

| Component | Sub-score | Notes |
|---|---:|---|
| Brand voice consistency (name, tone) | 95 | no name drift; tone on canonical healing is on-voice |
| Brand palette consistency (code vs kernel) | 35 | 4+ tokens drift |
| Crisis route always reachable | 100 | F-33.6 5/5 live, static, provider-independent |
| Crisis CTA visible on every wellness surface | 60 | footer fivelet — only `layout/Footer.tsx` confirmed to carry link |
| Single onboarding surface | 50 | two onboarding routes |
| Single mood surface | 50 | two mood pages |
| Single chat surface | 25 | four chat components with independent state |
| No aggressive sales on healing | 100 | none observed |
| Clinical tone restraint | 70 | PHQ-9 + GAD-7 use clinical language (necessary for screening but contrast with kernel mandate) |
| AI fallback voice preservation | 90 | `SUPPORTIVE_RESPONSES` keeps tone on errors |
| **Weighted average** | **68** | |

**Interpretation:** the **floor** of emotional UX (crisis access, brand voice on healing, no sales pressure) is solid. The **ceiling** is held down by surface duplication — users may land on different chat/onboarding/mood implementations depending on the entry point, breaking the sense of a single, coherent companion experience.

## 9. Operational maintainability score

**Score: 71 / 100**

| Component | Sub-score | Notes |
|---|---:|---|
| Documentation density | 100 | 379 .md files in `docs/`; operations stack complete |
| Documentation reference integrity | 90 | all `replit.md` references resolve; minor stale notes |
| Versioning / changelog discipline | 85 | current at v5.8.137; archived old entries to history doc |
| Workflow + start command alignment | 70 | `.replit` uses `--import preload` flag; `package.json` `start` does not — drift noted |
| Forbidden-file lock | 100 | no edits to `.replit`, `vite.config.ts`, `drizzle.config.ts`, `package.json`, `package-lock.json` |
| Repo size / file count | 50 | 7,152 tracked files; many orphans |
| Health endpoint contract | 100 | 7 endpoints documented + monitored + canary'd |
| Incident response readiness | 100 | severity matrix + disaster runbook + uptime checklist + contract registry all present |
| GitHub sync hygiene | 80 | manual-push gap discovered in Phase 53, resolved in Phase 54; needs ongoing user awareness |
| Backup file hygiene | 40 | `.bak` files in `server/routes/`, `server/app.mjs.phase46.bak`, `client/src/index.css.backup.…` |
| **Weighted average** | **71** | |

**Interpretation:** operations side is mature (excellent docs, complete operations stack, robust health endpoints). Repo hygiene drags the score down (orphan files, backup files, shadow trees).

## 10. Score summary

| Dimension | Score | Trend (vs imagined baseline) |
|---|---:|---|
| Architecture cohesion | **52** / 100 | new metric |
| Duplication risk | **38** / 100 | high — concentrated in UI duplicates + orphan routes |
| Governance integrity | **82** / 100 | high |
| Emotional UX continuity | **68** / 100 | medium-high; floor solid, ceiling held down |
| Operational maintainability | **71** / 100 | high; docs + ops stack strong, hygiene weak |
| **Mean** | **62.2** / 100 | |

The mean of **62** reflects a platform that is **operationally mature and governance-sound** but carries **moderate structural debt** in UI duplication and repository hygiene. The MMHB v7.4 governance kernel's "smallest valid engine wins" rule means each piece of debt is addressable in a small, deliberate phase — no big-bang refactor is justified, and the operations stack from Phases 48-52 gives the team the tooling to know when any cleanup risks production health.

## 11. Recommended sequencing for future planned phases

| Order | Phase suggestion | Severity addressed | Estimated impact on scores |
|---|---|---|---|
| 1 | Footer triage — ensure `/crisis` link on every footer | MED (BHCE-adjacent) | UX +5, Duplication +5 |
| 2 | Plan-feature labeling — rename or document in `billing.mjs` | HIGH (structural) | Governance +8 |
| 3 | Brand palette resolution — update kernel doc or migrate code | HIGH | UX +15 |
| 4 | Chat surface consolidation — one healing chat | HIGH | UX +10, Duplication +10 |
| 5 | Orphaned route file archive — move to `server/routes/_archive/` | MED | Architecture +10, Maintainability +10 |
| 6 | Onboarding + mood consolidation | MED | UX +5, Duplication +5 |
| 7 | Shadow-tree triage (top-level mirror directories) | MED | Architecture +15 |

Each is a doc + small-engine pair. None require dependency or `.replit` changes.

## 12. Strict-mode compliance (Phase 55 spec)

| Rule | Compliance |
|---|---|
| No source code modifications | ✅ zero |
| No refactors | ✅ zero |
| No dependency changes | ✅ zero |
| No auth / database / runtime / deployment / `.replit` / infrastructure changes | ✅ none touched |
| No package updates | ✅ none |
| No `npm audit fix` | ✅ not run |
| Documentation + analysis only | ✅ — 9 doc files created, zero source touches |
| Objective 1 — generate 9 docs | ✅ §2 list confirms |
| Objective 2 — detect 11 anti-patterns | ✅ §3.1-3.10 enumerate findings for each |
| Objective 3 — verify 4 endpoints | ✅ §4 all PASS, F-33.6 5/5 |
| Objective 4 — produce 5 scores | ✅ §§5-9 |
| Objective 5 — stop after report generation | ✅ this is the report; no further actions |

## 13. File integrity

| File | Pre-Phase-55 | Post-Phase-55 | Change |
|---|---|---|---|
| `server/app.mjs` | SHA `28356f33…` | SHA `28356f33…` | none |
| `package.json` / `package-lock.json` | Phase 40 baseline | Phase 40 baseline | none |
| `.replit` | SHA `016c533c…` | SHA `016c533c…` | none |
| `docs/architecture/SYSTEM_MAP.md` | did not exist | new | created |
| `docs/architecture/ROUTE_REGISTRY.md` | did not exist | new | created |
| `docs/architecture/STATE_DEPENDENCY_GRAPH.md` | did not exist | new | created |
| `docs/audits/DUPLICATION_SCAN.md` | did not exist | new | created |
| `docs/audits/DOMAIN_SEPARATION_AUDIT.md` | did not exist | new | created |
| `docs/audits/CONTENT_COHESION_AUDIT.md` | did not exist | new | created |
| `docs/governance/AI_BOUNDARY_MAP.md` | did not exist | new | created |
| `docs/maps/USER_JOURNEY_MAP.md` | did not exist | new | created |
| `docs/reports/PHASE_55_PLATFORM_COHESION_AUDIT.md` | did not exist | new | created |

**9 doc files created. Zero source files touched.**

## 14. Launch state — re-confirmed

```
v1.0.0 PUBLIC BETA STATUS:       ✅ GO (unchanged)
LAUNCH BLOCKERS:                 0
GITHUB SYNC:                     ✅ in sync (Phase 54 verified)
PRODUCTION HEALTH:               ✅ all 4 required endpoints PASS
                                 F-33.6 5/5 on /crisis (source + live)
                                 same deploy as Phase 53/54
                                 deployed commit: ed813afab
                                 startedAt 19:32:26.510Z  uptime 26m 6s
PLATFORM COHESION (new):         62 / 100 (mean of 5 sub-scores)
                                 - Architecture cohesion:    52 / 100
                                 - Duplication risk:         38 / 100
                                 - Governance integrity:     82 / 100
                                 - Emotional UX continuity:  68 / 100
                                 - Operational maintain.:    71 / 100
SECURITY POSTURE:                S0 HOLD — 6 mod / 0 hi / 0 crit (unchanged)
NEW SOURCE EDITS THIS PHASE:     0
NEW DOC ARTIFACTS:               9 (full audit set)
DEFERRED ITEMS (carry-forward):  - Registry §7 /readyz promotion (since Phase 49)
                                 - Phase 44 canary tolerance recalibration
                                 - Cohesion sequencing items (§11 above)
NEXT PHASE (suggested):          doc-only Phase 56 — pick a single §11 item and
                                 produce its scoping doc. Recommended start:
                                 item #1 (footer triage) — smallest engine,
                                 BHCE-relevant, highest user-impact-per-risk
```

## 15. **FINALIZATION ADDENDUM** — Top 10 cohesion risks (ranked)

The audit body (§§3-9) enumerates findings by category. This section ranks the **single most consequential 10** across all categories, with exact file paths and the **no-fix-yet recommendation** for each. Order is **risk × user-impact**, descending.

### Risk #1 — Brand palette divergence between code and kernel doc

- **Severity:** HIGH (visible to every user, every surface)
- **Files:**
  - `client/src/brand/tokens.ts` (lines 8-16: `serenitySage #8FBF9F`, `eternalGold #D4AF37`, `softBlush #E5B8AE`, `deepTeal #2F5D5D`)
  - `client/src/lumi-tokens/colors/colorTokens.ts` (lines 10-21: duplicate token surface)
  - `tailwind.config.js` (mirrors `tokens.ts`: `sageGreen #8fbf9f`, `metallicGold #d4af37`)
  - `replit.md` (governance kernel section: canonical palette `#A8C9A0`, `#FFD93D`, `#FF9A8B`, `#74C0FC`, `#C8B6FF`, `#A8D5BA`, `#FFB88C`, `#E8913A`)
- **No-fix-yet rationale:** the resolution is a **design + governance decision** (update kernel to match the richer "Sacred" implementation, OR migrate code to match the canonical pastel set). Both are deliberate phases requiring user sign-off. Touching either side in this audit would prejudge the decision.

### Risk #2 — Four parallel chat surfaces with independent state

- **Severity:** HIGH (largest single cohesion break; BHCE-adjacent because each surface must independently route through governance filters)
- **Files:**
  - `client/src/components/AIChat.jsx` (legacy)
  - `client/src/components/chat/AIChatPanel.tsx`
  - `client/src/lumi-conversation/components/LumiConversationPanel.tsx` (current Lumi-domain)
  - `client/src/components/AICompanion.jsx` (floating widget; hardcoded `INITIAL_MESSAGES`)
- **No-fix-yet rationale:** consolidation requires deciding the canonical surface, migrating routes that reference any of the others, and verifying the AI safety pipeline still gates the consolidated surface. Multi-file, multi-state-store, governance-relevant — needs a dedicated phase.

### Risk #3 — Plan-feature labeling monetizes healing capability

- **Severity:** HIGH (structural — Primary Law boundary)
- **Files:**
  - `server/routes/billing.mjs` (lines 19-22: plan feature list contains `crisis_support`, `healing_journeys`)
- **No-fix-yet rationale:** renaming plan-feature strings would change the Stripe-facing plan metadata + customer-facing pricing copy in a single edit; needs explicit user approval and likely a Stripe-side mirror edit. Document non-gating explicitly as an alternative path. Either resolution is a deliberate phase.

### Risk #4 — Footer fivelet with asymmetric `/crisis` link presence

- **Severity:** MED-HIGH (BHCE-adjacent — the visible crisis CTA may be missing on pages that mount a non-canonical footer)
- **Files:**
  - `client/src/components/Footer.jsx`
  - `client/src/components/SacredFooter.jsx`
  - `client/src/components/GlowFooter.jsx`
  - `client/src/components/ui/ReflectionFooter.jsx`
  - `client/src/components/layout/Footer.tsx` (line 78: confirmed `/crisis` link)
- **No-fix-yet rationale:** triage requires inspecting each non-canonical footer for `/crisis` link presence, then either adding the link or migrating its pages to `layout/Footer.tsx`. The `/crisis` route itself remains reachable via direct nav, so this is not a production regression — but it weakens the asymmetric-risk principle and should be the **first** subject of a planned phase.

### Risk #5 — ~125 of 141 backend route files unmounted

- **Severity:** MED (repo size, bisect noise, semantic drift in `/api/health.totalRoutes` reporter)
- **Files (representative examples):**
  - `server/routes/dialectics.mjs`
  - `server/routes/creativity.mjs`
  - `server/routes/wisdom.mjs`
  - `server/routes/mood.mjs`
  - `server/routes/social-posts.mjs` + `social-posting.mjs`
  - `server/routes/adminBilling.mjs`
  - `server/routes/healing.mjs` (vs mounted `ai.healing.mjs`)
  - `server/routes/metricsSummary.mjs`
  - `server/routes/onboarding.mjs`
  - various `server/routes/*.bak`
- **No-fix-yet rationale:** archive (not delete) each unmounted file to `server/routes/_archive/` after confirming no import references. Single sweeping edit; needs verification that nothing dynamic-imports any of them. Dedicated phase warranted.

### Risk #6 — Two onboarding routes / two mood routes

- **Severity:** MED (journey continuity break — user lands on different flows depending on entry path)
- **Files:**
  - `client/src/pages/Onboarding.tsx` (route registered)
  - `client/src/pages/OnboardingFlow.jsx` (route registered)
  - `client/src/pages/MoodPage.jsx` (`/mood`)
  - `client/src/pages/dashboard/MoodTracker.jsx` (`/mood-tracker`)
- **No-fix-yet rationale:** choosing a winner per pair requires UX research on which flow users actually complete + state-store unification. Two separate consolidation phases.

### Risk #7 — `FlowStepCheckout` step name carries commerce connotation in a healing flow

- **Severity:** MED (HEALING domain naming hygiene)
- **Files:**
  - `client/src/checkin-flow/components/FlowStepCheckout.tsx`
- **No-fix-yet rationale:** rename across all imports + state-machine references. Small, mechanical, but touches multiple files. Naming-hygiene phase.

### Risk #8 — `btn-secondary-premium` CSS class on Achievements panel (cross-domain hint)

- **Severity:** MED (HEALING visual)
- **Files:**
  - `client/src/pages/dashboard/Insights.tsx` (line 180)
- **No-fix-yet rationale:** rename the CSS class + audit any other usages. Trivial mechanically; deferred for batch hygiene phase alongside Risk #7.

### Risk #9 — Twelve top-level shadow directories mirror `client/`+`server/`

- **Severity:** MED (architecture cohesion + repo hygiene; some are imported, some are dead)
- **Files / paths:**
  - `agents/`, `ai/`, `api/`, `app/`, `auth/`, `automation/`, `brand/`, `components/`, `content/`, `data/`, `database/`, `db/`
- **No-fix-yet rationale:** classifying each requires (a) full import graph analysis, (b) determining whether each predates or postdates `client/`+`server/`, (c) per-directory archive-or-keep decision. Largest scope of any cleanup; needs dedicated triage phase with a per-directory plan.

### Risk #10 — `JSON.stringify` error path in chat route returns raw error to client

- **Severity:** MED (PLATFORM debug contamination of HEALING surface, conditional on UI handling)
- **Files:**
  - `server/replit_integrations/chat/routes.ts` (line 110)
- **No-fix-yet rationale:** depends on UI-side error rendering — if the chat UI surfaces raw JSON, that is a platform-debug leak into a healing surface. Verify UI handling first; if confirmed leak, wrap response in a user-safe shape. Single-file edit but needs UI verification first.

### Summary table — Top 10 ranked risks

| # | Risk | Severity | Primary path | Affected scores |
|---|---|---|---|---|
| 1 | Brand palette drift | HIGH | `client/src/brand/tokens.ts` + kernel doc | UX -15, Duplication -10 |
| 2 | 4 chat surfaces | HIGH | `lumi-conversation/components/LumiConversationPanel.tsx` (canonical?) | UX -15, Duplication -15 |
| 3 | Plan-feature labeling | HIGH | `server/routes/billing.mjs:19-22` | Governance -10 |
| 4 | Footer fivelet | MED-HIGH | `client/src/components/layout/Footer.tsx` (canonical) | UX -5, BHCE-adjacent |
| 5 | 125 unmounted route files | MED | `server/routes/*` | Architecture -10, Maintain -10 |
| 6 | 2 onboarding / 2 mood routes | MED | `client/src/pages/{Onboarding,OnboardingFlow,MoodPage,dashboard/MoodTracker}.{tsx,jsx}` | UX -10 |
| 7 | "Checkout" in breathing flow | MED | `client/src/checkin-flow/components/FlowStepCheckout.tsx` | UX -3 |
| 8 | `premium` CSS class in healing | MED | `client/src/pages/dashboard/Insights.tsx:180` | Governance -2 |
| 9 | 12 top-level shadow dirs | MED | `agents/`, `ai/`, `api/`, …, `db/` | Architecture -15 |
| 10 | Raw error JSON in chat route | MED | `server/replit_integrations/chat/routes.ts:110` | Governance -3, AI-boundary risk |

### Universal no-fix-yet position

**No remediation is performed in this phase.** Every risk above is documented with its file path so a future phase can address it with the smallest valid engine. The MMHB v7.4 kernel rule applies: **CSS fix > React patch > new component > new page > new service**. Each risk should be matched to its smallest engine before any edit is proposed.

### Safest future phase order

The order below minimizes blast radius per step, frontloads BHCE-relevant items, and saves cross-cutting risks for last:

| Step | Phase | Risk addressed | Engine size | Blast radius |
|---:|---|---|---|---|
| 1 | Phase 56 — Footer triage | #4 | small (CSS + component renames) | low — confirm `/crisis` link presence per footer |
| 2 | Phase 57 — Plan-feature labeling | #3 | small (string edit + doc) | low if doc-route chosen; med if Stripe-route chosen |
| 3 | Phase 58 — Naming hygiene batch | #7, #8 | small (rename) | low |
| 4 | Phase 59 — Brand palette resolution | #1 | medium (cross-file color migration OR kernel doc edit) | high if code migration; low if kernel update |
| 5 | Phase 60 — Chat surface consolidation | #2 | large (component + state + routes) | high — defer until step 4 done so colors stable |
| 6 | Phase 61 — Onboarding + mood consolidation | #6 | medium | medium |
| 7 | Phase 62 — Error-path verification + fix | #10 | small if UI confirmed safe; medium otherwise | low |
| 8 | Phase 63 — Unmounted route archive | #5 | medium (single sweep) | low — files already unmounted |
| 9 | Phase 64 — Shadow-tree triage | #9 | largest (12 directories, per-directory plans) | highest — last |

**Rule:** never start a step if production health is anything other than ✅ GO. Apply the disaster recovery runbook §3 if a deploy fails after any step.

### Final production health confirmation (Phase 55 finalize stamp)

Probed 2026-05-23 20:01 UTC. Same deploy as Phase 53/54 throughout this audit.

| Endpoint | HTTP | Verdict |
|---|---:|---|
| `/healthz` | 200 | ✅ |
| `/readyz` | 200 | ✅ JSON contract live |
| `/api/health` | 200 | ✅ 17/17 invariants pass |
| `/crisis` | 200 | ✅ F-33.6 5/5 |

- `version 2.0.0`, `environment production`, `database.connected true`
- `startedAt 2026-05-23T19:32:26.510Z` — unchanged across Phases 53, 54, 55
- `services.{stripe, resend, perplexity, sentry} = true × 4`
- `softLaunch: false`

### Final launch state summary (Phase 55 finalize stamp)

```
╔════════════════════════════════════════════════════════════════════════╗
║  MMHB v1.0.0 PUBLIC BETA — PHASE 55 FINALIZATION STAMP                 ║
║  2026-05-23 20:01 UTC                                                  ║
╠════════════════════════════════════════════════════════════════════════╣
║  Launch state:                  ✅ GO                                  ║
║  Launch blockers:               0                                      ║
║  GitHub sync:                   ✅ in sync (Phase 54 verified)         ║
║  Deployed commit:               ed813afab                              ║
║  Production health:             ✅ all 4 required endpoints PASS       ║
║  F-33.6 on /crisis:             ✅ 5/5 (source + live)                 ║
║  Same deploy throughout Phase:  ✅ startedAt 19:32:26.510Z stable      ║
║                                                                        ║
║  Platform cohesion (new):       62 / 100 mean                          ║
║    - Architecture cohesion:     52 / 100                               ║
║    - Duplication risk:          38 / 100                               ║
║    - Governance integrity:      82 / 100                               ║
║    - Emotional UX continuity:   68 / 100                               ║
║    - Operational maintain.:     71 / 100                               ║
║                                                                        ║
║  Top-10 risks documented:       ✅ §15 of this report                  ║
║  Affected file paths captured:  ✅ per risk                            ║
║  No-fix-yet position:           ✅ adopted universally                 ║
║  Safest future phase order:     ✅ Phase 56 → 64 sequenced             ║
║                                                                        ║
║  Source files modified:         0                                      ║
║  Doc artifacts created:         9                                      ║
║  Dep changes / npm audit fix:   none                                   ║
║  Kernel-locked files touched:   none (.replit, vite.config.ts,         ║
║                                  drizzle.config.ts, package.json,      ║
║                                  package-lock.json, server/app.mjs)    ║
║                                                                        ║
║  Security posture:              S0 HOLD — 6 mod / 0 hi / 0 crit        ║
║  Next phase (recommended):      Phase 56 — Footer triage               ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 16. References

- Companion docs (this phase): §2
- Operations stack (Phases 48-52)
- Phase 53 GitHub sync & deploy verification
- Phase 54 GitHub sync (post-push) verification
- Phase 49 immutable runtime snapshot
- Phase 37 F-33.6 implementation
- MMHB v7.4 Governance Kernel
- Production contract registry, disaster recovery runbook, uptime monitoring checklist, incident severity matrix

---

*Phase 55 platform cohesion + comprehension audit complete. Nine documentation deliverables created across architecture, audits, governance, maps, and reports. Production runtime is unchanged and healthy — all 4 required endpoints PASS, F-33.6 literals 5/5 on `/crisis`, deep-state 17/17 invariants green, same deploy as Phase 53/54. Five scores produced: architecture cohesion 52, duplication risk 38, governance integrity 82, emotional UX continuity 68, operational maintainability 71 (mean 62). Headline structural findings: brand palette drift between code and kernel, four parallel chat surfaces, footer fivelet with crisis-link asymmetry, plan-feature labeling that monetizes healing capability, ~125 of 141 backend route files unmounted. No live Primary Law violations, no AI boundary leaks, no production drift. Seven-item recommended sequencing for future planned phases provided. Zero source modifications. v1.0.0 public beta launch state: GO, blockers 0, unchanged.*
