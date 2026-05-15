/**
 * Phase 19 — Emotional Scene Presets · Governance
 *
 * Numeric ceilings + 14 forbidden effect categories. Every preset is
 * validated against this file at module-load time (see test suite) AND
 * any host attempting to register an ad-hoc scene MUST run `auditPreset()`.
 *
 * NON-NEGOTIABLES enforced here:
 *  - lighting          ≤ 0.8
 *  - particle density  ≤ 8
 *  - particle speed    ≤ 0.2
 *  - fog opacity       ≤ 0.15
 *  - audio volume      ≤ 0.1
 *  - transition        ≥ 1500 ms (soft crossfade, never teleport)
 *  - 14 forbidden effects (confetti / burst / flash / dopamine-loop / …)
 */

import type { ScenePreset } from "../runtime/ScenePresetEngine";

// ─── Numeric ceilings ──────────────────────────────────────────────────────

export const MAX_LIGHTING = 0.8;
export const MAX_PARTICLE_COUNT = 8;
export const MAX_PARTICLE_SPEED = 0.2;
export const MAX_FOG_OPACITY = 0.15;
export const MAX_AUDIO_VOLUME = 0.1;
export const MIN_TRANSITION_MS = 1500;

// ─── Forbidden effects (exactly 14) ────────────────────────────────────────

export const FORBIDDEN_EFFECTS: ReadonlyArray<string> = [
  "confetti",
  "burst",
  "flash",
  "strobe",
  "dopamine-loop",
  "achievement",
  "streak",
  "badge",
  "level-up",
  "popup",
  "sparkle-burst",
  "shake",
  "vibrate",
  "pulse-attention",
];

if (FORBIDDEN_EFFECTS.length !== 14) {
  throw new Error(
    `[lumi-scenes] FORBIDDEN_EFFECTS must contain exactly 14 entries, ` +
      `got ${FORBIDDEN_EFFECTS.length}. Spec violation.`,
  );
}

const forbiddenLower = FORBIDDEN_EFFECTS.map((s) => s.toLowerCase());

/** Returns true iff `text` mentions any forbidden effect (substring, case-insensitive). */
export function containsForbiddenEffect(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return forbiddenLower.some((f) => t.includes(f));
}

// ─── Preset audit ──────────────────────────────────────────────────────────

export type AuditFinding = {
  rule:
    | "max-lighting"
    | "max-particle-count"
    | "max-particle-speed"
    | "max-fog-opacity"
    | "max-audio-volume"
    | "forbidden-effect-name"
    | "forbidden-effect-audio"
    | "internal-name-required"
    | "state-mismatch";
  message: string;
};

/**
 * Audit a preset against all numeric ceilings + forbidden-effect rules.
 * Returns `[]` when the preset is fully compliant.
 */
export function auditPreset(p: ScenePreset): AuditFinding[] {
  const findings: AuditFinding[] = [];

  if (!p.internalName || typeof p.internalName !== "string") {
    findings.push({
      rule: "internal-name-required",
      message: "preset.internalName must be a non-empty string",
    });
  }

  if (typeof p.lighting !== "number" || p.lighting < 0 || p.lighting > MAX_LIGHTING) {
    findings.push({
      rule: "max-lighting",
      message: `lighting ${p.lighting} out of range [0, ${MAX_LIGHTING}]`,
    });
  }

  if (
    typeof p.particles.count !== "number" ||
    p.particles.count < 0 ||
    p.particles.count > MAX_PARTICLE_COUNT
  ) {
    findings.push({
      rule: "max-particle-count",
      message: `particles.count ${p.particles.count} out of range [0, ${MAX_PARTICLE_COUNT}]`,
    });
  }

  if (
    typeof p.particles.speed !== "number" ||
    p.particles.speed < 0 ||
    p.particles.speed > MAX_PARTICLE_SPEED
  ) {
    findings.push({
      rule: "max-particle-speed",
      message: `particles.speed ${p.particles.speed} out of range [0, ${MAX_PARTICLE_SPEED}]`,
    });
  }

  if (
    typeof p.fog.opacity !== "number" ||
    p.fog.opacity < 0 ||
    p.fog.opacity > MAX_FOG_OPACITY
  ) {
    findings.push({
      rule: "max-fog-opacity",
      message: `fog.opacity ${p.fog.opacity} out of range [0, ${MAX_FOG_OPACITY}]`,
    });
  }

  if (p.audio !== null) {
    if (
      typeof p.audio.volume !== "number" ||
      p.audio.volume < 0 ||
      p.audio.volume > MAX_AUDIO_VOLUME
    ) {
      findings.push({
        rule: "max-audio-volume",
        message: `audio.volume ${p.audio.volume} out of range [0, ${MAX_AUDIO_VOLUME}]`,
      });
    }
    if (typeof p.audio.src === "string" && containsForbiddenEffect(p.audio.src)) {
      findings.push({
        rule: "forbidden-effect-audio",
        message: `audio.src references a forbidden effect`,
      });
    }
  }

  if (containsForbiddenEffect(p.internalName)) {
    findings.push({
      rule: "forbidden-effect-name",
      message: `internalName "${p.internalName}" mentions a forbidden effect`,
    });
  }

  return findings;
}

/**
 * Sink-time audio sanitizer. Used by `ScenePresetAudio` at playback time
 * (not just at audit time) so that even if a host swaps in an unaudited
 * preset, the audio sink fails closed:
 *
 *  - `null` audio → `null` (silence).
 *  - Volume above ceiling → clamped down to MAX_AUDIO_VOLUME.
 *  - Volume below 0 / NaN → 0 (silence).
 *  - `src` referencing a forbidden effect → `null` src (silence).
 *  - Non-string `src` → `null` src.
 *
 * Returns a NEW object — never mutates input (which may be frozen).
 */
export function sanitizeAudioForPlayback(
  audio: ScenePreset["audio"] | null | undefined,
): { src: string | null; volume: number; loop: boolean } | null {
  if (!audio) return null;
  // Clamp volume.
  let volume = typeof audio.volume === "number" ? audio.volume : 0;
  if (Number.isNaN(volume) || volume < 0) volume = 0;
  if (volume > MAX_AUDIO_VOLUME) volume = MAX_AUDIO_VOLUME;
  // Validate src.
  let src: string | null = null;
  if (typeof audio.src === "string" && audio.src.length > 0) {
    src = containsForbiddenEffect(audio.src) ? null : audio.src;
  }
  return { src, volume, loop: !!audio.loop };
}

/** Convenience: throws if the preset has any audit findings. */
export function assertPresetCompliant(p: ScenePreset): void {
  const findings = auditPreset(p);
  if (findings.length > 0) {
    throw new Error(
      `[lumi-scenes] preset "${p.internalName}" failed audit: ` +
        findings.map((f) => `${f.rule}: ${f.message}`).join(" | "),
    );
  }
}
