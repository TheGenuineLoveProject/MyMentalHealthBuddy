# Advisor Audit Reconciliation

> **Source:** External advisor message (archived 2026-05-10: `.archive/attached_assets_2026-05-10/Pasted-You-re-asking-for-the-correct-move-at-the-highest-level_1776914847922.txt`)
> **Date:** 2026-04-23
> **Status:** Each advisor finding cross-checked against the actual file contents. Where the advisor's claim is grounded, action is recommended. Where it is not, the file evidence is recorded so we don't lose the reasoning.

## Governing Constraints (advisor's own rules — these win conflicts)

1. **DO NOT BREAK WORKING CODE**
2. **🚫 DO NOT TOUCH:** `orchestrator`, `provider`, `memory`, `profile`, `tools`, `telemetry`
3. *"Move logic (not files yet)"* — Step 3
4. Smallest-safe migrations only

When later steps in the advisor's message ask for actions that would violate constraints 1 or 2, **constraints 1 and 2 win.** Those merges/deletes need explicit approval and a separate change window.

---

## Reconciliation Table

### Claim 1 — `responsePolicy.mjs` and `providerPolicy.mjs` are duplicates

**Verdict:** ❌ **FALSE.** Different concerns, orthogonal call sites.

| File | Lines | Exports | Purpose | Importers |
|---|---|---|---|---|
| `responsePolicy.mjs` | 108 | `buildResponsePolicy({risk, profile, scoring, modules})`, `renderPolicySystemMessage(policy)` | Builds the **per-request style/intervention contract** (tone, verbosity, structure, interventions, constraints) | `orchestrator.mjs` |
| `providerPolicy.mjs` | 25 | `getProviderPolicy()`, `canUseLiveAI(policy)` | Provider-side **feature flag / kill-switch** ("is the AI provider allowed to fire on this request?") | `orchestrator.mjs`, `services/aiChatService.mjs` |

Merging would conflate "what tone should this reply have" with "is the AI provider allowed to fire" — those are independent decisions made at different points in the request lifecycle.

**Action:** Do NOT merge. Document the distinction here. Consider a future *rename* of `providerPolicy.mjs` → `providerGate.mjs` to remove the surface-level naming collision (deferred — touches 2 importers).

### Claim 2 — `modules.mjs` + `moduleRouter.mjs` + `therapyFlows.mjs` overlap

**Verdict:** ❌ **FALSE on overlap.** ⚠️ **TRUE on naming smell.** ✅ **NEW finding: `therapyFlows.mjs` is dead code.**

| File | Lines | Export | Importers |
|---|---|---|---|
| `modules.mjs` | 44 | `MODULES` (definition table) | `moduleRouter.mjs` only |
| `moduleRouter.mjs` | 168 | `MODULE_REGISTRY` (different name from `MODULES`!), `selectModules`, `resolveModules` | `responsePolicy`, `tools`, `orchestrator`, `provider` |
| `therapyFlows.mjs` | 23 | `therapyFlows` const | **0 — dead code** |

Three concerns, not three duplicates. `modules.mjs` is consumed only by `moduleRouter.mjs`, so they're a coherent pair (data + selection).

**Naming smell:** `MODULES` (in `modules.mjs`) vs `MODULE_REGISTRY` (in `moduleRouter.mjs`) — confusing. Worth renaming one for clarity in a future pass.

