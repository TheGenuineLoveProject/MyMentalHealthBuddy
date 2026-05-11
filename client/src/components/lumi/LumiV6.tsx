/**
 * LumiV6 — "Living Lumi" multi-layer avatar.
 *
 * V6 (Section 1): 4-layer composition (BODY PNG · CSS dot eyes · emotion
 *   mouth · warm amber heart pulse).
 *
 * V7 "Expressive Soul" (additive): 5 new mouth shapes, 2 new eye variants,
 *   5 body postures via .lumiv6__posture wrapper, 600ms morph transitions
 *   with a 100ms blink-beat keyframe, per-emotion heart rate.
 *
 * V8 "Heart, Mind & Soul" (additive, gated by individual props — every
 *   existing V6/V7 caller renders identically when the V8 props are
 *   unused):
 *     - Procedural breathing      (auto when v8 + animated): 15s interval
 *       varies --lumiv6-breath-duration & --lumiv6-breath-depth so no two
 *       moments breathe identically.
 *     - Randomized blink timing   (auto when v8 + animated): replaces the
 *       fixed CSS blink loop with JS-scheduled 2-6s intervals + 15% chance
 *       of double-blink, fired via the .lumiv6--blink-once class.
 *     - Idle behaviors            (auto when v8): after 10s of no global
 *       mouse / click / key activity, .lumiv6--idle adds gentle pupil
 *       drift + occasional weight shift.
 *     - Smooth gaze depth         (auto when v8 + interactive): replaces
 *       the V7 immediate eye-tracking with a requestAnimationFrame lerp
 *       whose speed depends on emotion (sleepy slowest, joy fastest).
 *     - Aura                      (opt-in via aura prop): radial halo
 *       behind the body, color + opacity + period per emotion.
 *     - Ground shadow             (opt-in via shadow prop): subtle posture-
 *       aware ellipse below the body for depth.
 *     - Click zones               (opt-in via clickable prop): three
 *       overlapping accessible buttons (head / heart / body) that trigger
 *       short-lived emotion overrides + visual flourishes.
 *     - Emotional memory          (opt-in via memoryKey prop): persists
 *       last-seen emotion in sessionStorage; on remount with a different
 *       emotion fires a brief "recognize" heart pulse.
 *
 * Calm-mouth default flip (V8): the V6/V7 backward-compat rule that hid
 * the mouth entirely for emotion="calm" (Hello Kitty silence) is retired.
 * Calm now renders the gentle "breathing" mouth by default so Lumi reads
 * as alive even at rest. Explicit mouthExpression overrides still win.
 *
 * V9 "Soul Capture" (additive, gated by individual props — every existing
 * V6/V7/V8 caller renders identically when V9 props are unused):
 *     - Entrance animation        (auto when v9 + animated): IntersectionObserver
 *       triggers a one-shot scale/blur "birth" sequence (800ms) the first
 *       time Lumi enters the viewport in a session. sessionStorage-gated so
 *       it plays exactly once across all instances per browser session.
 *     - Attention capture         (auto when v9 + animated + interactive):
 *       After 15s of no Lumi-local interaction, when the cursor comes within
 *       200px of Lumi, plays a brief "I noticed you" wobble (600ms) and
 *       holds gaze on cursor for 3s.
 *     - Emotional escalation      (auto when v9 + clickable): tracks click-
 *       zone activations within a 10s rolling window. 1 click = level 1
 *       (warm smile), 2 = level 2 (excited bounce + wider eyes), 3+ = level
 *       3 (celebration sparkle + rapid heart pulse).
 *     - Mirroring micro-expression (opt-in via detectedSentiment prop): when
 *       a different sentiment than the current emotion arrives, briefly
 *       (1.5s) overlays it as a "I see you" flash. Lower priority than a
 *       click-zone trigger so user touch always wins.
 *     - Goodbye sequence          (auto when v9 + animated): on
 *       window.beforeunload OR 5 minutes of global inactivity, fades out
 *       with a wave + 3 slow heart pulses (1s).
 *
 * Standalone — does NOT replace BuddyAvatar. All classes scoped under
 * `.lumiv6` (cannot collide with `.buddy*`). V9 modifiers use the
 * `lumiv6--v9-*` convention so the global reduced-motion blanket and
 * crisis-stillness contract automatically cover them. CSS in LumiV6.css.
 */
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useLumiAudio } from "@/hooks/useLumiAudio.js";
import "./LumiV6.css";

export type LumiV6ColorMode =
  | "default"
  | "yellow"
  | "pink"
  | "blue"
  | "purple"
  | "sleep"
  | "orange";

export type LumiV6Emotion =
  | "joy"
  | "love"
  | "calm"
  | "greeting"
  | "empathy"
  | "sleepy"
  | "surprise";

