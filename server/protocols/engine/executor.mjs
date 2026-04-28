// server/protocols/engine/executor.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.3: Protocol Execution Engine.
//
// A deterministic state-machine walker for therapeutic protocol DAGs.
// Locked safety primitives are imported READ-ONLY:
//   • detectCrisis from server/ai/safety/crisis.mjs (the only crisis judge)
//   • The locked v1 chat orchestrator is NEVER called from here. This engine
//     produces protocol-state transitions and content delivery only.
//
// State machine:
//   ACTIVE   → PAUSED     (user-initiated)
//   ACTIVE   → COMPLETED  (terminal node has no outgoing transitions)
//   ACTIVE   → ABANDONED  (no activity for >7 days)
//   ACTIVE   → ESCALATED  (crisis detected OR human_required protocol entered)
//
// Eight node-type handlers:
//   PSYCHOED, SKILL, EXPERIENTIAL, ASSESSMENT, GROUNDING, HOMEWORK,
//   CRISIS_CHECK, BRANCH

import { eq, and, sql } from "drizzle-orm";
import { db, schema } from "../../db.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "../../ai/safety/crisis.mjs";
import { logEvent } from "../../ai/aiTelemetry.mjs";
import { withSpan } from "../../observability/spans.mjs";
import { alertPHQ9EscalationFailure } from "../../observability/safetyAlerts.mjs";

const { protocolRegistry, protocolSessions, outcomeMeasures } = schema;

const STATUS = Object.freeze({
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
  ESCALATED: "escalated",
});

const ABANDON_AFTER_DAYS = 7;
const NODE_TYPES = new Set([
  "PSYCHOED", "SKILL", "EXPERIENTIAL", "ASSESSMENT",
  "GROUNDING", "HOMEWORK", "CRISIS_CHECK", "BRANCH",
]);

/* =====================================================================
 * Outcome-measure scoring tables (PHQ-9 / GAD-7).
 *
 * All scoring is psychometrically standard for these public-domain
 * instruments. Severity bands are educational; they NEVER constitute a
 * diagnosis. Item 9 of PHQ-9 is treated as a mandatory flag → ESCALATE.
 * ===================================================================== */
const PHQ9_BANDS = [
  { max: 4, severity: "minimal" },
  { max: 9, severity: "mild" },
  { max: 14, severity: "moderate" },
  { max: 19, severity: "moderately_severe" },
  { max: 27, severity: "severe" },
];
const GAD7_BANDS = [
  { max: 4, severity: "minimal" },
  { max: 9, severity: "mild" },
  { max: 14, severity: "moderate" },
  { max: 21, severity: "severe" },
];

function bandFor(score, bands) {
  for (const b of bands) if (score <= b.max) return b.severity;
  return "severe";
}

/* =====================================================================
 * ProtocolExecutor
 * ===================================================================== */
export class ProtocolExecutor {
  /**
   * Load a protocol by id from the registry.
   * @returns {Promise<object|null>}
   */
  async loadProtocol(protocolId) {
    if (!protocolId) return null;
    const [row] = await db
      .select()
      .from(protocolRegistry)
      .where(eq(protocolRegistry.id, protocolId))
      .limit(1);
    return row || null;
  }

  async loadProtocolByCode(code) {
    if (!code) return null;
    const [row] = await db
      .select()
      .from(protocolRegistry)
      .where(eq(protocolRegistry.code, code))
      .limit(1);
    return row || null;
  }

