export type BenefitToken =
  | "Agency"
  | "Boundaries"
  | "Calm"
  | "Direction"
  | "Emotional literacy"
  | "Focus"
  | "Gentle habits"
  | "Honesty"
  | "Identity"
  | "Judgment-free"
  | "Kindness"
  | "Language clarity"
  | "Meaning"
  | "Nervous system regulation"
  | "Ownership"
  | "Purpose"
  | "Quality attention"
  | "Resilience"
  | "Self-respect"
  | "Trust"
  | "Understanding"
  | "Values"
  | "Wellbeing literacy"
  | "Your pace"
  | "Zero pressure";

export const BENEFIT_TOKENS: BenefitToken[] = [
  "Agency",
  "Boundaries",
  "Calm",
  "Direction",
  "Emotional literacy",
  "Focus",
  "Gentle habits",
  "Honesty",
  "Identity",
  "Judgment-free",
  "Kindness",
  "Language clarity",
  "Meaning",
  "Nervous system regulation",
  "Ownership",
  "Purpose",
  "Quality attention",
  "Resilience",
  "Self-respect",
  "Trust",
  "Understanding",
  "Values",
  "Wellbeing literacy",
  "Your pace",
  "Zero pressure",
];

export function pickBenefits(tokens: BenefitToken[], count: number): BenefitToken[] {
  const unique = Array.from(new Set(tokens));
  return unique.slice(0, Math.max(1, Math.min(count, unique.length)));
}