export type LumiV6Pose =
  | "default"
  | "waving"
  | "meditating"
  | "celebrating"
  | "hugging"
  | "thinking"
  | "listening";

export type LumiV6Size = "sm" | "md" | "lg" | "xl" | "md-header";

export type LumiV6MouthExpression =
  | "joy"
  | "love"
  | "greeting"
  | "empathy"
  | "sleepy"
  | "surprise"
  | "worried"
  | "excited"
  | "loving"
  | "focused"
  | "breathing";

export type LumiV6EyeExpression =
  | "default"
  | "wide"
  | "soft"
  | "happy"
  | "closed";

export type LumiV6Posture =
  | "upright"
  | "curious"
  | "leaning"
  | "relaxed"
  | "bouncy";

export interface LumiV6Props {
  colorMode?: LumiV6ColorMode;
  emotion?: LumiV6Emotion;
  pose?: LumiV6Pose;
  size?: LumiV6Size;
  /** Track cursor with eyes + add hover bounce. Default true. */
  interactive?: boolean;
  /** Master switch for breathing, blink, heart-pulse loops. Default true. */
  animated?: boolean;
  /** Show speech bubble above the avatar. Default false. */
  showMessage?: boolean;
  /** Speech bubble text override. Defaults to a per-emotion line. */
  message?: string;
  /** V7: explicit mouth shape. When undefined, derived from emotion. */
  mouthExpression?: LumiV6MouthExpression;
  /** V7: explicit eye variant. When undefined, derived from emotion. */
  eyeExpression?: LumiV6EyeExpression;
  /** V7: explicit body posture. When undefined, derived from emotion. */
  posture?: LumiV6Posture;
  /** V7: explicit heart-pulse frequency (Hz). When undefined, derived from emotion. */
  heartHz?: number;
  /** V8: master flag — turns on procedural breathing, randomized blink,
   *  idle drift, and smooth emotional gaze lerp. Default false. */
  v8?: boolean;
  /** V8: render the aura halo (opt-in; auto-on when v8). */
  aura?: boolean;
  /** V8: render the ground shadow (opt-in; auto-on when v8). */
  shadow?: boolean;
  /** V8: render head/heart/body click zones (opt-in). When clicked the
   *  avatar briefly switches emotion and plays a flourish. */
  clickable?: boolean;
  /** V8: when set, persists last-seen emotion under
   *  `lumi:memory:<memoryKey>` in sessionStorage; on remount with a
   *  different emotion plays a short "recognize" heart pulse. */
  memoryKey?: string;
  /** Exact pixel override for non-canonical sizes (legacy LumiMascot
   *  parity values like 80px / 208px). When provided, takes precedence
   *  over the `size` enum. Use sparingly — prefer the size enum. */
  pixelSize?: number;
  /** V9 master flag — turns on entrance animation, attention capture,
   *  emotional escalation tracking, and goodbye sequence. All V9 features
   *  are gated by `animated` so crisis surfaces (animated=false) stay
   *  still. Default false. */
  v9?: boolean;
  /** V9 mirroring: when set to a sentiment that differs from `emotion`,
   *  briefly (1.5s) overlays it as a "Lumi noticed your feeling" flash.
   *  Pass null/undefined when no signal is available. Lower priority than
   *  user click overrides. */
  detectedSentiment?: LumiV6Emotion | null;
  className?: string;
  "data-testid"?: string;
}

// ---------- Asset map ----------
const COLOR_PNG: Record<LumiV6ColorMode, string> = {
  default: "/brand/lumi-v4-ultimate.png",
  yellow:  "/brand/lumi-v4-yellow.png",
  pink:    "/brand/lumi-v4-pink.png",
  blue:    "/brand/lumi-v4-blue.png",
  purple:  "/brand/lumi-v4-purple.png",
  sleep:   "/brand/lumi-v4-sleep.png",
  orange:  "/brand/lumi-v4-orange.png",
};
const POSE_PNG: Partial<Record<LumiV6Pose, string>> = {
  waving:      "/brand/lumi-action-waving.png",
  meditating:  "/brand/lumi-body-meditating.png",
  celebrating: "/brand/lumi-body-celebrating.png",
  hugging:     "/brand/lumi-body-hugging.png",
};
const FALLBACK_PNG = "/brand/lumi-v4-ultimate.png";

const EMOTION_MESSAGE: Record<LumiV6Emotion, string> = {
  joy:      "Yay! That's wonderful.",
  love:     "I'm here for you.",
  calm:     "Take a slow breath with me.",
  greeting: "Hi there — glad you're here.",
  empathy:  "I hear you. That sounds heavy.",
  sleepy:   "Resting is healing too.",
  surprise: "Oh! Tell me more.",
};

