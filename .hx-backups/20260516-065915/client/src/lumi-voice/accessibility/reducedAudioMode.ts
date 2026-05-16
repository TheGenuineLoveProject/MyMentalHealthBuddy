/**
 * Phase 23 — reducedAudioMode
 *
 * Low-stimulation accessibility mode. When enabled (or when the OS reports
 * `prefers-reduced-motion: reduce`), voice is disabled and the host should
 * fall back to captions only.
 *
 * SSR-safe.
 */

let userPreference: boolean = false;

export function setReducedAudio(value: boolean): void {
  userPreference = !!value;
}

export function isReducedAudioPreferred(): boolean {
  if (userPreference) return true;
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function shouldSuppressVoice(voiceEnabled: boolean): boolean {
  if (!voiceEnabled) return true;
  return isReducedAudioPreferred();
}
