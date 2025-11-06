import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Navigation } from "./components/Navigation";
import { LoadingOverlay } from "./components/LoadingSpinner";
import { CanvaProvider } from "./contexts/CanvaContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { PageErrorBoundary } from "./components/PageErrorBoundary";
import { ToastContainer } from "./components/Toast";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { MobileNav } from "./components/MobileNav";
import { SkipNavigation } from "./components/SkipNavigation";
import { AccessibilityAnnouncer } from "./components/AccessibilityAnnouncer";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { WebVitalsMonitor } from "./components/WebVitalsMonitor";
import { NavigationProgress } from "./components/NavigationProgress";
import { initializeCsrf } from "./lib/csrf";
import { routePrefetcher } from "./lib/route-prefetcher";
// Code Splitting: Lazy load pages for better initial bundle size
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ChatPage = lazy(() => import("./pages/ChatPage").then(m => ({ default: m.ChatPage })));
const MoodPage = lazy(() => import("./pages/MoodPage").then(m => ({ default: m.MoodPage })));
const JournalPage = lazy(() => import("./pages/JournalPage").then(m => ({ default: m.JournalPage })));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const CrisisPage = lazy(() => import("./pages/CrisisPage").then(m => ({ default: m.CrisisPage })));
const BillingPage = lazy(() => import("./pages/BillingPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const DesignsPage = lazy(() => import("./pages/DesignsPage"));
const StudioPage = lazy(() => import("./pages/StudioPage"));
const SocialCalendarPage = lazy(() => import("./pages/SocialCalendarPage"));
const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const PerformancePage = lazy(() => import("./pages/PerformancePage"));
const ProductivityPage = lazy(() => import("./pages/ProductivityPage"));
function AppContent() {
    const { toasts } = useToast();
    const [location] = useLocation();
    // 360° Security: Initialize CSRF token on app load
    useEffect(() => {
        initializeCsrf().catch((error) => {
            console.warn('[App] CSRF initialization failed:', error);
        });
    }, []);
    // 360° Performance: Track route changes for intelligent prefetching
    useEffect(() => {
        routePrefetcher.trackRouteVisit(location);
    }, [location]);
    return (_jsx(CanvaProvider, { children: _jsxs("div", { className: "min-h-screen bg-gradient-mesh", children: [_jsx(NavigationProgress, {}), _jsx(SkipNavigation, {}), _jsx(Navigation, {}), _jsxs("main", { id: "main-content", className: "container mx-auto px-4 py-6", tabIndex: -1, children: [_jsx(Breadcrumbs, {}), _jsx(AccessibilityAnnouncer, { message: "" }), _jsx(Suspense, { fallback: _jsx(LoadingOverlay, { message: "Loading page..." }), children: _jsxs(Switch, { children: [_jsx(Route, { path: "/", children: _jsx(PageErrorBoundary, { pageName: "Dashboard", children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/chat", children: _jsx(PageErrorBoundary, { pageName: "AI Chat", children: _jsx(ChatPage, {}) }) }), _jsx(Route, { path: "/mood", children: _jsx(PageErrorBoundary, { pageName: "Mood Tracker", children: _jsx(MoodPage, {}) }) }), _jsx(Route, { path: "/journal", children: _jsx(PageErrorBoundary, { pageName: "Journal", children: _jsx(JournalPage, {}) }) }), _jsx(Route, { path: "/resources", children: _jsx(PageErrorBoundary, { pageName: "Resources", children: _jsx(ResourcesPage, {}) }) }), _jsx(Route, { path: "/crisis", children: _jsx(PageErrorBoundary, { pageName: "Crisis Support", children: _jsx(CrisisPage, {}) }) }), _jsx(Route, { path: "/billing", children: _jsx(PageErrorBoundary, { pageName: "Billing", children: _jsx(BillingPage, {}) }) }), _jsx(Route, { path: "/account", children: _jsx(PageErrorBoundary, { pageName: "Account", children: _jsx(AccountPage, {}) }) }), _jsx(Route, { path: "/designs", children: _jsx(PageErrorBoundary, { pageName: "Designs", children: _jsx(DesignsPage, {}) }) }), _jsx(Route, { path: "/studio", children: _jsx(PageErrorBoundary, { pageName: "Content Studio", children: _jsx(StudioPage, {}) }) }), _jsx(Route, { path: "/social", children: _jsx(PageErrorBoundary, { pageName: "Social Calendar", children: _jsx(SocialCalendarPage, {}) }) }), _jsx(Route, { path: "/analytics", children: _jsx(PageErrorBoundary, { pageName: "Analytics", children: _jsx(AnalyticsPage, {}) }) }), _jsx(Route, { path: "/performance", children: _jsx(PageErrorBoundary, { pageName: "Performance", children: _jsx(PerformancePage, {}) }) }), _jsx(Route, { path: "/productivity", children: _jsx(PageErrorBoundary, { pageName: "Productivity", children: _jsx(ProductivityPage, {}) }) }), _jsx(Route, { path: "/design-system", children: _jsx(PageErrorBoundary, { pageName: "Design System", children: _jsx(DesignSystemPage, {}) }) }), _jsx(Route, { children: _jsx("div", { className: "container mx-auto px-4 py-16", children: _jsxs("div", { className: "text-center max-w-md mx-auto animate-slide-in-up", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-3", children: "Page Not Found" }), _jsx("p", { className: "text-gray-600 mb-6", children: "The page you're looking for doesn't exist or has been moved." }), _jsxs("a", { href: "/", className: "btn-primary inline-flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }), "Go Home"] })] }) }) })] }) })] }), _jsx(MobileNav, {}), _jsx(OfflineIndicator, {}), _jsx(WebVitalsMonitor, {}), _jsx(ToastContainer, { toasts: toasts, position: "top-right" }), _jsx(KeyboardShortcuts, {})] }) }));
}
export default function App() {
    return (_jsx(PageErrorBoundary, { pageName: "Application", children: _jsx(ToastProvider, { children: _jsx(AppContent, {}) }) }));
}
