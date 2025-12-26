import { AI_POLICY } from "./policy.mjs";

export const CRISIS_RESPONSE = {
  isCrisis: true,
  reply:
    "I hear you, and I’m genuinely concerned.\n\n" +
    "If you’re in immediate danger or might act on these thoughts, please call your local emergency number now.\n\n" +
    "**US & Canada: 988** (Suicide & Crisis Lifeline)\n" +
    "**Crisis Text Line: Text HOME to 741741**\n\n" +
    "If you want, tell me where you are (country/state), and I can share the right local options.",
  resources: [
    { name: "988 Suicide & Crisis Lifeline (US/Canada)", contact: "988" },
    { name: "Crisis Text Line (US)", contact: "Text HOME to 741741" },
  ],
};

export function detectCrisis(text = "") {
  const t = String(text).toLowerCase();
  return AI_POLICY.crisisKeywords.some((k) => t.includes(k));
}