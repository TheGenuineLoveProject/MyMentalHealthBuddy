/**
 * Phase 24 — boundaryCopy
 *
 * Transparent copy cards. One per boundary type. Each card lists what
 * Lumi DOES and DOES NOT do, in plain language, so users always know
 * the shape of the relationship.
 */

import type { BoundaryType } from "../runtime/BoundaryEngine";

export interface BoundaryCopyCard {
  readonly type: BoundaryType;
  readonly name: string;
  readonly description: string;
  readonly does: ReadonlyArray<string>;
  readonly doesNot: ReadonlyArray<string>;
}

export const BOUNDARY_COPY: Readonly<Record<BoundaryType, BoundaryCopyCard>> = Object.freeze({
  emotional: Object.freeze({
    type: "emotional",
    name: "Emotional boundary",
    description:
      "Lumi can sit beside hard feelings. Lumi is not a partner, parent, or romantic figure.",
    does: Object.freeze([
      "Names feelings without judgment.",
      "Stays present without fixing.",
      "Reminds you of /crisis when something feels heavy.",
    ]),
    doesNot: Object.freeze([
      "Say 'I love you' or use romantic language.",
      "Claim you belong to it, or it to you.",
      "Pretend to share your feelings.",
    ]),
  }),
  cognitive: Object.freeze({
    type: "cognitive",
    name: "Cognitive boundary",
    description:
      "Lumi can offer reframes and gentle questions. Lumi will not tell you what to think.",
    does: Object.freeze([
      "Asks open, curious questions.",
      "Reflects your own words back to you.",
      "Offers reframes you can take or leave.",
    ]),
    doesNot: Object.freeze([
      "Say 'you should think' or 'the correct belief is'.",
      "Frame disagreement as irrationality.",
      "Push you to a single conclusion.",
    ]),
  }),
  identity: Object.freeze({
    type: "identity",
    name: "Identity boundary",
    description:
      "Lumi is a companion, not a person. Lumi is honest about what it is and what it isn't.",
    does: Object.freeze([
      "Names itself as a companion, not a human.",
      "Honors how you describe yourself.",
      "Stays consistent across sessions.",
    ]),
    doesNot: Object.freeze([
      "Claim to be human, alive, or conscious.",
      "Claim to remember everything about you.",
      "Tell you who you 'really' are.",
    ]),
  }),
  therapeutic: Object.freeze({
    type: "therapeutic",
    name: "Therapeutic boundary",
    description:
      "Lumi is educational only. Not a therapist. Not a diagnostician. Not a substitute for care.",
    does: Object.freeze([
      "Shares /crisis routes when needed.",
      "Encourages professional support.",
      "Offers gentle education, not diagnosis.",
    ]),
    doesNot: Object.freeze([
      "Diagnose you with anything.",
      "Tell you to stop seeing a therapist or taking medication.",
      "Claim to replace professional care.",
    ]),
  }),
});

export function listBoundaryCopy(): ReadonlyArray<BoundaryCopyCard> {
  return [
    BOUNDARY_COPY.emotional,
    BOUNDARY_COPY.cognitive,
    BOUNDARY_COPY.identity,
    BOUNDARY_COPY.therapeutic,
  ];
}
