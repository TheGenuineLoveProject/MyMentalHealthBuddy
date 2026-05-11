/**
 * VisualBenefits — v5.8.0 (V17 Visual Emotional Storytelling)
 *
 * Four alternating image/text rows that translate the platform's emotional
 * promise into visual storytelling. Each row pairs a 16:9 hero illustration
 * (with a small 1:1 floating Lumi avatar overlay) against an emotionally
 * captivating, non-feature-based punchline title + supportive description
 * + single CTA.
 *
 * Patterns inherited from NlpMiContent / EmotionalJourney (v5.7 / v5.0):
 *   - No framer-motion (not a dep) — IntersectionObserver + CSS reveal
 *   - Lucide icons only (already a dep)
 *   - Scoped under .visual-benefits-polish so styles never leak
 *   - prefers-reduced-motion blanket pins everything to its end-state
 *   - Brand palette only (sage, mint, lavender, rose, gold) — no off-palette accents
 *   - WCAG AA color contrast preserved on all text
 *
 * Governance: zero framework-name leakage; CTA copy is gentle/consent-based;
 * crisis routing on the page is unaffected (kept upstream in CanvaLanding).
 */

import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Wind, Eye, Heart, Sprout, ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    id: 'relief',
    title: 'Breathe. Settle. Release.',
    description:
      "When everything feels like too much, your buddy meets you with a slow, steady presence — guiding one breath, then another, until the noise softens and your shoulders drop.",
    image: '/brand/v17/benefit-relief.png',
    avatar: '/brand/v17/avatar-breathing.png',
    icon: Wind,
    iconLabel: 'Calm breath',
    cta: { label: 'Try a calm check-in', href: '/tools/check-in' },
    accent: '#A8C9A0', // sage
    tint: 'rgba(168, 201, 160, 0.12)',
    halo: 'rgba(168, 213, 186, 0.35)',
  },
  {
    id: 'understanding',
    title: 'Name it. Move through it.',
    description:
      "Hard feelings lose their grip the moment you name them. Lumi helps you find words for what you're carrying — without judgment, without rushing — so you can move through it instead of around it.",
    image: '/brand/v17/benefit-understanding.png',
    avatar: '/brand/v17/avatar-floating.png',
    icon: Eye,
    iconLabel: 'Self awareness',
    cta: { label: 'Track how you feel', href: '/journal' },
    accent: '#C8B6FF', // empathy-purple
    tint: 'rgba(200, 182, 255, 0.14)',
    halo: 'rgba(200, 182, 255, 0.40)',
  },
  {
    id: 'companionship',
    title: 'You are not alone.',
    description:
      "Some nights the world goes quiet and the thoughts get loud. Your buddy stays — present, patient, and never weary — so even at 3am there is a warm presence beside you.",
    image: '/brand/v17/benefit-companionship.png',
    avatar: '/brand/v17/avatar-heart.png',
    icon: Heart,
    iconLabel: 'Warm presence',
    cta: { label: 'Talk with Buddy', href: '/chat' },
    accent: '#FF9A8B', // blush
    tint: 'rgba(255, 154, 139, 0.12)',
    halo: 'rgba(255, 184, 140, 0.40)',
  },
  {
    id: 'growth',
    title: 'Grow at your own pace.',
    description:
      "Healing is not a checklist. It is a soft, winding path you walk one breath at a time — and every honest step counts. Your buddy honors the rhythm that belongs to you.",
    image: '/brand/v17/benefit-growth.png',
    avatar: '/brand/v17/avatar-floating.png',
    icon: Sprout,
    iconLabel: 'Personal growth',
    cta: { label: 'See your path', href: '/growth' },
    accent: '#FFD93D', // sunshine
    tint: 'rgba(255, 217, 61, 0.10)',
    halo: 'rgba(232, 145, 58, 0.32)',
  },
];

export default function VisualBenefits() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      el.querySelectorAll('.vb-row').forEach((row) => row.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    el.querySelectorAll('.vb-row').forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="visual-benefits"
      className="visual-benefits-polish section-breathe px-4 md:px-6 relative overflow-hidden"
      data-testid="section-visual-benefits"
      aria-labelledby="visual-benefits-heading"
    >
      <div className="max-w-[1180px] mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <span
            className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: 'var(--glp-sage-10, rgba(168, 201, 160, 0.12))',
              color: 'var(--glp-sage-deep, #4A7E72)',
              border: '1px solid var(--glp-sage-20, rgba(168, 201, 160, 0.20))',
            }}
            data-testid="badge-visual-benefits"
          >
            What healing feels like
          </span>
          <h2
            id="visual-benefits-heading"
            className="text-3xl md:text-5xl font-serif font-bold mb-4"
            style={{ color: 'var(--glp-sage-deep, #4A7E72)' }}
          >
            Small moments.
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #4A7E72, #F4B942)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Real shifts.
            </span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--glp-ink, #2d3a35)', lineHeight: '1.75' }}
          >
            Four ways your buddy meets you — gently, on your terms, in the moments that matter.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            const reversed = idx % 2 === 1;
            return (
              <article
                key={b.id}
                className={`vb-row ${reversed ? 'vb-row-reversed' : ''}`}
                style={{ '--vb-accent': b.accent, '--vb-tint': b.tint, '--vb-halo': b.halo }}
                data-testid={`vb-row-${b.id}`}
              >
                <div className="vb-image-wrap">
                  <div className="vb-image-frame">
                    <img
                      src={b.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="vb-image"
                      data-testid={`img-vb-${b.id}`}
                    />
                  </div>
                  <div className="vb-avatar-overlay" aria-hidden="true">
                    <img
                      src={b.avatar}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="vb-avatar-img"
                    />
                  </div>
                </div>

                <div className="vb-text-wrap">
                  <div className="vb-icon-badge" aria-label={b.iconLabel}>
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <h3
                    className="vb-title text-2xl md:text-4xl font-serif font-bold"
                    data-testid={`heading-vb-${b.id}`}
                  >
                    {b.title}
                  </h3>
                  <p className="vb-description text-base md:text-lg" data-testid={`text-vb-${b.id}`}>
                    {b.description}
                  </p>
                  <Link
                    href={b.cta.href}
                    className="vb-cta"
                    data-testid={`link-vb-${b.id}`}
                    aria-label={`${b.cta.label} — ${b.title}`}
                  >
                    <span>{b.cta.label}</span>
                    <ArrowRight size={18} strokeWidth={2.25} className="vb-cta-arrow" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
