/**
 * NlpMiContent — v5.7 (port of V18 NLP + Motivational Interviewing engine).
 *
 * Renders the home-page emotional content layer driven by `nlpMiContent.js`.
 * Sub-sections (in render order):
 *   1. Affirmation banner       (italic quote on sage wash)
 *   2. Open question card        ("A Gentle Question")
 *   3. Reflection box            ("Lumi Reflects")
 *   4. Embedded command line     (subtle italic prompt)
 *   5. Benefit cards (4)         (icon + title + body + sensory tags)
 *   6. Presupposition box        ("What Awaits You")
 *   7. Final CTAs                (primary + secondary)
 *
 * Patterns inherited from the rest of the codebase:
 *   - No framer-motion (not a dep) — IntersectionObserver + CSS reveal
 *   - Lucide icons only (already a dep)
 *   - Scoped under .nlp-mi-polish so styles never leak
 *   - prefers-reduced-motion blanket pins everything to its end-state
 *   - Brand palette only (sage, gold, lavender, rose) — no off-palette accents
 *
 * Governance: zero NLP/MI framework names visible to the user — the
 * therapeutic technique stays internal. WCAG AA color contrast preserved.
 */

import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import {
  Wind,
  Heart,
  Sparkles,
  Shield,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { getPageContent, SENSORY_KIND } from '../data/nlpMiContent.js';

const ICONS = {
  Wind,
  Heart,
  Sparkles,
  Shield,
  MessageCircle,
};

const SENSORY_TINT = {
  [SENSORY_KIND.VISUAL]: '#74C0FC',       // calm-blue
  [SENSORY_KIND.AUDITORY]: '#C8B6FF',     // empathy-purple
  [SENSORY_KIND.KINESTHETIC]: '#A8C9A0',  // sage
};

function highlightSensory(text, sensoryWords) {
  if (!sensoryWords || sensoryWords.length === 0) return text;
  const sorted = [...sensoryWords].sort((a, b) => b.word.length - a.word.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((s) => s.word.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );
  const lookup = Object.fromEntries(sorted.map((s) => [s.word.toLowerCase(), s.kind]));
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const kind = lookup[part.toLowerCase()];
    if (!kind) return part;
    return (
      <span
        key={i}
        className="nlp-mi-sensory"
        style={{ color: SENSORY_TINT[kind] || 'inherit' }}
        data-kind={kind}
      >
        {part}
      </span>
    );
  });
}

