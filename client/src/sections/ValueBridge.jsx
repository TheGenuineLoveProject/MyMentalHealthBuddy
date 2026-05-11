/**
 * ValueBridge — soft upsell from free tier to Pro.
 *
 * Three feature cards highlighting what Pro unlocks beyond the (already
 * powerful) free experience. The CTA below routes to /pricing — never auto-
 * upgrades, never charges, never overrides crisis routing.
 *
 * Accessibility:
 *   - section aria-labelledby unique heading id
 *   - cards as semantic <li> in a list
 *   - icons aria-hidden, decorative only
 *   - prefers-reduced-motion: hover transforms collapsed
 */
import { Link } from "wouter";
import { Lock, Unlock, BarChart3, Compass, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    iconLocked: Lock,
    iconUnlocked: Unlock,
    title: "Unlimited AI Coaching",
    body: "No session limits. Deep conversations whenever you need them.",
    accent: "#8FBF9F",
    accentSoft: "rgba(143, 191, 159, 0.18)",
  },
  {
    iconLocked: BarChart3,
    iconUnlocked: BarChart3,
    title: "Advanced Emotional Insights",
    body: "Pattern recognition across your moods, behaviors, and growth over time.",
    accent: "#74C0FC",
    accentSoft: "rgba(116, 192, 252, 0.18)",
  },
  {
    iconLocked: Compass,
    iconUnlocked: Compass,
    title: "Guided Healing Journeys",
    body: "Structured programs for specific challenges — anxiety, confidence, focus, and more.",
    accent: "#C8B6FF",
    accentSoft: "rgba(200, 182, 255, 0.22)",
  },
];

export default function ValueBridge({ className = "" }) {
  return (
    <section
      className={`vb-section ${className}`.trim()}
      aria-labelledby="vb-heading"
      data-testid="section-value-bridge"
    >
      <div className="vb-inner">
        <header className="vb-header">
          <h2 id="vb-heading" className="vb-heading">There's More to Explore</h2>
          <p className="vb-sub">Your free tier is powerful. Pro unlocks the full experience.</p>
        </header>

        <ul className="vb-grid" role="list">
          {FEATURES.map((f) => {
            const Locked = f.iconLocked;
            const Unlocked = f.iconUnlocked;
            return (
              <li
                key={f.title}
                className="vb-card"
                data-testid={`card-value-bridge-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ "--vb-accent": f.accent, "--vb-accent-soft": f.accentSoft }}
              >
                <span className="vb-icon" aria-hidden="true">
                  <Locked className="vb-icon__locked" />
                  <Unlocked className="vb-icon__unlocked" />
                </span>
                <h3 className="vb-card__title">{f.title}</h3>
                <p className="vb-card__body">{f.body}</p>
              </li>
            );
          })}
        </ul>

        <div className="vb-cta-wrap">
          <Link
            href="/pricing"
            className="vb-cta"
            data-testid="link-value-bridge-pricing"
          >
            <span>Explore Pro Features</span>
            <ArrowRight className="vb-cta__arrow w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <style>{`
        .vb-section {
          padding: clamp(2.5rem, 5vw, 4rem) 1.25rem;
          background:
            radial-gradient(circle at 80% 20%, rgba(255, 217, 61, 0.06), transparent 55%),
            radial-gradient(circle at 15% 85%, rgba(168, 201, 160, 0.07), transparent 55%),
            var(--glp-paper, #FAFAF7);
        }
        .vb-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 3vw, 2.25rem);
        }
        .vb-header { text-align: center; max-width: 620px; margin: 0 auto; }
        .vb-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 700;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.55rem;
          line-height: 1.2;
        }
        .vb-sub {
          color: #6B7B6E;
          font-size: clamp(0.95rem, 1.4vw, 1.02rem);
          line-height: 1.6;
          margin: 0;
        }
        .vb-grid {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: clamp(0.85rem, 1.6vw, 1.25rem);
        }
        .vb-card {
          background: #FFFFFF;
          /* Solid rgba fallback for Safari < 16.2 / older WebKit */
          border: 1.5px solid rgba(143, 191, 159, 0.28);
          border: 1.5px solid color-mix(in srgb, var(--vb-accent) 28%, transparent);
          border-radius: 18px;
          padding: 1.4rem 1.25rem;
          box-shadow: 0 2px 6px rgba(47, 84, 67, 0.04);
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
          position: relative;
          overflow: hidden;
        }
        .vb-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 3px;
          background: linear-gradient(90deg, var(--vb-accent), transparent);
        }
        .vb-card:hover, .vb-card:focus-within {
          transform: translateY(-3px);
          /* Solid rgba fallback for Safari < 16.2 / older WebKit */
          border-color: rgba(143, 191, 159, 0.55);
          border-color: color-mix(in srgb, var(--vb-accent) 55%, transparent);
          box-shadow: 0 12px 28px rgba(47, 84, 67, 0.10);
        }
        .vb-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.8rem;
          height: 2.8rem;
          border-radius: 12px;
          background: var(--vb-accent-soft);
          color: var(--vb-accent);
          margin-bottom: 0.85rem;
          position: relative;
        }
        .vb-icon__locked, .vb-icon__unlocked {
          width: 1.35rem;
          height: 1.35rem;
          position: absolute;
          transition: opacity 280ms ease, transform 280ms ease;
        }
        .vb-icon__unlocked { opacity: 0; transform: scale(0.85); }
        .vb-card:hover .vb-icon__locked { opacity: 0; transform: scale(1.15); }
        .vb-card:hover .vb-icon__unlocked { opacity: 1; transform: scale(1); }
        .vb-card__title {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: 1.08rem;
          font-weight: 600;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.45rem;
        }
        .vb-card__body {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--glp-ink, #3a3a36);
          margin: 0;
        }
        .vb-cta-wrap {
          display: flex;
          justify-content: center;
        }
        .vb-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.95rem 1.7rem;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, var(--glp-sage, #8FBF9F), var(--glp-sage-deep, #2F5443));
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 8px 22px rgba(47, 84, 67, 0.18);
          transition: transform 200ms ease, box-shadow 200ms ease, filter 200ms ease;
        }
        .vb-cta:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }
        .vb-cta:hover .vb-cta__arrow { transform: translateX(3px); }
        .vb-cta:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 3px;
        }
        .vb-cta__arrow { transition: transform 200ms ease; }
        @media (prefers-reduced-motion: reduce) {
          .vb-card, .vb-cta, .vb-cta__arrow,
          .vb-icon__locked, .vb-icon__unlocked { transition: none !important; }
          .vb-card:hover, .vb-cta:hover { transform: none !important; }
          .vb-card:hover .vb-icon__locked, .vb-card:hover .vb-icon__unlocked,
          .vb-cta:hover .vb-cta__arrow { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
