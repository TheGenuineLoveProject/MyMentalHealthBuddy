# Duplicate Detection Report

**Generated:** 2026-02-06
**Scope:** Full repository scan (files, routes, logic, AI agents, configs, scripts)
**Policy:** SCAN-ONLY. No deletions performed.

---

## Summary

| Category | Duplicate Groups Found | Total Files Involved |
|----------|----------------------|---------------------|
| Components (SafetyFooter) | 1 group | 5 files |
| Components (SEO) | 1 group | 3 files |
| Components (LotusGuide) | 1 group | 2 files |
| Components (Hero) | 1 group | 8 files |
| Scripts (scan-*) | 1 group | 18 files |
| Scripts (smoke tests) | 1 group | 3 files |
| Scripts (port cleanup) | 1 group | 5 files |
| Scripts (autoheal/repair) | 1 group | 5 files |
| Scripts (duplicate detection) | 1 group | 7 files |
| Scripts (nested scripts/) | 1 group | 4 files |
| Legacy Root Directories | 2 groups | pages/, components/ |
| Legacy Root HTML Files | 1 group | 7 files |
| Quarantine Directories | 1 group | 2 dirs |
| Server Routes (wisdom) | 1 group | 4 files |
| Server Routes (healing) | 1 group | 6 files |
| Server Routes (self-mastery) | 1 group | 2 files |

---

## Component Duplicates

### 1. SafetyFooter (5 files)

| File | Classification |
|------|---------------|
| `client/src/components/ui/SafetyFooter.jsx` | **PRIMARY** - imported in most pages |
| `client/src/components/safety/SafetyFooter.tsx` | REDUNDANT - TypeScript variant |
| `client/src/components/SafetyFooter.jsx` | REDUNDANT - root-level copy |
| `client/src/components/safety/SafetyFooterStrip.tsx` | SAFE - different variant (strip layout) |
| `client/src/components/wellness/SafetyFooter.tsx` | REDUNDANT - wellness-scoped copy |

### 2. SEO Component (3 files)

| File | Classification |
|------|---------------|
| `client/src/components/seo/SEO.tsx` | **PRIMARY** - organized in seo/ dir |
| `client/src/components/SEO.tsx` | REDUNDANT - root-level copy |
| `client/src/config/seo.ts` | SAFE - config data, not a component |

### 3. LotusGuide (2 files)

| File | Classification |
|------|---------------|
| `client/src/components/LotusGuide.jsx` | REDUNDANT - root-level copy |
| `client/src/components/sacred/LotusGuide.jsx` | **PRIMARY** - organized in sacred/ dir |

### 4. Hero Components (8 files)

| File | Classification |
|------|---------------|
| `client/src/components/sacred/SacredHero.jsx` | **PRIMARY** - main hero component |
| `client/src/components/sacred/Hero.jsx` | SAFE - sacred-specific variant |
| `client/src/components/landing/Hero.tsx` | SAFE - landing page variant |
| `client/src/components/HeroSection.jsx` | REDUNDANT - generic copy |
| `client/src/components/ui/HeroSection.jsx` | REDUNDANT - ui-scoped copy |
| `client/src/components/ui/Hero.jsx` | REDUNDANT - ui-scoped copy |
| `client/src/components/BrandHero.tsx` | SAFE - brand-specific variant |
| `client/src/components/HealingHero.jsx` | SAFE - healing-specific variant |

---

## Script Duplicates

### 5. Scan Scripts (18 files with overlapping purpose)

