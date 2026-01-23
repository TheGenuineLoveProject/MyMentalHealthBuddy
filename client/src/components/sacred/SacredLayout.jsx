import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function SacredLayout({ children, className = '', showPattern = true }) {
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
    <div 
      ref={layoutRef}
      className={`sacred-layout ${className}`}
      data-testid="sacred-layout"
    >
      {showPattern && (
        <div className="sacred-pattern-overlay" aria-hidden="true" />
      )}
      
      <div className="sacred-content">
        {children}
      </div>
    </div>
  );
}
