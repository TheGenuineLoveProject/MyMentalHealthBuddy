export function SkipLink() {
  return (
    <a
      href="#main-content"
      data-testid="link-skip-to-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
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

export default SkipLink;
