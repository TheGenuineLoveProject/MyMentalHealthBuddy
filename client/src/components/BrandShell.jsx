import React from "react";

/**
 * BrandShell: wraps the app in the new visual system
 * - logoSrc can point to /logo.png (place it in /public/logo.png)
 */
export default function BrandShell({ children, logoSrc = "/logo.png" }) {
  return (
    <div className="glp-bg">
      <div className="glp-wrap">
        <header className="glp-header">
          <div className="glp-brand">
            <div className="glp-logo" aria-label="The Genuine Love Project logo">
              {/* If logo.png isn't ready yet, this still renders a clean placeholder */}
              <img
                src={logoSrc}
                alt="The Genuine Love Project"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* Fallback symbol */}
              <span style={{ fontFamily: "var(--font-heading)", color: "var(--teal)" }}>
                ∞♥
              </span>
            </div>

            <div>
              <h1 className="glp-title">The Genuine Love Project</h1>
              <p className="glp-tagline">Mental Health from A to Z</p>
            </div>
          </div>

          <div className="glp-actions">
            <button className="btn">Journal</button>
            <button className="btn">Mood</button>
            <button className="btn btn-primary">Start a Check-In</button>
          </div>
        </header>

        {children}

        <footer className="footer">
          This platform provides reflection tools and is not therapy or a crisis service. If you’re in danger, contact local
          emergency services or a licensed professional.
        </footer>
      </div>
    </div>
  );
}