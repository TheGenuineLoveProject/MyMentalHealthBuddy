# Platform Safety Architecture v1

**MyMentalHealthBuddy Design System — Visual Governance**

- **Phase:** 12
- **Date:** 2026-05-13
- **Status:** CANONICAL
- **Implementation:** `client/src/design-system/`

---

## 1. Decisions Already Made (Locked)

### 1.1 Color Palette (6 colors — never expand without approval)

| Token         | Hex       | Role                | Usage                          |
| ------------- | --------- | ------------------- | ------------------------------ |
| Primary Sage  | `#7BA483` | Trust, brand, calm  | Buttons, links, accents        |
| Deep Forest   | `#163A36` | Depth, grounding    | Headings, dark sections        |
| Warm Cream    | `#F6F1E8` | Emotional safety    | Hero backgrounds               |
| Eternal Gold  | `#D4B06A` | CTAs, warmth        | Primary buttons, highlights    |
| Soft Blush    | `#E5B8AE` | Care, warmth        | Secondary accents              |
| Mist          | `#F8F8F4` | Breathing room      | Page backgrounds               |

**Rule:** Every color comes from `@/design-system/tokens/colors`. No hex literals in components.

### 1.2 Typography (one serif + one sans-serif — never both serif)

| Role     | Font                | Notes                       |
| -------- | ------------------- | --------------------------- |
| Headings | Cormorant Garamond  | Serif, calm, premium        |
| Body     | DM Sans             | Sans-serif, warm, readable  |

**Forbidden:** Mixing Fraunces + Cormorant Garamond. Using Inter + DM Sans together. Serif for body. Sans-serif for headings.

### 1.3 Spacing (8px base unit)

| Token              | Value              |
| ------------------ | ------------------ |
| Base unit          | 8px                |
| Section padding X  | 48px               |
| Section padding Y  | 96px (breathing)   |
| Section gap        | 64px               |
| Card padding       | 48px               |
| Card gap           | 32px               |

**Rule:** Section padding Y MUST exceed gap. Gaps MUST use the 8px base unit.

---

## 2. Design Tokens (7 token files)

| File                          | Tokens                                                |
| ----------------------------- | ----------------------------------------------------- |
| `tokens/colors.ts`            | 6 palette + 20 semantic + 4 aura                      |
| `tokens/spacing.ts`           | 9 scale values + section/card + 3 responsive sets     |
| `tokens/typography.ts`        | 2 families + 5 heading + 4 body sizes                 |
| `tokens/radius.ts`            | 7 values + 6 component mappings                       |
| `tokens/shadows.ts`           | 9 presets + 7 component mappings                      |
| `tokens/motion.ts`            | 8 durations + 8 easings + 9 presets                   |
| `tokens/index.ts`             | Barrel export                                         |

---

## 3. Component Governance

### 3.1 Button (`MMHBButton`)

```tsx
import { MMHBButton } from "@/design-system";

<MMHBButton variant="primary">Get Started</MMHBButton>
<MMHBButton variant="secondary">Learn More</MMHBButton>
<MMHBButton variant="tertiary">Skip</MMHBButton>
<MMHBButton variant="primary" disabled>Processing</MMHBButton>
```

Rules:
- All buttons: 48px min-height (`md` size)
- Border radius: 8px (`radius.md`)
- Shadow: `xs` → `hover` on hover
- Transition: 200ms standard ease (`motion.duration.fast`)
- Disabled: `blur(2px)` — never grayed out
- Visible 3px sage focus ring

### 3.2 Card (`MMHBCard`)

```tsx
import { MMHBCard } from "@/design-system";

<MMHBCard elevation="resting">Content</MMHBCard>
<MMHBCard elevation="elevated" interactive>Hover content</MMHBCard>
<MMHBCard elevation="floating">Modal content</MMHBCard>
```

Rules:
- Border radius: 16px (`radius.xl`)
- Background: `rgba(255,255,255,0.78)` — never pure white
- Shadow: `sm` → `cardElevated` on hover
- Transition: 500ms gentle ease (`motion.duration.medium`)

