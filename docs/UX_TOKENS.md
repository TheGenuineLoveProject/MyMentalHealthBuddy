# UX Tokens (Single Source of Truth)

## Status: UX PASS ✅

**Last Verified**: January 2026  
**Token Source**: `client/src/styles/brand-tokens.css`  
**Tailwind Config**: `tailwind.config.js`

## Rules
- No raw hex colors inside components. Use CSS variables.
- All interactive elements must have visible focus (`:focus-visible`).
- Reduce motion automatically for users who request it.
- Use consistent spacing + radius for a calm, premium feel.

## Core Variables
- Background: `--bg`
- Surfaces: `--surface`, `--surface-2`
- Text: `--text`, `--muted`
- Border: `--border`
- Brand: `--brand-50..900`
- Focus ring: `--focus`
