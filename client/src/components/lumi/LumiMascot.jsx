import { useEffect, useId, useRef, useState, useCallback } from "react";
import "./LumiMascot.css";

const VALID_EMOTIONS = [
  "neutral", "listening", "empathy", "joy", "concern",
  "reflection", "celebration", "sleepy", "surprise", "comfort",
];

export default function LumiMascot({
  emotion = "neutral",
  size = 220,
  trackCursor = true,
  interactive = true,
  onEmote,
  ariaLabel = "Lumi, your gentle companion",
  className = "",
}) {
  const safeEmotion = VALID_EMOTIONS.includes(emotion) ? emotion : "neutral";
  const wrapperRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const [flash, setFlash] = useState(false);
  const uid = useId().replace(/:/g, "");
  const idBody = `lumi-body-${uid}`;
  const idHeart = `lumi-heart-${uid}`;
  const idHalo = `lumi-halo-${uid}`;
  const idCheek = `lumi-cheek-${uid}`;

  // Cursor-tracking pupils. Only active when trackCursor=true and the user
  // does not prefer reduced motion.
  useEffect(() => {
    if (!trackCursor) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const handler = (e) => {
      const wrap = wrapperRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const len = Math.max(1, Math.hypot(dx, dy));
      // Clamp pupil offset to ~3px in viewBox units (out of iris radius 7).
      const max = 3;
      const ox = (dx / len) * Math.min(max, len / 60);
      const oy = (dy / len) * Math.min(max, len / 60);
      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute("cx", String(78 + ox));
        leftPupilRef.current.setAttribute("cy", String(95 + oy));
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute("cx", String(122 + ox));
        rightPupilRef.current.setAttribute("cy", String(95 + oy));
      }
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [trackCursor]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    setFlash(true);
    onEmote?.("celebration");
    window.setTimeout(() => setFlash(false), 700);
  }, [interactive, onEmote]);

  const handleKey = useCallback(
    (e) => {
      if (!interactive) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [interactive, handleClick]
  );

  return (
    <div
      ref={wrapperRef}
      className={`lumi-mascot ${className}`.trim()}
      data-emotion={safeEmotion}
      data-flash={flash ? "true" : "false"}
      style={{ width: size, height: size }}
      role={interactive ? "button" : "img"}
      tabIndex={interactive ? 0 : -1}
      aria-label={ariaLabel}
      aria-pressed={interactive ? flash : undefined}
      onClick={handleClick}
      onKeyDown={handleKey}
      data-testid="lumi-mascot"
    >
      <svg
        className="lumi-mascot__svg"
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={idBody} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="hsl(150, 50%, 78%)" />
            <stop offset="60%" stopColor="hsl(150, 38%, 56%)" />
            <stop offset="100%" stopColor="hsl(150, 42%, 38%)" />
          </radialGradient>
          <radialGradient id={idHeart} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(36, 100%, 70%)" />
            <stop offset="60%" stopColor="hsl(36, 92%, 52%)" />
            <stop offset="100%" stopColor="hsl(34, 88%, 38%)" />
          </radialGradient>
          <radialGradient id={idHalo} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(150, 60%, 75%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(150, 60%, 75%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={idCheek} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(350, 80%, 78%)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="hsl(350, 80%, 78%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="lumi-mascot__floater">
          {/* Ambient halo */}
          <circle
            className="lumi-mascot__halo"
            cx="100" cy="120" r="110"
            fill={`url(#${idHalo})`}
          />

          <g className="lumi-mascot__body">
            {/* ── Arms (drawn behind body) ────────────────────── */}
            <g className="lumi-mascot__arm lumi-mascot__arm--left">
              <path
                d="M 60 130 Q 38 150 36 178"
                stroke="hsl(150, 40%, 48%)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hand */}
              <circle cx="36" cy="180" r="10" fill="hsl(150, 50%, 72%)" />
            </g>
            <g className="lumi-mascot__arm lumi-mascot__arm--right">
              <path
                d="M 140 130 Q 162 150 164 178"
                stroke="hsl(150, 40%, 48%)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="164" cy="180" r="10" fill="hsl(150, 50%, 72%)" />
            </g>

            {/* ── Body / torso ─────────────────────────────────── */}
            <ellipse
              cx="100" cy="155" rx="58" ry="62"
              fill={`url(#${idBody})`}
              stroke="hsl(150, 42%, 36%)"
              strokeWidth="1.5"
            />

            {/* Heart */}
            <g className="lumi-mascot__heart" transform="translate(100,160)">
              <path
                d="M 0 6 C -10 -8 -22 -2 -22 8 C -22 18 -8 26 0 32 C 8 26 22 18 22 8 C 22 -2 10 -8 0 6 Z"
                fill={`url(#${idHeart})`}
              />
            </g>

            {/* ── Head ─────────────────────────────────────────── */}
            <g className="lumi-mascot__head">
              <ellipse
                cx="100" cy="86" rx="55" ry="52"
                fill={`url(#${idBody})`}
                stroke="hsl(150, 42%, 36%)"
                strokeWidth="1.5"
              />

              {/* Cheeks */}
              <circle cx="64" cy="105" r="10" fill={`url(#${idCheek})`} />
              <circle cx="136" cy="105" r="10" fill={`url(#${idCheek})`} />

              {/* Eyes — sclera */}
              <ellipse cx="78" cy="92" rx="12" ry="14" fill="#ffffff" />
              <ellipse cx="122" cy="92" rx="12" ry="14" fill="#ffffff" />
              {/* Iris */}
              <circle cx="78" cy="95" r="7" fill="hsl(150, 60%, 28%)" />
              <circle cx="122" cy="95" r="7" fill="hsl(150, 60%, 28%)" />
              {/* Pupils — these are what cursor-track */}
              <circle
                ref={leftPupilRef}
                className="lumi-mascot__pupil"
                cx="78" cy="95" r="3.5"
                fill="#0e1a14"
              />
              <circle
                ref={rightPupilRef}
                className="lumi-mascot__pupil"
                cx="122" cy="95" r="3.5"
                fill="#0e1a14"
              />
              {/* Catchlights */}
              <circle cx="80" cy="91" r="1.6" fill="#ffffff" />
              <circle cx="124" cy="91" r="1.6" fill="#ffffff" />
              {/* Eyelids — covers eyes when blinking */}
              <ellipse
                className="lumi-mascot__eyelid lumi-mascot__eyelid--left"
                cx="78" cy="92" rx="13" ry="15"
                fill="hsl(150, 38%, 56%)"
              />
              <ellipse
                className="lumi-mascot__eyelid lumi-mascot__eyelid--right"
                cx="122" cy="92" rx="13" ry="15"
                fill="hsl(150, 38%, 56%)"
              />

              {/* Mouth — gentle smile, varies by emotion via stroke */}
              <path
                d="M 86 118 Q 100 128 114 118"
                stroke="hsl(150, 42%, 24%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export { VALID_EMOTIONS };
