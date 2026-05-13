/*
 * LumiV7 — Avatar Evolution Engine (V32 spec).
 *
 * Standalone — does NOT replace LumiV6 / BuddyAvatar / LumiMascot.
 * This is a pure-SVG mascot whose body is FROZEN to the canonical
 * shape (cream head, sage belly, stubby arms+legs, two-leaf sprout)
 * and whose eyes / mouth / arms / legs gain coordination per V32.
 *
 * Coordination contract:
 *   - Eyes lead. Mouth follows with 100ms delay (CSS).
 *   - Pupils track a normalized {x, y} target in [-1, 1], clamped to
 *     ±10px horizontal and ±6px vertical, lerped smoothly.
 *   - Blinks fire on a randomized 2000-6000ms cadence, 150ms each,
 *     with 15% probability of a double-blink.
 *   - `crisis` prop disables all motion + pins to soft eyes, neutral
 *     arms/legs, no animation. Asymmetric-risk safety override.
 *
 * Props:
 *   eye:    "default" | "wide" | "soft" | "happy"
 *   mouth:  one of 10 V32 expressions
 *   arm:    "rest" | "wave" | "hug" | "point" | "present" | "heart"
 *   leg:    "rest" | "sit" | "walk" | "bounce" | "tuck"
 *   gaze:   { x: -1..1, y: -1..1 }  (optional; null = center)
 *   crisis: boolean — instant calm override
 *   interactions: number — V34 Phase 2 blush escalation counter
 *                 (0 baseline 0.15 → 1-2 lvl1 0.2 → 3-4 lvl2 0.4 → 5+ lvl3 0.6)
 *   size:   number (px, default 240)
 *
 * V34 Phase 2 additions (on top of v5.8.28 V32 base):
 *   - Pupil dilation by emotion: excited 1.15, loving 0.95,
 *     calm/sleepy/breathing 0.85, neutral 1.0 — CSS-driven via
 *     [data-mouth] attribute, composes with RAF gaze transform
 *     using the modern `scale` individual transform property.
 *   - Blush escalation: opacity tracks `interactions` prop,
 *     transitions 600ms ease-out, pinned under crisis/reduced-motion.
 *
 * Usage:
 *   <LumiV7 eye="happy" mouth="happy" arm="wave" leg="bounce" />
 */

import { useEffect, useRef, useState, useMemo } from "react";
import "./LumiV7.css";

const MOUTH_PATHS = {
  // All paths are relative to viewBox 0 0 400 400, mouth centered ~200,242
  happy:     "M168 238 Q200 268 232 238",
  calm:      "M178 246 L222 246",
  surprise:  "M188 244 Q200 264 212 244 Q200 232 188 244 Z",
  sleepy:    "M180 248 Q200 254 220 248",
  open:      "M184 240 Q200 264 216 240 Q200 254 184 240 Z",
  worried:   "M168 252 Q200 232 232 252",
  excited:   "M164 232 Q200 280 236 232 Q200 256 164 232 Z",
  loving:    "M180 240 Q200 266 220 240 Q210 232 200 244 Q190 232 180 240 Z",
  focused:   "M186 246 L214 246",
  breathing: "M186 244 Q200 254 214 244 Q200 250 186 244 Z"
};

function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
function lerp(a, b, t) { return a + (b - a) * t; }

// V34 Phase 2: blush opacity by interaction level
function blushOpacityFor(interactions, crisis) {
  if (crisis) return 0.15;
  const n = Math.max(0, Math.floor(Number(interactions) || 0));
  if (n >= 5) return 0.6;
  if (n >= 3) return 0.4;
  if (n >= 1) return 0.2;
  return 0.15;
}

