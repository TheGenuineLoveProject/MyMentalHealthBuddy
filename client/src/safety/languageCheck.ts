export const aiBoundaries = {
  noAuthorityVoice: [
    "I'm telling you",
    "you're definitely",
    "this is the truth",
    "I know exactly",
    "trust me",
    "I guarantee",
    "without a doubt",
    "absolutely certain",
  ],

  noPredictiveClaims: [
    "you will feel",
    "this will make you",
    "you're going to be",
    "in the future you'll",
    "eventually you'll",
    "you will heal",
    "you will recover",
    "this will fix",
  ],

  noEmotionalLeverage: [
    "you owe it to",
    "think about how others feel",
    "people are worried about you",
    "don't you want to get better",
    "if you really cared",
    "you're hurting people",
    "you're letting people down",
  ],

  noUrgencyFraming: [
    "you need to act now",
    "don't wait",
    "time is running out",
    "before it's too late",
    "you're wasting time",
    "hurry",
    "immediately",
    "right away you must",
  ],
};

export function checkAIBoundaries(text: string): {
  passes: boolean;
  violations: { category: string; phrase: string }[];
} {
  const lowerText = text.toLowerCase();
  const violations: { category: string; phrase: string }[] = [];

  for (const [category, phrases] of Object.entries(aiBoundaries)) {
    for (const phrase of phrases) {
      if (lowerText.includes(phrase.toLowerCase())) {
        violations.push({ category, phrase });
      }
    }
  }

  return {
    passes: violations.length === 0,
    violations,
  };
}

export const PLATFORM_DISCLAIMER = `This platform does not replace professional care.
It exists to support reflection, not to provide diagnosis or treatment.`;

export const MIRROR_DISCLAIMER = `Here is a gentle reflection of what you wrote.
It may not fully capture your experience — please keep only what feels true to you.`;

export const AI_DISCLAIMER = `Please ignore anything that doesn't feel accurate or helpful.
You know yourself best.`;

export const COMMUNITY_DISCLAIMER = `These reflections are shared anonymously.
They are not advice, and they are not a measure of anyone's progress.`;

export const CRISIS_DISCLAIMER = `If you're in immediate danger, please contact emergency services.
This platform cannot provide crisis intervention.`;
