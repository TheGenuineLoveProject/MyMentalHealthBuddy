/**
 * Phase 15 (spec-aligned) — 8-tone keyword classifier.
 *
 * Routing-only. We do not store the detected tone as user profile data; it
 * lives just long enough to pick a calm response.
 */

import { normalizeForMatch } from "../safety/forbiddenPatterns";
import type { EmotionalTone } from "../state/conversationState";

const TONE_KEYWORDS: Record<EmotionalTone, string[]> = {
  anxious: [
    "anxious", "anxiety", "panicking", "panic", "nervous", "worried", "worry",
    "scared", "afraid", "fear", "racing thoughts", "can't stop thinking",
    "what if", "on edge", "jittery", "restless",
  ],
  sad: [
    "sad", "sadness", "down", "blue", "crying", "cried", "tears", "weepy",
    "heartbroken", "grieving", "grief", "loss", "miss", "missing", "empty",
    "hollow", "depressed",
  ],
  angry: [
    "angry", "anger", "mad", "furious", "irritated", "frustrated", "frustration",
    "pissed", "rage", "hate", "annoyed", "fed up", "resent",
  ],
  lonely: [
    "lonely", "loneliness", "alone", "isolated", "no one", "by myself",
    "nobody", "empty house", "empty room", "miss someone", "want company",
  ],
  overwhelmed: [
    "overwhelmed", "too much", "drowning", "swamped", "buried", "can't keep up",
    "everything at once", "spread thin", "burned out", "burnt out", "exhausted",
    "depleted", "stretched",
  ],
  calm: [
    "calm", "peaceful", "settled", "alright", "steady", "centered",
    "grounded", "at ease", "fine actually",
  ],
  grateful: [
    "grateful", "gratitude", "thankful", "thanks", "appreciate", "appreciative",
    "blessed", "lucky", "noticed something kind",
  ],
  ambivalent: [
    "mixed", "torn", "both", "and also", "but also", "not sure how i feel",
    "two things at once", "complicated", "conflicted",
  ],
};

export type ToneDetection = {
  tone: EmotionalTone;
  /** Score for the chosen tone (0–N, where N = matching keywords). */
  score: number;
  /** Score map for inspection / tests. */
  scores: Record<EmotionalTone, number>;
};

const ALL_TONES: EmotionalTone[] = [
  "anxious", "sad", "angry", "lonely", "overwhelmed", "calm", "grateful", "ambivalent",
];

export function detectTone(input: string): ToneDetection {
  const norm = normalizeForMatch(input);
  const scores: Record<EmotionalTone, number> = {
    anxious: 0, sad: 0, angry: 0, lonely: 0,
    overwhelmed: 0, calm: 0, grateful: 0, ambivalent: 0,
  };
  if (!norm) {
    return { tone: "calm", score: 0, scores };
  }
  for (const tone of ALL_TONES) {
    for (const kw of TONE_KEYWORDS[tone]) {
      if (norm.includes(kw)) scores[tone] += 1;
    }
  }
  let best: EmotionalTone = "calm";
  let bestScore = 0;
  for (const tone of ALL_TONES) {
    if (scores[tone] > bestScore) {
      best = tone;
      bestScore = scores[tone];
    }
  }
  // If both ambivalent + another tone scored, prefer ambivalent (it carries the contradiction).
  if (scores.ambivalent > 0 && bestScore === scores.ambivalent) {
    best = "ambivalent";
  }
  return { tone: best, score: bestScore, scores };
}

export const TONE_COUNT = ALL_TONES.length;
export { ALL_TONES };