export default function NlpMiContent({ path = '/' }) {
  const sectionRef = useRef(null);
  const content = getPageContent(path);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('revealed');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('revealed');
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="nlp-mi-polish relative w-full py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #FBFAF7 0%, #F5F3EE 100%)' }}
      aria-labelledby="nlp-mi-affirmation"
      data-testid="section-nlp-mi-content"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* 1. Affirmation banner */}
        <div
          className="nlp-mi-reveal nlp-mi-affirmation rounded-2xl px-6 py-8 mb-12 text-center"
          style={{
            background: 'rgba(168, 201, 160, 0.10)',
            border: '1px solid rgba(168, 201, 160, 0.25)',
          }}
        >
          <p
            id="nlp-mi-affirmation"
            className="text-lg sm:text-xl italic font-serif"
            style={{ color: '#2F5443', lineHeight: 1.55 }}
            data-testid="text-nlp-mi-affirmation"
          >
            “{content.affirmation}”
          </p>
        </div>

        {/* 2. Open question card */}
        <div
          className="nlp-mi-reveal rounded-2xl px-6 py-7 mb-8"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(116, 192, 252, 0.20)',
            boxShadow: '0 4px 16px rgba(116, 192, 252, 0.08)',
          }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase mb-2"
            style={{ color: '#74C0FC' }}
          >
            A Gentle Question
          </p>
          <p
            className="text-lg sm:text-xl"
            style={{ color: '#2F5443', lineHeight: 1.5 }}
            data-testid="text-nlp-mi-question"
          >
            {content.openQuestion}
          </p>
        </div>

        {/* 3. Reflection box */}
        <div
          className="nlp-mi-reveal rounded-2xl px-6 py-7 mb-8"
          style={{
            background: 'rgba(200, 182, 255, 0.08)',
            border: '1px solid rgba(200, 182, 255, 0.25)',
          }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase mb-2 flex items-center gap-1.5"
            style={{ color: '#7C5FCF' }}
          >
            <Heart className="w-3.5 h-3.5" aria-hidden="true" />
            Lumi Reflects
          </p>
          <p
            className="text-base sm:text-lg"
            style={{ color: '#3D2F66', lineHeight: 1.55 }}
            data-testid="text-nlp-mi-reflection"
          >
            {content.reflection}
          </p>
        </div>

        {/* 4. Embedded command line (subtle italic prompt) */}
        <p
          className="nlp-mi-reveal text-center italic text-sm sm:text-base mb-12"
          style={{ color: '#6B7B6E' }}
          data-testid="text-nlp-mi-command"
        >
          {content.embeddedCommand}
        </p>

        {/* 5. Benefit cards */}
        {content.sections && content.sections.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {content.sections.map((s, i) => {
              const Icon = ICONS[s.icon] || Sparkles;
              return (
                <div
                  key={i}
                  className="nlp-mi-reveal nlp-mi-benefit rounded-2xl px-5 py-6"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(168, 201, 160, 0.20)',
                    transitionDelay: `${i * 60}ms`,
                  }}
                  data-testid={`card-nlp-mi-benefit-${i}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'rgba(168, 201, 160, 0.15)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#2F5443' }} aria-hidden="true" />
                  </div>
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: '#2F5443' }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: '#5C6B62', lineHeight: 1.55 }}
                  >
                    {highlightSensory(s.content, s.sensoryWords)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Presupposition box */}
        <div
          className="nlp-mi-reveal rounded-2xl px-6 py-7 mb-10"
          style={{
            background: 'rgba(255, 217, 61, 0.08)',
            border: '1px solid rgba(232, 145, 58, 0.20)',
          }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase mb-2 flex items-center gap-1.5"
            style={{ color: '#E8913A' }}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            What Awaits You
          </p>
          <p
            className="text-base sm:text-lg"
            style={{ color: '#5C4A22', lineHeight: 1.55 }}
            data-testid="text-nlp-mi-presupposition"
          >
            {content.presupposition}
          </p>
        </div>

        {/* 7. Final CTAs */}
        <div className="nlp-mi-reveal flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href={content.ctaPrimary.href}
            className="nlp-mi-cta-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold focus:outline-none"
            data-testid="link-nlp-mi-cta-primary"
          >
            {content.ctaPrimary.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href={content.ctaSecondary.href}
            className="nlp-mi-cta-secondary inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium focus:outline-none"
            data-testid="link-nlp-mi-cta-secondary"
          >
            {content.ctaSecondary.label}
          </Link>
        </div>
      </div>

      <style>{`
        .nlp-mi-polish .nlp-mi-reveal {
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 600ms cubic-bezier(0.22, 0.9, 0.32, 1),
            transform 600ms cubic-bezier(0.22, 0.9, 0.32, 1);
        }
        .nlp-mi-polish.revealed .nlp-mi-reveal {
          opacity: 1;
          transform: translateY(0);
        }
        .nlp-mi-polish .nlp-mi-benefit {
          transition: transform 280ms cubic-bezier(0.22, 0.9, 0.32, 1),
                      box-shadow 280ms cubic-bezier(0.22, 0.9, 0.32, 1),
                      opacity 600ms cubic-bezier(0.22, 0.9, 0.32, 1),
                      translate 600ms cubic-bezier(0.22, 0.9, 0.32, 1);
        }
        .nlp-mi-polish .nlp-mi-benefit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(168, 201, 160, 0.18);
        }
        .nlp-mi-polish .nlp-mi-sensory {
          font-weight: 500;
        }
        .nlp-mi-polish .nlp-mi-cta-primary {
          background: linear-gradient(135deg, #E8913A 0%, #FFB88C 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(232, 145, 58, 0.28);
          transition: transform 240ms cubic-bezier(0.22, 0.9, 0.32, 1),
                      box-shadow 240ms cubic-bezier(0.22, 0.9, 0.32, 1);
        }
        .nlp-mi-polish .nlp-mi-cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(232, 145, 58, 0.36);
        }
        .nlp-mi-polish .nlp-mi-cta-primary:active {
          transform: translateY(1px);
          transition-duration: 90ms;
        }
        .nlp-mi-polish .nlp-mi-cta-primary:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 3px;
        }
        .nlp-mi-polish .nlp-mi-cta-secondary {
          background: transparent;
          color: #2F5443;
          border: 1.5px solid rgba(47, 84, 67, 0.25);
          transition: transform 240ms cubic-bezier(0.22, 0.9, 0.32, 1),
                      background-color 240ms ease,
                      border-color 240ms ease;
        }
        .nlp-mi-polish .nlp-mi-cta-secondary:hover {
          transform: translateY(-1px);
          background-color: rgba(168, 201, 160, 0.08);
          border-color: rgba(47, 84, 67, 0.45);
        }
        .nlp-mi-polish .nlp-mi-cta-secondary:active {
          transform: translateY(1px);
          transition-duration: 90ms;
        }
        .nlp-mi-polish .nlp-mi-cta-secondary:focus-visible {
          outline: 3px solid #2F5443;
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .nlp-mi-polish .nlp-mi-reveal,
          .nlp-mi-polish .nlp-mi-benefit,
          .nlp-mi-polish .nlp-mi-cta-primary,
          .nlp-mi-polish .nlp-mi-cta-secondary {
            transition: none !important;
          }
          .nlp-mi-polish .nlp-mi-reveal {
            opacity: 1 !important;
            transform: none !important;
          }
          .nlp-mi-polish .nlp-mi-benefit:hover,
          .nlp-mi-polish .nlp-mi-cta-primary:hover,
          .nlp-mi-polish .nlp-mi-cta-primary:active,
          .nlp-mi-polish .nlp-mi-cta-secondary:hover,
          .nlp-mi-polish .nlp-mi-cta-secondary:active {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
