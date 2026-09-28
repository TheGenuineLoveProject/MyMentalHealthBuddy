import React from "react";
import { Link } from "wouter";
import "../styles/meet-lumi-page.css";

const PATHS = [
  ["01", "Find a starting point", "Not sure what you need? Explore a guided introduction.", "/start", "Start here"],
  ["02", "Make room for reflection", "Put an experience into words, at your own pace.", "/journal", "Open journal"],
  ["03", "Try a practical tool", "Explore grounding, breathing, and self-reflection exercises.", "/tools", "Explore tools"],
  ["04", "Learn something useful", "Browse topics and find ideas to bring into everyday life.", "/learn", "Explore learning"],
];
export default function CanvaLanding() {
  return <div className="canva-landing mm-public" data-testid="page-home-refined">
    <section className="mp-wrap mp-hero" aria-labelledby="home-title">
      <p className="mp-eyebrow">MyMentalHealthBuddy</p>
      <h1 id="home-title">A little space for you.<br />A next step that fits.</h1>
      <p className="mp-lead">Explore your feelings, reflect on what matters, and find practical tools for everyday wellbeing. Begin wherever you are.</p>
      <div className="mp-actions">
        <Link href="/start" className="mp-button mp-primary" data-testid="link-home-start">Find my starting point</Link>
        <Link href="/tools" className="mp-button" data-testid="link-explore-tools">Explore tools</Link>
      </div>
      <p className="mp-small">Go at your own pace. You can choose what to explore and what to skip.</p>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="home-paths">
      <h2 id="home-paths">What would be helpful today?</h2>
      <div className="mp-grid">
        {PATHS.map(([number, title, body, href, label]) => <article className="mp-card" key={href}>
          <span className="mp-number" aria-hidden="true">{number}</span>
          <h3>{title}</h3><p>{body}</p>
          <Link className="mp-text-link" href={href}>{label} <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="meet-lumi-heading">
      <div className="mp-panel">
        <p className="mp-eyebrow">An optional AI companion</p>
        <h2 id="meet-lumi-heading">Meet Lumi</h2>
        <p>Lumi offers conversation and reflection prompts. Learn what it can help with, where its limits are, and how to use the platform without it.</p>
        <Link href="/lumi" className="mp-text-link" data-testid="link-meet-lumi">Get to know Lumi <span aria-hidden="true">→</span></Link>
      </div>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="home-boundaries">
      <h2 id="home-boundaries">Clear expectations. Your choice.</h2>
      <p>This is a wellness and education platform. It does not diagnose, prescribe, or replace professional care. AI responses can be mistaken.</p>
      <div className="mp-actions">
        <Link href="/privacy" className="mp-text-link">Privacy</Link>
        <Link href="/ai-transparency" className="mp-text-link">About the AI</Link>
        <Link href="/pricing" className="mp-text-link" data-testid="link-view-pricing">View pricing</Link>
      </div>
      <aside className="mp-support" aria-label="Crisis support">
        <strong>Need urgent support?</strong> <Link href="/crisis" className="mp-text-link" data-testid="link-crisis">Open crisis resources</Link>. For immediate danger, contact your local emergency services.
      </aside>
    </section>
  </div>;
}
