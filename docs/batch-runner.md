# Batch Runner Guide (P150)

> How to run platform development batches for The Genuine Love Project
> Last Updated: January 26, 2026

---

## Overview

The platform uses a batch-based development system where work is organized into groups of 50 processes. Each batch follows a structured approach: scan → implement → validate → checkpoint.

---

## Batch Structure

| Batch | Process Range | Focus Area |
|-------|---------------|------------|
| Batch 1 | P001-P050 | Core infrastructure |
| Batch 2 | P051-P100 | Features & integrations |
| Batch 3 | P101-P150 | Observability, auth, billing, content |
| Batch 4 | P151-P200 | Admin, QA, performance, security |
| Batch 5+ | P201+ | Advanced features, scaling |

---

## Running a Batch

### Step 1: Pre-Batch Checkpoint
```bash
# Create checkpoint before starting
git add -A && git commit -m "checkpoint: before Batch N"
```

### Step 2: Run Deep Scan
```bash
# Check for duplicates and audit current state
npm run nodupes
npm run doctor
```

Review `docs/batch-N/deep-scan.md` for:
- Which processes are already done
- Which processes need implementation
- Any blockers or dependencies

### Step 3: Implement in Patches
Implement missing items in groups of 5-10 processes:

```bash
# After each patch, validate:
npm run build
npm run typecheck
npm run nodupes
```

Document each patch in `docs/batch-N/patch-XX.md`.

### Step 4: Final Validation
```bash
# Run full verification suite
npm run verify

# Run smoke tests
npm run smoke

# Run accessibility checks
npm run a11y:check
```

### Step 5: Post-Batch Checkpoint
```bash
# Create final checkpoint
git add -A && git commit -m "checkpoint: after Batch N complete"
```

---

## Validation Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile project |
| `npm run typecheck` | TypeScript validation |
| `npm run doctor` | Full diagnostics |
| `npm run nodupes` | Duplicate detection |
| `npm run verify` | Combined validation |
| `npm run smoke` | Critical route tests |
| `npm run a11y:check` | Accessibility audit |
| `npm run test:routes` | Route snapshot test |
| `npm run test:contracts` | API contract tests |

---

## Batch Documentation

Each batch should produce:

1. **Deep Scan** (`docs/batch-N/deep-scan.md`)
   - Current state audit
   - Missing items list
   - Blockers identified

2. **Patch Logs** (`docs/batch-N/patch-XX.md`)
   - Files changed
   - Processes implemented
   - Validation results

3. **Summary** (`docs/batch-N/summary.md`)
   - Total completed
   - Remaining items
   - Next priorities

---

## Anti-Duplicate Rules

Before implementing ANY new feature:

1. Run `npm run nodupes`
2. Check `client/src/content/meta/integrationRegistry.ts`
3. Search codebase for similar implementations
4. If already done, skip and document

---

## Rollback Procedure

If a batch introduces issues:

```bash
# View recent commits
git log --oneline -10

# Rollback to checkpoint
git revert <commit-hash>
```

---

## Batch Status Tracking

Update these files after each batch:

- `client/src/content/meta/integrationRegistry.ts`
- `docs/platform/top-platform-processes-matrix.md`
- `replit.md` (summary section)

---

_This guide should be updated as the batch process evolves._
