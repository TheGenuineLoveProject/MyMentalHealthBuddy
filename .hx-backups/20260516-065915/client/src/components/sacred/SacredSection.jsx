/**
 * SacredSection.jsx - CSS Module-based Sacred Section Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - AOS animations with once:true
 * - Semantic HTML with accessibility
 */

import { useRef } from 'react';
import styles from './SacredSection.module.css';

export default function SacredSection({
  children,
  className = '',
  id,
  eyebrow,
  title,
  subtitle,
  aosDelay = 0,
  variant = 'default',
  as: Component = 'section',
  showDivider = false,
  ariaLabel,
}) {
  const sectionRef = useRef(null);

  const variantClass = {
    default: '',
    glow: styles.variantGlow,
    pattern: styles.variantPattern,
    alt: styles.variantAlt,
    sage: styles.variantSage,
    rose: styles.variantRose,
    teal: styles.variantTeal,
  }[variant] || '';

  return (
    <Component
      ref={sectionRef}
      id={id}
      className={`${styles.section} ${variantClass} ${className}`}
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      data-testid={id ? `section-${id}` : 'sacred-section'}
      aria-label={ariaLabel}
    >
      <div className={styles.sectionInner}>
        {(eyebrow || title || subtitle) && (
          <header className={styles.sectionHeader}>
            {eyebrow && (
              <p 
                className={styles.eyebrow}
                data-aos="fade-up"
                data-aos-delay={aosDelay + 50}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 
                className={styles.title}
                data-aos="fade-up"
                data-aos-delay={aosDelay + 100}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p 
                className={styles.subtitle}
                data-aos="fade-up"
                data-aos-delay={aosDelay + 150}
              >
                {subtitle}
              </p>
            )}
          </header>
        )}
        
        {children}
      </div>
      
      {showDivider && (
        <div className={styles.divider} aria-hidden="true" />
      )}
    </Component>
  );
}