  /**
   * Begin a new session. Returns { session, protocol, current }.
   * Refuses to start if protocol is not ACTIVE or human_required is true
   * (human-required protocols are orientation-only; engine does not run them).
   */
  async startSession({ userId, protocolId, agentId = null }) {
    if (!userId || !protocolId) {
      return { ok: false, reason: "missing_user_or_protocol" };
    }
    const protocol = await this.loadProtocol(protocolId);
    if (!protocol) return { ok: false, reason: "protocol_not_found" };
    if (protocol.status !== "active") {
      return { ok: false, reason: "protocol_not_active", status: protocol.status };
    }
    if (protocol.humanRequired) {
      return { ok: false, reason: "human_required", message: "This protocol requires a licensed clinician to deliver. The orientation module is read-only." };
    }
    const phases = Array.isArray(protocol.phases) ? protocol.phases : [];
    if (phases.length === 0) return { ok: false, reason: "protocol_has_no_phases" };

    const startNode = phases[0];
    const [session] = await db
      .insert(protocolSessions)
      .values({
        userId,
        protocolId,
        agentId,
        status: STATUS.ACTIVE,
        currentNodeId: startNode.id,
        visitedNodeIds: [],
        nodeStates: {},
        userVariables: {},
        responses: [],
      })
      .returning();

    safeLog("ai_call_completed", { route: "protocol.start", protocolCode: protocol.code });

    const current = await this.executeNode(session.id, startNode.id);
    return { ok: true, session, protocol: publicProtocol(protocol), current };
  }

  /**
   * Render a node's payload (no transitions). Marks the node as visited
   * and writes nodeStates[nodeId].deliveredAt. Crisis nodes evaluate the
   * latest user response and may escalate the session.
   */
  async executeNode(sessionId, nodeId) {
    const sess = await this.#load(sessionId);
    if (!sess) return { ok: false, reason: "session_not_found" };
    if (sess.status !== STATUS.ACTIVE) {
      return { ok: false, reason: "session_not_active", status: sess.status };
    }

    const protocol = await this.loadProtocol(sess.protocolId);
    if (!protocol) return { ok: false, reason: "protocol_missing" };
    const node = (protocol.phases || []).find((n) => n.id === nodeId);
    if (!node) return { ok: false, reason: "node_not_found", nodeId };
    if (!NODE_TYPES.has(node.type)) {
      return { ok: false, reason: "unknown_node_type", type: node.type };
    }

    // Type-specific render payload (no DB writes from handlers themselves
    // except to nodeStates — the handler is pure-ish).
    const payload = renderNode(node);

    const visited = new Set(sess.visitedNodeIds || []);
    visited.add(nodeId);
    const nodeStates = { ...(sess.nodeStates || {}), [nodeId]: { deliveredAt: new Date().toISOString(), type: node.type } };

    await db
      .update(protocolSessions)
      .set({
        currentNodeId: nodeId,
        visitedNodeIds: [...visited],
        nodeStates,
        lastActivityAt: new Date(),
      })
      .where(eq(protocolSessions.id, sessionId));

    return {
      ok: true,
      sessionId,
      node: payload,
      transitions: this.#availableTransitions(node, sess.userVariables || {}),
      requiresResponse: nodeRequiresResponse(node),
    };
  }

  /**
   * Record a user response for the current node, run any side-effects
   * (e.g. ASSESSMENT scoring), and return the updated session state.
   * Does NOT advance the node — call progress() next.
   */
  async respond(opts) {
    return withSpan(
      "mmhb.protocol.respond",
      {
        "protocol.sessionId": String(opts?.sessionId || "").slice(0, 64),
        "protocol.nodeId": String(opts?.nodeId || "").slice(0, 64),
        "safety.critical": false,
      },
      () => this._respondInner(opts),
    );
  }

