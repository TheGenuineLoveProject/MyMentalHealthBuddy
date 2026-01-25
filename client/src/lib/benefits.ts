export type BenefitKey =
  | "calm"
  | "clarity"
  | "consistency"
  | "growth"
  | "community"
  | "privacy";

export const BENEFITS: Record<BenefitKey, { title: string; body: string }> = {
  calm: { title: "Feel calmer faster", body: "Use short tools that reduce stress and bring you back to center." },
  clarity: { title: "Get clear next steps", body: "Turn messy thoughts into a simple plan you can act on today." },
  consistency: { title: "Build healthy habits", body: "Tiny routines that actually stick—without pressure or shame." },
  growth: { title: "Grow self-trust", body: "Reflect, learn, and strengthen your inner voice with guidance." },
  community: { title: "Feel less alone", body: "Supportive spaces that encourage respect, kindness, and boundaries." },
  privacy: { title: "Privacy-first by design", body: "You control what you save, share, or keep private—always." },
};

export type BenefitToken = 
  | "Agency"
  | "Boundaries" 
  | "Calm"
  | "Clarity"
  | "Connection"
  | "Control"
  | "Ease"
  | "Education"
  | "Freedom"
  | "Gentleness"
  | "Growth"
  | "Hope"
  | "Honesty"
  | "Identity"
  | "Joy"
  | "Knowledge"
  | "Learning"
  | "Momentum"
  | "Nurturing"
  | "Options"
  | "Peace"
  | "Quality"
  | "Respect"
  | "Self-respect"
  | "Trust"
  | "Understanding"
  | "Value"
  | "Wisdom"
  | "Your pace"
  | "Zen"
  | "Zero pressure";

export const BENEFIT_DESCRIPTIONS: Record<string, string> = {
  Agency: "You choose what you do, when, and how.",
  Boundaries: "Practice saying no and protecting your energy.",
  Calm: "Short tools to reduce stress and regain center.",
  Clarity: "Turn messy thoughts into actionable next steps.",
  Connection: "Feel less alone in your journey.",
  Control: "You're always in charge of what you share or keep private.",
  Ease: "Simple, gentle approaches that don't overwhelm.",
  Education: "Learn concepts that support your wellbeing.",
  Freedom: "No pressure, no judgment, no obligations.",
  Gentleness: "Compassionate pace that respects your limits.",
  Growth: "Build self-trust through reflection and learning.",
  Hope: "Small steps that lead to meaningful change.",
  Honesty: "Authentic tools for honest self-exploration.",
  Identity: "Discover and honor who you really are.",
  Joy: "Find moments of lightness and gratitude.",
  Knowledge: "Evidence-informed approaches you can trust.",
  Learning: "Continuous growth at your own speed.",
  Momentum: "Build consistency without shame.",
  Nurturing: "Tools that care for your whole self.",
  Options: "Multiple paths—choose what fits you.",
  Peace: "Create calm in your mind and environment.",
  Quality: "Thoughtfully designed, not rushed.",
  Respect: "Your experience is valid and valued.",
  "Self-respect": "Honor your needs and limits.",
  Trust: "Build trust in yourself and your choices.",
  Understanding: "Gain insight into your patterns.",
  Value: "Your time and energy matter here.",
  Wisdom: "Integrate lessons from your experiences.",
  "Your pace": "Go as slowly or quickly as feels right.",
  Zen: "Find stillness amid the noise.",
  "Zero pressure": "No deadlines, no guilt, no expectations.",
};

export function pickBenefits(tokens: BenefitToken[], count: number = 3): BenefitToken[] {
  return tokens.slice(0, count);
}

export function getBenefitDescription(token: BenefitToken): string {
  return BENEFIT_DESCRIPTIONS[token] || "";
}