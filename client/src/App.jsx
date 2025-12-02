import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import ThemeProvider from "./components/ui/theme-provider.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SkipLink } from "./components/SkipLink.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MoodPage from "./pages/MoodPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";
import Analytics from "./pages/Analytics.jsx";
import HealthPage from "./pages/HealthPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";
import Error404 from "./pages/Error404.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  
  return children;
}

function AppRoutes() {
  return (
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
      <Route path="/health" component={HealthPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/settings">
        <ProtectedRoute><Settings /></ProtectedRoute>
      </Route>
      <Route component={Error404} />
    </Switch>
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
