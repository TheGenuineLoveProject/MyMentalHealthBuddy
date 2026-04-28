// server/ai/v2/agentState.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1 extension: Explicit state machine.
//
// Spec ref: Part II §2.5 (Synthetic Employee lifecycle), CAD-4 (Radical
// Transparency — every state transition must be observable).
//
// Design contract:
//   • Five states only: IDLE, ENGAGED, AWAITING_APPROVAL, ERROR, LEARNING.
//   • Pure in-process map keyed by agentId. Survives process lifetime
//     only — restart resets to IDLE (matches HOT memory contract).
//   • State is metadata about the agent, not gating logic. The
//     orchestrator records transitions in the audit trace and may
//     consult state for diagnostics, but never blocks on it. This keeps
//     v2 read-mostly until human operators wire blocking semantics.
//   • Allowed transitions are enforced. Rejected transitions are
//     reported but do not throw — they get logged as `denied` events
//     visible in the orchestrator trace.

export const AGENT_STATES = Object.freeze({
  IDLE: "IDLE",
  ENGAGED: "ENGAGED",
  AWAITING_APPROVAL: "AWAITING_APPROVAL",
  ERROR: "ERROR",
  LEARNING: "LEARNING",
});

const ALLOWED = {
  IDLE: ["ENGAGED", "ERROR", "LEARNING"],
  ENGAGED: ["IDLE", "AWAITING_APPROVAL", "ERROR", "LEARNING"],
  AWAITING_APPROVAL: ["IDLE", "ENGAGED", "ERROR", "LEARNING"],
  ERROR: ["IDLE", "LEARNING"],
  LEARNING: ["IDLE"],
};

// Map<agentId, { state, since, lastReason, transitions }>
// NOTE: Map is bounded by MAX_TRACKED_AGENTS to prevent unbounded growth.
// When the cap is reached, IDLE agents that have been idle longer than
// IDLE_PRUNE_MS are evicted first. If there are no eligible IDLE agents,
// the oldest insertion (by Map iteration order) is dropped instead.
const stateByAgent = new Map();

const MAX_TRANSITIONS_RETAINED = 20;
const MAX_TRACKED_AGENTS = 1000;
const IDLE_PRUNE_MS = 30 * 60 * 1000; // 30 minutes idle → eligible for eviction

function pruneAgents() {
  if (stateByAgent.size <= MAX_TRACKED_AGENTS) return;
  const now = Date.now();
  const overflow = stateByAgent.size - MAX_TRACKED_AGENTS;
  // First pass: drop IDLE agents that have been idle long enough.
  const evicted = [];
  for (const [id, rec] of stateByAgent.entries()) {
    if (evicted.length >= overflow) break;
    if (rec.state === AGENT_STATES.IDLE && now - rec.since > IDLE_PRUNE_MS) {
      evicted.push(id);
    }
  }
  for (const id of evicted) stateByAgent.delete(id);
  // Second pass: if we still have overflow, drop oldest insertion order
  // until we are under the cap. Map preserves insertion order in JS.
  if (stateByAgent.size > MAX_TRACKED_AGENTS) {
    const remaining = stateByAgent.size - MAX_TRACKED_AGENTS;
    let i = 0;
    for (const id of stateByAgent.keys()) {
      if (i++ >= remaining) break;
      stateByAgent.delete(id);
    }
  }
}

function ensureRecord(agentId) {
  let rec = stateByAgent.get(agentId);
  if (!rec) {
    rec = {
      state: AGENT_STATES.IDLE,
      since: Date.now(),
      lastReason: "boot",
      transitions: [],
    };
    stateByAgent.set(agentId, rec);
    pruneAgents();
  }
  return rec;
}

export function getAgentState(agentId) {
  if (!agentId) return null;
  const rec = ensureRecord(agentId);
  return {
    agentId,
    state: rec.state,
    since: rec.since,
    sinceMs: Date.now() - rec.since,
    lastReason: rec.lastReason,
  };
}

export function transitionAgentState(agentId, nextState, reason = "unspecified") {
  if (!agentId) {
    return { ok: false, denied: true, reason: "missing_agent_id" };
  }
  if (!Object.values(AGENT_STATES).includes(nextState)) {
    return { ok: false, denied: true, reason: `unknown_state:${nextState}` };
  }
  const rec = ensureRecord(agentId);
  if (rec.state === nextState) {
    return { ok: true, noop: true, state: rec.state };
  }
  const allowed = ALLOWED[rec.state] || [];
  if (!allowed.includes(nextState)) {
    return {
      ok: false,
      denied: true,
      reason: "transition_not_allowed",
      from: rec.state,
      to: nextState,
      allowedFrom: allowed,
    };
  }
  const previous = rec.state;
  rec.state = nextState;
  rec.since = Date.now();
  rec.lastReason = String(reason).slice(0, 120);
  rec.transitions.push({
    from: previous,
    to: nextState,
    at: rec.since,
    reason: rec.lastReason,
  });
  if (rec.transitions.length > MAX_TRANSITIONS_RETAINED) {
    rec.transitions.shift();
  }
  return { ok: true, from: previous, to: nextState, since: rec.since };
}

export function recentTransitions(agentId, limit = 10) {
  if (!agentId) return [];
  const rec = stateByAgent.get(agentId);
  if (!rec) return [];
  const safe = Math.max(1, Math.min(Number(limit) || 10, MAX_TRANSITIONS_RETAINED));
  return rec.transitions.slice(-safe);
}

export function stateMachineSnapshot() {
  const out = [];
  for (const [agentId, rec] of stateByAgent.entries()) {
    out.push({
      agentId,
      state: rec.state,
      sinceMs: Date.now() - rec.since,
      lastReason: rec.lastReason,
      transitionsRetained: rec.transitions.length,
    });
  }
  return {
    totalAgents: stateByAgent.size,
    agents: out,
    states: Object.values(AGENT_STATES),
  };
}

export function resetAgentState(agentId) {
  if (!agentId) return false;
  return stateByAgent.delete(agentId);
}
