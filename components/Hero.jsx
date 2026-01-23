import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SacredButton from "./SacredButton";
import styles from "./Hero.module.css";

export default function HeroSection({
  eyebrow,
  title,
  copy,
  primaryCta,
  secondaryCta
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    const q = gsap.utils.selector(root);
    gsap.set(q("[data-hero]"), { opacity: 0, y: 10 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.9 } });
    tl.to(q("[data-hero='logo']"), { opacity: 1, y: 0 }, 0.0)
      .to(q("[data-hero='text']"), { opacity: 1, y: 0 }, 0.1)
      .to(q("[data-hero='cta']"), { opacity: 1, y: 0 }, 0.2);

    gsap.to(q("[data-logo-glow]"), {
      rotate: 360,
      duration: 28,
      ease: "none",
      repeat: -1
    });
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} aria-label="Hero section">
      <div className={styles.inner}>
        <div className={styles.logoWrap} data-hero="logo">
          <div className={styles.logoAura} data-logo-glow aria-hidden="true" />
          <Image
            src="/logo.svg"
            alt="The Genuine Love Project"
            width={112}
            height={112}
            priority
            className={styles.logo}
          />
        </div>

        <div data-hero="text">
          {eyebrow ? <p className="t-caption caps" data-aos="fade-up">{eyebrow}</p> : null}
          <h1 className="t-title" data-aos="fade-up">{title}</h1>
          <p className="t-body heroCopy" data-aos="fade-up">{copy}</p>
        </div>

        <div
          className={styles.ctaRow}
          data-hero="cta"
          role="group"
          aria-label="Primary calls to action"
        >
          {primaryCta ? (
            <SacredButton href={primaryCta.href} ariaLabel={primaryCta.label}>
              {primaryCta.label}
            </SacredButton>
          ) : null}

          {secondaryCta ? (
            <SacredButton href={secondaryCta.href} variant="ghost" ariaLabel={secondaryCta.label}>
              {secondaryCta.label}
            </SacredButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}