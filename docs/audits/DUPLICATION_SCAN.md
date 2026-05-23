# MMHB Duplication Scan

**Baseline:** 2026-05-23 (Phase 55)
**Mode:** descriptive audit — no removals
**Severity scale:** LOW / MED / HIGH (impact on cohesion, not runtime)

---

## 1. Duplicate runtime entrypoints (MED)

| # | Files | Status |
|---|---|---|
| 1 | `server/app.mjs` (canonical) + `server/app.mjs.phase46.bak` | backup file, dormant |
| 2 | `client/src/App.jsx` (canonical) + `src/App.jsx` (slimmed parallel) | shadow tree at top-level — not imported by canonical Vite bundle |
| 3 | `static-export/js/main.js` + `static-export/js/ai-agent.js` | static-export artifacts, may diverge from current logic |

**Impact:** confuses bisect and onboarding. No runtime effect.

## 2. Duplicate components (HIGH)

The **largest cohesion risk** observed in the audit. Multiple parallel implementations of the same UX concept.

### 2.1 Navigation / header

| Component | Path |
|---|---|
| Header | `client/src/components/Header.jsx` |
| TglpNavbar | `client/src/components/TglpNavbar.jsx` |
| SacredNav | `client/src/components/SacredNav.jsx` |
| Layout Header | `client/src/components/layout/Header.jsx` |

**4 nav components.** Different pages mount different nav components.

### 2.2 Footer

| Component | Path |
|---|---|
| Footer | `client/src/components/Footer.jsx` |
| SacredFooter | `client/src/components/SacredFooter.jsx` |
| GlowFooter | `client/src/components/GlowFooter.jsx` |
| ReflectionFooter | `client/src/components/ui/ReflectionFooter.jsx` |
| Layout Footer | `client/src/components/layout/Footer.tsx` (has `/crisis` link at line 78) |

**5 footer components.** Only `layout/Footer.tsx` is confirmed to carry the `/crisis` link.

