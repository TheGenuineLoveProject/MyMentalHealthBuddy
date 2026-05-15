/**
 * VisualBenefits — v5.8.1 (V17 Visual Emotional Storytelling, spec-aligned)
 *
 * Four alternating image/text rows that translate the platform's emotional
 * promise into visual storytelling. Each row pairs a 16:9 hero illustration
 * (with a small 1:1 floating Lumi avatar overlay) against an emotionally
 * captivating, non-feature-based punchline title + sensory-rich description
 * + sensory-word tag pills + single CTA.
 *
 * v5.8.1 changes vs v5.8.0:
 *   - <picture> element with WebP source (98KB total vs 9MB PNG-only)
 *   - CTA copy + hrefs aligned to V17 spec ("Breathe With Lumi" → /tools/breathing,
 *     "Check In Gently" → /checkin, "Say Hello to Lumi" → /chat,
 *     "Meet Your Companion" → /chat)
 *   - Section eyebrow + H2 aligned to spec ("What You Will Feel" /
 *     "Emotional support, visually gentle.")
 *   - Descriptions rewritten in sensory-rich, MI-toned language
 *   - Sensory-word pill tags rendered under each description
 *   - Avatar mapping aligned to spec (Companionship + Understanding share
 *     avatar-heart; Growth uses avatar-floating)
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
import { Wind, Heart, Users, Sparkles, ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    id: 'relief',
    title: 'Breathe. Settle. Release.',
    description:
      'When your chest tightens and your mind races, Lumi breathes with you — slow, steady, present — until the tension softens and your shoulders finally drop.',
    // v5.8.18 — user-supplied OFFICIAL avatar set (do NOT regenerate).
    image: '/brand/v17/benefit-relief.png',
    imageWebp: '/brand/v17/benefit-relief.webp',
    // v5.8.71 — avatar overlay swapped to canonical LUMI_MEDITATION
    // (seated meditating Lumi with aura rings) per V25 pose mapping.
    avatar: '/lumi/official/lumi-meditation.png',
    avatarWebp: undefined,
    icon: Wind,
    iconLabel: 'Calm breath',
    cta: { label: 'Breathe With Lumi', href: '/tools/breathing' },
    sensoryWords: ['breathe', 'soften', 'gentle', 'release', 'settle'],
    accent: '#A8C9A0', // sage
    tint: 'rgba(168, 201, 160, 0.12)',
    halo: 'rgba(168, 213, 186, 0.35)',
  },
  {
    id: 'understanding',
    title: 'Name it. Move through it.',
    description:
      'Hard feelings lose their grip the moment you can name them. Lumi helps you find the words — without judgment, without rushing — so clarity has the space it needs to bloom.',
    // v5.8.18 — user-supplied OFFICIAL avatar set (do NOT regenerate).
    image: '/brand/v17/benefit-understanding.png',
    imageWebp: '/brand/v17/benefit-understanding.webp',
    // v5.8.71 — avatar overlay swapped to canonical LUMI_HEART
    // (standing Lumi with glowing heart) per V25 pose mapping.
    avatar: '/lumi/official/lumi-heart.png',
    avatarWebp: undefined,
    icon: Heart,
    iconLabel: 'Self awareness',
    cta: { label: 'Check In Gently', href: '/checkin' },
    sensoryWords: ['name', 'warmth', 'space', 'clarity', 'gentle'],
    accent: '#C8B6FF', // empathy-purple
    tint: 'rgba(200, 182, 255, 0.14)',
    halo: 'rgba(200, 182, 255, 0.40)',
  },
  {
    id: 'companionship',
    title: 'You are not alone.',
    description:
      'At 2 AM when anxiety whispers. When you need to celebrate a quiet win. When you just need someone to sit beside you. Lumi stays — present, patient, and never weary.',
    // v5.8.18 — user-supplied OFFICIAL avatar set (do NOT regenerate).
    // Overlay reuses the official avatar-heart asset (sage hooded body
    // holding glowing heart) supplied in the same drop.
    image: '/brand/v17/benefit-companionship.png',
    imageWebp: '/brand/v17/benefit-companionship.webp',
    // v5.8.71 — avatar overlay swapped to canonical LUMI_COMPANION
    // (seated halo Lumi — registry desc exact match for POSE A Halo Prayer)
    // per V25 pose mapping.
    avatar: '/lumi/official/lumi-companion.png',
    avatarWebp: undefined,
    icon: Users,
    iconLabel: 'Warm presence',
    cta: { label: 'Say Hello to Lumi', href: '/companion' },
    sensoryWords: ['warm', 'quiet', 'here', 'whisper', 'sit'],
    accent: '#FF9A8B', // canonical blush
    tint: 'rgba(255, 154, 139, 0.12)',
    halo: 'rgba(255, 184, 140, 0.40)',
  },
  {
    id: 'growth',
    title: 'Grow at your own pace.',
    description:
      'Emotional wellness is not a race — it is a garden. Lumi walks beside you with infinite patience, honoring the rhythm that belongs to you, one honest step at a time.',
    // v5.8.18 — user-supplied OFFICIAL avatar set (do NOT regenerate).
    image: '/brand/v17/benefit-growth.png',
    imageWebp: '/brand/v17/benefit-growth.webp',
    // v5.8.85 (V25 fix) — LUMI_PATH sprout walking-path now commissioned
    // (IMG_4349 installed v5.8.84). Switched from float-idle substitute to
    // canonical lumi-path. Closes V25 mapping requirement: "Grow at your
    // own pace." section → POSE F (Walking Path #8).
    avatar: '/lumi/official/lumi-path.png',
    avatarWebp: undefined,
    icon: Sparkles,
    iconLabel: 'Personal growth',
    cta: { label: 'Meet Your Companion', href: '/celebration' },
    sensoryWords: ['garden', 'bloom', 'walk', 'grow', 'unfold'],
    accent: '#FFD93D', // canonical sunshine
    tint: 'rgba(255, 217, 61, 0.10)',
    halo: 'rgba(232, 145, 58, 0.32)',
  },
];

/* ─── <picture> with WebP fallback (lazy + async decode) ─── */
function ResponsiveImage({ src, srcWebp, alt, className, style, testId }) {
  return (
    <picture>
      {srcWebp && <source srcSet={srcWebp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading="lazy"
        decoding="async"
        data-testid={testId}
      />
    </picture>
  );
}

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
      el.querySelectorAll('.vb-row, .vb-header').forEach((node) => node.classList.add('revealed'));
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

    el.querySelectorAll('.vb-row, .vb-header').forEach((node) => io.observe(node));
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
        <div className="vb-header text-center mb-12 md:mb-16">
          <span
            className="inline-block text-xs md:text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: 'var(--glp-sage-10, rgba(168, 201, 160, 0.12))',
              color: 'var(--glp-sage-deep, #4A7E72)',
              border: '1px solid var(--glp-sage-20, rgba(168, 201, 160, 0.20))',
            }}
            data-testid="badge-visual-benefits"
          >
            What You Will Feel
          </span>
          <h2
            id="visual-benefits-heading"
            className="text-3xl md:text-5xl font-serif font-bold mb-4"
            style={{ color: 'var(--glp-sage-deep, #4A7E72)' }}
          >
            Emotional support,
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #4A7E72, #F4B942)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              visually gentle.
            </span>
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--glp-ink, #2d3a35)', lineHeight: '1.75' }}
          >
            Every interaction is designed to calm your nervous system — never to overwhelm it.
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
                    <ResponsiveImage
                      src={b.image}
                      srcWebp={b.imageWebp}
                      alt=""
                      className="vb-image"
                      testId={`img-vb-${b.id}`}
                    />
                  </div>
                  <div className="vb-avatar-overlay" aria-hidden="true">
                    <ResponsiveImage
                      src={b.avatar}
                      srcWebp={b.avatarWebp}
                      alt=""
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
                  <ul className="vb-sensory-tags" aria-label="Sensory tones in this section">
                    {b.sensoryWords.map((w) => (
                      <li key={w} className="vb-sensory-tag" data-testid={`tag-vb-${b.id}-${w}`}>
                        {w}
                      </li>
                    ))}
                  </ul>
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
