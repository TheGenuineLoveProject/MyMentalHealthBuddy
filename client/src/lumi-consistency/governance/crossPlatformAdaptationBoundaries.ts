/**
 * Phase 25 — crossPlatformAdaptationBoundaries
 *
 * 7 adaptation boundaries. Each boundary defines hard limits per platform
 * (web/mobile). Adapters may choose values within the limits but never
 * outside them.
 */

export type Platform = "web" | "mobile";

export interface AdaptationBoundary<T = unknown> {
  readonly id: string;
  readonly description: string;
  readonly limits: Readonly<Record<Platform, T>>;
}

export const SIZE_BOUNDARY: AdaptationBoundary<{ readonly minPx: number; readonly maxPx: number }> =
  Object.freeze({
    id: "size",
    description: "Avatar render size in CSS pixels.",
    limits: Object.freeze({
      web: Object.freeze({ minPx: 96, maxPx: 320 }),
      mobile: Object.freeze({ minPx: 64, maxPx: 240 }),
    }),
  });

export const ANIMATION_BOUNDARY: AdaptationBoundary<{ readonly maxFps: number; readonly maxConcurrent: number }> =
  Object.freeze({
    id: "animation",
    description: "Maximum animation frame rate and concurrent layered animations.",
    limits: Object.freeze({
      web: Object.freeze({ maxFps: 60, maxConcurrent: 4 }),
      mobile: Object.freeze({ maxFps: 30, maxConcurrent: 2 }),
    }),
  });

export const VOICE_BOUNDARY: AdaptationBoundary<{ readonly maxVolume: number; readonly autoplay: boolean }> =
  Object.freeze({
    id: "voice",
    description: "Voice playback caps. Autoplay always disallowed.",
    limits: Object.freeze({
      web: Object.freeze({ maxVolume: 0.4, autoplay: false }),
      mobile: Object.freeze({ maxVolume: 0.4, autoplay: false }),
    }),
  });

export const INPUT_BOUNDARY: AdaptationBoundary<{ readonly debounceMs: number; readonly multiTouch: boolean }> =
  Object.freeze({
    id: "input",
    description: "Input debounce and multi-touch policy.",
    limits: Object.freeze({
      web: Object.freeze({ debounceMs: 120, multiTouch: false }),
      mobile: Object.freeze({ debounceMs: 200, multiTouch: true }),
    }),
  });

export const DISPLAY_BOUNDARY: AdaptationBoundary<{ readonly minContrastRatio: number; readonly captionsRequired: boolean }> =
  Object.freeze({
    id: "display",
    description: "Display contrast and caption requirements.",
    limits: Object.freeze({
      web: Object.freeze({ minContrastRatio: 4.5, captionsRequired: true }),
      mobile: Object.freeze({ minContrastRatio: 4.5, captionsRequired: true }),
    }),
  });

export const HAPTIC_BOUNDARY: AdaptationBoundary<{ readonly allowed: boolean; readonly maxDurationMs: number }> =
  Object.freeze({
    id: "haptic",
    description: "Haptic feedback policy. Web disallowed; mobile soft only.",
    limits: Object.freeze({
      web: Object.freeze({ allowed: false, maxDurationMs: 0 }),
      mobile: Object.freeze({ allowed: true, maxDurationMs: 60 }),
    }),
  });

export const BATTERY_BOUNDARY: AdaptationBoundary<{ readonly maxBackgroundDrainPctPerHour: number }> =
  Object.freeze({
    id: "battery",
    description: "Background battery drain ceiling.",
    limits: Object.freeze({
      web: Object.freeze({ maxBackgroundDrainPctPerHour: 0 }),
      mobile: Object.freeze({ maxBackgroundDrainPctPerHour: 2 }),
    }),
  });

export const ADAPTATION_BOUNDARIES: ReadonlyArray<AdaptationBoundary<unknown>> = Object.freeze([
  SIZE_BOUNDARY,
  ANIMATION_BOUNDARY,
  VOICE_BOUNDARY,
  INPUT_BOUNDARY,
  DISPLAY_BOUNDARY,
  HAPTIC_BOUNDARY,
  BATTERY_BOUNDARY,
]);

if (ADAPTATION_BOUNDARIES.length !== 7) {
  throw new Error(
    `[lumi-consistency] ADAPTATION_BOUNDARIES must contain exactly 7 boundaries, found ${ADAPTATION_BOUNDARIES.length}.`,
  );
}

export function getBoundary(id: string): AdaptationBoundary<unknown> | undefined {
  return ADAPTATION_BOUNDARIES.find((b) => b.id === id);
}
