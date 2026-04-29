import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EMOTION_CONFIG, IDLE_ROTATION, MILESTONES } from '../data/lumiEmotions';
import { MASCOT_ASSETS } from '../data/lumiAssets';

/**
 * @typedef {keyof typeof EMOTION_CONFIG} EmotionKey
 * @typedef {keyof typeof MILESTONES} MilestoneKey
 *
 * @typedef {Object} UseLumiEmotionResult
 * @property {EmotionKey} emotion              Current emotion key.
 * @property {EmotionKey} currentEmotion       Alias of emotion (spec field name).
 * @property {string}     animationClass       CSS class to apply to the mascot (e.g. 'lumi-breathe').
 * @property {string}     imageVariant         Logical image-variant key (e.g. 'default', 'golden').
 * @property {boolean}    isAnimating          True while a finite-duration animation is playing.
 * @property {(key: EmotionKey) => void}        setEmotion
 * @property {() => void}                       onUserTyping
 * @property {() => void}                       onAIProcessing
 * @property {() => void}                       onAIResponding
 * @property {(milestoneKey: MilestoneKey) => void} onMilestone
 * @property {(themeVariant?: string) => string}    getImageSrc
 */

const IDLE_ROTATION_INTERVAL_MS = 30000;
const DEFAULT_FALLBACK = 'idle';

function resolveConfig(key) {
  return EMOTION_CONFIG[key] || EMOTION_CONFIG[DEFAULT_FALLBACK];
}

/**
 * useLumiEmotion — single source of truth for the Lumi mascot's emotional state.
 *
 * Owns: which emotion is showing, which CSS animation class is active, which
 * PNG variant to render, and the timer lifecycles for finite-duration emotions
 * + the long-idle rotation cycle.
 *
 * @param {EmotionKey} [initial='idle']
 * @returns {UseLumiEmotionResult}
 */
