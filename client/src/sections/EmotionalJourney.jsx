import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Wind, Heart, Sparkles, Shield, RotateCcw } from 'lucide-react';
import { EMOTIONAL_JOURNEY } from '../data/emotionalJourney.js';

const PHASE_ICONS = {
  CALM: Wind,
  ORIENT: Sparkles,
  CONNECT: Heart,
  SUPPORT: Shield,
  REWARD: Sparkles,
  CONTINUE: RotateCcw,
};

export default function EmotionalJourney() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('revealed');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('revealed');
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="emotional-journey"
      className="emotional-journey-polish relative w-full py-20 md:py-24 px-6"
      style={{ background: 'var(--glp-paper, #F9F7F4)' }}
      data-testid="section-emotional-journey"
      aria-labelledby="emotional-journey-title"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <p
            className="text-xs md:text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#A8C9A0' }}
            data-testid="text-journey-eyebrow"
          >
            Your Gentle Journey
          </p>
          <h2
            id="emotional-journey-title"
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4"
            style={{ color: '#2C3531' }}
            data-testid="text-journey-title"
          >
            A calm path forward
          </h2>
          <p
            className="text-sm md:text-base max-w-md mx-auto"
            style={{ color: '#6B7B6E' }}
            data-testid="text-journey-subline"
          >
            Every step is soft. Every step counts. Lumi walks with you.
          </p>
        </div>

        <div className="relative">
          <span
            aria-hidden="true"
            className="emotional-journey-line"
            style={{
              background: 'linear-gradient(to bottom, #A8C9A033, #74C0FC33, #C8B6FF33, #FFD93D33, #FF9A8B33, #A8C9A033)',
            }}
          />
          <ol className="emotional-journey-list" role="list">
          {EMOTIONAL_JOURNEY.map((phase, index) => {
            const Icon = PHASE_ICONS[phase.phase] || Sparkles;
            return (
              <li
                key={`${phase.phase}-${index}`}
                className="emotional-journey-item"
                style={{ '--journey-delay': `${index * 90}ms` }}
              >
                <Link
                  href={phase.path}
                  className="emotional-journey-card group"
                  data-testid={`link-journey-${phase.phase.toLowerCase()}`}
                  aria-label={`${phase.label}: ${phase.description}`}
                >
                  <span
                    className="emotional-journey-dot"
                    style={{
                      background: `${phase.color}1A`,
                      borderColor: `${phase.color}66`,
                      color: phase.color,
                    }}
                    aria-hidden="true"
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="emotional-journey-text">
                    <span
                      className="emotional-journey-label"
                      style={{ color: phase.color }}
                      data-testid={`text-journey-label-${phase.phase.toLowerCase()}`}
                    >
                      {phase.label}
                    </span>
                    <span
                      className="emotional-journey-description"
                      style={{ color: '#6B7B6E' }}
                    >
                      {phase.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          </ol>
        </div>

        <p className="text-center text-xs mt-12" style={{ color: '#9AA59C' }}>
          If you're in crisis, please visit{' '}
          <Link href="/crisis" className="underline" style={{ color: '#C8B6FF' }} data-testid="link-journey-crisis">
            /crisis
          </Link>{' '}
          for immediate support.
        </p>
      </div>
    </section>
  );
}