const EMOTION_ARIA: Record<LumiV6Emotion, string> = {
  joy:      "Lumi is feeling joyful.",
  love:     "Lumi is sending warmth.",
  calm:     "Lumi is calm and present.",
  greeting: "Lumi is greeting you.",
  empathy:  "Lumi is listening with care.",
  sleepy:   "Lumi is resting.",
  surprise: "Lumi looks gently surprised.",
};

const SIZE_PX: Record<LumiV6Size, number> = {
  sm: 48,
  "md-header": 56,
  md: 96,
  lg: 160,
  xl: 240,
};

const EMOTION_DERIVATION: Record<
  LumiV6Emotion,
  { mouth: LumiV6MouthExpression; eye: LumiV6EyeExpression; posture: LumiV6Posture; heartHz: number }
> = {
  greeting: { mouth: "greeting",  eye: "default", posture: "upright",  heartHz: 0.5   },
  joy:      { mouth: "excited",   eye: "happy",   posture: "bouncy",   heartHz: 1.0   },
  love:     { mouth: "loving",    eye: "soft",    posture: "relaxed",  heartHz: 0.5   },
  calm:     { mouth: "breathing", eye: "soft",    posture: "relaxed",  heartHz: 0.25  },
  empathy:  { mouth: "worried",   eye: "soft",    posture: "leaning",  heartHz: 0.35  },
  sleepy:   { mouth: "sleepy",    eye: "soft",    posture: "relaxed",  heartHz: 0.125 },
  surprise: { mouth: "surprise",  eye: "wide",    posture: "curious",  heartHz: 1.5   },
};

/** V8: per-emotion aura (color · opacity · pulse period). */
const AURA_BY_EMOTION: Record<LumiV6Emotion, { color: string; opacity: number; periodMs: number }> = {
  greeting: { color: "rgba(168, 201, 160, 0.18)", opacity: 0.60, periodMs: 4200 },
  joy:      { color: "rgba(255, 217,  61, 0.22)", opacity: 0.85, periodMs: 2400 },
  love:     { color: "rgba(255, 154, 139, 0.20)", opacity: 0.75, periodMs: 4000 },
  calm:     { color: "rgba(116, 192, 252, 0.14)", opacity: 0.55, periodMs: 6000 },
  empathy:  { color: "rgba(200, 182, 255, 0.18)", opacity: 0.65, periodMs: 5200 },
  sleepy:   { color: "rgba(168, 213, 186, 0.12)", opacity: 0.45, periodMs: 8000 },
  surprise: { color: "rgba(255, 184, 140, 0.22)", opacity: 0.85, periodMs: 1800 },
};

/** V8: per-emotion gaze lerp speed (higher = more responsive eyes). */
const GAZE_LERP_BY_EMOTION: Record<LumiV6Emotion, number> = {
  greeting: 0.12,
  joy:      0.16,
  love:     0.06,
  calm:     0.05,
  empathy:  0.07,
  sleepy:   0.02,
  surprise: 0.20,
};

