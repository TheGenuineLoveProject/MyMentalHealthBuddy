import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Navigation } from "./components/Navigation";
import { LoadingOverlay } from "./components/LoadingSpinner";
import { CanvaProvider } from "./contexts/CanvaContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastContainer } from "./components/Toast";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";

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

function AppContent() {
  const { toasts } = useToast();

  return (
    <CanvaProvider>
        <div className="min-h-screen bg-gradient-mesh">
          <Navigation />
          <main>
            <Suspense fallback={<LoadingOverlay message="Loading page..." />}>
              <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/chat" component={ChatPage} />
              <Route path="/mood" component={MoodPage} />
              <Route path="/journal" component={JournalPage} />
              <Route path="/resources" component={ResourcesPage} />
              <Route path="/crisis" component={CrisisPage} />
              <Route path="/billing" component={BillingPage} />
              <Route path="/account" component={AccountPage} />
              <Route path="/designs" component={DesignsPage} />
              <Route path="/studio" component={StudioPage} />
              <Route path="/social" component={SocialCalendarPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/performance" component={PerformancePage} />
              <Route path="/design-system" component={DesignSystemPage} />
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
        <ToastContainer toasts={toasts} position="top-right" />
        <KeyboardShortcuts />
      </div>
    </CanvaProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
