export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--glp-gold)] focus:text-[var(--glp-ink)] focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--glp-gold)]"
      data-testid="link-skip-to-content"
    >
      Skip to content
    </a>
  );
}
