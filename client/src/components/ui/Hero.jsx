import { Button } from './Button';

export function Hero({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  helperLine,
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
          data-testid="hero-title"
        >
          {title}{' '}
          {titleHighlight && (
            <span className="text-[var(--glp-sage-deep)]" data-testid="hero-title-highlight">{titleHighlight}</span>
          )}
        </h1>

        {subtitle && (
          <p className="text-lg md:text-xl text-[var(--glp-ink)]/70 max-w-2xl mx-auto mb-4" data-testid="hero-subtitle">
            {subtitle}
          </p>
        )}

        {helperLine && (
          <p className="text-sm md:text-base text-[var(--glp-sage)] italic max-w-xl mx-auto mb-8" data-testid="hero-helper-line">
            {helperLine}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {primaryCta && (
              <Button
                href={primaryCta.href}
                variant="primary"
                size="md"
                data-testid="hero-primary-cta"
              >
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="secondary"
                size="md"
                data-testid="hero-secondary-cta"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
