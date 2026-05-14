/**
 * Phase 23 — VoicePlaybackController
 * Thin Web Speech API wrapper. SSR-safe. Opt-in only.
 *
 * Safety:
 *  - Hard volume cap 0.4 (enforced at sink)
 *  - Never autoplays
 *  - Refuses to speak unless user has opted in (gate set by host)
 *  - Delegates to governance audits before utterance
 */

import type { VoiceProfile } from "./VoicePresenceEngine";
import {
  MAX_VOICE_VOLUME,
  MIN_VOICE_RATE,
  MAX_VOICE_RATE,
  containsForbiddenPhrase,
} from "../governance/voiceSafetyRules";
import { containsManipulativeLanguage } from "../governance/antiManipulationRules";

let optInGate = false;
let lastUtterance: SpeechSynthesisUtterance | null = null;
let speakingFlag = false;

export function setOptIn(value: boolean): void {
  optInGate = !!value;
  if (!optInGate) stop();
}

export function hasOptIn(): boolean {
  return optInGate;
}

function ssr(): boolean {
  return typeof window === "undefined" || typeof window.speechSynthesis === "undefined";
}

export function isSpeaking(): boolean {
  if (ssr()) return false;
  return speakingFlag || window.speechSynthesis.speaking;
}

export function stop(): void {
  if (ssr()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
  speakingFlag = false;
  lastUtterance = null;
}

export interface SpeakOptions {
  readonly onBoundary?: (charIndex: number) => void;
  readonly onEnd?: () => void;
  readonly onError?: (reason: string) => void;
}

export function speak(
  text: string,
  profile: VoiceProfile,
  options: SpeakOptions = {},
): boolean {
  if (ssr()) {
    options.onError?.("ssr-no-speech-api");
    return false;
  }
  if (!optInGate) {
    options.onError?.("not-opted-in");
    return false;
  }
  if (typeof text !== "string" || text.trim().length === 0) {
    options.onError?.("empty-text");
    return false;
  }
  if (containsForbiddenPhrase(text)) {
    options.onError?.("forbidden-phrase");
    return false;
  }
  if (containsManipulativeLanguage(text)) {
    options.onError?.("manipulative-language");
    return false;
  }

  const safeVolume = Math.min(profile.volume, MAX_VOICE_VOLUME);
  const safeRate = Math.max(MIN_VOICE_RATE, Math.min(profile.rate, MAX_VOICE_RATE));
  const safePitch = Math.max(0, Math.min(profile.pitch, 2));

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = safeVolume;
  utterance.rate = safeRate;
  utterance.pitch = safePitch;

  utterance.onboundary = (event) => {
    if (typeof event.charIndex === "number") options.onBoundary?.(event.charIndex);
  };
  utterance.onend = () => {
    speakingFlag = false;
    lastUtterance = null;
    options.onEnd?.();
  };
  utterance.onerror = (event) => {
    speakingFlag = false;
    lastUtterance = null;
    options.onError?.(event.error || "speech-error");
  };

  lastUtterance = utterance;
  speakingFlag = true;
  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    speakingFlag = false;
    options.onError?.(err instanceof Error ? err.message : "speak-throw");
    return false;
  }
}