  async _respondInner({ sessionId, nodeId, response = {} }) {
    const sess = await this.#load(sessionId);
    if (!sess) return { ok: false, reason: "session_not_found" };
    if (sess.status !== STATUS.ACTIVE) {
      return { ok: false, reason: "session_not_active", status: sess.status };
    }
    if (sess.currentNodeId !== nodeId) {
      return { ok: false, reason: "node_mismatch", expected: sess.currentNodeId, got: nodeId };
    }
    const protocol = await this.loadProtocol(sess.protocolId);
    const node = (protocol?.phases || []).find((n) => n.id === nodeId);
    if (!node) return { ok: false, reason: "node_not_found" };

    const responses = Array.isArray(sess.responses) ? [...sess.responses] : [];
    const userVars = { ...(sess.userVariables || {}) };
    let crisisDetected = false;
    let assessmentResult = null;

    /* ---------- per-node-type response handling ---------- */
    if (node.type === "CRISIS_CHECK") {
      const text = String(response.text || "").slice(0, 4000);
      // detectCrisis returns a boolean from the locked safety module.
      if (detectCrisis(text) === true) {
        crisisDetected = true;
        userVars._crisis = { detectedAt: new Date().toISOString(), severity: "detector" };
      } else if (response.affirmative === true || /^\s*yes\b/i.test(text)) {
        crisisDetected = true;
        userVars._crisis = { detectedAt: new Date().toISOString(), severity: "user_confirmed" };
      }
    } else if (node.type === "ASSESSMENT") {
      assessmentResult = scoreAssessment(node.measureCode, response.items || []);
      if (assessmentResult.ok) {
        // PHQ-9 item 9 (suicidal ideation) ALWAYS escalates regardless of total.
        if (node.measureCode === "PHQ-9" && Array.isArray(response.items) && response.items[8] >= 1) {
          crisisDetected = true;
          userVars._crisis = { detectedAt: new Date().toISOString(), severity: "phq9_item9" };
        }
        userVars[`${node.measureCode.toLowerCase().replace(/-/g, "")}_score`] = assessmentResult.score;
        userVars[`${node.measureCode.toLowerCase().replace(/-/g, "")}_severity`] = assessmentResult.severity;

        try {
          await db.insert(outcomeMeasures).values({
            userId: sess.userId,
            sessionId,
            measureCode: node.measureCode,
            score: assessmentResult.score,
            subscores: assessmentResult.subscores || {},
            severity: assessmentResult.severity,
            flagItems: assessmentResult.flagItems || [],
          });
        } catch (err) {
          safeLog("ai_call_completed", { route: "protocol.assessment", error: err?.message?.slice(0, 80) });
        }
      }
    }

    // S5: atomic JSONB append on `responses` so a concurrent /respond
    // (e.g. a UI double-click) cannot clobber the prior entry. The
    // userVariables / status patch is separate and idempotent.
    const newEntry = {
      nodeId,
      type: node.type,
      submittedAt: new Date().toISOString(),
      response: sanitizeResponse(response),
      ...(assessmentResult ? { assessment: { score: assessmentResult.score, severity: assessmentResult.severity } } : {}),
    };

    const patch = {
      responses: sql`COALESCE(${protocolSessions.responses}, '[]'::jsonb) || ${sql.raw(`'${JSON.stringify([newEntry]).replace(/'/g, "''")}'::jsonb`)}`,
      userVariables: userVars,
      lastActivityAt: new Date(),
    };

    if (crisisDetected) {
      patch.status = STATUS.ESCALATED;
    }

    // Wrap the persistence step so PHQ-9 item-9 escalation failures trigger
    // a PagerDuty critical page. The entire protocol exists for this moment
    // — if we can't persist status=ESCALATED for a self-harm signal, we
    // need an operator paged immediately.
    try {
      await db.update(protocolSessions).set(patch).where(eq(protocolSessions.id, sessionId));
    } catch (err) {
      if (crisisDetected && userVars._crisis?.severity === "phq9_item9") {
        void alertPHQ9EscalationFailure({
          sessionId,
          userId: sess.userId,
          error: err,
        });
      }
      throw err;
    }

    if (crisisDetected) {
      safeLog("ai_call_completed", { route: "protocol.escalate", reason: userVars._crisis?.severity });
      return {
        ok: true,
        escalated: true,
        crisis: CRISIS_RESPONSE,
        safety: "Please visit /crisis for immediate support.",
        // Preserve assessment metadata so the frontend can still render the
        // user's score on the escalation card (the underlying outcome_measures
        // row is also persisted by the ASSESSMENT branch above).
        ...(assessmentResult ? { assessment: assessmentResult } : {}),
        sessionId,
      };
    }

    return {
      ok: true,
      escalated: false,
      assessment: assessmentResult,
      sessionId,
    };
  }

  /**
   * Advance the session: evaluate transitions on the CURRENT node, pick
   * the next, execute it, and return the new state. If no transitions
   * remain, the session is COMPLETED.
   */
  async progress(sessionId) {
    const sess = await this.#load(sessionId);
    if (!sess) return { ok: false, reason: "session_not_found" };
    if (sess.status !== STATUS.ACTIVE) {
      return { ok: false, reason: "session_not_active", status: sess.status };
    }
    const protocol = await this.loadProtocol(sess.protocolId);
    const node = (protocol?.phases || []).find((n) => n.id === sess.currentNodeId);
    if (!node) return { ok: false, reason: "current_node_missing" };

    const next = this.evaluateTransitions(node, sess.userVariables || {});
    if (!next) {
      await db
        .update(protocolSessions)
        .set({ status: STATUS.COMPLETED, completedAt: new Date(), lastActivityAt: new Date() })
        .where(eq(protocolSessions.id, sessionId));
      safeLog("ai_call_completed", { route: "protocol.complete", protocolCode: protocol?.code });
      return { ok: true, completed: true, sessionId };
    }
    // Walk through any BRANCH nodes invisibly: BRANCH is pure routing
    // metadata, never a user-facing step. Cap at 8 hops to fail-fast on
    // malformed protocols (would only happen with a cycle of branches).
    let result = await this.executeNode(sessionId, next);
    let hops = 0;
    while (result?.ok && result.node?.type === "BRANCH" && hops < 8) {
      const after = await this.#load(sessionId);
      const branchNode = (protocol?.phases || []).find((n) => n.id === after?.currentNodeId);
      if (!branchNode) break;
      const onward = this.evaluateTransitions(branchNode, after?.userVariables || {});
      if (!onward) {
        await db
          .update(protocolSessions)
          .set({ status: STATUS.COMPLETED, completedAt: new Date(), lastActivityAt: new Date() })
          .where(eq(protocolSessions.id, sessionId));
        return { ok: true, completed: true, sessionId };
      }
      result = await this.executeNode(sessionId, onward);
      hops += 1;
    }
    // S2: branch-loop safety floor. If we exhausted 8 hops without
    // landing on a non-BRANCH node, the protocol is malformed (cycle).
    // Escalate the session out of ACTIVE so the user never gets stuck on
    // an invisible routing node.
    if (result?.ok && result.node?.type === "BRANCH") {
      await db
        .update(protocolSessions)
        .set({ status: STATUS.ESCALATED, lastActivityAt: new Date() })
        .where(eq(protocolSessions.id, sessionId));
      safeLog("ai_call_completed", { route: "protocol.escalate", reason: "branch_loop" });
      return { ok: true, escalated: true, reason: "branch_loop_detected", sessionId, safety: "Please visit /crisis for immediate support if you need help right now." };
    }
    return result;
  }

  /**
   * Evaluate transitions/branches and return the next nodeId, or null
   * if the node is terminal.
   */
  evaluateTransitions(node, userVariables = {}) {
    if (node.type === "BRANCH") {
      for (const branch of node.branches || []) {
        if (branch.when === "default") return branch.to;
        if (evalCondition(branch.when, userVariables)) return branch.to;
      }
      return null;
    }
    const tlist = node.transitions || [];
    if (tlist.length === 0) return null;
    for (const t of tlist) {
      if (!t.condition || t.condition === "always" || evalCondition(t.condition, userVariables)) {
        return t.to;
      }
    }
    return null;
  }

  /**
   * User-facing "I want to pause".
   */
  async pauseSession(sessionId) {
    const sess = await this.#load(sessionId);
    if (!sess) return { ok: false, reason: "session_not_found" };
    if (sess.status !== STATUS.ACTIVE) return { ok: false, reason: "session_not_active", status: sess.status };
    await db
      .update(protocolSessions)
      .set({ status: STATUS.PAUSED, lastActivityAt: new Date() })
      .where(eq(protocolSessions.id, sessionId));
    return { ok: true, status: STATUS.PAUSED };
  }

  /**
   * Sweep paused/active sessions and mark any with >7 days inactivity
   * as ABANDONED. Idempotent. Safe to call from a scheduler later.
   */
  async sweepAbandoned() {
    const cutoff = new Date(Date.now() - ABANDON_AFTER_DAYS * 24 * 60 * 60 * 1000);
    const stale = await db
      .select({ id: protocolSessions.id })
      .from(protocolSessions)
      .where(and(eq(protocolSessions.status, STATUS.ACTIVE)));
    let updated = 0;
    for (const row of stale) {
      const [s] = await db.select().from(protocolSessions).where(eq(protocolSessions.id, row.id)).limit(1);
      if (!s) continue;
      if (s.lastActivityAt && s.lastActivityAt < cutoff) {
        await db.update(protocolSessions).set({ status: STATUS.ABANDONED }).where(eq(protocolSessions.id, s.id));
        updated += 1;
      }
    }
    return { ok: true, abandoned: updated };
  }

  /**
   * Read full session state + the rendered payload of the current node.
   */
  async getCurrentState(sessionId) {
    const sess = await this.#load(sessionId);
    if (!sess) return { ok: false, reason: "session_not_found" };
    const protocol = await this.loadProtocol(sess.protocolId);
    const node = (protocol?.phases || []).find((n) => n.id === sess.currentNodeId) || null;
    return {
      ok: true,
      session: {
        id: sess.id,
        userId: sess.userId,
        status: sess.status,
        currentNodeId: sess.currentNodeId,
        visitedNodeIds: sess.visitedNodeIds || [],
        userVariables: sess.userVariables || {},
        startedAt: sess.startedAt,
        lastActivityAt: sess.lastActivityAt,
        completedAt: sess.completedAt,
      },
      protocol: protocol ? publicProtocol(protocol) : null,
      currentNode: node ? renderNode(node) : null,
      transitions: node ? this.#availableTransitions(node, sess.userVariables || {}) : [],
      requiresResponse: node ? nodeRequiresResponse(node) : false,
    };
  }

  /* ---------- internals ---------- */
  async #load(sessionId) {
    if (!sessionId) return null;
    const [row] = await db
      .select()
      .from(protocolSessions)
      .where(eq(protocolSessions.id, sessionId))
      .limit(1);
    return row || null;
  }

  #availableTransitions(node, userVariables) {
    if (node.type === "BRANCH") {
      return (node.branches || []).map((b) => ({ to: b.to, when: b.when, eligible: b.when === "default" || evalCondition(b.when, userVariables) }));
    }
    return (node.transitions || []).map((t) => ({ to: t.to, condition: t.condition || "always", eligible: !t.condition || t.condition === "always" || evalCondition(t.condition, userVariables) }));
  }
}

