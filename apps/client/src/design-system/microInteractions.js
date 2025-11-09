/**
 * Micro-Interaction Library
 *
 * Reusable animation primitives for therapeutic UI interactions
 * Respects reduced-motion preferences and uses design tokens
 *
 * Based on therapeutic motion principles:
 * - 4-7-8 breathing rhythm for calm transitions
 * - Reduced-motion support for accessibility
 * - Predictable, gentle animations that reduce cognitive load
 */
import React from 'react';
import { foundational } from '@shared/design-system/tokens';
/**
 * Get reduced motion preference
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined')
        return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
/**
 * Helper to convert duration strings (e.g., '150ms') to numbers
 */
function parseDuration(duration) {
    return parseInt(duration.replace('ms', ''), 10);
}
/**
 * Transition configuration based on design tokens
 */
export const transitions = {
    instant: {
        duration: parseDuration(foundational.motion.duration.instant),
        durationString: foundational.motion.duration.instant,
        easing: foundational.motion.easing.linear,
    },
    fast: {
        duration: parseDuration(foundational.motion.duration.fast),
        durationString: foundational.motion.duration.fast,
        easing: foundational.motion.easing.easeOut,
    },
    base: {
        duration: parseDuration(foundational.motion.duration.base),
        durationString: foundational.motion.duration.base,
        easing: foundational.motion.easing.easeInOut,
    },
    slow: {
        duration: parseDuration(foundational.motion.duration.slow),
        durationString: foundational.motion.duration.slow,
        easing: foundational.motion.easing.calm,
    },
    slower: {
        duration: parseDuration(foundational.motion.duration.slower),
        durationString: foundational.motion.duration.slower,
        easing: foundational.motion.easing.calm,
    },
    breath: {
        duration: parseDuration(foundational.motion.duration.breath),
        durationString: foundational.motion.duration.breath,
        easing: foundational.motion.easing.calm,
    },
};
/**
 * Get transition string for CSS
 * Automatically respects reduced-motion preference
 */
export function getTransition(property, speed = 'base') {
    if (prefersReducedMotion()) {
        return 'none';
    }
    const props = Array.isArray(property) ? property : [property];
    const config = transitions[speed];
    return props
        .map(prop => `${prop} ${config.duration}ms ${config.easing}`)
        .join(', ');
}
/**
 * Hover state utilities (lazy evaluation for reduced-motion support)
 */
export const hoverStates = {
    lift: () => ({
        default: {
            transform: 'translateY(0)',
            boxShadow: foundational.shadow.base,
        },
        hover: {
            transform: prefersReducedMotion() ? 'translateY(0)' : 'translateY(-2px)',
            boxShadow: foundational.shadow.lg,
        },
        transition: getTransition(['transform', 'box-shadow'], 'fast'),
    }),
    scale: () => ({
        default: {
            transform: 'scale(1)',
        },
        hover: {
            transform: prefersReducedMotion() ? 'scale(1)' : 'scale(1.05)',
        },
        transition: getTransition('transform', 'fast'),
    }),
    glow: () => ({
        default: {
            boxShadow: foundational.shadow.base,
        },
        hover: {
            boxShadow: prefersReducedMotion()
                ? foundational.shadow.base
                : `${foundational.shadow.lg}, 0 0 20px rgba(14, 165, 233, 0.2)`,
        },
        transition: getTransition('box-shadow', 'base'),
    }),
    subtle: () => ({
        default: {
            opacity: 0.8,
        },
        hover: {
            opacity: 1,
        },
        transition: getTransition('opacity', 'fast'),
    }),
};
/**
 * Click feedback utilities (lazy evaluation for reduced-motion support)
 */
export const clickFeedback = {
    press: () => ({
        active: {
            transform: prefersReducedMotion() ? 'scale(1)' : 'scale(0.98)',
        },
        transition: getTransition('transform', 'instant'),
    }),
    ripple: () => ({
        initial: { opacity: 0, transform: 'scale(0)' },
        animate: { opacity: 1, transform: 'scale(1)' },
        exit: { opacity: 0 },
        transition: {
            duration: prefersReducedMotion() ? 0 : 600,
            easing: foundational.motion.easing.easeOut,
        },
    }),
};
/**
 * Loading state animations (lazy evaluation for reduced-motion support)
 */
export const loadingStates = {
    pulse: () => ({
        animate: prefersReducedMotion() ? undefined : {
            opacity: [0.5, 1, 0.5],
        },
        transition: {
            duration: 2000,
            repeat: Infinity,
            easing: foundational.motion.easing.easeInOut,
        },
    }),
    spin: () => ({
        animate: prefersReducedMotion() ? undefined : {
            rotate: [0, 360],
        },
        transition: {
            duration: 1000,
            repeat: Infinity,
            easing: foundational.motion.easing.linear,
        },
    }),
    breathe: () => ({
        animate: prefersReducedMotion() ? undefined : {
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
        },
        transition: {
            duration: 4000,
            repeat: Infinity,
            easing: foundational.motion.easing.calm,
        },
    }),
};
/**
 * Focus state utilities (WCAG compliant)
 */
