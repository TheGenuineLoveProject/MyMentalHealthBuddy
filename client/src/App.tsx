// ─────────────────────────────────────────────
// FILE: client/src/App.tsx
// Main React app with routes + floating AI chat
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MoodPage from "./pages/MoodPage";
import AIChat from "./pages/AIChat";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import FloatingButton from "./components/FloatingButton";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Mood tracker is PROTECTED (requires token) */}
        <Route
          path="/mood"
          element={
            <ProtectedRoute>
              <MoodPage />
            </ProtectedRoute>
          }
        />

        {/* Full-page AI Chat (protected) */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Floating AI chat widget – always available when logged in */}
      {!showChat && <FloatingButton onOpen={() => setShowChat(true)} />}
      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
    </BrowserRouter>
  );
}