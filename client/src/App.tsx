import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MoodPage from "./pages/MoodPage";
import JournalPage from "./pages/JournalPage";
import AIPage from "./pages/AIPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
    </Layout>
  );
}