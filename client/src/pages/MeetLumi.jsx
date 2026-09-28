import React, { useEffect } from "react";
import { Link } from "wouter";
import { OFFICIAL_LUMI_REGISTRY } from "../lumi-registry/registry/officialLumiRegistry";
import "../styles/meet-lumi-page.css";
const STATES = ["LUMI_CALM_FLOAT", "LUMI_HEART", "LUMI_MEDITATION", "LUMI_COMPANION", "LUMI_PATH", "LUMI_EMOTION_ORB", "LUMI_SOFT_PRESENCE"];
const FAQ = [
 ["Is Lumi a person or therapist?", "Lumi is an AI-supported companion, not a person or clinician. It cannot diagnose, prescribe, or replace professional care. AI responses can be mistaken."],
 ["Do I have to use the AI?", "No. You can open the journal, learning resources, practical tools, and crisis information directly."],
 ["Why are there different Lumi pictures?", "These are different illustrations of the same companion, used alongside different activities. An illustration does not mean the AI knows how you feel."],
 ["What should I share?", "Choose what you feel comfortable sharing. Review the Privacy and AI Transparency pages before entering personal information."],
];
function ensureMeta(name, content) {
  let node = document.querySelector(`meta[name="${name}"]`);
  const created = !node;

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute("name", name);
    document.head.appendChild(node);
  }

  const previous = node.getAttribute("content");
  node.setAttribute("content", content);

  return () => {
    if (created) {
      node.remove();
    } else if (previous === null) {
      node.removeAttribute("content");
    } else {
      node.setAttribute("content", previous);
    }
  };
}

function ensureCanonical(pathname) {
  let node = document.querySelector('link[rel="canonical"]');
  const created = !node;

  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }

  const previous = node.getAttribute("href");
  const href = new URL(pathname, window.location.origin).toString();

  node.setAttribute("href", href);

  return () => {
    if (created) {
      node.remove();
    } else if (previous === null) {
      node.removeAttribute("href");
    } else {
      node.setAttribute("href", previous);
    }
  };
}

export default function MeetLumi() {
  useEffect(() => {
    const previousTitle = document.title;

    document.title =
      "Meet Lumi | MyMentalHealthBuddy";

    const restoreDescription = ensureMeta(
      "description",
      "Meet Lumi, the gentle MyMentalHealthBuddy companion. Explore optional AI conversation, reflection, and practical next steps."
    );

    const restoreCanonical = ensureCanonical("/lumi");

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreCanonical();
    };
  }, []);

  return <div className="meet-lumi mm-public" data-testid="page-lumi">
    <section className="mp-wrap mp-hero" aria-labelledby="lumi-title">
      <p className="mp-eyebrow">An optional AI companion</p>
      <h1 id="lumi-title">Meet Lumi.<br />Make space to reflect.</h1>
      <p className="mp-lead">A conversation can be a starting point. Explore a feeling, put a thought into words, or choose a small next step.</p>
      <div className="mp-actions">
        <Link href="/chat" className="mp-button mp-primary" data-testid="link-lumi-chat">Open AI chat</Link>
        <Link href="/tools" className="mp-button">Explore tools without AI</Link>
      </div>
      <p className="mp-small">Lumi is AI, not a person or therapist. You decide what to explore.</p>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="lumi-ideas">
      <h2 id="lumi-ideas">A few ways to begin</h2>
      <div className="mp-grid">
        <article className="mp-card"><h3>Find words for a feeling</h3><p>Try: “I feel pulled in several directions. Help me put that into words.”</p></article>
        <article className="mp-card"><h3>Consider a next step</h3><p>Try: “Ask me one question to help me decide what matters today.”</p></article>
      </div>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="lumi-states">
      <h2 id="lumi-states">One companion, different illustrations</h2>
      <p>The pictures give each activity its own character. You can browse them here without an automatic slideshow.</p>
      <div className="mp-grid mp-gallery">
        {STATES.map(id => { const variant = OFFICIAL_LUMI_REGISTRY[id]; if (!variant) return null;
          return <article className="mp-card" key={id} data-testid={`card-lumi-${id.toLowerCase()}`}>
            <img src={variant.src} alt={variant.alt} width="140" height="140" loading="lazy" decoding="async" />
            <h3>{variant.name}</h3>
          </article>;
        })}
      </div>
    </section>
    <section className="mp-wrap mp-section" aria-labelledby="lumi-faq">
      <h2 id="lumi-faq">Questions you may have</h2>
      <div className="mp-faq">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      <div className="mp-actions">
        <Link href="/privacy" className="mp-text-link">Privacy</Link>
        <Link href="/ai-transparency" className="mp-text-link">AI transparency</Link>
        <Link href="/" className="mp-text-link">Back to home</Link>
      </div>
      <aside className="mp-support" aria-label="Crisis support">
        <strong>Need urgent support?</strong> <Link href="/crisis" className="mp-text-link" data-testid="link-crisis">Open crisis resources</Link>. For immediate danger, contact your local emergency services.
      </aside>
    </section>
  </div>;
}
