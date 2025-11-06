import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
/**
 * Navigation Progress Indicator
 * Shows a smooth loading bar during page transitions
 */
export function NavigationProgress() {
    const [location] = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        // Trigger navigation animation
        setIsNavigating(true);
        setProgress(0);
        // Simulate progress
        const timer1 = setTimeout(() => setProgress(30), 50);
        const timer2 = setTimeout(() => setProgress(70), 150);
        const timer3 = setTimeout(() => setProgress(100), 250);
        const timer4 = setTimeout(() => {
            setIsNavigating(false);
            setProgress(0);
        }, 400);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [location]);
    if (!isNavigating)
        return null;
    return (_jsx("div", { className: "fixed top-0 left-0 right-0 z-50 h-1 bg-blue-600/20", role: "progressbar", "aria-label": "Page loading", "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100, "data-testid": "navigation-progress", children: _jsx("div", { className: "h-full bg-blue-600 transition-all duration-300 ease-out shadow-lg", style: { width: `${progress}%` } }) }));
}
