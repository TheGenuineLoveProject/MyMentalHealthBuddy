/**
 * Phase 14 (spec-aligned) — SSR-safe `prefers-reduced-motion` hook.
 *
 * Same shape as Phase 12/14 hooks. Listens live so toggling the OS preference
 * during a session updates the UI without a remount.
 */

import { useEffect, useState } from "react";

export function useReducedCalmMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (ev: MediaQueryListEvent) => setPrefers(ev.matches);
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", listener);
      else mq.removeListener(listener);
    };
  }, []);

  return prefers;
}
