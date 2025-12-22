# QuantumBrain Error Scanner (Safe Edition, 8888^)

**Owner:** © Maria Landa / MyMentalHealthBuddy / The Genuine Love Project  
**Script:** `scripts/scan-errors.mjs`  
**Command:** `npm run scan:errors`

## What it does

- Scans the repo (excluding `node_modules`, `.git`, `dist`, `build`, etc.).
- Flags lines containing:
  - `TODO`
  - `FIXME`
  - `console.log(`
  - `any` (TypeScript `any` type)
- Detects **duplicate filenames** across scanned folders.
- **Read-only**: does not modify or delete any files.

## Safety

- Disabled when `NODE_ENV=production`.
- Intended for **dev/staging only**.
- Human-triggered only.

## How to run

```bash
npm run scan:errors