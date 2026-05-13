# Phase 12 — Surface Drift Report (DRY-RUN)

**Date:** 2026-05-13
**Scope:** `client/src/{pages,components,sections,layouts}` only.
**Excluded (already canonical):** `design-system/`, `calm-checkin/`, `checkin-flow/`, `companion-voice/`, `avatar-life/`.
**Status:** Read-only audit. **ZERO files modified.** No surface migration performed.

---

## 1. Headline numbers

| Metric | Count | Notes |
|---|---:|---|
| Pages scanned | 296 | `client/src/pages/**/*.{tsx,jsx}` |
| Components scanned | 394 | `client/src/components/**/*.{tsx,jsx}` |
| Sections scanned | 8 | `client/src/sections/**/*.{tsx,jsx}` |
| **Files w/ raw hex literals** | **143** | 1,427 total hex hits (some are CSS-var fallbacks — see §3) |
| **Files w/ inline `style={{ ... #hex ... }}`** | ~50 | 116 hits in `WireframeTemplates.jsx` alone |
| **Native `<button>` tags** | **234** | across many files |
| **`MMHBButton` adoption** | **0 files** | The canonical Phase 12 button is unused outside its own module |
| **`MMHBCard` adoption** | **0 files** | The canonical Phase 12 card is unused outside its own module |
| **Files w/ legacy `var(--glp-*)` tokens** | **175** | 3,030 references — bridged via `legacyMap.ts` (v5.8.50), so semi-canonical but blocking direct token import |

**Top-line conclusion:** the Phase 12 design system shipped in v5.8.49 has **zero downstream consumers** in live pages. The full UI is still on the v17 `--glp-*` token pipeline + raw hex + native buttons/cards. Surface migration is a real, multi-PR effort.

---

## 2. Surface priority matrix (user-visible pages first)

Sorted by user-visibility × drift weight. "Hex" = raw hex literals in JSX. "Btns" = native `<button>` tags. "Cards" = `className`s with `card`/`Card` or `rounded.*shadow`. "Legacy" = `var(--glp-*)` references.

### Tier A — public marketing & onboarding (highest priority)

| Surface | Hex | Btns | Cards | Legacy | Recommended migration order |
|---|---:|---:|---:|---:|---|
| `pages/CanvaLanding.jsx` | 6 | 8 | 19 | 209 | **1st** — homepage hero. Highest visibility. |
| `pages/Home.jsx` | 32 | 0 | — | 6 | **2nd** — most hex are CSS-var fallbacks (`var(--sacred-teal, #2f5d5d)`); see §3. |
| `pages/HealingLandingPage.jsx` | 32 | 0 | — | 1 | **3rd** — same fallback pattern as Home. |
| `pages/About.jsx` | 2 | 0 | 10 | 25 | **4th** — card unification high-impact. |
| `pages/Pricing.jsx` | 3 | 0 | 11 | 61 | **5th** — already 95-100% V28+V30 compliant per v5.8.36; only token swap remains. |
| `pages/OnboardingFlow.jsx` | 8 | 0 | — | 43 | **6th** — first-touch user surface. |
| `pages/Contact.jsx` | 0 | 2 | — | 34 | **7th** — small surface, low risk. |

### Tier B — wellness tools (visible to active users)

| Surface | Hex | Btns | Cards | Legacy |
|---|---:|---:|---:|---:|
| `pages/WellnessToolsHub.jsx` | 24 | 0 | — | — |
| `pages/BreathingExercisesPage.jsx` | — | — | — | 64 |
| `pages/GroundingTechniquesPage.jsx` | — | — | — | 60 |
| `pages/MeditationGuidePage.jsx` | — | — | — | 48 |
| `pages/InnerChildPage.jsx` | — | — | — | 98 |
| `pages/AffirmationsPage.jsx` | — | — | — | 45 |
| `pages/GratitudePractice.jsx` | — | — | — | 44 |
| `pages/HealingJourneysPage.jsx` | — | — | — | 45 |
| `pages/Dashboard.jsx` | — | — | — | 96 |

### Tier C — admin & dev surfaces (lowest user impact, can defer or skip)

| Surface | Hex | Btns | Notes |
|---|---:|---:|---|
| `pages/admin/CommandCenter.jsx` | 80 | 10 | 65 inline-style hex — internal tool only. |
| `pages/admin/AdminSocial.jsx` | — | 28 | Internal tool only. |
| `pages/WireframeTemplates.jsx` | 140 | 22 | Dev/template surface — **probably skip**. |
| `pages/DesignSystem.jsx` | 26 | 11 | Showcase page — its purpose is to demo styles, so hex literals are intentional examples. **Skip.** |
| `pages/DesignSystemV2.jsx` | — | 21 | Showcase — **skip**. |
| `pages/admin/NarrativeOpsConsole.jsx` | — | 17 | Internal tool. |
| `pages/admin/AdminTools.jsx` | — | 15 | Internal tool. |
| `pages/Admin.jsx` | — | 5 | 219 legacy tokens — internal. |

### Tier D — high-traffic shared components (block migration of multiple pages)

