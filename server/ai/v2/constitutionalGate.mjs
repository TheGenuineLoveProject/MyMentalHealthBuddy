// server/ai/v2/constitutionalGate.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.1 extension: Constitutional gate.
//
// Spec ref: CAD-1 (Hard Safety Floor), Part I §1.4 (Trauma-informed,
// non-clinical voice), Part IV §4.2 (Crisis routing is non-negotiable).
//
// Design contract:
//   • Pure deterministic function. No DB, no I/O.
//   • Encodes a small set of inviolable platform constitutional rules
//     that the orchestrator must surface to reviewers when violated.
//   • This module DOES NOT block responses. It returns a verdict that
//     the orchestrator records in the audit row and that the
//     escalation evaluator promotes to AWAITING_APPROVAL.
//   • Violations are advisory: the locked v1 chat orchestrator already
//     enforces /crisis routing and tone guardrails at runtime. This is
//     a transparency layer for the v2 audit trail.

import { detectCrisis } from "../safety/crisis.mjs";

const FORBIDDEN_DIAGNOSIS_PATTERNS = [
  /\byou (?:have|are) (?:bipolar|depressed|anxiety|ptsd|adhd|ocd)\b/i,
  /\bi (?:diagnose|am diagnosing) you\b/i,
  /\byour (?:diagnosis|disorder) is\b/i,
];

const FORBIDDEN_HUMAN_CLAIM_PATTERNS = [
  /\bi am (?:a )?(?:human|real person|licensed therapist|psychiatrist|doctor)\b/i,
  /\bi'm (?:a )?(?:human|real person|licensed therapist|psychiatrist|doctor)\b/i,
];

const FORBIDDEN_PAYMENT_REQUEST_PATTERNS = [
  /\b(?:send|wire|transfer|venmo|cashapp|zelle|paypal) (?:me )?(?:money|funds|payment)\b/i,
  /\bgive me your (?:credit card|cc|card number)\b/i,
];

/**
 * Run the constitutional gate over a candidate decision.
 *
 * @param {Object} params
 * @param {string} [params.input] - The user's original input.
 * @param {string} [params.intent] - The orchestrator's classified intent.
 * @param {Object} [params.outcome] - The deliberation outcome candidate.
 * @returns {{pass: boolean, violations: Array<{rule: string, severity: string, evidence: string}>, note: string}}
 */
export function runConstitutionalGate({ input = "", intent = "", outcome = null } = {}) {
  const violations = [];
  const text = typeof input === "string" ? input : "";
  // We deliberately scan ONLY the user-facing prose fields of the outcome,
  // never the full JSON.stringify. Stringifying the whole object would
  // false-positive on benign keys like {"diagnosis": false} or
  // {"resources": ["...therapist..."]}. The fields below are the canonical
  // surfaces where v2 deliberation could write user-visible language.
  const outcomeText = outcome ? extractOutcomeProse(outcome) : "";

  // Rule C1: Crisis content MUST be routed to /crisis. The locked v1
  // orchestrator already does this; we double-check structurally so
  // any v2 deliberation that accidentally swallows a crisis signal
  // surfaces in the audit log immediately. We check both structural
  // outcome fields (action, crisisRoute, route) and prose, because
  // crisis routing is sometimes signaled by an action code alone.
  if (text && detectCrisis(text)) {
    if (!outcomeRoutesToCrisis(outcome)) {
      violations.push({
        rule: "C1_crisis_routing",
        severity: "critical",
        evidence: "Crisis signal detected in input but outcome does not route to /crisis.",
      });
    }
  }

  // Rule C2: Never claim diagnosis in synthesized output.
  for (const re of FORBIDDEN_DIAGNOSIS_PATTERNS) {
    if (re.test(outcomeText)) {
      violations.push({
        rule: "C2_no_diagnosis",
        severity: "high",
        evidence: `outcome matches forbidden diagnosis pattern: ${re.source}`,
      });
      break;
    }
  }

  // Rule C3: Never impersonate a human or licensed clinician in synthesized output.
  for (const re of FORBIDDEN_HUMAN_CLAIM_PATTERNS) {
    if (re.test(outcomeText)) {
      violations.push({
        rule: "C3_no_human_impersonation",
        severity: "high",
        evidence: `outcome matches forbidden human-claim pattern: ${re.source}`,
      });
      break;
    }
  }

  // Rule C4: Never request payment via chat.
  for (const re of FORBIDDEN_PAYMENT_REQUEST_PATTERNS) {
    if (re.test(outcomeText) || re.test(text)) {
      violations.push({
        rule: "C4_no_payment_request",
        severity: "critical",
        evidence: `payment-request pattern matched: ${re.source}`,
      });
      break;
    }
  }

  // Rule C5: Educational-only voice. If the orchestrator labels this
  // as a clinical decision but the intent is general, flag for review.
  if (
    typeof intent === "string" &&
    intent.toLowerCase() === "general" &&
    outcome &&
    typeof outcome.action === "string" &&
    outcome.action.includes("clinical")
  ) {
    violations.push({
      rule: "C5_educational_voice",
      severity: "low",
      evidence: "general-intent decision labeled with clinical action; consider rewording.",
    });
  }

  return {
    pass: violations.length === 0,
    violations,
    note:
      violations.length === 0
        ? "All constitutional rules satisfied."
        : `Constitutional review needed: ${violations.length} violation(s).`,
  };
}

// Whitelist of outcome fields that may carry user-facing language.
// Any other key (action codes, booleans, IDs, resource lists) is ignored.
const PROSE_KEYS = ["message", "reply", "text", "content", "body", "explanation", "note", "nextStep"];

function extractOutcomeProse(obj) {
  if (!obj || typeof obj !== "object") return "";
  const parts = [];
  for (const key of PROSE_KEYS) {
    const val = obj[key];
    if (typeof val === "string" && val.length > 0) {
      parts.push(val);
    }
  }
  // Also scan a top-level "resources" array for string descriptions, since
  // crisis routing payloads commonly carry text there.
  if (Array.isArray(obj.resources)) {
    for (const r of obj.resources) {
      if (typeof r === "string") parts.push(r);
      else if (r && typeof r === "object") {
        for (const k of ["label", "description", "name"]) {
          if (typeof r[k] === "string") parts.push(r[k]);
        }
      }
    }
  }
  return parts.join("\n").slice(0, 8000);
}

// Crisis-routing detection scans structural action codes too — these
// are deliberately NOT user-facing prose, but they signal that the
// outcome IS routing to /crisis (which is what C1 asks for).
function outcomeRoutesToCrisis(obj) {
  if (!obj || typeof obj !== "object") return false;
  const action = typeof obj.action === "string" ? obj.action.toLowerCase() : "";
  if (action.includes("crisis")) return true;
  if (typeof obj.crisisRoute === "string" && obj.crisisRoute) return true;
  if (typeof obj.route === "string" && obj.route.includes("/crisis")) return true;
  // Last-resort prose check
  const prose = extractOutcomeProse(obj);
  return prose.includes("/crisis");
}

export const CONSTITUTIONAL_RULES = Object.freeze([
  { id: "C1_crisis_routing", severity: "critical", description: "Crisis input must route to /crisis." },
  { id: "C2_no_diagnosis", severity: "high", description: "Never claim or imply a diagnosis." },
  { id: "C3_no_human_impersonation", severity: "high", description: "Never claim to be human or a licensed clinician." },
  { id: "C4_no_payment_request", severity: "critical", description: "Never request payment via chat." },
  { id: "C5_educational_voice", severity: "low", description: "Maintain educational, non-clinical voice when intent is general." },
]);
