// server/ai/v2/agentOrchestrator.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1: Agent orchestrator.
//
// Spec ref: Part II §2.5 (Synthetic Employee Registry), CAD-1 (Hard
// Safety Floor), CAD-3 (Compute-Tier Crisis Priority), CAD-4 (Radical
// Transparency).
//
// Design contract:
//   • This is an ADDITIVE v2 orchestrator. The locked v1 chat
//     orchestrator (server/ai/orchestrator.mjs) is NEVER modified or
//     replaced. v2 runs as a routing/audit layer the admin surface can
//     invoke for shadow-mode testing of registered synthetic employees.
//   • All locked safety modules are imported READ-ONLY:
//       - detectCrisis() / CRISIS_RESPONSE  (server/ai/safety/crisis.mjs)
//       - buildResponsePolicy()             (server/ai/responsePolicy.mjs)
//   • Pure deterministic state machine — no LLM call, no external API.
//     LLM-backed deliberation is deferred to Prompt 3.2+ where the
//     awareness pipeline produces structured signals first.
//   • Every invocation produces an append-only row in agent_decisions
//     (CAD-4 Radical Transparency).
//   • CAD-1 kill-switch and lifecycle status are checked structurally
//     before any work happens — never bypassable.
//
// State machine (in order):
//   1. validate           — required fields present
//   2. crisis_check       — short-circuit to CRISIS_RESPONSE if triggered
//   3. agent_selection    — by agentKey or intent → division mapping
//   4. lifecycle_check    — agent.status must be shadow|active
//   5. kill_switch_check  — CAD-1 hard safety floor
//   6. policy_gate        — buildResponsePolicy() snapshot
//   7. memory_recall      — warm tier (agent_decisions) for context
//   8. deliberation       — produce routing recommendation (no LLM)
//   9. audit              — append row to agent_decisions

import { db, schema } from "../../db.mjs";
import { and, eq, inArray } from "drizzle-orm";
import { detectCrisis, CRISIS_RESPONSE } from "../safety/crisis.mjs";
import { buildResponsePolicy } from "../responsePolicy.mjs";
import { logEvent } from "../aiTelemetry.mjs";
import {
  rememberHot,
  recallHot,
  recallWarm,
  recallCold,
  memoryStats,
} from "./agentMemory.mjs";

const { agentRegistry, agentDecisions } = schema;

/* ---------- intent → division routing table ---------- */
const INTENT_DIVISION = {
  crisis: "safety",
  safety: "safety",
  protocol: "clinical",
  exercise: "clinical",
  module: "clinical",
  reflection: "clinical",
  education: "research",
  discernment: "research",
  lesson: "research",
  ops: "operations",
  monitor: "operations",
  system: "operations",
};

function divisionForIntent(intent) {
  const key = String(intent || "").toLowerCase().trim();
  return INTENT_DIVISION[key] || "clinical";
}

/* ---------- input sanitation ---------- */
const MAX_INPUT_CHARS = 4000;

function digestInput({ intent, input, contextHints }) {
  const text = typeof input === "string" ? input : String(input ?? "");
  return {
    intent: String(intent || "").slice(0, 60),
    inputLen: text.length,
    inputPreviewHash: hashFNV(text),
    hasContextHints: !!(contextHints && typeof contextHints === "object"),
  };
}

// Deterministic non-cryptographic hash for audit reference (no PII echo).
function hashFNV(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ("00000000" + (h >>> 0).toString(16)).slice(-8);
}

/* ---------- system sentinel agent (audit attribution when no agent
 *            could be selected) ---------- */
const SYSTEM_SENTINEL_KEY = "system-orchestrator-sentinel";
let sentinelCache = null;

async function ensureSentinel() {
  if (sentinelCache) return sentinelCache;
  const existing = await db
    .select()
    .from(agentRegistry)
    .where(eq(agentRegistry.agentKey, SYSTEM_SENTINEL_KEY))
    .limit(1);
  if (existing[0]) {
    sentinelCache = existing[0];
    return sentinelCache;
  }
  const [created] = await db
    .insert(agentRegistry)
    .values({
      agentKey: SYSTEM_SENTINEL_KEY,
      agentRole: "Orchestrator system sentinel",
      division: "operations",
      personaConfig: {
        purpose: "Attribution target for v2 orchestrator decisions when no domain agent matches.",
        immutable: true,
      },
      status: "active",
      version: 1,
      budgetTokensDaily: 0,
      killSwitch: false,
      notes: "Auto-provisioned by v2 orchestrator. Do not delete.",
    })
    .returning();
  sentinelCache = created;
  return sentinelCache;
}

