import { useEffect, useRef, useState } from "react";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";

/**
 * InteractiveBuddy — gentle wrapper that lets the user tap Buddy to cycle
 * through positive expressions on /peacescape. Pure visual reactivity:
 * no state is persisted, no API calls, no telemetry.
 *
 * SAFETY CONTRACT (preserves Buddy v2.11 crisis-color stability):
 *   - When the parent passes state="crisis", clicks become NO-OPs.
 *   - The cycle list NEVER includes "crisis" or any safety-mode state.
 *   - The wrapper does not modify BuddyAvatar source — it only swaps the
 *     `state` prop, which is the documented public surface.
 *
 * Reduced motion: button transition is gated by prefers-reduced-motion via
 * existing global styles; we don't add new animations here.
 */
const CYCLE = ["calm", "encouraging", "curious", "celebratory", "nudging"];

export default function InteractiveBuddy({
  initialState = "calm",
  size = 200,
  ariaLabel = "Tap Buddy to see a different expression.",
  disabled = false,
  testId = "interactive-buddy",
}) {
  const [state, setState] = useState(initialState);
  const [tapCount, setTapCount] = useState(0);
  const [hint, setHint] = useState(null);
  const hintTimer = useRef(null);

  // Lock to crisis if parent ever passes crisis explicitly.
  const isLocked = disabled || initialState === "crisis";

  // Sync to initialState changes (e.g. after PATCH refresh) — but only when
  // not in mid-cycle to avoid yanking the expression back unexpectedly.
  useEffect(() => {
    if (tapCount === 0) setState(initialState);
  }, [initialState, tapCount]);

  function handleTap() {
    if (isLocked) return;
    setTapCount((c) => c + 1);
    setState((prev) => {
      const idx = CYCLE.indexOf(prev);
      const next = CYCLE[(idx + 1) % CYCLE.length];
      return next;
    });
    // Soft, accessible hint that fades after 1.6s.
    setHint("Buddy notices you.");
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 1600);
  }

  useEffect(() => () => { if (hintTimer.current) clearTimeout(hintTimer.current); }, []);

  return (
    <div className="interactive-buddy" data-testid={testId}>
      <button
        type="button"
        onClick={handleTap}
        disabled={isLocked}
        className="interactive-buddy__btn"
        aria-label={isLocked ? "Buddy is here with you." : ariaLabel}
        aria-pressed={tapCount > 0}
        data-testid={`${testId}-trigger`}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: isLocked ? "default" : "pointer",
          borderRadius: "50%",
          outline: "none",
        }}
      >
        <BuddyAvatar
          state={state}
          size={size}
          overlay
          ariaLabel={`Buddy is feeling ${state}.`}
        />
      </button>
      <div
        className="interactive-buddy__hint"
        role="status"
        aria-live="polite"
        style={{
          minHeight: "1.25rem",
          marginTop: "0.5rem",
          fontSize: "0.85rem",
          fontStyle: "italic",
          textAlign: "center",
          color: "var(--glp-sage-deep)",
          opacity: hint ? 0.85 : 0,
          transition: "opacity 0.4s ease",
        }}
        data-testid={`${testId}-hint`}
      >
        {hint || "\u00A0"}
      </div>
    </div>
  );
}
