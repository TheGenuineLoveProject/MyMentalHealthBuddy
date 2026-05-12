/**
 * ReturnLoop — V16 cross-session welcome-back banner.
 *
 * Behavior:
 *   1. On every mount, increment localStorage["mmhb_visit_count"] (once per
 *      browser session — guarded by sessionStorage flag so SPA navs don't
 *      inflate the count).
 *   2. If the resulting count >= 2 AND the user hasn't dismissed this session,
 *      reveal the banner after an 800ms delay (gives the page a beat to settle).
 *   3. Pick one of 5 rotating messages at random; each message ships its own
 *      tone-matched accent color (sage, gold, lavender, mint, rose) drawn from
 *      the canonical brand palette.
 *   4. Dismiss writes sessionStorage["mmhb:returnloop_dismissed"]=true.
 *   5. Hidden on /crisis (we never visually compete with safety routing).
 *
 * Coexistence with v5.5 WelcomeBackBanner:
 *   ReturnLoop fires across browser sessions (visit count persists in
 *   localStorage). WelcomeBackBanner fires within a single tab session.
 *   When ReturnLoop is showing, WelcomeBackBanner self-suppresses (see
 *   `mmhb_visit_count` guard inside WelcomeBackBanner.jsx) so the user
 *   only ever sees one banner at a time.
 *
 * A11y:
 *   - role=status + aria-live=polite
 *   - Dismiss button has explicit aria-label
 *   - prefers-reduced-motion: slide-down replaced with instant appearance
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, X, ArrowRight } from "lucide-react";

const VISIT_COUNT_KEY = "mmhb_visit_count";
const COUNTED_THIS_SESSION_KEY = "mmhb:visit_counted_this_session";
const DISMISS_KEY = "mmhb:returnloop_dismissed";
const AUTH_TOKEN_KEY = "mmhb_token";

const MESSAGES = [
  // v5.6 base rotation (5 messages)
  { text: "Welcome back. How has your heart been feeling today?", accent: "sage" },
  { text: "I'm glad you came back today.", accent: "gold" },
  { text: "Let's take this one moment at a time.", accent: "lavender" },
  { text: "Your buddy missed you. Ready to check in?", accent: "mint" },
  { text: "However you're feeling right now — it's okay. We're here.", accent: "rose" },
  // v5.8.9 — V20 advanced affirmations (deeper strength-based reflections,
  // sourced from miEnhancements.advancedAffirmations, accent-rotated across
  // the canonical palette so the banner always feels visually fresh).
  { text: "You have a wisdom inside you that knows exactly what you need.", accent: "lavender" },
  { text: "The fact that you're here tells me you haven't given up on yourself.", accent: "sage" },
  { text: "You've survived every hard day so far. That is not small.", accent: "gold" },
  { text: "Your willingness to feel — that IS courage.", accent: "rose" },
  { text: "You don't have to be perfect to be worthy of care.", accent: "mint" },
];

// Canonical 8-hex brand palette (per replit.md universal contracts).
const ACCENT_TOKENS = {
  sage:     { bg: "rgba(168, 201, 160, 0.18)", border: "rgba(143, 191, 159, 0.36)", icon: "#8FBF9F", text: "#2F5443" },
  gold:     { bg: "rgba(255, 217,  61, 0.16)", border: "rgba(212, 175,  55, 0.34)", icon: "#D4AF37", text: "#5C4A1A" },
  lavender: { bg: "rgba(200, 182, 255, 0.18)", border: "rgba(200, 182, 255, 0.42)", icon: "#9B86E0", text: "#3F2F66" },
  mint:     { bg: "rgba(168, 213, 186, 0.20)", border: "rgba(168, 213, 186, 0.44)", icon: "#7FB89A", text: "#2F5443" },
  rose:     { bg: "rgba(255, 154, 139, 0.16)", border: "rgba(247, 183, 163, 0.42)", icon: "#E89685", text: "#5C2F2A" },
};

function readSession(key) {
  if (typeof window === "undefined") return null;
  try { return window.sessionStorage.getItem(key); } catch { return null; }
}
function writeSession(key, val) {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(key, val); } catch { /* noop */ }
}
function readLocal(key) {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function writeLocal(key, val) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, val); } catch { /* noop */ }
}
function isAuthed() {
  return Boolean(readLocal(AUTH_TOKEN_KEY));
}

export default function ReturnLoop() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  // Pick a stable random message for the lifetime of the component.
  const message = useMemo(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readSession(DISMISS_KEY) === "true") return;

    // Increment visit count exactly once per browser session.
    if (readSession(COUNTED_THIS_SESSION_KEY) !== "true") {
      const prev = parseInt(readLocal(VISIT_COUNT_KEY) || "0", 10) || 0;
      writeLocal(VISIT_COUNT_KEY, String(prev + 1));
      writeSession(COUNTED_THIS_SESSION_KEY, "true");
    }

    const count = parseInt(readLocal(VISIT_COUNT_KEY) || "0", 10) || 0;
    if (count < 2) return;

    const t = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const onCrisis = location === "/crisis" || location.startsWith("/crisis/");
  if (!visible || onCrisis) return null;

  const ctaHref = isAuthed() ? "/chat" : "/login";
  const accent = ACCENT_TOKENS[message.accent];

  const handleDismiss = () => {
    writeSession(DISMISS_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      className="rl-bar"
      role="status"
      aria-live="polite"
      data-testid="banner-return-loop"
      style={{
        // Solid rgba fallback first (Safari < 16.2), modern browsers see the var.
        background: accent.bg,
        borderBottom: `1px solid ${accent.border}`,
        color: accent.text,
      }}
    >
      <div className="rl-inner">
        <span
          className="rl-icon"
          aria-hidden="true"
          style={{ background: accent.icon }}
        >
          <Heart className="w-3.5 h-3.5" />
        </span>
        <p className="rl-msg">
          <span>{message.text} </span>
          <Link
            href={ctaHref}
            className="rl-link"
            data-testid="link-return-loop-continue"
            style={{ color: accent.text }}
          >
            <span>Continue your journey</span>
            <ArrowRight className="w-3.5 h-3.5 rl-link__arrow" aria-hidden="true" />
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="rl-close"
          aria-label="Dismiss welcome back banner"
          data-testid="button-return-loop-dismiss"
          style={{ color: accent.text }}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <style>{`
        .rl-bar {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 50;
          animation: rlSlideDown 380ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .rl-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.55rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .rl-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          color: white;
          flex-shrink: 0;
        }
        .rl-msg {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .rl-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
        }
        .rl-link:hover .rl-link__arrow { transform: translateX(2px); }
        .rl-link__arrow { transition: transform 200ms ease; }
        .rl-link:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 3px;
          border-radius: 4px;
        }
        .rl-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.85rem;
          height: 1.85rem;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 180ms ease, background-color 180ms ease;
          flex-shrink: 0;
        }
        .rl-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.06);
        }
        .rl-close:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
          opacity: 1;
        }
        @keyframes rlSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rl-bar { animation: none !important; }
          .rl-link__arrow, .rl-close { transition: none !important; }
          .rl-link:hover .rl-link__arrow { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
