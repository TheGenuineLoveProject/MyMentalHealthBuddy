# Phase 80 — WebP Adoption Governance

## Objective
Safely migrate selected large image references to WebP variants.

## Rules
- Preserve all original assets
- No route changes
- No runtime changes
- No auth/billing/crisis changes
- No deployment changes
- One-reference-at-a-time migration
- Build verification required after every migration batch

## Priority Targets
1. Logo assets
2. Hero visuals
3. Avatar idle assets
4. Decorative imagery

## Excluded
- SVGs
- critical iconography
- runtime-generated imagery
- screenshots
- archival assets

## Verification
- build passes
- no broken imports
- production health remains green