export const focusStates = {
    default: {
        outline: `3px solid ${foundational.color.blue[500]}`,
        outlineOffset: '2px',
        boxShadow: `0 0 0 3px rgba(14, 165, 233, 0.1)`,
    },
    therapeutic: (mode) => {
        const modeColors = {
            serenity: foundational.color.blue[500],
            empowerment: foundational.color.coral[500],
            focus: foundational.color.neutral[600],
            recovery: foundational.color.violet[500],
        };
        // Convert HSL to HSLA with alpha channel
        const colorWithAlpha = (hslColor) => {
            return hslColor.replace('hsl(', 'hsla(').replace(')', ', 0.1)');
        };
        return {
            outline: `3px solid ${modeColors[mode]}`,
            outlineOffset: '2px',
            boxShadow: `0 0 0 3px ${colorWithAlpha(modeColors[mode])}`,
        };
    },
};
/**
 * Entry/exit animations (lazy evaluation for reduced-motion support)
 */
export const entryExitAnimations = {
    fadeIn: () => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: {
            duration: prefersReducedMotion() ? 0 : transitions.base.duration,
            easing: transitions.base.easing,
        },
    }),
    slideUp: () => ({
        initial: {
            opacity: 0,
            y: prefersReducedMotion() ? 0 : 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: prefersReducedMotion() ? 0 : -20
        },
        transition: {
            duration: prefersReducedMotion() ? 0 : transitions.base.duration,
            easing: transitions.base.easing,
        },
    }),
    slideDown: () => ({
        initial: {
            opacity: 0,
            y: prefersReducedMotion() ? 0 : -20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: prefersReducedMotion() ? 0 : 20
        },
        transition: {
            duration: prefersReducedMotion() ? 0 : transitions.base.duration,
            easing: transitions.base.easing,
        },
    }),
    scale: () => ({
        initial: {
            opacity: 0,
            scale: prefersReducedMotion() ? 1 : 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        exit: {
            opacity: 0,
            scale: prefersReducedMotion() ? 1 : 0.95
        },
        transition: {
            duration: prefersReducedMotion() ? 0 : transitions.fast.duration,
            easing: transitions.fast.easing,
        },
    }),
};
/**
 * Stagger animations for lists
 */
export function getStaggerConfig(itemCount, delay = 50) {
    if (prefersReducedMotion()) {
        return { staggerChildren: 0 };
    }
    return {
        staggerChildren: delay / 1000,
        delayChildren: 0.1,
    };
}
/**
 * React Hook: useReducedMotion
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion() {
    if (typeof window === 'undefined')
        return false;
    const [reducedMotion, setReducedMotion] = React.useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listener = (e) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
    }, []);
    return reducedMotion;
}
/**
 * React Hook: useHoverState
 * Manages hover state with reduced-motion awareness
 */
export function useHoverState() {
    const [isHovered, setIsHovered] = React.useState(false);
    const reducedMotion = useReducedMotion();
    return {
        isHovered: reducedMotion ? false : isHovered,
        hoverProps: {
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
        },
    };
}
/**
 * CSS class generators for common patterns
 */
export const cssHelpers = {
    /**
     * Generate hover lift classes
     */
    hoverLift: (enabled = true) => {
        if (!enabled || prefersReducedMotion()) {
            return 'transition-shadow duration-150';
        }
        return 'transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg';
    },
    /**
     * Generate focus ring classes
     */
    focusRing: (mode) => {
        const baseClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
        if (!mode) {
            return `${baseClasses} focus-visible:ring-blue-500`;
        }
        const modeClasses = {
            serenity: 'focus-visible:ring-blue-500',
            empowerment: 'focus-visible:ring-coral-500',
            focus: 'focus-visible:ring-neutral-600',
            recovery: 'focus-visible:ring-violet-500',
        };
        return `${baseClasses} ${modeClasses[mode]}`;
    },
    /**
     * Generate smooth transition classes
     * Maps token durations to Tailwind numeric suffixes
     */
    smoothTransition: (properties = ['all'], speed = 'base') => {
        const config = transitions[speed];
        const prop = properties.join('-');
        if (prefersReducedMotion()) {
            return 'transition-none';
        }
        // Map durations (ms) to Tailwind class suffixes
        const getDurationClass = (duration) => {
            switch (duration) {
                case 0: return '0';
                case 150: return '150';
                case 300: return '300';
                case 500: return '500';
                case 700: return '700';
                case 1000: return '1000';
                case 2000: return '[2000ms]';
                case 4000: return '[4000ms]';
                default: return '300';
            }
        };
        const durationClass = getDurationClass(config.duration);
        return `transition-${prop} duration-${durationClass}`;
    },
};
