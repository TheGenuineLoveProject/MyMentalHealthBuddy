export type MicrocopyCategory =
  | "trust"
  | "closure"
  | "sharedConsent"
  | "gentleCTA"
  | "privacy"
  | "notTherapy"
  | "age18"
  | "motivationMI";

export const MICROCOPY: Record<MicrocopyCategory, string[]> = {
  trust: [
    "You don’t have to solve everything today.",
    "Small honesty counts.",
    "You can go slowly and still move forward.",
    "Your pace is valid.",
  ],
  closure: [
    "Before you go, what’s one kind thing you can do for yourself?",
    "If you want, save this and return later.",
    "Good work showing up. You can stop here.",
  ],
  sharedConsent: [
    "Only share what you truly want to share.",
    "You can edit this before sharing — or keep it private.",
    "Your privacy matters more than posting.",
  ],
  gentleCTA: [
    "Try one small step—then pause.",
    "Pick the easiest option, not the perfect one.",
    "One minute counts.",
  ],
  privacy: [
    "You control what you save.",
    "Private by default. Share by choice.",
    "Your words belong to you.",
  ],
  notTherapy: [
    "This is educational support, not therapy or medical care.",
    "If you’re in crisis, please contact local emergency services or a licensed professional.",
  ],
  age18: [
    "This platform is for adults 18+.",
    "By continuing, you confirm you are at least 18 years old.",
  ],
  motivationMI: [
    "On a scale of 1–10, how ready do you feel to take one small step?",
    "What matters most to you about making this change?",
    "What’s one thing that makes this feel possible today?",
  ],
};

export function rotateMicrocopy(
  category: MicrocopyCategory,
  seed: number
): string {
  const options = MICROCOPY[category];
  if (!options || options.length === 0) return "";
  return options[Math.abs(seed) % options.length];
}