/**
 * useLumiAudio — V14 preference hook for Lumi voice cues.
 *
 * Wraps the lib/lumiAudio.js kernel with:
 *   - localStorage-backed enabled flag (key: "mmhb-lumi-audio-enabled", default OFF)
 *   - prefers-reduced-motion override (always returns disabled when set)
 *   - cross-tab sync via 'storage' events
 *   - safe play* methods that no-op when disabled (callers don't have to gate)
 */
import { useCallback, useEffect, useState } from "react";
import {
  playLumiPop,
  playLumiHeartbeat,
  playLumiChime,
  isLumiAudioAvailable,
  unlockLumiAudio,
  closeLumiAudio,
  tryPlayPop,
  tryPlayChime,
  claimHeartbeat,
  releaseHeartbeat,
} from "../lib/lumiAudio.js";

const STORAGE_KEY = "lumi:audio:enabled";

// One-time migration from the v5.1 preview key to the canonical V14 key.
// Safe no-op once migrated; fires only on first read after upgrade.
function migrateLegacyKey() {
  if (typeof window === "undefined") return;
  try {
    const legacy = window.localStorage.getItem("mmhb-lumi-audio-enabled");
    if (legacy != null && window.localStorage.getItem(STORAGE_KEY) == null) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
    }
    if (legacy != null) window.localStorage.removeItem("mmhb-lumi-audio-enabled");
  } catch {
    /* noop */
  }
}

function readEnabled() {
  if (typeof window === "undefined") return false;
  migrateLegacyKey();
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function readReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function useLumiAudio() {
  const [enabled, setEnabledState] = useState(() => readEnabled());
  const [reducedMotion, setReducedMotion] = useState(() => readReducedMotion());
  const available = isLumiAudioAvailable();
  const effective = enabled && available && !reducedMotion;

  // Keep state in sync if other tabs flip the preference.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setEnabledState(readEnabled());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Track reduced-motion changes so users can flip it system-wide and
  // the toggle reflects reality without a reload.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  // Release the AudioContext when the user disables audio.
  useEffect(() => {
    if (!enabled) closeLumiAudio();
  }, [enabled]);

  const setEnabled = useCallback((next) => {
    setEnabledState(Boolean(next));
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next ? "true" : "false");
      }
    } catch {
      /* noop */
    }
    if (next) {
      // First enable from a user gesture — unlock the context proactively
      // so the very next play() makes a sound on iOS/Safari.
      unlockLumiAudio();
    }
  }, []);

  const pop = useCallback(() => {
    if (!effective) return false;
    return playLumiPop();
  }, [effective]);

  const heartbeat = useCallback(() => {
    if (!effective) return false;
    return playLumiHeartbeat();
  }, [effective]);

  const chime = useCallback(() => {
    if (!effective) return false;
    return playLumiChime();
  }, [effective]);

  // ---- V14 coordinator wrappers (module-scoped, app-wide cooperation) ----
  // Every Lumi avatar in the app shares one pop, one chime debounce window,
  // and one active heartbeat owner. These wrappers pre-gate on `effective`
  // so the lib never has to know about React state.

  const tryPop = useCallback(() => {
    if (!effective) return false;
    return tryPlayPop();
  }, [effective]);

  const tryChime = useCallback((minGapMs = 2000) => {
    if (!effective) return false;
    return tryPlayChime(minGapMs);
  }, [effective]);

  const claimHeart = useCallback((periodMs) => {
    if (!effective) return null;
    return claimHeartbeat(periodMs);
  }, [effective]);

  const releaseHeart = useCallback((token) => {
    releaseHeartbeat(token);
  }, []);

  return {
    enabled,
    effective,
    available,
    reducedMotion,
    setEnabled,
    pop,
    heartbeat,
    chime,
    tryPop,
    tryChime,
    claimHeart,
    releaseHeart,
  };
}
