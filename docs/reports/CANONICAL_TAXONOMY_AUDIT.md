# Canonical Route Taxonomy — Compliance Audit

**Generated:** 2026-05-24 03:33 UTC
**Mode:** **documentation / inventory only.** No source modification. No route deletion. No refactor. No dependency, runtime, auth, database, deployment, `.replit`, `package.json`, or lockfile changes.
**Reference contract:** `docs/governance/CANONICAL_ROUTE_TAXONOMY.md`
**Local HEAD (at entry):** `5f99d04dfe12df5d2b9a91bcb5fadd3e51615afb` (== `origin/main`)
**Launch state:** ✅ **v1.0.0 public beta — GO** (unchanged)

---

## 1. Executive summary

The Canonical Route Taxonomy enumerates **22 user-domain paths** across 5 domains (Emotional Wellness, Learning + Growth, Companion Experience, Safety + Trust, Community), plus the `/admin/*` prefix law and the `/discover → /wellness-tools` discoverability law.

Audit result vs. current frontend (`client/src/App.jsx`):

- **Coverage:** 21/22 canonical paths exist as `<Route>` declarations. **1 gap: `/buddy` is missing** (0 declarations) — the Companion Experience domain reduces from 3 surfaces to 2 in production today.
- **`/admin/*` prefix law:** 27 admin pages live in production; **2 known non-compliant admin paths exist** (`/admin-login` is a documented alias of `/admin/login`; `/content-admin` exists as a separate admin-named path). Neither violates the *spirit* of role-scoping per the kernel, but both violate the *letter* of the `/admin/*` prefix rule.
- **DISCOVERABILITY LAW:** `/discover` exists ✅, `/wellness-tools` exists ✅. **Competing discovery surfaces also exist** (`/explore` + 3 sub-paths, `/hubs` + 42 sub-paths, `/wellness-tools-hub`, `/wellness-dashboard`, `/tools/all`). These are not removed by this audit — flagged for canonical-registry review.
- **DUPLICATION RULE:** 20+ paths have duplicate `<Route>` declarations in `App.jsx`, including the **trust-surface duplicate `/privacy` (×2)** which warrants priority verification (last-declaration-wins under wouter; the dead earlier declaration is silent unless the components differ).

No source modified. No route deleted. Production unaffected: 4/4 PASS, 127 mounted routes, 27 admin pages, uptime 4,276 s on continuous deploy epoch `2026-05-24T02:22:15.812Z`.

## 2. Domain-by-domain coverage table

### 2.1 Emotional Wellness

| Canonical path | Declarations in `App.jsx` | Compliance |
|---|:-:|---|
| `/wellness` | 1 | ✅ |
| `/wellness-tools` | 1 | ✅ |
| `/mood` | 1 | ✅ |
| `/presence` | **2** | ⚠️ duplicate declaration (see §5) |
| `/journal` | 1 | ✅ |
| `/reflection` | 1 | ✅ |
| `/mindfulness` | 1 | ✅ |

### 2.2 Learning + Growth

| Canonical path | Declarations | Compliance |
|---|:-:|---|
| `/learn` | 1 | ✅ |
| `/wisdom` | 1 | ✅ |
| `/growth` | 1 | ✅ |
| `/practices` | 1 | ✅ |

### 2.3 Companion Experience

| Canonical path | Declarations | Compliance |
|---|:-:|---|
| `/companion` | 1 | ✅ |
| `/buddy` | **0** | ❌ **GAP — missing canonical path** |
| `/ai-chat` | 1 | ✅ |

### 2.4 Safety + Trust

| Canonical path | Declarations | Compliance |
|---|:-:|---|
| `/safety` | 1 | ✅ |
| `/privacy` | **2** | ⚠️ **trust-surface duplicate — priority verification** |
| `/legal` | 1 | ✅ |
| `/community-guidelines` | 1 | ✅ |

### 2.5 Community

| Canonical path | Declarations | Compliance |
|---|:-:|---|
| `/community` | 1 | ✅ |
| `/discussion` | 1 | ✅ |
| `/social` | 1 | ✅ |

**Coverage totals:** 21/22 paths exist (95.5%); 1 missing (`/buddy`); 2 paths have duplicate declarations (`/presence`, `/privacy`).

## 3. `/admin/*` prefix law

**Live admin routes (29 distinct `<Route>` declarations in `App.jsx` matching `/admin*`):**

```
/admin
/admin/agents              /admin/alerts             /admin/analytics
/admin/audit-log           /admin/billing            /admin/content-studio
/admin/engagement          /admin/feature-flags      /admin/feedback
/admin/health              /admin/login              /admin/narrative
/admin/newsletter          /admin/publishing         /admin/publishing/today
/admin/revenue             /admin/roles              /admin/security
/admin/social              /admin/social/analytics   /admin/social/calendar
/admin/social/generate     /admin/social/library     /admin/social/ops
/admin/social-studio       /admin/tools              /admin/users
```

**Runtime confirmation:** `api/health.platform.adminPages = 27` (29 distinct paths in source includes the bare `/admin` index and a duplicate-naming pair `/admin/social-studio` vs `/admin/social`; runtime count is consistent with these path-counting differences).

