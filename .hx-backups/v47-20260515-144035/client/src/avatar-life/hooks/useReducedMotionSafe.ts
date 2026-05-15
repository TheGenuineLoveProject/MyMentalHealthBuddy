/**
 * Phase 11 — prefers-reduced-motion detection with live updates.
 *
 * SSR-safe (returns false on server). Listens for media-query changes so
 * users who toggle the OS setting mid-session get instant updates.
 * Mirrors the hook contract used in v5.8.43 FloatIdleAnimated.
 */

import { useEffect, useState } from "react";

export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    // Safari ≤14 fallback.
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return reduced;
}
