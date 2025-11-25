import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import MoodPage from "../pages/MoodPage";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Journal from "../pages/Journal";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import AIChat from "../pages/AIChat";
import Error404 from "../pages/Error404";

export default function RoutesIndex() {
  return (
    <>
      {/* Navigation header */}
      <header
        style={{
          padding: "1rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={{ fontWeight: 600, color: "#4f46e5", textDecoration: "none" }}>
          MyMentalHealthBuddy
        </Link>
        <nav style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "#374151" }}>Dashboard</Link>
          <Link to="/mood" style={{ textDecoration: "none", color: "#374151" }}>Mood</Link>
          <Link to="/journal" style={{ textDecoration: "none", color: "#374151" }}>Journal</Link>
          <Link to="/chat" style={{ textDecoration: "none", color: "#374151" }}>AI Chat</Link>
          <Link to="/analytics" style={{ textDecoration: "none", color: "#374151" }}>Analytics</Link>
          <Link to="/settings" style={{ textDecoration: "none", color: "#374151" }}>Settings</Link>
        </nav>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to="/login" style={{ textDecoration: "none", color: "#4f46e5" }}>Login</Link>
          <Link to="/register" style={{ textDecoration: "none", color: "#4f46e5" }}>Register</Link>
        </div>
      </header>

      {/* Page content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
    </>
  );
}