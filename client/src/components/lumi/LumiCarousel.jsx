import React, { useState, useEffect, useCallback } from "react";
import { OfficialLumi } from "../../lumi-registry/components/OfficialLumi";
import { OFFICIAL_LUMI_REGISTRY } from "../../lumi-registry/registry/officialLumiRegistry";

/**
 * LumiCarousel — rotating showcase of the canonical Lumi companions.
 *
 * Renders each avatar through the protected `OfficialLumi` component
 * (canonical registry source of truth). All avatars render at an equal
 * square size with transparent backgrounds. Auto-rotation is paused on
 * hover / focus and fully disabled under prefers-reduced-motion.
 *
 * The duplicate floating variant (LUMI_FLOAT_IDLE ≈ LUMI_CALM_FLOAT) is
 * intentionally excluded from the default order so the showcase shows 7
 * distinct companions.
 */

const DEFAULT_ORDER = [
  "LUMI_CALM_FLOAT",
  "LUMI_HEART",
  "LUMI_MEDITATION",
  "LUMI_COMPANION",
  "LUMI_PATH",
  "LUMI_EMOTION_ORB",
  "LUMI_SOFT_PRESENCE",
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export default function LumiCarousel({
  variants = DEFAULT_ORDER,
  size = 220,
  intervalMs = 3800,
  autoRotate = true,
  showCaption = true,
  className = "",
}) {
  const ids = variants.filter((id) => OFFICIAL_LUMI_REGISTRY[id]);
  const count = ids.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (!autoRotate || reduced || paused || count <= 1) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [autoRotate, reduced, paused, count, intervalMs]);

  const active = OFFICIAL_LUMI_REGISTRY[ids[index]] || null;

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  if (count === 0) return null;

  return (
    <div
      className={`lumi-carousel ${className}`.trim()}
      role="group"
      aria-roledescription="carousel"
      aria-label="Meet the Lumi companions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      data-testid="lumi-carousel"
    >
      <style>{`
        .lumi-carousel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1rem, 2.5vw, 1.5rem);
          width: 100%;
        }
        .lumi-carousel .lc-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.5rem, 2.5vw, 1.5rem);
          width: 100%;
        }
        .lumi-carousel .lc-viewport {
          position: relative;
          flex: 0 0 auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }
        .lumi-carousel .lc-viewport::before {
          content: "";
          position: absolute;
          inset: -8%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 45%, var(--lc-glow, rgba(123,164,131,0.18)) 0%, transparent 68%);
          z-index: 0;
          transition: background 600ms ease;
        }
        .lumi-carousel .lc-slide {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          opacity: 0;
          transform: scale(0.94);
          transition: opacity 600ms ease, transform 600ms ease;
          pointer-events: none;
          z-index: 1;
        }
        .lumi-carousel .lc-slide.is-active {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }
        .lumi-carousel .lc-avatar .lumi-official {
          width: 100% !important;
          height: 100% !important;
          display: grid;
          place-items: center;
        }
        .lumi-carousel .lc-avatar .lumi-official img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
          filter: drop-shadow(0 14px 26px rgba(22, 58, 54, 0.16));
        }
        .lumi-carousel .lc-arrow {
          flex: 0 0 auto;
          width: clamp(2.5rem, 6vw, 3rem);
          height: clamp(2.5rem, 6vw, 3rem);
          border-radius: 50%;
          border: 1.5px solid rgba(22, 58, 54, 0.18);
          background: rgba(255, 255, 255, 0.86);
          color: #163A36;
          font-size: 1.6rem;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
          box-shadow: 0 6px 16px rgba(22, 58, 54, 0.08);
        }
        .lumi-carousel .lc-arrow:hover {
          background: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(22, 58, 54, 0.14);
        }
        .lumi-carousel .lc-arrow:focus-visible {
          outline: 3px solid #2F6B4F;
          outline-offset: 3px;
        }
        .lumi-carousel .lc-caption {
          text-align: center;
          min-height: 3.5rem;
        }
        .lumi-carousel .lc-name {
          margin: 0;
          font-size: clamp(1.15rem, 2.4vw, 1.5rem);
          font-weight: 800;
          color: #14332F;
        }
        .lumi-carousel .lc-role {
          margin: 0.35rem 0 0;
          font-size: clamp(0.9rem, 1.7vw, 1.02rem);
          line-height: 1.5;
          color: #2A3F3D;
          max-width: 36ch;
        }
        .lumi-carousel .lc-dots {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.55rem;
        }
        .lumi-carousel .lc-dot {
          width: 1.6rem;
          height: 1.6rem;
          min-width: 24px;
          min-height: 24px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          display: grid;
          place-items: center;
          border-radius: 50%;
          -webkit-tap-highlight-color: transparent;
        }
        .lumi-carousel .lc-dot::before {
          content: "";
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          border: 1.5px solid rgba(22, 58, 54, 0.30);
          background: transparent;
          transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;
        }
        .lumi-carousel .lc-dot:hover::before { transform: scale(1.15); border-color: #2F6B4F; }
        .lumi-carousel .lc-dot.is-active::before {
          background: #7BA483;
          border-color: #2F6B4F;
          transform: scale(1.15);
        }
        .lumi-carousel .lc-dot:focus-visible {
          outline: 3px solid #2F6B4F;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .lumi-carousel .lc-slide,
          .lumi-carousel .lc-viewport::before,
          .lumi-carousel .lc-arrow,
          .lumi-carousel .lc-dot::before { transition: none; }
          .lumi-carousel .lc-slide { transform: none; }
          .lumi-carousel .lc-arrow:hover { transform: none; }
        }
      `}</style>

      <div className="lc-stage">
        <button
          type="button"
          className="lc-arrow lc-arrow-prev"
          onClick={() => go(index - 1)}
          aria-label="Previous Lumi"
          data-testid="button-carousel-prev"
        >
          ‹
        </button>

        <div
          className="lc-viewport"
          style={{
            width: size,
            height: size,
            "--lc-glow": active?.glowColor || "rgba(123,164,131,0.18)",
          }}
        >
          {ids.map((id, i) => (
            <div
              key={id}
              className={`lc-slide ${i === index ? "is-active" : ""}`.trim()}
              aria-hidden={i === index ? undefined : "true"}
            >
              <div className="lc-avatar" style={{ width: size, height: size }}>
                <OfficialLumi
                  variant={id}
                  scene="meet-lumi-gallery"
                  position="hero"
                  widthPx={size}
                  decorative={false}
                  motion={reduced ? "reduced" : "soft"}
                  reducedMotion={reduced}
                  data-testid={`carousel-avatar-${id.toLowerCase()}`}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="lc-arrow lc-arrow-next"
          onClick={() => go(index + 1)}
          aria-label="Next Lumi"
          data-testid="button-carousel-next"
        >
          ›
        </button>
      </div>

      {showCaption && active && (
        <div className="lc-caption" aria-live="polite" data-testid="text-carousel-caption">
          <h3 className="lc-name">{active.name}</h3>
          <p className="lc-role">{active.emotionalRole}</p>
        </div>
      )}

      <div className="lc-dots" role="group" aria-label="Choose a Lumi companion">
        {ids.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-label={`Show ${OFFICIAL_LUMI_REGISTRY[id].name}`}
            aria-current={i === index ? "true" : undefined}
            className={`lc-dot ${i === index ? "is-active" : ""}`.trim()}
            onClick={() => go(i)}
            data-testid={`dot-carousel-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
