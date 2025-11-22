// client/src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import JournalPage from "./pages/JournalPage.jsx";
import MoodPage from "./pages/MoodPage.jsx";
import AIPage from "./pages/AIPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AuthTestPage from "./pages/AuthTestPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth-test" element={<AuthTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;