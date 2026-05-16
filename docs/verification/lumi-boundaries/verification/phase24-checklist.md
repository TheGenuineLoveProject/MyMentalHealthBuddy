# Phase 24 — Lumi Boundaries — Verification Checklist

## Module location
- `client/src/lumi-boundaries/` — standalone, opt-in, zero production wiring.

## File inventory (7 spec files + barrel)
- runtime/BoundaryEngine.ts
- runtime/useBoundaryState.ts
- content/boundaryCopy.ts
- components/BoundaryCard.tsx
- components/TransparencyDrawer.tsx
- governance/boundaryEnforcementRules.ts
- verification/phase24-checklist.md
- index.ts (barrel)

## Boundary types
- 4 types: emotional · cognitive · identity · therapeutic.
- Module-load assertion: registry contains exactly 4.
- Each spec has `allowed` (plain-text descriptions) and `notAllowed` (regex patterns).

## Engine
- `checkBoundaries(text)` returns `BoundaryViolation[]` — type, displayName, pattern source, excerpt.
- Pure. No React. No DOM. No persistence.

## Copy
- 4 cards, one per type. Each card: `type`, `name`, `description`, `does[]`, `doesNot[]`.
- Static copy — no runtime rewriting.

## Components
- `BoundaryCard` — single card with expand/collapse via `MMHBButton`.
- `TransparencyDrawer` — slide-out, Escape-closeable, backdrop dismiss, /crisis link in footer.
- Design-system tokens only. No hex literals. No Lumi avatar imports.

## Governance
- `DISPLAY_RULES` — exactly 12 (floor guard throws otherwise).
- `FORBIDDEN_BOUNDARY_PHRASES` — exactly 10 (floor guard throws otherwise).
- `containsForbiddenBoundaryPhrase(text)` normalizes case + curly quotes + whitespace.

## Production posture
- ZERO files outside `client/src/lumi-boundaries/` modified.
- ZERO new npm dependencies.
- ZERO production wiring.
