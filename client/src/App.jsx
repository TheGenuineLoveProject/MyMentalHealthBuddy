import { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import ThemeProvider from "./components/ui/theme-provider.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SkipLink } from "./components/SkipLink.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

// Eagerly loaded critical pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Error404 from "./pages/Error404.jsx";

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const JournalPage = lazy(() => import("./pages/JournalPage.jsx"));
const AIChatPage = lazy(() => import("./pages/AIChatPage.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const HealthPage = lazy(() => import("./pages/HealthPage.jsx"));
const CrisisResources = lazy(() => import("./pages/CrisisResources.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" aria-hidden="true"></div>
        <p className="text-white">Loading...</p>
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
        <Route component={Error404} />
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
