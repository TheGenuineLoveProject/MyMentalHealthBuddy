# Phase 12 Drift Audit — Platform Safety Architecture v1

**Date:** 2026-05-13
**Scope:** Read-only audit of `client/src/` against the v5.8.49 design-system
contract. **No code modified.** This report exists to scope the deferred
checklist items from `PLATFORMSAFETYARCHITECTURE.md` §8:

- [ ] Audit all live pages for drift  ← **this document**
- [ ] Replace non-canonical colors
- [ ] Unify button system
- [ ] Unify card system
- [ ] Verify avatar governance
- [ ] Test accessibility

---

## 1. Executive summary

| Surface contract | Adoption | Violations |
|---|---|---|
| `MMHBButton` | **0 production files** | ~1,505 raw `<button>` elements + 56 shadcn Button imports |
| `MMHBCard` | **0 production files** | ~37 shadcn Card imports + 15 files with pure-white card backgrounds |
| Canonical 6-color palette | Partial (tokens shipped) | **124 unique non-canonical hex literals** in CSS/JSX |
| Cormorant + DM Sans only | Partial | **15 files** declare non-canonical font families |
| `MMHBFloatAvatar` (`@/avatar-life`) | **0 production files** | 6 files reference legacy avatar assets (`avatar-breathing`, `BuddyAvatar`, `LumiV6`, etc.) |

**Bottom line:** The Phase 12 infrastructure is in place but **zero production
surfaces consume it.** A full sweep would touch ~95 v5.8.21+ surfaces — which
violates the standing user rule against re-touching shipped polish. This audit
recommends **a phased, opt-in migration** rather than a global sweep (see §6).

---

## 2. Color palette drift

### Heaviest offenders (hex literals per file)

| File | Hex literals | Notes |
|---|---:|---|
| `client/src/index.css` | 207 | Global tokens — many are intentional (cream/sage/etc.) but most predate the locked 6-color palette |
| `client/src/pages/WireframeTemplates.jsx` | 159 | Internal tooling page |
| `client/src/components/PageTemplate.module.css` | 142 | Template — high blast radius |
| `client/src/styles/brand-tokens.css` | 119 | Legacy brand token sheet — overlaps Phase 12 tokens |
| `client/src/pages/admin/CommandCenter.jsx` | 72 | Admin |
| `client/src/styles/emotion-effects.css` | 55 | Avatar/emotion glow |
| `client/src/brand/tokens.ts` | 49 | Legacy TS tokens — overlaps Phase 12 tokens |
| `client/src/components/ContentStudio.module.css` | 44 | Admin |
| `client/src/components/ui/CRMWidgets.jsx` | 41 | Admin |
| `client/src/pages/DesignSystem.jsx` | 35 | Internal showcase |
| `client/src/pages/CourseCatalog.jsx` | 35 | Public |
| `client/src/components/FlowDiagram.jsx` | 35 | Admin |
| `client/src/pages/Home.jsx` | 34 | Public |
| `client/src/pages/HealingLandingPage.jsx` | 33 | Public |
| `client/src/components/wellness/WeatherMoodSync.jsx` | 32 | Tool |

**Total unique non-canonical hex literals across the repo: 124.**

### Recommended response

1. `index.css`, `brand-tokens.css`, `tokens.ts` already contain the v5.8.x
   canonical 8-hex palette and have been the source of truth since v4.x. They
   should be **reconciled with** Phase 12 tokens (not replaced) so the global
   variables continue to work AND the new `@/design-system/tokens/colors`
   imports stay valid. Suggested approach: extend `colors.ts` with a
   `legacyMap` that points each historic v17 token to the closest Phase 12
   semantic, then mark old tokens `@deprecated` in JSDoc — zero runtime change.
2. **Do not** rewrite `index.css` or `brand-tokens.css` — both ship every
   wellness surface and any change risks cascade regressions.

---

## 3. Button drift

### Raw `<button>` element usage (top 25)

| File | `<button>` count | Tier |
|---|---:|---|
| `pages/admin/AdminTools.jsx` | 43 | Admin |
| `pages/WireframeTemplates.jsx` | 28 | Internal |
| `pages/admin/AdminSocial.jsx` | 28 | Admin |
| `pages/admin/NarrativeOpsConsole.jsx` | 26 | Admin |
| `pages/DesignSystemV2.jsx` | 21 | Internal |
| `pages/ControlDashboard.jsx` | 20 | Admin |
| `pages/CanvaLanding.jsx` | 18 | **Public** ⚠ |
| `pages/admin/CommandCenter.jsx` | 15 | Admin |
| `pages/admin/AdminPublishing.jsx` | 15 | Admin |
| `components/autodidact/AutodidactForge.tsx` | 13 | Feature |
| `pages/DesignSystem.jsx` | 12 | Internal |
| `pages/admin/SocialDashboard.jsx` | 12 | Admin |
| `pages/ContentAdminDashboard.jsx` | 11 | Admin |
| (… 80+ more files …) | | |

