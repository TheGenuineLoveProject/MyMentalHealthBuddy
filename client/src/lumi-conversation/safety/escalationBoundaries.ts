/**
 * Phase 15 (spec-aligned) — escalation detection.
 *
 * Three levels:
 *   - critical  → explicit self-harm / suicidality. Returns 988 + 741741 + 911 + /crisis
 *                 resource pointer. Bank lookup is bypassed.
 *   - elevated  → chronic distress / hopelessness without explicit means. Lumi gently
 *                 surfaces the option of a counselor / hotline alongside its calm
 *                 reflection — never replaces it.
 *   - none      → normal conversational routing.
 *
 * Detector is normalize()-aware (curly apostrophes, whitespace) and runs FIRST,
 * always, before any other safety check.
 */

import { normalizeForMatch } from "./forbiddenPatterns";
import type { EscalationLevel } from "../state/conversationState";

/** Critical signals — explicit self-harm / suicidality / means. */
export const CRITICAL_SIGNALS: string[] = [
  "want to die",
  "wanna die",
  "i want to die",
  "kill myself",
  "killing myself",
  "end my life",
  "ending my life",
  "end it all",
  "suicide",
  "suicidal",
  "take my own life",
  "taking my own life",
  "hurt myself",
  "hurting myself",
  "cut myself",
  "cutting myself",
  "self harm",
  "self-harm",
  "overdose",
  "od myself",
  "no reason to live",
  "no point in living",
  "better off dead",
  "wish i was dead",
  "wish i were dead",
  "can't go on",
  "cannot go on",
  // Slang / coded
  "unalive",
  "unalive myself",
  "off myself",
  "kms",
  "ksm",
  // Means
  "hang myself",
  "shoot myself",
  "jump off",
  "drown myself",
  "pills to die",
];

/** Elevated signals — chronic distress, hopelessness, isolation, but no explicit means. */
export const ELEVATED_SIGNALS: string[] = [
  "everything is hopeless",
  "nothing matters",
  "i can't do this anymore",
  "i cannot do this anymore",
  "i give up",
  "i'm a burden",
  "i am a burden",
  "such a burden",
  "burden to everyone",
  "no one would notice",
  "no one would care",
  "i hate myself",
  "i'm worthless",
  "i am worthless",
  "i can't breathe",
  "panic attack",
  "i'm having a panic attack",
  "i can't cope",
  "i cannot cope",
  "spiraling",
  "falling apart",
  "haven't slept in days",
  "haven't eaten in days",
];

export type EscalationDetection = {
  level: EscalationLevel;
  matched: string[];
};

export function detectEscalation(input: string): EscalationDetection {
  if (!input) return { level: "none", matched: [] };
  const norm = normalizeForMatch(input);
  const critical = CRITICAL_SIGNALS.filter((s) => norm.includes(s));
  if (critical.length > 0) return { level: "critical", matched: critical };
  const elevated = ELEVATED_SIGNALS.filter((s) => norm.includes(s));
  if (elevated.length > 0) return { level: "elevated", matched: elevated };
  return { level: "none", matched: [] };
}

/** Crisis resource block — appended verbatim on `critical`. Never edited at runtime. */
export const CRISIS_RESOURCE_TEXT =
  "If you're in immediate danger, please reach a person who can stay with you: " +
  "call or text 988 (US Suicide & Crisis Lifeline), text HOME to 741741 " +
  "(Crisis Text Line), or call 911. You can also visit /crisis at any time.";

/** Elevated suggestion block — softer, never replaces Lumi's calm reflection. */
export const ELEVATED_SUGGESTION_TEXT =
  "If this kind of weight has been with you for a while, talking with a counselor " +
  "or calling/texting 988 can help — only if and when you'd like. /crisis stays here too.";

export const CRITICAL_SIGNAL_COUNT = CRITICAL_SIGNALS.length;
export const ELEVATED_SIGNAL_COUNT = ELEVATED_SIGNALS.length;
