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
import Publishing from "./pages/Publishing.jsx";
import SocialHub from "./pages/SocialHub.jsx";
import ControlDashboard from "./pages/ControlDashboard.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import Landing from "./pages/landing/Landing.jsx";
import Ethics from "./pages/legal/Ethics.jsx";
import Disclaimer from "./pages/legal/Disclaimer.jsx";

const BlogEditor = lazy(() => import("./pages/BlogEditor.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MoodPage = lazy(() => import("./pages/MoodPage.jsx"));
const StatePage = lazy(() => import("./pages/StatePage.jsx"));
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
const DailyFlow = lazy(() => import("./features/daily/DailyFlow.tsx"));
const MirrorPage = lazy(() => import("./pages/MirrorPage.jsx"));
const CommunityPage = lazy(() => import("./features/community/SharedReflectionsPage.jsx"));
const TodayPage = lazy(() => import("./features/today/TodayPage.jsx"));
const ToolsPage = lazy(() => import("./pages/ToolsPage.tsx"));

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
        <ErrorBoundary>
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
              <Route path="/publishing" component={Publishing} />
              <Route path="/social" component={SocialHub} />
              <Route path="/control" component={ControlDashboard} />
              <Route path="/pricing" component={Pricing} />
              
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
              <Route path="/today">
                <RouteGuard>
                  <DailyFlow />
                </RouteGuard>
              </Route>
              <Route path="/mood">
                <RouteGuard>
                  <MoodPage />
                </RouteGuard>
              </Route>
              <Route path="/state">
                <RouteGuard>
                  <StatePage />
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
              <Route path="/mirror">
                <RouteGuard>
                  <MirrorPage />
                </RouteGuard>
              </Route>
              <Route path="/community">
                <RouteGuard>
                  <CommunityPage />
                </RouteGuard>
              </Route>
              <Route path="/tools">
                <RouteGuard>
                  <ToolsPage />
                </RouteGuard>
              </Route>

              {/* Legal routes */}
              <Route path="/ethics" component={Ethics} />
              <Route path="/disclaimer" component={Disclaimer} />

              {/* Fallback */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}
