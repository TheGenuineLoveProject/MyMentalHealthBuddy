/**
 * Phase 19 — Emotional Scene Presets
 *
 * Pure resolver: maps a Lumi emotional state → one of 7 named scene presets.
 *
 * NON-NEGOTIABLES (enforced by `governance/presetSafetyRules.ts`):
 *  - Scenes react to Lumi's state, never invent new states.
 *  - Scene names are INTERNAL ONLY — never surfaced to the user.
 *  - Avatar identity is frozen — the controller renders scene layers
 *    behind/around Lumi as `children`; nothing here ever touches Lumi's
 *    body, face, or colors.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type SceneState =
  | "calm"
  | "comforting"
  | "reflective"
  | "sleepy"
  | "grounding"
  | "joySoft"
  | "concernSoft";

export const SCENE_STATES: ReadonlyArray<SceneState> = [
  "calm",
  "comforting",
  "reflective",
  "sleepy",
  "grounding",
  "joySoft",
  "concernSoft",
];

export type ParticleConfig = {
  /** 0..MAX_PARTICLE_COUNT (8). */
  count: number;
  /** 0..MAX_PARTICLE_SPEED (0.2). */
  speed: number;
  /** rgba/palette token only — no hex literals beyond palette source. */
  color: string;
  sizePx: number;
};

export type FogConfig = {
  /** 0..MAX_FOG_OPACITY (0.15). */
  opacity: number;
  color: string;
};

export type AudioConfig = {
  /** Spec-mandated audio character. Internal-only descriptor. */
  description: string;
  /**
   * Host-provided source path. `null` means "no playback".
   * Phase 19 ships with `null` everywhere — audio assets are wired by host.
   */
  src: string | null;
  /** 0..MAX_AUDIO_VOLUME (0.1). */
  volume: number;
  loop: boolean;
};

export type ScenePreset = {
  /** Internal-only name. NEVER surfaced to user UI. */
  internalName: string;
  state: SceneState;
  background: {
    /** CSS gradient using palette tokens / decorative rgba. */
    gradient: string;
    /** Base wash color. */
    wash: string;
  };
  /** 0..MAX_LIGHTING (0.8). */
  lighting: number;
  particles: ParticleConfig;
  fog: FogConfig;
  /** null = scene is intentionally silent. */
  audio: AudioConfig | null;
};

// ─── Registry (lazy import to keep the resolver tree-shake friendly) ───────

import { stillMeadow } from "../presets/stillMeadow";
import { gentleLantern } from "../presets/gentleLantern";
import { quietOrbit } from "../presets/quietOrbit";
import { cloudRest } from "../presets/cloudRest";
import { softHorizon } from "../presets/softHorizon";
import { tinyBloom } from "../presets/tinyBloom";
import { holdingSpace } from "../presets/holdingSpace";

// Deep-freeze every preset (and the registry) at module load so that
// host code cannot mutate `SCENE_REGISTRY[state]` post-import to bypass
// the module-load audit. TypeScript `Readonly` is compile-time only;
// `Object.freeze` is the runtime contract.
function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
  for (const key of Object.keys(obj as object)) {
    const value = (obj as Record<string, unknown>)[key];
    if (value && typeof value === "object") deepFreeze(value);
  }
  return Object.freeze(obj);
}

const _registry: Record<SceneState, ScenePreset> = {
  calm: deepFreeze(stillMeadow),
  comforting: deepFreeze(gentleLantern),
  reflective: deepFreeze(quietOrbit),
  sleepy: deepFreeze(cloudRest),
  grounding: deepFreeze(softHorizon),
  joySoft: deepFreeze(tinyBloom),
  concernSoft: deepFreeze(holdingSpace),
};

export const SCENE_REGISTRY: Readonly<Record<SceneState, ScenePreset>> =
  Object.freeze(_registry);

// Module-load guards: registry shape and state↔preset coherence.
if (Object.keys(SCENE_REGISTRY).length !== 7) {
  throw new Error(
    `[lumi-scenes] SCENE_REGISTRY must contain exactly 7 presets, got ` +
      `${Object.keys(SCENE_REGISTRY).length}. Spec violation.`,
  );
}
for (const s of SCENE_STATES) {
  const p = SCENE_REGISTRY[s];
  if (!p) throw new Error(`[lumi-scenes] missing preset for state "${s}"`);
  if (p.state !== s) {
    throw new Error(
      `[lumi-scenes] preset for "${s}" has wrong state field "${p.state}"`,
    );
  }
}

/** Resolve a state → preset. Pure. Never throws on a valid SceneState. */
export function resolvePreset(state: SceneState): ScenePreset {
  const p = SCENE_REGISTRY[state];
  if (!p) {
    throw new Error(`[lumi-scenes] unknown SceneState: ${String(state)}`);
  }
  return p;
}

/** All 7 presets (stable ordering for tests/transparency). */
export function listPresets(): ReadonlyArray<ScenePreset> {
  return SCENE_STATES.map((s) => SCENE_REGISTRY[s]);
}
