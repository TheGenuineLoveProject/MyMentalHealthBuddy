/**
 * Phase 15 — Coarse emotion category inference from raw user text.
 *
 * Deliberately simple keyword + heuristic mapping. Not ML.
 * The goal is "good enough to pick a tone-appropriate reflection bank";
 * misclassification only changes which gentle response is shown — never
 * routes around safety (crisis is checked separately).
 */

import type { EmotionCategory } from "../types/companionVoiceTypes";

const KEYWORDS: Record<EmotionCategory, string[]> = {
  tired: ["tired", "exhausted", "drained", "burned out", "burnt out", "no energy", "wiped"],
  anxious: ["anxious", "anxiety", "panicked", "nervous", "worried", "racing", "on edge", "scared"],
  sad: ["sad", "down", "blue", "grief", "grieving", "crying", "heartbroken", "heavy", "hurts"],
  angry: ["angry", "furious", "mad", "rage", "pissed", "frustrated", "irritated", "resentful"],
  lonely: ["lonely", "alone", "isolated", "no one", "nobody", "abandoned", "left out", "invisible"],
  overwhelmed: ["overwhelmed", "too much", "drowning", "swamped", "buried", "can't keep up", "cant keep up"],
  calm: ["calm", "settled", "peaceful", "centered", "grounded", "okay now", "better now"],
  grateful: ["grateful", "thankful", "appreciate", "blessed"],
  hopeful: ["hopeful", "looking forward", "excited", "optimistic", "maybe", "could be"],
  ambivalent: ["ambivalent", "torn", "mixed", "conflicted", "both", "and also", "but also"],
  neutral: [],
};

/**
 * Returns the highest-scoring category. Ties broken by declaration order.
 * If nothing matches → "neutral".
 */
export function detectCategory(text: string): EmotionCategory {
  if (!text || typeof text !== "string") return "neutral";
  const haystack = ` ${text.toLowerCase()} `;
  let best: EmotionCategory = "neutral";
  let bestScore = 0;
  for (const [cat, keywords] of Object.entries(KEYWORDS) as [EmotionCategory, string[]][]) {
    let score = 0;
    for (const k of keywords) {
      if (haystack.includes(k)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}
