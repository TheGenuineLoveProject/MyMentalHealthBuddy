import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Skip Navigation Link
 * Allows keyboard users to skip directly to main content
 */
export function SkipNavigation() {
    return (_jsx("a", { href: "#main-content", className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg", "data-testid": "link-skip-navigation", children: "Skip to main content" }));
}
