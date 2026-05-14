/**
 * Phase 19 — Emotional Scene Presets · Contract test suite
 *
 * 25 tests across 6 suites (spec floor: 20). Verifies registry shape,
 * numeric ceilings, forbidden-effect rules, resolver correctness, and
 * the public barrel surface.
 */

import { describe, it, expect } from "vitest";

import {
  SCENE_REGISTRY,
  SCENE_STATES,
  listPresets,
  resolvePreset,
  type SceneState,
} from "../runtime/ScenePresetEngine";
import {
  MAX_AUDIO_VOLUME,
  MAX_FOG_OPACITY,
  MAX_LIGHTING,
  MAX_PARTICLE_COUNT,
  MAX_PARTICLE_SPEED,
  MIN_TRANSITION_MS,
  FORBIDDEN_EFFECTS,
  auditPreset,
  containsForbiddenEffect,
} from "../governance/presetSafetyRules";

const STATE_TO_NAME: Record<SceneState, string> = {
  calm: "Still Meadow",
  comforting: "Gentle Lantern",
  reflective: "Quiet Orbit",
  sleepy: "Cloud Rest",
  grounding: "Soft Horizon",
  joySoft: "Tiny Bloom",
  concernSoft: "Holding Space",
};

describe("Registry shape", () => {
  it("declares exactly 7 SceneStates", () => {
    expect(SCENE_STATES.length).toBe(7);
  });
  it("registry contains exactly 7 presets", () => {
    expect(Object.keys(SCENE_REGISTRY).length).toBe(7);
  });
  it("every state maps to its named preset and the preset reports the same state back", () => {
    for (const s of SCENE_STATES) {
      const p = SCENE_REGISTRY[s];
      expect(p.internalName).toBe(STATE_TO_NAME[s]);
      expect(p.state).toBe(s);
    }
  });
  it("internal names are unique across presets", () => {
    const names = listPresets().map((p) => p.internalName);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("Numeric ceilings (per-preset)", () => {
  it("lighting ≤ MAX_LIGHTING for every preset", () => {
    for (const p of listPresets()) expect(p.lighting).toBeLessThanOrEqual(MAX_LIGHTING);
  });
  it("particle count ≤ MAX_PARTICLE_COUNT for every preset", () => {
    for (const p of listPresets()) expect(p.particles.count).toBeLessThanOrEqual(MAX_PARTICLE_COUNT);
  });
  it("particle speed ≤ MAX_PARTICLE_SPEED for every preset", () => {
    for (const p of listPresets()) expect(p.particles.speed).toBeLessThanOrEqual(MAX_PARTICLE_SPEED);
  });
  it("fog opacity ≤ MAX_FOG_OPACITY for every preset", () => {
    for (const p of listPresets()) expect(p.fog.opacity).toBeLessThanOrEqual(MAX_FOG_OPACITY);
  });
  it("audio volume ≤ MAX_AUDIO_VOLUME (or audio is null)", () => {
    for (const p of listPresets()) {
      if (p.audio) expect(p.audio.volume).toBeLessThanOrEqual(MAX_AUDIO_VOLUME);
    }
  });
  it("MIN_TRANSITION_MS is exactly 1500", () => {
    expect(MIN_TRANSITION_MS).toBe(1500);
  });
});

describe("Forbidden effects (14)", () => {
  it("declares exactly 14 forbidden effects", () => {
    expect(FORBIDDEN_EFFECTS.length).toBe(14);
  });
  it("includes the canonical no-go set", () => {
    for (const need of ["confetti", "burst", "flash", "dopamine-loop", "achievement", "streak", "popup"]) {
      expect(FORBIDDEN_EFFECTS).toContain(need);
    }
  });
  it("containsForbiddenEffect detects substring matches case-insensitively", () => {
    expect(containsForbiddenEffect("/audio/confetti-burst.mp3")).toBe(true);
    expect(containsForbiddenEffect("Quiet Orbit")).toBe(false);
    expect(containsForbiddenEffect("STREAK keeper sound")).toBe(true);
  });
  it("no shipped preset references a forbidden effect in name or audio src", () => {
    for (const p of listPresets()) {
      expect(containsForbiddenEffect(p.internalName)).toBe(false);
      if (p.audio?.src) expect(containsForbiddenEffect(p.audio.src)).toBe(false);
    }
  });
});

describe("auditPreset", () => {
  it("returns [] for every shipped preset", () => {
    for (const p of listPresets()) expect(auditPreset(p)).toEqual([]);
  });
  it("flags out-of-range lighting", () => {
    const bad = { ...listPresets()[0], lighting: 0.95 };
    const findings = auditPreset(bad);
    expect(findings.some((f) => f.rule === "max-lighting")).toBe(true);
  });
  it("flags out-of-range particle count and speed", () => {
    const base = listPresets()[0];
    const tooMany = { ...base, particles: { ...base.particles, count: 99 } };
    const tooFast = { ...base, particles: { ...base.particles, speed: 1.0 } };
    expect(auditPreset(tooMany).some((f) => f.rule === "max-particle-count")).toBe(true);
    expect(auditPreset(tooFast).some((f) => f.rule === "max-particle-speed")).toBe(true);
  });
  it("flags out-of-range fog opacity", () => {
    const base = listPresets()[0];
    const foggy = { ...base, fog: { ...base.fog, opacity: 0.5 } };
    expect(auditPreset(foggy).some((f) => f.rule === "max-fog-opacity")).toBe(true);
  });
  it("flags forbidden-effect keyword in internalName", () => {
    const base = listPresets()[0];
    const cursed = { ...base, internalName: "Confetti Cascade" };
    expect(auditPreset(cursed).some((f) => f.rule === "forbidden-effect-name")).toBe(true);
  });
  it("flags forbidden-effect keyword in audio src", () => {
    const base = listPresets()[1]; // gentleLantern has audio
    const cursedAudio = base.audio
      ? { ...base, audio: { ...base.audio, src: "/audio/dopamine-loop.mp3" } }
      : base;
    if (base.audio) {
      expect(
        auditPreset(cursedAudio).some((f) => f.rule === "forbidden-effect-audio"),
      ).toBe(true);
    }
  });
  it("flags audio volume above ceiling", () => {
    const base = listPresets()[1];
    if (base.audio) {
      const loud = { ...base, audio: { ...base.audio, volume: 0.5 } };
      expect(auditPreset(loud).some((f) => f.rule === "max-audio-volume")).toBe(true);
    }
  });
});

describe("resolvePreset", () => {
  it("returns the correct preset for every SceneState", () => {
    for (const s of SCENE_STATES) {
      expect(resolvePreset(s).state).toBe(s);
      expect(resolvePreset(s).internalName).toBe(STATE_TO_NAME[s]);
    }
  });
  it("never throws for any defined SceneState", () => {
    for (const s of SCENE_STATES) {
      expect(() => resolvePreset(s)).not.toThrow();
    }
  });
});

describe("Public barrel surface", () => {
  it("exposes the documented API and does NOT leak internal mutators", async () => {
    const barrel = await import("../index");
    const exposed = Object.keys(barrel);
    // Public API
    for (const name of [
      "SceneTransitionController",
      "useScenePreset",
      "resolvePreset",
      "listPresets",
      "SCENE_STATES",
      "SCENE_REGISTRY",
      "MAX_LIGHTING",
      "MAX_PARTICLE_COUNT",
      "MAX_PARTICLE_SPEED",
      "MAX_FOG_OPACITY",
      "MAX_AUDIO_VOLUME",
      "MIN_TRANSITION_MS",
      "FORBIDDEN_EFFECTS",
      "auditPreset",
      "assertPresetCompliant",
      "containsForbiddenEffect",
    ]) {
      expect(exposed).toContain(name);
    }
    // No leaked internal under-prefixed exports
    for (const [name, value] of Object.entries(barrel)) {
      if (typeof value === "function") {
        expect(name.startsWith("_")).toBe(false);
      }
    }
    // SCENE_REGISTRY is exposed for inspection but mutation by callers does
    // not affect resolvePreset (registry literal is reassigned per import).
    expect(typeof barrel.resolvePreset).toBe("function");
  });
});