/* =====================================================================
 * Pure helpers
 * ===================================================================== */
function renderNode(node) {
  // Public surface — never echoes internal `branches[].when` predicates.
  const base = {
    id: node.id,
    type: node.type,
    title: node.title || "",
  };
  switch (node.type) {
    case "PSYCHOED":
      return { ...base, body: node.body || "" };
    case "SKILL":
      return { ...base, instructions: node.instructions || "", examples: node.examples || [] };
    case "EXPERIENTIAL":
      return { ...base, instructions: node.instructions || "", durationSec: node.durationSec || 60 };
    case "GROUNDING":
      return { ...base, prompt: node.prompt || "", durationSec: node.durationSec || 90 };
    case "ASSESSMENT":
      return { ...base, measureCode: node.measureCode || "", itemCount: itemCountFor(node.measureCode) };
    case "HOMEWORK":
      return { ...base, body: node.body || "", dueDays: node.dueDays || 7 };
    case "CRISIS_CHECK":
      return { ...base, prompt: node.prompt || "Are you safe right now?" };
    case "BRANCH":
      return { ...base, body: "Personalizing your next step…" };
    default:
      return base;
  }
}

function nodeRequiresResponse(node) {
  return ["CRISIS_CHECK", "ASSESSMENT", "SKILL", "GROUNDING"].includes(node.type);
}

