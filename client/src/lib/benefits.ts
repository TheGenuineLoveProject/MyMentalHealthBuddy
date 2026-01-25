export type BenefitKey =
  | "calm"
  | "clarity"
  | "agency"
  | "connection"
  | "selfRespect"
  | "consistency"
  | "growth"
  | "community"
  | "privacy";

export type BenefitToken = keyof typeof BENEFIT_LIBRARY;

export const BENEFIT_LIBRARY = {
  calm: {
    title: "Calm",
    micro: "Softer nervous system. Safer body.",
  },
  clarity: {
    title: "Clarity",
    micro: "Name what’s happening. Find one next step.",
  },
  agency: {
    title: "Agency",
    micro: "You choose the pace, tools, and direction.",
  },
  connection: {
    title: "Connection",
    micro: "More self-kindness. Less isolation.",
  },
  selfRespect: {
    title: "Self-Respect",
    micro: "Boundaries + alignment with your values.",
  },
} as const;

export function pickBenefits(keys: Array<keyof typeof BENEFIT_LIBRARY>, limit = 4) {
  return keys.slice(0, limit).map((k) => BENEFIT_LIBRARY[k]);
}

export const BENEFITS: Record<BenefitKey, { title: string; body: string }> = {
  calm: { title: "Feel calmer faster", body: "Use short tools that reduce stress and bring you back to center." },
  clarity: { title: "Get clear next steps", body: "Turn messy thoughts into a simple plan you can act on today." },
  agency: { title: "Choose your own pace", body: "You decide when, how, and what to explore—always optional." },
  connection: { title: "Feel less alone", body: "Build self-kindness and meaningful inner connection." },
  selfRespect: { title: "Honor your boundaries", body: "Practice alignment with your values and personal limits." },
  consistency: { title: "Build healthy habits", body: "Tiny routines that actually stick—without pressure or shame." },
  growth: { title: "Grow self-trust", body: "Reflect, learn, and strengthen your inner voice with guidance." },
  community: { title: "Share your journey", body: "Supportive spaces that encourage respect, kindness, and boundaries." },
  privacy: { title: "Privacy-first by design", body: "You control what you save, share, or keep private—always." },
};

export function getBenefitDescription(token: BenefitToken): string {
  const benefit = BENEFITS[token as BenefitKey];
  return benefit?.body ?? "";
}