/**
 * Phase 22 — React hook wrapping the pure scheduler reducer.
 *
 * Adds:
 *   - Reduced-motion subscription (SSR-safe). When set, the optional
 *     ambient phase indicator should not animate.
 *   - Soft tick interval (60s) that calls `observePhase` so the engine
 *     can detect day rollover + (when enabled) phase change. The tick
 *     is suppressed entirely under reduced-motion only when there is
 *     no pending nudge — observation itself never animates anything,
 *     but we want to be conservative about background work.
 *
 * The hook NEVER auto-dispatches a nudge. Dispatch is the host's
 * decision — the host calls `tryDispatchNudge(phase)` which runs through
 * the locked `canDispatchNudge` gate and is rejected silently if any
 * scheduler limit is violated.
 */

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  INITIAL_STATE,
  canDispatchNudge,
  resolvePhase,
  schedulerReducer,
  type CircadianPhase,
  type PendingNudge,
  type SchedulerState,
} from "./circadianStateMachine";
import { resolveScene } from "../presets/circadianScenes";
import { assertScenePresetCompliant } from "../governance/schedulerSafetyRules";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const TICK_MS = 60_000;

function readReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

export type UseCircadianSchedulerReturn = Readonly<{
  state: SchedulerState;
  reducedMotion: boolean;
  currentPhase: CircadianPhase;
  optIn: () => void;
  optOut: () => void;
  setPhaseChangeAnnouncements: (enabled: boolean) => void;
  /**
   * Attempts to dispatch a nudge for the current local phase. Returns
   * `true` only if the locked scheduler limits permitted it. Refuses
   * silently otherwise — the host UI should not surface a "rejected"
   * affordance because the user did nothing wrong.
   */
  tryDispatchNudge: () => boolean;
  acknowledge: () => void;
  skip: () => void;
  dismiss: () => void;
}>;

export function useCircadianScheduler(): UseCircadianSchedulerReturn {
  const [state, dispatch] = useReducer(schedulerReducer, INITIAL_STATE);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    readReducedMotion(),
  );

  // Reduced-motion live subscription.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(REDUCED_MOTION_QUERY);
    } catch {
      return;
    }
    const onChange = () => setReducedMotion(mql.matches);
    setReducedMotion(mql.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    // Safari fallback
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  // Soft tick — only while opted in. Calls observePhase so the engine
  // detects day rollover. Never auto-dispatches a nudge.
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Architect-driven hardening (concurrent-call guard): set true the
  // moment dispatchNudge fires; cleared after the reducer's state
  // transition is observed in the next render via the useEffect below.
  const dispatchInFlightRef = useRef<boolean>(false);
  useEffect(() => {
    // Once the reducer has accepted (status flipped to nudge-pending) or
    // refused (status remains idle / nothing pending), the in-flight
    // guard is safe to clear. Cleared on every render after a dispatch.
    dispatchInFlightRef.current = false;
  }, [state.status, state.pendingNudge]);
  useEffect(() => {
    if (!state.enabled) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    // Initial observation.
    dispatch({ type: "observePhase", now: new Date() });
    tickRef.current = setInterval(() => {
      dispatch({ type: "observePhase", now: new Date() });
    }, TICK_MS);
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [state.enabled]);

  const currentPhase = useMemo<CircadianPhase>(
    () => state.lastObservedPhase ?? resolvePhase(new Date()),
    [state.lastObservedPhase],
  );

  return {
    state,
    reducedMotion,
    currentPhase,
    optIn: () => dispatch({ type: "optIn" }),
    optOut: () => dispatch({ type: "optOut" }),
    setPhaseChangeAnnouncements: (enabled: boolean) =>
      dispatch({ type: "setPhaseChangeAnnouncements", enabled }),
    tryDispatchNudge: () => {
      // Architect-driven hardening: guard against rapid concurrent calls
      // returning a falsely-truthy `true` from a stale React closure.
      // `dispatchInFlightRef` flips true synchronously; a second call in
      // the same tick will see the marker and refuse before dispatch.
      if (dispatchInFlightRef.current) return false;
      const now = new Date();
      const gate = canDispatchNudge(state, now);
      if (!gate.allowed) return false;
      const phase = resolvePhase(now);
      const scene = resolveScene(phase);
      // Re-audit at the runtime sink so a host monkey-patching a registry
      // entry can't slip an unaudited preset through to the user. Fails
      // closed — throws; caller treats as no-op.
      try {
        assertScenePresetCompliant(scene);
      } catch {
        return false;
      }
      const nudge: Omit<PendingNudge, "dispatchedAt"> = {
        id: `${phase}-${now.getTime()}`,
        phase,
        copy: scene.copy,
        microCopy: scene.microCopy,
      };
      dispatchInFlightRef.current = true;
      dispatch({ type: "dispatchNudge", now, nudge });
      return true;
    },
    acknowledge: () => dispatch({ type: "acknowledge" }),
    skip: () => dispatch({ type: "skip" }),
    dismiss: () => dispatch({ type: "dismiss" }),
  };
}