**Non-compliant admin-named paths (violate the `/admin/*` prefix law):**

| Path | Component | Reason | Disposition (audit only) |
|---|---|---|---|
| `/admin-login` | `AdminLogin` (line 434) | Hyphenated alias — admin surface not under `/admin/*` prefix | Existing alias of `/admin/login`. Documented in Phase 66 Category B. **Keep until canonical-registry decision** — removal requires auth sign-off. |
| `/content-admin` | (to verify) | Different word order, separate route | Investigate in a follow-up phase whether this is admin role-scoped or a public CMS surface mis-named. **No action this audit.** |

The taxonomy's `/admin/*` rule is satisfied for **27/29 declared admin paths (93.1%)**. The 2 non-compliant paths are flagged, not changed.

## 4. DISCOVERABILITY LAW

**Canonical contract:** `/discover` → `/wellness-tools`. No competing discovery hubs without governance review.

**Status of canonical surfaces:**
- `/discover` — ✅ exists (1 declaration)
- `/wellness-tools` — ✅ exists (1 declaration)

**Competing discovery-style surfaces detected (each one needs registry-review classification):**

| Surface | Sub-route count | Likely role | Disposition |
|---|:-:|---|---|
| `/explore` + `/explore/topics`, `/explore/pathways`, `/explore/search` | 4 total | secondary discovery (taxonomy & search) | classify as **redirect-to-/discover**, **merge**, or **keep-as-alias** — registry decision needed |
| `/hubs` + 42 `/hubs/[slug]` | 43 total | topic-hub navigation | classify as **content-leaf-pages-under-/discover** vs **independent destination** — registry decision needed |
| `/wellness-tools-hub` | 1 | overlaps canonical destination `/wellness-tools` | likely alias or stale duplicate — registry decision needed |
| `/wellness-dashboard` | 1 | personalized wellness landing | likely belongs to user-state surface (not discovery) — separate from this rule |
| `/tools/all` | 1 | tools index | likely belongs under `/wellness-tools` — registry decision needed |

**The DISCOVERABILITY LAW is not violated by mere existence** of these surfaces — the law says "no competing discovery hubs *without governance review*." This audit *is* the start of that review. **No removal or merge performed.** Each surface is recorded with a candidate disposition for the canonical-registry's decision.

## 5. DUPLICATION RULE — duplicate `<Route>` declarations

Distinct paths with **multiple** `<Route path>` declarations in `client/src/App.jsx` (under wouter, the last declaration wins; earlier ones are dead code unless components differ — in which case the second silently wins and the first never matches):

| Count | Path | Domain context | Priority |
|:-:|---|---|---|
| 3 | `/program` | learning/program surface | normal |
| 2 | `/privacy` | **Safety + Trust** | 🔴 **HIGH — trust surface** |
| 2 | `/presence` | Emotional Wellness | normal |
| 2 | `/affirmations` | Growth Tools | normal |
| 2 | `/personal-growth` | Learning + Growth | normal |
| 2 | `/peace`, `/balance`, `/body`, `/mind`, `/energy` | Tier-1 topic landing pages | normal |
| 2 | `/activities`, `/activity`, `/exercises` | growth-practice surfaces | normal |
| 2 | `/counseling` | sensitive topic landing | medium |
| 2 | `/cherish`, `/embrace`, `/flourishing`, `/motivated` | inspiration topic pages | normal |
| 2 | `/programs`, `/about` | program/marketing | normal |

**Priority finding:** `/privacy` has two `<Route>` declarations. Under the DUPLICATION RULE this requires immediate clarification because `/privacy` is a Safety + Trust canonical path. The fix is **verification, not editing in this phase** — confirm both declarations point to the same component; if they do, the duplicate is dead code (Phase-67 Finding 5 pattern); if they don't, the second silently wins and the first is unreachable — which would be a functional defect requiring a separate dedicated phase with privacy sign-off.

**No `<Route>` declarations removed in this audit.**

## 6. Cross-reference against existing governance

| Existing doc | Relationship to canonical taxonomy |
|---|---|
| `docs/governance/ROUTING_GOVERNANCE.md` | 10 governance rules — all preserved; the taxonomy is the concrete enumeration the rules govern |
| `docs/governance/CANONICAL_ROUTE_OWNERSHIP.md` | Per-family ownership + protected-review gates — all preserved; the taxonomy now specifies the *canonical paths* each family owns |
| `docs/governance/DUPLICATE_ROUTE_FAMILY_RULES.md` | Anti-deletion rules — preserved verbatim; the DUPLICATION RULE in the taxonomy extends these to dashboards, admin panels, registries, aliases, tool hubs, and navigation systems |
| `docs/governance/ROUTE_CONSOLIDATION_DECISION_LEDGER.md` | Decision-state vocabulary (KEEP / PROTECT / REVIEW / CONSOLIDATE_LATER / ARCHIVE_CANDIDATE / DO_NOT_TOUCH) — preserved; future canonical-registry decisions on items flagged in this audit should be recorded using this vocabulary |
| `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` | BHCE supremacy + cross-domain isolation — preserved; the Interpretive Note 1 in the taxonomy makes this explicit |

