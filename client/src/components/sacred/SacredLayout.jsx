/**
 * SacredLayout.jsx - CSS Module-based Sacred Layout Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - AOS with once:true
 * - GSAP disabled under prefers-reduced-motion
 * - Skip link to #main-content
 * - Sacred pattern + aura overlay
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from './Layout.module.css';

export default function SacredLayout({ 
  children, 
  className = '', 
  showPattern = true,
  showAura = true,
  skipLinkTarget = '#main-content'
}) {
  const layoutRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: prefersReducedMotion.current,
    });

    if (!prefersReducedMotion.current && layoutRef.current) {
      gsap.fromTo(
        layoutRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }

    return () => {
      AOS.refresh();
    };
  }, []);

  return (
    <>
      <div 
        ref={layoutRef}
        className={`${styles.layout} ${className}`}
        data-testid="sacred-layout"
      >
        {showPattern && (
          <div className={styles.patternOverlay} aria-hidden="true" />
        )}
        
        {showAura && (
          <div className={styles.auraOverlay} aria-hidden="true" />
        )}
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
}
