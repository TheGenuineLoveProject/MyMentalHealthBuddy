import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import HealthPage from "./pages/HealthPage.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";
import MoodPage from "./pages/MoodPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <Link style={styles.link} to="/">AI Chat</Link>
        <Link style={styles.link} to="/mood">Mood</Link>
        <Link style={styles.link} to="/health">Health</Link>
      </nav>

      <div style={styles.pageContainer}>
        <Routes>
          <Route path="/" element={<AIChatPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/health" element={<HealthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "20px",
    padding: "15px",
    background: "#f8f8f8",
    borderBottom: "1px solid #ddd",
  },
  link: {
    fontSize: "18px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold"
  },
  pageContainer: {
    padding: "20px"
  }
};