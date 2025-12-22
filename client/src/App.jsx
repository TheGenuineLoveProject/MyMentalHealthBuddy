import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import RouteGuard from "./components/RouteGuard.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import HealthPage from "./pages/HealthPage.jsx";
import DesignDashboard from "./pages/DesignDashboard.jsx";
import Blog from "./pages/Blog.jsx";
import Publishing from "./pages/Publishing.jsx";
import SocialHub from "./pages/SocialHub.jsx";
import ControlDashboard from "./pages/ControlDashboard.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import React from "react";
import BrandShell from "./components/BrandShell.jsx";
import React from "react";
import BrandShell from "./components/BrandShell.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  return (
    <BrandShell>
      <Dashboard />
    </BrandShell>
  );
}

export default function App() {
  return (
    <BrandShell>
      <main className="card">
        <h2>Welcome home.</h2>
        <p className="muted">
          A calm place to check in, reflect, and grow—one gentle step at a time.
        </p>

        <div className="hr" />

        <h2>Today’s 60-second check-in</h2>
        <p className="muted">
          What are you feeling most right now—and what do you need most next?
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <button className="btn btn-primary">Begin</button>
          <button className="btn">I just want to browse</button>
        </div>
      </main>
    </BrandShell>
  );
}
const BlogEditor = lazy(() => import("./pages/BlogEditor.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
// add a route:
// <Route path="/dashboard/design" element={<DesignDashboard />} />
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const JournalPage = lazy(() => import("./pages/JournalPage.jsx"));
const AIChatPage = lazy(() => import("./pages/AIChatPage.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const CrisisResources = lazy(() => import("./pages/CrisisResources.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Wellness = lazy(() => import("./pages/Wellness.jsx"));
const Premium = lazy(() => import("./pages/Premium.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Upgrade = lazy(() => import("./pages/Upgrade.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            {/* Public routes */}
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/health" component={HealthPage} />
            <Route path="/blog" component={Blog} />
            <Route path="/publishing" component={Publishing} />
            <Route path="/social" component={SocialHub} />
            <Route path="/control" component={ControlDashboard} />
            
            {/* Blog routes */}
            <Route path="/blog" component={BlogIndex} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/write">
              <RouteGuard>
                <BlogEditor />
              </RouteGuard>
            </Route>

            {/* Onboarding - protected but before main app */}
            <Route path="/onboarding">
              <RouteGuard>
                <Onboarding />
              </RouteGuard>
            </Route>

            {/* Protected routes */}
            <Route path="/dashboard">
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            </Route>
            <Route path="/mood">
              <RouteGuard>
                <MoodPage />
              </RouteGuard>
            </Route>
            <Route path="/journal">
              <RouteGuard>
                <JournalPage />
              </RouteGuard>
            </Route>
            <Route path="/chat">
              <RouteGuard>
                <AIChatPage />
              </RouteGuard>
            </Route>
            <Route path="/analytics">
              <RouteGuard>
                <Analytics />
              </RouteGuard>
            </Route>
            <Route path="/crisis">
              <RouteGuard>
                <CrisisResources />
              </RouteGuard>
            </Route>
            <Route path="/wellness">
              <RouteGuard>
                <Wellness />
              </RouteGuard>
            </Route>
            <Route path="/premium">
              <RouteGuard>
                <Premium />
              </RouteGuard>
            </Route>
            <Route path="/settings">
              <RouteGuard>
                <Settings />
              </RouteGuard>
            </Route>
            <Route path="/pricing" component={Pricing} />
            <Route path="/upgrade">
              <RouteGuard>
                <Upgrade />
              </RouteGuard>
            </Route>
            <Route path="/admin">
              <RouteGuard>
                <Admin />
              </RouteGuard>
            </Route>

            {/* Fallback */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}
