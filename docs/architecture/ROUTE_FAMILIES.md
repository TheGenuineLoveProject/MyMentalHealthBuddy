# Route Families

> Audit of `server/routes/` (140+ files). Goal: identify duplicate route families, naming inconsistencies, and recommend a convention without forcing immediate renames.
> No file in this doc is recommended for deletion. The recommendation is **convention going forward** plus optional future namespacing.

## Convention Recommendation

The codebase already uses two patterns side-by-side:

- `dot.namespace.mjs` (e.g. `ai.healing.mjs`, `ai.business.mjs`)
- `dash-namespace.mjs` (e.g. `ai-dashboard.mjs`, `admin-billing.mjs`)

**Recommendation:** Standardize on **`dot.namespace.mjs`** for any *engine/domain split* (siblings under one umbrella) and reserve `dash-namespace.mjs` for *standalone features* that happen to share a topic word.

Reason: dot-namespacing visually groups siblings (`ai.healing`, `ai.business`, `ai.dashboard`) and survives alphabetical sort; dashes scatter them.

This is a **going-forward** rule. We are not renaming the existing 140 files in this refactor.

---

## Family Inventory

### `ai.*` — Dual-Engine + Admin (4 files)

| File | Role | Verdict |
|---|---|---|
| `ai.mjs` | Main `/api/ai/chat` transport. Imports `ai/orchestrator.mjs`. **Verified clean** — no `openai` import, no inline LLM calls. | Keep. |
| `ai.healing.mjs` | Healing-engine routes (admin prompt registry, audit). | Keep. |
| `ai.business.mjs` | Business-engine routes. | Keep. |
| `ai-dashboard.mjs` | Admin observability surface. | Keep. *(Nit: rename to `ai.dashboard.mjs` for consistency — defer.)* |

**Verdict:** legit separation per the dual-engine architecture documented in `replit.md`. **Not** a duplicate family.

### `admin.*` — Admin Surfaces (5 files)

`admin.mjs`, `adminBilling.mjs`, `admin-billing` is **camelCase** — outlier. The rest are dash-namespaced: `admin-publishing.mjs`, `admin-security.mjs`, `admin-social-studio.mjs`.

**Verdict:** distinct admin surfaces. *Nit:* rename `adminBilling.mjs` → `admin.billing.mjs` (or `admin-billing.mjs`) to match siblings. Defer.

### `wisdom.*` — Wisdom Family (4 files)

`wisdom.mjs`, `wisdom-engine.mjs`, `wisdom-synthesis.mjs`, `wisdom-traditions.mjs`.

**Verdict:** four distinct domain endpoints; not duplicates per se. *Smell:* unclear hierarchy between `wisdom.mjs` (parent?) and the three dash-suffixed children. Recommend a quick audit of overlapping routes (e.g. do `wisdom.mjs` and `wisdom-engine.mjs` both expose `/api/wisdom/*`?). **Out of scope** for this refactor.

### `healing.*` — Healing Family (4 files)

`healing.mjs`, `healing-modalities.mjs`, `healing-tools.mjs`, `healing-intelligence.mjs`.

**Verdict:** same shape as wisdom family. Same recommendation: audit for path collisions, defer rename.

### `content.*` — Content Family (4 files)

`content.mjs`, `content-generator.mjs`, `content-intelligence.mjs`, `content-studio.mjs`.

**Verdict:** four distinct content surfaces. Defer.

### `social.*` — Social Family (4 files)

Includes `admin-social-studio.mjs` plus three others picked up by the family count. Verify no collision with `community.mjs` and `feed.mjs`. Defer.

### `cognitive.*` — Cognitive Family (3 files)

`cognitive-enhancement.mjs`, `cognitive-lab.mjs`, `cognitive-mastery.mjs`.

**Verdict:** likely distinct features. Defer.

### Other 2-file families

`narrative.mjs` / `narrative-drafts.mjs`, `meaning.mjs` / `meaning-future.mjs`, `analytics.mjs` / `analytics-events.mjs`, `emotional-mastery.mjs` / `emotional-resilience.mjs`, `self-*` (2), `life-design.mjs` / `life-purpose.mjs`.

**Verdict:** distinct features. No action.

---

## Service Layer Smell (Out of Scope)

`server/services/` contains **four** ai-named files:

- `aiClient.mjs`
- `aiService.mjs`
- `aiHandler.mjs`
- `aiChatService.mjs`

This looks like overlapping orchestration paths. Three of them likely predate `server/ai/orchestrator.mjs`. **Strongly recommend** a follow-up audit to determine which are still wired and whether any can be retired in favor of a single `services/aiOrchestratorService.mjs` thin facade. **Not** part of this ownership refactor — would touch `>10` importers and risk live AI behavior.

---

## Naming Outliers (single-file, low-priority renames)

| Current | Suggested | Why |
|---|---|---|
| `adminBilling.mjs` | `admin-billing.mjs` or `admin.billing.mjs` | only camelCase admin file |
| `accountActions.mjs` | `account-actions.mjs` or `account.actions.mjs` | mixed style |
| `userSettings.mjs` | `user-settings.mjs` or `user.settings.mjs` | mixed style |
| `metricsSummary.mjs` | `metrics-summary.mjs` or `metrics.summary.mjs` | mixed style |
| `integrationHealth.mjs` | `integration-health.mjs` | mixed style |
| `deploymentReadiness.mjs` | `deployment-readiness.mjs` | mixed style |
| `ai-dashboard.mjs` | `ai.dashboard.mjs` | join the ai.* family |

**All deferred.** Renaming routes touches `server/index.mjs` import lines but is otherwise mechanical.

---

## Cross-Layer Name Collisions

These are **NOT** ownership violations — different layers serving different responsibilities — but worth knowing:

| Name | Locations | Status |
|---|---|---|
| `email.mjs` | `routes/` + `utils/` | Routes is HTTP; utils is sender. Both legit. |
| `metrics.mjs` | `utils/` + `routes/` | After Phase 3 move, `utils/` version moves to `logging/` — collision resolves. |
| `validation.mjs` | `utils/` + `validation/` (subdir) | Subdir was added later; `utils/validation.mjs` is the canonical helper. Out of scope. |
| `memory.mjs` | `ai/` + `memory/` (subdir) | `ai/memory.mjs` is the wired short-term memory; the top-level `memory/` subdir is unrelated. Out of scope. |

---

## Summary

- **Zero true route-family duplicates** — every multi-file family is distinct features under a topic.
- **One real architectural smell** — the four ai-named services in `server/services/`. Flagged for a future dedicated audit.
- **Naming style drift** — six camelCase outliers. All cosmetic; defer.
- **Convention going forward**: `dot.namespace.mjs` for sibling engines under one umbrella; `dash-namespace.mjs` for standalone features.
