/**
 * Phase 11 — Full lifecycle hook (per provider instance).
 *
 * Wires the per-surface Zustand store ↔ telemetry ↔ reduced-motion ↔
 * optional FPS sampler. Mounted exactly once by the runtime provider.
 */

import { useEffect, useRef } from "react";
import {
  useAvatarLifeStore,
  useAvatarStoreApi,
} from "../state/useAvatarLifeStore";
import { emitAvatarTelemetry } from "../observability/avatarRuntimeTelemetry";
import {
  EMOTION_MULTIPLIERS,
  type EmotionalState,
  type SurfaceContext,
} from "../types/avatarLifeTypes";
import { auditMultiplier } from "../governance/nonDriftRules";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

interface PresenceOptions {
  surface: SurfaceContext;
  initialState?: EmotionalState;
  sampleFps?: boolean;
}

export function useAvatarPresenceRuntime({
  surface,
  initialState,
  sampleFps = false,
}: PresenceOptions): void {
  const api = useAvatarStoreApi();
  const reducedMotion = useReducedMotionSafe();
  const setReducedMotion = useAvatarLifeStore((s) => s.setReducedMotion);

  const initialisedRef = useRef(false);

  // Mount: reset store for surface, set initial state, emit mount event.
  useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;
    api.getState().resetForSurface(surface);
    if (initialState) api.getState().setState(initialState);
    api.getState().setMounted(true);

    const startState = api.getState().currentState;
    for (const v of auditMultiplier(startState, EMOTION_MULTIPLIERS[startState])) {
      emitAvatarTelemetry({
        type: "avatar:contract_violation",
        rule: v.rule,
        detail: v.detail,
        ts: Date.now(),
      });
    }
    emitAvatarTelemetry({
      type: "avatar:mount",
      surface,
      state: startState,
      ts: Date.now(),
    });

    return () => {
      emitAvatarTelemetry({ type: "avatar:unmount", surface, ts: Date.now() });
      api.getState().setMounted(false);
      initialisedRef.current = false;
    };
  }, [api, surface, initialState]);

  // Sync reduced-motion into store + emit change events.
  useEffect(() => {
    setReducedMotion(reducedMotion);
    emitAvatarTelemetry({
      type: "avatar:reduced_motion_change",
      reduced: reducedMotion,
      ts: Date.now(),
    });
  }, [reducedMotion, setReducedMotion]);

  // Subscribe to state-change + crisis events for telemetry.
  useEffect(() => {
    let prev = api.getState().currentState;
    let prevCrisis = api.getState().crisis;
    return api.subscribe((s) => {
      if (s.currentState !== prev) {
        emitAvatarTelemetry({
          type: "avatar:state_change",
          from: prev,
          to: s.currentState,
          ts: Date.now(),
        });
        prev = s.currentState;
      }
      if (s.crisis !== prevCrisis) {
        emitAvatarTelemetry({
          type: s.crisis ? "avatar:crisis_engage" : "avatar:crisis_release",
          surface,
          ts: Date.now(),
        });
        prevCrisis = s.crisis;
      }
    });
  }, [api, surface]);

  // Optional rAF FPS sampler — 1Hz cadence, telemetry de-dupes to 1/5s.
  useEffect(() => {
    if (!sampleFps) return;
    if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") return;
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        const fps = (frames * 1000) / (now - last);
        api.getState().setFps(fps);
        emitAvatarTelemetry({
          type: "avatar:fps_sample",
          fps: Math.round(fps),
          surface,
          ts: Date.now(),
        });
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [api, sampleFps, surface]);
}
