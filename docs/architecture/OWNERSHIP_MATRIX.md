# Ownership Matrix

> Single source of truth for "where does this file belong?"
> Companion to `CANONICAL_FILE_TREE.md`. Use this when reviewing PRs that add or move files.

## Layers

| Layer | Responsibility | MAY import from | MUST NOT do |
|---|---|---|---|
| `routes/` | HTTP transport — bind URL → handler, parse req, send res | `services/`, `middleware/`, `engine/`, `ai/orchestrator.mjs`, `utils/`, `logging/` | call OpenAI SDK directly; embed prompt logic; embed model selection |
| `services/` | Use-case orchestration between routes ↔ ai/db | `ai/`, `db/`, `utils/`, `logging/` | own HTTP req/res; bypass orchestrator for ai-domain calls |
| `ai/` | AI decision, execution, intelligence | `utils/`, `logging/` | import `express`; touch `req`/`res`/`next`; reach into `routes/` |
| `ai/safety/` | Safety primitives (crisis, guard, sanitize, policy) | `utils/`, `logging/` | block on I/O; mutate global state |
| `engine/` | Domain facades that wrap ai/safety stacks | `ai/`, `utils/`, `logging/` | own HTTP; own LLM execution |
| `logging/` | Observability sinks (write-side) | `utils/` | import from `ai/` or `routes/` (cycle risk) |
| `middleware/` | Express middleware chain | `utils/`, `logging/` | own business logic |
| `utils/` | Stateless infra helpers — no domain knowledge | leaf only | import from `ai/`, `routes/`, `services/`, `logging/` |

## Current Violations (audit dated 2026-04-23)

### Severe — unambiguous ownership breach

| File | Current | Canonical home | Importers | Risk |
|---|---|---|---|---|
| `aiClient.mjs` (258 lines, imports `openai`) | `server/utils/` | `server/ai/` | **10** (4 routes + 4 services + health + reflection) | High touch — Phase 2 |
| `safetyCheck.mjs` (124 lines) | `server/utils/` | `server/ai/safety/` | **0** (dead) | Zero — safe to move now |
| `aiGuardrails.mjs` (176 lines) | `server/utils/` | `server/ai/safety/` | **0** (dead) | Zero — safe to move now |

### Important — sink in wrong layer

| File | Current | Canonical home | Importers | Risk |
|---|---|---|---|---|
| `auditLogger.mjs` | `server/utils/` | `server/logging/` | 1 | Low |
| `metrics.mjs` | `server/utils/` | `server/logging/` | 6 | Moderate |

**Correction (2026-04-23, second pass):** `server/ai/aiTelemetry.mjs` was previously listed for migration to `server/logging/`. **Reversed.** It STAYS in `server/ai/`. Rationale: it measures AI-call shape (model selection, tool usage, module counts, token usage, latency, AI-path outcomes) and belongs co-located with `orchestrator.mjs`, `provider.mjs`, and `providerPolicy.mjs`. The `logging/` directory is for platform-wide sinks (`logger`, `aiLogger`, `safetyLogger`, `auditLogger`); domain-specific telemetry stays with its domain.

### Naming inconsistency / partial duplicate

| File | Current | Recommendation | Importers | Risk |
|---|---|---|---|---|
| `responses.mjs` (re-exports `response.mjs` + adds `forbidden`/`notFound`) | `server/utils/` | Fold both into `response.mjs`, delete `responses.mjs` | 2 | Low |

### Subjective — leave for now

| File | Current | Why we are leaving it |
|---|---|---|
| `utils/logger.mjs` | utils | Base console wrapper; truly infra-level. Could move to `logging/` later but no behavior win. |
| `utils/logRedaction.mjs` | utils | Pure helper; used by both logger and ai paths; moving creates more import noise than it solves. |
| `utils/email.mjs` vs `routes/email.mjs` | both | Different layers (sender util vs HTTP handler). Naming overlap is fine. |
| `ai/openaiClient.mjs` (4 lines) vs `utils/aiClient.mjs` (258 lines) | both | After Phase 2 move, both live in `ai/`. Then a follow-up can merge or rename one. Don't touch in this pass. |

### Risky — needs deeper audit before any move

| File | Concern |
|---|---|
| `routes/mirror.mjs` | Caught by AI-logic grep. Need to confirm whether it embeds prompt logic or just delegates. |
| `routes/admin-social-studio.mjs` | Same as above. |
| `services/aiClient.mjs` + `services/aiService.mjs` + `services/aiHandler.mjs` + `services/aiChatService.mjs` | Four ai-named services — possible duplicate orchestration paths. Out of scope for this refactor; opening it would touch >10 importers. |

## Canonical Imports Cheat-Sheet

