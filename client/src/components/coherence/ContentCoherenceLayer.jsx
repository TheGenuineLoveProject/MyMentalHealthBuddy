import React, { useMemo } from "react";
import "./ContentCoherenceLayer.css";

const PAGE_GUIDES = [
  {
    match: (path) => path === "/",
    eyebrow: "Start here",
    title: "Understand what MyMentalHealthBuddy helps you do.",
    purpose: "This page introduces the platform, Lumi, and the main paths for self-understanding, emotional clarity, and guided growth.",
    action: "Choose one next step: explore tools, review premium support, or learn how safety boundaries work.",
    nextLabel: "Explore premium support",
    nextHref: "/premium",
    secondaryLabel: "Review safety boundaries",
    secondaryHref: "/safety",
  },
  {
    match: (path) => path.startsWith("/pricing"),
    eyebrow: "Pricing clarity",
    title: "Choose the level of structure and support that fits your current season.",
    purpose: "This page explains subscription value in plain language: tools, guided structure, dashboards, reflections, and provider-informed experiences.",
    action: "Compare what is included, confirm what feels useful, and subscribe only when the value is clear.",
    nextLabel: "View premium benefits",
    nextHref: "/premium",
    secondaryLabel: "Manage billing",
    secondaryHref: "/account/billing",
  },
  {
    match: (path) => path.startsWith("/premium"),
    eyebrow: "Premium clarity",
    title: "See what premium access helps you practice consistently.",
    purpose: "Premium is designed to organize healing education, self-reflection, emotional intelligence tools, and guided growth pathways.",
    action: "Look for practical outcomes: clarity, consistency, structured reflection, and easier access to tools.",
    nextLabel: "Compare plans",
    nextHref: "/pricing",
    secondaryLabel: "Go to subscription",
    secondaryHref: "/account/subscription",
  },
  {
    match: (path) => path.startsWith("/account/billing"),
    eyebrow: "Billing clarity",
    title: "Review payment and billing information without confusion.",
    purpose: "This page should help you understand plan access, billing status, and account actions clearly.",
    action: "Check your status, update billing only when needed, and use support if something looks incorrect.",
    nextLabel: "View subscription",
    nextHref: "/account/subscription",
    secondaryLabel: "Review pricing",
    secondaryHref: "/pricing",
  },
  {
    match: (path) => path.startsWith("/account/subscription"),
    eyebrow: "Subscription clarity",
    title: "Understand your access level and next account step.",
    purpose: "This page should show what you have access to, what is active, and what options are available.",
    action: "Confirm your current plan, review benefits, and change only what you understand.",
    nextLabel: "View billing",
    nextHref: "/account/billing",
    secondaryLabel: "Compare plans",
    secondaryHref: "/pricing",
  },
  {
    match: (path) => path.startsWith("/safety"),
    eyebrow: "Safety clarity",
    title: "Understand what the platform can and cannot do.",
    purpose: "This page explains safety boundaries, crisis limits, and human-supervised support expectations.",
    action: "Use this page to understand when to seek emergency, licensed, or human support.",
    nextLabel: "Review privacy",
    nextHref: "/privacy",
    secondaryLabel: "Return home",
    secondaryHref: "/",
  },
  {
    match: (path) => path.startsWith("/privacy"),
    eyebrow: "Privacy clarity",
    title: "Understand how trust, data boundaries, and privacy should work.",
    purpose: "This page should explain how private information is protected and what should not be used for monetization.",
    action: "Review the boundaries before sharing sensitive information.",
    nextLabel: "Review terms",
    nextHref: "/terms",
    secondaryLabel: "Review safety",
    secondaryHref: "/safety",
  },
  {
    match: (path) => path.startsWith("/terms"),
    eyebrow: "Terms clarity",
    title: "Understand the rules for using the platform safely.",
    purpose: "This page should explain user responsibilities, platform boundaries, and support limitations in clear language.",
    action: "Read the terms before relying on platform tools or paid services.",
    nextLabel: "Review safety",
    nextHref: "/safety",
    secondaryLabel: "Return home",
    secondaryHref: "/",
  },
];

function getPath() {
  if (typeof window === "undefined") return "/";
  return window.location?.pathname || "/";
}

function getGuide(path) {
  return (
    PAGE_GUIDES.find((guide) => guide.match(path)) || {
      eyebrow: "Page clarity",
      title: "Use this page with one clear next step in mind.",
      purpose: "This page is part of the MyMentalHealthBuddy growth system. It should help you understand, choose, practice, or manage something clearly.",
      action: "Read the page from top to bottom, choose one useful action, and avoid rushing decisions.",
      nextLabel: "Explore tools",
      nextHref: "/tools",
      secondaryLabel: "Review premium",
      secondaryHref: "/premium",
    }
  );
}

export default function ContentCoherenceLayer() {
  const path = getPath();

  const hiddenRoutes = [
    "/admin",
    "/login",
    "/register",
    "/reset-password",
  ];

  const shouldHide = hiddenRoutes.some((route) => path.startsWith(route));

  const guide = useMemo(() => getGuide(path), [path]);

  if (shouldHide) return null;

  return (
    <aside
      className="mmhb-content-coherence-layer"
      aria-label="Plain language page guide"
      data-content-coherence-layer="client-clarity"
    >
      <div className="mmhb-content-coherence-card">
        <div className="mmhb-content-coherence-kicker">{guide.eyebrow}</div>
        <h2>{guide.title}</h2>

        <div className="mmhb-content-coherence-grid">
          <div>
            <span>Purpose</span>
            <p>{guide.purpose}</p>
          </div>
          <div>
            <span>Best next step</span>
            <p>{guide.action}</p>
          </div>
        </div>

        <div className="mmhb-content-coherence-actions" aria-label="Helpful next steps">
          <a className="mmhb-content-coherence-primary" href={guide.nextHref}>
            {guide.nextLabel}
          </a>
          <a className="mmhb-content-coherence-secondary" href={guide.secondaryHref}>
            {guide.secondaryLabel}
          </a>
        </div>

        <p className="mmhb-content-coherence-boundary">
          Educational support only. Not diagnosis, emergency care, or a replacement for licensed care.
        </p>
      </div>
    </aside>
  );
}
