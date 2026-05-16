/**
 * Phase 32 — CBT governance & safety contract.
 *
 * Module-load floor guard asserts the rule count, so a future deletion
 * fails import rather than silently shipping a weaker contract.
 */

export interface CbtSafetyRule {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly enforcement: "blocking" | "advisory";
}

export const CBT_NEVER_REPLACES_THERAPY_NOTICE =
  "This is a self-help tool, not a replacement for professional mental health care.";

export const CBT_SAFETY_RULES: ReadonlyArray<CbtSafetyRule> = Object.freeze([
  {
    id: "never-replace-therapy",
    title: "Never replace therapy",
    detail: CBT_NEVER_REPLACES_THERAPY_NOTICE,
    enforcement: "blocking",
  },
  {
    id: "no-diagnostic-language",
    title: "No diagnostic language",
    detail: "Never label a user with a disorder; never use DSM/ICD terminology in worksheet copy.",
    enforcement: "blocking",
  },
  {
    id: "no-severity-assessment",
    title: "No severity assessment",
    detail: "Worksheets do not produce a clinical severity score. Intensity ratings are subjective only.",
    enforcement: "blocking",
  },
  {
    id: "self-harm-triggers-crisis",
    title: "Self-harm triggers crisis protocol",
    detail: "If self-harm language appears in any worksheet field, route to lumi-crisis CrisisPanel.",
    enforcement: "blocking",
  },
  {
    id: "always-include-exit-path",
    title: "Always include exit path",
    detail: "Every worksheet UI surface must offer a visible \"close\" or \"save and leave\" affordance.",
    enforcement: "blocking",
  },
  {
    id: "no-should-statements",
    title: "No \"should\" statements in prompts",
    detail: "Prompts use invitational language. Behavioral Activation enforces this at submit time.",
    enforcement: "blocking",
  },
  {
    id: "reading-level-grade-6",
    title: "Reading level ≤ Grade 6",
    detail: "All worksheet copy reviewed with Flesch-Kincaid before merge.",
    enforcement: "advisory",
  },
]);

if (CBT_SAFETY_RULES.length < 7) {
  throw new Error(
    `[lumi-cbt] CBT_SAFETY_RULES floor breached: expected ≥7, got ${CBT_SAFETY_RULES.length}`,
  );
}

const SELF_HARM_PHRASES: ReadonlyArray<RegExp> = Object.freeze([
  /\bkill myself\b/i,
  /\bend it all\b/i,
  /\bsuicide\b/i,
  /\bwant to die\b/i,
  /\bhurt myself\b/i,
  /\bself[- ]harm\b/i,
  /\bno point living\b/i,
]);

export function containsSelfHarmIndicator(text: string): boolean {
  return SELF_HARM_PHRASES.some((p) => p.test(text));
}