```js
// In a route handler:
import { orchestrate } from '../ai/orchestrator.mjs';        // ✓ allowed
import OpenAI from 'openai';                                  // ✗ forbidden — go through orchestrator
import { provider } from '../ai/provider.mjs';                // ✗ forbidden — orchestrator is the seam

// In an ai/ module:
import express from 'express';                                // ✗ forbidden
import { writeAiTelemetry } from '../logging/aiTelemetry.mjs';// ✓ allowed (after move)
import { acquireLock } from '../utils/asyncLock.mjs';         // ✓ allowed

// In utils/:
import { something } from '../ai/anything.mjs';               // ✗ forbidden — utils is leaf
import { somethingElse } from '../logging/anything.mjs';      // ✗ forbidden
```

## Migration Plan (smallest-safe sequence)

> All moves preserve git history via `git mv` (run by user; see `MIGRATION_SEQUENCE` below).
> Each step is independently revertable. No file is deleted in Phase 1.

### Phase 1 — zero-importer moves (no behavior change possible)

1. `mv server/utils/safetyCheck.mjs server/ai/safety/safetyCheck.mjs` — 0 importers, dead code
2. `mv server/utils/aiGuardrails.mjs server/ai/safety/aiGuardrails.mjs` — 0 importers, dead code

> Note: a third zero-importer move (`ai/aiTelemetry.mjs → logging/`) was removed from Phase 1 after the ownership clarification — see correction box above. `aiTelemetry.mjs` stays in `server/ai/`.

**Verify after Phase 1:** `npm run dev` boots; `/health`, `/ready`, AI E2E (`POST /api/ai/chat` with `"I feel anxious"`) all return same shape with `tool: box_breathing`.

### Phase 2 — single-importer move

3. `mv server/utils/auditLogger.mjs server/logging/auditLogger.mjs`
4. Update the 1 importer's path.

**Verify:** repeat Phase 1 verify + `tail logs/audit*` shows new entries.

### Phase 3 — six-importer move

5. `mv server/utils/metrics.mjs server/logging/metrics.mjs`
6. Update 6 importers (mechanical sed-friendly path swap).

**Verify:** repeat verify + telemetry tail still populates `latencyMs`.

### Phase 4 — fold partial duplicate

7. Move `forbidden` and `notFound` exports from `utils/responses.mjs` into `utils/response.mjs`.
8. Update the 2 importers of `responses.mjs` to import from `response.mjs`.
9. Delete `utils/responses.mjs`.

**Verify:** `grep -r "from.*utils/responses" server/` returns empty.

### Phase 5 — heavy move (deferred, requires its own change window)

10. `mv server/utils/aiClient.mjs server/ai/aiClient.mjs`
11. Update 10 importers across routes + services + health.
12. Reconcile with the existing 4-line `server/ai/openaiClient.mjs` (merge or formally separate).

**Verify:** full E2E + admin endpoints + therapy + reflection routes all return prior shapes.

## Rollback Plan

Each phase is its own commit. Rollback = `git revert <commit-sha>`. Because Phase 1–3 only move files (no signature changes), reverting a single phase will not corrupt downstream phases that ran later, *provided* the later phases imported from the new location — which they will, since each phase's importers are updated atomically. Worst-case rollback order: revert in reverse phase order.

For non-git rollback: every move is `mv A B` with importer-path swap. Reverse is `mv B A` with importer-path swap.

## Verification Checklist (run after every phase)

```bash
# 1. Boot
npm run dev   # or restart workflow

# 2. Health
curl -s -o /dev/null -w "%{http_code}\n" http://0.0.0.0:5000/health   # 200
curl -s -o /dev/null -w "%{http_code}\n" http://0.0.0.0:5000/ready    # 200

# 3. Orchestrator HTTP-isolation invariant
grep -nE "\b(req|res|next)\b" server/ai/orchestrator.mjs   # only doc-comment hits

# 4. End-to-end AI (must return tool payload)
curl -s -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" -H "x-guest-id: refactorcheck" \
  -d '{"message":"I feel anxious"}' \
| jq '{outcome, modules: .response.modules, toolId: .response.tool.tool.id}'
# expect: outcome=success, modules=["anxiety", ...], toolId="box_breathing"

# 5. Crisis short-circuit unchanged
curl -s -X POST http://0.0.0.0:5000/api/ai/chat \
  -H "Content-Type: application/json" -H "x-guest-id: crisischeck" \
  -d '{"message":"I want to end my life"}' \
| jq '{outcome, hasTool: (.response.tool != null)}'
# expect: outcome="crisis", hasTool=false

# 6. Telemetry parity
tail -n 3 logs/ai-telemetry.jsonl | jq -c '{success, toolId, moduleCount}'

# 7. Memory + profile dirs intact
ls data/memory data/memory-summary data/memory-profile | wc -l
```
