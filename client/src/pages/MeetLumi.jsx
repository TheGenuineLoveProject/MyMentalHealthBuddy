import React, { useEffect } from "react";
import { Link } from "wouter";
import LumiCarousel from "../components/lumi/LumiCarousel.jsx";
import Button from "../components/ui/Button.jsx";
import { OFFICIAL_LUMI_REGISTRY } from "../lumi-registry/registry/officialLumiRegistry";
import "../styles/meet-lumi-page.css";

const SHOWCASE_ORDER = [
  "LUMI_CALM_FLOAT",
  "LUMI_HEART",
  "LUMI_MEDITATION",
  "LUMI_COMPANION",
  "LUMI_PATH",
  "LUMI_EMOTION_ORB",
  "LUMI_SOFT_PRESENCE",
];

const HELP_MODES = [
  {
    title: "Pause and orient",
    body:
      "Lumi can help you slow the moment down, notice what is happening, and choose a manageable next step.",
  },
  {
    title: "Reflect without judgment",
    body:
      "Lumi can support gentle reflection about emotions, patterns, needs, values, and what may matter next.",
  },
  {
    title: "Practice something useful",
    body:
      "When a practical tool fits, Lumi can help you find breathing, grounding, journaling, learning, and other wellness exercises.",
  },
];

const FAQ = [
  {
    question: "Is each Lumi image a different character?",
    answer:
      "No. There is one Lumi identity. The visual state changes to communicate context such as calm, reflection, grounding, warmth, emotional awareness, or forward movement.",
  },
  {
    question: "Why does Lumi look different in different places?",
    answer:
      "Each approved state has a defined emotional role and placement policy. The goal is to make the interface easier to understand without changing who Lumi is.",
  },
  {
    question: "Is Lumi a therapist or medical professional?",
    answer:
      "No. Lumi supports wellness education, reflection, and guided self-help experiences. Lumi does not diagnose, prescribe, or replace a licensed professional or emergency service.",
  },
  {
    question: "Do I have to use Lumi?",
    answer:
      "No. Lumi is a supportive interface, not a requirement. You can use the platform's tools, learning resources, journal, and support information directly.",
  },
];

function ensureMeta(name, content) {
  let node = document.querySelector(`meta[name="${name}"]`);
  const created = !node;

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }

  const previous = node.getAttribute("content");
  node.setAttribute("content", content);

  return () => {
    if (created) {
      node.remove();
    } else if (previous === null) {
      node.removeAttribute("content");
    } else {
      node.setAttribute("content", previous);
    }
  };
}

function ensureCanonical(pathname) {
  let node = document.querySelector('link[rel="canonical"]');
  const created = !node;

  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }

  const previous = node.getAttribute("href");
  const href = new URL(pathname, window.location.origin).toString();

  node.setAttribute("href", href);

  return () => {
    if (created) {
      node.remove();
    } else if (previous === null) {
      node.removeAttribute("href");
    } else {
      node.setAttribute("href", previous);
    }
  };
}

