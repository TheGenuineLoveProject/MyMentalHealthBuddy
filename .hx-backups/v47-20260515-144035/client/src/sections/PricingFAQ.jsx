/**
 * PricingFAQ — accordion of subscription-related questions.
 *
 * Five questions covering plan switching, free-tier permanence, Starter vs Pro,
 * refunds, and cancellation grace. Pure client-side accordion (no popovers, no
 * portals) so it works inside any host shell.
 *
 * Accessibility:
 *   - Each Q is a real <button> with aria-expanded + aria-controls
 *   - Each A region has role=region + aria-labelledby
 *   - prefers-reduced-motion: chevron rotation collapses to instant
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Can I switch between plans?",
    a: "Yes, anytime. Upgrade and your new features unlock immediately. Downgrade takes effect at your next billing cycle.",
  },
  {
    q: "Is the free tier really free forever?",
    a: "Absolutely. The core experience — mood tracking, journaling, daily reflections, crisis resources, and community tools — is free forever. No trial, no expiration.",
  },
  {
    q: "What's the difference between Starter and Pro?",
    a: "Starter is a one-time $9.99 unlock with more daily chat sessions and guided exercises. Pro is unlimited everything — unlimited AI coaching, advanced insights, healing journeys, analytics, and priority support.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes. Pro and Elite have a 30-day money-back guarantee, no questions asked. Starter ($9.99 one-time) is also refundable within 30 days.",
  },
  {
    q: "What happens if I cancel Pro?",
    a: "You keep everything you had until the end of your billing period, then gracefully return to the free tier. No data loss. No drama.",
  },
];

export default function PricingFAQ({ className = "" }) {
  const [open, setOpen] = useState(null);

  return (
    <section
      className={`pf-section ${className}`.trim()}
      aria-labelledby="pf-heading"
      data-testid="section-pricing-faq"
    >
      <div className="pf-inner">
        <h2 id="pf-heading" className="pf-heading">
          Frequently Asked <span className="pf-heading__accent">Questions</span>
        </h2>
        <p className="pf-sub">Everything you might be wondering — answered honestly.</p>

        <ul className="pf-list" role="list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            const qid = `pf-q-${i}`;
            const aid = `pf-a-${i}`;
            return (
              <li
                key={item.q}
                className={`pf-item ${isOpen ? "pf-item--open" : ""}`}
                data-testid={`pricing-faq-item-${i}`}
              >
                <button
                  type="button"
                  id={qid}
                  className="pf-trigger"
                  aria-expanded={isOpen}
                  aria-controls={aid}
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-testid={`button-pricing-faq-toggle-${i}`}
                >
                  <span className="pf-trigger__q">{item.q}</span>
                  <ChevronDown className="pf-trigger__chev" aria-hidden="true" />
                </button>
                <div
                  id={aid}
                  role="region"
                  aria-labelledby={qid}
                  className="pf-answer"
                  hidden={!isOpen}
                  data-testid={`pricing-faq-answer-${i}`}
                >
                  <p>{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .pf-section { padding: clamp(2.5rem, 5vw, 4rem) 1.25rem; }
        .pf-inner { max-width: 720px; margin: 0 auto; }
        .pf-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: clamp(1.8rem, 3.6vw, 2.4rem);
          font-weight: 700;
          color: var(--glp-sage-deep, #2F5443);
          text-align: center;
          margin: 0 0 0.6rem;
          line-height: 1.2;
        }
        .pf-heading__accent {
          background: linear-gradient(135deg, var(--glp-sage, #8FBF9F), var(--glp-gold, #D4AF37));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pf-sub {
          text-align: center;
          color: #6B7B6E;
          font-size: 0.98rem;
          margin: 0 0 2rem;
        }
        .pf-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pf-item {
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px solid rgba(168, 201, 160, 0.25);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .pf-item--open {
          border-color: rgba(168, 201, 160, 0.55);
          box-shadow: 0 6px 18px rgba(47, 84, 67, 0.07);
        }
        .pf-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.05rem 1.25rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          color: var(--glp-sage-deep, #2F5443);
          text-align: left;
        }
        .pf-trigger:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: -3px;
          border-radius: 14px;
        }
        .pf-trigger__q { flex: 1; line-height: 1.4; }
        .pf-trigger__chev {
          width: 1.15rem;
          height: 1.15rem;
          color: var(--glp-sage, #8FBF9F);
          transition: transform 220ms ease;
          flex-shrink: 0;
        }
        .pf-item--open .pf-trigger__chev { transform: rotate(180deg); }
        .pf-answer {
          padding: 0 1.25rem 1.1rem;
          color: var(--glp-ink, #3a3a36);
          font-size: 0.94rem;
          line-height: 1.65;
        }
        .pf-answer p { margin: 0; }
        @media (prefers-reduced-motion: reduce) {
          .pf-item, .pf-trigger__chev { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