| File | Classification |
|------|---------------|
| `scripts/scan.mjs` | LEGACY-LOCKED - base scanner |
| `scripts/scanPlatform.mjs` | **PRIMARY** - platform scanner |
| `scripts/deepScan.mjs` | SAFE - deep analysis variant |
| `scripts/scan-duplicates.mjs` | REDUNDANT (vs scanDuplicates.mjs) |
| `scripts/scanDuplicates.mjs` | REDUNDANT (vs scan-duplicates.mjs) |
| `scripts/scan-architecture.mjs` | REDUNDANT (vs arch-scan.mjs) |
| `scripts/arch-scan.mjs` | **PRIMARY** - architecture scanner |
| `scripts/scan-project.mjs` | REDUNDANT - general scanner |
| `scripts/scan-api.mjs` | SAFE - API-specific |
| `scripts/scan-errors.mjs` | SAFE - error-specific |
| `scripts/scan-critical.mjs` | SAFE - critical-only |
| `scripts/scan-types.mjs` | SAFE - type checking |
| `scripts/scan-ui.mjs` | SAFE - UI-specific |
| `scripts/scan-vips.mjs` | SAFE - VIP routes |
| `scripts/scanBrokenLinks.mjs` | SAFE - link checking |
| `scripts/scanDeadCode.mjs` | SAFE - dead code detection |
| `scripts/scanDeps.mjs` | SAFE - dependency scan |
| `scripts/scanEnv.mjs` | SAFE - environment scan |

### 6. Smoke Test Scripts (3 files)

| File | Classification |
|------|---------------|
| `scripts/smoke.mjs` | REDUNDANT |
| `scripts/smoke-test.mjs` | REDUNDANT |
| `scripts/smokeTest.mjs` | REDUNDANT (one should be PRIMARY) |

### 7. Port Cleanup Scripts (5 files)

| File | Classification |
|------|---------------|
| `scripts/free-port.mjs` | REDUNDANT (vs kill-port.mjs) |
| `scripts/kill-port.mjs` | **PRIMARY** |
| `scripts/clean-port.mjs` | REDUNDANT |
| `scripts/scripts/free-port.mjs` | REDUNDANT - nested duplicate |
| `scripts/scripts/kill-port.mjs` | REDUNDANT - nested duplicate |

### 8. Autoheal/Repair Scripts (5 files)

| File | Classification |
|------|---------------|
| `scripts/autoheal.mjs` | LEGACY-LOCKED |
| `scripts/autoheal-core.mjs` | REDUNDANT |
| `scripts/autoheal-project.mjs` | REDUNDANT |
| `scripts/autoheal.silent.mjs` | REDUNDANT |
| `scripts/autorepair-project.mjs` | REDUNDANT |

### 9. Duplicate Detection Scripts (7 files)

| File | Classification |
|------|---------------|
| `scripts/dup-scan.mjs` | **PRIMARY** (used in npm scripts) |
| `scripts/scan-duplicates.mjs` | REDUNDANT |
| `scripts/scanDuplicates.mjs` | REDUNDANT |
| `scripts/dedupe-plan.mjs` | SAFE - planning phase |
| `scripts/apply-dedupe-safe.mjs` | SAFE - safe application |
| `scripts/noDuplicateWork.mjs` | LEGACY-LOCKED |
| `scripts/noDuplicateWorkV6.mjs` | REDUNDANT (vs noDuplicateWork.mjs) |

### 10. Nested scripts/scripts/ Directory (4 files)

| File | Classification |
|------|---------------|
| `scripts/scripts/free-port.mjs` | REDUNDANT - copy of parent |
| `scripts/scripts/kill-port.mjs` | REDUNDANT - copy of parent |
| `scripts/scripts/permanent-fix.mjs` | REDUNDANT - copy of parent |
| `scripts/scripts/smoke-test.mjs` | REDUNDANT - copy of parent |

---

## Legacy Root-Level Directories

### 11. Root pages/ Directory

| File | Classification |
|------|---------------|
| `pages/` (20+ files) | LEGACY-LOCKED - Next.js-style pages, NOT used by current Vite/Wouter setup |

Active pages are in `client/src/pages/`. The root `pages/` directory appears to be a legacy holdover.

### 12. Root components/ Directory

| File | Classification |
|------|---------------|
| `components/` (20+ files) | LEGACY-LOCKED - root-level components with .module.css files |