export default function MeetLumi() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Meet Lumi — One Gentle Companion, Multiple Supportive States | MyMentalHealthBuddy";

    const restoreDescription = ensureMeta(
      "description",
      "Meet Lumi, the gentle MyMentalHealthBuddy companion. Learn how Lumi's approved visual states support reflection, grounding, emotional awareness, and practical next steps."
    );

    const restoreCanonical = ensureCanonical("/lumi");

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreCanonical();
    };
  }, []);

  return (
    <main className="meet-lumi" data-testid="page-lumi">
      <style>{`
        .meet-lumi {
          min-height: 100vh;
          background:
            radial-gradient(
              120% 90% at 8% -10%,
              color-mix(in srgb, var(--glp-gold, #d4af37) 10%, transparent) 0%,
              transparent 45%
            ),
            radial-gradient(
              120% 100% at 100% 0%,
              color-mix(in srgb, var(--glp-sage, #8fbf9f) 18%, transparent) 0%,
              transparent 50%
            ),
            linear-gradient(
              160deg,
              var(--glp-ivory, #faf9f7) 0%,
              #f8f8f4 55%,
              color-mix(in srgb, var(--glp-sage, #8fbf9f) 12%, transparent) 100%
            );
          color: var(--glp-deep-teal, #2f5d5d);
        }

        .ml-wrap {
          width: min(1140px, calc(100% - 2rem));
          margin: 0 auto;
          padding: clamp(3rem, 7vw, 5.5rem) 0;
        }

        .ml-section {
          margin-top: clamp(3.5rem, 8vw, 6rem);
        }

        .ml-eyebrow {
          margin: 0;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--glp-sage-deep, #2f6b4f);
        }

        .ml-h1 {
          margin: 1rem auto 0;
          max-width: 19ch;
          text-align: center;
          font-size: clamp(2.25rem, 6vw, 4.4rem);
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: var(--glp-deep-teal, #2f5d5d);
        }

        .ml-lead {
          margin: 1.25rem auto 0;
          max-width: 66ch;
          text-align: center;
          font-size: clamp(1.05rem, 2vw, 1.24rem);
          line-height: 1.7;
          color: var(--glp-charcoal, #3a3a3a);
        }

        .ml-identity {
          margin: 1.75rem auto 0;
          width: fit-content;
          max-width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--glp-sage, #8fbf9f) 45%, transparent);
          background: color-mix(in srgb, var(--glp-ivory, #faf9f7) 82%, transparent);
          color: var(--glp-deep-teal, #2f5d5d);
          font-weight: 800;
          text-align: center;
        }

        .ml-stage {
          margin-top: clamp(2rem, 5vw, 3.25rem);
        }

        .ml-heading {
          margin: 0;
          text-align: center;
          font-size: clamp(1.75rem, 4vw, 2.7rem);
          line-height: 1.15;
          color: var(--glp-deep-teal, #2f5d5d);
        }

        .ml-subheading {
          margin: 0.85rem auto 0;
          max-width: 66ch;
          text-align: center;
          line-height: 1.7;
          color: var(--glp-charcoal, #3a3a3a);
        }

        .ml-three-grid,
        .ml-state-grid,
        .ml-trust-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .ml-three-grid {
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }

        .ml-state-grid {
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
        }

        .ml-trust-grid {
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }

        .ml-card {
          border-radius: 1.4rem;
          border: 1px solid color-mix(in srgb, var(--glp-sage, #8fbf9f) 22%, transparent);
          background: color-mix(in srgb, var(--glp-ivory, #faf9f7) 86%, transparent);
          padding: clamp(1.25rem, 3vw, 1.75rem);
          box-shadow: 0 14px 34px rgba(47, 93, 93, 0.07);
        }

        .ml-card h3 {
          margin: 0;
          color: var(--glp-deep-teal, #2f5d5d);
          font-size: 1.12rem;
        }

        .ml-card p {
          margin: 0.65rem 0 0;
          line-height: 1.65;
          color: var(--glp-charcoal, #3a3a3a);
        }

        .ml-state-card {
          text-align: center;
        }

        .ml-state-img {
          display: block;
          width: clamp(108px, 20vw, 138px);
          height: clamp(108px, 20vw, 138px);
          margin: 0 auto 0.9rem;
          object-fit: contain;
          filter: drop-shadow(0 10px 18px rgba(47, 93, 93, 0.12));
        }

        .ml-role {
          margin-top: 0.4rem !important;
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--glp-sage-deep, #2f6b4f) !important;
        }

        .ml-callout {
          margin-top: 2rem;
          padding: clamp(1.4rem, 3vw, 2rem);
          border-radius: 1.5rem;
          border: 1px solid color-mix(in srgb, var(--glp-gold, #d4af37) 35%, transparent);
          background: color-mix(in srgb, var(--glp-gold, #d4af37) 8%, var(--glp-ivory, #faf9f7));
        }

        .ml-callout strong {
          color: var(--glp-deep-teal, #2f5d5d);
        }

        .ml-callout p {
          margin: 0;
          line-height: 1.7;
          color: var(--glp-charcoal, #3a3a3a);
        }

        .ml-actions {
          margin-top: 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.8rem;
        }

        .ml-trust-list {
          margin: 0.75rem 0 0;
          padding-left: 1.2rem;
          color: var(--glp-charcoal, #3a3a3a);
          line-height: 1.7;
        }

        .ml-link {
          color: var(--glp-deep-teal, #2f5d5d);
          font-weight: 750;
          text-decoration: underline;
          text-underline-offset: 3px;
          border-radius: 0.25rem;
        }

        .ml-link:focus-visible {
          outline: 3px solid var(--glp-gold, #d4af37);
          outline-offset: 3px;
        }

        .ml-faq {
          margin-top: 1.5rem;
          display: grid;
          gap: 0.75rem;
        }

        .ml-faq details {
          border-radius: 1rem;
          border: 1px solid color-mix(in srgb, var(--glp-sage, #8fbf9f) 25%, transparent);
          background: color-mix(in srgb, var(--glp-ivory, #faf9f7) 90%, transparent);
          padding: 1rem 1.1rem;
        }

        .ml-faq summary {
          cursor: pointer;
          color: var(--glp-deep-teal, #2f5d5d);
          font-weight: 800;
          line-height: 1.5;
        }

        .ml-faq summary:focus-visible {
          outline: 3px solid var(--glp-gold, #d4af37);
          outline-offset: 4px;
          border-radius: 0.25rem;
        }

        .ml-faq p {
          margin: 0.75rem 0 0;
          line-height: 1.7;
          color: var(--glp-charcoal, #3a3a3a);
        }

        .ml-crisis {
          margin-top: 2rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(232, 145, 58, 0.32);
          background: rgba(255, 184, 140, 0.12);
          padding: 1rem 1.2rem;
          text-align: center;
          line-height: 1.65;
          color: #5a3415;
        }

        .ml-crisis strong {
          color: var(--glp-deep-teal, #2f5d5d);
        }

        @media (prefers-reduced-motion: reduce) {
          .meet-lumi *,
          .meet-lumi *::before,
          .meet-lumi *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <section className="ml-wrap" aria-labelledby="lumi-title">
        <p className="ml-eyebrow">
          MyMentalHealthBuddy • The Genuine Love Project
        </p>

        <h1 className="ml-h1" id="lumi-title">
          Meet Lumi, one gentle companion that can show up in different ways
        </h1>

        <p className="ml-lead">
          Lumi is one consistent supportive identity across MyMentalHealthBuddy.
          Different visual states help communicate what kind of support is being
          offered in the moment — such as calm, reflection, grounding, emotional
          awareness, warmth, or a next step.
        </p>

        <p className="ml-identity" data-testid="text-lumi-identity-rule">
          One Lumi identity • Multiple purposeful states
        </p>

        <div className="ml-stage" aria-label="Lumi visual states">
          <LumiCarousel size={240} />
        </div>

        <div className="ml-actions" aria-label="Lumi next steps">
          <Button href="/start" variant="primary" size="lg">
            Start with Lumi
          </Button>
          <Button href="/chat" variant="secondary" size="lg">
            Talk with Lumi
          </Button>
          <Button href="/tools" variant="ghost" size="lg">
            Explore Tools
          </Button>
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="how-lumi-helps">
        <h2 className="ml-heading" id="how-lumi-helps">
          How Lumi can help
        </h2>

        <p className="ml-subheading">
          Lumi is designed to reduce friction between noticing a need and finding
          an appropriate next step. You remain in control of what you choose to do.
        </p>

        <div className="ml-three-grid">
          {HELP_MODES.map((item) => (
            <article className="ml-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="lumi-states">
        <h2 className="ml-heading" id="lumi-states">
          Meet Lumi&apos;s supportive states
        </h2>

        <p className="ml-subheading">
          These are not separate characters. They are approved visual states of
          the same Lumi identity, each connected to a defined emotional role.
        </p>

        <div className="ml-state-grid">
          {SHOWCASE_ORDER.map((id) => {
            const variant = OFFICIAL_LUMI_REGISTRY[id];

            if (!variant) return null;

            return (
              <article
                className="ml-card ml-state-card"
                key={id}
                data-testid={`card-lumi-${id.toLowerCase()}`}
              >
                <img
                  className="ml-state-img"
                  src={variant.src}
                  alt={variant.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />

                <h3>{variant.name}</h3>
                <p className="ml-role">{variant.emotionalRole}</p>
                <p>{variant.description}.</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="why-lumi-changes">
        <h2 className="ml-heading" id="why-lumi-changes">
          Why Lumi looks different sometimes
        </h2>

        <p className="ml-subheading">
          The platform uses visual context intentionally. A grounding exercise
          should not communicate the same emotional energy as a journal reflection
          or a gentle next-step prompt.
        </p>

        <div className="ml-callout">
          <p>
            <strong>The governing rule is simple:</strong> Lumi&apos;s appearance
            may adapt to the purpose of the experience, but Lumi&apos;s identity,
            safety boundaries, and supportive role remain consistent.
          </p>
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="try-lumi">
        <h2 className="ml-heading" id="try-lumi">
          Choose what would help right now
        </h2>

        <p className="ml-subheading">
          There is no required path. Start with a guided orientation, open a
          conversation, or go directly to a practical tool.
        </p>

        <div className="ml-actions">
          <Button href="/start" variant="primary" size="lg">
            Help Me Find a Starting Point
          </Button>
          <Button href="/chat" variant="secondary" size="lg">
            Open AI Chat
          </Button>
          <Button href="/learn" variant="ghost" size="lg">
            Explore Learning
          </Button>
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="trust-control">
        <h2 className="ml-heading" id="trust-control">
          Trust, control, and clear boundaries
        </h2>

        <p className="ml-subheading">
          Support should be understandable and voluntary. Lumi should help you
          navigate the platform without pretending to know more about you than the
          available information supports.
        </p>

        <div className="ml-trust-grid">
          <article className="ml-card">
            <h3>You stay in control</h3>
            <ul className="ml-trust-list">
              <li>You decide what to explore and what to skip.</li>
              <li>You can leave an exercise or conversation at any time.</li>
              <li>You do not have to use Lumi to access platform resources.</li>
            </ul>
          </article>

          <article className="ml-card">
            <h3>Wellness support, not diagnosis</h3>
            <ul className="ml-trust-list">
              <li>Lumi does not diagnose medical or mental-health conditions.</li>
              <li>Lumi does not prescribe medication or replace professional care.</li>
              <li>AI-supported experiences can make mistakes and should be used with judgment.</li>
            </ul>
          </article>

          <article className="ml-card">
            <h3>Know how the platform works</h3>
            <p>
              Review the{" "}
              <Link href="/privacy" className="ml-link">
                Privacy
              </Link>{" "}
              and{" "}
              <Link href="/ai-transparency" className="ml-link">
                AI Transparency
              </Link>{" "}
              pages for more information about data practices and AI-supported
              features.
            </p>
          </article>
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="lumi-faq">
        <h2 className="ml-heading" id="lumi-faq">
          Lumi FAQ
        </h2>

        <div className="ml-faq">
          {FAQ.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ml-wrap ml-section" aria-labelledby="lumi-next-step">
        <h2 className="ml-heading" id="lumi-next-step">
          Choose your next step
        </h2>

        <p className="ml-subheading">
          If you are not sure where to begin, start with the guided orientation.
          It is designed to help you find a useful first step without requiring
          you to understand the whole platform first.
        </p>

        <div className="ml-actions">
          <Button href="/start" variant="primary" size="lg">
            Start Here
          </Button>
          <Button href="/journal" variant="secondary" size="lg">
            Open Journal
          </Button>
          <Button href="/tools" variant="ghost" size="lg">
            Browse Tools
          </Button>
        </div>

        <p className="ml-crisis" data-testid="text-crisis-support">
          <strong>Need immediate crisis support?</strong>{" "}
          Call or text <a className="ml-link" href="tel:988">988</a>, or{" "}
          <Link href="/crisis" className="ml-link">
            open Crisis Support
          </Link>.
          {" "}If there is immediate danger, call 911.
        </p>
      </section>
    </main>
  );
}
