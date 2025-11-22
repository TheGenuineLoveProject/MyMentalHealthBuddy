// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProtectedTest from "./pages/ProtectedTest";
import AnalyticsPage from "./pages/AnalyticsPage";
import AITestPage from "./pages/AITestPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/protected-test" element={<ProtectedTest />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-test" element={<AITestPage />} />
      </Routes>
    </Layout>
  );
}