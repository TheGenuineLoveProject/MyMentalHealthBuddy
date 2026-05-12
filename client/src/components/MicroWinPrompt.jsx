/**
 * MicroWinPrompt — V16 idle-state gentle prompt.
 *
 * Behavior:
 *   1. After 45 seconds of no user click / no scroll, surface a soft prompt.
 *   2. Three options route to safe, low-commitment destinations:
 *        - "Take one calm breath" → /tools/breathing
 *        - "Name how you feel"    → /checkin
 *        - "Meet your companion"  → /chat (or /login if unauthed)
 *   3. Once shown OR dismissed, sets sessionStorage flag so it never reappears
 *      in the same tab session.
 *   4. Hidden on /crisis (never visually compete with safety routing).
 *
 * A11y:
 *   - role=dialog with aria-label
 *   - Esc key dismisses
 *   - prefers-reduced-motion: fade-up replaced with instant appearance
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Wind, Sparkles, Heart, X } from "lucide-react";
import { getResistanceMessage } from "../data/nlpMiContent.js";

const SHOWN_KEY = "mmhb:microwin_shown";
const IDLE_MS = 45000;
const AUTH_TOKEN_KEY = "mmhb_token";
// v5.8.9 — V20: how long to display the rolling-with-resistance message
// after dismiss before fully unmounting the prompt.
const RESISTANCE_HOLD_MS = 2200;

function readSession(key) {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage.getItem(key); } catch { return null; }
}
function writeSession(key, val) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(key, val); } catch { /* noop */ }
}
function isAuthed() {
  if (typeof window === "undefined") return false;
  try { return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)); } catch { return false; }
}

