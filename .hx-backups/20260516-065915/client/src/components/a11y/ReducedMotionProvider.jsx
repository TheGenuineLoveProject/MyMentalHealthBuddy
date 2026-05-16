import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * ReducedMotionContext
 * ---------------------
 * App-level source of truth for whether the OS / browser is requesting
 * reduced motion. Reads `(prefers-reduced-motion: reduce)` once on mount
 * and subscribes to live changes (e.g. when the user toggles the setting
 * mid-session).
 *
 * Components that want to opt out of motion should read this context
 * instead of querying `window.matchMedia` themselves, so the value stays
 * consistent across the tree and is testable from a single provider.
 */
const ReducedMotionContext = createContext({ prefersReducedMotion: false });

const QUERY = "(prefers-reduced-motion: reduce)";

function readSystemPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia(QUERY).matches;
  } catch {
    return false;
  }
}

export function ReducedMotionProvider({ children }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    readSystemPreference()
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    let mql;
    try {
      mql = window.matchMedia(QUERY);
    } catch {
      return undefined;
    }

    const handler = (event) => setPrefersReducedMotion(event.matches);

    // Modern browsers: addEventListener. Older Safari: addListener.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handler);
    }

    // Re-sync once in case the value changed between initial read and effect.
    setPrefersReducedMotion(mql.matches);

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", handler);
      } else if (typeof mql.removeListener === "function") {
        mql.removeListener(handler);
      }
    };
  }, []);

  // Mirror the preference onto <body> as a class so plain CSS selectors
  // (e.g. lumi-mascot.css) can react without needing JS-time access.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "lumi-reduced-motion";
    if (prefersReducedMotion) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
  }, [prefersReducedMotion]);

  const value = useMemo(() => ({ prefersReducedMotion }), [prefersReducedMotion]);

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

/**
 * Read the current reduced-motion preference. Safe to call outside of a
 * provider — defaults to `{ prefersReducedMotion: false }` if no provider
 * is mounted, so legacy components keep working.
 */
export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

export default ReducedMotionProvider;
