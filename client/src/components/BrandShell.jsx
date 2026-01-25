import React from "react";

export default function BrandShell({ children, logoSrc = "/logo.png" }) {
  return (
    <div className="glp-bg min-h-screen" data-testid="brand-shell">
      <div className="page-container">
        <header 
          className="flex items-center justify-between py-5 border-b border-[var(--sage-200)]"
          data-testid="header-main"
        >
          <a 
            href="/" 
            className="flex items-center gap-4 no-underline hover:opacity-90 transition-opacity"
            data-testid="link-home"
            aria-label="Go to homepage"
          >
            <div 
              className="icon-premium icon-premium-lg icon-teal-gradient"
              role="img"
              aria-label="The Genuine Love Project logo"
              data-testid="logo-icon"
            >
              <img
                src={logoSrc}
                alt="The Genuine Love Project"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-lg font-bold text-white" aria-hidden="true">
                ♥
              </span>
            </div>

            <div className="content-stack content-stack-xs">
              <h1 
                className="text-card-title text-[var(--teal-600)] dark:text-[var(--teal-300)]"
                data-testid="text-brand-title"
              >
                The Genuine Love Project
              </h1>
              <p 
                className="text-meta text-[var(--sage-500)] dark:text-[var(--sage-400)]"
                data-testid="text-brand-tagline"
              >
                Mental Health from A to Z
              </p>
            </div>
          </a>

          <nav 
            className="content-row content-row-sm" 
            aria-label="Main navigation"
            data-testid="nav-main"
          >
            <button 
              className="btn-glass"
              data-testid="button-journal"
              type="button"
            >
              Journal
            </button>
            <button 
              className="btn-glass"
              data-testid="button-mood"
              type="button"
            >
              Mood
            </button>
            <button 
              className="btn-premium-teal"
              data-testid="button-checkin"
              type="button"
            >
              Start a Check-In
            </button>
          </nav>
        </header>

        <main 
          className="section-container-sm" 
          id="main-content"
          data-testid="main-content"
        >
          {children}
        </main>

        <footer 
          className="py-8 border-t border-[var(--sage-100)] dark:border-[var(--sage-800)] text-center"
          data-testid="footer-main"
          role="contentinfo"
        >
          <p 
            className="text-meta text-[var(--teal-400)] dark:text-[var(--teal-500)] max-w-2xl mx-auto leading-relaxed"
            data-testid="text-disclaimer"
          >
            This platform provides reflection tools and is not therapy or a crisis service. 
            If you're in danger, contact local emergency services or a licensed professional.
          </p>
        </footer>
      </div>
    </div>
  );
}
