# Phase 105 — Semantic Search + Visible Tool Index Governance

**Status:** LOCKED — governance-only architecture phase
**Authored:** 2026-05-25
**Kernel:** MMHB v7.4
**Parent governance:** `docs/governance/AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (domains **D**, **K**, **S**)
**Companion governance doc:** `docs/governance/SEMANTIC_SEARCH_AND_TOOL_INDEX_GOVERNANCE.md`
**Companion registries:**
- `registry/search/semantic-search-registry.json`
- `registry/tools/visible-tool-index-contract.json`

## Result
Canonical governance for **how a user finds the right support** inside MMHB is now locked. The four artifacts (one doc, two registries, this ledger) define: the six search modes, the 11 required metadata fields per indexed item, the safety-first routing rules (crisis pin, trust pin, sensitive warnings), the canonical discovery spine (`/explore` + `/hubs/<topic>`), the 10 tool grouping categories, the forbidden patterns, and the build sequence for Phases 106–110.

**Zero source code, routes, auth, billing, crisis, AI chat, database, or deployment logic was touched.**

## Files Authored / Upgraded This Phase
| Path | Role | State |
|---|---|---|
| `docs/governance/SEMANTIC_SEARCH_AND_TOOL_INDEX_GOVERNANCE.md` | Decision contract | Upgraded from 49-line stub → full v1.0 LOCKED |
| `registry/search/semantic-search-registry.json` | Machine-readable mirror (search) | Upgraded from 32-line stub → full v1.0.0 schema |
| `registry/tools/visible-tool-index-contract.json` | Machine-readable mirror (tools) | Upgraded from 31-line stub → full v1.0.0 schema |
| `docs/reports/PHASE_105_SEMANTIC_SEARCH_TOOL_INDEX_REPORT.md` | Execution ledger (this file) | Upgraded from 21-line stub → full report |

## What Was Decided
1. **Six search modes** (Emotional · Tool · Topic · Journey · Trust/Safety · Resource) sharing one index with a query-time scope, not separate indexes.
2. **11 required metadata fields** per indexable item (`title`, `slug`, `route`, `category`, `emotionalState[]`, `journeyStage`, `userIntent[]`, `safetyLevel`, `relatedTools[]`, `relatedTopics[]`, `canonicalOwner`). Missing any field = excluded from the index.
3. **Crisis pin** — any query overlapping the `crisisSignalTerms[]` lexicon renders `/crisis` + 988 + 741741 above all other results, with a visible "because you mentioned X" label. Non-overridable.
4. **Trust pin** — trust/safety/privacy/AI queries surface Trust Center + AI Transparency Center above generic results.
5. **Ranking signals** allowed: query relevance, journey-stage match, recency for news. Ranking signals **forbidden**: click-through-rate, time-on-tool, conversion-proximity, engagement score, hidden vulnerability score.
6. **Canonical discovery spine proposed**: `/explore`, `/explore/tools`, `/explore/library`, `/explore/journeys`, `/hubs/<topic>`. Legacy surfaces (`/wellness-tools`, `/wellness-tools-hub`, `/tools/all`, `/discover`, `/resources`, `/calm-room`, `/journal`, `/companion`) are preserved and will be aliased in a later phase — **no route is moved in Phase 105**.
7. **10 canonical tool grouping categories** (`calming`, `journaling`, `reflection`, `breathing`, `sleep`, `self-worth`, `anxiety-support`, `burnout-support`, `crisis-resources`, `growth`). New categories require kernel sign-off.
8. **Visibility rules** binding any future surface: findable-by-emotion (≥ 3 queries/tool), findable-by-category, findable-by-journey-stage, persistent crisis footer, no dark patterns, provenance on external resources, reduced-motion respected.
9. **Domain separation** — healing search and admin search are separate indexes; never blended.
10. **Build sequence Phases 106–110** sketched (tool inventory → controlled vocab → metadata backfill design → build-time index emit → `/explore` shells). None executed this phase.

## What Was NOT Done (intentionally)
- No `/explore` route created.
- No tool registry edit; `client/src/tool-registry/toolRegistry.ts` unchanged.
- No metadata backfill on any tool.
- No new search component; `client/src/components/search/RouteSearchBox.jsx` unchanged.
- No legacy route redirected or aliased.
- No controlled-vocabulary file emitted (deferred to Phase 107).
- No build-time index script (deferred to Phase 109).

## Observational tool surfaces (read-only inventory)
| Surface | Count / Status |
|---|---|
| `client/src/pages/tools/` | 26 tool page files |
| `client/src/tool-registry/toolRegistry.ts` | single canonical registry (existing) |
| `client/src/content/tools/` | content sidecar (existing) |
| `client/src/components/search/RouteSearchBox.jsx` | current search entry point |

These are the read-only inputs Phase 106 will audit.

## Completion Criteria for THIS Phase
| Criterion | Required | Result |
|---|---|:---:|
| All 4 governance artifacts present and upgraded | ✓ | ✅ |
| `npm run build` exits 0 | ✓ | ✅ (see §Build) |
| `/healthz` returns 200 | ✓ | ✅ (see §Health) |
| `/readyz` returns 200 | ✓ | ✅ (see §Health) |
| `/api/health` returns 200 | ✓ | ✅ (see §Health) |
| Only governance/registry/report files changed | ✓ | ✅ (see §Scope) |
| No source / routes / auth / billing / crisis / db / AI / deployment changes | ✓ | ✅ |
| No files deleted or renamed | ✓ | ✅ |

## Build
- Command: `npm run build`
- Result: **exit 0**
- Output: standard rollup chunks; no new chunks; no new vendor deps (bundle unchanged vs Phase 104 baseline).

## Health
| Endpoint | HTTP |
|---|---:|
| `/healthz` | 200 ✅ |
| `/readyz`  | 200 ✅ |
| `/api/health` | 200 ✅ |

## Scope
Modified files this phase (all governance-only):
```
M docs/governance/SEMANTIC_SEARCH_AND_TOOL_INDEX_GOVERNANCE.md
M registry/search/semantic-search-registry.json
M registry/tools/visible-tool-index-contract.json
M docs/reports/PHASE_105_SEMANTIC_SEARCH_TOOL_INDEX_REPORT.md
```
- Source files (`client/src/**`, `server/**`, `shared/**`): **0 diffs**
- Route definitions: **0 diffs**
- `package.json` / `package-lock.json` / `drizzle.config.ts` / `.replit`: **0 diffs**
- Deletions: **0** · Renames: **0**

## Strict-rule Compliance
| Rule | Result |
|---|---|
| Governance-only | ✅ |
| Do not modify source code | ✅ 0 source diffs |
| Do not modify routes | ✅ 0 route diffs |
| Do not modify auth | ✅ |
| Do not modify billing | ✅ |
| Do not modify crisis | ✅ |
| Do not modify database | ✅ |
| Do not modify AI chat | ✅ |
| Do not modify deployment | ✅ |
| Do not delete files | ✅ |
| Do not rename files | ✅ |
| Create the 4 named files | ✅ all 4 present and upgraded |
| `npm run build` passes | ✅ |
| `/healthz` + `/readyz` + `/api/health` pass | ✅ |
| Commit only governance/registry/report files | ✅ scope clean |

## Quality Gates (registry-aligned)
| Gate | Applies? | Result |
|---|---|---|
| build | YES | ✅ exit 0 |
| health | YES | ✅ 3/3 200 |
| routes | YES (passive) | ✅ taxonomy unchanged |
| accessibility | N/A | no rendered changes |
| bundle | YES (passive) | ✅ bundle unchanged |
| duplication | YES | ✅ first canonical search + tool-index contract (no duplicates) |
| privacy | YES | ✅ contract forbids healing-data monetization + auto-personalized reorder without consent |
| rollback | YES | ✅ one `git revert` restores prior stubs |

## Next Safe Step
**Phase 106** — Tool inventory audit (read-only): walk `client/src/pages/tools/` (26 files) + `client/src/tool-registry/toolRegistry.ts` + `client/src/content/tools/`; per tool, score completeness against the 11 required fields; emit `docs/reports/PHASE_106_TOOL_INVENTORY_AUDIT.md`. Still governance-only; still zero source change.

## Linkage Map
- ↑ Parent: `AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (D, K, S)
- ↑ Kernel: `MMHB_v7.4_ARCHIVAL_KERNEL.md`
- ↔ Trust pin partner: `TRUST_CENTER_AI_TRANSPARENCY_ARCHITECTURE.md` (Phase 104)
- ↔ Route taxonomy: `CANONICAL_ROUTE_TAXONOMY.md` + `CANONICAL_TAXONOMY_AUDIT.md`
- ↔ Bundle peer: `PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md`
- → Companion doc: `SEMANTIC_SEARCH_AND_TOOL_INDEX_GOVERNANCE.md`
- → Registries: `registry/search/semantic-search-registry.json`, `registry/tools/visible-tool-index-contract.json`
- ⇄ Read-only references: `client/src/pages/tools/` (26), `client/src/tool-registry/toolRegistry.ts`, `client/src/content/tools/`, `client/src/components/search/RouteSearchBox.jsx`

---
*Governance-only deliverable. Author: main agent under MMHB v7.4 kernel.*
