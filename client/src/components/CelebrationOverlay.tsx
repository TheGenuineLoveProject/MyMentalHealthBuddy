/**
 * CelebrationOverlay — full-screen celebration moment.
 *
 * Renders a confetti backdrop (CSS-only — no extra libraries) with a
 * centered celebrating Lumi. Auto-dismisses after 5s; click anywhere
 * to dismiss early. Honors prefers-reduced-motion (confetti disabled).
 *
 * Safety: this is a celebration surface only — never used for crisis
 * routing. State is "celebrate" (sparkle motion) per the avatar contract.
 */
import { useEffect, useMemo, useRef } from "react";
import { OfficialLumi } from "@/lumi-registry";

// Robust modal focus management: capture the previously-focused element on
// mount, move focus into the dialog, then restore focus to the original
// element on unmount. Required for keyboard-only and screen-reader users.

const AUTO_DISMISS_MS = 5000;
const CONFETTI_PIECES = 24;
const CONFETTI_COLORS = [
  "#FFD75A", "#7FD8A8", "#B19CD9", "#7AE2A6", "#F4A6CD", "#FFB36F",
];

export interface CelebrationOverlayProps {
  onComplete?: () => void;
  message?: string;
  "data-testid"?: string;
}

export default function CelebrationOverlay({
  onComplete,
  message = "Beautiful work — savor this moment.",
  "data-testid": testId = "celebration-overlay",
}: CelebrationOverlayProps) {
  const dismissedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    // Save focus, move into dialog, restore on unmount.
    previousFocusRef.current = (document.activeElement as HTMLElement) || null;
    dialogRef.current?.focus();
    const t = window.setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(t);
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        try { prev.focus(); } catch { /* element may be detached */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-compute confetti positions once so they don't reshuffle on re-render.
  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_PIECES }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      })),
    [],
  );

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      dismiss();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Celebration"
      tabIndex={-1}
      onClick={dismiss}
      onKeyDown={handleKey}
      data-testid={testId}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(6px)",
        cursor: "pointer",
        padding: "2rem",
        outline: "none",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {confetti.map((c, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-12px",
              left: `${c.left}%`,
              width: 10,
              height: 14,
              background: c.color,
              borderRadius: 2,
              transform: `rotate(${c.rotate}deg)`,
              animation: `celebrationConfettiFall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <OfficialLumi
        variant="LUMI_HEART"
        scene="celebration-overlay"
        position="card"
        pageId="celebration-overlay"
        widthPx={160}
        heightPx={160}
        decorative={false}
        motion="soft"
        alt="Lumi celebrating progress"
        data-testid="celebration-overlay-buddy"
      />

      <p
        style={{
          margin: 0,
          color: "white",
          fontSize: "1.125rem",
          fontWeight: 500,
          textAlign: "center",
          maxWidth: "32rem",
          textShadow: "0 1px 4px rgba(0,0,0,0.45)",
        }}
        data-testid="celebration-overlay-message"
      >
        {message}
      </p>
      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.8)",
          fontSize: "0.8125rem",
        }}
      >
        Tap anywhere to continue
      </p>

      <style>{`
        @keyframes celebrationConfettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-testid="${testId}"] span { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}
