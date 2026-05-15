/**
 * Phase 15 — Crisis signal detection.
 *
 * Asymmetric risk: prefer false positives over false negatives.
 * If ANY explicit self-harm or imminent-danger signal is present, the engine
 * MUST short-circuit conversation and route to /crisis + 988/741741/911.
 *
 * This list is intentionally simple, broad, and human-auditable.
 * It is not a clinical screen — it is a routing trigger.
 */

import type { CrisisDetectionResult } from "../types/companionVoiceTypes";

/** Flatten curly apostrophes / quotes + collapse whitespace before matching. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const CRISIS_SIGNALS: string[] = [
  // Explicit suicidal language
  "kill myself",
  "killing myself",
  "end my life",
  "ending my life",
  "end it all",
  "take my life",
  "want to die",
  "wanna die",
  "wish i was dead",
  "wish i were dead",
  "wish i could die",
  "ready to die",
  "going to die tonight",
  "suicide",
  "suicidal",
  "commit suicide",
  // Slang / coded variants commonly used to evade keyword filters
  "unalive",
  "unalive myself",
  "off myself",
  "kms",
  "ksm", // common typo of kms
  // Self-harm
  "hurt myself",
  "hurting myself",
  "cut myself",
  "cutting myself",
  "self harm",
  "self-harm",
  // Plan / means language (explicit method)
  "i have a plan",
  "i have pills",
  "i have a gun",
  "overdose",
  "hang myself",
  "shoot myself",
  "jump off",
  "drown myself",
  // Imminent danger to others (also routes to safety, not conversation)
  "kill them",
  "kill him",
  "kill her",
  "kill someone",
  "shoot up",
  // Acute hopelessness paired with finality
  "no reason to live",
  "nothing to live for",
  "can't go on",
  "cant go on",
  "give up on living",
];

export function detectCrisis(text: string): CrisisDetectionResult {
  if (!text || typeof text !== "string") {
    return { isCrisis: false, matchedSignal: null };
  }
  const haystack = normalize(text);
  for (const signal of CRISIS_SIGNALS) {
    if (haystack.includes(signal)) {
      return { isCrisis: true, matchedSignal: signal };
    }
  }
  return { isCrisis: false, matchedSignal: null };
}

/** Exposed for test enumeration. */
export const CRISIS_SIGNAL_COUNT = CRISIS_SIGNALS.length;