- **Total raw `<button>` elements:** 1,505
- **Files importing shadcn `Button`:** 56
- **Files using `MMHBButton`:** 0 (only the design-system module itself)

### Recommended response

- **Public surfaces (Tier-1):** `CanvaLanding`, `Pricing`, `About`, `Login`,
  `Register`, `OnboardingFlow`, `Welcome`, `CheckIn`, `Crisis`. Migrating
  these to `MMHBButton` would re-touch v5.8.22→v5.8.32 polish — **REQUIRES
  EXPLICIT GREENLIGHT** per user rule.
- **Admin surfaces (Tier-2):** Lower-risk migration target. No public users
  hit them; could be migrated as a single PR with low blast radius.
- **Internal/wireframe surfaces (Tier-3):** Already non-canonical by design
  (mockups). Safe to leave unmigrated.

---

## 4. Card drift

### Card-like patterns (top 25)

| File | Card-pattern count | Tier |
|---|---:|---|
| `pages/admin/AdminTools.jsx` | 116 | Admin |
| `pages/DesignSystem.jsx` | 80 | Internal |
| `pages/Admin.jsx` | 56 | Admin |
| `pages/admin/AdminSocial.jsx` | 51 | Admin |
| `pages/admin/CommandCenter.jsx` | 50 | Admin |
| `pages/admin/NarrativeOpsConsole.jsx` | 48 | Admin |
| `pages/ControlDashboard.jsx` | 41 | Admin |
| `pages/CanvaLanding.jsx` | 34 | **Public** ⚠ |
| `pages/Dashboard.jsx` | 32 | Auth |
| `pages/JournalPage.jsx` | 21 | Tool |
| (… 60+ more files …) | | |

- **Files importing shadcn `Card`:** 37
- **Files using `MMHBCard`:** 0

### Pure-white BG violations (Phase 12 forbids; spec requires `rgba(255,255,255,0.78)`)

| File | Violations |
|---|---:|
| `pages/admin/NarrativeOpsConsole.jsx` | 39 |
| `pages/admin/AdminSocial.jsx` | 35 |
| `pages/admin/SocialGenerator.jsx` | 18 |
| `components/mindscape/MindscapeNavigator.tsx` | 16 |
| `components/mastery/SkillForge.tsx` | 16 |
| `pages/KnowledgeSynthesisPage.tsx` | 14 |
| `styles/canva-landing.css` | 12 |
| `pages/admin/AdminPublishing.jsx` | 12 |
| `components/mastery/DeepWorkTracker.tsx` | 12 |
| `components/creative/CreativeProblemSolver.jsx` | 12 |
| (5 more files with 9–11 each) | |

### Recommended response

Same Tier-1/2/3 split as buttons. Pure-white violations are the lowest-risk
fix (single `bg-white` → `bg-[rgba(255,255,255,0.78)]` swap) but still need
greenlight on Tier-1 surfaces.

---

## 5. Typography drift

### Files declaring non-canonical font families

15 files declare `font-family` with `Inter`, `Fraunces`, `Roboto`, `Helvetica`,
`Arial`, `Playfair`, `Montserrat`, or `Poppins`. Heaviest:

| File | Declarations |
|---|---:|
| `components/PageTemplate.module.css` | 56 |
| `index.css` | 36 |
| `components/ContentStudio.module.css` | 21 |
| `styles/canva-landing.css` | 17 |
| `components/ContentLevelToggle.module.css` | 13 |
| `styles/tokens.css` | 11 |
| `styles/sacred-typography.css` | 10 |

Adoption of canonical pair:

- Files using **Cormorant Garamond:** 13
- Files using **DM Sans:** 1

### Recommended response

`index.css` + `styles/tokens.css` define the global font stack; once those are
reconciled with Phase 12, most `*.module.css` declarations become redundant
inheritance and can be removed in a follow-up cleanup PR. **No urgent action.**

---

## 6. Avatar governance

### Files referencing legacy avatar assets