/* ---------- agent selection ---------- */
async function selectAgent({ agentKey, intent }) {
  if (agentKey) {
    const rows = await db
      .select()
      .from(agentRegistry)
      .where(eq(agentRegistry.agentKey, String(agentKey)))
      .limit(1);
    return {
      candidates: rows.map((r) => ({ key: r.agentKey, role: r.agentRole, division: r.division, status: r.status })),
      chosen: rows[0] || null,
      strategy: "explicit-key",
    };
  }
  const division = divisionForIntent(intent);
  const rows = await db
    .select()
    .from(agentRegistry)
    .where(and(eq(agentRegistry.division, division), inArray(agentRegistry.status, ["active", "shadow"])));
  // Prefer "active" over "shadow"; tiebreak by lower version number (oldest stable first)
  const sorted = rows.slice().sort((a, b) => {
    if (a.status !== b.status) return a.status === "active" ? -1 : 1;
    return (a.version || 0) - (b.version || 0);
  });
  return {
    candidates: sorted.map((r) => ({ key: r.agentKey, role: r.agentRole, division: r.division, status: r.status })),
    chosen: sorted[0] || null,
    strategy: `intent→division:${division}`,
  };
}

/* ---------- main entrypoint ---------- */
export async function invokeAgent({
  agentKey = null,
  intent = "general",
  input = "",
  userId = null,
  guestId = null,
  contextHints = null,
} = {}) {
  const startedAt = Date.now();
  const trace = { steps: [], priorityEscalated: false };
  const inputDigest = digestInput({ intent, input, contextHints });

  // 1. validate
  if (typeof input !== "string" || input.length === 0) {
    trace.steps.push({ stage: "validate", ok: false, reason: "empty_input" });
    return finalize({
      agentRow: null,
      trace,
      startedAt,
      decisionType: "validation_failed",
      inputDigest,
      outcome: { action: "rejected", reason: "empty_input" },
      confidence: 100,
    });
  }
  if (input.length > MAX_INPUT_CHARS) {
    trace.steps.push({ stage: "validate", ok: false, reason: "input_too_long", maxChars: MAX_INPUT_CHARS });
    return finalize({
      agentRow: null,
      trace,
      startedAt,
      decisionType: "validation_failed",
      inputDigest,
      outcome: { action: "rejected", reason: "input_too_long" },
      confidence: 100,
    });
  }
  trace.steps.push({ stage: "validate", ok: true });

  // 2. crisis_check (CAD-3 priority escalation)
  const isCrisis = detectCrisis(input);
  trace.steps.push({ stage: "crisis_check", triggered: isCrisis });
  if (isCrisis) {
    trace.priorityEscalated = true;
    logEvent({
      type: "crisis_response_emitted",
      guestId: guestId || null,
      metadata: { source: "v2.orchestrator", intent: String(intent).slice(0, 40) },
    });
    return finalize({
      agentRow: null,
      trace,
      startedAt,
      decisionType: "crisis_short_circuit",
      inputDigest,
      outcome: {
        action: "route_to_crisis",
        message: CRISIS_RESPONSE.reply,
        resources: CRISIS_RESPONSE.resources,
        crisisRoute: "/crisis",
      },
      confidence: 100,
    });
  }

  // 3. agent_selection
  const sel = await selectAgent({ agentKey, intent });
  trace.steps.push({
    stage: "agent_selection",
    strategy: sel.strategy,
    candidateCount: sel.candidates.length,
    candidates: sel.candidates.slice(0, 5),
    chosen: sel.chosen ? { key: sel.chosen.agentKey, status: sel.chosen.status } : null,
  });

  if (!sel.chosen) {
    return finalize({
      agentRow: null,
      trace,
      startedAt,
      decisionType: "no_agent_available",
      inputDigest,
      outcome: { action: "fallback_safe", reason: "no_eligible_agent_for_intent" },
      confidence: 100,
    });
  }

  // 4. lifecycle_check (must be shadow or active; explicit-key may select draft/paused/retired)
  const lifecycleOk = ["active", "shadow"].includes(sel.chosen.status);
  trace.steps.push({ stage: "lifecycle_check", status: sel.chosen.status, ok: lifecycleOk });
  if (!lifecycleOk) {
    return finalize({
      agentRow: sel.chosen,
      trace,
      startedAt,
      decisionType: "lifecycle_blocked",
      inputDigest,
      outcome: { action: "fallback_safe", reason: `agent_status_${sel.chosen.status}` },
      confidence: 100,
    });
  }

  // 5. kill_switch_check (CAD-1 hard safety floor)
  if (sel.chosen.killSwitch === true) {
    trace.steps.push({ stage: "kill_switch_check", killed: true });
    return finalize({
      agentRow: sel.chosen,
      trace,
      startedAt,
      decisionType: "kill_switch_engaged",
      inputDigest,
      outcome: { action: "blocked_by_kill_switch", reason: "CAD-1: agent kill_switch=true" },
      confidence: 100,
    });
  }
  trace.steps.push({ stage: "kill_switch_check", killed: false });

  // 6. policy_gate (read-only consult to locked responsePolicy)
  let policySnapshot = null;
  try {
    const built = buildResponsePolicy({ risk: "low" });
    policySnapshot = {
      tone: built?.tone || null,
      style: built?.style || null,
      guardrails: Array.isArray(built?.guardrails) ? built.guardrails.length : 0,
    };
    trace.steps.push({ stage: "policy_gate", ok: true, snapshot: policySnapshot });
  } catch (err) {
    trace.steps.push({ stage: "policy_gate", ok: false, error: err?.message || "policy_unavailable" });
  }

  // 7. memory_recall (warm tier)
  const warm = await recallWarm(sel.chosen.id, 3);
  const hotItems = recallHot(sel.chosen.id, userId || guestId || "anon", 3);
  trace.steps.push({
    stage: "memory_recall",
    hotCount: hotItems.length,
    warmCount: warm.length,
    cold: recallCold(),
  });

  // 8. deliberation (deterministic — actual LLM deliberation is Prompt 3.2+)
  const recommendation = {
    action: "agent_recommendation",
    agentKey: sel.chosen.agentKey,
    division: sel.chosen.division,
    nextStep:
      "Hand off to awareness pipeline (Prompt 3.2) for signal extraction, then domain protocol (Prompt 3.3).",
    note: "v2 orchestrator does not generate user-facing prose. The locked v1 chat orchestrator remains the sole producer of conversational replies.",
  };
  trace.steps.push({ stage: "deliberation", action: recommendation.action });

  rememberHot(sel.chosen.id, userId || guestId || "anon", {
    intent,
    inputHash: inputDigest.inputPreviewHash,
    outcomeAction: recommendation.action,
  });

  return finalize({
    agentRow: sel.chosen,
    trace,
    startedAt,
    decisionType: "agent_routing",
    inputDigest,
    outcome: recommendation,
    confidence: 80,
  });
}

