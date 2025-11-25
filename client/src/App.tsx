import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MoodPage from "./pages/MoodPage";
import AIChat from "./pages/AIChat";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingButton from "./components/FloatingButton";
import ChatWidget from "./components/ChatWidget";

function AppContent() {
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  const hideChatRoutes = ["/login", "/register", "/chat"];
  const showChatWidget = !hideChatRoutes.includes(location.pathname);

  return (
    <div data-testid="app-container">
      {showNavbar && <Navbar />}

      <main id="main-content" role="main">
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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
