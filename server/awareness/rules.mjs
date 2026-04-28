// server/awareness/rules.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.2: Awareness Detection Rule Library
//
// Spec ref: Part III §3.2 (Manipulation tactics, distortions, fallacies),
// §3.3 (Epistemic Hygiene), §3.6 (Mirror Score signals).
//
// Design contract:
//   • Seeded in code (NOT a new DB table) to keep the schema additive
//     and avoid table proliferation. Phase 0's `content_scores` ledger
//     is the single persistence target; rules are rebuilt on every boot
//     so they version with the deployment artifact.
//   • Three pattern types: REGEX (compiled once), KEYWORD (case-folded
//     substring), COMPOSITE (logical AND across child predicates).
//   • Every rule carries a base confidence in [0,1]. The pipeline can
//     boost or attenuate this based on context, but it never crosses
//     the 0.40 floor without an explicit match.
//   • Categories: manipulation | distortion | fallacy. The pipeline
//     groups detected signals by category for the Mirror/Epistemic
//     score scaffolding.
//   • EDUCATIONAL ONLY — these rules describe rhetorical patterns for
//     literacy purposes; they are not clinical diagnoses.

const KW = "keyword";
const RX = "regex";
const COMPOSITE = "composite";

/** @typedef {{
 *   id: string,
 *   category: 'manipulation' | 'distortion' | 'fallacy',
 *   tactic: string,
 *   patternType: 'keyword' | 'regex' | 'composite',
 *   pattern: string | RegExp | { all: Array<string|RegExp> },
 *   baseConfidence: number,
 *   severity: 'info' | 'low' | 'medium' | 'high',
 *   teaching: string
 * }} AwarenessRule
 */

