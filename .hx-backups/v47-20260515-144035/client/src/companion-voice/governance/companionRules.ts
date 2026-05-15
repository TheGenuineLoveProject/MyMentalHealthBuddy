/**
 * Phase 15 — Governance rules for the Gentle Companion Conversation Layer.
 *
 *   - 16 rules total · 8 BLOCKING · 8 WARNING.
 *   - Each rule has an `id` (CV-R###) and a pure check predicate.
 *   - `auditResponse(response, input)` returns the failing rules.
 *   - `auditBank()` runs static checks on the curated copy bank.
 */

import {
  CRISIS_LINE_SHORT,
  FORBIDDEN_PHRASES,
  OPT_OUT_LINE,
  PERMISSION_PHRASES,
  RESPONSE_BANKS,
} from "../copy/responseBank";
import { CRISIS_SIGNAL_COUNT, detectCrisis } from "../engine/crisisDetector";
import {
  MAX_MESSAGE_LENGTH,
  generateResponse,
  normalizeForMatch,
} from "../engine/companionEngine";
import type {
  CompanionInput,
  CompanionResponse,
  ResponseIntent,
} from "../types/companionVoiceTypes";

export type RuleSeverity = "blocking" | "warning";

export type CompanionRule = {
  id: string;
  severity: RuleSeverity;
  description: string;
  check: (response: CompanionResponse, input: CompanionInput) => boolean;
};

export type RuleResult = {
  id: string;
  severity: RuleSeverity;
  description: string;
};

/** Locked module-level constant — there is no setter. */
export const REQUIRE_CRISIS_OVERRIDE = true;
export const REQUIRE_OPT_OUT_ON_EVERY_RESPONSE = true;

export const rules: CompanionRule[] = [
  {
    id: "CV-R001",
    severity: "blocking",
    description:
      "Crisis input MUST always return isCrisis=true and the safety message — never a conversational reflection.",
    check: (resp, input) => {
      const detected = detectCrisis(input.text ?? "");
      if (!detected.isCrisis) return true;
      return resp.isCrisis === true && resp.intent === "crisis";
    },
  },
  {
    id: "CV-R002",
    severity: "blocking",
    description: "Every response MUST include the /crisis routing line.",
    check: (resp) => typeof resp.crisisLine === "string" && resp.crisisLine.includes("/crisis"),
  },
  {
    id: "CV-R003",
    severity: "blocking",
    description: "Every response MUST include the opt-out / no-pressure line.",
    check: (resp) =>
      typeof resp.optOut === "string" && resp.optOut.trim().length > 0 && resp.optOut === OPT_OUT_LINE,
  },
  {
    id: "CV-R004",
    severity: "blocking",
    description: "No response message may contain any forbidden anthropomorphism / attachment phrase.",
    check: (resp) => {
      const m = normalizeForMatch(resp.message);
      return !FORBIDDEN_PHRASES.some((p) => m.includes(p));
    },
  },
  {
    id: "CV-R005",
    severity: "blocking",
    description: "Response message MUST stay under MAX_MESSAGE_LENGTH characters.",
    check: (resp) => resp.message.length <= MAX_MESSAGE_LENGTH,
  },
  {
    id: "CV-R006",
    severity: "blocking",
    description: "Non-crisis affirmations and invitations MUST carry at least one permission phrase.",
    check: (resp) => {
      if (resp.isCrisis) return true;
      if (resp.intent === "reflect" || resp.intent === "rest") return true;
      const m = normalizeForMatch(resp.message);
      return PERMISSION_PHRASES.some((p) => m.includes(p));
    },
  },
  {
    id: "CV-R007",
    severity: "blocking",
    description:
      "Crisis responses MUST NOT carry an OARS technique (they are routing, not conversation).",
    check: (resp) => (resp.isCrisis ? resp.technique === null : true),
  },
  {
    id: "CV-R008",
    severity: "blocking",
    description:
      "Crisis safety line must reference /crisis even on the crisis card itself (defense-in-depth).",
    check: (resp) =>
      resp.isCrisis ? resp.crisisLine.includes("/crisis") : true,
  },
  // ---- WARNINGS ------------------------------------------------------------
  {
    id: "CV-R009",
    severity: "warning",
    description: "Detected category should be one of the documented EmotionCategory values.",
    check: (resp) =>
      [
        "tired", "anxious", "sad", "angry", "lonely", "overwhelmed",
        "calm", "grateful", "hopeful", "neutral", "ambivalent",
      ].includes(resp.detected),
  },
  {
    id: "CV-R010",
    severity: "warning",
    description: "OARS technique should match documented values when present.",
    check: (resp) =>
      resp.technique === null ||
      ["open-question", "affirmation", "reflection", "summary", "permission"].includes(
        resp.technique,
      ),
  },
  {
    id: "CV-R011",
    severity: "warning",
    description: "Response intent should match documented values.",
    check: (resp) =>
      ["crisis", "reflect", "affirm", "invite", "rest"].includes(resp.intent),
  },
  {
    id: "CV-R012",
    severity: "warning",
    description: "Empty input should not produce a category-specific reflection.",
    check: (resp, input) => {
      if ((input.text ?? "").trim().length > 0) return true;
      return resp.intent === "invite" && resp.detected === "neutral";
    },
  },
  {
    id: "CV-R013",
    severity: "warning",
    description: "Message must not be empty or whitespace.",
    check: (resp) => resp.message.trim().length > 4,
  },
  {
    id: "CV-R014",
    severity: "warning",
    description:
      "Crisis detector must remain non-trivial (≥ 20 signals) — guards against accidental deletion.",
    check: () => CRISIS_SIGNAL_COUNT >= 20,
  },
  {
    id: "CV-R015",
    severity: "warning",
    description:
      "Opt-out copy must explicitly mention there's no streak / progress lock.",
    check: (resp) => {
      const o = resp.optOut.toLowerCase();
      return o.includes("streak") || o.includes("progress") || o.includes("pause");
    },
  },
  {
    id: "CV-R016",
    severity: "warning",
    description: "Crisis short-line copy must remain in the response.",
    check: (resp) => resp.crisisLine === CRISIS_LINE_SHORT || resp.isCrisis,
  },
];

