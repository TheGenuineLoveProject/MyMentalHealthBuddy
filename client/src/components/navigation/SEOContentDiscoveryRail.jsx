import React from "react";
import { Link } from "react-router-dom";
import "./SEOContentDiscoveryRail.css";

const seoContentLinks = [
  { to: "/glossary", label: "Glossary", description: "Plain-language wellness terms" },
  { to: "/wellness-glossary", label: "Wellness Glossary", description: "Clear emotional wellness definitions" },
  { to: "/research-evidence", label: "Research & Evidence", description: "How we ground trust and safety" },
  { to: "/professional-resources", label: "Professional Resources", description: "Provider-aware educational resources" },
  { to: "/how-to-guides", label: "How-To Guides", description: "Step-by-step support tools" },
  { to: "/qa", label: "Q&A", description: "Common questions answered clearly" },
  { to: "/examples", label: "Examples", description: "Concrete examples for understanding" },
  { to: "/health", label: "Health", description: "Whole-person wellness education" },
  { to: "/calming-scenes", label: "Calming Scenes", description: "Gentle visual regulation support" },
];

export default function SEOContentDiscoveryRail() {
  return (
    <nav
      className="seo-content-discovery-rail"
      aria-label="Wellness learning library"
      data-phase93="seo-content-discovery"
    >
      <div className="seo-content-discovery-rail__inner">
        <div className="seo-content-discovery-rail__intro">
          <p className="seo-content-discovery-rail__eyebrow">Wellness learning library</p>
          <p className="seo-content-discovery-rail__title">
            Explore clear guides, definitions, research, and calming support.
          </p>
        </div>

        <div className="seo-content-discovery-rail__links">
          {seoContentLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="seo-content-discovery-rail__link"
              aria-label={`${item.label}: ${item.description}`}
            >
              <span className="seo-content-discovery-rail__link-label">{item.label}</span>
              <span className="seo-content-discovery-rail__link-description">{item.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export { seoContentLinks };
