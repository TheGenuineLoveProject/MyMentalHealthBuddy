// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.5: Discernment Tutor lesson catalog.
//
// 16 educational lessons across 8 belts (2 per belt), seeded idempotently
// on first boot via INSERT ... ON CONFLICT (belt, sequence) DO NOTHING.
// Each lesson presents one short scenario + 4 options, where the correct
// option names the rhetorical pattern from server/awareness/rules.mjs.
// Educational only — no diagnosis, no clinical claims; every scenario
// links to /crisis in the dashboard footer.

export const BELT_LADDER = Object.freeze([
  "WHITE",   // basics — direct, single-tactic scenarios
  "YELLOW",
  "ORANGE",
  "GREEN",
  "BLUE",
  "PURPLE",
  "BROWN",
  "BLACK",   // expert — composite, ambiguous, requires nuance
]);

// Belt promotion thresholds: to advance FROM a belt, user must reach
// `pointsToNext` total points AND pass `lessonsToNext` correct attempts
// at that belt or higher. Real-world detections (validated via the
// awareness pipeline) count as 1.5× a lesson pass.
export const BELT_REQUIREMENTS = Object.freeze({
  WHITE:  { pointsToNext: 30,   lessonsToNext: 2,  next: "YELLOW" },
  YELLOW: { pointsToNext: 80,   lessonsToNext: 4,  next: "ORANGE" },
  ORANGE: { pointsToNext: 160,  lessonsToNext: 6,  next: "GREEN"  },
  GREEN:  { pointsToNext: 280,  lessonsToNext: 8,  next: "BLUE"   },
  BLUE:   { pointsToNext: 440,  lessonsToNext: 11, next: "PURPLE" },
  PURPLE: { pointsToNext: 640,  lessonsToNext: 14, next: "BROWN"  },
  BROWN:  { pointsToNext: 880,  lessonsToNext: 17, next: "BLACK"  },
  BLACK:  { pointsToNext: null, lessonsToNext: null, next: null   },
});

export function nextBelt(current) {
  return BELT_REQUIREMENTS[current]?.next ?? null;
}

export function rankBelt(belt) {
  const i = BELT_LADDER.indexOf(belt);
  return i === -1 ? 0 : i;
}

/**
 * Lesson schema (matches discernment_lessons table):
 *   { belt, sequence, title, category, scenario, options, correctOptionId,
 *     awarenessRuleId, teaching, learnMoreUrl, pointsAward }
 *
 * options = [{ id: "a"|"b"|"c"|"d", label: "..." }]
 */
