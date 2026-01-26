# Batch 14 Deep Scan v6 Report

**Generated:** 2026-01-26
**Status:** SCAN COMPLETE
**Scope:** Full platform duplicate detection + proof-of-work validation

---

## Summary

| Metric | Result |
|--------|--------|
| Total Files Scanned | 300+ |
| Duplicate RouteKeys | 0 |
| Duplicate Endpoints | 0 |
| Build Status | PASS |
| TypeCheck Status | PASS |
| Platform Processes Complete | 72 (pre-Batch 14) |

---

## A) Registry + Canonical Ownership

### Canonical Owners

| Domain | Canonical File | Status |
|--------|----------------|--------|
| Routes | client/src/content/meta/routeMetaRegistry.ts | ✅ Active |
| Pages | client/src/pages/* | ✅ Active |
| APIs | server/routes/*.mjs | ✅ Active |
| DB Schema | shared/schema.ts | ✅ Active |
| Design System | client/src/styles/sacred.css | ✅ Active |
| Microcopy | client/src/content/microcopy/*.ts | ✅ Active |
| Admin | client/src/pages/admin/* | ✅ Active |

### Tagging Status

All files tagged as:
- **canonical**: Primary source of truth
- **duplicate**: Flagged for consolidation
- **legacy**: Deprecated but preserved
- **orphan**: No references (safe to archive)

---

## B) Proof-of-Done v2

### Validation Checks

| Check | Status |
|-------|--------|
| Build passes | ✅ PASS |
| TypeCheck passes | ✅ PASS |
| RouteKey → Path resolution | ✅ PASS |
| Key pages render | ✅ PASS |
| Endpoint contracts (200/4xx) | ✅ PASS |
| DB tables exist | ✅ PASS |

---

## C) No-Duplicate-Work v6

### Hard Fail Checks (PASS)

| Check | Duplicates Found |
|-------|------------------|
| RouteKey duplicates | 0 |
| CanonicalPath duplicates | 0 |
| Endpoint signature (METHOD+PATH) | 0 |
| DB table name duplicates | 0 |
| Schema export duplicates | 0 |
| UI component name collisions | 0 |
| Microcopy key duplicates | 0 |

### Soft Flags (Report Only)

| Check | Flagged |
|-------|---------|
| Near-duplicate pages (>0.80 similarity) | 2 (low priority) |
| Near-duplicate content blocks (>0.85) | 3 (low priority) |
| Repeated microcopy on same page | 0 |

---

## D) Incomplete Queue

See: `docs/batch-14/incomplete-queue.md`

Priority:
1. Build/typecheck blockers: 0
2. Auth/billing blockers: 0
3. Broken nav/routeKey: 0
4. Broken admin pages: 0
5. UI overcrowding: 5 pages (in progress)

---

## E) Design System Drift

See: `docs/batch-14/design-system-drift.md`

| Rule | Compliance |
|------|------------|
| Button min-height 44px | ✅ 95% compliant |
| H1/H2 scale (4xl-6xl / 3xl-4xl) | ✅ 90% compliant |
| Container widths | ✅ 100% compliant |
| Card-based content | ✅ 95% compliant |

---

## F) Safety & Legal Copy

See: `docs/batch-14/safety-copy-scan.md`

| Risky Term | Occurrences | Replaced |
|------------|-------------|----------|
| "therapy" | 0 | N/A |
| "cure" | 0 | N/A |
| "diagnose" | 0 | N/A |
| "guaranteed" | 0 | N/A |
| "medical advice" | 0 | N/A |
| "treatment" | 0 | N/A |

All pages include:
- ✅ Educational disclaimers
- ✅ Crisis support links
- ✅ 18+ consent gates

---

## Batch 14 Processes (#351-#400)

### Status

| Category | Range | Planned | Implemented |
|----------|-------|---------|-------------|
| Trust + Safety + Governance | 351-360 | 10 | In Progress |
| Community + Social Proof | 361-370 | 10 | In Progress |
| Learning + Courses | 371-380 | 10 | Pending |
| Data + Insights | 381-390 | 10 | Pending |
| Infra + Deploy + Scale | 391-400 | 10 | Pending |

---

_Last updated: January 26, 2026_
