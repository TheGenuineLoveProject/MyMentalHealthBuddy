/**
 * WelcomeBackBanner — slim returning-visitor strip.
 *
 * Behavior:
 *   1. On first ever visit (sessionStorage["mmhb:returning_visitor"] unset):
 *      seed it to "true" and DO NOT show the banner.
 *   2. On subsequent navigations within the same tab session: show the banner.
 *   3. User can dismiss with the X button (sets `mmhb:welcome_dismissed=true`
 *      so it stays hidden for the rest of the session).
 *   4. CTA links to /chat for authed users (best-effort detect via the same
 *      `mmhb_token` localStorage key the AuthContext writes), else /login.
 *
 * Crisis-safe: this banner never appears on /crisis (the route is excluded
 * inside the wouter location check) so we never visually compete with safety
 * resources when a user lands there.
 *
 * Accessibility:
 *   - role=status + aria-live=polite (non-interrupting)
 *   - Dismiss button has explicit aria-label
 *   - prefers-reduced-motion: slide-down replaced with instant appearance
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, X, ArrowRight } from "lucide-react";

const VISITOR_KEY = "mmhb:returning_visitor";
const DISMISS_KEY = "mmhb:welcome_dismissed";
const AUTH_TOKEN_KEY = "mmhb_token";
// v5.6 V16: yield to ReturnLoop when the cross-session counter has fired so
// the user never sees two stacked welcome-back strips.
const VISIT_COUNT_KEY = "mmhb_visit_count";

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

export default function WelcomeBackBanner() {
  const [visible, setVisible] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readSession(DISMISS_KEY) === "true") return;

    // v5.6 V16: if the cross-session ReturnLoop will fire (visit count >= 2),
    // suppress this within-session banner so the two never stack.
    try {
      const count = parseInt(window.localStorage.getItem(VISIT_COUNT_KEY) || "0", 10) || 0;
      if (count >= 2) return;
    } catch { /* noop */ }

    const seen = readSession(VISITOR_KEY);
    if (!seen) {
      writeSession(VISITOR_KEY, "true");
      return; // first visit — stay hidden
    }
    setVisible(true);
  }, []);

  // Hide on safety-critical routes so we never visually compete with /crisis.
  const onCrisis = location === "/crisis" || location.startsWith("/crisis/");
  if (!visible || onCrisis) return null;

  const ctaHref = isAuthed() ? "/chat" : "/login";

  const handleDismiss = () => {
    writeSession(DISMISS_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      className="wbb-bar"
      role="status"
      aria-live="polite"
      data-testid="banner-welcome-back"
    >
      <div className="wbb-inner">
        <span className="wbb-icon" aria-hidden="true">
          <Heart className="w-3.5 h-3.5" />
        </span>
        <p className="wbb-msg">
          <span>Welcome back. Lumi missed you. </span>
          <Link
            href={ctaHref}
            className="wbb-link"
            data-testid="link-welcome-back-continue"
          >
            <span>Continue your journey</span>
            <ArrowRight className="w-3.5 h-3.5 wbb-link__arrow" aria-hidden="true" />
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="wbb-close"
          aria-label="Dismiss welcome back banner"
          data-testid="button-welcome-back-dismiss"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <style>{`
        .wbb-bar {
          position: relative;
          width: 100%;
          background: linear-gradient(90deg, rgba(168, 201, 160, 0.18), rgba(168, 201, 160, 0.10));
          border-bottom: 1px solid rgba(143, 191, 159, 0.32);
          z-index: 35;
          animation: wbbSlideDown 380ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .wbb-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.55rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .wbb-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: var(--glp-sage, #8FBF9F);
          color: white;
          flex-shrink: 0;
        }
        .wbb-msg {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--glp-sage-deep, #2F5443);
        }
        .wbb-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--glp-sage-deep, #2F5443);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
        }
        .wbb-link:hover .wbb-link__arrow { transform: translateX(2px); }
        .wbb-link__arrow { transition: transform 200ms ease; }
        .wbb-link:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 3px;
          border-radius: 4px;
        }
        .wbb-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.85rem;
          height: 1.85rem;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--glp-sage-deep, #2F5443);
          cursor: pointer;
          opacity: 0.65;
          transition: opacity 180ms ease, background-color 180ms ease;
          flex-shrink: 0;
        }
        .wbb-close:hover {
          opacity: 1;
          background: rgba(47, 84, 67, 0.08);
        }
        .wbb-close:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 2px;
          opacity: 1;
        }
        @keyframes wbbSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wbb-bar { animation: none !important; }
          .wbb-link__arrow, .wbb-close { transition: none !important; }
          .wbb-link:hover .wbb-link__arrow { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
