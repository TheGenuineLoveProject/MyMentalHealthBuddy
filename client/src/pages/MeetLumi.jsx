import React, { useEffect } from "react";
import { Link } from "wouter";
import LumiCarousel from "../components/lumi/LumiCarousel.jsx";
import { OFFICIAL_LUMI_REGISTRY } from "../lumi-registry/registry/officialLumiRegistry";

const SHOWCASE_ORDER = [
  "LUMI_CALM_FLOAT",
  "LUMI_HEART",
  "LUMI_MEDITATION",
  "LUMI_COMPANION",
  "LUMI_PATH",
  "LUMI_EMOTION_ORB",
  "LUMI_SOFT_PRESENCE",
];

export default function MeetLumi() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Meet Lumi — Your Gentle Companions | MyMentalHealthBuddy";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="meet-lumi">
      <style>{`
        .meet-lumi {
          min-height: 100vh;
          background:
            radial-gradient(120% 90% at 8% -10%, rgba(255, 217, 61, 0.10) 0%, transparent 45%),
            radial-gradient(120% 100% at 100% 0%, rgba(123, 164, 131, 0.18) 0%, transparent 50%),
            linear-gradient(160deg, #F6F1E8 0%, #F8F8F4 55%, rgba(123, 164, 131, 0.12) 100%);
          color: #163A36;
        }
        .ml-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: clamp(3.25rem, 8vw, 6rem) clamp(1.25rem, 5vw, 3rem);
        }
        .ml-eyebrow {
          margin: 0;
          font-size: clamp(0.7rem, 1.4vw, 0.8rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #2F6B4F;
          text-align: center;
        }
        .ml-h1 {
          margin: clamp(0.85rem, 2vw, 1.25rem) auto 0;
          max-width: 20ch;
          font-size: clamp(2rem, 5.5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -0.015em;
          color: #14332F;
          text-align: center;
        }
        .ml-lead {
          margin: clamp(0.9rem, 2vw, 1.25rem) auto 0;
          max-width: 60ch;
          font-size: clamp(1.02rem, 2vw, 1.22rem);
          line-height: 1.6;
          color: #2A3F3D;
          text-align: center;
        }
        .ml-stage {
          margin-top: clamp(2rem, 5vw, 3.25rem);
        }
        .ml-grid {
          margin-top: clamp(2.5rem, 6vw, 4rem);
          display: grid;
          gap: clamp(1rem, 2.5vw, 1.5rem);
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        .ml-card {
          border-radius: 1.5rem;
          border: 1px solid rgba(22, 58, 54, 0.10);
          background: rgba(255, 255, 255, 0.74);
          padding: clamp(1.4rem, 3vw, 1.85rem);
          box-shadow: 0 18px 40px rgba(22, 58, 54, 0.06);
          text-align: center;
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .ml-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(22, 58, 54, 0.12); }
        .ml-card-img {
          width: clamp(108px, 22vw, 132px);
          height: clamp(108px, 22vw, 132px);
          margin: 0 auto 0.85rem;
          object-fit: contain;
          filter: drop-shadow(0 10px 18px rgba(22, 58, 54, 0.14));
        }
        .ml-card h2 { margin: 0; font-size: clamp(1.05rem, 2vw, 1.25rem); font-weight: 800; color: #14332F; }
        .ml-card .ml-role { margin: 0.4rem 0 0; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.02em; color: #2F6B4F; }
        .ml-card p { margin: 0.6rem 0 0; line-height: 1.6; color: #2A3F3D; font-size: 0.98rem; }
        .ml-actions {
          margin-top: clamp(2.5rem, 6vw, 3.5rem);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.85rem;
        }
        .ml-pill {
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
        }
        .ml-pill-solid { background: #163A36; color: #FFFFFF; box-shadow: 0 10px 24px rgba(22, 58, 54, 0.22); }
        .ml-pill-solid:hover { background: #0F2A27; transform: translateY(-2px); box-shadow: 0 14px 30px rgba(22, 58, 54, 0.28); }
        .ml-pill-soft { background: rgba(255, 255, 255, 0.78); color: #163A36; border-color: rgba(22, 58, 54, 0.18); }
        .ml-pill-soft:hover { background: #FFFFFF; transform: translateY(-2px); box-shadow: 0 10px 22px rgba(22, 58, 54, 0.12); }
        .ml-pill:focus-visible { outline: 3px solid #2F6B4F; outline-offset: 3px; }
        .ml-crisis {
          margin-top: clamp(1.75rem, 4vw, 2.5rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.4rem 0.75rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(232, 145, 58, 0.30);
          background: rgba(255, 184, 140, 0.12);
          padding: clamp(0.9rem, 2.5vw, 1.15rem) clamp(1.1rem, 3vw, 1.5rem);
          font-size: clamp(0.95rem, 1.8vw, 1.05rem);
          color: #5A3415;
          line-height: 1.5;
          text-align: center;
        }
        .ml-crisis strong { color: #14332F; }
        .ml-crisis a { color: #14332F; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; border-radius: 6px; }
        .ml-crisis a:focus-visible { outline: 3px solid #2F6B4F; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .ml-pill, .ml-card { transition: none; }
          .ml-pill:hover, .ml-card:hover { transform: none; }
        }
      `}</style>

      <section className="ml-wrap">
        <p className="ml-eyebrow">MyMentalHealthBuddy • The Genuine Love Project</p>
        <h1 className="ml-h1">Meet Lumi, your gentle companions</h1>
        <p className="ml-lead">
          Lumi shows up in different ways depending on what you need — a calm presence, a
          grounding breath, a reassuring heart. Each one is here to support your reflection,
          never to rush or judge it.
        </p>

        <div className="ml-stage">
          <LumiCarousel size={240} />
        </div>

        <div className="ml-grid">
          {SHOWCASE_ORDER.map((id) => {
            const v = OFFICIAL_LUMI_REGISTRY[id];
            if (!v) return null;
            return (
              <article key={id} className="ml-card" data-testid={`card-lumi-${id.toLowerCase()}`}>
                <img className="ml-card-img" src={v.src} alt={v.alt} loading="lazy" decoding="async" draggable={false} />
                <h2>{v.name}</h2>
                <p className="ml-role">{v.emotionalRole}</p>
                <p>{v.description}.</p>
              </article>
            );
          })}
        </div>

        <div className="ml-actions">
          <Link to="/challenge" className="ml-pill ml-pill-solid" data-testid="link-start-reset">
            Start the 7-Day Reset
          </Link>
          <Link to="/tools" className="ml-pill ml-pill-soft" data-testid="link-explore-tools">
            Explore Tools
          </Link>
        </div>

        <p className="ml-crisis" data-testid="text-crisis-support">
          <strong>In crisis or thinking about harming yourself?</strong> You're not alone — call or text{" "}
          <a href="tel:988" data-testid="link-call-988">988</a>, text <strong>HOME to 741741</strong>, or{" "}
          <Link to="/crisis" data-testid="link-crisis">get immediate support</Link>. If you're in danger now, call 911.
        </p>
      </section>
    </main>
  );
}
