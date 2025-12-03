import { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import ThemeProvider from "./components/ui/theme-provider.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SkipLink } from "./components/SkipLink.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { Heart } from "lucide-react";

// Eagerly loaded critical pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const JournalPage = lazy(() => import("./pages/JournalPage.jsx"));
const AIChatPage = lazy(() => import("./pages/AIChatPage.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const HealthPage = lazy(() => import("./pages/HealthPage.jsx"));
const CrisisResources = lazy(() => import("./pages/CrisisResources.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Wellness = lazy(() => import("./pages/Wellness.jsx"));

// Premium loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-teal)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "150ms" }}></div>
      </div>
      <div className="text-center relative z-10 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-violet)] flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Heart className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <div className="w-8 h-8 border-3 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-4" aria-hidden="true"></div>
        <p className="text-[var(--text-secondary)] font-medium">Loading your wellness space...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </Route>
        <Route path="/mood">
          <ProtectedRoute><MoodPage /></ProtectedRoute>
        </Route>
        <Route path="/journal">
          <ProtectedRoute><JournalPage /></ProtectedRoute>
        </Route>
        <Route path="/chat">
          <ProtectedRoute><AIChatPage /></ProtectedRoute>
        </Route>
        <Route path="/analytics">
          <ProtectedRoute><Analytics /></ProtectedRoute>
        </Route>
        <Route path="/crisis">
          <ProtectedRoute><CrisisResources /></ProtectedRoute>
        </Route>
        <Route path="/wellness">
          <ProtectedRoute><Wellness /></ProtectedRoute>
        </Route>
        <Route path="/health">
          <Suspense fallback={<PageLoader />}><HealthPage /></Suspense>
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/settings">
          <ProtectedRoute><Settings /></ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <SkipLink />
            <main id="main-content" tabIndex={-1} className="outline-none">
              <AppRoutes />
            </main>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
