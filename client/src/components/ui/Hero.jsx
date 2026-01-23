import { Link } from 'wouter';

export function Hero({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  className = '',
}) {
  return (
    <section
      className={`relative py-16 md:py-24 lg:py-32 ${className}`}
      aria-labelledby="hero-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        {eyebrow && (
          <p className="text-sm md:text-base font-medium text-[var(--glp-sage-deep)] uppercase tracking-wider mb-4">
            {eyebrow}
          </p>
        )}

        <h1
          id="hero-title"
          className="font-sacred text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--glp-ink)] leading-tight mb-6"
        >
          {title}{' '}
          {titleHighlight && (
            <span className="text-[var(--glp-sage-deep)]">{titleHighlight}</span>
          )}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-[var(--glp-ink)]/70 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryCta && (
              <Link href={primaryCta.href}>
                <a
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl bg-[var(--glp-sage-deep)] text-white hover:bg-[var(--glp-teal-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 transition-colors motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
                  data-testid="hero-primary-cta"
                >
                  {primaryCta.label}
                </a>
              </Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <a
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl border-2 border-[var(--glp-sage-deep)] text-[var(--glp-sage-deep)] hover:bg-[var(--glp-sage-10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 transition-colors"
                  data-testid="hero-secondary-cta"
                >
                  {secondaryCta.label}
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
