import { forwardRef } from 'react';
import { Link } from 'wouter';

// PHASE114S_FIX_SHARED_BUTTON_ACCESSIBLE_ARIA_DISABLED_PATCH
const variants = {
  primary: 'bg-[var(--glp-sage-deep)] text-white hover:bg-[var(--glp-teal-600)] focus-visible:ring-[var(--glp-gold)]',
  secondary: 'border-2 border-[var(--glp-sage-deep)] text-[var(--glp-sage-deep)] bg-transparent hover:bg-[var(--glp-sage-10)] focus-visible:ring-[var(--glp-gold)]',
  ghost: 'text-[var(--glp-sage-deep)] bg-transparent hover:bg-[var(--glp-sage-10)] focus-visible:ring-[var(--glp-sage)]',
  gold: 'bg-[var(--glp-gold)] text-[var(--glp-ink)] hover:bg-[var(--glp-gold-dark)] focus-visible:ring-[var(--glp-sage-deep)]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
};

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    href,
    disabled = false,
    className = '',
    children,
    onClick,
    tabIndex,
    type = 'button',
    ...props
  },
  ref
) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    transition-colors motion-safe:transition-transform motion-safe:hover:scale-[1.02]
    [&[aria-disabled="true"]]:opacity-60 [&[aria-disabled="true"]]:pointer-events-none
  `.trim();

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  const isDisabled = Boolean(disabled);
  const disabledProps = isDisabled
    ? { 'aria-disabled': 'true', 'data-disabled': 'true', tabIndex: -1 }
    : { 'data-disabled': 'false', tabIndex };

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  if (href) {
    return (
      <Link href={href}>
        <a
          ref={ref}
          className={classes}
          {...props}
          {...disabledProps}
          onClick={handleClick}
        >
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={classes}
      {...props}
      {...disabledProps}
      type={type}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});

export default Button;