| File | Concern |
|---|---|
| `data/nlpMiContent.js` | References `avatar-breathing` slot (already canonical sprout post-v5.8.40) |
| `data/lumiAssets.js` | Asset registry — references `-nobg` siblings |
| `sections/VisualBenefits.jsx` | Uses `avatar-breathing-nobg.png` chat avatar — canonical post-v5.8.40 |
| `pages/OnboardingFlow.jsx` | Uses `BuddyAvatar` not `MMHBFloatAvatar` |
| `components/lumi/LumiV6.tsx` | LumiV6 SVG mascot — current production chat avatar |
| `components/avatar/BuddyAvatar.tsx` | Legacy wrapper — still production-active |

- **Files using `MMHBFloatAvatar` / `@/avatar-life`:** 0 (only the avatar-life
  module itself + Phase 12 governance doc).
- **Files using `LumiV6` / `BuddyAvatar`:** 6+

### Recommended response

The Phase 12 governance doc says `MMHB_FLOAT_IDLE_UNIT_v1` is the only
sanctioned avatar. In practice:

- The hero already uses `FloatIdleAnimated` (v5.8.46 canonical sprout). ✅
- The chat/buddy/onboarding surfaces still use `LumiV6` + `BuddyAvatar`.
- v5.8.48 shipped `MMHBFloatAvatar` as the productionized migration target,
  but **chose explicitly to defer hero/chat/buddy migration through the 24h
  watch.**

**Status:** the architectural plan is correct and on schedule; the surface
migrations are intentionally pending stability windows. **No drift to fix
right now** — only follow-through PRs to schedule.

Three V34 §3.5 deferred slots from v5.8.40 (`avatar-heart`,
`benefit-relief`, `benefit-understanding`) still hold pre-canonical assets
pending user-supplied source images.

---

## 7. Accessibility

Not measured in this audit — requires runtime axe/Lighthouse runs against each
migrated surface. Should be performed AFTER each Tier-1 migration PR, not
upfront. Phase 12 components (`MMHBButton`/`MMHBCard`) already encode the
required contract:

- 48px touch target across all variants ✅
- 3px sage focus ring ✅
- `prefers-reduced-motion` runtime enforcement ✅
- `data-mmhb-reduced-motion` attribute exposed for QA ✅

---

## 8. Recommended migration plan

### Wave 1 — zero-risk infrastructure (READY NOW, no surface edits)

1. **Reconcile `tokens.ts` / `brand-tokens.css` with Phase 12 `colors.ts`** —
   add `legacyMap` + JSDoc `@deprecated` on superseded tokens. No runtime
   change. Allows new code to import either path during migration.
2. **Add ESLint rule** `no-restricted-syntax` to flag new hex literals in
   `client/src/components/**` and `client/src/pages/**` (warn-only, not
   error). Surfaces drift in PR review without breaking the build.

### Wave 2 — Tier-2 admin sweep (LOW RISK, no public users)

3. **Migrate one admin page** as the migration template (suggest:
   `pages/admin/AdminPublishing.jsx` — 15 buttons, 26 card-patterns, 12
   pure-white violations — manageable scope).
4. After 7-day soak with no regressions, fan out to remaining ~12 admin pages
   in batches of 3.

### Wave 3 — Tier-1 public sweep (HIGH RISK, requires greenlight per page)

5. **Single-surface PRs only**, smallest first: `Login` → `Register` →
   `Forgot` → `Pricing` → `About` → `CanvaLanding` (most complex last).
6. Each PR: `tsc` clean, `vite build` clean, screenshot-verified, architect
   review, 24h watch before next surface.

### Wave 4 — chat/buddy/onboarding avatar migration (TIED TO v5.8.48 watch)

7. After v5.8.48 24h watch closes: migrate `LumiV6` → `MMHBFloatAvatar` on
   chat surface only. 7-day soak. Then buddy. Then hero (replacing v5.8.46
   `FloatIdleAnimated`).

### Out of scope this audit

- Pure-CSS module files (`*.module.css`) — sweep separately after Tier-1
  TSX/JSX migration completes.
- `pages/WireframeTemplates.jsx` and `pages/DesignSystem*.jsx` — internal
  showcase surfaces, intentionally non-canonical.
- V34 §3.5 deferred avatar slots — blocked on user-supplied source images.

---

## 9. Recommended next user decision

Pick ONE of the following to greenlight Wave 1 / 2:

- **(a)** Wave 1 only — token reconciliation + ESLint warn rule. Zero
  surface edits, ~30 min of work, sets up clean migration path.
- **(b)** Wave 1 + Wave 2 step 3 — also migrate
  `pages/admin/AdminPublishing.jsx` as the proof template. ~2 hr of work,
  one admin page touched.
- **(c)** Hold — keep Phase 12 infrastructure standing, no further work
  until product-side decision on which public surface to migrate first.

Audit report ends here. No code modified.
