/**
 * Phase 20 — Frozen registry of all 7 ritual presets.
 *
 * Same defense-in-depth pattern as v5.8.56's SCENE_REGISTRY:
 *   - deepFreeze every preset + the registry at module load.
 *   - Module-load shape guard (throw if not exactly 7 entries).
 *   - State→preset coherence check (each preset's `ritualKey` matches its key).
 *
 * Runtime mutation attempts are no-ops in non-strict mode and TypeError in
 * strict mode — host code cannot swap an audited preset for an unaudited one.
 */

import { softArrival } from "../presets/softArrival";
import { oneBreathReset } from "../presets/oneBreathReset";
import { grounding54321 } from "../presets/grounding54321";
import { gentleTransition } from "../presets/gentleTransition";
import { holdingSpace } from "../presets/holdingSpace";
import { sleepSoftener } from "../presets/sleepSoftener";
import { tinyHope } from "../presets/tinyHope";
import { RITUAL_KEYS, type RitualKey, type RitualPreset } from "./RitualEngine";

function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
  for (const key of Object.keys(obj as object)) {
    const value = (obj as Record<string, unknown>)[key];
    if (value && typeof value === "object") deepFreeze(value);
  }
  return Object.freeze(obj);
}

const _registry: Record<RitualKey, RitualPreset> = {
  softArrival: deepFreeze(softArrival),
  oneBreathReset: deepFreeze(oneBreathReset),
  grounding54321: deepFreeze(grounding54321),
  gentleTransition: deepFreeze(gentleTransition),
  holdingSpace: deepFreeze(holdingSpace),
  sleepSoftener: deepFreeze(sleepSoftener),
  tinyHope: deepFreeze(tinyHope),
};

export const RITUAL_REGISTRY: Readonly<Record<RitualKey, RitualPreset>> =
  Object.freeze(_registry);

// Module-load guards.
if (Object.keys(RITUAL_REGISTRY).length !== 7) {
  throw new Error(
    `[lumi-rituals] RITUAL_REGISTRY must contain exactly 7 presets, got ` +
      `${Object.keys(RITUAL_REGISTRY).length}.`,
  );
}
for (const key of RITUAL_KEYS) {
  const p = RITUAL_REGISTRY[key];
  if (!p) {
    throw new Error(`[lumi-rituals] missing preset for ritualKey "${key}".`);
  }
  if (p.ritualKey !== key) {
    throw new Error(
      `[lumi-rituals] preset key/value mismatch: registry["${key}"].ritualKey ` +
        `is "${p.ritualKey}".`,
    );
  }
}

/** Resolve a preset by key. Throws if no preset exists for the key. */
export function resolveRitual(key: RitualKey): RitualPreset {
  const p = RITUAL_REGISTRY[key];
  if (!p) throw new Error(`[lumi-rituals] unknown ritualKey "${key}".`);
  return p;
}

/** All 7 presets, in spec order. */
export function listRituals(): readonly RitualPreset[] {
  return RITUAL_KEYS.map((k) => RITUAL_REGISTRY[k]);
}
