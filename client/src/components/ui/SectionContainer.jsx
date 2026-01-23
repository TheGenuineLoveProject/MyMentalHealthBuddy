const variantStyles = {
  plain: '',
  glow: 'bg-gradient-to-br from-[var(--glp-sage-10)] via-transparent to-[var(--glp-rose-10)]',
  pattern: 'bg-[var(--glp-paper)] border-y border-[var(--glp-sage-20)]',
  dark: 'bg-[var(--glp-sage-deep)] text-white',
};

export function SectionContainer({
  id,
  eyebrow,
  title,
  subtitle,
  variant = 'plain',
  children,
  className = '',
}) {
  const variantClass = variantStyles[variant] || '';

  return (
    <section
      id={id}
      className={`py-12 md:py-16 lg:py-20 ${variantClass} ${className}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {(eyebrow || title || subtitle) && (
          <header className="text-center mb-10 md:mb-14">
            {eyebrow && (
              <p className={`text-sm font-medium uppercase tracking-wider mb-3 ${variant === 'dark' ? 'text-[var(--glp-gold)]' : 'text-[var(--glp-sage-deep)]'}`}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className={`font-sacred text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 ${variant === 'dark' ? 'text-white' : 'text-[var(--glp-ink)]'}`}
                data-testid={id ? `section-title-${id}` : 'section-title'}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-base md:text-lg max-w-2xl mx-auto ${variant === 'dark' ? 'text-white/80' : 'text-[var(--glp-ink)]/70'}`}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export default SectionContainer;
