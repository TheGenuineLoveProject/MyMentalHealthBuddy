# Completion Lock

**Date**: 2026-02-09
**Purpose**: Guarantee every change ends with verification. No "maybe it works."

---

## Definition of "Complete"

A task is **complete** when all of the following are true:

1. **Build passes** — `npm run build` exits with code 0
2. **Publishing audit passes** — `node scripts/audit-publishing.mjs` outputs `PUBLISHING_AUDIT: PASS`
3. **Health endpoint responds** — `GET /api/health` returns HTTP 200 with `{"status":"healthy"}`
4. **No console errors** — Application starts without uncaught exceptions
5. **No destructive changes** — Nothing was renamed, deleted, or refactored without explicit approval

A task is **not complete** if any of those checks fail, regardless of how much work was done.

---

## Required Checks Before Claiming Done

Run this single command:

```bash
npm run verify
```

This executes `scripts/verify.mjs`, which runs all checks in sequence and prints a final verdict:

- `VERIFIED: PASS` — All checks passed. Work is complete.
- `VERIFIED: FAIL` — One or more checks failed. Reasons are listed above the verdict.

### What `verify.mjs` Checks

| Check | What It Does | Pass Condition |
|---|---|---|
| Publishing Audit | Runs `scripts/audit-publishing.mjs` | Exits with code 0 |
| Health Endpoint | Curls `http://localhost:5000/api/health` | Returns HTTP 200 with `status: "healthy"` |
| Build | Runs `npm run build` | Exits with code 0 |

---

## Pass/Fail Criteria

### PASS
- All three checks return success
- Final output: `VERIFIED: PASS`
- Safe to ship, demo, or hand off

### FAIL
- Any check returns failure
- Final output: `VERIFIED: FAIL` with specific reasons
- Must fix before claiming done

---

## When to Run Verification

- After every set of changes (before going back to user)
- Before any deployment
- After dependency updates
- After content additions (blog posts, newsletter templates)

---

## Available npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run audit:publishing` | `node scripts/audit-publishing.mjs` | Content quality gate only |
| `npm run verify` | `node scripts/verify.mjs` | Full verification (audit + health + build) |

---

## Additive-Only Rule

This system enforces additive evolution:
- New files and content: allowed
- New routes and components: allowed
- Modifications to existing files: allowed (additive changes only)
- Renaming files: not allowed without explicit approval
- Deleting files: not allowed without explicit approval
- Refactoring: not allowed without explicit approval

---

*Last updated: 2026-02-09*
