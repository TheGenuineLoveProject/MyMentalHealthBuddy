import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import AITestPage from "./pages/AITestPage.jsx";
import ProtectedTestPage from "./pages/ProtectedTestPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import MoodPage from "./pages/MoodPage.jsx";
import About from "./pages/About.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/ai-test" element={<AITestPage />} />
      <Route path="/protected" element={<ProtectedTestPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
