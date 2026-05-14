/**
 * Phase 19 — Emotional Scene Presets · React hook
 *
 * Tracks current + previous preset for soft crossfade rendering.
 * Crossfade duration is locked at `MIN_TRANSITION_MS` (1500ms).
 *
 * Architect-driven hardening (post-build review):
 *  - Two-phase fade: previous layer mounts at opacity 1, then on the next
 *    animation frame a `previousFading` flag flips to true → CSS opacity
 *    transitions 1 → 0 over 1500ms. Without this, the previous layer
 *    paints at opacity 0 from frame 1 (effectively a teleport swap).
 *  - Reduced-motion mid-transition: an effect watches `reduced` and, if
 *    a transition is in flight when reduced becomes true, immediately
 *    clears the timer + previous layer (no abrupt visual after the user
 *    has just asked the OS to calm motion).
 *
 * Reduced-motion contract: previous layer is dropped immediately, no
 * crossfade animation, but the new preset still becomes current.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  resolvePreset,
  type ScenePreset,
  type SceneState,
} from "./ScenePresetEngine";
import { MIN_TRANSITION_MS } from "../governance/presetSafetyRules";

export type UseScenePresetReturn = {
  currentPreset: ScenePreset;
  previousPreset: ScenePreset | null;
  /** True for the full 1500ms window (mount → fade-to-zero → unmount). */
  isTransitioning: boolean;
  /**
   * False on the first paint of the previous layer (so it renders at
   * opacity 1), true thereafter (so CSS transitions 1 → 0). Internal
   * to the controller; consumers usually only need `isTransitioning`.
   */
  previousFading: boolean;
  setSceneState: (next: SceneState) => void;
  /** Echo of the active state (after the most recent setSceneState call). */
  sceneState: SceneState;
  /** Locked crossfade duration in ms. Always 1500. */
  transitionMs: number;
};

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

export function useScenePreset(initial: SceneState = "calm"): UseScenePresetReturn {
  const reduced = usePrefersReducedMotion();
  const [sceneState, _setSceneState] = useState<SceneState>(initial);
  const [previousPreset, setPreviousPreset] = useState<ScenePreset | null>(null);
  const [previousFading, setPreviousFading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const currentPreset = useMemo(() => resolvePreset(sceneState), [sceneState]);

  const clearAll = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current !== null && typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const setSceneState = useCallback(
    (next: SceneState) => {
      _setSceneState((prev) => {
        if (prev === next) return prev;
        const prevPreset = resolvePreset(prev);
        // Always start clean — rapid successive setSceneState calls must
        // never leak a stale previous-layer or stale timer.
        clearAll();
        if (reduced) {
          setPreviousPreset(null);
          setPreviousFading(false);
          setIsTransitioning(false);
        } else {
          setPreviousPreset(prevPreset);
          setPreviousFading(false); // first paint at opacity 1
          setIsTransitioning(true);
          // Flip to opacity 0 on the next animation frame so CSS sees a
          // 1 → 0 transition instead of 0 → 0 (which paints as a teleport).
          if (typeof requestAnimationFrame !== "undefined") {
            rafRef.current = requestAnimationFrame(() => {
              rafRef.current = null;
              setPreviousFading(true);
            });
          } else {
            // SSR / non-DOM env: skip animation, behave like instant swap.
            setPreviousFading(true);
          }
          timerRef.current = setTimeout(() => {
            setPreviousPreset(null);
            setPreviousFading(false);
            setIsTransitioning(false);
            timerRef.current = null;
          }, MIN_TRANSITION_MS);
        }
        return next;
      });
    },
    [reduced, clearAll],
  );

  // Reduced-motion mid-transition: if the user enables reduce-motion while
  // a crossfade is in flight, drop the previous layer immediately.
  useEffect(() => {
    if (reduced && (previousPreset !== null || isTransitioning)) {
      clearAll();
      setPreviousPreset(null);
      setPreviousFading(false);
      setIsTransitioning(false);
    }
  }, [reduced, previousPreset, isTransitioning, clearAll]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return {
    currentPreset,
    previousPreset,
    isTransitioning,
    previousFading,
    setSceneState,
    sceneState,
    transitionMs: MIN_TRANSITION_MS,
  };
}
