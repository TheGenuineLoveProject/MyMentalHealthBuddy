import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ui/theme-provider.jsx";

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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/chat" element={<AIChatPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}