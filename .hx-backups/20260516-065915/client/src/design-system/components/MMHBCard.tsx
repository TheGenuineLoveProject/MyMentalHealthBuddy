/**
 * Phase 12 — Canonical card. ALL platform cards MUST use this component.
 *
 * Elevations: resting · elevated · floating
 *
 * Rules:
 *  - radius.xl (16px)
 *  - background: rgba(255,255,255,0.78) (NEVER pure white)
 *  - shadow sm → hover on hover (resting/elevated when interactive)
 *  - 500ms gentle transition
 *  - Honors prefers-reduced-motion at runtime
 *  - Composes with consumer hover handlers (does not override them)
 */

import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import {
  semantic,
  radiusFor,
  shadowFor,
  card as cardSpacing,
  transition,
} from "../tokens";

export type MMHBCardElevation = "resting" | "elevated" | "floating";

interface MMHBCardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: MMHBCardElevation;
  /** When true, card lifts on hover (resting/elevated only). */
  interactive?: boolean;
  /** Override default 48px padding when content needs flush edges. */
  flush?: boolean;
  children: ReactNode;
}

const shadowForElevation: Record<MMHBCardElevation, string> = {
  resting: shadowFor.cardResting,
  elevated: shadowFor.cardElevated,
  floating: shadowFor.cardFloating,
};

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

export const MMHBCard = forwardRef<HTMLDivElement, MMHBCardProps>(
  function MMHBCard(props, ref) {
    const {
      elevation = "resting",
      interactive = false,
      flush = false,
      style,
      className,
      children,
      onMouseEnter: userMouseEnter,
      onMouseLeave: userMouseLeave,
      ...rest
    } = props;

    const reducedMotion = useReducedMotion();
    const restingShadow = shadowForElevation[elevation];
    const canLift = interactive && elevation !== "floating";

    const baseStyle: CSSProperties = {
      background:
        elevation === "floating" ? semantic.bgCardElevated : semantic.bgCard,
      borderRadius: radiusFor.card,
      boxShadow: restingShadow,
      padding: flush ? 0 : cardSpacing.padding,
      border: `1px solid ${semantic.borderSubtle}`,
      transition: reducedMotion
        ? "none"
        : `${transition.cardLift}, ${transition.colorWash}`,
      backdropFilter: "saturate(1.05)",
      WebkitBackdropFilter: "saturate(1.05)",
      ...style,
    };

    const onMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
      if (canLift && !reducedMotion) {
        e.currentTarget.style.boxShadow = shadowFor.cardElevated;
        e.currentTarget.style.transform = "translateY(-2px)";
      }
      userMouseEnter?.(e);
    };
    const onMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
      if (canLift) {
        e.currentTarget.style.boxShadow = restingShadow;
        e.currentTarget.style.transform = "translateY(0)";
      }
      userMouseLeave?.(e);
    };

    return (
      <div
        ref={ref}
        data-mmhb-card-elevation={elevation}
        data-mmhb-card-interactive={interactive ? "true" : "false"}
        data-mmhb-reduced-motion={reducedMotion ? "true" : "false"}
        className={className}
        style={baseStyle}
        {...rest}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  },
);
