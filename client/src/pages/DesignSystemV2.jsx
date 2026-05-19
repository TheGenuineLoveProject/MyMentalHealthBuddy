import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import LumiMascot, { VALID_EMOTIONS } from "@/components/lumi/LumiMascot.jsx";
import LumiMascotImage from "@/components/lumi/LumiMascotImage.jsx";
import LumiBrandLogo from "@/components/lumi/LumiBrandLogo.jsx";
import LumiBrandLockupImage from "@/components/lumi/LumiBrandLockupImage.jsx";
import TGLPMandala from "@/components/lumi/TGLPMandala.jsx";
import TGLPMandalaImage from "@/components/lumi/TGLPMandalaImage.jsx";
import useScrollReveal from "@/hooks/useScrollReveal.js";
import useBuddyEmotion from "@/hooks/useBuddyEmotion.js";
import SafetyFooter from "@/components/ui/ReflectionFooter";

function Section({ id, title, kicker, children }) {
  return (
    <section id={id} className="lumi-section" data-reveal>
      <div className="lumi-container">
        {kicker && (
          <div
            className="lumi-text-sm font-body-lumi"
            style={{ color: "var(--lumi-amber-700)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}
          >
            {kicker}
          </div>
        )}
        <h2
          className="font-display-lumi lumi-text-2xl"
          style={{ margin: 0, marginBottom: "var(--lumi-space-6)", color: "var(--lumi-text)" }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Swatch({ name, varName }) {
  return (
    <div className="lumi-card" style={{ padding: "var(--lumi-space-4)" }} data-testid={`swatch-${name}`}>
      <div
        style={{
          width: "100%",
          height: 56,
          borderRadius: "var(--lumi-radius-md)",
          background: `var(${varName})`,
          marginBottom: 8,
          border: "1px solid var(--lumi-border)",
        }}
      />
      <div className="font-body-lumi lumi-text-xs" style={{ fontWeight: 600 }}>{name}</div>
      <code className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-text-muted)" }}>{varName}</code>
    </div>
  );
}

const SAGE_SCALE = ["50","100","200","300","400","500","600","700","800","900","950"];
const AMBER_SCALE = ["50","100","200","300","400","500","600","700","800","900"];
const STONE_SCALE = ["50","100","200","300","400","500","600","700","800","900"];
const SEMANTIC = [
  ["calm","--lumi-calm"],["growth","--lumi-growth"],["love","--lumi-love"],
  ["insight","--lumi-insight"],["energy","--lumi-energy"],["rest","--lumi-rest"],
];

export default function DesignSystemV2() {
  useScrollReveal();
  const [demoCtx, setDemoCtx] = useState({});
  const { emotion, derived, override, celebrate, setEmotion } = useBuddyEmotion(demoCtx);

  // Auto-advance through all 10 emotions for the gallery (paused on hover)
  const [galleryEmotion, setGalleryEmotion] = useState("neutral");
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % VALID_EMOTIONS.length;
      setGalleryEmotion(VALID_EMOTIONS[i]);
    }, 2200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <>
      <Helmet>
        <title>Lumi Design System v2.0 — MyMentalHealthBuddy</title>
        <meta
          name="description"
          content="Living design system for MyMentalHealthBuddy: Lumi mascot, color tokens, typography, buttons, links, motion, and accessibility utilities."
        />
        <meta property="og:title" content="Lumi Design System v2.0" />
        <meta property="og:description" content="Aurora + Lumi — the additive design system for MyMentalHealthBuddy by The Genuine Love Project." />
      </Helmet>

      <a href="#main" className="lumi-skip-link">Skip to main content</a>

      <div className="lumi-bg" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <header
          style={{
            position: "sticky", top: 0, zIndex: 30,
            background: "var(--lumi-bg-elev)",
            borderBottom: "1px solid var(--lumi-border)",
            padding: "var(--lumi-space-3) var(--lumi-space-5)",
          }}
        >
          <div className="lumi-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <LumiBrandLogo size="md" />
            <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Link href="/" className="lumi-link-nav" data-testid="link-home">Home</Link>
              <a href="#mascot" className="lumi-link-nav" data-testid="link-mascot">Mascot</a>
              <a href="#colors" className="lumi-link-nav" data-testid="link-colors">Colors</a>
              <a href="#typography" className="lumi-link-nav" data-testid="link-typography">Type</a>
              <a href="#buttons" className="lumi-link-nav" data-testid="link-buttons">Buttons</a>
              <Link href="/crisis" className="lumi-link-crisis" data-testid="link-crisis">Crisis Support</Link>
            </nav>
          </div>
        </header>

        <main id="main">
          {/* Hero */}
          <section className="lumi-section lumi-grad-hero-bg" data-reveal>
            <div className="lumi-container" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--lumi-space-8)", alignItems: "center" }}>
              <div>
                <div className="lumi-text-sm font-body-lumi" style={{ color: "var(--lumi-amber-700)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                  Lumi Design System v2.0
                </div>
                <h1 className="font-display-lumi lumi-text-4xl" style={{ margin: 0, color: "var(--lumi-text)" }}>
                  A living, gentle, accessible visual language.
                </h1>
                <p className="font-body-lumi lumi-text-lg" style={{ marginTop: 20, color: "var(--lumi-text)", maxWidth: 640 }}>
                  An additive layer over the existing Aurora system — sage, amber, and stone scales, ten emotion-aware Lumi states, eight buttons, nine links, motion, and a11y, all opt-in.
                </p>
                <div className="lumi-row" style={{ marginTop: 28 }}>
                  <a href="#mascot" className="lumi-btn lumi-btn-primary lumi-btn--lg" data-testid="button-meet-lumi">Meet Lumi</a>
                  <a href="#colors" className="lumi-btn lumi-btn-tertiary lumi-btn--lg" data-testid="button-see-tokens">See tokens</a>
                </div>
                <p className="font-body-lumi lumi-text-xs" style={{ marginTop: 18, color: "var(--lumi-text-muted)" }}>
                  Educational only — not a clinical tool. If you are in distress visit{" "}
                  <Link href="/crisis" className="lumi-link-inline">Crisis Support</Link>.
                </p>
              </div>
              <LumiMascot emotion="joy" size={300} ariaLabel="Lumi waving hello" />
            </div>
          </section>

          {/* Mascot gallery */}
          <Section id="mascot" kicker="Phase D1 + I1" title="Lumi — 10 emotion states">
            <p className="font-body-lumi lumi-text-base" style={{ color: "var(--lumi-text-muted)", marginTop: -16, marginBottom: 24, maxWidth: 720 }}>
              The canonical Lumi artwork is the same in every state — emotion is reflected through context (page tone, copy, motion utilities), and the prop is preserved as a data attribute on the wrapper for future per-emotion artwork swaps. Click any Lumi to send a celebration pulse.
            </p>
            <div
              className="lumi-grid"
              data-reveal-stagger
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {VALID_EMOTIONS.map((em) => (
                <div key={em} className="lumi-card" style={{ textAlign: "center" }} data-testid={`card-emotion-${em}`}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <LumiMascot emotion={em} size={150} trackCursor={false} ariaLabel={`Lumi expressing ${em}`} />
                  </div>
                  <div className="font-display-lumi lumi-text-base" style={{ marginTop: 8, fontWeight: 600, textTransform: "capitalize", color: "var(--lumi-text)" }}>
                    {em}
                  </div>
                </div>
              ))}
            </div>
            <div className="lumi-card" style={{ marginTop: 28 }}>
              <div className="font-display-lumi lumi-text-lg" style={{ fontWeight: 600, marginBottom: 8 }}>Click-to-celebrate demo</div>
              <p className="font-body-lumi lumi-text-sm" style={{ color: "var(--lumi-text-muted)", marginBottom: 16 }}>
                Click Lumi (or focus + Enter / Space) to fire a brief celebration pulse. Currently signalling: <strong style={{ color: "var(--lumi-sage-700)" }}>{galleryEmotion}</strong>
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <LumiMascot emotion={galleryEmotion} size={260} />
              </div>
            </div>
          </Section>

          {/* Color tokens */}
          <Section id="colors" kicker="Phase D2" title="Color tokens">
            <h3 className="font-display-lumi lumi-text-lg" style={{ marginBottom: 12 }}>Sage scale</h3>
            <div className="lumi-grid" data-reveal-stagger>
              {SAGE_SCALE.map((n) => <Swatch key={`s${n}`} name={`sage-${n}`} varName={`--lumi-sage-${n}`} />)}
            </div>
            <h3 className="font-display-lumi lumi-text-lg" style={{ marginTop: 32, marginBottom: 12 }}>Amber scale</h3>
            <div className="lumi-grid" data-reveal-stagger>
              {AMBER_SCALE.map((n) => <Swatch key={`a${n}`} name={`amber-${n}`} varName={`--lumi-amber-${n}`} />)}
            </div>
            <h3 className="font-display-lumi lumi-text-lg" style={{ marginTop: 32, marginBottom: 12 }}>Stone scale</h3>
            <div className="lumi-grid" data-reveal-stagger>
              {STONE_SCALE.map((n) => <Swatch key={`st${n}`} name={`stone-${n}`} varName={`--lumi-stone-${n}`} />)}
            </div>
            <h3 className="font-display-lumi lumi-text-lg" style={{ marginTop: 32, marginBottom: 12 }}>Semantic emotions</h3>
            <div className="lumi-grid" data-reveal-stagger>
              {SEMANTIC.map(([n, v]) => <Swatch key={n} name={n} varName={v} />)}
            </div>
          </Section>

          {/* Typography */}
          <Section id="typography" kicker="Phase D3" title="Typography">
            <div className="lumi-grid lumi-grid--3" data-reveal-stagger>
              <div className="lumi-card">
                <div className="lumi-text-xs font-body-lumi" style={{ color: "var(--lumi-text-muted)" }}>Display — Fraunces</div>
                <div className="font-display-lumi lumi-text-3xl" style={{ marginTop: 8, color: "var(--lumi-text)" }}>You are not your worst day.</div>
              </div>
              <div className="lumi-card">
                <div className="lumi-text-xs font-body-lumi" style={{ color: "var(--lumi-text-muted)" }}>Body — Inter</div>
                <p className="font-body-lumi lumi-text-base" style={{ marginTop: 8, lineHeight: "var(--lumi-leading-body)" }}>
                  This is the body voice. It’s clear, generous in line-height, and built for long, gentle reads. We treat language as care.
                </p>
              </div>
              <div className="lumi-card">
                <div className="lumi-text-xs font-body-lumi" style={{ color: "var(--lumi-text-muted)" }}>Quote — Crimson Pro</div>
                <p className="font-quote-lumi lumi-text-lg" style={{ marginTop: 8, color: "var(--lumi-text)" }}>
                  “Healing begins the moment we stop arguing with what is.”
                </p>
              </div>
            </div>
          </Section>

          {/* Buttons */}
          <Section id="buttons" kicker="Phase D4" title="Button library — 8 variants">
            <div className="lumi-row" data-reveal-stagger>
              <button className="lumi-btn lumi-btn-primary"   data-testid="btn-primary">Begin gently</button>
              <button className="lumi-btn lumi-btn-secondary" data-testid="btn-secondary">Continue</button>
              <button className="lumi-btn lumi-btn-tertiary"  data-testid="btn-tertiary">Learn more</button>
              <button className="lumi-btn lumi-btn-ghost"     data-testid="btn-ghost">Maybe later</button>
              <button className="lumi-btn lumi-btn-text"      data-testid="btn-text">Read the story</button>
              <button className="lumi-btn lumi-btn-calm"      data-testid="btn-calm">Calm me down</button>
              <button className="lumi-btn lumi-btn-love"      data-testid="btn-love">Send love</button>
              <button className="lumi-btn lumi-btn-crisis"    data-testid="btn-crisis">I need help now</button>
            </div>
            <div className="lumi-row" style={{ marginTop: 24 }}>
              <button className="lumi-btn lumi-btn-primary lumi-btn--sm" data-testid="btn-primary-sm">Small</button>
              <button className="lumi-btn lumi-btn-primary"             data-testid="btn-primary-md">Default</button>
              <button className="lumi-btn lumi-btn-primary lumi-btn--lg" data-testid="btn-primary-lg">Large</button>
              <button className="lumi-btn lumi-btn-secondary" disabled  data-testid="btn-disabled">Disabled</button>
              <button className="lumi-btn lumi-btn-secondary" data-loading="true" data-testid="btn-loading">Loading</button>
            </div>
          </Section>

          {/* Links */}
          <Section id="links" kicker="Phase D5" title="Link library — 9 types">
            <div className="lumi-stack lumi-stack--lg" data-reveal-stagger>
              <p className="font-body-lumi lumi-text-base">
                A <a href="#colors" className="lumi-link-text" data-testid="lk-text">text link</a>, an{" "}
                <a href="#colors" className="lumi-link-inline" data-testid="lk-inline">inline link</a>, an{" "}
                <a href="https://example.com" className="lumi-link-external" target="_blank" rel="noreferrer" data-testid="lk-external">external link</a>, and a{" "}
                <a href="#colors" className="lumi-link-subtle" data-testid="lk-subtle">subtle link</a>.
              </p>
              <nav style={{ display: "flex", gap: 4 }}>
                <a href="#colors" className="lumi-link-nav" aria-current="page" data-testid="lk-nav-active">Active nav</a>
                <a href="#colors" className="lumi-link-nav" data-testid="lk-nav">Resting nav</a>
                <a href="#colors" className="lumi-link-ghost" data-testid="lk-ghost">Ghost</a>
              </nav>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link href="/" className="lumi-link-brand" data-testid="lk-brand">MyMentalHealthBuddy</Link>
                <a href="#footer-style-demo" className="lumi-link-footer" data-testid="lk-footer" aria-label="Footer link style example">Footer link</a>
                <Link href="/crisis" className="lumi-link-crisis" data-testid="lk-crisis">Crisis Support</Link>
              </div>
            </div>
          </Section>

          {/* Cards */}
          <Section id="cards" kicker="Phase D6" title="Cards & spacing">
            <div className="lumi-grid lumi-grid--3" data-reveal-stagger>
              {[1,2,3].map((n) => (
                <div key={n} className="lumi-card lumi-card--glow" data-testid={`card-demo-${n}`}>
                  <div className="lumi-card__icon">{n}</div>
                  <h3 className="lumi-card__title">Gentle title #{n}</h3>
                  <p className="lumi-card__body">
                    Each card lifts on hover with a soft Aurora-tinted glow. Spacing follows the 8 px scale; padding adapts at the section level.
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Motion */}
          <Section id="motion" kicker="Phase D7" title="Motion utilities">
            <div className="lumi-grid lumi-grid--3" data-reveal-stagger>
              <div className="lumi-card">
                <div className="lumi-card__title">Breathing</div>
                <div className="lumi-anim-breathe" style={{ display: "inline-block", width: 60, height: 60, borderRadius: "50%", background: "var(--lumi-grad-sage)" }} aria-hidden />
                <p className="lumi-card__body" style={{ marginTop: 12 }}>4 s ease cycle, mirroring slow box breath.</p>
              </div>
              <div className="lumi-card">
                <div className="lumi-card__title">Float</div>
                <div className="lumi-anim-float" style={{ display: "inline-block", width: 60, height: 60, borderRadius: "var(--lumi-radius-md)", background: "var(--lumi-grad-amber)" }} aria-hidden />
                <p className="lumi-card__body" style={{ marginTop: 12 }}>6.5 s float, useful for hero illustrations.</p>
              </div>
              <div className="lumi-card lumi-shimmer">
                <div className="lumi-card__title">Shimmer</div>
                <div style={{ height: 60, borderRadius: "var(--lumi-radius-md)", background: "var(--lumi-amber-100)" }} aria-hidden />
                <p className="lumi-card__body" style={{ marginTop: 12 }}>Sweeps a soft highlight across the surface.</p>
              </div>
            </div>
            <p className="font-body-lumi lumi-text-sm" style={{ marginTop: 16, color: "var(--lumi-text-muted)" }}>
              All motion stops automatically when the operating system requests reduced motion.
            </p>
          </Section>

          {/* Brand */}
          <Section id="brand" kicker="Phase I2" title="Brand lockups">
            <div className="lumi-grid" data-reveal-stagger>
              <div className="lumi-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
                <LumiBrandLogo variant="horizontal" size="lg" href={null} />
              </div>
              <div className="lumi-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
                <LumiBrandLogo variant="stacked" size="md" href={null} />
              </div>
              <div className="lumi-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
                <LumiBrandLogo variant="icon-only" size="xl" href={null} />
              </div>
              <div className="lumi-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, flexDirection: "column", gap: 12 }}>
                <TGLPMandala size={120} />
                <div className="font-display-lumi lumi-text-base" style={{ color: "var(--lumi-text)" }}>The Genuine Love Project</div>
              </div>
            </div>
          </Section>

          {/* Real PNG art assets */}
          <Section id="real-assets" kicker="Painted Art" title="Real PNG brand assets">
            <p className="font-body-lumi lumi-text-base" style={{ color: "var(--lumi-text-muted)", marginTop: -16, marginBottom: 24, maxWidth: 720 }}>
              The canonical brand artwork is shared across the system — the components above and the helpers below all render the same painted PNG assets supplied by the brand owners. Reach for these dedicated <code>*Image</code> helpers when you want a non-interactive surface (hero headers, marketing splashes, social cards) with a simpler API and no click handlers.
            </p>
            <div className="lumi-grid lumi-grid--3" data-reveal-stagger>
              <div className="lumi-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 12 }}>
                <LumiMascotImage size={240} animation="float" ariaLabel="Lumi (full-color illustration)" />
                <div className="font-display-lumi lumi-text-base" style={{ fontWeight: 600, color: "var(--lumi-text)" }}>Lumi — Full body</div>
                <code className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-text-muted)" }}>&lt;LumiMascotImage /&gt;</code>
              </div>
              <div className="lumi-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 12 }}>
                <LumiBrandLockupImage height={88} href={null} />
                <div className="font-display-lumi lumi-text-base" style={{ fontWeight: 600, color: "var(--lumi-text)" }}>MMHB lockup</div>
                <code className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-text-muted)" }}>&lt;LumiBrandLockupImage /&gt;</code>
              </div>
              <div className="lumi-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 12, background: "var(--lumi-stone-900)" }}>
                <TGLPMandalaImage size={220} rounded />
                <div className="font-display-lumi lumi-text-base" style={{ fontWeight: 600, color: "var(--lumi-stone-50)" }}>The Genuine Love Project</div>
                <code className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-stone-300)" }}>&lt;TGLPMandalaImage /&gt;</code>
              </div>
            </div>
          </Section>

          {/* Emotion hook demo */}
          <Section id="hook" kicker="Phase I3" title="useBuddyEmotion — context → emotion">
            <div className="lumi-grid" data-reveal-stagger style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="lumi-card">
                <div className="font-display-lumi lumi-text-lg" style={{ fontWeight: 600, marginBottom: 12 }}>Context controls</div>
                <div className="lumi-row">
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ userTyping: true })}        data-testid="ctx-typing">User typing</button>
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ breathingActive: true })}    data-testid="ctx-breathing">Breathing</button>
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ lastMessageType: "empathy" })} data-testid="ctx-empathy">Empathy reply</button>
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ lastMessageType: "celebration" })} data-testid="ctx-celebrate">Celebration reply</button>
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ idleSeconds: 120 })}         data-testid="ctx-sleepy">Idle 2 min</button>
                  <button className="lumi-btn lumi-btn-tertiary" onClick={() => setDemoCtx({ crisisActive: true })}       data-testid="ctx-crisis">Crisis</button>
                  <button className="lumi-btn lumi-btn-ghost"    onClick={() => { setDemoCtx({}); setEmotion(null); }}    data-testid="ctx-reset">Reset</button>
                </div>
                <div className="lumi-row" style={{ marginTop: 16 }}>
                  <button className="lumi-btn lumi-btn-primary" onClick={() => celebrate("celebration", 1800)} data-testid="ctx-flash">Trigger 1.8 s celebration</button>
                </div>
                <div className="font-body-lumi lumi-text-sm" style={{ marginTop: 16, color: "var(--lumi-text-muted)" }}>
                  Derived: <strong style={{ color: "var(--lumi-sage-700)" }}>{derived}</strong> · Override:{" "}
                  <strong style={{ color: "var(--lumi-amber-700)" }}>{override || "—"}</strong> · Active:{" "}
                  <strong style={{ color: "var(--lumi-text)" }}>{emotion}</strong>
                </div>
              </div>
              <div className="lumi-card" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <LumiMascot emotion={emotion} size={240} onEmote={() => celebrate("celebration", 1500)} />
              </div>
            </div>
          </Section>

          {/* Footer */}
          <footer
            style={{
              background: "var(--lumi-stone-900)",
              color: "var(--lumi-stone-200)",
              padding: "var(--lumi-space-8) var(--lumi-space-5)",
              marginTop: "var(--lumi-space-9)",
            }}
            data-reveal
          >
            <div className="lumi-container">
              <div className="lumi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <div>
                  <div style={{ marginBottom: 12 }}><LumiBrandLogo variant="horizontal" size="sm" href={null} /></div>
                  <p className="font-body-lumi lumi-text-sm" style={{ color: "var(--lumi-stone-300)" }}>
                    Educational AI mental wellness companion. Not a substitute for professional care.
                  </p>
                </div>
                <div>
                  <div className="font-display-lumi" style={{ marginBottom: 8, color: "var(--lumi-stone-50)", fontWeight: 600 }}>Platform</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Link href="/" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-home">Home</Link>
                    <Link href="/wellness-tools-hub" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-tools">Wellness Tools</Link>
                    <Link href="/discernment" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-discernment">Discernment</Link>
                  </div>
                </div>
                <div>
                  <div className="font-display-lumi" style={{ marginBottom: 8, color: "var(--lumi-stone-50)", fontWeight: 600 }}>Resources</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Link href="/blog" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-blog">Blog</Link>
                    <Link href="/learn" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-learn">Learn</Link>
                    <Link href="/faq" className="lumi-link-footer" style={{ color: "var(--lumi-stone-200)" }} data-testid="footer-faq">FAQ</Link>
                  </div>
                </div>
                <div>
                  <div className="font-display-lumi" style={{ marginBottom: 8, color: "var(--lumi-stone-50)", fontWeight: 600 }}>Safety</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Link href="/crisis" className="lumi-link-crisis" data-testid="footer-crisis">Crisis Support</Link>
                    <span className="font-body-lumi lumi-text-sm" style={{ color: "var(--lumi-stone-300)" }}>988 — Suicide & Crisis Lifeline (US)</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--lumi-stone-700)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-stone-400)" }}>
                  © {new Date().getFullYear()} The Genuine Love Project. Made with care.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TGLPMandala size={32} />
                  <span className="font-body-lumi lumi-text-xs" style={{ color: "var(--lumi-stone-400)" }}>The Genuine Love Project</span>
                </div>
              </div>
            </div>
          </footer>
          {/* Canonical SafetyFooter — required on all wellness routes for crisis routing parity */}
          <SafetyFooter />
        </main>
      </div>
    </>
  );
}
