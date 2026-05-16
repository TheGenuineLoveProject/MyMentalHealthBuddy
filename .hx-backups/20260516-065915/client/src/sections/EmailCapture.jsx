/**
 * EmailCapture — homepage subscription surface.
 *
 * Distinct from ValueProposition (v5.4):
 *   - ValueProposition is a full marketing block (4-benefit grid + signup)
 *   - EmailCapture is a focused, single-purpose strip ("Stay Connected With Lumi")
 *
 * Both write to the SAME localStorage key (`mmhb:email_subscribers`) so a user
 * who subscribes via either surface is instantly recognized by both.
 *
 * Accessibility:
 *   - <label for>/<input id>
 *   - aria-live polite for success
 *   - aria-invalid + role=alert for errors
 *   - Honors prefers-reduced-motion
 */
import { useEffect, useState } from "react";
import { Check, Mail, AlertCircle } from "lucide-react";

const STORAGE_KEY = "mmhb:email_subscribers";
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
    /* localStorage unavailable / quota — silent no-op */
  }
}

export default function EmailCapture({ className = "" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    if (readStored().length > 0) {
      setReturning(true);
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
    // Intentionally do NOT reset `returning` here — the success state
    // distinguishes brand-new signups vs. devices that were already in.
  };

  return (
    <section
      className={`ec-section ${className}`.trim()}
      aria-labelledby="ec-heading"
      data-testid="section-email-capture"
    >
      <div className="ec-inner">
        <h2 id="ec-heading" className="ec-heading">Stay Connected With Lumi</h2>
        <p className="ec-sub">
          Gentle wellness insights, new tools, and companion updates — no spam, ever.
        </p>

        {status === "success" ? (
          <div role="status" aria-live="polite" className="ec-success" data-testid="status-emailcapture-success">
            <span className="ec-success__check" aria-hidden="true">
              <Check className="w-5 h-5" />
            </span>
            <div className="ec-success__copy">
              <p className="ec-success__title">
                {returning ? "Welcome back — you're already in." : "You're in! Welcome to the community."}
              </p>
              <p className="ec-success__sub">No spam, ever.</p>
            </div>
          </div>
        ) : (
          <form className="ec-form" onSubmit={handleSubmit} noValidate data-testid="form-email-capture">
            <label htmlFor="ec-email" className="ec-form__label">
              <span className="ec-form__sr">Email address</span>
              <span className="ec-form__input-wrap">
                <Mail className="ec-form__icon" aria-hidden="true" />
                <input
                  id="ec-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Your email address..."
                  className="ec-form__input"
                  aria-invalid={status === "error" || undefined}
                  aria-describedby={status === "error" ? "ec-email-error" : undefined}
                  data-testid="input-emailcapture"
                />
              </span>
            </label>
            <button type="submit" className="ec-form__submit" data-testid="button-emailcapture-subscribe">
              Subscribe
            </button>
            {status === "error" && (
              <p id="ec-email-error" role="alert" className="ec-form__error" data-testid="text-emailcapture-error">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
          </form>
        )}

        <p className="ec-trust" data-testid="text-emailcapture-trust">
          Unsubscribe anytime. Your email stays private.
        </p>
      </div>

      <style>{`
        .ec-section {
          padding: clamp(2.5rem, 5vw, 4rem) 1.25rem;
          background: #F0F7F4;
          border-top: 1px solid rgba(168, 201, 160, 0.18);
          border-bottom: 1px solid rgba(168, 201, 160, 0.18);
        }
        .ec-inner {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }
        .ec-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: clamp(1.6rem, 3.4vw, 2.1rem);
          font-weight: 700;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0;
          line-height: 1.2;
        }
        .ec-sub {
          font-size: clamp(0.95rem, 1.4vw, 1.02rem);
          color: #6B7B6E;
          line-height: 1.6;
          margin: 0 0 0.5rem;
          max-width: 52ch;
        }
        .ec-form {
          width: 100%;
          max-width: 480px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.55rem;
          align-items: stretch;
        }
        .ec-form__label { display: contents; }
        .ec-form__sr {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
        .ec-form__input-wrap { position: relative; display: flex; align-items: center; }
        .ec-form__icon {
          position: absolute; left: 0.85rem; width: 1.05rem; height: 1.05rem;
          color: var(--glp-sage, #8FBF9F); pointer-events: none;
        }
        .ec-form__input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          font-size: 1rem;
          font-family: inherit;
          color: var(--glp-ink, #3a3a36);
          background: #FFFFFF;
          border: 1.5px solid rgba(168, 201, 160, 0.45);
          border-radius: 12px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .ec-form__input::placeholder { color: rgba(58, 58, 54, 0.45); }
        .ec-form__input:focus {
          outline: none;
          border-color: var(--glp-sage, #8FBF9F);
          box-shadow: 0 0 0 4px rgba(168, 201, 160, 0.18);
        }
        .ec-form__input[aria-invalid="true"] {
          border-color: #c1554b;
          box-shadow: 0 0 0 4px rgba(193, 85, 75, 0.15);
        }
        .ec-form__submit {
          padding: 0.85rem 1.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          background: var(--glp-sage, #8FBF9F);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease;
          box-shadow: 0 4px 14px rgba(143, 191, 159, 0.32);
          white-space: nowrap;
        }
        .ec-form__submit:hover {
          background: var(--glp-sage-deep, #2F5443);
          transform: translateY(-1px);
        }
        .ec-form__submit:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 2px;
        }
        .ec-form__error {
          grid-column: 1 / -1;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          color: #b74840;
          font-size: 0.85rem;
        }
        .ec-success {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 1rem 1.25rem;
          background: rgba(168, 201, 160, 0.18);
          border: 1.5px solid rgba(143, 191, 159, 0.5);
          border-radius: 14px;
          text-align: left;
          width: 100%;
          max-width: 480px;
        }
        .ec-success__check {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2.1rem; height: 2.1rem;
          border-radius: 50%;
          background: var(--glp-sage, #8FBF9F);
          color: white;
          flex-shrink: 0;
        }
        .ec-success__copy { display: flex; flex-direction: column; gap: 0.15rem; }
        .ec-success__title {
          margin: 0;
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--glp-sage-deep, #2F5443);
        }
        .ec-success__sub {
          margin: 0;
          font-size: 0.85rem;
          color: #6B7B6E;
        }
        .ec-trust {
          font-size: 0.8rem;
          color: rgba(58, 58, 54, 0.6);
          margin: 0;
        }
        @media (max-width: 520px) {
          .ec-form { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ec-form__input, .ec-form__submit { transition: none !important; }
          .ec-form__submit:hover { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
