/**
 * Phase 23 — voiceSafetyRules
 * Hard floors/ceilings + frozen forbidden phrases & audio effects.
 */

export const MAX_VOICE_VOLUME = 0.4 as const;
export const MIN_VOICE_RATE = 0.5 as const;
export const MAX_VOICE_RATE = 1.5 as const;

/**
 * Forbidden phrases — invalidating, prescriptive, dismissive, coercive,
 * or commercial language. Floor guard: list MUST contain at least 23 items.
 *
 * Architect-driven hardening (v5.8.60): expanded from 15 to 23 to cover
 * coercion / urgency / commercial-upsell categories that the original
 * list missed. `VoicePlaybackController.speak()` checks every utterance
 * against this list at sink time — adding a phrase here is sufficient
 * to refuse the utterance; no additional wiring required.
 */
export const FORBIDDEN_PHRASES: ReadonlyArray<string> = Object.freeze([
  // Invalidation / dismissal
  "calm down",
  "just relax",
  "it's all in your head",
  "get over it",
  "stop crying",
  "you're overreacting",
  "snap out of it",
  "be positive",
  "others have it worse",
  "you should be grateful",
  "don't be sad",
  "don't worry",
  "man up",
  "toughen up",
  "you'll be fine",
  // Coercion / obligation
  "you must",
  "you have to",
  "this is required",
  // Urgency
  "limited time",
  "act now",
  // Commercial upsell
  "subscribe now",
  "upgrade now",
  "premium only",
]);

if (FORBIDDEN_PHRASES.length < 23) {
  throw new Error(
    `[lumi-voice] FORBIDDEN_PHRASES floor violated: ${FORBIDDEN_PHRASES.length} < 23.`,
  );
}

/**
 * Forbidden audio effects — anything that turns voice into a stimulus loop
 * or imitates urgency/alarm. Floor guard: at least 8 items.
 */
export const FORBIDDEN_AUDIO_EFFECTS: ReadonlyArray<string> = Object.freeze([
  "reverb-cathedral",
  "echo-loop",
  "pitch-shift-dynamic",
  "alarm-tone",
  "buzzer",
  "vibrato-heavy",
  "robotic-distortion",
  "sub-bass-throb",
]);

if (FORBIDDEN_AUDIO_EFFECTS.length < 8) {
  throw new Error(
    `[lumi-voice] FORBIDDEN_AUDIO_EFFECTS floor violated: ${FORBIDDEN_AUDIO_EFFECTS.length} < 8.`,
  );
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsForbiddenPhrase(text: string): boolean {
  if (typeof text !== "string") return false;
  const haystack = normalize(text);
  return FORBIDDEN_PHRASES.some((p) => haystack.includes(p));
}

export function containsForbiddenAudioEffect(effectName: string): boolean {
  if (typeof effectName !== "string") return false;
  return FORBIDDEN_AUDIO_EFFECTS.includes(effectName.toLowerCase());
}
