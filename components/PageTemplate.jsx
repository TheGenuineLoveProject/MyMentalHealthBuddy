// /components/PageTemplate.jsx
import SacredLayout from "./Layout";
import HeroSection from "./Hero";
import SacredSection from "./SacredSection";
import PlatformComponent from "./PlatformComponent";
import SacredFooter from "./SacredFooter";
import SacredButton from "./SacredButton";
import AuthTemplate from "./AuthTemplate";
// /components/PageTemplate.jsx
import React, { useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";
import styles from "./PageTemplate.module.css";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PageTemplate({ config }) {
  const motionOK = useMemo(() => !prefersReducedMotion(), []);

  useEffect(() => {
    // AOS: once true (required)
    AOS.init({
      once: true,
      duration: 650,
      easing: "ease-out",
      offset: 24,
    });
  }, []);

  useEffect(() => {
    if (!motionOK) return;

    // Subtle “breathe” on logo (transform/opacity only)
    const el = document.querySelector("[data-sacred-logo]");
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, { scale: 1.015, duration: 3.6, ease: "sine.inOut" })
      .to(el, { rotate: 0.8, duration: 3.6, ease: "sine.inOut" }, 0);

    return () => tl.kill();
  }, [motionOK]);

  const {
    title,
    description,
    heroTitle,
    heroCopy,
    primaryCta,
    secondaryCta,
    modules = [],
    sections = [],
  } = config || {};

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>

      <header className={styles.header} role="banner">
        <nav className={styles.nav} aria-label="Primary navigation">
          <div className={styles.brand}>
            <img
              src="/logo.svg"
              alt="The Genuine Love Project"
              className={styles.logo}
              data-sacred-logo
            />
            <span className={styles.brandName}>The Genuine Love Project</span>
          </div>

          <div className={styles.navLinks} role="group" aria-label="Primary links">
            <a className={styles.navLink} href="/healing">Healing</a>
            <a className={styles.navLink} href="/wellness">Wellness</a>
            <a className={styles.navLink} href="/pricing">Pricing</a>
            <a className={styles.navLink} href="/login">Login</a>
          </div>
        </nav>
      </header>

      <main id="main" className={styles.main} role="main">
        {/* SEO-friendly heading structure */}
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.heroInner}>
            <p className={styles.kicker} data-aos="fade-up">
              {description}
            </p>
            <h1 className={styles.h1} data-aos="fade-up">
              {heroTitle || title}
            </h1>
            <p className={styles.lede} data-aos="fade-up">
              {heroCopy}
            </p>

            <div className={styles.ctas} role="group" aria-label="Primary actions" data-aos="fade-up">
              {primaryCta?.href && (
                <a className={styles.primaryBtn} href={primaryCta.href}>
                  {primaryCta.label || "Continue"}
                </a>
              )}
              {secondaryCta?.href && (
                <a className={styles.ghostBtn} href={secondaryCta.href}>
                  {secondaryCta.label || "Learn more"}
                </a>
              )}
            </div>
          </div>
        </section>

        {modules?.length > 0 && (
          <section className={styles.moduleWrap} aria-label="Highlights">
            <div className={styles.moduleGrid}>
              {modules.map((m, idx) => (
                <article
                  key={`${m.title}-${idx}`}
                  className={styles.moduleCard}
                  data-aos="fade-up"
                >
                  {m.icon ? (
                    <img
                      src={m.icon}
                      alt=""
                      aria-hidden="true"
                      className={styles.icon}
                    />
                  ) : null}
                  <h3 className={styles.h3}>{m.title}</h3>
                  <p className={styles.body}>{m.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {sections?.map((s, i) => (
          <section
            key={`${s.title}-${i}`}
            className={`${styles.section} ${styles[`variant_${s.variant || "plain"}`]}`}
            aria-label={s.title}
            id={s.id || undefined}
          >
            <div className={styles.sectionInner}>
              {s.eyebrow ? (
                <p className={styles.eyebrow} data-aos="fade-up">
                  {s.eyebrow}
                </p>
              ) : null}
              <h2 className={styles.h2} data-aos="fade-up">
                {s.title}
              </h2>
              {s.subtitle ? (
                <p className={styles.subtitle} data-aos="fade-up">
                  {s.subtitle}
                </p>
              ) : null}

              {Array.isArray(s.bullets) && s.bullets.length > 0 && (
                <ul className={styles.bullets} data-aos="fade-up">
                  {s.bullets.map((b, bi) => (
                    <li key={`${b}-${bi}`}>{b}</li>
                  ))}
                </ul>
              )}

              {Array.isArray(s.cards) && s.cards.length > 0 && (
                <div className={styles.cardGrid}>
                  {s.cards.map((c, ci) => (
                    <article key={`${c.title}-${ci}`} className={styles.card} data-aos="fade-up">
                      <h3 className={styles.h3}>{c.title}</h3>
                      <p className={styles.body}>{c.text}</p>
                    </article>
                  ))}
                </div>
              )}

              {s.cta?.href && (
                <div className={styles.sectionCta} data-aos="fade-up">
                  <a className={styles.primaryBtn} href={s.cta.href}>
                    {s.cta.label || "Continue"}
                  </a>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <p className={styles.caption}>
            If you’re feeling overwhelmed, you’re not alone. This platform is designed to be steady, gentle, and practical.
          </p>
          <div className={styles.footerLinks} aria-label="Footer links">
            <a className={styles.footerLink} href="/privacy">Privacy</a>
            <a className={styles.footerLink} href="/terms">Terms</a>
            <a className={styles.footerLink} href="/support">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PageTemplate({ config }) {
  return (
    <SacredLayout title={config.title} description={config.description}>
      <HeroSection
        eyebrow={config.hero?.eyebrow}
        title={config.hero?.title}
        copy={config.hero?.copy}
        primaryCta={config.hero?.primaryCta}
        secondaryCta={config.hero?.secondaryCta}
      />

      {config.modules?.length ? (
        <section className={styles.moduleWrap} aria-label="Module highlights">
          <div className={styles.moduleInner} data-aos="fade-up">
            <div className={styles.moduleGrid} role="list" aria-label="Module cards">
              {config.modules.map((m) => (
                <div key={m.title} role="listitem">
                  <PlatformComponent iconSrc={m.icon} title={m.title} text={m.text} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {config.sections?.map((s) => (
        <SacredSection
          key={`${s.eyebrow || ""}-${s.title || ""}`}
          id={s.id}
          eyebrow={s.eyebrow}
          title={s.title}
          subtitle={s.subtitle}
          bullets={s.bullets}
          cards={s.cards}
          variant={s.variant || "plain"}
          aos="fade-up"
        />
      ))}

      <SacredFooter />
    </SacredLayout>
  );
}