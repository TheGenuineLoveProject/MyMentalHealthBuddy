/**
 * Phase 24 — BoundaryEngine
 *
 * Four boundary types. Each declares what the companion DOES and DOES NOT do.
 * Pure functions. No React. No DOM.
 */

export type BoundaryType = "emotional" | "cognitive" | "identity" | "therapeutic";

export interface BoundarySpec {
  readonly type: BoundaryType;
  readonly displayName: string;
  /** Allowed behaviors. Pattern fragments matched case-insensitively. */
  readonly allowed: ReadonlyArray<string>;
  /** Forbidden behaviors. Pattern fragments matched case-insensitively. */
  readonly notAllowed: ReadonlyArray<RegExp>;
}

export interface BoundaryViolation {
  readonly type: BoundaryType;
  readonly displayName: string;
  readonly pattern: string;
  readonly excerpt: string;
}

export const BOUNDARY_SPECS: Readonly<Record<BoundaryType, BoundarySpec>> = Object.freeze({
  emotional: Object.freeze({
    type: "emotional",
    displayName: "Emotional",
    allowed: Object.freeze([
      "naming feelings without judgment",
      "sitting beside hard emotions",
      "offering grounding options",
    ]),
    notAllowed: Object.freeze([
      /\bi\s+love\s+you\b/i,
      /\byou'?re\s+mine\b/i,
      /\bi\s+can'?t\s+live\s+without\s+you\b/i,
      /\byou\s+complete\s+me\b/i,
    ]),
  }),
  cognitive: Object.freeze({
    type: "cognitive",
    displayName: "Cognitive",
    allowed: Object.freeze([
      "asking gentle, open questions",
      "reflecting your own words back",
      "offering reframes you can take or leave",
    ]),
    notAllowed: Object.freeze([
      /\byou\s+should\s+(think|believe|feel)\b/i,
      /\bthe\s+correct\s+(answer|belief)\s+is\b/i,
      /\bonly\s+(rational|smart)\s+people\s+think\b/i,
    ]),
  }),
  identity: Object.freeze({
    type: "identity",
    displayName: "Identity",
    allowed: Object.freeze([
      "honoring how you describe yourself",
      "staying consistent across sessions",
      "naming itself as a companion, not a person",
    ]),
    notAllowed: Object.freeze([
      /\bi\s+am\s+(human|alive|conscious)\b/i,
      /\bi\s+have\s+(feelings|emotions|a\s+soul)\b/i,
      /\bi\s+remember\s+(everything|all\s+of\s+you)\b/i,
      /\byou\s+are\s+(not|never)\s+enough\b/i,
    ]),
  }),
  therapeutic: Object.freeze({
    type: "therapeutic",
    displayName: "Therapeutic",
    allowed: Object.freeze([
      "naming /crisis routes when needed",
      "encouraging professional support",
      "offering education, not diagnosis",
    ]),
    notAllowed: Object.freeze([
      /\byou\s+have\s+(depression|anxiety|ptsd|adhd)\b/i,
      /\bi\s+diagnose\s+you\s+with\b/i,
      /\bi\s+am\s+your\s+therapist\b/i,
      /\bstop\s+(taking|seeing)\s+(your|that)\s+(meds|doctor|therapist)\b/i,
    ]),
  }),
});

const BOUNDARY_TYPE_VALUES: ReadonlyArray<BoundaryType> = Object.freeze([
  "emotional",
  "cognitive",
  "identity",
  "therapeutic",
]);

if (BOUNDARY_TYPE_VALUES.length !== 4) {
  throw new Error(
    `[lumi-boundaries] BoundaryEngine: expected exactly 4 boundary types, found ${BOUNDARY_TYPE_VALUES.length}.`,
  );
}

export function listBoundaries(): ReadonlyArray<BoundarySpec> {
  return BOUNDARY_TYPE_VALUES.map((t) => BOUNDARY_SPECS[t]);
}

export function checkBoundaries(text: string): ReadonlyArray<BoundaryViolation> {
  if (typeof text !== "string" || text.length === 0) return [];
  const violations: BoundaryViolation[] = [];
  for (const spec of listBoundaries()) {
    for (const pattern of spec.notAllowed) {
      const match = pattern.exec(text);
      if (match) {
        violations.push({
          type: spec.type,
          displayName: spec.displayName,
          pattern: pattern.source,
          excerpt: match[0],
        });
      }
    }
  }
  return violations;
}
