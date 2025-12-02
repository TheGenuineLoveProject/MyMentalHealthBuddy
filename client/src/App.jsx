import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeProvider from "./components/ui/theme-provider.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

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
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/mood" element={
              <ProtectedRoute><MoodPage /></ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute><JournalPage /></ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute><AIChatPage /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}