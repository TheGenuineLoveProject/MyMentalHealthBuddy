# Duplicate Prevention Enforcement

**Generated:** 2026-02-06
**Phase:** 10 — Duplicate Prevention Enforcement

---

## Tool: `scripts/prevent-duplicates.mjs`

### Usage

```bash
node scripts/prevent-duplicates.mjs           # Non-blocking (warnings only)
node scripts/prevent-duplicates.mjs --strict   # Blocking (exit 1 on errors)
```

### Checks Performed

| Check | What It Detects | Severity |
|-------|----------------|----------|
| Duplicate File Names | Same-named files in same scan directory | WARN |
| Duplicate Content Hash | Files with identical content (SHA-256) | WARN |
| Duplicate Route Registration | Same route mounted multiple times in entry file | ERROR |
| Duplicate Named Exports | Same export name defined in 3+ files | WARN |

### Scan Directories

- `server/routes/`
- `server/middleware/`
- `server/services/`
- `server/utils/`
- `client/src/pages/`
- `client/src/components/`
- `client/src/hooks/`

### Exit Codes

| Mode | Errors Found | Exit Code |
|------|-------------|-----------|
| Warning (default) | Any | 0 |
| Strict (`--strict`) | Errors > 0 | 1 |
| Either | None | 0 |

---

## CI Integration

### GitHub Actions (Recommended Addition to CI)

Add to `.github/workflows/ci.yml`:
```yaml
  duplicate-check:
    name: duplicate-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/prevent-duplicates.mjs
```

Start with non-blocking mode (detection only). When existing pre-existing duplicates are resolved, switch to `--strict` for true enforcement.

**Important:** In default (non-blocking) mode, the script acts as a **detection tool**, not an enforcement gate. It will report issues but always exit 0. True prevention enforcement requires `--strict` mode, which should only be enabled after resolving pre-existing duplicates.

### Pre-Commit Hook (Optional)

Add to `.husky/pre-commit` (if Husky is installed):
```bash
node scripts/prevent-duplicates.mjs --strict
```

---

## Current Duplicate Inventory (Baseline)

### Route Registration Errors (3)
These routes are registered multiple times in a single entry file. While currently non-breaking (last registration wins), they should be cleaned up:

### Component Duplicates (24 warnings)
Known duplicate component names across different directories. These existed before this enforcement was added. See `docs/DUPLICATE_REPORT.md` for the full inventory.

### Resolution Priority

| Priority | Category | Action |
|----------|----------|--------|
| HIGH | Route registration errors | Deduplicate in server/index.mjs |
| MEDIUM | Identical content files | Remove copies, keep canonical version |
| LOW | Same-named components | Consolidate when touching that area |

---

## Phase 10 Status: COMPLETE
Script created and tested. CI integration documented (not auto-applied).