export default function LumiV6({
  colorMode = "default",
  emotion = "calm",
  pose = "default",
  size = "lg",
  interactive = true,
  animated = true,
  showMessage = false,
  message,
  mouthExpression,
  eyeExpression,
  posture,
  heartHz,
  v8 = false,
  aura,
  shadow,
  clickable = false,
  memoryKey,
  pixelSize,
  v9 = false,
  detectedSentiment = null,
  className = "",
  "data-testid": testId = "lumi-v6",
}: LumiV6Props) {
  const px = pixelSize ?? SIZE_PX[size] ?? SIZE_PX.lg;
  const bodySrc = POSE_PNG[pose] || COLOR_PNG[colorMode] || FALLBACK_PNG;

  // ---------- V14 Voice + Expression Sync ----------
  // Hook is always called (rules-of-hooks). All audio is routed through the
  // module-scoped coordinator (tryPop / tryChime / claimHeart) so LumiV6 and
  // BuddyAvatar cooperate when both are mounted on the same page (e.g. /v6
  // demo + header/footer Lumi). One pop per session, one heartbeat owner at
  // a time, one shared 2s chime debounce window — all enforced in the lib.
  const lumiAudio = useLumiAudio();

  // ---------- V8 click-zone-driven momentary emotion override ----------
  const [triggeredEmotion, setTriggeredEmotion] = useState<LumiV6Emotion | null>(null);
  const [heartBurst, setHeartBurst]   = useState(false);
  const [headTilt, setHeadTilt]       = useState(false);
  const [bodyBounce, setBodyBounce]   = useState(false);

  // V9 mirroring overlay (sentiment-driven). Lower priority than a user
  // click trigger so intentional touch always wins over passive sentiment.
  const [v9MirrorEmotion, setV9MirrorEmotion] = useState<LumiV6Emotion | null>(null);

  // The "effective" emotion drives every derivation/ARIA/className. Layering
  // priority (highest → lowest): user click trigger > V9 sentiment mirror >
  // base emotion prop. When a click zone fires, the override holds for
  // ~1.5-2s then releases back to the prop value.
  const effectiveEmotion: LumiV6Emotion =
    triggeredEmotion ?? v9MirrorEmotion ?? emotion;

  const ariaLabel  = EMOTION_ARIA[effectiveEmotion];
  const bubbleText = message ?? EMOTION_MESSAGE[effectiveEmotion];

  const derived          = EMOTION_DERIVATION[effectiveEmotion];
  const resolvedMouth    = mouthExpression ?? derived.mouth;
  const resolvedEye      = eyeExpression  ?? derived.eye;
  const resolvedPosture  = posture        ?? derived.posture;
  const resolvedHeartHz  = heartHz        ?? derived.heartHz;
  const heartPeriodMs    = Math.max(120, Math.round(1000 / Math.max(0.05, resolvedHeartHz)));

  // V6/V7 visual-fidelity carryover: sleepy reads better with a closed slit
  // than the derived "soft" eye. Explicit eyeExpression still overrides.
  const finalEye: LumiV6EyeExpression =
    eyeExpression ?? (effectiveEmotion === "sleepy" ? "closed" : resolvedEye);

  // V8: calm now ALWAYS renders a (breathing) mouth by default — Lumi reads
  // as alive at rest. Pre-V8 callers using emotion="calm" silently gain the
  // gentle breathing animation with no API change.
  const showMouth = true;

  const reactId = useId();
  const heartGradId = `lumiv6-heart-${reactId.replace(/:/g, "")}`;
  const showFace = px >= 64;

  // V8 effective on/off for each subsystem (aura/shadow auto-on with v8).
  const auraOn   = aura ?? v8;
  const shadowOn = shadow ?? v8;

  // ---------- Refs / DOM hooks ----------
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  // ---------- V7 emotion-morph transition window ----------
  const [isTransitioning, setIsTransitioning] = useState(false);
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!animated) return;
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [effectiveEmotion, colorMode, resolvedMouth, finalEye, resolvedPosture, animated]);

  // ---------- Eye-tracking (V7 immediate · V8 emotional lerp) ----------
  useEffect(() => {
    if (!interactive || !showFace) return;
    const root = rootRef.current;
    if (!root) return;

    const target = { x: 0, y: 0 };
    const computeTarget = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, 200) * 1.5;
      target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / radius)) * 12;
      target.y = Math.max(-1, Math.min(1, (e.clientY - cy) / radius)) * 12;
    };

    if (v8) {
      // V8: smooth lerp toward target. Speed varies per emotion — sleepy
      // barely tracks, surprise almost snaps. Persists across mousemove
      // gaps so the eyes settle naturally.
      const current = { x: 0, y: 0 };
      const lerp = GAZE_LERP_BY_EMOTION[effectiveEmotion] ?? 0.12;
      let raf = 0;
      const tick = () => {
        current.x += (target.x - current.x) * lerp;
        current.y += (target.y - current.y) * lerp;
        root.style.setProperty("--lumiv6-eye-x", `${current.x.toFixed(2)}%`);
        root.style.setProperty("--lumiv6-eye-y", `${current.y.toFixed(2)}%`);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      window.addEventListener("mousemove", computeTarget, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", computeTarget);
      };
    }

    // V7 fallthrough: immediate write per mousemove.
    const handler = (e: MouseEvent) => {
      computeTarget(e);
      root.style.setProperty("--lumiv6-eye-x", `${target.x.toFixed(2)}%`);
      root.style.setProperty("--lumiv6-eye-y", `${target.y.toFixed(2)}%`);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [interactive, showFace, v8, effectiveEmotion]);

  // ---------- V8: procedural breathing variation (every 15s) ----------
  const [breathPattern, setBreathPattern] = useState({ durationMs: 5200, depth: 1.025 });
  useEffect(() => {
    if (!v8 || !animated || isTransitioning) return;
    const vary = () => {
      const baseMs = effectiveEmotion === "sleepy" ? 6500
                   : effectiveEmotion === "calm"   ? 5200
                   : effectiveEmotion === "joy"    ? 3200
                   : 4400;
      const jitterMs = (Math.random() - 0.5) * 600;     // ±300ms
      const depth    = 1.018 + Math.random() * 0.020;   // 1.018 - 1.038
      setBreathPattern({
        durationMs: Math.round(baseMs + jitterMs),
        depth: parseFloat(depth.toFixed(3)),
      });
    };
    vary();
    const interval = setInterval(vary, 15000);
    return () => clearInterval(interval);
  }, [v8, animated, isTransitioning, effectiveEmotion]);

  // ---------- V8: randomized blink scheduler ----------
  const [blinkPulse, setBlinkPulse] = useState(0);
  useEffect(() => {
    if (!v8 || !animated) return;
    // Track BOTH the next-scheduled blink AND any in-flight double-blink so
    // teardown cancels every pending callback (no orphaned setStates after
    // unmount or v8/animated dep flip).
    let nextTimer: ReturnType<typeof setTimeout> | null = null;
    let doubleTimer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      const interval = 2000 + Math.random() * 4000; // 2-6s natural blink rate
      nextTimer = setTimeout(() => {
        setBlinkPulse((n) => n + 1);
        // 15% chance of double-blink for naturalism
        if (Math.random() < 0.15) {
          doubleTimer = setTimeout(() => setBlinkPulse((n) => n + 1), 220);
        }
        schedule();
      }, interval);
    };
    schedule();
    return () => {
      if (nextTimer) clearTimeout(nextTimer);
      if (doubleTimer) clearTimeout(doubleTimer);
    };
  }, [v8, animated]);
  // Toggle .lumiv6--blink-once briefly each time blinkPulse increments.
  const [blinkActive, setBlinkActive] = useState(false);
  useEffect(() => {
    if (!blinkPulse) return;
    setBlinkActive(true);
    const t = setTimeout(() => setBlinkActive(false), 220);
    return () => clearTimeout(t);
  }, [blinkPulse]);

  // ---------- V8: idle detection (10s of no global activity) ----------
  const [isIdle, setIsIdle] = useState(false);
  const idleSecRef = useRef(0);
  useEffect(() => {
    if (!v8) return;
    const reset = () => {
      idleSecRef.current = 0;
      setIsIdle((cur) => (cur ? false : cur));
    };
    window.addEventListener("mousemove", reset);
    window.addEventListener("click", reset);
    window.addEventListener("keydown", reset);
    const interval = setInterval(() => {
      idleSecRef.current += 1;
      if (idleSecRef.current > 10) {
        setIsIdle((cur) => (cur ? cur : true));
      }
    }, 1000);
    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("keydown", reset);
      clearInterval(interval);
    };
  }, [v8]);

  // ---------- V8: emotional memory + recognition micro-expression ----------
  const [recognizing, setRecognizing] = useState(false);
  useEffect(() => {
    if (!memoryKey) return;
    const storageKey = `lumi:memory:${memoryKey}`;
    let prev: string | null = null;
    try { prev = sessionStorage.getItem(storageKey); } catch { /* private mode */ }
    if (prev && prev !== emotion) {
      setRecognizing(true);
      const t = setTimeout(() => setRecognizing(false), 800);
      try { sessionStorage.setItem(storageKey, emotion); } catch { /* noop */ }
      return () => clearTimeout(t);
    }
    try { sessionStorage.setItem(storageKey, emotion); } catch { /* noop */ }
  }, [memoryKey, emotion]);

  // ============================================================
  // V9 "Soul Capture" — entrance / attention / escalation / goodbye
  // ============================================================

  // ---------- V9: entrance animation (one-shot per session) ----------
  // IntersectionObserver waits for Lumi to enter viewport; sessionStorage
  // gate ensures the birth sequence plays exactly once per browser session
  // even across multiple Lumi instances on different routes.
  const [v9Entering, setV9Entering] = useState(false);
  useEffect(() => {
    if (!v9 || !animated) return;
    const root = rootRef.current;
    if (!root) return;
    let seen = false;
    try { seen = sessionStorage.getItem("lumi:v9:entered") === "1"; } catch { /* private mode */ }
    if (seen) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          try { sessionStorage.setItem("lumi:v9:entered", "1"); } catch { /* noop */ }
          setV9Entering(true);
          timer = setTimeout(() => setV9Entering(false), 800);
          // V14: gentle entrance pop via the module coordinator (sessionStorage
          // gate is enforced inside tryPop, shared with BuddyAvatar so the
          // first Lumi-of-any-kind to enter the viewport gets the pop).
          lumiAudio.tryPop();
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(root);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v9, animated]);

  // ---------- V14: heartbeat sync (single-owner via coordinator) ----------
  // Claims the global heartbeat slot. If another Lumi (BuddyAvatar / sibling
  // LumiV6) already owns it, claimHeart returns null and we stay silent for
  // this instance — the user still hears one synchronized heartbeat. The 340 ms
  // floor is enforced inside the lib (≈ 2.94 Hz < 3 Hz seizure-safety bar).
  useEffect(() => {
    if (!animated || !lumiAudio.effective) return;
    const token = lumiAudio.claimHeart(heartPeriodMs);
    if (!token) return;
    return () => lumiAudio.releaseHeart(token);
  }, [animated, lumiAudio.effective, heartPeriodMs, lumiAudio]);

  // ---------- V9: attention capture ("Lumi notices you") ----------
  // After 15s of no Lumi-local interaction, when cursor enters 200px radius,
  // play a brief wobble + hold cursor-locked gaze for 3 seconds. lastLumi
  // InteractionRef is also bumped by fireOverride so click-zone touches
  // reset the timer.
  const lastLumiInteractionRef = useRef(Date.now());
  const [v9AttentionCapture, setV9AttentionCapture] = useState(false);
  const [v9GazeLock, setV9GazeLock] = useState(false);
  useEffect(() => {
    if (!v9 || !animated || !interactive) return;
    const root = rootRef.current;
    if (!root) return;
    let captureTimer: ReturnType<typeof setTimeout> | null = null;
    let gazeTimer: ReturnType<typeof setTimeout> | null = null;
    let captureCooldown = false;
    const onMove = (e: MouseEvent) => {
      if (captureCooldown) return;
      const rect = root.getBoundingClientRect();
      if (rect.width === 0) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const idleMs = Date.now() - lastLumiInteractionRef.current;
      if (dist <= 200 && idleMs > 15000) {
        captureCooldown = true;
        lastLumiInteractionRef.current = Date.now();
        setV9AttentionCapture(true);
        setV9GazeLock(true);
        captureTimer = setTimeout(() => setV9AttentionCapture(false), 600);
        gazeTimer = setTimeout(() => {
          setV9GazeLock(false);
          captureCooldown = false;
        }, 3600);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (captureTimer) clearTimeout(captureTimer);
      if (gazeTimer) clearTimeout(gazeTimer);
    };
  }, [v9, animated, interactive]);

  // ---------- V9: emotional escalation (3+ clicks in 10s) ----------
  // Rolling window of click-zone timestamps. recordEscalation() is invoked
  // from fireOverride. Level 0/1/2/3 drives lumiv6--v9-escalation-{n}
  // class hooks so CSS handles the visual stages.
  const escalationClicksRef = useRef<number[]>([]);
  const [v9EscalationLevel, setV9EscalationLevel] = useState(0);
  const escalationDecayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordEscalation = () => {
    const now = Date.now();
    escalationClicksRef.current = [
      ...escalationClicksRef.current.filter((t) => now - t < 10000),
      now,
    ];
    const count = escalationClicksRef.current.length;
    setV9EscalationLevel(count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0);
    if (escalationDecayTimerRef.current) clearTimeout(escalationDecayTimerRef.current);
    escalationDecayTimerRef.current = setTimeout(() => {
      const t = Date.now();
      escalationClicksRef.current = escalationClicksRef.current.filter((ts) => t - ts < 10000);
      const c = escalationClicksRef.current.length;
      setV9EscalationLevel(c >= 3 ? 3 : c >= 2 ? 2 : c >= 1 ? 1 : 0);
    }, 10500);
  };
  useEffect(() => {
    return () => {
      if (escalationDecayTimerRef.current) clearTimeout(escalationDecayTimerRef.current);
    };
  }, []);

  // ---------- V9: mirroring micro-expression ----------
  // When detectedSentiment differs from base emotion, flash it for 1.5s.
  // Gated on `animated` so crisis surfaces (animated=false) suppress the
  // mirror flash even if a sentiment signal arrives.
  useEffect(() => {
    if (!v9 || !animated || !detectedSentiment || detectedSentiment === emotion) return;
    setV9MirrorEmotion(detectedSentiment);
    const t = setTimeout(() => setV9MirrorEmotion(null), 1500);
    return () => clearTimeout(t);
  }, [v9, animated, detectedSentiment, emotion]);

  // ---------- V9.6: recognition micro-expression ("Welcome back") ----------
  // On mount, check sessionStorage for the last emotion this browser session
  // saw on a Lumi. If present and different from the current emotion, fire a
  // brief 600ms recognition flash (eyes widen + bright heart pulse). Then
  // persist the current emotion so the *next* mount can recognize it.
  // Gated on `v9 && animated` so crisis surfaces stay completely still.
  // StrictMode safety: a module-level visited-set survives the dev-only
  // mount/unmount/remount cycle so the second invocation reads the SAME
  // pre-flash sentinel and fires recognition exactly once per real mount.
  const [v9Recognition, setV9Recognition] = useState(false);
  const v9RecognitionRanRef = useRef(false);
  useEffect(() => {
    if (!v9) return;
    if (v9RecognitionRanRef.current) return;
    v9RecognitionRanRef.current = true;
    let last: string | null = null;
    try { last = sessionStorage.getItem("lumi:v9:lastEmotion"); } catch { /* private mode */ }
    if (animated && last && last !== effectiveEmotion) {
      setV9Recognition(true);
      const t = setTimeout(() => setV9Recognition(false), 600);
      // Persist AFTER reading + scheduling so StrictMode's unmount/remount
      // cycle (which preserves refs) doesn't accidentally observe the
      // already-written current emotion and suppress the flash.
      try { sessionStorage.setItem("lumi:v9:lastEmotion", effectiveEmotion); } catch { /* noop */ }
      return () => clearTimeout(t);
    }
    try { sessionStorage.setItem("lumi:v9:lastEmotion", effectiveEmotion); } catch { /* noop */ }
    // intentionally only run on mount (per-instance recognition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- V9: goodbye sequence ----------
  // Triggers on window beforeunload OR 5 minutes of global inactivity.
  // CSS .lumiv6--v9-goodbye runs the wave + fade-out keyframe.
  const [v9Goodbye, setV9Goodbye] = useState(false);
  useEffect(() => {
    if (!v9 || !animated) return;
    let goodbyeTimer: ReturnType<typeof setTimeout> | null = null;
    const FIVE_MIN = 5 * 60 * 1000;
    const armGoodbye = () => {
      if (goodbyeTimer) clearTimeout(goodbyeTimer);
      goodbyeTimer = setTimeout(() => setV9Goodbye(true), FIVE_MIN);
    };
    const reset = () => {
      // Any user activity cancels a pending goodbye AND clears an active
      // one (page came back to life — Lumi greets you again).
      setV9Goodbye((cur) => (cur ? false : cur));
      armGoodbye();
    };
    const onBeforeUnload = () => setV9Goodbye(true);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("click", reset);
    window.addEventListener("keydown", reset);
    armGoodbye();
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("keydown", reset);
      if (goodbyeTimer) clearTimeout(goodbyeTimer);
    };
  }, [v9, animated]);

  // ---------- V8: click-zone handlers ----------
  // Track the active override timer + a sequence id so that:
  //   1. Rapid re-clicks cancel the older release timer (no premature clear
  //      of the newer override, no flicker back to base emotion mid-hold).
  //   2. Component unmount cancels any in-flight release (no setState on
  //      unmounted component).
  // The sequence id is checked inside the release callback so a stale timer
  // that somehow survived clear (defensive) cannot clobber a newer state.
  const overrideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const overrideSeqRef = useRef(0);
  useEffect(() => {
    return () => {
      if (overrideTimerRef.current) {
        clearTimeout(overrideTimerRef.current);
        overrideTimerRef.current = null;
      }
    };
  }, []);
  const fireOverride = (
    next: LumiV6Emotion,
    flag: "heart" | "head" | "body",
    holdMs: number,
  ) => {
    if (overrideTimerRef.current) {
      clearTimeout(overrideTimerRef.current);
      overrideTimerRef.current = null;
    }
    const mySeq = ++overrideSeqRef.current;
    setTriggeredEmotion(next);
    if (flag === "heart") setHeartBurst(true);
    if (flag === "head")  setHeadTilt(true);
    if (flag === "body")  setBodyBounce(true);
    // V9: Lumi-local interaction — feeds attention-capture cool-down +
    // escalation rolling window. Safe no-op when v9 is off (state setters
    // exist but the consuming className/data hooks are gated on `v9`).
    lastLumiInteractionRef.current = Date.now();
    // Crisis-safe: escalation only tracks when animation is allowed.
    if (v9 && animated) recordEscalation();
    // V14: whisper chime via the module coordinator. The 2 s debounce is
    // shared app-wide so mashing click zones across multiple Lumi instances
    // still yields ≤ 1 chime / 2 s. Gated on `animated` for crisis safety.
    if (animated) lumiAudio.tryChime();
    overrideTimerRef.current = setTimeout(() => {
      overrideTimerRef.current = null;
      if (mySeq !== overrideSeqRef.current) return; // superseded — bail
      setTriggeredEmotion(null);
      if (flag === "heart") setHeartBurst(false);
      if (flag === "head")  setHeadTilt(false);
      if (flag === "body")  setBodyBounce(false);
    }, holdMs);
  };

  const eyeMod = finalEye === "default" ? "" : `lumiv6__eye--${finalEye}`;
  const mouthMod = `lumiv6__mouth--${resolvedMouth}`;

  const auraSpec = AURA_BY_EMOTION[effectiveEmotion];
  const wrapperStyle: CSSProperties & Record<`--${string}`, string | number> = {
    width: `${px}px`,
    height: `${px}px`,
    "--lumiv6-heart-period": `${heartPeriodMs}ms`,
    "--lumiv6-breath-duration": `${breathPattern.durationMs}ms`,
    "--lumiv6-breath-depth": breathPattern.depth,
    "--lumiv6-aura-color": auraSpec.color,
    "--lumiv6-aura-opacity": auraSpec.opacity,
    "--lumiv6-aura-period": `${auraSpec.periodMs}ms`,
  };

  return (
    <div
      ref={rootRef}
      className={[
        "lumiv6",
        `lumiv6--size-${size}`,
        `lumiv6--emotion-${effectiveEmotion}`,
        `lumiv6--pose-${pose}`,
        `lumiv6--posture-${resolvedPosture}`,
        animated ? "lumiv6--animated" : "lumiv6--still",
        interactive ? "lumiv6--interactive" : "",
        hovered ? "lumiv6--hovered" : "",
        isTransitioning ? "lumiv6--transitioning" : "",
        v8 ? "lumiv6--v8" : "",
        v8 && isIdle ? "lumiv6--idle" : "",
        v8 && blinkActive ? "lumiv6--blink-once" : "",
        heartBurst ? "lumiv6--heart-burst" : "",
        headTilt ? "lumiv6--head-tilt" : "",
        bodyBounce ? "lumiv6--body-bounce" : "",
        recognizing ? "lumiv6--recognizing" : "",
        v9 ? "lumiv6--v9" : "",
        v9 && v9Entering ? "lumiv6--v9-entering" : "",
        v9 && v9AttentionCapture ? "lumiv6--v9-attention" : "",
        v9 && v9GazeLock ? "lumiv6--v9-gaze-lock" : "",
        v9 && v9EscalationLevel > 0 ? `lumiv6--v9-escalation-${v9EscalationLevel}` : "",
        v9 && v9MirrorEmotion ? "lumiv6--v9-mirroring" : "",
        v9 && v9Recognition ? "lumiv6--v9-recognition" : "",
        v9 && animated ? "lumiv6--v9-visceral-glow" : "",
        v9 && v9Goodbye ? "lumiv6--v9-goodbye" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={wrapperStyle}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      data-emotion={effectiveEmotion}
      data-emotion-prop={emotion}
      data-pose={pose}
      data-color-mode={colorMode}
      data-size={size}
      data-animated={animated}
      data-interactive={interactive}
      data-mouth={resolvedMouth}
      data-eye={finalEye}
      data-posture={resolvedPosture}
      data-heart-hz={resolvedHeartHz}
      data-v8={v8}
      data-idle={isIdle}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
    >
      {auraOn && <div className="lumiv6__aura" aria-hidden="true" />}
      {shadowOn && <div className="lumiv6__shadow" aria-hidden="true" />}

      <div className="lumiv6__posture" aria-hidden="true">
        <img
          className="lumiv6__body"
          src={bodySrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith(FALLBACK_PNG)) img.src = FALLBACK_PNG;
          }}
        />
      </div>

      {showFace && (
        <>
          <div className="lumiv6__face-pad" aria-hidden="true" />
          <div className={`lumiv6__eye lumiv6__eye--left ${eyeMod}`} aria-hidden="true">
            <span className="lumiv6__pupil" />
          </div>
          <div className={`lumiv6__eye lumiv6__eye--right ${eyeMod}`} aria-hidden="true">
            <span className="lumiv6__pupil" />
          </div>
          {showMouth && (
            <div className={`lumiv6__mouth ${mouthMod}`} aria-hidden="true" />
          )}
          <div className="lumiv6__heart" aria-hidden="true">
            <div className="lumiv6__heart-glow" />
            <svg
              className="lumiv6__heart-svg"
              viewBox="0 0 100 90"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id={heartGradId} cx="35%" cy="30%" r="75%">
                  <stop offset="0%"   stopColor="#FFD27A" />
                  <stop offset="55%"  stopColor="#FFB347" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </radialGradient>
              </defs>
              <path
                d="M50 86 C 22 64 4 44 4 24 C 4 11 14 2 26 2 C 36 2 45 9 50 19 C 55 9 64 2 74 2 C 86 2 96 11 96 24 C 96 44 78 64 50 86 Z"
                fill={`url(#${heartGradId})`}
              />
            </svg>
          </div>
        </>
      )}

      {clickable && showFace && (
        <>
          <button
            type="button"
            className="lumiv6__zone lumiv6__zone--head"
            aria-label="Pat Lumi on the head"
            data-testid={`${testId}-zone-head`}
            onClick={() => fireOverride("greeting", "head", 1500)}
          />
          <button
            type="button"
            className="lumiv6__zone lumiv6__zone--heart"
            aria-label="Touch Lumi's heart"
            data-testid={`${testId}-zone-heart`}
            onClick={() => fireOverride("love", "heart", 2000)}
          />
          <button
            type="button"
            className="lumiv6__zone lumiv6__zone--body"
            aria-label="Tickle Lumi"
            data-testid={`${testId}-zone-body`}
            onClick={() => fireOverride("joy", "body", 2000)}
          />
        </>
      )}

      {showMessage && (
        <div
          className="lumiv6__bubble"
          role="status"
          aria-live="polite"
          data-testid={`${testId}-bubble`}
        >
          <span className="lumiv6__bubble-text">{bubbleText}</span>
          <span className="lumiv6__bubble-tail" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
