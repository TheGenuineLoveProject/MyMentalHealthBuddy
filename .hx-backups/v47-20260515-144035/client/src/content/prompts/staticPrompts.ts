export const refineNoticeVariants = [
  "This section is being thoughtfully refined. Explore other tools while we complete it.",
  "We're adding more depth to this area. Check back soon or try related practices.",
  "This content is being carefully developed. Browse our other wellness resources.",
  "More insights coming here. In the meantime, explore what resonates with you."
] as const;

export const encouragementVariants = [
  "Every small step forward matters.",
  "You're doing meaningful work by showing up.",
  "Progress happens at your own pace.",
  "What you practice grows stronger.",
  "Your effort today plants seeds for tomorrow."
] as const;

export const nextStepVariants = [
  "Try one small practice that feels manageable.",
  "Notice one thing you're grateful for right now.",
  "Take three slow breaths before moving on.",
  "Choose one insight to carry with you today.",
  "Acknowledge one strength you used recently."
] as const;

export const ctaVariants = [
  "Explore this practice",
  "Begin when you're ready",
  "Take the first step",
  "Start your reflection",
  "Try this approach"
] as const;

export function getRefineNotice(index: number): string {
  return refineNoticeVariants[index % refineNoticeVariants.length];
}

export function getEncouragement(index: number): string {
  return encouragementVariants[index % encouragementVariants.length];
}

export function getNextStep(index: number): string {
  return nextStepVariants[index % nextStepVariants.length];
}

export function getCta(index: number): string {
  return ctaVariants[index % ctaVariants.length];
}
