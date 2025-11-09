import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { getMobileVisibleItems, getMobileMoreItems } from '@/lib/navigationStructure';
/**
 * Mobile Navigation Component
 * Responsive bottom navigation for mobile devices with categorized "More" menu
 */
export function MobileNav() {
    const [location] = useLocation();
    const [showMore, setShowMore] = useState(false);
    const mainItems = getMobileVisibleItems();
    const moreCategories = getMobileMoreItems();
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 safe-bottom", "data-testid": "mobile-nav", role: "navigation", "aria-label": "Mobile navigation", children: _jsxs("div", { className: "grid grid-cols-5 h-16", children: [mainItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location === item.path;
                            return (_jsxs(Link, { href: item.path, className: `flex flex-col items-center justify-center gap-1 transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'}`, "data-testid": `mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`, "aria-label": `Navigate to ${item.label}`, "aria-current": isActive ? 'page' : undefined, children: [_jsx(Icon, { className: "h-5 w-5", "aria-hidden": "true" }), _jsx("span", { className: "text-xs font-medium", children: item.label })] }, item.path));
                        }), _jsxs("button", { onClick: () => setShowMore(!showMore), className: "flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors", "data-testid": "mobile-nav-more", "aria-label": showMore ? 'Close more menu' : 'Open more menu', "aria-expanded": showMore, children: [showMore ? _jsx(X, { className: "h-5 w-5", "aria-hidden": "true" }) : _jsx(Menu, { className: "h-5 w-5", "aria-hidden": "true" }), _jsx("span", { className: "text-xs font-medium", children: "More" })] })] }) }), showMore && (_jsx("div", { className: "lg:hidden fixed inset-0 bg-black/50 z-30", onClick: () => setShowMore(false), "data-testid": "mobile-nav-overlay", role: "presentation", children: _jsx("div", { className: "absolute bottom-16 left-0 right-0 bg-background border-t border-border p-4 max-h-[70vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), "data-testid": "mobile-nav-more-menu", children: _jsx("div", { className: "max-w-md mx-auto space-y-6", children: moreCategories.map((category) => (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-muted-foreground mb-3 px-2", "data-testid": `mobile-category-${category.id}`, children: category.label }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: category.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location === item.path;
                                        return (_jsxs(Link, { href: item.path, onClick: () => setShowMore(false), className: `flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${isActive
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-border hover:border-primary/50'}`, "data-testid": `mobile-more-${item.label.toLowerCase().replace(/\s+/g, '-')}`, "aria-label": `Navigate to ${item.label}`, "aria-current": isActive ? 'page' : undefined, children: [_jsx(Icon, { className: "h-6 w-6", "aria-hidden": "true" }), _jsx("span", { className: "text-sm font-medium text-center", children: item.label }), item.description && (_jsx("span", { className: "text-xs text-muted-foreground text-center line-clamp-2", children: item.description }))] }, item.path));
                                    }) })] }, category.id))) }) }) })), _jsx("div", { className: "lg:hidden h-16", "aria-hidden": "true" })] }));
}
