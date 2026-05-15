/**
 * Phase 23 — warmCalm profile.
 * Slightly slower and lower. Useful when companionship is the focus.
 */

import type { VoiceProfile } from "../runtime/VoicePresenceEngine";

export const warmCalm: VoiceProfile = Object.freeze({
  key: "warmCalm",
  displayName: "Warm Calm",
  rate: 0.8,
  pitch: 0.95,
  volume: 0.3,
  description:
    "A warmer, slightly slower presence. Useful for grounding and quiet sitting-with.",
});