/* ---------- audit writer ---------- */
async function finalize({ agentRow, trace, startedAt, decisionType, inputDigest, outcome, confidence }) {
  const latencyMs = Date.now() - startedAt;
  trace.latencyMs = latencyMs;

  let attributedAgentId = agentRow?.id || null;
  if (!attributedAgentId) {
    try {
      const sentinel = await ensureSentinel();
      attributedAgentId = sentinel?.id || null;
    } catch {
      // If sentinel can't be created, skip the audit row rather than throw.
    }
  }

  let decisionId = null;
  if (attributedAgentId) {
    try {
      const [row] = await db
        .insert(agentDecisions)
        .values({
          agentId: attributedAgentId,
          decisionType,
          inputDigest,
          reasoning: { trace },
          outcome,
          priorityEscalated: !!trace.priorityEscalated,
          confidence: typeof confidence === "number" ? confidence : null,
          reviewStatus: "unreviewed",
        })
        .returning({ id: agentDecisions.id });
      decisionId = row?.id || null;
    } catch (err) {
      // Audit failure must not break the orchestrator response.
      trace.steps.push({ stage: "audit", ok: false, error: err?.message || "insert_failed" });
    }
  }

  return {
    decisionId,
    agentId: attributedAgentId,
    selectedAgent: agentRow
      ? { id: agentRow.id, key: agentRow.agentKey, role: agentRow.agentRole, division: agentRow.division, status: agentRow.status }
      : null,
    decisionType,
    outcome,
    trace,
  };
}

export function orchestratorMemoryStats() {
  return memoryStats();
}
