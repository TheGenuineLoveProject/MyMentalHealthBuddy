// server/ai/v2/agentEscalation.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1 extension: Per-role escalation.
//
// Spec ref: Part II §2.5 (Synthetic Employee Registry — every division
// has its own escalation contract), CAD-3 (Compute-Tier Crisis Priority).
//
// Design contract:
//   • Pure deterministic function. No DB, no I/O.
//   • Each division has a confidence floor + a "must-escalate" trigger
//     list. If confidence falls below the floor OR any trigger fires,
//     the orchestrator should mark the decision as AWAITING_APPROVAL.
//   • Returning escalate=false NEVER means "release for autonomous
//     action" — the orchestrator already operates in shadow mode for
//     v2.0. This module simply tells the audit layer which decisions
//     deserve a human reviewer's attention first.
//   • Thresholds are tuned conservatively: safety division has the
//     highest floor because the cost of an unreviewed safety mistake
//     is highest.

const DIVISION_THRESHOLDS = Object.freeze({
  safety: {
    confidenceFloor: 90,
    suggestedReviewer: "safety_lead",
    note: "Safety decisions require near-certain confidence before bypassing review.",
  },
  clinical: {
    confidenceFloor: 75,
    suggestedReviewer: "clinical_supervisor",
    note: "Clinical recommendations should be supervised below the floor.",
  },
  research: {
    confidenceFloor: 55,
    suggestedReviewer: "research_lead",
    note: "Research/education has more tolerance for low-confidence drafts.",
  },
  operations: {
    confidenceFloor: 65,
    suggestedReviewer: "ops_lead",
    note: "Operational decisions get lower scrutiny than user-facing ones.",
  },
});

const DEFAULT_THRESHOLD = {
  confidenceFloor: 70,
  suggestedReviewer: "ops_lead",
  note: "Default threshold for unrecognized divisions.",
};

const ALWAYS_ESCALATE_TRIGGERS = Object.freeze([
  "crisis_short_circuit",
  "kill_switch_engaged",
  "lifecycle_blocked",
  "validation_failed",
]);

/**
 * Decide whether a v2 orchestrator decision should escalate to a human
 * reviewer. Returns a structured verdict suitable for embedding in the
 * agent_decisions audit row.
 *
 * @param {Object} params
 * @param {string} [params.division] - safety|clinical|research|operations
 * @param {string} [params.decisionType] - finalize() decisionType
 * @param {number} [params.confidence] - 0..100
 * @param {boolean} [params.priorityEscalated] - crisis flag from CAD-3
 * @param {Object|null} [params.constitutional] - constitutionalGate result
 * @returns {{escalate: boolean, reasons: string[], suggestedReviewer: string|null, threshold: Object}}
 */
export function evaluateEscalation({
  division = null,
  decisionType = null,
  confidence = null,
  priorityEscalated = false,
  constitutional = null,
} = {}) {
  const threshold = DIVISION_THRESHOLDS[division] || DEFAULT_THRESHOLD;
  const reasons = [];

  if (priorityEscalated) {
    reasons.push("priority_escalated_crisis");
  }
  if (decisionType && ALWAYS_ESCALATE_TRIGGERS.includes(decisionType)) {
    reasons.push(`decision_type:${decisionType}`);
  }
  if (typeof confidence === "number" && confidence < threshold.confidenceFloor) {
    reasons.push(`confidence_below_floor:${confidence}<${threshold.confidenceFloor}`);
  }
  if (constitutional && constitutional.pass === false) {
    reasons.push("constitutional_violation");
  }

  return {
    escalate: reasons.length > 0,
    reasons,
    suggestedReviewer: reasons.length > 0 ? threshold.suggestedReviewer : null,
    threshold: {
      division: division || "unknown",
      confidenceFloor: threshold.confidenceFloor,
      note: threshold.note,
    },
  };
}

export function escalationConfig() {
  return {
    divisions: DIVISION_THRESHOLDS,
    default: DEFAULT_THRESHOLD,
    alwaysEscalateTriggers: ALWAYS_ESCALATE_TRIGGERS,
  };
}
