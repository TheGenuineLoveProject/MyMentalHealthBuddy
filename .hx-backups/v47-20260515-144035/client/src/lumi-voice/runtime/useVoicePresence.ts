/**
 * Phase 23 — useVoicePresence
 * SSR-safe React hook. Wires playback + captions + opt-in gate.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  VOICE_PROFILES,
  DEFAULT_VOICE_PROFILE,
  resolveProfile,
  type VoiceProfile,
  type VoiceProfileKey,
} from "./VoicePresenceEngine";
import {
  setOptIn,
  hasOptIn,
  speak as speakRaw,
  stop as stopRaw,
  isSpeaking as isSpeakingRaw,
} from "./VoicePlaybackController";
import { CAPTION_LINGER_MS, makeCaption, type Caption } from "../accessibility/captionsMode";
import { isReducedAudioPreferred } from "../accessibility/reducedAudioMode";

export interface UseVoicePresenceReturn {
  readonly enabled: boolean;
  readonly profile: VoiceProfile;
  readonly profileKey: VoiceProfileKey;
  readonly isSpeaking: boolean;
  readonly captions: ReadonlyArray<Caption>;
  readonly reducedAudio: boolean;
  setEnabled(value: boolean): void;
  setProfile(key: VoiceProfileKey): void;
  speak(text: string): boolean;
  stop(): void;
  clearCaptions(): void;
}

export function useVoicePresence(): UseVoicePresenceReturn {
  const [enabled, setEnabledState] = useState<boolean>(() => hasOptIn());
  const [profileKey, setProfileKey] = useState<VoiceProfileKey>(DEFAULT_VOICE_PROFILE);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [captions, setCaptions] = useState<ReadonlyArray<Caption>>([]);
  const [reducedAudio, setReducedAudio] = useState<boolean>(() => isReducedAudioPreferred());

  const captionTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Live-track reduced-motion preference.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedAudio(isReducedAudioPreferred());
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Safari fallback
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopRaw();
      captionTimers.current.forEach((t) => clearTimeout(t));
      captionTimers.current.clear();
    };
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    setOptIn(value);
    setEnabledState(value);
    if (!value) {
      stopRaw();
      setSpeaking(false);
    }
  }, []);

  const setProfile = useCallback((key: VoiceProfileKey) => {
    if (!(key in VOICE_PROFILES)) return;
    setProfileKey(key);
  }, []);

  const clearCaptions = useCallback(() => {
    captionTimers.current.forEach((t) => clearTimeout(t));
    captionTimers.current.clear();
    setCaptions([]);
  }, []);

  const stop = useCallback(() => {
    stopRaw();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      // Always emit caption — caption is the universal accessible surface.
      // Even when voice is disabled or reduced-audio is on, the caption
      // must still appear and linger CAPTION_LINGER_MS (architect-driven).
      const caption = makeCaption(text);
      setCaptions((prev) => [...prev, caption]);

      const scheduleDismiss = () => {
        const t = setTimeout(() => {
          setCaptions((prev) => prev.filter((c) => c.id !== caption.id));
          captionTimers.current.delete(t);
        }, CAPTION_LINGER_MS);
        captionTimers.current.add(t);
      };

      // If reduced-audio is on or voice not enabled, no audio plays —
      // schedule caption dismissal immediately (no utterance to wait for).
      if (!enabled || reducedAudio) {
        scheduleDismiss();
        return false;
      }

      // Audio path: schedule caption dismissal CAPTION_LINGER_MS AFTER the
      // utterance terminates (onEnd OR onError). This preserves the
      // contract "captions linger 1500ms after audio ends" regardless of
      // utterance length. Fallback dismissal also scheduled in case the
      // Web Speech API never fires onEnd/onError (defensive).
      let dismissedByTerminal = false;
      const profile = resolveProfile(profileKey);
      const ok = speakRaw(text, profile, {
        onEnd: () => {
          setSpeaking(isSpeakingRaw());
          if (!dismissedByTerminal) {
            dismissedByTerminal = true;
            scheduleDismiss();
          }
        },
        onError: () => {
          setSpeaking(false);
          if (!dismissedByTerminal) {
            dismissedByTerminal = true;
            scheduleDismiss();
          }
        },
      });

      if (ok) {
        setSpeaking(true);
      } else {
        // speakRaw refused (e.g., forbidden phrase, manipulative language,
        // not opted in, SSR). Caption already showed; dismiss after linger.
        scheduleDismiss();
      }
      return ok;
    },
    [enabled, reducedAudio, profileKey],
  );

  const profile = useMemo(() => resolveProfile(profileKey), [profileKey]);

  return {
    enabled,
    profile,
    profileKey,
    isSpeaking: speaking,
    captions,
    reducedAudio,
    setEnabled,
    setProfile,
    speak,
    stop,
    clearCaptions,
  };
}