| Component | Hex | Notes |
|---|---:|---|
| `components/HealingHero.jsx` | 20 | Used on landing surfaces — migrating this lifts multiple pages. |
| `components/AboutSection.jsx` | 20 | Used in About + landing. |
| `components/BenefitsSection.jsx` | 20 | Used in landing surfaces. |
| `components/lumi/LumiV7.jsx` | 21 | Already partially canonical per v5.8.37. |
| `components/SacredFooter.jsx` | 13 inline | Used site-wide. |
| `components/sacred/SacredFooter.jsx` | 12 inline | Used site-wide. |
| `components/ui/CRMWidgets.jsx` | 31 | Used in CRM/admin only. |

---

## 3. Important nuance — most "hex" hits in landing pages are CSS-var fallbacks

Sample from `pages/Home.jsx`:

```jsx
<Icon style={{ color: 'var(--sacred-teal, #2f5d5d)' }} />
<div style={{ color: 'var(--sacred-sage, #8fbf9f)' }} />
```

These are **not** raw hex usage — they're `var(--name, #fallback)` patterns where the hex is the fallback for environments without the CSS variable. Migrating these means:

1. Confirm the CSS variable is defined in `index.css` / `brand-tokens.css` (likely is — these are `--sacred-*` tokens).
2. Replace the inline-style `var(...)` with a direct token import from `@/design-system/tokens/colors`.
3. Drop the hex fallback (the design system guarantees the token resolves).

This means `Home.jsx`'s 32 "hex" hits are likely only 5-8 unique colors. Mechanical sweep, not creative work.

By contrast, `pages/admin/CommandCenter.jsx`'s 80 hex hits include 65 inline-style raw colors — those are genuine drift, not fallbacks.

---

## 4. Estimated migration effort

| Tier | Surfaces | Estimated edits per surface | Estimated PR count |
|---|---:|---|---|
| A — public marketing & onboarding | 7 | 50–250 lines/surface (heavy) | 4–6 PRs (CanvaLanding alone ≥1) |
| B — wellness tools | 9 | 30–100 lines/surface | 3–4 PRs |
| C — admin/dev | 8 | mostly skip | 0–1 PR (token-only sweep) |
| D — shared components | 7+ | 20–60 lines/component | 2–3 PRs (highest leverage) |
| **Total** | **~30 priority surfaces** | — | **9–14 PRs**, each architect-reviewed, each preceded by screenshot baseline + screenshot verify |

---

## 5. Recommended sequencing (when migration begins)

1. **Adopt-only PR** — pick ONE small Tier-A page (e.g. `Contact.jsx`, only 2 native buttons + 34 legacy tokens) and migrate it end-to-end as the **reference template**. Architect-review the diff. This anchors the migration pattern.
2. **Shared-component PR** — migrate `HealingHero` + `AboutSection` + `BenefitsSection` (all currently 20 hex each). One PR lifts multiple downstream pages.
3. **Tier-A landing sweep** — `CanvaLanding`, then `Home`, then `HealingLandingPage`, then `About`, each as its own PR with before/after screenshots.
4. **Tier-A wellness tools** — `OnboardingFlow`, `Pricing`, then breathing/grounding/meditation pages (these are heavily token-driven so mostly mechanical).
5. **Tier-D shared infra** — `SacredFooter` variants, `LumiV7` final hex purge.
6. **Token-only sweep PR** for Tier-C admin pages (mass `--glp-*` → `@/design-system/tokens` codemod, no visual change). Skip showcase pages by design.

---

## 6. Hard guardrails (per v7.4 kernel) for any migration PR

- **One surface at a time.** Never batch multiple pages.
- **Screenshot before + after** every PR. Visual regression beats code review for design work.
- **Smallest engine wins.** A token swap (CSS-var → direct import) is preferred over a component swap. Component swap (raw `<button>` → `<MMHBButton>`) is preferred over a structural rewrite.
- **Adapter mode.** Replace token call sites only — preserve JSX structure, classNames, `data-testid` attributes (analytics anchors), and event handlers.
- **No `data-testid` drift.** Every existing testid must survive every migration.
- **No `/crisis` change.** Crisis routing must remain identical post-migration.
- **Reduced-motion preserved** on every surface that animates.
- **Architect-review every PR.** No exceptions during the migration window.

---

## 7. What this audit did NOT do

- Did not modify any source file.
- Did not create or change any production import.
- Did not migrate any surface.
- Did not commit any token swap.
- Did not run a codemod.

The next action — only when you give the go-ahead — would be to start with the Tier-A reference PR (e.g. `Contact.jsx`).

---

## Appendix — raw scan commands

```bash
# Hex literals (excluding canonical modules)
rg -c -g '*.{tsx,jsx,ts,js}' \
  -e '#[0-9a-fA-F]{6}\b' -e '#[0-9a-fA-F]{3}\b' \
  client/src/{pages,components,sections,layouts}

# Native button tags
rg -c -g '*.{tsx,jsx}' '<button[\s>]' \
  client/src/{pages,components,sections,layouts}

# Card patterns
rg -c -g '*.{tsx,jsx}' \
  -e 'className=.*\b(card|Card)\b' \
  -e 'rounded[a-z\-]*\s+[^"]*shadow' \
  client/src/{pages,components,sections,layouts}

# Legacy --glp-* tokens
rg -c -g '*.{tsx,jsx,ts,js}' 'var\(--glp-' \
  client/src/{pages,components,sections,layouts}

# Canonical adoption (currently zero)
rg -l 'MMHBButton' client/src/{pages,components,sections,layouts}
rg -l 'MMHBCard' client/src/{pages,components,sections,layouts}
```
