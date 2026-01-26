# Process Engine Rules

> Execution rules for systematic platform development.

## Core Rules

### R1: Sequential Execution
- Complete processes in order within each batch
- Only work on the first batch with any ❌ or 🟡 status
- Later batches remain ❌ LOCKED

### R2: Batch Unlocking
- Next batch unlocks only when current batch is 100% ✅
- No exceptions—complete all 50 before advancing

### R3: Pre-Generation
- When current batch reaches 80% ✅, generate next batch file
- Keeps the queue never empty

### R4: Duplicate Safety
- Run `npm run dup-scan` before starting any process
- Check `docs/registry/feature-map.md` for existing implementations
- If feature exists with keeper files, modify only those files

### R5: Patch Limits
- Maximum 5 files changed per patch/commit
- Maximum 12 files per commit if tests require more

### R6: Verification
- After each process: `npm run verify`
- Fix failures immediately before proceeding
- Update status only after verification passes

### R7: Documentation
- Update batch file status after completion
- Update `progress.md` after each batch change
- Update `feature-map.md` when adding new features

## Execution Loop

```
1. Run duplicate scan
2. Identify active batch (first with ❌/🟡)
3. For each process:
   a. Implement smallest complete slice
   b. Add/adjust tests
   c. Run verify
   d. Fix failures
   e. Mark ✅ when done
   f. Update docs
   g. Commit: "process ###: <Name>"
4. When batch 100% ✅:
   a. Unlock next batch
   b. Continue immediately
```

## Status Transitions

```
❌ → 🟡 (started work)
🟡 → ✅ (verified complete)
🟡 → ❌ (rolled back)
❌ LOCKED → ❌ (unlocked by prior batch)
```

## Commit Messages

Format: `process ###: <Name>`

Examples:
- `process 101: Design System Tokens`
- `process 102: Component Library Audit`

---

_Last updated: January 2026_
