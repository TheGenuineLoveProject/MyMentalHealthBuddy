/**
 * PlatformComponent.jsx - CSS Module-based Sacred Card Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - GSAP hover animation (disabled for reduced motion)
 * - Icons scaled ~0.7
 * - Typography using Playfair + Inter
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './PlatformComponent.module.css';

export default function PlatformComponent({
  icon,
  title,
  description,
  children,
  className = '',
  variant = 'default',
  aosDelay = 0,
}) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion.current) return;
    
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: '0 12px 40px rgba(47, 93, 93, 0.15)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion.current) return;
    
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 4px 20px rgba(47, 93, 93, 0.08)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const variantClass = {
    default: '',
    sage: styles.variantSage,
    rose: styles.variantRose,
    teal: styles.variantTeal,
  }[variant] || '';

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${variantClass} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      data-testid={`platform-${title?.toLowerCase().replace(/\s+/g, '-') || 'component'}`}
    >
      {icon && (
        <div className={styles.iconWrapper} aria-hidden="true">
          <span className={styles.icon}>{icon}</span>
        </div>
      )}
      
      {title && (
        <h3 className={styles.title}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}
      
      {children}
    </article>
  );
}