function itemCountFor(measureCode) {
  if (measureCode === "PHQ-9") return 9;
  if (measureCode === "GAD-7") return 7;
  return 0;
}

function publicProtocol(p) {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    modality: p.modality,
    description: p.description,
    targetSymptoms: p.targetSymptoms || [],
    evidenceLevel: p.evidenceLevel,
    durationWeeks: p.durationWeeks,
    sessionsPerWeek: p.sessionsPerWeek,
    humanRequired: p.humanRequired,
    nodeCount: Array.isArray(p.phases) ? p.phases.length : 0,
  };
}

/**
 * Score a public-domain assessment from its raw item array.
 *  • PHQ-9: 9 items, each 0-3 → total 0-27
 *  • GAD-7: 7 items, each 0-3 → total 0-21
 */
function scoreAssessment(measureCode, items) {
  if (!Array.isArray(items)) return { ok: false, reason: "items_required" };
  const sanitized = items.map((n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(3, Math.round(v)));
  });
  if (measureCode === "PHQ-9") {
    if (sanitized.length !== 9) return { ok: false, reason: "phq9_requires_9_items" };
    const score = sanitized.reduce((a, b) => a + b, 0);
    const flagItems = [];
    if (sanitized[8] >= 1) flagItems.push("item9_self_harm_ideation");
    return { ok: true, score, severity: bandFor(score, PHQ9_BANDS), flagItems, subscores: { items: sanitized } };
  }
  if (measureCode === "GAD-7") {
    if (sanitized.length !== 7) return { ok: false, reason: "gad7_requires_7_items" };
    const score = sanitized.reduce((a, b) => a + b, 0);
    return { ok: true, score, severity: bandFor(score, GAD7_BANDS), flagItems: [], subscores: { items: sanitized } };
  }
  return { ok: false, reason: "unsupported_measure", measureCode };
}

