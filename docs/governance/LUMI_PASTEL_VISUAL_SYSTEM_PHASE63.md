# Phase 63 — Lumi Pastel Visual System

## Problem
The current sage palette is visually too opaque in some UI areas. Some button labels become hard to read because the surface, button color, and text color do not have enough contrast. Lumi assets exist, but the product experience still feels too flat, static, and visually under-developed.

## Decision
Add a governed Lumi-derived pastel visual layer using:
- softer sage tones
- cream base surfaces
- rose, gold, sky, mint, and lavender accent pastels
- stronger readable text colors
- button contrast overrides
- Lumi glow, float, pulse, and ambient sparkle motion
- reduced-motion support

## Palette
- Lumi Cream: #FFFDF8, #FFF9F1, #F9F1E7
- Soft Sage: #F4F8F0, #EDF4E8, #DFEADB, #CDDDC5, #B4CAA8, #91AD86, #6F936D
- Deep Readable Text: #102F2B, #1F4039
- Rose: #FFF1F2, #FFE0E4, #FFC6CF
- Gold: #FFF8DB, #FFEAA3, #FFD66E
- Sky: #EDFAFF, #CDEFFF, #9DE0FF
- Lavender: #F6F1FF, #E8DDFF

## Accessibility Rules
- Buttons must never rely on low-contrast black text over muddy sage.
- Primary CTAs use deep sage background with cream text.
- Soft CTAs use pale surface with deep evergreen text.
- Focus rings must remain visible.
- Motion must respect prefers-reduced-motion.

## Implementation
The visual layer is implemented in:
client/src/styles/lumi-pastel-visual-system.css

It is imported from the active CSS entry detected during execution.

## Verification
Required gates:
- Build passes.
- Critical routes pass.
- Visual CSS import exists exactly once.
- Button contrast selectors exist.
- Lumi animation selectors exist.
