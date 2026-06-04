# Semantic Search + Visible Tool Index Governance

**Status:** LOCKED v1.0 — governance-only contract
**Kernel:** MMHB v7.4 (`docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`)
**Phase:** 105
**Companion registries:** `registry/search/semantic-search-registry.json`, `registry/tools/visible-tool-index-contract.json`
**Companion report:** `docs/reports/PHASE_105_SEMANTIC_SEARCH_TOOL_INDEX_REPORT.md`
**Parent governance:** `docs/governance/AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (domains **D**, **K**, **S**)

## Purpose
Create the canonical governance layer for **how a user finds the right support inside MMHB** — by feeling, by need, by goal, by category, by journey stage — without ever exposing them to dark patterns, hidden scoring, crisis misrouting, or duplicate / contradictory indexes.

This document is the **decision contract**. The two JSON registries are the **machine-readable mirror**. The Phase 105 report is the **execution ledger**. Phase 105 ships zero source or runtime change.

## Primary Law
A person in distress should not have to read 26 tool names to find one that fits. They should be able to enter a feeling, a need, a goal, a category, or a journey stage, and receive a **small, safe, ordered set of options** that:
- preserve crisis routing,
- never rank-by-engagement,
- never expose internal scoring,
- never duplicate the same tool under two competing taxonomies,
- and never lead with a paywall.

## Six Search Modes (canonical)

| # | Mode | What the user enters | What they receive |
|---|---|---|---|
| 1 | **Emotional search** | a feeling word ("anxious", "numb", "ashamed", "overwhelmed") | tools + practices + library reads matched on `emotionalState[]` |
| 2 | **Tool search** | a tool name or near-name ("breathing", "journal") | tools matched on `title`, `slug`, `aliases[]` |
| 3 | **Topic search** | a topic ("sleep", "grief", "self-worth") | hubs + library reads + tools on `topic` |
| 4 | **Journey search** | a journey-stage cue ("just starting", "stuck", "rebuilding") | journeys + tools by `journeyStage` |
| 5 | **Trust / safety search** | "safe", "private", "crisis", "988", "delete my data" | Trust Center sections, AI Transparency sections, `/crisis`, `/account/data` — **always pinned above other results** |
| 6 | **Resource search** | external help types ("therapist", "hotline", "groups") | curated `/crisis` + `/help` + external-resource cards with provenance |

All six share one registry shape; the mode is a query-time scope, not a separate index.

## Required Metadata Per Indexable Item (the 11)
Every tool, hub, journey, library article, or page that opts into the index must declare:

| Field | Type | Purpose |
|---|---|---|
| `title` | string | Display name |
| `slug` | string (kebab) | Stable id |
| `route` | string | Canonical path |
| `category` | enum (see registry) | Coarse grouping |
| `emotionalState[]` | string[] | Feelings this helps (controlled vocab) |
| `journeyStage` | enum: `starting`,`stuck`,`recovering`,`maintaining`,`crisis`,`any` | Where in the arc |
| `userIntent[]` | string[] | What the user is trying to do (e.g. `regulate`, `understand`, `connect`, `rest`) |
| `safetyLevel` | enum: `general`,`sensitive`,`crisis-adjacent`,`crisis-only` | Routing + warning rules |
| `relatedTools[]` | slug[] | For "if this helped" rails |
| `relatedTopics[]` | slug[] | For knowledge-graph linkage |
| `canonicalOwner` | string | One file/module that owns this row — no duplicates |

Missing any field = excluded from the index. Per-field controlled vocabularies live in the search registry.

## Safety-First Routing Rules
1. **Crisis pin.** Any query whose terms overlap the crisis-signal lexicon (`registry/search/` `crisisSignalTerms[]`) renders `/crisis` + 988 + 741741 above all other results, regardless of mode. Non-overridable.
2. **No silent crisis routing.** The crisis pin is visible to the user with a one-line explanation ("Because you mentioned X, here is immediate support.") — never injected without a label.
3. **Trust pin.** Queries containing trust/safety/privacy/AI-transparency terms surface Trust Center + AI Transparency Center above generic matches.
4. **Sensitive items require warning chips.** Items with `safetyLevel: sensitive` render with a calm pre-engagement chip ("This includes references to X — you can preview or skip.").
5. **No engagement-based ranking on healing surfaces.** Ranking signals allowed: query relevance, journeyStage match, recency for news only. Ranking signals **forbidden**: click-through rate, time-on-tool, conversion proximity.

## Forbidden (kernel-aligned)
- Manipulative recommendations (e.g., "Most users like you chose…").
- Crisis misrouting (any path that doesn't surface 988/741741 on a crisis-signal query).
- Healing-data monetization (no third-party ad/marketing/personalization vendor sees search queries on healing surfaces).
- Hidden vulnerability scoring (no implicit "distress level" attached to a user query for ranking).
- Duplicate tool indexes (two registries, two source-of-truth files, two competing hubs).
- Search results without safety boundaries (`safetyLevel` is mandatory).
- Auto-personalized result reordering without an explicit consent moment.
- Cross-domain bleed: BUSINESS results (pricing, upgrade) in HEALING search outputs.

## Index Surfaces (canonical visibility)
The `visible-tool-index-contract.json` declares **where** indexed items must be findable. Today's competing discovery surfaces (`/wellness-tools-hub`, `/tools/all`, `/hubs/* ×43`, `/explore/*`) will be resolved by the Phase 105–110 build sequence into **one canonical spine**:
- `/explore` — the discovery home (search + curated rails)
- `/explore/tools` — the canonical visible tool index
- `/explore/library` — the canonical visible library index
- `/explore/journeys` — the canonical visible journey index
- `/hubs/<topic>` — topical clusters under explore (1 per topic, no duplicates)

Existing `/wellness-tools`, `/discover`, `/resources`, `/calm-room`, `/journal`, `/companion` continue to function and **redirect or alias** to the canonical spine in a later phase. This map locks the destination; it does not move any route in Phase 105.

## Tool Grouping (canonical 10 categories)
- `calming` · `journaling` · `reflection` · `breathing` · `sleep` · `self-worth` · `anxiety-support` · `burnout-support` · `crisis-resources` · `growth`

Every indexed tool must declare exactly one `category` from this list. New categories require a phase report and a kernel note.

## Domain Separation
| Search input | Allowed result domains | Forbidden result domains |
|---|---|---|
| Emotional / Topic / Tool / Journey | HEALING + CRISIS pins | BUSINESS (no upgrade CTAs in result cards) |
| Trust / Safety | PLATFORM (Trust Center, AI Transparency) + CRISIS pins | BUSINESS |
| Resource (external help) | CRISIS + curated external | BUSINESS |
| Admin search (separate index) | PLATFORM only | HEALING/CRISIS pinned-warning only |

The admin search is a **separate index**; it is never blended with the healing index.

## Visibility Rules (binding on every surface)
- **mustBeFindableByEmotion** — every tool answers ≥ 3 emotional-state queries.
- **mustBeFindableByCategory** — every tool listed under its `category`.
- **mustBeFindableByJourneyStage** — every tool answers ≥ 1 journey-stage query.
- **mustPreserveCrisisBoundaries** — every result surface includes a persistent crisis footer link.
- **mustAvoidDarkPatterns** — no urgency timers, no scarcity counters, no "limited time" labels on healing surfaces.
- **mustExposeProvenance** — external-resource results show source domain + date.
- **mustRespectReducedMotion** — result cards do not animate on hover/scroll when reduced-motion is set.

## Build Sequence (Phases 106–110 proposed; none executed here)
1. **Phase 106** — Tool inventory audit: walk `client/src/pages/tools/` (26 files), `client/src/content/tools/`, `client/src/tool-registry/toolRegistry.ts` and produce `docs/reports/PHASE_106_TOOL_INVENTORY_AUDIT.md` mapping each tool to required-metadata completeness.
2. **Phase 107** — Controlled-vocabulary lock: publish `registry/search/vocab/{emotions,intents,topics,journeyStages}.json` (the lexicons referenced by required fields).
3. **Phase 108** — Tool metadata backfill: extend each tool's existing entry in `toolRegistry.ts` to include the 11 fields. Doc-only design; coding is a Phase 109 step.
4. **Phase 109** — Index builder: build-time script `scripts/search/build-index.mjs` emits `client/public/search-index.json` from registries — no runtime AI calls, fully static.
5. **Phase 110** — Canonical `/explore` UI shells (search box + result list + rails) using existing design-system components; reciprocal redirects from legacy hubs deferred to a separate route-consolidation phase.

Each phase opens with a diagnose artifact (audit) and closes with verification (build + health + probe).

## Quality Gates Bound by This Map
| Gate | Required | Tooling |
|---|---|---|
| build | `npm run build` exit 0 | npm |
| health | `/healthz` + `/readyz` + `/api/health` 200 | curl |
| routes | no taxonomy regression | `CANONICAL_ROUTE_TAXONOMY.md` |
| accessibility | 0 critical / 0 serious on touched surfaces | axe |
| bundle | within `PHASE_103_BUNDLE_BUDGET_GUARDRAIL.md` | CI |
| duplication | no second tool/search index | registry |
| privacy | search queries never persisted with user_id without consent | manual |
| rollback | revertible by one git revert | git |

## Linkage Map
- ↑ Parent: `AZ_PLATFORM_SUCCESS_GOVERNANCE.md` (domains D, K, S)
- ↑ Kernel: `MMHB_v7.4_ARCHIVAL_KERNEL.md`
- ↔ Crisis partner: `/crisis` + `client/src/lumi-crisis/`
- ↔ Trust pin partner: `docs/governance/TRUST_CENTER_AI_TRANSPARENCY_ARCHITECTURE.md`
- ↔ Route taxonomy: `docs/governance/CANONICAL_ROUTE_TAXONOMY.md` + `docs/reports/CANONICAL_TAXONOMY_AUDIT.md`
- → Companion registries: `registry/search/semantic-search-registry.json`, `registry/tools/visible-tool-index-contract.json`
- → Execution ledger: `docs/reports/PHASE_105_SEMANTIC_SEARCH_TOOL_INDEX_REPORT.md`
- ⇄ Existing live surfaces referenced (read-only): `client/src/pages/tools/` (26 files), `client/src/tool-registry/toolRegistry.ts`, `client/src/content/tools/`, `client/src/components/search/RouteSearchBox.jsx`

## Versioning
- v1.0 locked 2026-05-25. Edits to safety-first routing rules or forbidden list require a kernel addendum.
