/**
 * Phase 12 — Canonical button. ALL platform buttons MUST use this component.
 *
 * Variants: primary (eternalGold) · secondary (sage) · tertiary (text-only sage)
 * Disabled state: blur(2px) — NEVER grayed out.
 *
 * Rules:
 *  - 48px min-height (touch target — applies to ALL variants per spec)
 *  - radius.md (8px)
 *  - shadow xs → hover on hover (resting variants only; tertiary stays flat)
 *  - 200ms standard ease transition
 *  - Visible focus ring (sage, 3px)
 *  - Honors prefers-reduced-motion at runtime (transitions disabled, hover transform skipped)
 */

import {
  forwardRef,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEventHandler,
  type FocusEventHandler,
  type ReactNode,
} from "react";
import {
  palette,
  fonts,
  body as bodyType,
  radiusFor,
  shadowFor,
  spacing,
  transition,
} from "../tokens";

export type MMHBButtonVariant = "primary" | "secondary" | "tertiary";
export type MMHBButtonSize = "sm" | "md" | "lg";

interface MMHBButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MMHBButtonVariant;
  size?: MMHBButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

const heightFor: Record<MMHBButtonSize, string> = {
  sm: "48px", // spec: ALL buttons ≥ 48px touch target
  md: "48px",
  lg: "56px",
};

const padFor: Record<MMHBButtonSize, string> = {
  sm: `0 ${spacing.md}`,
  md: `0 ${spacing.lg}`,
  lg: `0 ${spacing.xl}`,
};

const fontFor: Record<MMHBButtonSize, { size: string; weight: number }> = {
  sm: { size: bodyType.sm.size, weight: 500 },
  md: { size: bodyType.md.size, weight: 500 },
  lg: { size: bodyType.lg.size, weight: 500 },
};

function variantStyle(
  variant: MMHBButtonVariant,
  isDisabled: boolean,
): CSSProperties {
  if (variant === "primary") {
    return {
      background: palette.eternalGold,
      color: palette.deepForest,
      border: "1px solid transparent",
    };
  }
  if (variant === "secondary") {
    return {
      background: "transparent",
      color: palette.deepForest,
      border: `1px solid ${palette.primarySage}`,
    };
  }
  // tertiary — text-only, no shadow, but min-height + padding preserved
  return {
    background: "transparent",
    color: palette.primarySage,
    border: "1px solid transparent",
    boxShadow: "none",
    textDecoration: isDisabled ? "none" : "underline",
    textUnderlineOffset: "4px",
    textDecorationThickness: "1px",
  };
}

/** SSR-safe reduced-motion subscription. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export const MMHBButton = forwardRef<HTMLButtonElement, MMHBButtonProps>(
  function MMHBButton(props, ref) {
    const {
      variant = "primary",
      size = "md",
      fullWidth = false,
      iconLeft,
      iconRight,
      disabled,
      style,
      className,
      children,
      onMouseEnter: userMouseEnter,
      onMouseLeave: userMouseLeave,
      onFocus: userFocus,
      onBlur: userBlur,
      ...rest
    } = props;

    const isDisabled = !!disabled;
    const isTertiary = variant === "tertiary";
    const f = fontFor[size];
    const reducedMotion = useReducedMotion();

    const baseStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      minHeight: heightFor[size],
      padding: padFor[size],
      fontFamily: fonts.body,
      fontSize: f.size,
      fontWeight: f.weight,
      lineHeight: 1,
      letterSpacing: "0.01em",
      borderRadius: radiusFor.button,
      boxShadow: shadowFor.buttonResting,
      cursor: isDisabled ? "not-allowed" : "pointer",
      width: fullWidth ? "100%" : undefined,
      transition: reducedMotion
        ? "none"
        : `${transition.hover}, ${transition.cardLift}, ${transition.focusRing}`,
      filter: isDisabled ? "blur(2px) saturate(0.85)" : undefined,
      opacity: isDisabled ? 0.85 : 1,
      pointerEvents: isDisabled ? "none" : "auto",
      WebkitTapHighlightColor: "transparent",
      userSelect: "none",
      outline: "none",
      ...variantStyle(variant, isDisabled),
      ...style,
    };

    const onMouseEnter: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (!isDisabled && !isTertiary && !reducedMotion) {
        e.currentTarget.style.boxShadow = shadowFor.buttonHover;
        e.currentTarget.style.transform = "translateY(-1px)";
      }
      userMouseEnter?.(e);
    };
    const onMouseLeave: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (!isDisabled && !isTertiary) {
        e.currentTarget.style.boxShadow = shadowFor.buttonResting;
        e.currentTarget.style.transform = "translateY(0)";
      }
      userMouseLeave?.(e);
    };
    const onFocus: FocusEventHandler<HTMLButtonElement> = (e) => {
      if (!isDisabled) {
        e.currentTarget.style.boxShadow = `${shadowFor.focus}, ${
          isTertiary ? "none" : shadowFor.buttonResting
        }`;
      }
      userFocus?.(e);
    };
    const onBlur: FocusEventHandler<HTMLButtonElement> = (e) => {
      if (!isDisabled) {
        e.currentTarget.style.boxShadow = isTertiary
          ? "none"
          : shadowFor.buttonResting;
      }
      userBlur?.(e);
    };

    return (
      <button
        ref={ref}
        type={rest.type ?? "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        data-mmhb-button-variant={variant}
        data-mmhb-button-size={size}
        data-mmhb-reduced-motion={reducedMotion ? "true" : "false"}
        className={className}
        style={baseStyle}
        {...rest}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {iconLeft && (
          <span aria-hidden="true" style={{ display: "inline-flex" }}>
            {iconLeft}
          </span>
        )}
        <span>{children}</span>
        {iconRight && (
          <span aria-hidden="true" style={{ display: "inline-flex" }}>
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);
