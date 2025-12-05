import { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from '@tanstack/react-query';
import { Heart } from "lucide-react";

const clientSrcPath = "../../client/src";

import { queryClient } from "../../client/src/lib/queryClient.js";
import ThemeProvider from "../../client/src/components/ui/theme-provider.jsx";
import { AuthProvider, useAuth } from "../../client/src/context/AuthContext.jsx";
import { GamificationProvider } from "../../client/src/context/GamificationContext.jsx";
import { SkipLink } from "../../client/src/components/SkipLink.jsx";
import { ErrorBoundary } from "../../client/src/components/ErrorBoundary.jsx";

import Home from "../../client/src/pages/Home.jsx";
import Login from "../../client/src/pages/Login.jsx";
import Register from "../../client/src/pages/Register.jsx";
import ForgotPassword from "../../client/src/pages/ForgotPassword.jsx";
import ResetPassword from "../../client/src/pages/ResetPassword.jsx";
import NotFound from "../../client/src/pages/NotFound.jsx";

const Dashboard = lazy(() => import("../../client/src/pages/Dashboard.jsx"));
const MoodPage = lazy(() => import("../../client/src/pages/MoodPage.jsx"));
const JournalPage = lazy(() => import("../../client/src/pages/JournalPage.jsx"));
const AIChatPage = lazy(() => import("../../client/src/pages/AIChatPage.jsx"));
const Analytics = lazy(() => import("../../client/src/pages/Analytics.jsx"));
const HealthPage = lazy(() => import("../../client/src/pages/HealthPage.jsx"));
const CrisisResources = lazy(() => import("../../client/src/pages/CrisisResources.jsx"));
const Settings = lazy(() => import("../../client/src/pages/Settings.jsx"));
const Wellness = lazy(() => import("../../client/src/pages/Wellness.jsx"));
const Premium = lazy(() => import("../../client/src/pages/Premium.jsx"));

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
        <Route path="/premium">
          <ProtectedRoute><Premium /></ProtectedRoute>
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
        <GamificationProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <SkipLink />
              <main id="main-content" tabIndex={-1} className="outline-none">
                <AppRoutes />
              </main>
            </ErrorBoundary>
          </ThemeProvider>
        </GamificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
