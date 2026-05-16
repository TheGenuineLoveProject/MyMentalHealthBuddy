/**
 * Phase 23 — VoicePresenceEngine
 * Manages 3 voice profiles. Pure config + validation.
 */

import { softNeutral } from "../profiles/softNeutral";
import { warmCalm } from "../profiles/warmCalm";
import { sleepyQuiet } from "../profiles/sleepyQuiet";
import {
  MAX_VOICE_VOLUME,
  MIN_VOICE_RATE,
  MAX_VOICE_RATE,
} from "../governance/voiceSafetyRules";

export type VoiceProfileKey = "softNeutral" | "warmCalm" | "sleepyQuiet";

export interface VoiceProfile {
  readonly key: VoiceProfileKey;
  readonly displayName: string;
  readonly rate: number; // 0.5..1.5
  readonly pitch: number; // 0..2
  readonly volume: number; // 0..0.4 (hard-capped)
  readonly description: string;
}

export const VOICE_PROFILES: Readonly<Record<VoiceProfileKey, VoiceProfile>> = Object.freeze({
  softNeutral,
  warmCalm,
  sleepyQuiet,
});

export const DEFAULT_VOICE_PROFILE: VoiceProfileKey = "softNeutral";

export function validateProfile(profile: VoiceProfile): true {
  if (profile.volume > MAX_VOICE_VOLUME) {
    throw new Error(
      `[lumi-voice] profile "${profile.key}" volume ${profile.volume} > MAX_VOICE_VOLUME ${MAX_VOICE_VOLUME}.`,
    );
  }
  if (profile.rate < MIN_VOICE_RATE || profile.rate > MAX_VOICE_RATE) {
    throw new Error(
      `[lumi-voice] profile "${profile.key}" rate ${profile.rate} outside [${MIN_VOICE_RATE}, ${MAX_VOICE_RATE}].`,
    );
  }
  if (profile.pitch < 0 || profile.pitch > 2) {
    throw new Error(
      `[lumi-voice] profile "${profile.key}" pitch ${profile.pitch} outside [0, 2].`,
    );
  }
  return true;
}

// Module-load assertion: every profile must validate.
(Object.values(VOICE_PROFILES) as ReadonlyArray<VoiceProfile>).forEach(validateProfile);

export function resolveProfile(key: VoiceProfileKey): VoiceProfile {
  return VOICE_PROFILES[key];
}

export function listProfiles(): ReadonlyArray<VoiceProfile> {
  return Object.values(VOICE_PROFILES);
}