/** Audit a single response. Returns failing rules. */
export function auditResponse(
  response: CompanionResponse,
  input: CompanionInput,
): RuleResult[] {
  const failures: RuleResult[] = [];
  for (const r of rules) {
    let ok = false;
    try {
      ok = r.check(response, input);
    } catch {
      ok = false;
    }
    if (!ok) failures.push({ id: r.id, severity: r.severity, description: r.description });
  }
  return failures;
}

/**
 * Direct per-line audit of the curated response bank.
 *
 * Iterates EVERY line in EVERY bank and constructs a synthetic
 * CompanionResponse with the appropriate intent (reflections → "reflect",
 * affirmations → "affirm", invitations → "invite"). This guarantees
 * coverage even when the category detector cannot reach a category from
 * a seed input — no indirect engine sampling.
 *
 * Used by tests to ensure no individual line drifts off-policy.
 */
export function auditBank(): { line: string; failures: RuleResult[] }[] {
  const out: { line: string; failures: RuleResult[] }[] = [];

  function audit(line: string, intent: ResponseIntent, category: string) {
    const synthetic: CompanionResponse = {
      message: line,
      intent,
      technique:
        intent === "reflect" ? "reflection" :
        intent === "affirm" ? "affirmation" :
        intent === "invite" ? "open-question" : null,
      isCrisis: false,
      optOut: OPT_OUT_LINE,
      crisisLine: CRISIS_LINE_SHORT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detected: category as any,
    };
    const failures = auditResponse(synthetic, { text: `bank-audit:${category}` });
    if (failures.length > 0) out.push({ line, failures });
  }

  for (const bank of RESPONSE_BANKS) {
    for (const r of bank.reflections) audit(r, "reflect", bank.category);
    for (const a of bank.affirmations) audit(a, "affirm", bank.category);
    for (const i of bank.invitations) audit(i, "invite", bank.category);
  }
  return out;
}
