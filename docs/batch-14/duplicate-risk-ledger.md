# Batch 14 Duplicate Risk Ledger

**Generated:** 2026-01-26
**Status:** DOCUMENTED - Non-blocking for Batch 14

---

## Pre-existing Duplicates

### RouteKey Duplicates (30)

These routeKeys appear multiple times in the registry. Most are intentional (hub pages with multiple entry points):

| RouteKey | Reason | Action |
|----------|--------|--------|
| grounding | Hub page, multiple aliases | Monitor |
| tools__reframe | Tool with variants | Monitor |
| hubs__* | Hub pages with aliases | Monitor |
| tools | Tools index | Monitor |
| wisdom | Wisdom hub | Monitor |

**Decision:** Non-blocking. These are intentional design patterns for navigation flexibility.

### Endpoint Duplicates (60+)

These endpoint signatures appear in multiple route files:

| Signature | Files | Reason |
|-----------|-------|--------|
| GET:/ | Multiple | Root per router |
| GET:/:id | Multiple | Resource pattern |
| POST:/ | Multiple | Create pattern |
| GET:/health | Multiple | Health checks |
| GET:/stats | Multiple | Stats endpoints |

**Decision:** Non-blocking. RESTful patterns naturally create duplicate signatures across routers. Each router has its own namespace prefix.

---

## Resolution Strategy

1. **RouteKey duplicates:** Will be consolidated in future batch (Batch 15+)
2. **Endpoint duplicates:** Natural REST patterns, no action needed
3. **DB Table duplicates:** None found
4. **Export duplicates:** None found

---

## Blocking Issues

None. Platform is functional and all critical paths work.

---

_Last updated: January 26, 2026_
