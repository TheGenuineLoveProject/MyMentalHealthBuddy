# Duplicate Avoidance System

## Purpose

Prevent duplicate work and maintain single sources of truth across the codebase.

## Files

| File | Purpose |
|------|---------|
| `scan-latest.md` | Most recent duplicate scan report |
| `scan-latest.json` | Machine-readable scan results |
| `decisions.md` | Final decisions on which files to keep |
| `locks.md` | Files that must never be duplicated |

## Commands

```bash
npm run dup-scan      # Run deep duplicate scan
npm run dedupe-plan   # Generate deduplication plan
npm run dedupe-safe   # Apply safe deduplication (quarantine only)
```

## Rules

1. **Single Source of Truth**: Each feature/component has exactly one canonical location
2. **No Shadow Copies**: Backup/old/copy folders are automatically quarantined
3. **Import Redirects**: When duplicates exist, imports point to the keeper
4. **Safe Mode**: Never delete files - only quarantine

## Risk Scoring

| Condition | Score |
|-----------|-------|
| In src/client/server | +5 |
| Referenced by imports | +5 |
| Named index/App/routes/schema | +4 |
| In auth/stripe/openai/db | +3 |
| In backup/copy folders | +2 |
| In dist/build/node_modules | -3 |
