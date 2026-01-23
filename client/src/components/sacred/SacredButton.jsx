/**
 * SacredButton.jsx - CSS Module-based Sacred Button Component
 * 
 * Features:
 * - CSS Modules ONLY (no Tailwind)
 * - GSAP hover animation (disabled for reduced motion)
 * - Icons scaled ~0.7
 * - Accessibility with focus-visible
 */

import { forwardRef, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'wouter';
import styles from './SacredButton.module.css';

const SacredButton = forwardRef(function SacredButton(
  {
    children,
    variant = 'primary',
    size = 'default',
    href,
    onClick,
    disabled = false,
    icon,
    iconPosition = 'right',
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

  const sizeClass = {
    small: styles.sm,
    default: '',
    large: styles.lg,
  }[size] || '';

  const variantClass = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
  }[variant] || styles.primary;

  const buttonClassName = `${styles.button} ${variantClass} ${sizeClass} ${disabled ? styles.disabled : ''} ${className}`.trim();

  const testId = `button-${children?.toString().toLowerCase().replace(/\s+/g, '-') || 'action'}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className={styles.icon} aria-hidden="true">
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
          className={buttonClassName}
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
        className={buttonClassName}
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
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled}
      {...commonProps}
    >
      {content}
    </button>
  );
});

export default SacredButton;