export default function LumiV7({
  eye = "default",
  mouth = "happy",
  arm = "rest",
  leg = "rest",
  gaze = null,
  crisis = false,
  interactions = 0,
  size = 240,
  className = "",
  "data-testid": dataTestid = "lumi-v7"
}) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  // Pupil tracking — lerp to target, clamped per V32 (±10 H / ±6 V)
  const pupilState = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (crisis || reduced) return;
    let raf;
    const lerpSpeed = eye === "soft" ? 0.05 : 0.12; // per V32 spec
    const tick = () => {
      const tx = gaze ? clamp(gaze.x, -1, 1) * 10 : 0;
      const ty = gaze ? clamp(gaze.y, -1, 1) * 6 : 0;
      pupilState.current.x = lerp(pupilState.current.x, tx, lerpSpeed);
      pupilState.current.y = lerp(pupilState.current.y, ty, lerpSpeed);
      const tf = `translate(${pupilState.current.x.toFixed(2)}px, ${pupilState.current.y.toFixed(2)}px)`;
      if (leftPupilRef.current) leftPupilRef.current.style.transform = tf;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = tf;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gaze, eye, crisis, reduced]);

  // Blink — 2-6s randomized, 150ms each, 15% double-blink
  const [isBlinking, setIsBlinking] = useState(false);
  useEffect(() => {
    if (crisis || reduced) return;
    let timeoutId;
    const blink = () => {
      setIsBlinking(true);
      timeoutId = setTimeout(() => {
        setIsBlinking(false);
        if (Math.random() < 0.15) {
          // double-blink
          timeoutId = setTimeout(() => {
            setIsBlinking(true);
            timeoutId = setTimeout(() => {
              setIsBlinking(false);
              schedule();
            }, 150);
          }, 120);
        } else {
          schedule();
        }
      }, 150);
    };
    const schedule = () => {
      const next = 2000 + Math.random() * 4000;
      timeoutId = setTimeout(blink, next);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, [crisis, reduced]);

  const eyeClass = `lumi-v7-eye lumi-eye--${eye} ${isBlinking ? "is-blinking" : ""}`;
  const mouthClass = `lumi-v7-mouth lumi-mouth--${mouth}`;
  const armClass = `lumi-arm--${arm}`;
  const legClass = `lumi-leg--${leg}`;

  // V34 Phase 2: blush escalation level (used as data attr + style hook)
  const blushOpacity = blushOpacityFor(interactions, crisis);
  const interactionCount = Math.max(0, Math.floor(Number(interactions) || 0));
  const blushLevel = interactionCount >= 5 ? 3 : interactionCount >= 3 ? 2 : interactionCount >= 1 ? 1 : 0;

  const wrapperClass = `lumi-v7 ${armClass} ${legClass} ${crisis ? "is-crisis" : ""} ${className}`.trim();

  const mouthD = MOUTH_PATHS[mouth] || MOUTH_PATHS.happy;

  return (
    <div
      className={wrapperClass}
      style={{ width: size, height: size }}
      data-testid={dataTestid}
      data-eye={eye}
      data-mouth={mouth}
      data-arm={arm}
      data-leg={leg}
      data-crisis={crisis ? "true" : "false"}
      data-blush-level={blushLevel}
      data-interactions={interactionCount}
      role="img"
      aria-label={crisis ? "Lumi in calm safety mode" : `Lumi feeling ${mouth}`}
    >
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="lumi-v7-belly-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C8DCBF" />
            <stop offset="100%" stopColor="#A8C9A0" />
          </radialGradient>
          <radialGradient id="lumi-v7-blush-grad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#F5A3A3" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F5A3A3" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lumi-v7-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A7E72" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4A7E72" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="200" cy="380" rx="100" ry="10" fill="url(#lumi-v7-shadow)" />

        {/* Legs (rendered behind body) */}
        <g className="lumi-v7-leg lumi-v7-leg--left">
          <ellipse cx="160" cy="345" rx="22" ry="14" fill="#A8C9A0" />
          <ellipse cx="160" cy="338" rx="20" ry="18" fill="#F5F0E8" />
        </g>
        <g className="lumi-v7-leg lumi-v7-leg--right">
          <ellipse cx="240" cy="345" rx="22" ry="14" fill="#A8C9A0" />
          <ellipse cx="240" cy="338" rx="20" ry="18" fill="#F5F0E8" />
        </g>

        {/* Body (FROZEN — cream round) */}
        <ellipse className="lumi-v7-body" cx="200" cy="220" rx="130" ry="135" fill="#F5F0E8" />

        {/* Belly (FROZEN sage oval) */}
        <ellipse className="lumi-v7-belly" cx="200" cy="265" rx="80" ry="65" fill="url(#lumi-v7-belly-grad)" />

        {/* Heart glow (already-shipped V8 contract) */}
        <circle className="lumi-v7-heart-glow" cx="200" cy="270" r="14" />

        {/* Arms */}
        <g className="lumi-v7-arm lumi-v7-arm--left">
          <ellipse cx="78" cy="240" rx="22" ry="32" fill="#F5F0E8" />
          <ellipse cx="78" cy="265" rx="20" ry="14" fill="#A8C9A0" />
        </g>
        <g className="lumi-v7-arm lumi-v7-arm--right">
          <ellipse cx="322" cy="240" rx="22" ry="32" fill="#F5F0E8" />
          <ellipse cx="322" cy="265" rx="20" ry="14" fill="#A8C9A0" />
        </g>

        {/* Head (FROZEN, oversized round) */}
        <ellipse className="lumi-v7-head" cx="200" cy="170" rx="118" ry="115" fill="#F5F0E8" />

        {/* Sprout (two leaves on top, FROZEN) */}
        <g className="lumi-v7-sprout">
          <path d="M188 60 Q175 38 192 28 Q205 38 198 60 Z" fill="#A8C9A0" />
          <path d="M212 60 Q225 38 208 28 Q195 38 202 60 Z" fill="#8FB78A" />
          <rect x="197" y="58" width="6" height="10" rx="3" fill="#6B9866" />
        </g>

        {/* Blush cheeks — V34 Phase 2 escalation by interaction count.
            Position/shape FROZEN; only opacity escalates. */}
        <ellipse
          className="lumi-v7-blush"
          cx="128" cy="195" rx="22" ry="14"
          fill="url(#lumi-v7-blush-grad)"
          style={{ opacity: blushOpacity }}
          data-testid="lumi-v7-blush-left"
          data-blush-level={blushLevel}
        />
        <ellipse
          className="lumi-v7-blush"
          cx="272" cy="195" rx="22" ry="14"
          fill="url(#lumi-v7-blush-grad)"
          style={{ opacity: blushOpacity }}
          data-testid="lumi-v7-blush-right"
          data-blush-level={blushLevel}
        />

        {/* Eyes — animatable */}
        <g>
          <ellipse
            ref={leftEyeRef}
            className={eyeClass}
            cx="166" cy="172" rx="9" ry="11"
            data-testid="lumi-v7-eye-left"
          />
          <circle
            ref={leftPupilRef}
            className="lumi-v7-pupil"
            cx="166" cy="172" r="2.5"
            fill="#FFFFFF"
            opacity={isBlinking ? 0 : 0.9}
          />
          <ellipse
            ref={rightEyeRef}
            className={eyeClass}
            cx="234" cy="172" rx="9" ry="11"
            data-testid="lumi-v7-eye-right"
          />
          <circle
            ref={rightPupilRef}
            className="lumi-v7-pupil"
            cx="234" cy="172" r="2.5"
            fill="#FFFFFF"
            opacity={isBlinking ? 0 : 0.9}
          />
        </g>

        {/* Mouth — animatable, 10 V32 expressions */}
        <path
          className={mouthClass}
          d={mouthD}
          data-testid="lumi-v7-mouth"
        />
      </svg>
    </div>
  );
}
