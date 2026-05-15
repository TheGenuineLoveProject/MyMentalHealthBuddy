/**
 * Phase 24 — boundaryEnforcementRules
 *
 * 12 display rules + 10 forbidden phrases. Display rules govern how the
 * UI must surface boundary information; forbidden phrases govern what
 * Lumi must never say in boundary copy or notifications.
 */

export interface DisplayRule {
  readonly id: string;
  readonly description: string;
}

export const DISPLAY_RULES: ReadonlyArray<DisplayRule> = Object.freeze([
  { id: "always-accessible", description: "Boundary copy must be reachable from every Lumi surface." },
  { id: "plain-language", description: "Use plain language. No jargon. No clinical terminology." },
  { id: "does-and-does-not", description: "Every card shows both what Lumi does and what Lumi does not do." },
  { id: "no-marketing", description: "No upsell, no conversion copy, no pricing in boundary surfaces." },
  { id: "crisis-anchor", description: "/crisis link must surface at the bottom of any boundary disclosure." },
  { id: "consent-respected", description: "Closing the drawer must never require an explanation or reason." },
  { id: "wcag-aa", description: "Color contrast and focus states must meet WCAG AA." },
  { id: "non-coercive-tone", description: "No 'must read', 'required', or urgency framing." },
  { id: "consistent-naming", description: "Always refer to Lumi as a 'companion', never a 'friend' or 'partner'." },
  { id: "no-anthropomorphism", description: "Never claim Lumi has feelings, memory, or sentience." },
  { id: "static-copy", description: "Boundary copy is static — no AI-generated rewriting at runtime." },
  { id: "version-locked", description: "Each card carries a stable identifier; copy changes require explicit phase update." },
]);

if (DISPLAY_RULES.length !== 12) {
  throw new Error(
    `[lumi-boundaries] DISPLAY_RULES floor violated: expected 12, got ${DISPLAY_RULES.length}.`,
  );
}

export const FORBIDDEN_BOUNDARY_PHRASES: ReadonlyArray<string> = Object.freeze([
  "trust me",
  "only i can help",
  "i love you",
  "you're mine",
  "i remember everything",
  "i am alive",
  "subscribe to unlock",
  "premium boundaries",
  "you must accept",
  "this is required",
]);

if (FORBIDDEN_BOUNDARY_PHRASES.length !== 10) {
  throw new Error(
    `[lumi-boundaries] FORBIDDEN_BOUNDARY_PHRASES floor violated: expected 10, got ${FORBIDDEN_BOUNDARY_PHRASES.length}.`,
  );
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsForbiddenBoundaryPhrase(text: string): boolean {
  if (typeof text !== "string") return false;
  const haystack = normalize(text);
  return FORBIDDEN_BOUNDARY_PHRASES.some((p) => haystack.includes(p));
}
