import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

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

  const variantStyles = {
    default: {
      background: 'var(--sacred-white, #faf9f7)',
      border: '1px solid rgba(143, 191, 159, 0.2)',
    },
    sage: {
      background: 'rgba(143, 191, 159, 0.08)',
      border: '1px solid rgba(143, 191, 159, 0.25)',
    },
    rose: {
      background: 'rgba(244, 199, 195, 0.08)',
      border: '1px solid rgba(244, 199, 195, 0.25)',
    },
    teal: {
      background: 'rgba(47, 93, 93, 0.05)',
      border: '1px solid rgba(47, 93, 93, 0.2)',
    },
  };

  return (
    <article
      ref={cardRef}
      className={`platform-component ${className}`}
      style={{
        ...variantStyles[variant],
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 20px rgba(47, 93, 93, 0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-aos="sacred-fade-up"
      data-aos-delay={aosDelay}
      data-testid={`platform-${title?.toLowerCase().replace(/\s+/g, '-') || 'component'}`}
    >
      {icon && (
        <div 
          className="platform-icon mb-4"
          style={{ 
            color: 'var(--sacred-teal, #2f5d5d)',
          }}
          aria-hidden="true"
        >
          <span className="sacred-icon-lg">{icon}</span>
        </div>
      )}
      
      {title && (
        <h3 
          className="sacred-section-header mb-2"
          style={{ color: 'var(--sacred-teal, #2f5d5d)' }}
        >
          {title}
        </h3>
      )}
      
      {description && (
        <p 
          className="sacred-body"
          style={{ color: 'var(--sacred-charcoal, #3a3a3a)' }}
        >
          {description}
        </p>
      )}
      
      {children}
    </article>
  );
}
