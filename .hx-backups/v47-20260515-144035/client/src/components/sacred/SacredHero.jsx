import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function SacredHero({
  logo,
  title,
  subtitle,
  children,
  className = '',
  logoClassName = '',
  animateLogo = true,
}) {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion.current && animateLogo && logoRef.current) {
      gsap.to(logoRef.current, {
        keyframes: [
          { scale: 1, filter: 'drop-shadow(0 0 8px rgba(234, 195, 59, 0.3))' },
          { scale: 1.02, filter: 'drop-shadow(0 0 16px rgba(234, 195, 59, 0.5))' },
          { scale: 1, filter: 'drop-shadow(0 0 8px rgba(234, 195, 59, 0.3))' },
        ],
        duration: 4,
        repeat: -1,
        ease: 'power1.inOut',
      });
    }
  }, [animateLogo]);

  return (
    <section 
      ref={heroRef}
      className={`sacred-hero ${className}`}
      data-testid="sacred-hero"
      role="banner"
    >
      {logo && (
        <div 
          ref={logoRef}
          className={`sacred-hero-logo ${logoClassName}`}
          data-aos="sacred-scale"
          data-aos-delay="100"
        >
          {typeof logo === 'string' ? (
            <img src={logo} alt="Logo" className="w-full h-auto" />
          ) : (
            logo
          )}
        </div>
      )}
      
      {title && (
        <h1 
          className="sacred-hero-title"
          data-aos="sacred-fade-up"
          data-aos-delay="200"
        >
          {title}
        </h1>
      )}
      
      {subtitle && (
        <p 
          className="sacred-hero-subtitle"
          data-aos="sacred-fade-up"
          data-aos-delay="300"
        >
          {subtitle}
        </p>
      )}
      
      {children && (
        <div 
          className="sacred-hero-actions"
          data-aos="sacred-fade-up"
          data-aos-delay="400"
        >
          {children}
        </div>
      )}
    </section>
  );
}
