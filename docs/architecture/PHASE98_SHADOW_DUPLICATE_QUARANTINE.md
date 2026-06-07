# Phase 98 Shadow Duplicate Quarantine

## Result
One verified active-runtime shadow duplicate family was quarantined.

## Family
ProtectedRoute

## Canonical Owner Files
- client/src/components/ProtectedRoute.jsx
- client/src/guards/ProtectedRoute.jsx

## Quarantined Shadow Files
- src/auth/ProtectedRoute.jsx → _quarantine/phase98-shadow-duplicates/src/auth/ProtectedRoute.jsx
- src/components/ProtectedRoute.jsx → _quarantine/phase98-shadow-duplicates/src/components/ProtectedRoute.jsx
- src/pages/ProtectedRoute.jsx → _quarantine/phase98-shadow-duplicates/src/pages/ProtectedRoute.jsx

## Safety Rules Enforced
- Backup/cache/npm-global duplicate noise ignored.
- Only active-runtime roots inspected.
- Only one duplicate family changed.
- Only root shadow files moved.
- Canonical owner files preserved.
- Zero active-runtime references required before quarantine.
- SHA-256 verified before and after move.
- Build must pass after quarantine.

## Rollback
Move the quarantined file(s) back from `_quarantine/phase98-shadow-duplicates/` to the original path(s), or run:

```bash
git restore --source=HEAD~1 -- .
```
