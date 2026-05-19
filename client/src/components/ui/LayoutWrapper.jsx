import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export function LayoutWrapper({
  children,
  title,
  description,
  className = '',
  showSkipLink = true,
}) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    }
    const handler = (e) => {
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

      return (
        <>
          <Helmet>
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Helmet>

          {showSkipLink && (
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--glp-sage-deep)] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2"
              data-testid="skip-link"
            >
              Skip to main content
            </a>
          )}

          <div className={`min-h-screen bg-[var(--glp-paper)] ${className}`}>
            <div
              className="fixed inset-0 -z-10 opacity-50 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 20%, var(--glp-sage-10) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, var(--glp-rose-10) 0%, transparent 50%)",
              }}
            />

            <div tabIndex={-1} className="outline-none">
              {children}
            </div>
          </div>
        </>
      );
  }

  export default LayoutWrapper;