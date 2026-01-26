/**
 * Hero.jsx - CSS Module-based Sacred Hero Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - GSAP logo breathe animation (disabled for reduced motion)
 * - Icons scaled ~0.7
 * - Playfair Display + Inter typography
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'wouter';
import { Heart, ArrowRight, ChevronRight } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero({
  logo,
  badge,
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  trustBadges,
  sectionTitle,
  className = '',
}) {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion.current && logoRef.current) {
      gsap.to(logoRef.current, {
        keyframes: [
          { scale: 1, filter: 'drop-shadow(0 0 8px rgba(234, 195, 59, 0.3))' },
          { scale: 1.02, filter: 'drop-shadow(0 0 20px rgba(234, 195, 59, 0.5))' },
          { scale: 1, filter: 'drop-shadow(0 0 8px rgba(234, 195, 59, 0.3))' },
        ],
        duration: 4,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${className}`}
      role="banner"
      aria-label="Hero section"
      data-testid="hero-section"
    >
      <div className={styles.heroInner}>
        {logo && (
          <div
            ref={logoRef}
            className={styles.logoBadge}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {typeof logo === 'string' ? (
              <img 
                src={logo} 
                alt="The Genuine Love Project" 
                className={styles.logoBadgeIcon}
                data-testid="hero-logo"
              />
            ) : (
              <>
                <Heart className={styles.logoBadgeIcon} aria-hidden="true" />
                <span className={styles.logoBadgeText}>{logo}</span>
              </>
            )}
          </div>
        )}

        {badge && (
          <div
            className={styles.logoBadge}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Heart className={styles.logoBadgeIcon} aria-hidden="true" />
            <span className={styles.logoBadgeText}>{badge}</span>
          </div>
        )}

        {eyebrow && (
          <p
            className={styles.eyebrow}
            data-aos="fade-up"
            data-aos-delay="150"
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={styles.title}
          data-aos="fade-up"
          data-aos-delay="200"
          data-testid="hero-title"
        >
          {title}
          {titleHighlight && (
            <>
              <br />
              <span className={styles.titleHighlight}>{titleHighlight}</span>
            </>
          )}
        </h1>

        {subtitle && (
          <p
            className={styles.subtitle}
            data-aos="fade-up"
            data-aos-delay="250"
            data-testid="hero-subtitle"
          >
            {subtitle}
          </p>
        )}

        {trustBadges && trustBadges.length > 0 && (
          <div className={styles.trustBadges} data-aos="fade-up" data-aos-delay="300">
            {trustBadges.map((badge, idx) => (
              <span key={idx} className={styles.trustBadge}>
                {badge.icon && <span className={styles.trustBadgeIcon}>{badge.icon}</span>}
                {badge.text || badge}
              </span>
            ))}
          </div>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={styles.actions} data-aos="fade-up" data-aos-delay="350">
            {primaryCta && (
              <Link 
                href={primaryCta.href || '/register'}
                className={styles.primaryBtn} 
                data-testid="hero-primary-cta"
              >
                {primaryCta.icon && <span className={styles.btnIcon}>{primaryCta.icon}</span>}
                {primaryCta.label || primaryCta.text || primaryCta}
                <ArrowRight className={styles.btnIcon} aria-hidden="true" />
              </Link>
            )}
            {secondaryCta && (
              <Link 
                href={secondaryCta.href || '/about'}
                className={styles.secondaryBtn} 
                data-testid="hero-secondary-cta"
              >
                {secondaryCta.label || secondaryCta.text || secondaryCta}
                {secondaryCta.icon || <ChevronRight className={styles.btnIcon} aria-hidden="true" />}
              </Link>
            )}
          </div>
        )}

        {sectionTitle && (
          <h2
            className={styles.sectionTitle}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {sectionTitle}
          </h2>
        )}
      </div>
    </section>
  );
}
