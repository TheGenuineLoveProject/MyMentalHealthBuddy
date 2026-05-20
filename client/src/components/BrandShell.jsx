import React from "react";
import { Link } from "wouter";

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
              aria-label="MyMentalHealthBuddy logo"
              data-testid="logo-icon"
            >
              <img
                src={logoSrc}
                alt="MyMentalHealthBuddy"
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
                MyMentalHealthBuddy
              </h1>
              <p
                className="text-meta text-[var(--sage-500)] dark:text-[var(--sage-400)]"
                data-testid="text-brand-tagline"
              >
                by The Genuine Love Project
              </p>
            </div>
          </a>

          {/* V29 Phase 1 fix (2026-05-15): replaced inert <button type="button"> with wouter Link wrappers.
              Prior buttons had no onClick handlers — clicks were no-ops. */}
          <nav
            className="content-row content-row-sm"
            aria-label="Main navigation"
            data-testid="nav-main"
          >
            <Link href="/journal" data-testid="link-journal">
              <a className="btn-glass">Journal</a>
            </Link>
            <Link href="/mood" data-testid="link-mood">
              <a className="btn-glass">Mood</a>
            </Link>
            <Link href="/checkin" data-testid="link-checkin">
              <a className="btn-premium-teal">Start a Check-In</a>
            </Link>
          </nav>
        </header>

        <main
          className="section-container-sm"
          id="brand-shell-content"
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