### 3.3 Avatar (`MMHBFloatAvatar`)

```tsx
import { MMHBFloatAvatar, MMHBAvatarRuntimeProvider } from "@/avatar-life";

<MMHBAvatarRuntimeProvider surfaceContext="hero">
  <MMHBFloatAvatar
    imageSrc="/brand/MMHB_FLOAT_IDLE_v1_clean_master.webp"
    state="calmIdle"
    size={400}
    interactive
  />
</MMHBAvatarRuntimeProvider>
```

Rules:
- ONLY `MMHB_FLOAT_IDLE_UNIT_v1` renders (8 motion systems, 8 emotional states)
- Hooded avatars, green-bear avatars, generic avatars: REMOVED from platform (per V34 §3.5)

---

## 4. Competing Visual Systems

Two directions identified during pre-Phase-12 audit:

| Direction                     | Status | Evidence                                                           |
| ----------------------------- | ------ | ------------------------------------------------------------------ |
| GOOD (screenshots 1–2)        | Keep   | Calmer palette, better spacing, more cohesive cards                |
| BROKEN (remaining screenshots)| Fix    | Inconsistent colors, missing spacing, floating CTAs                |

**Strategy:** Canonicalize around the good direction.

---

## 5. Accessibility

| Feature                  | Implementation                          |
| ------------------------ | --------------------------------------- |
| `prefers-reduced-motion` | Disables all avatar + transition motion |
| `prefers-contrast`       | Increases border opacity                |
| `prefers-color-scheme`   | Maintains warm cream (no dark mode)     |
| Focus states             | Sage outline, 3px, visible              |
| Reduced motion           | Static avatar + label                   |

---

## 6. Ethical Governance

| Principle              | Rule                                           |
| ---------------------- | ---------------------------------------------- |
| Calm over stimulation  | Max 3 animated elements per viewport           |
| Transparency           | No hidden motion — all visible                 |
| Predictability         | Same state = same motion                       |
| Unobtrusiveness        | Avatar in designated zones only                |
| Autonomy               | User can disable all motion                    |
| No manipulation        | No sadness on departure                        |
| No addiction           | No attention-seeking loops                     |

---

## 7. Zero-Danger Zones

| Zone                          | Rule                                       | Why                              |
| ----------------------------- | ------------------------------------------ | -------------------------------- |
| Near crisis resources         | Avatar must switch to static               | Don't distract from safety       |
| During breathing exercises    | Avatar must pause                          | Don't compete for attention      |
| During clinical content       | Avatar must be absent                      | Respect clinical context         |
| Near safety labels            | Avatar must not overlap                    | Don't obscure safety info        |
| On mobile data saver          | Avatar must not auto-play                  | Respect data usage               |

---

## 8. Implementation Status

### Before Phase 12
- [x] Audit screenshots (good vs broken direction)
- [x] Identify two competing visual systems
- [x] Decide strategy (canonicalize around good direction)

### During Phase 12 (this PR — v5.8.49)
- [x] Create design token system (7 files)
- [x] Lock canonical palette (6 colors)
- [x] Lock typography (1 serif + 1 sans-serif)
- [x] Lock spacing (8px base)
- [x] Lock radius (7 values)
- [x] Lock shadows (9 presets)
- [x] Lock motion (8 durations + 8 easings + 9 presets)
- [x] Build `MMHBButton` (3 variants + disabled blur)
- [x] Build `MMHBCard` (3 elevations + interactive lift)
- [x] Write governance document (this file)
- [x] Top-level barrel `@/design-system`

### After Phase 12 (deferred — separate PRs, gated on stability)
- [ ] Audit all live pages for drift
- [ ] Replace non-canonical colors
- [ ] Unify button system across surfaces
- [ ] Unify card system across surfaces
- [ ] Verify avatar governance enforcement
- [ ] Test accessibility across migrated surfaces

---

**Platform Safety Architecture v1 — Visual Governance for MyMentalHealthBuddy.**

This module is **opt-in**. No existing pages are modified by the v5.8.49 PR. Surface migrations are tracked separately and gated on per-surface stability windows per the v7.4 governance kernel.
