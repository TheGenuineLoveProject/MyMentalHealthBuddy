/**
 * Phase 20 — Guided Presence Rituals · React hook
 *
 * Wraps the pure RitualEngine with a soft auto-advance timer and an
 * SSR-safe reduced-motion subscription.
 *
 * Reduced-motion contract:
 *  - Auto-advance timer is suppressed entirely; the user advances by
 *    pressing "Continue" (or skipping). No motion, no surprise.
 *  - The hook still exposes the full action surface — reduced motion
 *    never removes user agency.
 *
 * Identity contract:
 *  - This hook never reads, writes, or animates Lumi avatar state.
 *  - All visual rendering happens in `GuidedPresenceRitual` and never
 *    touches avatar DOM.
 */

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  INITIAL_STATE,
  isTerminalStatus,
  ritualReducer,
  type RitualAction,
  type RitualPreset,
  type RitualState,
  type RitualStep,
} from "./RitualEngine";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);
  return reduced;
}

export type UseRitualReturn = {
  /** Current engine state. */
  state: RitualState;
  /** Convenience: current step (or null when idle/terminal). */
  currentStep: RitualStep | null;
  /** True if reduced-motion is active. */
  reducedMotion: boolean;
  /** Action dispatchers — pause/skip/exit are always available. */
  start: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  skipStep: () => void;
  skipAll: () => void;
  exit: () => void;
  reset: () => void;
};

export function useRitual(preset: RitualPreset): UseRitualReturn {
  const reducedMotion = usePrefersReducedMotion();
  const reducer = useCallback(
    (s: RitualState, a: RitualAction) => ritualReducer(s, a, preset),
    [preset],
  );
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Soft auto-advance: only when active, not paused, not reduced-motion,
  // and the current step has a durationMs hint.
  useEffect(() => {
    clearTimer();
    if (state.status !== "active") return;
    if (reducedMotion) return; // user controls advancing
    const step = preset.steps[state.stepIndex];
    if (!step || typeof step.durationMs !== "number" || step.durationMs <= 0) {
      return;
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      dispatch({ type: "advance" });
    }, step.durationMs);
    return clearTimer;
  }, [state.status, state.stepIndex, reducedMotion, preset, clearTimer]);

  // Cleanup on unmount.
  useEffect(() => () => clearTimer(), [clearTimer]);

  const currentStep = useMemo<RitualStep | null>(() => {
    if (state.status === "active" || state.status === "paused") {
      return preset.steps[state.stepIndex] ?? null;
    }
    return null;
  }, [state, preset]);

  // If reset is dispatched while a timer is in flight, the effect above will
  // also clear it (status changes); explicit safety here for terminal states.
  useEffect(() => {
    if (isTerminalStatus(state.status)) clearTimer();
  }, [state.status, clearTimer]);

  return {
    state,
    currentStep,
    reducedMotion,
    start: useCallback(() => dispatch({ type: "start" }), []),
    pause: useCallback(() => dispatch({ type: "pause" }), []),
    resume: useCallback(() => dispatch({ type: "resume" }), []),
    next: useCallback(() => dispatch({ type: "advance" }), []),
    skipStep: useCallback(() => dispatch({ type: "skipStep" }), []),
    skipAll: useCallback(() => dispatch({ type: "skipAll" }), []),
    exit: useCallback(() => dispatch({ type: "exit" }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
  };
}