**Risk:** users who land on a page using a non-`layout/Footer` footer may not see the crisis link. The `/crisis` route still resolves (it's universal), but the **visible CTA** depends on which footer renders. This is the only finding in §2 that has a faint BHCE relevance and should be the **first** item triaged in a future cleanup.

### 2.3 Onboarding

| Component | Path | Routed? |
|---|---|---|
| Onboarding | `client/src/pages/Onboarding.tsx` | yes |
| OnboardingFlow | `client/src/pages/OnboardingFlow.jsx` | yes |

Both registered in `App.jsx`.

### 2.4 Mood tracking

| Component | Path |
|---|---|
| MoodTracker | `client/src/pages/dashboard/MoodTracker.jsx` |
| MoodPage | `client/src/pages/MoodPage.jsx` |

Two routes; users may persist mood into different stores.

### 2.5 Chat interfaces (HIGH — see state graph §5)

| Component | Path |
|---|---|
| AIChat (legacy) | `client/src/components/AIChat.jsx` |
| AIChatPanel | `client/src/components/chat/AIChatPanel.tsx` |
| LumiConversationPanel | `client/src/lumi-conversation/components/LumiConversationPanel.tsx` |
| AICompanion | `client/src/components/AICompanion.jsx` |

**4 chat surfaces.** Each likely has its own state store, message lifecycle, and prompt path. **Highest-priority duplication concern for the kernel's domain-routing invariant** (which expects a single healing-chat surface).

### 2.6 Crisis modals

| Component | Path |
|---|---|
| CrisisPanel | `client/src/lumi-crisis/components/CrisisPanel.tsx` (modern) |
| CrisisResources page | `client/src/pages/CrisisResources.jsx` (legacy/full page) |

The page is the F-33.6 surface and the modal is the embedded resource. These **complement** rather than duplicate — kept here as observation, not a defect.

### 2.7 Buttons / Cards (LOW — UI primitives)

| Pair | Files |
|---|---|
| Button | `client/src/components/ui/Button.jsx` + `button.tsx` + `Button.tsx` |
| Card | `client/src/components/ui/Card.jsx` + `card.tsx` + `Card.tsx` |
| Hero | `client/src/components/BrandHero.tsx` + `ui/Hero.jsx` + `HeroSection.jsx` |

Three implementations each. Mixed-case + extension variants indicate shadcn/ui (lowercase) coexisting with hand-rolled (PascalCase). Standard React-codebase pattern; LOW severity unless they diverge in props or styling.

## 3. Duplicate API handlers (MED)

| Pair | Concern |
|---|---|
| `server/routes/billing.mjs` + `server/routes/adminBilling.mjs` | overlapping billing surfaces; need clear scoping (user-facing vs admin-only) |
| `server/routes/social-posts.mjs` + `server/routes/social-posting.mjs` | naming near-collision; risk one is dead |
| `server/routes/healing.mjs` + `server/routes/ai.healing.mjs` | general tool vs AI-specific — observed by audit, mounting status differs (only `ai.healing.mjs` is mounted) |
| `server/routes/metrics.mjs` + `server/routes/metricsSummary.mjs` | observational; one may be dead given `/metrics` is served inline |

Only **`ai.healing.mjs`** is confirmed mounted (per the canonical mount table). The others may be orphans (see route registry §3).

## 4. Dead / orphaned code (HIGH)

### 4.1 Files

| File | Type |
|---|---|
| `client/src/smoke.test.js` | test artifact |
| `client/src/index.css.backup.1777434482` | timestamp-suffixed backup |
| `server/routes/*.bak` (various) | route-file backups |
| `server/app.mjs.phase46.bak` | server backup |
| `client/src/_quarantine/**` | self-declared dead directory |

### 4.2 Orphaned pages (not in App.jsx route table)

- `client/src/pages/ContentIndexPage.jsx`
- `client/src/pages/ControlDashboard.jsx`
- `client/src/pages/DesignSystem.jsx` (superseded by `DesignSystemV2.jsx`)
- `client/src/pages/WellnessHubPage.jsx`

### 4.3 Orphaned route files

**~125 of 141 files** in `server/routes/` are not mounted in `server/app.mjs`. See route registry §3 for the full discussion. Major contributor to repo size and bisect noise.

## 5. Dead documentation (LOW)

- `docs/API_REFERENCE_v5.1.md` may reference endpoints that have moved into modular files; observation only.
- `docs/changelog.md:46-47` references constants (`CHECKIN_IS_HEALING_FLOW`) and a stray orphan (`client/src/components/AIChatPanel.tsx`) noted as pending follow-ups.
- All other docs verified current (most timestamped April-May 2026).

## 6. Overlapping systems (HIGH)

### 6.1 State management — 3 systems

- Zustand (feature-local stores)
- React Context (cross-cutting providers)
- TanStack Query (server state)

See `docs/architecture/STATE_DEPENDENCY_GRAPH.md` — each system owns distinct concerns; coexistence is **deliberate** but the brand-palette double-source and the chat triplet (§2.5) are the **leaky** overlaps.

### 6.2 Styling — 3 systems

- Tailwind CSS (primary, `tailwind.config.js`)
- CSS Modules (`AdvisorySection.module.css`, `AutopilotFallback.module.css`)
- Raw CSS (`brand/colors.css`, `client/src/styles/canva-landing.css`)

### 6.3 Routing — 1 active, 1 vestigial

- wouter (canonical in `client/src/App.jsx`)
- react-router (declared in `package.json` per audit; no active imports observed)

Suggests an incomplete migration. Confirm in a planned phase before removing the dep.

## 7. Route drift (MED)

| Pair | Concern |
|---|---|
| `/breathing` → `BreathingTool.jsx` vs `/breath` → `BreathTool.jsx` | two breath tools |
| `/pricing` → `PricingReal` vs `/pricing-page` → `PricingPage` | two pricing pages |
| `LearnGuideDetail` + `LearnArticleDetail` (both `LearnDetail.jsx`) | one component, two aliases |

## 8. Shadow trees at the project root (MED — informational)

Top-level directories that **mirror** `client/` and `server/` structure:

`agents/`, `ai/`, `api/`, `app/`, `auth/`, `automation/`, `brand/`, `components/`, `content/`, `data/`, `database/`, `db/`

Many of these contain `.ts`/`.mjs`/`.jsx` files. Some are imported by canonical code (the kernel cites `ai/healing/prompts/h08_safety_check.md` and `ai/core/redact.ts` as live); others appear to be legacy.

**Cannot classify exhaustively in this audit.** A dedicated shadow-tree triage phase would be required: for each top-level directory, determine (a) whether any canonical file imports from it, (b) whether it predates or postdates `client/`+`server/`, (c) whether it can be safely archived or removed.

## 9. Summary by severity

| Severity | Count of distinct findings |
|---|---:|
| HIGH | 4 (chat triplet, footer fivelet, orphaned route files, state-system overlap) |
| MED | 6 (entrypoint backups, API handler overlaps, route drift, shadow trees, styling, brand-palette dual source) |
| LOW | 3 (button/card variants, dead test files, doc drift) |

**Total findings: 13.** All are doc-only; zero source modifications in this audit.

## 10. Recommended sequencing (informational only)

If a future cleanup phase is planned, the following sequence minimizes risk:

1. **Footer triage** (§2.2) — `/crisis` CTA presence; faintest BHCE relevance
2. **Chat surface consolidation** (§2.5) — three competing healing surfaces; clearest cohesion win
3. **Orphaned route files** (§4.3) — repo size / bisect win; verify each unmounted, then archive
4. **Onboarding consolidation** (§2.3) — one onboarding flow
5. **Mood page consolidation** (§2.4) — single mood surface
6. **Shadow-tree triage** (§8) — largest scope, needs dedicated phase
7. **State management** — last; touching cross-cutting providers is highest-risk

Apply the kernel's smallest-valid-engine rule per step.

---

*This duplication scan is the descriptive inventory as of 2026-05-23. No file is deleted, renamed, or refactored in this audit. The recommended sequencing in §10 is informational; any cleanup must be a separately planned phase with user approval per item.*
