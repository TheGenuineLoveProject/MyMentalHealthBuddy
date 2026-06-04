---
name: Canonical palette & homepage landing
description: Which color source is canonical, the WCAG trap in the canonical gold, and what actually renders at `/`.
---

# Canonical palette is `colors.ts`

`client/src/design-system/tokens/colors.ts` is the LOCKED canonical color source and says so in its header ("Every color comes from this file; components MUST NOT use hex literals"). The user has confirmed this is the one to align to over competing definitions.

Canonical values: primarySage `#7BA483`, deepForest `#163A36`, warmCream `#F6F1E8`, mist `#F8F8F4`, eternalGold `#D4B06A`, fgBody `#2A3F3D`.

**Beware token fragmentation:** `--glp-sage` (and friends) are defined differently across `brand-tokens.css` (`#1ec890`), `sacred.css` / `hxos-vnext.css` / `canva-landing.css` (`#8fbf9f`), `accessibility.css` (`#006400`) — none equal canonical `#7BA483`. Don't trust a cascading CSS var as canonical; check `colors.ts`.

## WCAG trap: canonical gold fails AA as text
eternalGold `#D4B06A` on cream `#F6F1E8` is ~1.7:1 — fails WCAG AA for normal/small text. **Why:** the brand wants a gold accent, but using it for body/eyebrow text violates the locked WCAG-AA rule.
**How to apply:** use `#D4B06A` only for large decorative/non-text accents; for small text on light backgrounds use deepForest `#163A36` (AA-safe) or introduce a darker accessible gold token — never the raw canonical gold.

## What renders at `/`
The homepage route (`App.jsx`) renders `client/src/pages/CanvaLanding.jsx`, a small hardcoded stub — NOT the config-driven `PageTemplate` + `routes.js` landing (which uses tokens, CTAs, avatar). They are duplicate landing systems; the polished one is unused at root. Don't assume `/` = PageTemplate.
