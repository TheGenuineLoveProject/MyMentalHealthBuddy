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
} from "../lib/lumiAudio.js";

const STORAGE_KEY = "mmhb-lumi-audio-enabled";

function readEnabled() {
  if (typeof window === "undefined") return false;
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

  return {
    enabled,
    effective,
    available,
    reducedMotion,
    setEnabled,
    pop,
    heartbeat,
    chime,
  };
}
