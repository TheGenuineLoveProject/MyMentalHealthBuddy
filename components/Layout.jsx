import Head from "next/head";
import { useEffect, useMemo } from "react";
import AOS from "aos";
import styles from "./Layout.module.css";
import { gsap } from "gsap";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Layout({ seo, children }) {
  useEffect(() => {
    // AOS once-only
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 60,
    });

    // GSAP micro-motion (reduced motion safe)
    if (!prefersReducedMotion()) {
      gsap.to("[data-logo-breathe='true']", {
        scale: 1.02,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to("[data-logo-glow='true']", {
        rotate: 1.2,
        duration: 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }

    return () => {
      AOS.refreshHard();
      gsap.killTweensOf("[data-logo-breathe='true']");
      gsap.killTweensOf("[data-logo-glow='true']");
    };
  }, []);

  const title = seo?.title || "The Genuine Love Project";
  const description =
    seo?.description ||
    "A warm, grounded, gentle, evidence-based space for healing—built to soothe the nervous system and guide you toward clarity.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>

      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <div className={styles.bg}>
        <div className={styles.pattern} aria-hidden="true" />
        <div className={styles.aura} aria-hidden="true" />
      </div>

      <div className={styles.shell}>
        <header className={styles.header} aria-label="Site header">
          <nav className={styles.nav} aria-label="Primary navigation">
            <a className={styles.brand} href="/" aria-label="Go to home">
              The Genuine Love Project
            </a>
            <div className={styles.navLinks} aria-label="Quick links">
              <a href="/healing">Healing</a>
              <a href="/pricing">Pricing</a>
              <a href="/dashboard">Dashboard</a>
            </div>
          </nav>
        </header>

        <main id="main" className={styles.main} tabIndex={-1}>
          {children}
        </main>

        <footer className={styles.footer} aria-label="Site footer">
          <div className={styles.footerInner}>
            <span>© {new Date().getFullYear()} The Genuine Love Project</span>
            <span className={styles.footerLinks}>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/support">Support</a>
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);
}

export default function SacredLayout({
  title,
  description,
  children,
  navVariant = "default"
}) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 900,
      easing: "ease-out-cubic",
      offset: 80,
      disable: reducedMotion
    });
  }, [reducedMotion]);

  return (
    <>
      <Head>
        <title>{title || "The Genuine Love Project"}</title>
        <meta name="description" content={description || ""} />
        <meta property="og:title" content={title || "The Genuine Love Project"} />
        <meta property="og:description" content={description || ""} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>

      {/* Sacred background layers */}
      <div className={styles.canvas} aria-hidden="true">
        <div className={styles.patternLayer} />
        <div className={styles.auraLayer} />
        <div className={styles.vignetteLayer} />
      </div>

      <div className={styles.shell}>
        <header className={styles.header} role="banner" aria-label="Primary header">
          <nav className={styles.nav} aria-label="Primary navigation">
            <a className={styles.brand} href="/" aria-label="Go to homepage">
              The Genuine Love Project
            </a>

            <div className={styles.navLinks} data-variant={navVariant}>
              <a className={styles.navLink} href="/healing">
                Healing
              </a>
              <a className={styles.navLink} href="/pricing">
                Pricing
              </a>
              <a className={styles.navLink} href="/login">
                Login
              </a>
            </div>
          </nav>
        </header>

        <main id="main" className={styles.main} role="main">
          {children}
        </main>
      </div>
    </>
  );
}