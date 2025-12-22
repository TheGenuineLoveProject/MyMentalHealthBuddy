# The Genuine Love Project - Brand Tokens

> Single source of truth: `shared/brand.mjs`

## Quick Reference

### Brand Identity
| Property | Value |
|----------|-------|
| **Full Name** | The Genuine Love Project |
| **Short Name** | Genuine Love |
| **Tagline** | Live in Genuine Love |

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#6D9B8D` | Main brand color, buttons, links |
| Secondary | `#A4C3B2` | Backgrounds, cards, accents |
| Accent | `#EAC3B5` | Warm highlights, callouts |
| Gold | `#EAC33B` | Premium features, achievements |
| Background | `var(--glp-paper)` | Page backgrounds (light) |
| Background Dark | `#1A1A2E` | Page backgrounds (dark mode) |
| Text | `var(--glp-ink)` | Primary text color |
| Text Light | `#FFFFFF` | Text on dark backgrounds |
| Muted | `#6B7280` | Secondary text, placeholders |
| Border | `#E5E7EB` | Dividers, card borders |
| Success | `#10B981` | Success states |
| Warning | `#F59E0B` | Warning states |
| Error | `#EF4444` | Error states |

### Typography

| Property | Value |
|----------|-------|
| **Display Font** | Playfair Display, Georgia, serif |
| **Body Font** | Inter, system-ui, sans-serif |
| **Mono Font** | JetBrains Mono, monospace |

#### Font Sizes
- xs: 12px (0.75rem)
- sm: 14px (0.875rem)
- base: 16px (1rem)
- lg: 18px (1.125rem)
- xl: 20px (1.25rem)
- 2xl: 24px (1.5rem)
- 3xl: 30px (1.875rem)
- 4xl: 36px (2.25rem)
- 5xl: 48px (3rem)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius
- sm: 4px
- md: 8px
- lg: 16px
- xl: 24px
- full: 9999px (pill shape)

---

## Figma Integration

### Option 1: Tokens Studio Plugin
1. Install "Tokens Studio for Figma" plugin
2. Import `public/brand/tokens.json`
3. Apply tokens to your designs

### Option 2: Manual Variables
1. Open Figma file
2. Go to **Local Variables** panel
3. Create collections: `colors`, `typography`, `spacing`
4. Add variables matching the tokens above

### Figma Color Format
Copy these as Figma-compatible colors:
```
Primary: 6D9B8D (109, 155, 141)
Secondary: A4C3B2 (164, 195, 178)
Accent: EAC3B5 (234, 195, 181)
Gold: EAC33B (234, 195, 59)
Background: F6F7F8 (246, 247, 248)
Text: 1C1C1C (28, 28, 28)
```

---

## CSS Usage

Import in your CSS:
```css
@import './styles/brand.css';

.my-element {
  color: var(--brand-primary);
  background: var(--brand-background);
  font-family: var(--font-body);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
}
```

---

## JavaScript/React Usage

```jsx
import { BRAND } from '@shared/brand';

// In component
<h1 style={{ color: BRAND.colors.primary }}>
  {BRAND.name}
</h1>
<p>{BRAND.tagline}</p>
```

---

## Files

| File | Purpose |
|------|---------|
| `shared/brand.mjs` | Source of truth (JS) |
| `public/brand/tokens.json` | JSON export for tools |
| `client/src/styles/brand.css` | CSS variables |
| `public/brand/logo.svg` | Primary logo |
| `public/brand/favicon.svg` | Browser favicon |
| `public/brand/og-image.svg` | Social sharing image |
