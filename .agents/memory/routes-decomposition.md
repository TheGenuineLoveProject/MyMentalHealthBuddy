---
name: routes.js decomposition
description: Durable facts for safely splitting client/src/content/routes.js into per-category files
---

# routes.js (MMHB) decomposition notes

## Route objects are 100% plain data — the key safety insight
Every entry in `rawRoutes` is serializable plain data. The ONLY code coupling is the
central `routes = rawRoutes.map(applyPreset...)` which runs over the merged array
regardless of which file each object came from. Icons are **string literals**
(e.g. `icon: 'Heart'`), not imported components. `component`/`customComponent` values
are **string identifiers** resolved by a registry elsewhere, not imports inside routes.js.
**Why:** means any contiguous slice can be extracted as `export const X = [...]` and
spread back with zero import/helper/icon-dependency risk.
**How to apply:** extract contiguous category blocks verbatim, spread in-place to
preserve array order, then build + verify:all (expect 121 pass / 0 warn / 0 fail).

## Naming trap: coreRoutes.js does NOT hold the 'core' category
`client/src/content/routes/coreRoutes.js` holds the 7 public SUPPORT pages
(/faq,/resources,/support,/help,/professional-resources,/qa,/contact).
The real `category:'core'` (11 routes: /dashboard,/journal,/mood, etc.) is the
PROTECTED app surface and is STILL inline in routes.js. Never extract 'core' category —
it's protected app flow, not public. supportRoutes.js holds the 3 /support/* sub-pages.

## Non-contiguous categories — do not extract as one spread
wellness(29), ai(7), community(7), system(7) are scattered through the array. A single
`...X` spread would reorder them and change route-listing order. Only extract contiguous
blocks (legal, learning, content, advanced, landing) unless splitting into sub-arrays.

## Excluded from extraction (governance + user directive)
auth, admin, account(protected), core(app/dashboard), ai(healing), wellness(healing),
plus landing's sensitive members (/, aliases, /healing, /pricing, CanvaLanding component).

## Registry tooling: derive module list from routes.js imports, NOT a dir glob
`client/src/content/routes/` contains files NOT wired into the runtime route array:
routeRegistry.js (266-line helper), index.js, and 3 empty stubs
(healingRoutes.js, adminRoutes.js, communityRoutes.js — 0 lines). routes.js only
imports 7 modules (core/support/learning/legal/content/tool/marketing). Any
read-only governance collector must parse routes.js `from "./routes/X.js"` imports
to build its allowlist; a `readdirSync(*.js)` glob risks counting unwired/stub
files and producing false drift. routes.js can't be runtime-imported in Node
(pulls lucide-react/React) → static parse only. Registry baseline locked at 145.