Active components are in `client/src/components/`. The root `components/` directory appears to be a legacy holdover with CSS module styling from a previous architecture.

---

## Legacy Root HTML Files

### 13. Root HTML Files (7 files)

| File | Classification |
|------|---------------|
| `content.html` | LEGACY-LOCKED - static HTML prototype |
| `crm.html` | LEGACY-LOCKED - CRM prototype |
| `homepage.html` | LEGACY-LOCKED - homepage prototype |
| `landing.html` | LEGACY-LOCKED - landing prototype |
| `login.html` | LEGACY-LOCKED - login prototype |
| `onboarding.html` | LEGACY-LOCKED - onboarding prototype |
| `qa.html` | LEGACY-LOCKED - QA page prototype |

These are NOT served by the current Vite/Express app and appear to be early prototypes.

---

## Quarantine Directories

### 14. Two Quarantine Directories

| Directory | Classification |
|-----------|---------------|
| `.quarantine/` | SAFE - contains .legacy.txt files |
| `_quarantine/` | SAFE - contains timestamped archives |

Both serve quarantine purposes but the dual structure is unusual.

---

## Server Route Potential Overlaps

### 15. Wisdom-Related Routes (4 files)

| File | Classification |
|------|---------------|
| `server/routes/wisdom.mjs` | **PRIMARY** - base wisdom API |
| `server/routes/wisdom-engine.mjs` | SAFE - different endpoints |
| `server/routes/wisdom-synthesis.mjs` | SAFE - synthesis endpoints |
| `server/routes/wisdom-traditions.mjs` | SAFE - traditions endpoints |

### 16. Healing-Related Routes (6 files)

| File | Classification |
|------|---------------|
| `server/routes/healing.mjs` | **PRIMARY** - base healing API |
| `server/routes/healing-intelligence.mjs` | SAFE - intelligence endpoints |
| `server/routes/healing-modalities.mjs` | SAFE - modalities endpoints |
| `server/routes/healing-tools.mjs` | SAFE - tools endpoints |
| `server/routes/holistic-healing.mjs` | SAFE - holistic endpoints |
| `server/routes/trauma-healing-protocols.mjs` | SAFE - trauma protocols |

### 17. Self-Mastery Routes (2 files)

| File | Classification |
|------|---------------|
| `server/routes/self-mastery.mjs` | **PRIMARY** |
| `server/routes/self-mastery-intelligence.mjs` | SAFE - intelligence variant |

---

## AI Agent Scan

| Agent | File | Classification |
|-------|------|---------------|
| Content Agent | `agents/content-agent.md` | SAFE - unique role |
| Growth Agent | `agents/growth-agent.md` | SAFE - unique role |
| Layout Agent | `agents/layout-agent.md` | SAFE - unique role |
| Safety Agent | `agents/safety-agent.md` | SAFE - unique role |
| SEO Agent | `agents/seo-agent.md` | SAFE - unique role |
| MCP Tools Spec | `agents/mcp-tools-spec.md` | SAFE - tool specification |

No AI agent duplicates detected. All agents have distinct responsibilities.

---

## Recommendations (Pending Approval)

1. **HIGH PRIORITY:** Consolidate 5 SafetyFooter files into 1 canonical export
2. **HIGH PRIORITY:** Consolidate 2 SEO component locations into 1
3. **HIGH PRIORITY:** Remove nested `scripts/scripts/` directory (exact copies)
4. **MEDIUM:** Consolidate 3 smoke test scripts into 1
5. **MEDIUM:** Consolidate 3-5 port cleanup scripts into 1
6. **MEDIUM:** Consolidate autoheal/repair scripts
7. **LOW:** Archive legacy root `pages/` and `components/` directories
8. **LOW:** Archive legacy root HTML files
9. **LOW:** Merge quarantine directories

**NO DELETIONS HAVE BEEN PERFORMED. All items await explicit approval.**

---

## Phase 2 Status: COMPLETE (Scan-Only)
No code was modified during this phase.