export default function MicroWinPrompt() {
  const [visible, setVisible] = useState(false);
  // v5.8.9 — V20: when true, the dismiss flow is mid-animation and the
  // card body swaps in a soft, no-pressure resistance message before the
  // full unmount completes 2.2s later. Honors user choice without guilt.
  const [resistanceShown, setResistanceShown] = useState(false);
  const resistanceMsg = useMemo(() => getResistanceMessage(), []);
  const [location] = useLocation();
  const closeBtnRef = useRef(null);
  // v5.8.9 architect hardening — track the dismiss hold timer so a fast
  // unmount (e.g., route change) cancels the pending setVisible call and
  // avoids a stale state update on an unmounted component.
  const dismissTimerRef = useRef(null);

  // Centralized dismiss → show resistance message, then unmount.
  const dismiss = () => {
    if (resistanceShown) return;
    setResistanceShown(true);
    dismissTimerRef.current = window.setTimeout(
      () => setVisible(false),
      RESISTANCE_HOLD_MS
    );
  };

  // Clear any pending dismiss timer on unmount.
  useEffect(() => () => {
    if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
  }, []);

  // When the prompt becomes visible, move keyboard focus to the close button
  // so users discover the dialog and can immediately dismiss with Enter.
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => {
      try { closeBtnRef.current?.focus(); } catch { /* noop */ }
    }, 50);
    return () => window.clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readSession(SHOWN_KEY) === "true") return;

    let timeoutId = null;
    const reset = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setVisible(true);
        writeSession(SHOWN_KEY, "true");
      }, IDLE_MS);
    };

    // Start timer immediately; reset on any meaningful user activity.
    reset();
    const opts = { passive: true };
    window.addEventListener("click", reset, opts);
    window.addEventListener("scroll", reset, opts);
    window.addEventListener("keydown", reset, opts);
    window.addEventListener("touchstart", reset, opts);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener("click", reset, opts);
      window.removeEventListener("scroll", reset, opts);
      window.removeEventListener("keydown", reset, opts);
      window.removeEventListener("touchstart", reset, opts);
    };
  }, []);

  // Esc dismisses while visible.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const onCrisis = location === "/crisis" || location.startsWith("/crisis/");
  if (!visible || onCrisis) return null;

  const lumiHref = isAuthed() ? "/chat" : "/login";

  const options = [
    { label: "Take one calm breath", href: "/tools/breathing", Icon: Wind,     accent: "#74C0FC" },
    { label: "Name how you feel",    href: "/checkin",          Icon: Heart,    accent: "#FFB88C" },
    { label: "Meet your companion",  href: lumiHref,            Icon: Sparkles, accent: "#C8B6FF" },
  ];

  return (
    <div
      className="mwp-shell"
      role="dialog"
      aria-modal="false"
      aria-label="A gentle moment of calm"
      data-testid="prompt-micro-win"
    >
      <div className="mwp-card">
        <button
          type="button"
          ref={closeBtnRef}
          onClick={dismiss}
          className="mwp-close"
          aria-label="Dismiss this gentle prompt"
          data-testid="button-micro-win-dismiss"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
        {resistanceShown ? (
          <p
            className="mwp-msg mwp-msg--resistance"
            role="status"
            aria-live="polite"
            data-testid="text-micro-win-resistance"
          >
            {resistanceMsg}
          </p>
        ) : (
          <>
            <p className="mwp-msg">
              You don't have to figure everything out right now. Would you like a
              moment of calm?
            </p>
            <div className="mwp-options">
              {options.map(({ label, href, Icon, accent }) => (
                <Link
                  key={href}
                  href={href}
                  className="mwp-opt"
                  data-testid={`link-micro-win-${href.replace(/\//g, "-").slice(1) || "home"}`}
                  onClick={() => setVisible(false)}
                  style={{ "--mwp-accent": accent }}
                >
                  <span className="mwp-opt__icon" aria-hidden="true">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .mwp-shell {
          position: fixed;
          left: 50%;
          /* v5.6 architect fix: lift above AccessibilityToolbar (bottom-6 right-6)
             on small screens so the toolbar's floating button remains tappable. */
          bottom: 5rem;
          transform: translateX(-50%);
          /* v5.6 architect fix: yield z-index to ConsentBanner (z-50) so privacy
             consent always wins. MicroWinPrompt is non-critical and waits 45s — it
             can sit beneath the consent surface. */
          z-index: 40;
          width: min(540px, calc(100% - 2rem));
          pointer-events: none;
        }
        @media (min-width: 768px) {
          /* On larger screens AccessibilityToolbar is in the corner and the prompt
             centers above it cleanly with a smaller offset. */
          .mwp-shell { bottom: 1.5rem; }
        }
        .mwp-card {
          position: relative;
          pointer-events: auto;
          background: #FFFFFF;
          border: 1px solid rgba(143, 191, 159, 0.32);
          border-radius: 18px;
          padding: 1.1rem 1.15rem 1rem;
          box-shadow: 0 14px 40px rgba(47, 84, 67, 0.18);
          animation: mwpFadeUp 360ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .mwp-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 1.85rem;
          height: 1.85rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #6B7B6E;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 180ms ease, background-color 180ms ease;
        }
        .mwp-close:hover { opacity: 1; background: rgba(47, 84, 67, 0.08); }
        .mwp-close:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
          opacity: 1;
        }
        .mwp-msg {
          margin: 0 1.85rem 0.85rem 0;
          font-size: 0.92rem;
          line-height: 1.45;
          color: #2F5443;
          font-weight: 500;
        }
        /* v5.8.9 — V20 rolling-with-resistance message styling */
        .mwp-msg--resistance {
          margin: 0.4rem 1.85rem 0.4rem 0;
          font-style: italic;
          color: #5C4A1A;
          animation: mwpFadeUp 280ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .mwp-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.45rem;
        }
        @media (min-width: 480px) {
          .mwp-options { grid-template-columns: repeat(3, 1fr); }
        }
        .mwp-opt {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.7rem;
          border-radius: 12px;
          background: rgba(143, 191, 159, 0.08);
          border: 1px solid rgba(143, 191, 159, 0.22);
          color: #2F5443;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
        }
        .mwp-opt:hover, .mwp-opt:focus-visible {
          transform: translateY(-1px);
          background: rgba(143, 191, 159, 0.14);
          border-color: var(--mwp-accent, rgba(143, 191, 159, 0.55));
        }
        .mwp-opt:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
        }
        .mwp-opt__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: var(--mwp-accent, #8FBF9F);
          color: white;
          flex-shrink: 0;
        }
        @keyframes mwpFadeUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mwp-card { animation: none !important; }
          /* v5.8.9 architect fix — kill the resistance message fade-up too */
          .mwp-msg--resistance { animation: none !important; }
          .mwp-opt, .mwp-close { transition: none !important; }
          .mwp-opt:hover, .mwp-opt:focus-visible { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
