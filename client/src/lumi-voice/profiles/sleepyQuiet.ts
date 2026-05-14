/**
 * Phase 23 — sleepyQuiet profile.
 * Lowest, slowest, quietest. For evening / down-regulation.
 */

import type { VoiceProfile } from "../runtime/VoicePresenceEngine";

export const sleepyQuiet: VoiceProfile = Object.freeze({
  key: "sleepyQuiet",
  displayName: "Sleepy Quiet",
  rate: 0.7,
  pitch: 0.9,
  volume: 0.2,
  description:
    "A near-whisper. Useful for sleep softening or extended quiet stretches.",
});
