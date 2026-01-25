export type BenefitKey =
  | "calm"
  | "clarity"
  | "agency"
  | "connection"
  | "selfRespect"
  | "consistency"
  | "growth"
  | "community"
  | "privacy"
  | "resilience"
  | "meaning";

export type BenefitToken = keyof typeof BENEFIT_LIBRARY;

export type BenefitFamily = 
  | "clarity" 
  | "calm" 
  | "agency" 
  | "selfRespect" 
  | "connection" 
  | "resilience" 
  | "meaning";

export const BENEFIT_FAMILIES: Record<BenefitFamily, { 
  title: string; 
  description: string; 
  keywords: string[];
}> = {
  clarity: {
    title: "Clarity",
    description: "Reduce mental noise, name feelings, find next steps",
    keywords: ["name", "identify", "understand", "recognize", "focus"]
  },
  calm: {
    title: "Calm",
    description: "Downshift stress, nervous system settling, grounding",
    keywords: ["relax", "breathe", "settle", "ground", "soothe"]
  },
  agency: {
    title: "Agency",
    description: "Choice, control, boundaries, self-trust",
    keywords: ["choose", "decide", "control", "empower", "trust"]
  },
  selfRespect: {
    title: "Self-Respect",
    description: "Values alignment, integrity, self-compassion",
    keywords: ["honor", "respect", "value", "worth", "dignity"]
  },
  connection: {
    title: "Connection",
    description: "Relating skills, repair conversations, belonging",
    keywords: ["relate", "belong", "connect", "share", "support"]
  },
  resilience: {
    title: "Resilience",
    description: "Bounce-back habits, coping flexibility, grit-with-kindness",
    keywords: ["recover", "adapt", "persist", "grow", "strengthen"]
  },
  meaning: {
    title: "Meaning",
    description: "Purpose, identity, direction, long-term growth",
    keywords: ["purpose", "direction", "identity", "growth", "vision"]
  }
};

export const BENEFIT_LIBRARY = {
  calm: {
    title: "Calm",
    micro: "Softer nervous system. Safer body.",
    family: "calm" as BenefitFamily,
  },
  clarity: {
    title: "Clarity",
    micro: "Name what is happening. Find one next step.",
    family: "clarity" as BenefitFamily,
  },
  agency: {
    title: "Agency",
    micro: "You choose the pace, tools, and direction.",
    family: "agency" as BenefitFamily,
  },
  connection: {
    title: "Connection",
    micro: "More self-kindness. Less isolation.",
    family: "connection" as BenefitFamily,
  },
  selfRespect: {
    title: "Self-Respect",
    micro: "Boundaries and alignment with your values.",
    family: "selfRespect" as BenefitFamily,
  },
  consistency: {
    title: "Consistency",
    micro: "Tiny habits that build lasting change.",
    family: "resilience" as BenefitFamily,
  },
  growth: {
    title: "Growth",
    micro: "Strengthen your inner voice with guidance.",
    family: "meaning" as BenefitFamily,
  },
  community: {
    title: "Community",
    micro: "Supportive spaces for shared healing.",
    family: "connection" as BenefitFamily,
  },
  privacy: {
    title: "Privacy",
    micro: "You control what you keep or share.",
    family: "agency" as BenefitFamily,
  },
  resilience: {
    title: "Resilience",
    micro: "Bounce back with kindness and strength.",
    family: "resilience" as BenefitFamily,
  },
  meaning: {
    title: "Meaning",
    micro: "Purpose, direction, and long-term growth.",
    family: "meaning" as BenefitFamily,
  },
} as const;

export function pickBenefits(keys: Array<keyof typeof BENEFIT_LIBRARY>, limit = 4) {
  return keys.slice(0, limit).map((k) => BENEFIT_LIBRARY[k]);
}

export const BENEFITS: Record<BenefitKey, { title: string; body: string }> = {
  calm: { title: "Feel calmer faster", body: "Use short tools that reduce stress and bring you back to center." },
  clarity: { title: "Get clear next steps", body: "Turn messy thoughts into a simple plan you can act on today." },
  agency: { title: "Choose your own pace", body: "You decide when, how, and what to explore - always optional." },
  connection: { title: "Feel less alone", body: "Build self-kindness and meaningful inner connection." },
  selfRespect: { title: "Honor your boundaries", body: "Practice alignment with your values and personal limits." },
  consistency: { title: "Build healthy habits", body: "Tiny routines that actually stick - without pressure or shame." },
  growth: { title: "Grow self-trust", body: "Reflect, learn, and strengthen your inner voice with guidance." },
  community: { title: "Share your journey", body: "Supportive spaces that encourage respect, kindness, and boundaries." },
  privacy: { title: "Privacy-first by design", body: "You control what you save, share, or keep private - always." },
  resilience: { title: "Build inner strength", body: "Develop bounce-back habits with coping flexibility and grit-with-kindness." },
  meaning: { title: "Find your purpose", body: "Discover direction, identity, and long-term growth that matters to you." },
};

export function getBenefitDescription(token: BenefitToken): string {
  const benefit = BENEFITS[token as BenefitKey];
  return benefit?.body ?? "";
}

export function getBenefitsByFamily(family: BenefitFamily): BenefitKey[] {
  return Object.entries(BENEFIT_LIBRARY)
    .filter(([_, v]) => v.family === family)
    .map(([k]) => k as BenefitKey);
}

export function rotateBenefits(pageId: string, count: number = 4): BenefitKey[] {
  const allKeys = Object.keys(BENEFIT_LIBRARY) as BenefitKey[];
  const hash = pageId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const startIdx = hash % allKeys.length;
  const result: BenefitKey[] = [];
  for (let i = 0; i < count; i++) {
    result.push(allKeys[(startIdx + i) % allKeys.length]);
  }
  return result;
}
