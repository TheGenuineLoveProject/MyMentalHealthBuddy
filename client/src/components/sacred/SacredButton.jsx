import { forwardRef, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'wouter';

const SacredButton = forwardRef(function SacredButton(
  {
    children,
    variant = 'primary',
    size = 'default',
    href,
    onClick,
    disabled = false,
    icon,
    iconPosition = 'left',
    className = '',
    type = 'button',
    animate = true,
    ariaLabel,
    ...props
  },
  ref
) {
  const buttonRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion.current || !animate || disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion.current || !animate || disabled) return;
    
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const sizeClasses = {
    small: 'py-2 px-4 text-sm',
    default: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  };

  const baseClassName = `
    sacred-button
    sacred-button--${variant}
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const testId = `button-${children?.toString().toLowerCase().replace(/\s+/g, '-') || 'action'}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="sacred-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="sacred-icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  const commonProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'data-testid': testId,
    'aria-label': ariaLabel,
    ...props
  };

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a
          ref={(el) => {
            buttonRef.current = el;
            if (ref) ref.current = el;
          }}
          href={href}
          className={baseClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...commonProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        ref={(el) => {
          buttonRef.current = el;
          if (ref) ref.current = el;
        }}
        className={baseClassName}
        {...commonProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={(el) => {
        buttonRef.current = el;
        if (ref) ref.current = el;
      }}
      type={type}
      className={baseClassName}
      onClick={onClick}
      disabled={disabled}
      {...commonProps}
    >
      {content}
    </button>
  );
});

export default SacredButton;