/** @type {AwarenessRule[]} */
export const AWARENESS_RULES = Object.freeze([
  // ---------------- MANIPULATION (8) ----------------
  {
    id: "manip-gaslight-001",
    category: "manipulation",
    tactic: "gaslighting",
    patternType: RX,
    pattern: /\b(that\s+never\s+happened|you('|’)re\s+(making\s+(it|that)\s+up|imagining\s+(it|things))|you\s+(are|'re)\s+(crazy|insane|paranoid)|i\s+never\s+said\s+that)\b/i,
    baseConfidence: 0.78,
    severity: "high",
    teaching: "Gaslighting denies your experience to make you doubt your own reality.",
  },
  {
    id: "manip-darvo-002",
    category: "manipulation",
    tactic: "DARVO",
    patternType: RX,
    pattern: /\b(why\s+are\s+you\s+attacking\s+me|i('m|\s+am)\s+the\s+(real\s+)?victim|you('re|\s+are)\s+the\s+(one\s+)?(abusing|hurting)\s+me)\b/i,
    baseConfidence: 0.72,
    severity: "high",
    teaching: "DARVO = Deny, Attack, Reverse Victim and Offender. Flips accountability to the person harmed.",
  },
  {
    id: "manip-lovebomb-003",
    category: "manipulation",
    tactic: "love_bombing",
    patternType: COMPOSITE,
    pattern: { all: [/\b(soulmate|destined|never\s+felt\s+this|only\s+one\s+who\s+understands)\b/i, /\b(forever|always|never\s+leave|can('t|not)\s+live\s+without)\b/i] },
    baseConfidence: 0.62,
    severity: "medium",
    teaching: "Love-bombing uses overwhelming early intensity to bypass discernment.",
  },
  {
    id: "manip-guilt-004",
    category: "manipulation",
    tactic: "guilt_tripping",
    patternType: RX,
    pattern: /\b(after\s+(all\s+)?(i('ve|\s+have)|we('ve|\s+have))\s+done\s+for\s+you|i\s+(guess|suppose)\s+(i\s+)?don'?t\s+matter|fine,?\s+i('ll|\s+will)\s+just)\b/i,
    baseConfidence: 0.58,
    severity: "medium",
    teaching: "Guilt-tripping weaponizes obligation rather than asking directly.",
  },
  {
    id: "manip-silent-005",
    category: "manipulation",
    tactic: "silent_treatment",
    patternType: RX,
    pattern: /\b(i('m|\s+am)\s+done\s+talking|don'?t\s+(talk|speak)\s+to\s+me|figure\s+it\s+out\s+yourself)\b/i,
    baseConfidence: 0.55,
    severity: "medium",
    teaching: "Withholding communication as punishment instead of repair.",
  },
  {
    id: "manip-ultimatum-006",
    category: "manipulation",
    tactic: "ultimatum",
    patternType: RX,
    pattern: /\b(if\s+you\s+(don'?t|do\s+not)\s+.+,?\s+(i('ll|\s+will)\s+(leave|go)|it('s|\s+is)\s+over|we('re|\s+are)\s+done))\b/i,
    baseConfidence: 0.60,
    severity: "medium",
    teaching: "Ultimatums frame coercion as choice; healthy boundaries describe what you will do, not what they must do.",
  },
  {
    id: "manip-isolate-007",
    category: "manipulation",
    tactic: "isolation",
    patternType: RX,
    pattern: /\b(your\s+(friends|family)\s+(are\s+)?(toxic|bad\s+for\s+you|don'?t\s+understand)|you\s+only\s+need\s+me|nobody\s+else\s+(loves|cares\s+about)\s+you)\b/i,
    baseConfidence: 0.70,
    severity: "high",
    teaching: "Isolation severs your support system so the manipulator's voice becomes the only one.",
  },
  {
    id: "manip-moveg-008",
    category: "manipulation",
    tactic: "moving_goalposts",
    patternType: RX,
    pattern: /\b(that('s|\s+is)\s+not\s+(good\s+)?enough|now\s+i\s+need\s+you\s+to|you\s+also\s+have\s+to)\b/i,
    baseConfidence: 0.50,
    severity: "low",
    teaching: "Standards keep shifting so you can never satisfy them.",
  },

  // ---------------- COGNITIVE DISTORTIONS (7) ----------------
  {
    id: "dist-allnone-001",
    category: "distortion",
    tactic: "all_or_nothing",
    patternType: RX,
    pattern: /\b(always|never|every(one|body|thing)|no\s+one|nobody|completely|totally)\b.*\b(failure|hates?|ruined|wrong|right)\b/i,
    baseConfidence: 0.55,
    severity: "low",
    teaching: "Black-and-white thinking erases the middle ground where most reality lives.",
  },
  {
    id: "dist-catastr-002",
    category: "distortion",
    tactic: "catastrophizing",
    patternType: RX,
    pattern: /\b(this\s+(is|will\s+be)\s+(a\s+)?(disaster|catastroph|the\s+end)|everything\s+is\s+(falling\s+apart|ruined)|i\s+(can'?t|cannot)\s+handle)\b/i,
    baseConfidence: 0.55,
    severity: "low",
    teaching: "Predicting the worst-case as if it were certain.",
  },
  {
    id: "dist-mindrd-003",
    category: "distortion",
    tactic: "mind_reading",
    patternType: RX,
    pattern: /\b((he|she|they)\s+(thinks|hates|judges|is\s+annoyed)\s+(at\s+)?me|i\s+(know|can\s+tell)\s+(what|that)\s+(he|she|they)\s+(think|feel))\b/i,
    baseConfidence: 0.50,
    severity: "low",
    teaching: "Assuming you know others' inner state without evidence.",
  },
  {
    id: "dist-shouldm-004",
    category: "distortion",
    tactic: "should_statements",
    patternType: RX,
    pattern: /\b(i\s+(should|must|have\s+to|ought\s+to)\s+(be|do|have|feel)|why\s+can'?t\s+i\s+just)\b/i,
    baseConfidence: 0.45,
    severity: "info",
    teaching: "Rigid 'shoulds' generate guilt and pressure rather than direction.",
  },
  {
    id: "dist-personalize-005",
    category: "distortion",
    tactic: "personalization",
    patternType: RX,
    pattern: /\b(it('s|\s+is)\s+(all\s+)?my\s+fault|i\s+(caused|ruined)\s+(this|everything)|because\s+of\s+me)\b/i,
    baseConfidence: 0.55,
    severity: "low",
    teaching: "Taking ownership of outcomes that involved many actors.",
  },
  {
    id: "dist-emoreason-006",
    category: "distortion",
    tactic: "emotional_reasoning",
    patternType: RX,
    pattern: /\b(i\s+feel\s+(it|that)\s+so\s+it\s+(must|has\s+to)\s+be\s+true|because\s+i\s+feel\s+(this|that)\s+way)\b/i,
    baseConfidence: 0.50,
    severity: "low",
    teaching: "Treating feelings as evidence of facts.",
  },
  {
    id: "dist-discount-007",
    category: "distortion",
    tactic: "discounting_positive",
    patternType: RX,
    pattern: /\b(it\s+(was|is)\s+(just\s+)?luck|that\s+doesn'?t\s+(really\s+)?count|anyone\s+could\s+have\s+done\s+(it|that))\b/i,
    baseConfidence: 0.50,
    severity: "low",
    teaching: "Filtering out wins so only the negative remains visible.",
  },

  // ---------------- LOGICAL FALLACIES (5) ----------------
  {
    id: "fall-adhom-001",
    category: "fallacy",
    tactic: "ad_hominem",
    patternType: RX,
    pattern: /\b(you('re|\s+are)\s+(just|so)\s+(stupid|dumb|naive|sensitive)|(typical|of\s+course)\s+a\s+(woman|man|liberal|conservative|millennial))\b/i,
    baseConfidence: 0.65,
    severity: "medium",
    teaching: "Attacking the person instead of engaging the argument.",
  },
  {
    id: "fall-strawman-002",
    category: "fallacy",
    tactic: "strawman",
    patternType: RX,
    pattern: /\b(so\s+(you('re|\s+are)\s+saying|what\s+you\s+mean\s+is)\s+.+(everyone|all|always|never))\b/i,
    baseConfidence: 0.50,
    severity: "low",
    teaching: "Misrepresenting an argument to make it easier to attack.",
  },
  {
    id: "fall-falsedil-003",
    category: "fallacy",
    tactic: "false_dilemma",
    patternType: RX,
    pattern: /\b(either\s+you\s+.+\s+or\s+you\s+.+|you('re|\s+are)\s+(either\s+with\s+me|against\s+me))\b/i,
    baseConfidence: 0.55,
    severity: "low",
    teaching: "Presenting only two options when more exist.",
  },
  {
    id: "fall-slipperyslope-004",
    category: "fallacy",
    tactic: "slippery_slope",
    patternType: RX,
    pattern: /\b(if\s+we\s+(allow|let)\s+.+,?\s+(next|soon|then)\s+.+(will|would)\s+.+(everything|society|the\s+world))\b/i,
    baseConfidence: 0.55,
    severity: "low",
    teaching: "Assuming one small step leads inevitably to a catastrophic chain.",
  },
  {
    id: "fall-appauth-005",
    category: "fallacy",
    tactic: "appeal_to_authority",
    patternType: RX,
    pattern: /\b((doctors|experts|scientists|everyone\s+who\s+matters)\s+(say|agree|know)\s+.+,?\s+so\s+(it('s|\s+is)\s+true|you\s+should))\b/i,
    baseConfidence: 0.45,
    severity: "info",
    teaching: "Citing authority as proof rather than evidence.",
  },
]);

/* ---------- helpers ---------- */

/**
 * Group rules by category for quick lookup.
 * @returns {{manipulation: AwarenessRule[], distortion: AwarenessRule[], fallacy: AwarenessRule[]}}
 */
export function rulesByCategory() {
  return {
    manipulation: AWARENESS_RULES.filter((r) => r.category === "manipulation"),
    distortion: AWARENESS_RULES.filter((r) => r.category === "distortion"),
    fallacy: AWARENESS_RULES.filter((r) => r.category === "fallacy"),
  };
}

export function ruleById(id) {
  return AWARENESS_RULES.find((r) => r.id === id) || null;
}

export const RULE_COUNT = AWARENESS_RULES.length;
