import type { BenefitToken } from "@/lib/benefits";

export type BenefitSpec = {
  token: BenefitToken;
  userSees: string;     // clear outcome language without promises
  userDoes: string;     // what they do on the page
  time: string;         // realistic duration
};

export const BENEFIT_SPECS: Record<string, BenefitSpec> = {
  Calm: {
    token: "calm",
    userSees: "Less mental noise for a moment.",
    userDoes: "One breath + one sentence.",
    time: "30–90 seconds",
  },
  Agency: {
    token: "agency",
    userSees: "A sense of choice and direction.",
    userDoes: "Pick one tiny next step.",
    time: "1–3 minutes",
  },
  "Self-respect": {
    token: "selfRespect",
    userSees: "Clearer boundaries and kinder self-talk.",
    userDoes: "Write one respectful boundary line.",
    time: "2–5 minutes",
  },
};