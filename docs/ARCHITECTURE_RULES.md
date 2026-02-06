# Architecture Rules – The Genuine Love Project

## Canonical Rules
1. Files may only be consolidated if content hashes are identical.
2. Identical files are replaced by re-exports, never deleted.
3. Different components sharing names (Hero, Footer, etc.) are intentional variants.
4. No renaming, refactoring, or logic changes without explicit approval.

## Allowed Changes
- Additive files (new routes, new components)
- Re-exports for identical content only
- Barrel files for import hygiene

## Forbidden Without Review
- Renaming components
- Merging variants
- Changing public APIs
- Moving files across domains

## Ports
- Preferred: 5000
- Fallbacks allowed during dev only