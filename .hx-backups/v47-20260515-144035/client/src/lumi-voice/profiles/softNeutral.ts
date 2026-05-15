/**
 * Phase 23 — softNeutral profile.
 * Default companion voice. Calm, even, unhurried.
 */

import type { VoiceProfile } from "../runtime/VoicePresenceEngine";

export const softNeutral: VoiceProfile = Object.freeze({
  key: "softNeutral",
  displayName: "Soft Neutral",
  rate: 0.9,
  pitch: 1.0,
  volume: 0.3,
  description:
    "An unhurried, even voice. Useful for general companionship and gentle prompts.",
});
