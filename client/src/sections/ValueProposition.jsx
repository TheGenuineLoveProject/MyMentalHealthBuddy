/**
 * ValueProposition — email signup + value pillars.
 *
 * Two variants:
 *   - "full"    : headline + 4-benefit grid + email form + trust line
 *   - "compact" : headline + email form + trust line (no grid)
 *
 * Storage: writes to localStorage["mmhb:email_subscribers"] as a JSON
 * array of unique lowercased emails. Frontend-only — no network call.
 * (When a backend subscription endpoint lands, swap the handleSubmit.)
 *
 * Accessibility:
 *   - Honest <form> with explicit <label> for the email input
 *   - aria-live polite region for the success state
 *   - Error states announced via aria-describedby on the input
 *   - prefers-reduced-motion: opacity-only transitions, no transforms
 *
 * Crisis-safe: this is a marketing engagement surface; SafetyFooter on
 * the host page still routes to /crisis. No claims, no medical language.
 */
import { useEffect, useState } from "react";
import { Heart, Shield, Sparkles, Compass, Mail, Check, AlertCircle } from "lucide-react";

const STORAGE_KEY = "mmhb:email_subscribers";

const BENEFITS = [
  {
    icon: Heart,
    title: "Trauma-informed support",
    body: "Gentle, consent-based prompts designed with mental wellness best practices — never clinical, never alarmist.",
    accent: "#A8C9A0",
  },
  {
    icon: Sparkles,
    title: "Daily reflection cues",
    body: "A small, kind nudge to pause, breathe, and notice. Your inbox stays calm — one short note a week, not a flood.",
    accent: "#E8913A",
  },
  {
    icon: Shield,
    title: "Privacy by default",
    body: "Your email is stored locally on this device until you confirm. No cross-site trackers, no data brokers, ever.",
    accent: "#74C0FC",
  },
  {
    icon: Compass,
    title: "Tools you can use today",
    body: "Free breathing, check-in, journaling, and celebration tools — no signup required to use them, ever.",
    accent: "#C8B6FF",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStored(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* localStorage unavailable / quota — silent no-op (status still flips). */
  }
}

export default function ValueProposition({ variant = "full", className = "" }) {
  const isFull = variant === "full";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [error, setError] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  // On mount, restore success state if this device already subscribed —
  // avoids re-prompting a returning user with the same email.
  useEffect(() => {
    const list = readStored();
    if (list.length > 0) {
      setAlreadySubscribed(true);
      setStatus("success");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    const list = readStored();
    if (!list.includes(trimmed)) list.push(trimmed);
    writeStored(list);
    setEmail("");
    setError("");
    setStatus("success");
    setAlreadySubscribed(true);
  };

  const renderForm = () => {
    if (status === "success") {
      return (
        <div
          role="status"
          aria-live="polite"
          className="vp-success"
          data-testid="status-email-success"
        >
          <span className="vp-success__check" aria-hidden="true">
            <Check className="w-5 h-5" />
          </span>
          <span className="vp-success__text">
            {alreadySubscribed && !email
              ? "You're already on the list. Welcome back."
              : "Thank you — you're on the list."}
          </span>
        </div>
      );
    }
    return (
      <form className="vp-form" onSubmit={handleSubmit} noValidate data-testid="form-email-subscribe">
        <label htmlFor="vp-email-input" className="vp-form__label">
          <span className="vp-form__label-text">Email address</span>
          <span className="vp-form__input-wrap">
            <Mail className="vp-form__input-icon" aria-hidden="true" />
            <input
              id="vp-email-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@example.com"
              className="vp-form__input"
              aria-invalid={status === "error" || undefined}
              aria-describedby={status === "error" ? "vp-email-error" : undefined}
              data-testid="input-email-subscribe"
            />
          </span>
        </label>
        <button
          type="submit"
          className="vp-form__submit"
          data-testid="button-email-subscribe"
        >
          Stay Connected
        </button>
        {status === "error" && (
          <p
            id="vp-email-error"
            role="alert"
            className="vp-form__error"
            data-testid="text-email-error"
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </form>
    );
  };

  return (
    <section
      className={`vp-section vp-section--${variant} ${className}`.trim()}
      data-testid={`section-value-proposition-${variant}`}
      aria-labelledby="vp-heading"
    >
      <div className="vp-inner">
        <div className="vp-header">
          <h2 id="vp-heading" className="vp-heading">
            {isFull ? "Healing, in your inbox — gently." : "Stay close to your practice."}
          </h2>
          <p className="vp-sub">
            {isFull
              ? "One short, trauma-informed note a week. No marketing fluff. Unsubscribe with one click, anytime."
              : "Get a soft weekly check-in by email. No spam — ever."}
          </p>
        </div>

        {isFull && (
          <ul className="vp-benefits" role="list">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.title}
                  className="vp-benefit"
                  data-testid={`benefit-${b.title.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ "--vp-accent": b.accent }}
                >
                  <span
                    className="vp-benefit__icon"
                    aria-hidden="true"
                    style={{ background: `color-mix(in srgb, ${b.accent} 14%, transparent)`, color: b.accent }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <h3 className="vp-benefit__title">{b.title}</h3>
                  <p className="vp-benefit__body">{b.body}</p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="vp-form-wrap">
          {renderForm()}
          <p className="vp-trust" data-testid="text-trust-line">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <style>{`
        .vp-section {
          padding: clamp(3rem, 6vw, 5rem) 1.25rem;
          background: #F7F4EE;
          position: relative;
          overflow: hidden;
        }
        .vp-section--compact {
          padding: clamp(2rem, 5vw, 3.5rem) 1.25rem;
        }
        .vp-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 3vw, 2.5rem);
        }
        .vp-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .vp-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-weight: 700;
          font-size: clamp(1.6rem, 3.6vw, 2.4rem);
          line-height: 1.2;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.6rem;
        }
        .vp-sub {
          font-size: clamp(0.95rem, 1.4vw, 1.05rem);
          color: var(--glp-ink, #3a3a36);
          line-height: 1.65;
          margin: 0;
        }
        .vp-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: clamp(0.85rem, 1.6vw, 1.2rem);
        }
        .vp-benefit {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(168, 201, 160, 0.30);
          border-radius: 18px;
          padding: 1.5rem 1.25rem;
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
          box-shadow: 0 1px 3px rgba(45, 55, 50, 0.04), 0 1px 2px rgba(45, 55, 50, 0.03);
          overflow: hidden;
        }
        .vp-benefit::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: var(--vp-accent, #A8C9A0);
          opacity: 0.85;
        }
        .vp-benefit:hover, .vp-benefit:focus-within {
          transform: translateY(-2px);
          border-color: rgba(168, 201, 160, 0.55);
          box-shadow: 0 10px 24px rgba(45, 55, 50, 0.08), 0 2px 6px rgba(45, 55, 50, 0.04);
        }
        .vp-benefit__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 12px;
          margin-bottom: 0.85rem;
        }
        .vp-benefit__title {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.4rem;
        }
        .vp-benefit__body {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--glp-ink, #3a3a36);
          margin: 0;
        }
        .vp-form-wrap {
          max-width: 560px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          align-items: center;
        }
        .vp-form {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
          align-items: stretch;
        }
        .vp-form__label {
          display: contents;
        }
        .vp-form__label-text {
          position: absolute;
          width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
        .vp-form__input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .vp-form__input-icon {
          position: absolute;
          left: 0.85rem;
          width: 1.05rem;
          height: 1.05rem;
          color: #A8C9A0;
          pointer-events: none;
        }
        .vp-form__input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          font-size: 1rem;
          font-family: inherit;
          color: var(--glp-ink, #3a3a36);
          background: rgba(255, 255, 255, 0.95);
          border: 1.5px solid rgba(168, 201, 160, 0.4);
          border-radius: 12px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .vp-form__input::placeholder {
          color: rgba(58, 58, 54, 0.45);
        }
        .vp-form__input:focus {
          outline: none;
          border-color: #A8C9A0;
          box-shadow: 0 0 0 4px rgba(168, 201, 160, 0.18);
        }
        .vp-form__input[aria-invalid="true"] {
          border-color: #c1554b;
          box-shadow: 0 0 0 4px rgba(193, 85, 75, 0.15);
        }
        .vp-form__submit {
          padding: 0.85rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
          box-shadow: 0 4px 14px rgba(74, 126, 114, 0.22);
          white-space: nowrap;
        }
        .vp-form__submit:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .vp-form__submit:active { transform: translateY(0); }
        .vp-form__submit:focus-visible {
          outline: 3px solid #4A7E72;
          outline-offset: 2px;
        }
        .vp-form__error {
          grid-column: 1 / -1;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #b74840;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .vp-success {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.95rem 1.1rem;
          background: rgba(168, 201, 160, 0.16);
          border: 1.5px solid rgba(168, 201, 160, 0.5);
          border-radius: 12px;
          color: var(--glp-sage-deep, #2F5443);
          font-size: 0.95rem;
          line-height: 1.45;
        }
        .vp-success__check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.9rem;
          height: 1.9rem;
          border-radius: 50%;
          background: #A8C9A0;
          color: white;
          flex-shrink: 0;
        }
        .vp-trust {
          font-size: 0.8rem;
          color: rgba(58, 58, 54, 0.6);
          margin: 0;
          text-align: center;
        }
        @media (max-width: 520px) {
          .vp-form { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vp-benefit, .vp-form__input, .vp-form__submit {
            transition: none !important;
          }
          .vp-benefit:hover, .vp-form__submit:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
