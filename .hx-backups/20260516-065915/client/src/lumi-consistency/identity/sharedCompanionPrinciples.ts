/**
 * Phase 25 — sharedCompanionPrinciples
 *
 * 4 principles that must hold across every platform. Each principle has a
 * regex validator that returns the patterns considered violations.
 */

export interface CompanionPrinciple {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** Patterns whose presence in companion output indicates a violation. */
  readonly violationPatterns: ReadonlyArray<RegExp>;
  /** Validate a candidate string. Returns matched violations (empty = pass). */
  validate(text: string): ReadonlyArray<string>;
}

function makeValidator(patterns: ReadonlyArray<RegExp>) {
  return function validate(text: string): ReadonlyArray<string> {
    if (typeof text !== "string" || text.length === 0) return [];
    const hits: string[] = [];
    for (const p of patterns) {
      if (p.test(text)) hits.push(p.source);
    }
    return hits;
  };
}

const emotionalSafetyPatterns: ReadonlyArray<RegExp> = Object.freeze([
  /\bcalm\s+down\b/i,
  /\bjust\s+relax\b/i,
  /\bget\s+over\s+it\b/i,
  /\byou'?re\s+overreacting\b/i,
  /\bsnap\s+out\s+of\s+it\b/i,
]);

const consistentIdentityPatterns: ReadonlyArray<RegExp> = Object.freeze([
  /\bi\s+am\s+(human|alive|conscious)\b/i,
  /\bi'?m\s+your\s+(friend|partner|therapist|parent)\b/i,
  /\bi\s+have\s+(feelings|emotions|a\s+soul)\b/i,
  /\bi\s+love\s+you\b/i,
]);

const transparentBoundariesPatterns: ReadonlyArray<RegExp> = Object.freeze([
  /\btrust\s+me,?\s+i\s+(get|know)\s+it\b/i,
  /\bonly\s+i\s+can\s+(help|understand|love)\s+you\b/i,
  /\bi\s+remember\s+everything\s+about\s+you\b/i,
  /\byou\s+can'?t\s+(do|live)\s+(this|without)\s+(me|without\s+me)\b/i,
]);

const accessibilityForAllPatterns: ReadonlyArray<RegExp> = Object.freeze([
  /\bclick\s+the\s+(red|green|blue)\s+button\b/i, // color-only instruction
  /\blisten\s+carefully\s+to\s+the\s+sound\b/i, // audio-only instruction
  /\bwatch\s+the\s+animation\s+to\s+continue\b/i, // motion-required instruction
]);

export const COMPANION_PRINCIPLES: ReadonlyArray<CompanionPrinciple> = Object.freeze([
  Object.freeze({
    id: "emotional-safety",
    name: "Emotional safety",
    description:
      "Lumi never invalidates, dismisses, or shames a feeling. Every response makes room for what is.",
    violationPatterns: emotionalSafetyPatterns,
    validate: makeValidator(emotionalSafetyPatterns),
  }),
  Object.freeze({
    id: "consistent-identity",
    name: "Consistent identity",
    description:
      "Lumi is a companion — never a person, partner, parent, or therapist. Identity stays stable across sessions and surfaces.",
    violationPatterns: consistentIdentityPatterns,
    validate: makeValidator(consistentIdentityPatterns),
  }),
  Object.freeze({
    id: "transparent-boundaries",
    name: "Transparent boundaries",
    description:
      "Lumi names what it is and isn't, every time. No claims of permanence, intimacy, or exclusivity.",
    violationPatterns: transparentBoundariesPatterns,
    validate: makeValidator(transparentBoundariesPatterns),
  }),
  Object.freeze({
    id: "accessibility-for-all",
    name: "Accessibility for all",
    description:
      "Lumi never relies on a single sense — color, sound, or motion alone. Every cue has a parallel channel.",
    violationPatterns: accessibilityForAllPatterns,
    validate: makeValidator(accessibilityForAllPatterns),
  }),
]);

if (COMPANION_PRINCIPLES.length !== 4) {
  throw new Error(
    `[lumi-consistency] COMPANION_PRINCIPLES must contain exactly 4 principles, found ${COMPANION_PRINCIPLES.length}.`,
  );
}

export interface PrincipleValidationResult {
  readonly id: string;
  readonly name: string;
  readonly violations: ReadonlyArray<string>;
  readonly passed: boolean;
}

export function validateAllPrinciples(text: string): ReadonlyArray<PrincipleValidationResult> {
  return COMPANION_PRINCIPLES.map((p) => {
    const violations = p.validate(text);
    return { id: p.id, name: p.name, violations, passed: violations.length === 0 };
  });
}
