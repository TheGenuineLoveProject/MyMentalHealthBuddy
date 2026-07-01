import React from "react";
import { Link } from "wouter";
import LumiCarousel from "../components/lumi/LumiCarousel.jsx";
import NlpMiContent from "../sections/NlpMiContent.jsx";
import VisualBenefits from "../sections/VisualBenefits.jsx";

const FEATURES = [
  ["Emotional Clarity", "Understand what you feel and what your emotions may be signaling."],
  ["Self-Awareness", "Recognize patterns, values, needs, and identity growth opportunities."],
  ["Nervous-System Calm", "Use gentle grounding and reflection tools for steadier daily regulation."],
  ["Authentic Growth", "Build self-trust, compassion, purpose, and aligned next steps."],
];

export default function CanvaLanding() {
  return (
    <main className="canva-landing">
      <style>{`
        .canva-landing {
          min-height: 100vh;
          background:
            radial-gradient(120% 90% at 8% -10%, rgba(255, 217, 61, 0.10) 0%, transparent 45%),
            radial-gradient(120% 100% at 100% 0%, rgba(123, 164, 131, 0.18) 0%, transparent 50%),
            linear-gradient(160deg, #F6F1E8 0%, #F8F8F4 55%, rgba(123, 164, 131, 0.12) 100%);
          color: #163A36;
        }
        .cl-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: clamp(3.25rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem);
        }
        .cl-eyebrow {
          margin: 0;
          font-size: clamp(0.7rem, 1.4vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #2F6B4F;
        }
        .cl-h1 {
          margin: clamp(1rem, 2.5vw, 1.5rem) 0 0;
          max-width: 18ch;
          font-size: clamp(2.25rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.015em;
          color: #14332F;
        }
        .cl-lead {
          margin: clamp(1rem, 2.5vw, 1.5rem) 0 0;
          max-width: 60ch;
          font-size: clamp(1.05rem, 2.1vw, 1.3rem);
          line-height: 1.6;
          color: #2A3F3D;
        }
        .cl-actions {
          margin-top: clamp(1.75rem, 4vw, 2.75rem);
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
        }
        .cl-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.95rem 1.6rem;
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          font-weight: 700;
          text-decoration: none;
          line-height: 1;
          border: 1.5px solid transparent;
          transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
          will-change: transform;
        }
        .cl-pill-solid {
          background: #163A36;
          color: #FFFFFF;
          box-shadow: 0 10px 24px rgba(22, 58, 54, 0.22);
        }
        .cl-pill-solid:hover { background: #0F2A27; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(22, 58, 54, 0.28); }
        .cl-pill-soft {
          background: rgba(255, 255, 255, 0.78);
          color: #163A36;
          border-color: rgba(22, 58, 54, 0.18);
        }
        .cl-pill-soft:hover { background: #FFFFFF; transform: translateY(-2px); box-shadow: 0 10px 22px rgba(22, 58, 54, 0.12); }
        .cl-pill:focus-visible { outline: 3px solid #2F6B4F; outline-offset: 3px; }
        .cl-grid {
          margin-top: clamp(2.5rem, 6vw, 4rem);
          display: grid;
          gap: clamp(1rem, 2.5vw, 1.5rem);
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }
        .cl-card {
          border-radius: 1.5rem;
          border: 1px solid rgba(22, 58, 54, 0.10);
          background: rgba(255, 255, 255, 0.72);
          padding: clamp(1.4rem, 3vw, 1.85rem);
          box-shadow: 0 18px 40px rgba(22, 58, 54, 0.06);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .cl-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(22, 58, 54, 0.12); }
        .cl-card-rule {
          width: 2.25rem;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #A8C9A0, #7BA483);
          margin-bottom: 1rem;
        }
        .cl-card h2 { margin: 0; font-size: clamp(1.1rem, 2vw, 1.3rem); font-weight: 800; color: #14332F; }
        .cl-card p { margin: 0.6rem 0 0; line-height: 1.6; color: #2A3F3D; }
        .cl-note {
          margin-top: clamp(1.5rem, 3vw, 2.25rem);
          border-radius: 1.5rem;
          border: 1px solid rgba(22, 58, 54, 0.10);
          background: rgba(255, 255, 255, 0.78);
          padding: clamp(1.6rem, 3.5vw, 2.25rem);
          box-shadow: 0 18px 40px rgba(22, 58, 54, 0.06);
        }
        .cl-note h2 { margin: 0; font-size: clamp(1.25rem, 2.4vw, 1.6rem); font-weight: 800; color: #14332F; }
        .cl-note p { margin: 0.7rem 0 0; line-height: 1.65; color: #2A3F3D; max-width: 70ch; }
        .cl-lumi {
          margin-top: clamp(2.5rem, 6vw, 4rem);
          border-radius: 1.75rem;
          border: 0;
          background: transparent;
          padding: clamp(1.25rem, 4vw, 2rem) 0;
          box-shadow: none;
          text-align: center;
        }
        .cl-lumi h2 {
          margin: 0 auto;
          max-width: 22ch;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          color: #14332F;
        }
        .cl-lumi p {
          margin: 0.7rem auto 0;
          max-width: 56ch;
          line-height: 1.6;
          color: #2A3F3D;
          font-size: clamp(1rem, 1.9vw, 1.12rem);
        }
        .cl-lumi-carousel { margin-top: clamp(1.75rem, 4vw, 2.5rem); }
        .cl-lumi-link {
          margin-top: clamp(1.5rem, 3.5vw, 2rem);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 999px;
          padding: 0.85rem 1.5rem;
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          font-weight: 700;
          text-decoration: none;
          line-height: 1;
          background: #163A36;
          color: #FFFFFF;
          box-shadow: 0 10px 24px rgba(22, 58, 54, 0.22);
          transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
        }
        .cl-lumi-link:hover { background: #0F2A27; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(22, 58, 54, 0.28); }
        .cl-lumi-link:focus-visible { outline: 3px solid #2F6B4F; outline-offset: 3px; }
        .cl-crisis {
          margin-top: clamp(1.5rem, 3vw, 2rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem 0.75rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(232, 145, 58, 0.30);
          background: rgba(255, 184, 140, 0.12);
          padding: clamp(0.9rem, 2.5vw, 1.15rem) clamp(1.1rem, 3vw, 1.5rem);
          font-size: clamp(0.95rem, 1.8vw, 1.05rem);
          color: #5A3415;
          line-height: 1.5;
        }
        .cl-crisis strong { color: #14332F; }
        .cl-crisis a {
          color: #14332F;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          border-radius: 6px;
        }
        .cl-crisis a:focus-visible { outline: 3px solid #2F6B4F; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .cl-pill, .cl-card { transition: none; }
          .cl-pill:hover, .cl-card:hover { transform: none; }
        }
      `}</style>

      <section className="cl-wrap">
        <p className="cl-eyebrow">MyMentalHealthBuddy • The Genuine Love Project</p>

        <h1 className="cl-h1">Understand yourself. Calm your nervous system. Grow with genuine love.</h1>

        <p className="cl-lead">
          A provider-informed wellness and self-reflection platform helping people build emotional clarity,
          self-awareness, compassion, authenticity, and practical daily growth.
        </p>

        <div className="cl-actions">
          <Link to="/challenge" className="cl-pill cl-pill-solid" data-testid="link-start-reset">
            Start the 7-Day Reset
          </Link>
          <Link to="/pricing" className="cl-pill cl-pill-soft" data-testid="link-view-pricing">
            View Pricing
          </Link>
          <Link to="/tools" className="cl-pill cl-pill-soft" data-testid="link-explore-tools">
            Explore Tools
          </Link>
        </div>

        <div className="cl-grid">
          {FEATURES.map(([title, body]) => (
            <article key={title} className="cl-card" data-testid={`card-feature-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <div className="cl-card-rule" aria-hidden="true" />
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <NlpMiContent path="/" />
      <VisualBenefits />

      <section className="cl-wrap" style={{ paddingTop: 0 }}>
        <section className="cl-lumi" aria-labelledby="meet-lumi-heading">
          <h2 id="meet-lumi-heading">Meet Lumi, your gentle companion</h2>
          <p>
            Lumi adapts to what you need — a calm presence, a grounding breath, a reassuring heart.
            Here are a few of the ways Lumi shows up alongside your reflection.
          </p>
          <div className="cl-lumi-carousel">
            <LumiCarousel size={180} intervalMs={4200} />
          </div>
          <Link to="/meet-lumi" className="cl-lumi-link" data-testid="link-meet-lumi">
            Meet all 7 Lumi →
          </Link>
        </section>

        <section className="cl-note">
          <h2>Safe, ethical, provider-informed wellness</h2>
          <p>
            This platform supports education, reflection, and personal growth. It does not diagnose, treat, or
            prescribe. It is designed to support reflection alongside appropriate professional care, and is not
            a substitute for emergency services.
          </p>
        </section>

        <p className="cl-crisis" data-testid="text-crisis-support">
          <strong>In crisis or thinking about harming yourself?</strong> You're not alone — call or text{" "}
          <a href="tel:988" data-testid="link-call-988">988</a>, text <strong>HOME to 741741</strong>, or{" "}
          <Link to="/crisis" data-testid="link-crisis">get immediate support</Link>. If you're in danger now, call 911.
        </p>
      </section>
    </main>
  );
}
