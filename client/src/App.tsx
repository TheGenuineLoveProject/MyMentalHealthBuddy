import { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const MoodPage = lazy(() => import("./pages/MoodPage"));
const AIChat = lazy(() => import("./pages/AIChat"));
const Journal = lazy(() => import("./pages/Journal"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Error404 = lazy(() => import("./pages/Error404"));

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingButton from "./components/FloatingButton";
import ChatWidget from "./components/ChatWidget";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PageSkeleton } from "./components/LoadingSkeleton";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/Toast";
import { SkipLink } from "./components/SkipLink";

function AppContent() {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  const hideChatRoutes = ["/login", "/register", "/chat"];
  const showChatWidget = !hideChatRoutes.includes(location.pathname);

  return (
    <div data-testid="app-container">
      <SkipLink />
      {showNavbar && <Navbar />}

      <main id="main-content" role="main" tabIndex={-1}>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <AIChat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </main>

      {showChatWidget && (
        <>
          {!showChat && <FloatingButton onOpen={() => setShowChat(true)} isOpen={showChat} />}
          {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
