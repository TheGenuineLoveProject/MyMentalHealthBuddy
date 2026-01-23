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
  showDivider = false,
  ariaLabel,
}) {
  const sectionRef = useRef(null);

  const variantStyles = {
    default: {},
    sage: { background: 'rgba(143, 191, 159, 0.08)' },
    rose: { background: 'rgba(244, 199, 195, 0.08)' },
    paper: { background: 'var(--sacred-white, #faf9f7)' },
    teal: { background: 'rgba(47, 93, 93, 0.05)' },
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
      aria-label={ariaLabel}
    >
      <div className="sacred-section-inner">
        {children}
      </div>
      
      {showDivider && (
        <div className="sacred-divider" aria-hidden="true" />
      )}
    </Component>
  );
}
