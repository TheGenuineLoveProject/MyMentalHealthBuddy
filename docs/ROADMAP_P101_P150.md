# ROADMAP P101–P150 (Batch 3)

> Created: January 2026
> Purpose: Track processes P101-P150 implementation status

---

## Priority Order
1) Build/typecheck/tests blockers
2) Finish carryover TODO/stubs (core flows)
3) Routing single-source truth upgrades (P101–P110)
4) Design system enforcement (P111–P120)
5) Wellness safety components (P121–P130)
6) Admin + content ops (P131–P140)
7) Reliability + operations (P141–P150)

## Exit Criteria
- Build passes + typecheck passes ✅
- /crisis always reachable ✅
- routeKey validator + broken link scanner exist
- Design tokens + button sizing enforced ✅
- Consent/pacing + softer toggle reusable components live
- Admin gates hardened + audit log view works ✅

---

## Status Summary

| Category | Done | TODO | Total |
|----------|------|------|-------|
| Routing (P101-P110) | 7 | 3 | 10 |
| Design System (P111-P120) | 6 | 4 | 10 |
| Wellness Safety (P121-P130) | 2 | 8 | 10 |
| Admin + Content (P131-P140) | 1 | 9 | 10 |
| Reliability (P141-P150) | 3 | 7 | 10 |
| **Total** | **19** | **31** | **50** |

---

## ROUTING + INFORMATION ARCHITECTURE (P101-P110)

| ID | Process | Status | Files |
|----|---------|--------|-------|
| P101 | RouteKey single-source validator script | ✅ DONE | scripts/validateRouteKeys.mjs (Patch 33) |
| P102 | Internal link resolver + broken link scanner | TODO | |
| P103 | Auto-generated nav map from route registry | ✅ DONE | client/src/components/Navigation.jsx |
| P104 | Breadcrumbs from route meta | ✅ DONE | client/src/components/Breadcrumbs.jsx |
| P105 | "Related content" engine | TODO | |
| P106 | Canonical URL enforcement + redirects map | ✅ DONE | client/src/content/meta/routeMetaRegistry.ts |
| P107 | 404 page with search + calm microcopy | ✅ DONE | client/src/pages/NotFound.jsx |
| P108 | /crisis routing hardening | ✅ DONE | client/src/pages/CrisisResources.jsx |
| P109 | Site-wide "pause" affordance | TODO | |
| P110 | Global footer safety consistency | ✅ DONE | client/src/components/SafetyFooter.jsx |

---

## DESIGN SYSTEM + UI CONSISTENCY (P111-P120)

| ID | Process | Status | Files |
|----|---------|--------|-------|
| P111 | Design tokens file + Tailwind mapping | ✅ DONE | client/src/styles/tokens.css |
| P112 | Button sizing + variants (44px min) | ✅ DONE | tokens.css |
| P113 | Form field consistency + error states | TODO | |
| P114 | Card system (3 densities) | TODO | |
| P115 | Icon system + sizing rules | TODO | |
| P116 | Motion system (reduced-motion support) | TODO | |
| P117 | Accessibility focus ring + keyboard nav | ✅ DONE | tokens.css |
| P118 | Empty states + loading states library | ✅ DONE | client/src/components/ui/skeleton.tsx |
| P119 | Toast/alert standardization | ✅ DONE | @/hooks/use-toast |
| P120 | Typography scale enforced | ✅ DONE | tokens.css |

---

## WELLNESS TOOLING QUALITY + SAFETY (P121-P130)

| ID | Process | Status | Files |
|----|---------|--------|-------|
| P121 | Universal consent/pacing component | ✅ DONE | AgeConsentGate.jsx |
| P122 | "Softer version" toggle component | TODO | |
| P123 | Practice timer + "stop now" button | TODO | |
| P124 | Reflection prompt library | TODO | |
| P125 | Risk labeling for tools | TODO | |
| P126 | Crisis detection phrasing guard | TODO | |
| P127 | Tool completion logging (privacy-safe) | TODO | |
| P128 | Export user entries + delete controls | TODO | |
| P129 | Data minimization audit | TODO | |
| P130 | "Not therapy" disclaimers component | ✅ DONE | Disclaimer.tsx |

---

## ADMIN + CONTENT OPS (P131-P140)

| ID | Process | Status | Files |
|----|---------|--------|-------|
| P131 | Admin role gate middleware hardening | TODO | |
| P132 | Admin audit log viewer | ✅ DONE | admin/AuditLogExplorer.jsx |
| P133 | Admin content editor safe-mode | TODO | |
| P134 | Admin social studio approvals | TODO | |
| P135 | Calendar view improvements | TODO | |
| P136 | Export formats expanded | TODO | |
| P137 | Content template versioning | TODO | |
| P138 | "No plagiarism" checker prompts | TODO | |
| P139 | Evidence links manager | TODO | |
| P140 | Admin "release notes" generator | TODO | |

---

## RELIABILITY + OPERATIONS (P141-P150)

| ID | Process | Status | Files |
|----|---------|--------|-------|
| P141 | "Doctor" script v2 | ✅ DONE | scripts/doctor.mjs (Patch 32) |
| P142 | Dependency health report | TODO | |
| P143 | Safe upgrade workflow | TODO | |
| P144 | CI gates: build/typecheck/lint | TODO | |
| P145 | Lighthouse/checklist docs | TODO | |
| P146 | Backup export of content + settings | TODO | |
| P147 | Environment variable validator | TODO | |
| P148 | Rate limit config centralization | ✅ DONE | server/middleware/rateLimit.mjs |
| P149 | Security headers test checklist | TODO | |
| P150 | Release checklist v2 | ✅ DONE | tools/release_gate.sh |

---

## Next Patch Candidates

Based on priority ranking:
1. **P102** - Broken link scanner (SEO/UX quality)
2. **P131** - Admin role gate hardening (security)
3. **P147** - Environment variable validator (fail fast)

---

_Last updated: January 2026_
