/**
 * Phase 19 — Emotional Scene Presets · React hook
 *
 * Tracks current + previous preset for soft crossfade rendering.
 * Crossfade duration is locked at `MIN_TRANSITION_MS` (1500ms).
 *
 * Reduced-motion contract: the previous preset is dropped immediately
 * (no crossfade animation), but the new preset still becomes current.
 * The change is gentle and informational, never abrupt visual noise.
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
  isTransitioning: boolean;
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
    // Fallback for older browsers
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);
  return reduced;
}

export function useScenePreset(initial: SceneState = "calm"): UseScenePresetReturn {
  const reduced = usePrefersReducedMotion();
  const [sceneState, _setSceneState] = useState<SceneState>(initial);
  const [previousPreset, setPreviousPreset] = useState<ScenePreset | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentPreset = useMemo(() => resolvePreset(sceneState), [sceneState]);

  const setSceneState = useCallback(
    (next: SceneState) => {
      _setSceneState((prev) => {
        if (prev === next) return prev;
        const prevPreset = resolvePreset(prev);
        if (reduced) {
          // Reduced-motion: instant swap, no crossfade.
          setPreviousPreset(null);
          setIsTransitioning(false);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        } else {
          setPreviousPreset(prevPreset);
          setIsTransitioning(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            setPreviousPreset(null);
            setIsTransitioning(false);
            timerRef.current = null;
          }, MIN_TRANSITION_MS);
        }
        return next;
      });
    },
    [reduced],
  );

  // Cleanup timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    currentPreset,
    previousPreset,
    isTransitioning,
    setSceneState,
    sceneState,
    transitionMs: MIN_TRANSITION_MS,
  };
}
