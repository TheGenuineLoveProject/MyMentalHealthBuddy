/**
 * Phase 34 — Crisis safety contract.
 *
 * Module-load floor guard asserts the rule count.
 */

export interface CrisisSafetyRule {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly enforcement: "blocking" | "advisory";
}

export const CRISIS_SAFETY_RULES: ReadonlyArray<CrisisSafetyRule> = Object.freeze([
  {
    id: "reachable-within-2-taps",
    title: "Reachable from every page within 2 taps",
    detail: "Host wiring must place a /crisis link in the persistent footer or header on every route.",
    enforcement: "blocking",
  },
  {
    id: "displayed-within-500ms",
    title: "Resources displayed within 500ms of trigger detection",
    detail: "Trigger detector + panel render path must avoid blocking I/O (network/storage).",
    enforcement: "blocking",
  },
  {
    id: "no-account-required",
    title: "Never require account or login",
    detail: "Crisis panel renders for unauthenticated users. No paywall, no email gate.",
    enforcement: "blocking",
  },
  {
    id: "no-analytics",
    title: "Never log crisis interactions for analytics",
    detail: "No GA/Mixpanel/Segment events from CrisisPanel. No server log of trigger phrases.",
    enforcement: "blocking",
  },
  {
    id: "you-are-not-alone",
    title: "Always show \"You are not alone\"",
    detail: "Tone is calm and human. Never clinical, never cold, never lecturing.",
    enforcement: "blocking",
  },
  {
    id: "international-resources",
    title: "Include international resources",
    detail: "CRISIS_RESOURCES.international must be non-empty. US-only is a contract violation.",
    enforcement: "blocking",
  },
  {
    id: "no-lumi-no-decoration",
    title: "No Lumi avatar, no decorative elements on crisis surfaces",
    detail: "Aligned with lumi-registry placement-map: crisis-support is variant:null + assignment:forbidden.",
    enforcement: "blocking",
  },
]);

if (CRISIS_SAFETY_RULES.length < 7) {
  throw new Error(
    `[lumi-crisis] CRISIS_SAFETY_RULES floor breached: expected ≥7, got ${CRISIS_SAFETY_RULES.length}`,
  );
}