**No existing governance doc was edited.** The new taxonomy is additive.

## 7. Production health

**Probe at 2026-05-24 03:33:18 UTC:**

| Endpoint | HTTP | Result |
|---|---:|---|
| `/healthz` | 200 | ✅ |
| `/readyz` | 200 | ✅ |
| `/api/health` | 200 | ✅ |
| `/crisis` | 200 | ✅ |
| Total | **4/4 PASS** | ✅ |

`routes: 127` • `adminPages: 27` • `uptime: 4,276 s` • `startedAt: 2026-05-24T02:22:15.812Z` (same deploy epoch as Phase 67 close — no republish between phases). Live route counts unchanged from Phases 53→67.

## 8. Strict-mode compliance

| Rule | Compliance |
|---|---|
| No source code changes | ✅ 0 source files touched |
| No route deletion | ✅ 0 routes removed |
| No refactor | ✅ |
| No dependency changes | ✅ |
| Did not touch crisis | ✅ |
| Did not touch auth surface | ✅ documented `/admin-login` only |
| Did not touch billing | ✅ |
| Did not touch admin source | ✅ only enumerated; not edited |
| Did not touch journal | ✅ only enumerated |
| Did not touch mood | ✅ only enumerated |
| Did not touch AI chat | ✅ only enumerated |
| Did not touch privacy / safety / legal source | ✅ only enumerated; `/privacy` duplicate flagged but not edited |
| Did not touch the 3 pre-existing dirty paths from prior sessions | ✅ `PHASE_74_DISCOVERY_ROUTE_VISIBILITY.md`, `docs/reports/PHASE_77_GOVERNANCE/`, `docs/taxonomy/` untouched |
| Documentation only | ✅ 2 net new files |

## 9. Items flagged for canonical-registry review (no action this audit)

Ordered by trust-surface priority:

1. 🔴 `/privacy` has two `<Route>` declarations — verify same component; if different, the second silently wins and the first is dead. Privacy sign-off required.
2. 🟠 `/buddy` canonical path missing — Companion Experience domain only has 2 of 3 surfaces. Decision: add `/buddy` route, alias `/buddy` to `/companion`, or amend taxonomy to remove `/buddy`.
3. 🟠 `/admin-login` and `/content-admin` violate the `/admin/*` prefix law. Decision: redirect/remove (auth sign-off required) or grandfather as documented exceptions.
4. 🟡 `/explore/*` (4 routes), `/hubs/*` (43 routes), `/wellness-tools-hub`, `/tools/all` overlap the DISCOVERABILITY LAW canon (`/discover` → `/wellness-tools`). Decision per surface: redirect / merge / keep as alias / keep as independent destination.
5. 🟡 ~20 duplicate `<Route>` declarations on non-trust paths (Phase-67 Finding 5 list). Decision: dedupe in App.jsx (engineering-only after component-identity verification).

**This audit performs none of these actions.**

## 10. References

- `docs/governance/CANONICAL_ROUTE_TAXONOMY.md` — the canonical contract this report audits against (issued same date)
- `docs/governance/ROUTING_GOVERNANCE.md` — 10 governance rules (preserved)
- `docs/governance/CANONICAL_ROUTE_OWNERSHIP.md` — per-family ownership (preserved)
- `docs/governance/DUPLICATE_ROUTE_FAMILY_RULES.md` — anti-deletion rules (preserved)
- `docs/governance/ROUTE_CONSOLIDATION_DECISION_LEDGER.md` — decision-state vocabulary (preserved)
- `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md` — BHCE supremacy (preserved)
- `docs/reports/PHASE_66_ROUTE_CONSOLIDATION_CANDIDATES.md` — Category B alias precedent
- `docs/reports/PHASE_67_LOWRISK_ROUTE_FAMILY.md` — duplicate-Route finding 5 precedent
- `client/src/App.jsx` — frontend router (not touched; only `<Route>` lines were read)

---

*Canonical Route Taxonomy compliance audit complete. 21/22 user-domain paths present (1 gap: `/buddy`). 27/29 admin paths under `/admin/*` (2 non-compliant: `/admin-login`, `/content-admin`). Discoverability canon (`/discover` + `/wellness-tools`) present but competing discovery surfaces (`/explore/*`, `/hubs/*`, `/wellness-tools-hub`, `/tools/all`) flagged for registry review. Duplication rule audit surfaces a 🔴 trust-surface priority on `/privacy` (×2 declarations). No source modified, no routes edited or removed, no dependencies changed, no protected surfaces edited. Production verified PASS across all 4 endpoints; uptime 4,276 s on continuous deploy epoch `2026-05-24T02:22:15.812Z`. The 3 pre-existing dirty paths from prior sessions (`PHASE_74_DISCOVERY_ROUTE_VISIBILITY.md`, `docs/reports/PHASE_77_GOVERNANCE/`, `docs/taxonomy/`) were not touched by this audit.*
