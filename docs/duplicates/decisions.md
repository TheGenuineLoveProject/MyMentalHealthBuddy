# Duplicate Decisions

> Generated from scan: 2026-01-26T07:09:52.011Z

## Format

```
## Group: <identifier>
- **Keep**: <path>
- **Duplicates**: <paths>
- **Action**: KEEP | REDIRECT | QUARANTINE
- **Import redirects**: <list>
- **Notes**: <reason>
```

---

## Proposed Decisions

### Group 1: Exact Duplicate
- **Keep**: `client/src/components/BrandHero.tsx`
- **Duplicates**: `client/src/components/BrandLogo.tsx`
- **Action**: QUARANTINE
- **Import redirects**: Update imports from duplicates to keeper
- **Risk**: 5

### Group 2: Exact Duplicate
- **Keep**: `client/src/components/StateTracker.tsx`
- **Duplicates**: `client/src/components/state/StateTracker.tsx`
- **Action**: QUARANTINE
- **Import redirects**: Update imports from duplicates to keeper
- **Risk**: 5

### Group 3: Exact Duplicate
- **Keep**: `client/src/layouts/brand.ts`
- **Duplicates**: `server/intelligence/journalingMirror.mjs`, `scripts/scan-errors.mjs`, `scripts/node scripts/run-suite.mjs`
- **Action**: QUARANTINE
- **Import redirects**: Update imports from duplicates to keeper
- **Risk**: 5

### Group 4: Exact Duplicate
- **Keep**: `server/sessionStore.mjs`
- **Duplicates**: `server/middleware/session.mjs`
- **Action**: QUARANTINE
- **Import redirects**: Update imports from duplicates to keeper
- **Risk**: 5

---

_Run "npm run dedupe-safe" to apply quarantine actions._

_Last updated: 2026-01-26T07:09:53.192Z_