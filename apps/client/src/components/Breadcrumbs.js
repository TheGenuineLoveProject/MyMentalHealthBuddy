import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { allNavItems } from '@/lib/navigationStructure';
export function Breadcrumbs() {
    const [location] = useLocation();
    // Parse path into breadcrumb items
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs = [
        { label: 'Home', path: '/' }
    ];
    // Build breadcrumb trail using unified navigation structure
    let currentPath = '';
    pathSegments.forEach(segment => {
        currentPath += `/${segment}`;
        // Find the page in our navigation structure for accurate labeling
        const navItem = allNavItems.find(item => item.path === currentPath);
        if (navItem) {
            breadcrumbs.push({
                label: navItem.label,
                path: currentPath,
                category: navItem.category
            });
        }
        else {
            // Fallback for dynamic routes not in navigation
            breadcrumbs.push({
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                path: currentPath
            });
        }
    });
    // Don't show breadcrumbs on home page
    if (breadcrumbs.length <= 1) {
        return null;
    }
    // Mobile: Show only last 2 items for space efficiency
    const mobileBreadcrumbs = breadcrumbs.length > 2
        ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
        : breadcrumbs;
    return (_jsxs(_Fragment, { children: [_jsx("nav", { "aria-label": "Breadcrumb", className: "mb-4 hidden lg:block", "data-testid": "breadcrumbs-nav", children: _jsx("ol", { className: "flex items-center flex-wrap gap-2 text-sm text-muted-foreground", children: breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;
                        return (_jsxs("li", { className: "flex items-center", "data-testid": `breadcrumb-${index}`, children: [index > 0 && (_jsx(ChevronRight, { className: "h-4 w-4 mx-2 flex-shrink-0", "aria-hidden": "true" })), isLast ? (_jsxs("span", { className: "font-medium text-foreground flex items-center", "aria-current": "page", "data-testid": "breadcrumb-current", children: [isFirst && _jsx(Home, { className: "h-4 w-4 inline mr-1.5 flex-shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "truncate max-w-[200px]", children: crumb.label }), crumb.category && (_jsx("span", { className: "ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary capitalize", children: crumb.category }))] })) : (_jsxs(Link, { href: crumb.path, className: "hover:text-foreground transition-colors flex items-center group", "data-testid": `breadcrumb-link-${index}`, "aria-label": `Navigate to ${crumb.label}`, children: [isFirst && _jsx(Home, { className: "h-4 w-4 inline mr-1.5 flex-shrink-0 group-hover:scale-110 transition-transform", "aria-hidden": "true" }), _jsx("span", { className: "truncate max-w-[150px]", children: crumb.label })] }))] }, crumb.path));
                    }) }) }), _jsx("nav", { "aria-label": "Breadcrumb", className: "mb-3 lg:hidden", "data-testid": "breadcrumbs-nav-mobile", children: _jsx("ol", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: mobileBreadcrumbs.map((crumb, index) => {
                        const isLast = index === mobileBreadcrumbs.length - 1;
                        const isFirst = index === 0;
                        const showEllipsis = breadcrumbs.length > 2 && index === 0 && mobileBreadcrumbs.length === 2;
                        return (_jsxs("li", { className: "flex items-center", "data-testid": `breadcrumb-mobile-${index}`, children: [showEllipsis && _jsx("span", { className: "mx-1", children: "..." }), index > 0 && !showEllipsis && (_jsx(ChevronRight, { className: "h-3 w-3 mx-1 flex-shrink-0", "aria-hidden": "true" })), isLast ? (_jsxs("span", { className: "font-medium text-foreground flex items-center truncate max-w-[150px]", "aria-current": "page", "data-testid": "breadcrumb-mobile-current", children: [isFirst && !showEllipsis && _jsx(Home, { className: "h-3 w-3 inline mr-1 flex-shrink-0", "aria-hidden": "true" }), crumb.label] })) : (_jsxs(Link, { href: crumb.path, className: "hover:text-foreground transition-colors flex items-center", "data-testid": `breadcrumb-mobile-link-${index}`, "aria-label": `Navigate to ${crumb.label}`, children: [isFirst && _jsx(Home, { className: "h-3 w-3 inline mr-1 flex-shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "truncate max-w-[100px]", children: !isFirst || crumb.label })] }))] }, crumb.path));
                    }) }) })] }));
}