**Actions:**
- Rename `MODULES` → `MODULE_DEFINITIONS` (or fold the file into `moduleRouter.mjs` since it's the only importer). **Deferred** — touches the orchestrator graph.
- `therapyFlows.mjs` is **dead** — promote to Phase 1 candidate (safe to move or delete; non-destructive recommendation = move to a `_dead/` folder or leave noted).

### Claim 3 — `normalizeResponse.mjs` and `utils/response.mjs` are duplicates

**Verdict:** ❌ **FALSE.** Different layers entirely.

| File | Export | Purpose |
|---|---|---|
| `ai/normalizeResponse.mjs` | `normalizeAIResponse(result)` | Shapes an AI orchestration result into the locked response contract |
| `utils/response.mjs` | `ok(res, data)`, `fail`, `success`, `created`, `serverError`, `unauthorized`, `badRequest`, `failWithCode`, `sendError` | HTTP response helpers (write to `res`) |

Different concerns at different layers. Naming similarity is coincidence.

**Action:** Do NOT merge. No-op.

### Claim 4 — `aiClient.mjs` (utils) vs `openaiClient.mjs` (ai) provider boundary unclear

**Verdict:** ✅ **TRUE — but high blast radius.** Already captured as Phase 5 in `OWNERSHIP_MATRIX.md`.

`utils/aiClient.mjs` is 258 lines with **10 importers** (4 routes + 4 services + health + reflection). The advisor's "DELETE or MERGE" is correct in principle but cannot be done in a smallest-safe single move. Phase 5 plan already covers this; needs its own change window with importer updates.

**Action:** No change to the existing Phase 5 deferral.

### Claim 5 — `aiTelemetry.mjs` vs platform telemetry split

**Verdict:** ✅ **RESOLVED previously.** `aiTelemetry.mjs` correctly lives in `server/ai/` per the second-pass advisor correction. No further action.

### Claim 6 — Route explosion (50+ files, including `cognitive-lab`, `healing-intelligence`, `metacognition`, `wisdom`, `trauma-healing-protocols`)

**Verdict:** ✅ **TRUE on existence,** ⚠️ **NUANCED on action.**

Sample sizes (each individually wired in `server/index.mjs`):

| File | Lines |
|---|---|
| `routes/therapy.mjs` | 284 |
| `routes/healing-tools.mjs` | 181 |
| `routes/wisdom-engine.mjs` | 276 |
| `routes/metacognition.mjs` | 193 |
| `routes/cognitive-lab.mjs` | 151 |
| `routes/trauma-healing-protocols.mjs` | 410 |
| `routes/transformation-engine.mjs` | 110 |

Each is an HTTP boundary that **does** terminate at `res.json()`. They are technically routes. The advisor's framing — "these are not routes, they are modules / content domains / tools / services" — describes their *conceptual* shape, not their *technical* shape. Collapsing seven 100–410-line route files into a single `content.mjs` would be a large refactor with non-trivial regression surface.

**Action — recommended split:**

- **Document** the canonical 8-route target in `ROUTE_FAMILIES.md` as the aspirational state (already done in the prior pass; expanded this pass).
- **Defer** the actual collapse to a later, dedicated migration. Each route file's logic needs to be classified (HTTP-only? business logic? AI orchestration?) before a safe move.
- **Do not** auto-collapse 50+ files in one pass.

### Claim 7 — Step 3: `touch server/routes/content.mjs` and "Move logic (not files yet)"

**Verdict:** ✅ **No-op needed.** `server/routes/content.mjs` already exists at 276 lines.

**Action:** None.

### Claim 8 — Steps 4–6: merge policies, kill duplicates, rename

**Verdict:** ❌ **BLOCKED by advisor's own freeze rule.** Step 4 ("merge `responsePolicy` into `providerPolicy`") would touch `provider.mjs`'s policy injection path; Step 2 explicitly forbids touching `provider`. Step 5 ("kill `aiClient.mjs`") has 10 importers. Step 6 same as 4.

**Action:** Do not execute. Surface to user as decision points.

---

## Net New Action Items (truly safe)

| # | Action | Importers affected | Risk |
|---|---|---|---|
| A | Add `therapyFlows.mjs` to Phase 1 dead-code list (was missed in prior audit) | 0 | Zero |
| B | Document this reconciliation (you're reading it) | 0 | Zero |
| C | Update `OWNERSHIP_MATRIX.md` to reflect false-duplicate findings | 0 | Zero |
| D | Update `ROUTE_FAMILIES.md` with the canonical 8-route target as aspirational | 0 | Zero |

## Items REQUIRING USER DECISION before any code change

| # | Decision | Why blocked |
|---|---|---|
| 1 | Execute Phase 1 (3 dead files: `safetyCheck`, `aiGuardrails`, `therapyFlows`) | Awaiting "go" |
| 2 | Rename `providerPolicy.mjs` → `providerGate.mjs` to remove naming collision with `responsePolicy.mjs` | Touches 2 importers; needs explicit approval |
| 3 | Fold `modules.mjs` into `moduleRouter.mjs` (single coherent file) | Touches the orchestrator graph; needs explicit approval |
| 4 | Phase 5 — relocate `utils/aiClient.mjs` to `ai/aiClient.mjs` and reconcile with `openaiClient.mjs` | 10 importers; dedicated change window |
| 5 | Begin route consolidation (collapse 7+ "domain-leakage" routes into `content.mjs` / `services/`) | Multi-day refactor; each route needs per-file classification first |

---

## Verification (re-run after every Phase)

Identical to `OWNERSHIP_MATRIX.md` §Verification Checklist:

```bash
# Health + readiness
curl -s -o /dev/null -w "%{http_code}\n" http://0.0.0.0:5000/health   # 200
curl -s -o /dev/null -w "%{http_code}\n" http://0.0.0.0:5000/ready    # 200

# AI E2E with tool payload assertion
curl -s -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" -H "x-guest-id: reconcile_$$" \
  -d '{"message":"I feel overwhelmed"}' \
| jq '{outcome, modules: .response.modules, toolId: .response.tool.tool.id}'
# expect: success, modules contains "self_regulation" or similar, toolId="overload_reset" (or per current routing)

# Crisis short-circuit
curl -s -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" -H "x-guest-id: crisis_$$" \
  -d '{"message":"I want to hurt myself"}' \
| jq '{outcome, hasTool: (.response.tool != null)}'
# expect: outcome="crisis", hasTool=false

# Telemetry shape
tail -n 3 logs/ai-telemetry.jsonl | jq -c '{success, toolId, moduleCount, latencyMs}'

# Memory dirs intact
ls data/memory data/memory-summary data/memory-profile | wc -l
```
