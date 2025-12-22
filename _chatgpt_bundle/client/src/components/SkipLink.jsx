export function SkipLink() {
  return (
    <a
      href="#main-content"
      data-testid="link-skip-to-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100] focus:px-6 focus:py-3 focus:bg-gradient-to-r focus:from-[var(--primary)] focus:to-[var(--accent-violet)] focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
      onFocus={(e) => {
        e.currentTarget.classList.remove('sr-only');
      }}
      onBlur={(e) => {
        e.currentTarget.classList.add('sr-only');
      }}
    >
      Skip to main content
    </a>
  );
}

export function SkipToSection({ targetId, label }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg focus:font-medium focus:text-sm focus:shadow-lg"
    >
      Skip to {label}
    </a>
  );
}

export default SkipLink;
