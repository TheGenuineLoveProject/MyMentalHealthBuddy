# Integration Batches

## Overview

Platform integrations are organized in batches of exactly 50 items each. Only one batch is active at a time.

## Locking Rule

- Only implement the FIRST batch with any ❌ or 🟡 items
- All later batches remain LOCKED until previous batch is 100% ✅
- When a batch reaches 80%, generate the next batch file (LOCKED)

## Batch Status

| Batch | Range | Status |
|-------|-------|--------|
| [Batch-001](./integration-001-050.md) | 001-050 | ✅ Complete |
| [Batch-002](./integration-051-100.md) | 051-100 | ✅ Complete |
| [Batch-003](./integration-101-150.md) | 101-150 | ✅ Complete |
| [Batch-004](./integration-151-200.md) | 151-200 | 🟡 Ready |
| [Batch-005](./integration-201-250.md) | 201-250 | 🔒 Locked |

## Item Format

```markdown
Integration-###: <Name>
- Why:
- Done means:
  - [ ] ...
- Touch points (files/routes):
- Verify (commands):
- Status: ❌ / 🟡 / ✅
- Notes:
```

## Commands

```bash
npm run integration-score   # Update integration statuses
npm run verify              # Run all checks
npm run report              # Generate status report
```
