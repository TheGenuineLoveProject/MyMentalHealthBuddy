import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'wouter';

export default function Hero({
  logo,
  badge,
  title,
  titleHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  trustBadges,
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
      className={`sacred-hero relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 ${className}`}
      role="banner"
      data-testid="hero-section"
    >
      {logo && (
        <div
          ref={logoRef}
          className="mb-6"
          data-aos="sacred-scale"
          data-aos-delay="100"
        >
          {typeof logo === 'string' ? (
            <img 
              src={logo} 
              alt="The Genuine Love Project" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              data-testid="hero-logo"
            />
          ) : (
            logo
          )}
        </div>
      )}

      {badge && (
        <div
          className="mb-6"
          data-aos="sacred-fade-up"
          data-aos-delay="150"
        >
          {badge}
        </div>
      )}

      <h1
        className="sacred-title max-w-4xl mb-6"
        style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
        data-aos="sacred-fade-up"
        data-aos-delay="200"
        data-testid="hero-title"
      >
        {title}
        {titleHighlight && (
          <span 
            className="block mt-2"
            style={{
              background: 'linear-gradient(135deg, var(--sacred-sage, #8fbf9f), var(--sacred-teal, #2f5d5d))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {titleHighlight}
          </span>
        )}
      </h1>

      {subtitle && (
        <p
          className="sacred-body max-w-2xl mb-8"
          style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
          data-aos="sacred-fade-up"
          data-aos-delay="300"
          data-testid="hero-subtitle"
        >
          {subtitle}
        </p>
      )}

      {trustBadges && (
        <div
          className="flex flex-wrap justify-center gap-3 mb-8"
          data-aos="sacred-fade-up"
          data-aos-delay="350"
          role="list"
          aria-label="Trust badges"
        >
          {trustBadges}
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row items-center gap-4"
        data-aos="sacred-fade-up"
        data-aos-delay="400"
        role="group"
        aria-label="Call to action"
      >
        {primaryCta && (
          <Link
            href={primaryCta.href}
            className="sacred-button sacred-button--primary py-4 px-8 text-lg"
            data-testid="hero-primary-cta"
          >
            {primaryCta.icon && (
              <span className="sacred-icon mr-2" aria-hidden="true">
                {primaryCta.icon}
              </span>
            )}
            {primaryCta.label}
          </Link>
        )}

        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="sacred-button sacred-button--ghost group"
            data-testid="hero-secondary-cta"
          >
            {secondaryCta.label}
            {secondaryCta.icon && (
              <span 
                className="sacred-icon ml-2 transition-transform group-hover:translate-x-1" 
                aria-hidden="true"
              >
                {secondaryCta.icon}
              </span>
            )}
          </Link>
        )}
      </div>
    </section>
  );
}
