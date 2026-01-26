# Process Engine

> Systematic platform development through 50-process batches.

## Overview

The Process Engine tracks implementation of platform features in organized batches of 50 processes each. This ensures methodical progress with verification at each step.

## Structure

```
docs/process-engine/
├── README.md           # This file
├── progress.md         # Overall progress tracking
├── rules.md            # Execution rules
└── batches/
    ├── process-001-050.md   # Foundation batch
    ├── process-051-100.md   # Growth batch
    ├── process-101-150.md   # Advanced batch (LOCKED)
    └── process-151-200.md   # Enterprise batch (LOCKED)
```

## Process Format

Each process includes:

```markdown
## NNN) Process Name
**Why**: Reason for this process
**Done means**:
- [ ] Checkbox 1
- [ ] Checkbox 2

**Touch points**: Files/routes affected
**Verify**: Commands to validate
**Duplicate-safety**: How to avoid redo work
**Status**: ❌ | 🟡 | ✅ | ❌ LOCKED
```

## Status Values

| Status | Meaning |
|--------|---------|
| ❌ | Not started |
| 🟡 | In progress |
| ✅ | Complete |
| ❌ LOCKED | Blocked until prior batch complete |

## Rules

1. **Sequential Batches**: Complete current batch before starting next
2. **Unlock at 100%**: Next batch unlocks only when current is 100% ✅
3. **Pre-gen at 80%**: Generate next batch file when current hits 80%
4. **Max 5 files/patch**: Limit changes per commit
5. **Verify after each**: Run `npm run verify` after every process

## Commands

```bash
npm run dup-scan      # Scan for duplicates before starting
npm run arch-scan     # Map architecture
npm run verify        # Validate changes
npm run progress      # Update progress tracking
```

## Current Status

- **Batch 001-050**: ✅ Complete
- **Batch 051-100**: ✅ Complete  
- **Batch 101-150**: ❌ LOCKED
- **Batch 151-200**: ❌ LOCKED

---

_Last updated: January 2026_
