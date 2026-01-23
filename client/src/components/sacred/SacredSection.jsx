import { useRef, useEffect } from 'react';

export default function SacredSection({
  children,
  className = '',
  id,
  aosAnimation = 'sacred-fade-up',
  aosDelay = 0,
  aosDuration = 800,
  variant = 'default',
  as: Component = 'section',
}) {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const variantStyles = {
    default: {},
    sage: { background: 'var(--glp-sage-10)' },
    rose: { background: 'var(--glp-rose-10)' },
    paper: { background: 'var(--glp-paper)' },
    teal: { background: 'var(--glp-sage-deep-12)' },
  };

  return (
    <Component
      ref={sectionRef}
      id={id}
      className={`sacred-section ${className}`}
      style={variantStyles[variant]}
      data-aos={aosAnimation}
      data-aos-delay={aosDelay}
      data-aos-duration={aosDuration}
      data-testid={id ? `section-${id}` : 'sacred-section'}
    >
      <div className="sacred-section-inner">
        {children}
      </div>
    </Component>
  );
}