/**
 * Tiny safe expression evaluator for transition conditions.
 * Supported syntax: `<var> <op> <number>` where op ∈ { >=, >, <=, <, ==, != }.
 * Anything else returns false (closed by default).
 */
function evalCondition(expr, userVariables = {}) {
  if (!expr || typeof expr !== "string") return false;
  if (expr === "always" || expr === "default") return true;
  const m = expr.trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(>=|<=|==|!=|>|<)\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return false;
  const [, key, op, raw] = m;
  const lhs = Number(userVariables[key]);
  const rhs = Number(raw);
  if (Number.isNaN(lhs) || Number.isNaN(rhs)) return false;
  switch (op) {
    case ">=": return lhs >= rhs;
    case ">":  return lhs >  rhs;
    case "<=": return lhs <= rhs;
    case "<":  return lhs <  rhs;
    case "==": return lhs === rhs;
    case "!=": return lhs !== rhs;
    default:   return false;
  }
}

/**
 * Strip anything we don't expect. Never echo arbitrary client-controlled
 * keys into the persisted responses log.
 */
function sanitizeResponse(r) {
  if (!r || typeof r !== "object") return {};
  const out = {};
  if (typeof r.text === "string") out.text = r.text.slice(0, 4000);
  if (typeof r.affirmative === "boolean") out.affirmative = r.affirmative;
  if (typeof r.choice === "string") out.choice = r.choice.slice(0, 80);
  if (Array.isArray(r.items)) out.items = r.items.slice(0, 32).map((n) => Number(n) || 0);
  if (typeof r.notes === "string") out.notes = r.notes.slice(0, 1000);
  return out;
}

function safeLog(type, metadata = {}) {
  try { logEvent({ type, metadata }); } catch { /* swallow */ }
}

/* ---------- module-level singleton ---------- */
let _singleton = null;
export function getExecutor() {
  if (!_singleton) _singleton = new ProtocolExecutor();
  return _singleton;
}

export const PROTOCOL_STATUS = STATUS;
export const SUPPORTED_NODE_TYPES = [...NODE_TYPES];