export function useLumiEmotion(initial = 'idle') {
  const initialKey = EMOTION_CONFIG[initial] ? initial : DEFAULT_FALLBACK;
  const initialCfg = resolveConfig(initialKey);

  const [currentEmotion, setCurrentEmotion] = useState(initialKey);
  const [animationClass, setAnimationClass] = useState(initialCfg.animation);
  const [imageVariant, setImageVariant] = useState(initialCfg.image);
  const [isAnimating, setIsAnimating] = useState(Number.isFinite(initialCfg.duration));

  // All timers held in refs so they can be cleared individually and on unmount
  // without retriggering effects or causing memory leaks.
  const revertTimerRef = useRef(null);
  const rotationTickTimerRef = useRef(null);
  const rotationStartTimerRef = useRef(null);
  const rotationIndexRef = useRef(0);
  const isRotatingRef = useRef(false);
  const mountedRef = useRef(true);

  const clearRevertTimer = useCallback(() => {
    if (revertTimerRef.current) {
      clearTimeout(revertTimerRef.current);
      revertTimerRef.current = null;
    }
  }, []);

  const clearRotationTimers = useCallback(() => {
    if (rotationStartTimerRef.current) {
      clearTimeout(rotationStartTimerRef.current);
      rotationStartTimerRef.current = null;
    }
    if (rotationTickTimerRef.current) {
      clearTimeout(rotationTickTimerRef.current);
      rotationTickTimerRef.current = null;
    }
    isRotatingRef.current = false;
  }, []);

  // Internal apply: writes the emotion to state without scheduling any side
  // effects. Side effects (auto-revert, rotation start) are scheduled by the
  // public `setEmotion` so the rotation tick can opt out of them.
  const applyEmotion = useCallback((nextKey) => {
    if (!mountedRef.current) return;
    const safeKey = EMOTION_CONFIG[nextKey] ? nextKey : DEFAULT_FALLBACK;
    const cfg = resolveConfig(safeKey);
    setCurrentEmotion(safeKey);
    setAnimationClass(cfg.animation);
    setImageVariant(cfg.image);
    setIsAnimating(Number.isFinite(cfg.duration));
    return cfg;
  }, []);

  // Forward declaration so scheduleIdleRotation and setEmotion can refer to
  // each other through refs.
  const scheduleIdleRotationRef = useRef(() => {});
  const setEmotionRef = useRef(() => {});

  /**
   * Public setter. Cancels any pending auto-revert or in-flight rotation,
   * applies the new emotion, then schedules:
   *   - an auto-revert to 'idle' if the new emotion has a finite duration
   *   - a long-idle rotation if the new emotion IS 'idle'
   */
  const setEmotion = useCallback((key) => {
    clearRevertTimer();
    clearRotationTimers();

    const cfg = applyEmotion(key);
    if (!cfg) return;

    if (Number.isFinite(cfg.duration)) {
      // Finite-duration emotion: revert to idle when it's done. The revert
      // itself goes back through setEmotion so the idle-rotation timer is
      // re-armed correctly.
      revertTimerRef.current = setTimeout(() => {
        revertTimerRef.current = null;
        setEmotionRef.current(DEFAULT_FALLBACK);
      }, cfg.duration);
    } else if ((EMOTION_CONFIG[key] ? key : DEFAULT_FALLBACK) === DEFAULT_FALLBACK) {
      // Just settled into idle — arm the long-idle rotation.
      scheduleIdleRotationRef.current();
    }
  }, [applyEmotion, clearRevertTimer, clearRotationTimers]);

  setEmotionRef.current = setEmotion;

  /**
   * After 30s in idle, walk through IDLE_ROTATION every 30s. The rotation
   * uses applyEmotion directly (not setEmotion) so the per-step duration is
   * NOT the per-emotion `duration` from EMOTION_CONFIG — it's always 30s.
   * Any explicit setEmotion / typing / processing / etc. call cancels rotation.
   */
  const scheduleIdleRotation = useCallback(() => {
    clearRotationTimers();
    rotationIndexRef.current = 0;
    isRotatingRef.current = true;

    const tick = () => {
      if (!mountedRef.current || !isRotatingRef.current) return;
      rotationIndexRef.current =
        (rotationIndexRef.current + 1) % IDLE_ROTATION.length;
      const next = IDLE_ROTATION[rotationIndexRef.current];
      applyEmotion(next);
      rotationTickTimerRef.current = setTimeout(tick, IDLE_ROTATION_INTERVAL_MS);
    };

    rotationStartTimerRef.current = setTimeout(() => {
      rotationStartTimerRef.current = null;
      tick();
    }, IDLE_ROTATION_INTERVAL_MS);
  }, [applyEmotion, clearRotationTimers]);

  scheduleIdleRotationRef.current = scheduleIdleRotation;

  // ── Helpers ───────────────────────────────────────────────────────────────

  const onUserTyping = useCallback(() => {
    // Only nudge to 'listen' if the mascot is in a passive resting state, so
    // we don't override an active reaction (celebrate, think, speak, etc.).
    if (currentEmotion === 'idle' || currentEmotion === 'rest') {
      setEmotion('listen');
    }
  }, [currentEmotion, setEmotion]);

  const onAIProcessing = useCallback(() => {
    setEmotion('think');
  }, [setEmotion]);

  const onAIResponding = useCallback(() => {
    setEmotion('speak');
  }, [setEmotion]);

  const onMilestone = useCallback((milestoneKey) => {
    const milestone = MILESTONES[milestoneKey];
    if (!milestone) return;
    setEmotion(milestone.emotion);
  }, [setEmotion]);

  /**
   * Resolve the current emotion's image variant to a real PNG path. Pass an
   * optional themeVariant fallback to use when the emotion's `image` field is
   * 'default' (e.g. theme-aware coloring).
   */
  const getImageSrc = useCallback((themeVariant) => {
    const variant =
      imageVariant && imageVariant !== 'default'
        ? imageVariant
        : (themeVariant || 'default');
    return MASCOT_ASSETS[variant] || MASCOT_ASSETS.default;
  }, [imageVariant]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  // Arm rotation on first mount if we boot in idle.
  useEffect(() => {
    mountedRef.current = true;
    if (initialKey === DEFAULT_FALLBACK) {
      scheduleIdleRotation();
    }
    return () => {
      mountedRef.current = false;
      clearRevertTimer();
      clearRotationTimers();
    };
    // Initial-mount only — intentionally no deps. Subsequent emotion changes
    // are handled inside setEmotion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      emotion: currentEmotion,
      currentEmotion,
      animationClass,
      imageVariant,
      isAnimating,
      setEmotion,
      onUserTyping,
      onAIProcessing,
      onAIResponding,
      onMilestone,
      getImageSrc,
    }),
    [
      currentEmotion,
      animationClass,
      imageVariant,
      isAnimating,
      setEmotion,
      onUserTyping,
      onAIProcessing,
      onAIResponding,
      onMilestone,
      getImageSrc,
    ]
  );
}

// Example usage:
// const { emotion, animationClass, setEmotion, onUserTyping } = useLumiEmotion('idle');
