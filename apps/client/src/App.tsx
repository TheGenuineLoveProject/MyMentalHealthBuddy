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
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/SignupPage").then(m => ({ default: m.SignupPage })));
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

  return (
    <CanvaProvider>
        <div className="min-h-screen bg-gradient-mesh">
          <NavigationProgress />
          <SkipNavigation />
          <Navigation />
          <main id="main-content" className="container mx-auto px-4 py-6" tabIndex={-1}>
            <Breadcrumbs />
            <AccessibilityAnnouncer message="" />
            <Suspense fallback={<LoadingOverlay message="Loading page..." />}>
              <Switch>
              <Route path="/login">
                <PageErrorBoundary pageName="Login">
                  <LoginPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/signup">
                <PageErrorBoundary pageName="Signup">
                  <SignupPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/">
                <PageErrorBoundary pageName="Dashboard">
                  <DashboardPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/chat">
                <PageErrorBoundary pageName="AI Chat">
                  <ChatPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/mood">
                <PageErrorBoundary pageName="Mood Tracker">
                  <MoodPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/journal">
                <PageErrorBoundary pageName="Journal">
                  <JournalPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/resources">
                <PageErrorBoundary pageName="Resources">
                  <ResourcesPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/crisis">
                <PageErrorBoundary pageName="Crisis Support">
                  <CrisisPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/billing">
                <PageErrorBoundary pageName="Billing">
                  <BillingPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/account">
                <PageErrorBoundary pageName="Account">
                  <AccountPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/designs">
                <PageErrorBoundary pageName="Designs">
                  <DesignsPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/studio">
                <PageErrorBoundary pageName="Content Studio">
                  <StudioPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/social">
                <PageErrorBoundary pageName="Social Calendar">
                  <SocialCalendarPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/analytics">
                <PageErrorBoundary pageName="Analytics">
                  <AnalyticsPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/performance">
                <PageErrorBoundary pageName="Performance">
                  <PerformancePage />
                </PageErrorBoundary>
              </Route>
              <Route path="/productivity">
                <PageErrorBoundary pageName="Productivity">
                  <ProductivityPage />
                </PageErrorBoundary>
              </Route>
              <Route path="/design-system">
                <PageErrorBoundary pageName="Design System">
                  <DesignSystemPage />
                </PageErrorBoundary>
              </Route>
              <Route>
                <div className="container mx-auto px-4 py-16">
                  <div className="text-center max-w-md mx-auto animate-slide-in-up">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Page Not Found</h1>
                    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                    <a href="/" className="btn-primary inline-flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Go Home
                    </a>
                  </div>
                </div>
              </Route>
            </Switch>
          </Suspense>
        </main>
        <MobileNav />
        <OfflineIndicator />
        <WebVitalsMonitor />
        <ToastContainer toasts={toasts} position="top-right" />
        <KeyboardShortcuts />
      </div>
    </CanvaProvider>
  );
}

export default function App() {
  return (
    <PageErrorBoundary pageName="Application">
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </PageErrorBoundary>
  );
}

