/**
 * @fileoverview Core Vocabulary System
 * @module lumi-language/vocabulary
 * @version 1.0.0
 * @since Phase 42
 */

export const DIRECTION_WORDS = [
  "Ground", "Breathe", "Pause", "Proceed", "Focus", "Return", "Build",
  "Create", "Grow", "Stabilize", "Clarify", "Redirect", "Orient", "Soften",
  "Allow", "Support", "Strengthen", "Center", "Settle", "Rest", "Notice",
  "Choose", "Release", "Welcome", "Trust",
] as const;

export const SAFETY_WORDS = [
  "Safe", "Steady", "Enough", "Supported", "Held", "Calm", "Settled",
  "Secure", "Protected", "Welcome",
] as const;

export const BODY_REGULATION_WORDS = [
  "Exhale", "Slow", "Release", "Unclench", "Relax", "Lower", "Rest",
  "Soften", "Breathe", "Ground",
] as const;

export const ABUNDANCE_WORDS = [
  "Build", "Expand", "Create", "Develop", "Prosper", "Strengthen", "Align",
  "Grow", "Stabilize", "Generate", "Receive", "Attract", "Nurture",
  "Flourish", "Thrive",
] as const;

export const SCARCITY_WORDS = [
  "struggle", "fail", "broke", "lack", "shortage", "deficit", "scarcity",
  "poor", "insufficient", "deficient", "inadequate", "unworthy", "less than",
  "behind", "missing out", "left behind",
] as const;

export function scoreVocabulary(text: string): {
  directionCount: number; safetyCount: number; regulationCount: number;
  abundanceCount: number; scarcityCount: number; score: number;
  scarcityFound: string[]; approvedFound: string[];
} {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  let directionCount = 0, safetyCount = 0, regulationCount = 0, abundanceCount = 0, scarcityCount = 0;
  const scarcityFound: string[] = [], approvedFound: string[] = [];

  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, "");
    if (!clean) continue;
    if (DIRECTION_WORDS.some((w) => w.toLowerCase() === clean)) { directionCount++; approvedFound.push(clean); }
    if (SAFETY_WORDS.some((w) => w.toLowerCase() === clean)) { safetyCount++; approvedFound.push(clean); }
    if (BODY_REGULATION_WORDS.some((w) => w.toLowerCase() === clean)) { regulationCount++; approvedFound.push(clean); }
    if (ABUNDANCE_WORDS.some((w) => w.toLowerCase() === clean)) { abundanceCount++; approvedFound.push(clean); }
    if (SCARCITY_WORDS.some((w) => w.toLowerCase() === clean)) { scarcityCount++; scarcityFound.push(clean); }
  }

  const score = directionCount + safetyCount + regulationCount + abundanceCount - scarcityCount * 3;
  return { directionCount, safetyCount, regulationCount, abundanceCount, scarcityCount, score, scarcityFound, approvedFound };
}

export function isVocabularySafe(text: string): boolean {
  const result = scoreVocabulary(text);
  return result.score >= 0 && result.scarcityCount === 0;
}
