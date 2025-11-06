import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { allNavItems } from "@/lib/navigationStructure";
export function Navigation() {
    const [location] = useLocation();
    // Show ALL navigation items on desktop (14 total)
    // System items (Billing, Account) can be accessed from nav
    const mainNavItems = allNavItems;
    return (_jsxs("nav", { className: "bg-blue-600 dark:bg-blue-900 text-white shadow-lg", role: "navigation", "aria-label": "Main navigation", children: [_jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-between h-16 gap-4", children: [_jsx("h1", { className: "text-lg font-bold flex-shrink-0", children: _jsxs(Link, { href: "/", "aria-label": "MyMentalHealthBuddy - Home", "data-testid": "link-logo", children: [_jsx("span", { className: "hidden xl:inline", children: "MyMentalHealthBuddy" }), _jsx("span", { className: "xl:hidden", children: "MMHB" })] }) }), _jsx("div", { className: "hidden lg:flex items-center gap-1 flex-1 justify-center overflow-x-auto scrollbar-hide", role: "menubar", "aria-label": "Main menu", style: { scrollbarWidth: 'none', msOverflowStyle: 'none' }, children: mainNavItems.map(({ path, label, icon: Icon, category }) => {
                                const isActive = location === path;
                                return (_jsx(Link, { href: path, "data-testid": `link-${label.toLowerCase().replace(/\s+/g, '-')}`, "aria-label": `Navigate to ${label}`, "aria-current": isActive ? 'page' : undefined, role: "menuitem", children: _jsxs("span", { className: `flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition text-xs xl:text-sm whitespace-nowrap ${isActive
                                            ? "bg-blue-700 dark:bg-blue-800 font-semibold"
                                            : "hover:bg-blue-500 dark:hover:bg-blue-700"} ${
                                        // Add visual separator between categories
                                        category === 'professional' && mainNavItems.findIndex(item => item.path === path) === 4
                                            ? 'ml-2'
                                            : category === 'tools' && mainNavItems.findIndex(item => item.path === path) === 8
                                                ? 'ml-2'
                                                : category === 'system' && mainNavItems.findIndex(item => item.path === path) === 12
                                                    ? 'ml-2'
                                                    : ''}`, title: label, children: [_jsx(Icon, { size: 14, "aria-hidden": "true", className: "flex-shrink-0" }), _jsx("span", { className: "hidden 2xl:inline", children: label })] }) }, path));
                            }) }), _jsx("div", { className: "flex-shrink-0", "aria-label": "Theme settings", children: _jsx(ThemeToggle, {}) })] }) }), _jsx("style", { children: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      ` })] }));
}