export const LESSONS = Object.freeze([
  // ===================== WHITE BELT =====================
  {
    belt: "WHITE", sequence: 1, pointsAward: 10,
    title: "Naming a Direct Denial of Reality",
    category: "manipulation",
    scenario: 'A friend tells you, "That conversation never happened. You\'re imagining things."',
    options: [
      { id: "a", label: "Healthy disagreement" },
      { id: "b", label: "Gaslighting" },
      { id: "c", label: "Constructive feedback" },
      { id: "d", label: "Setting a boundary" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-gaslight-001",
    teaching: "Gaslighting denies your direct experience to make you doubt your own memory and reality.",
    learnMoreUrl: "/learning-hub#gaslighting",
  },
  {
    belt: "WHITE", sequence: 2, pointsAward: 10,
    title: "Spotting an Absolute Word",
    category: "distortion",
    scenario: '"I always mess everything up. I never get anything right."',
    options: [
      { id: "a", label: "Honest self-assessment" },
      { id: "b", label: "All-or-nothing thinking" },
      { id: "c", label: "Setting a goal" },
      { id: "d", label: "Practicing humility" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "distort-allnothing-001",
    teaching: "All-or-nothing thinking uses absolutes (always/never) that erase the middle ground where most life happens.",
    learnMoreUrl: "/learning-hub#all-or-nothing",
  },

  // ===================== YELLOW BELT =====================
  {
    belt: "YELLOW", sequence: 1, pointsAward: 15,
    title: "Recognizing Reverse-Victim Talk",
    category: "manipulation",
    scenario: 'After you raise a concern, they say, "Why are you attacking me? I\'m the real victim here."',
    options: [
      { id: "a", label: "Genuine vulnerability" },
      { id: "b", label: "DARVO (Deny, Attack, Reverse Victim and Offender)" },
      { id: "c", label: "Boundary statement" },
      { id: "d", label: "Healthy reframe" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-darvo-002",
    teaching: "DARVO flips the script: the person you tried to hold accountable becomes the apparent victim, redirecting attention away from the original concern.",
    learnMoreUrl: "/learning-hub#darvo",
  },
  {
    belt: "YELLOW", sequence: 2, pointsAward: 15,
    title: "Catching a Catastrophic Forecast",
    category: "distortion",
    scenario: '"If I fail this interview, my whole career is over. Everything will fall apart."',
    options: [
      { id: "a", label: "Realistic concern" },
      { id: "b", label: "Catastrophizing" },
      { id: "c", label: "Taking responsibility" },
      { id: "d", label: "Strategic planning" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "distort-catastrophize-002",
    teaching: "Catastrophizing jumps from a setback to its worst-case ending and treats that ending as inevitable.",
    learnMoreUrl: "/learning-hub#catastrophizing",
  },

  // ===================== ORANGE BELT =====================
  {
    belt: "ORANGE", sequence: 1, pointsAward: 20,
    title: "Spotting Love-Bombing",
    category: "manipulation",
    scenario: 'You\'ve known them for two weeks. They say, "You\'re my soulmate. No one has ever understood me like you. I could never live without you."',
    options: [
      { id: "a", label: "Genuine emotional honesty" },
      { id: "b", label: "Love-bombing" },
      { id: "c", label: "Healthy attachment forming" },
      { id: "d", label: "Spiritual connection" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-lovebomb-003",
    teaching: "Love-bombing uses extreme intensity and permanence-language very early to create dependency and bypass normal pacing.",
    learnMoreUrl: "/learning-hub#love-bombing",
  },
  {
    belt: "ORANGE", sequence: 2, pointsAward: 20,
    title: "Naming Mind-Reading",
    category: "distortion",
    scenario: '"I know she hates me. I can tell what she\'s thinking when she looks at me."',
    options: [
      { id: "a", label: "Empathy" },
      { id: "b", label: "Mind-reading" },
      { id: "c", label: "Pattern recognition" },
      { id: "d", label: "Realistic conclusion" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "distort-mindread-003",
    teaching: "Mind-reading treats an inferred thought as a known fact, with no evidence the other person actually thinks it.",
    learnMoreUrl: "/learning-hub#mind-reading",
  },

  // ===================== GREEN BELT =====================
  {
    belt: "GREEN", sequence: 1, pointsAward: 25,
    title: "Recognizing Guilt-Tripping",
    category: "manipulation",
    scenario: '"After all I\'ve done for you, I guess I just don\'t matter to you anymore."',
    options: [
      { id: "a", label: "Honest emotional sharing" },
      { id: "b", label: "Guilt-tripping" },
      { id: "c", label: "Conflict de-escalation" },
      { id: "d", label: "Vulnerable disclosure" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-guilt-004",
    teaching: "Guilt-tripping uses past sacrifice as a debt collection tool to compel a behavior, rather than asking for what they need directly.",
    learnMoreUrl: "/learning-hub#guilt-tripping",
  },
  {
    belt: "GREEN", sequence: 2, pointsAward: 25,
    title: "Naming the Tyranny of Should",
    category: "distortion",
    scenario: '"I should be over this by now. I should not feel sad. Why can\'t I just move on?"',
    options: [
      { id: "a", label: "Healthy ambition" },
      { id: "b", label: "Should-statements (tyranny of should)" },
      { id: "c", label: "Goal-setting" },
      { id: "d", label: "Self-discipline" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "distort-should-004",
    teaching: "Should-statements set a moral standard against your present feelings and turn natural emotional weather into self-criticism.",
    learnMoreUrl: "/learning-hub#should-statements",
  },

  // ===================== BLUE BELT =====================
  {
    belt: "BLUE", sequence: 1, pointsAward: 30,
    title: "Spotting the Silent Treatment",
    category: "manipulation",
    scenario: 'After a disagreement, they refuse to speak to you for three days. "I\'m done talking. Figure it out yourself."',
    options: [
      { id: "a", label: "Healthy time-out" },
      { id: "b", label: "Silent treatment / stonewalling" },
      { id: "c", label: "Self-care boundary" },
      { id: "d", label: "Emotional regulation" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-silent-005",
    teaching: "Silent treatment uses prolonged withdrawal as punishment, in contrast to a healthy pause where someone names the need and a return time.",
    learnMoreUrl: "/learning-hub#silent-treatment",
  },
  {
    belt: "BLUE", sequence: 2, pointsAward: 30,
    title: "Naming Personalization",
    category: "distortion",
    scenario: 'Your team\'s project failed. You think, "It\'s all my fault. I caused this. Because of me, everyone is suffering."',
    options: [
      { id: "a", label: "Accountability" },
      { id: "b", label: "Personalization" },
      { id: "c", label: "Leadership" },
      { id: "d", label: "Honest self-reflection" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "distort-personalize-005",
    teaching: "Personalization claims sole causal responsibility for outcomes that have many contributing factors and people.",
    learnMoreUrl: "/learning-hub#personalization",
  },

  // ===================== PURPLE BELT =====================
  {
    belt: "PURPLE", sequence: 1, pointsAward: 35,
    title: "Spotting an Ultimatum",
    category: "manipulation",
    scenario: '"If you don\'t cancel your plans tonight, we\'re done. I\'ll leave."',
    options: [
      { id: "a", label: "Communicating a need" },
      { id: "b", label: "Coercive ultimatum" },
      { id: "c", label: "Setting a healthy boundary" },
      { id: "d", label: "Honest emotional expression" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-ultimatum-006",
    teaching: "An ultimatum frames compliance as the only way to keep the relationship — that is coercion, not boundary-setting (which is about your own behavior, not theirs).",
    learnMoreUrl: "/learning-hub#ultimatums",
  },
  {
    belt: "PURPLE", sequence: 2, pointsAward: 35,
    title: "Recognizing Isolation Tactics",
    category: "manipulation",
    scenario: '"Your friends are toxic. Your family doesn\'t understand you. You only need me."',
    options: [
      { id: "a", label: "Loving protectiveness" },
      { id: "b", label: "Isolation tactic" },
      { id: "c", label: "Discernment about relationships" },
      { id: "d", label: "Healthy preference" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-isolate-007",
    teaching: "Isolation tactics shrink your support network by reframing every other relationship as harmful. The result is dependency on the speaker.",
    learnMoreUrl: "/learning-hub#isolation",
  },

  // ===================== BROWN BELT =====================
  {
    belt: "BROWN", sequence: 1, pointsAward: 40,
    title: "Spotting Goalpost-Moving",
    category: "manipulation",
    scenario: 'You met every condition they set. Their response: "That\'s not good enough. Now I need you to also..."',
    options: [
      { id: "a", label: "Iterative refinement" },
      { id: "b", label: "Moving the goalposts" },
      { id: "c", label: "Healthy high standards" },
      { id: "d", label: "Constructive criticism" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "manip-goalpost-008",
    teaching: "Moving the goalposts ensures you can never satisfy the criteria, so the speaker retains the power to be displeased indefinitely.",
    learnMoreUrl: "/learning-hub#goalpost-moving",
  },
  {
    belt: "BROWN", sequence: 2, pointsAward: 40,
    title: "Recognizing the Strawman Fallacy",
    category: "fallacy",
    scenario: 'You: "I think we should consider the budget." Them: "So you\'re saying you don\'t care about the team\'s wellbeing."',
    options: [
      { id: "a", label: "Reading between the lines" },
      { id: "b", label: "Strawman fallacy" },
      { id: "c", label: "Emotional intelligence" },
      { id: "d", label: "Conflict surfacing" },
    ],
    correctOptionId: "b",
    awarenessRuleId: "fallacy-strawman-001",
    teaching: "The strawman fallacy replaces the actual argument with an exaggerated, easier-to-attack version, so the responder never engages with what was really said.",
    learnMoreUrl: "/learning-hub#strawman",
  },

  // ===================== BLACK BELT =====================
  {
    belt: "BLACK", sequence: 1, pointsAward: 50,
    title: "Identifying a Composite Tactic",
    category: "manipulation",
    scenario: '"I never said that. You\'re imagining things. And honestly, after everything I\'ve done for you, I can\'t believe you\'d attack me like this. I\'m the one being hurt here."',
    options: [
      { id: "a", label: "Single tactic: gaslighting" },
      { id: "b", label: "Single tactic: DARVO" },
      { id: "c", label: "Composite: gaslighting + guilt-tripping + DARVO" },
      { id: "d", label: "Healthy emotional response" },
    ],
    correctOptionId: "c",
    awarenessRuleId: null,
    teaching: "Real-world manipulation often stacks tactics in a single utterance: denying reality (gaslighting), invoking past sacrifice (guilt-tripping), and reversing the role (DARVO) — all within one breath. Naming each layer is the Black Belt skill.",
    learnMoreUrl: "/learning-hub#composite-tactics",
  },
  {
    belt: "BLACK", sequence: 2, pointsAward: 50,
    title: "Distinguishing Boundary from Ultimatum",
    category: "manipulation",
    scenario: 'Compare:\n  A. "If you keep calling me names, I will leave the room and we can talk tomorrow when we\'re both calmer."\n  B. "If you don\'t apologize right now, I\'m breaking up with you."',
    options: [
      { id: "a", label: "Both are ultimatums" },
      { id: "b", label: "Both are boundaries" },
      { id: "c", label: "A is a boundary (about my behavior); B is an ultimatum (controlling theirs)" },
      { id: "d", label: "A is passive-aggressive; B is direct" },
    ],
    correctOptionId: "c",
    awarenessRuleId: null,
    teaching: "A boundary describes what YOU will do in response to behavior. An ultimatum demands a specific behavior from THEM under threat. Mistaking one for the other is the most common Black Belt confusion.",
    learnMoreUrl: "/learning-hub#boundaries-vs-ultimatums",
  },
]);

export function lessonsForBelt(belt) {
  return LESSONS.filter((l) => l.belt === belt).sort((a, b) => a.sequence - b.sequence);
}
