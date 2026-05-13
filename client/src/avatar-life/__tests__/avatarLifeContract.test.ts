/**
 * Phase 11 — Contract tests.
 *
 * 5 suites · 22 assertions · ALL must pass.
 *
 * Store tests use `createAvatarLifeStore()` directly (no React tree)
 * since the store is now per-provider. This validates the same reducer
 * contracts the React provider relies on at runtime.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  EMOTIONAL_STATES,
  EMOTION_MULTIPLIERS,
  INTERACTION_LIMITS,
  SURFACE_DEFAULT_STATE,
  GLOW_OPACITY_CEILING,
} from "../types/avatarLifeTypes";
import {
  auditAll,
  auditMultiplier,
  MOTION_LIMITS,
} from "../governance/nonDriftRules";
import {
  createAvatarLifeStore,
  type AvatarLifeStoreApi,
} from "../state/useAvatarLifeStore";
import {
  __resetAvatarTelemetry,
  emitAvatarTelemetry,
  onAvatarTelemetry,
} from "../observability/avatarRuntimeTelemetry";

let store: AvatarLifeStoreApi;

beforeEach(() => {
  store = createAvatarLifeStore("hero");
});

afterEach(() => {
  __resetAvatarTelemetry();
});

describe("Suite 1 — Emotional state catalog", () => {
  it("declares exactly 8 emotional states", () => {
    expect(EMOTIONAL_STATES.length).toBe(8);
  });
  it("provides a multiplier preset for every declared state", () => {
    for (const s of EMOTIONAL_STATES) {
      expect(EMOTION_MULTIPLIERS[s]).toBeDefined();
    }
  });
  it("has unique state identifiers", () => {
    expect(new Set(EMOTIONAL_STATES).size).toBe(EMOTIONAL_STATES.length);
  });
  it("includes both pending states (gentleConcern + welcoming)", () => {
    expect(EMOTIONAL_STATES).toContain("gentleConcern");
    expect(EMOTIONAL_STATES).toContain("welcoming");
  });
  it("calmIdle carries the v5.8.45 verified baseline (7.1s breath, 9.3s float, 1.0x amplitude)", () => {
    const m = EMOTION_MULTIPLIERS.calmIdle;
    expect(m.breathCycle).toBe(7.1);
    expect(m.floatCycle).toBe(9.3);
    expect(m.floatAmplitude).toBe(1.0);
  });
});

describe("Suite 2 — NON-DRIFT motion ceilings", () => {
  it("audits all 8 states + interaction limits with zero violations", () => {
    expect(auditAll()).toEqual([]);
  });
  it("flags an over-ceiling glow opacity as a violation", () => {
    const v = auditMultiplier("calmIdle", {
      ...EMOTION_MULTIPLIERS.calmIdle,
      glowOpacity: 0.5,
    });
    expect(v.length).toBeGreaterThan(0);
    expect(v.some((x) => x.rule.endsWith("glowOpacity"))).toBe(true);
  });
  it("ceiling values match the v5.8.47 sub-pixel envelope", () => {
    expect(MOTION_LIMITS.FLOAT_DISPLACEMENT_PX_CEILING).toBeLessThanOrEqual(12);
    expect(MOTION_LIMITS.BREATH_SCALE_RANGE_CEILING).toBeLessThanOrEqual(0.03);
    expect(GLOW_OPACITY_CEILING).toBeLessThanOrEqual(0.18);
  });
  it("flags off-palette glow color", () => {
    const v = auditMultiplier("calmIdle", {
      ...EMOTION_MULTIPLIERS.calmIdle,
      glowColor: "#FF00FF",
    });
    expect(v.some((x) => x.rule.endsWith("glowColor"))).toBe(true);
  });
});

describe("Suite 3 — Per-surface store reducer behavior", () => {
  it("setState only accepts known emotional states", () => {
    store.getState().setState("comforting");
    expect(store.getState().currentState).toBe("comforting");
    // @ts-expect-error — invalid state literal
    store.getState().setState("EUPHORIA");
    expect(store.getState().currentState).toBe("comforting");
  });
  it("crisis engage clears all interaction flags atomically", () => {
    store.getState().setHover(true);
    store.getState().setProximity(true);
    store.getState().setClicked(true);
    store.getState().setCrisis(true);
    const s = store.getState();
    expect(s.hover).toBe(false);
    expect(s.proximity).toBe(false);
    expect(s.clicked).toBe(false);
  });
  it("setHover is rejected while crisis is active (asymmetric risk)", () => {
    store.getState().setCrisis(true);
    store.getState().setHover(true);
    expect(store.getState().hover).toBe(false);
  });
  it("resetForSurface assigns the surface's default state", () => {
    store.getState().resetForSurface("chat");
    expect(store.getState().currentState).toBe("comforting");
    store.getState().resetForSurface("buddy");
    expect(store.getState().currentState).toBe("peacefulJoy");
  });
  it("setFps clamps negatives to zero and rounds floats", () => {
    store.getState().setFps(-12);
    expect(store.getState().fps).toBe(0);
    store.getState().setFps(59.6);
    expect(store.getState().fps).toBe(60);
  });
});

describe("Suite 4 — Telemetry emitter", () => {
  it("delivers events to subscribers", () => {
    const received: string[] = [];
    onAvatarTelemetry((e) => received.push(e.type));
    emitAvatarTelemetry({
      type: "avatar:mount",
      surface: "hero",
      state: "calmIdle",
      ts: Date.now(),
    });
    expect(received).toEqual(["avatar:mount"]);
  });
  it("returns an unsubscribe function that detaches the listener", () => {
    let count = 0;
    const off = onAvatarTelemetry(() => count++);
    off();
    emitAvatarTelemetry({
      type: "avatar:click",
      surface: "hero",
      ts: Date.now(),
    });
    expect(count).toBe(0);
  });
  it("throttles fps_sample emissions to ≤1/5s", () => {
    const seen: number[] = [];
    onAvatarTelemetry((e) => {
      if (e.type === "avatar:fps_sample") seen.push(e.fps);
    });
    const now = Date.now();
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 60, surface: "hero", ts: now });
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 58, surface: "hero", ts: now + 1000 });
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 55, surface: "hero", ts: now + 5500 });
    expect(seen.length).toBe(2);
  });
  it("throttles fps_sample PER SURFACE (hero + chat independent)", () => {
    const seen: { surface: string; fps: number }[] = [];
    onAvatarTelemetry((e) => {
      if (e.type === "avatar:fps_sample") seen.push({ surface: e.surface, fps: e.fps });
    });
    const t = Date.now();
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 60, surface: "hero", ts: t });
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 58, surface: "chat", ts: t + 100 });
    emitAvatarTelemetry({ type: "avatar:fps_sample", fps: 55, surface: "hero", ts: t + 200 });
    expect(seen.length).toBe(2);
    expect(seen.map((x) => x.surface).sort()).toEqual(["chat", "hero"]);
  });

  it("does not break if a listener throws", () => {
    onAvatarTelemetry(() => {
      throw new Error("listener bug");
    });
    let secondCalled = false;
    onAvatarTelemetry(() => {
      secondCalled = true;
    });
    emitAvatarTelemetry({
      type: "avatar:mount",
      surface: "hero",
      state: "calmIdle",
      ts: Date.now(),
    });
    expect(secondCalled).toBe(true);
  });
});

describe("Suite 5 — Surface defaults & interaction caps", () => {
  it("hero defaults to calmIdle, chat to comforting, buddy to peacefulJoy", () => {
    expect(SURFACE_DEFAULT_STATE.hero).toBe("calmIdle");
    expect(SURFACE_DEFAULT_STATE.chat).toBe("comforting");
    expect(SURFACE_DEFAULT_STATE.buddy).toBe("peacefulJoy");
  });
  it("proximity radius stays within governance ceiling", () => {
    expect(INTERACTION_LIMITS.proximity.radiusPx).toBeLessThanOrEqual(MOTION_LIMITS.PROXIMITY_RADIUS_PX_CEILING);
  });
  it("click pulse decays in well under 1 second (no attention pull)", () => {
    expect(INTERACTION_LIMITS.click.durationMs).toBeLessThanOrEqual(MOTION_LIMITS.CLICK_PULSE_DURATION_MS_CEILING);
  });
  it("hover + proximity glow boosts both stay below the interaction ceiling", () => {
    expect(INTERACTION_LIMITS.hover.glowBoost).toBeLessThanOrEqual(MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING);
    expect(INTERACTION_LIMITS.proximity.glowBoost).toBeLessThanOrEqual(MOTION_LIMITS.INTERACTION_GLOW_BOOST_CEILING);
  });
});
