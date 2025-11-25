import { Routes, Route, Link } from "react-router-dom";
import Home from "../pages/Home";
import MoodPage from "../pages/MoodPage";
import Dashboard from "../pages/Dashboard";

export default function RoutesIndex() {
  return (
    <>
      {/* Simple top nav */}
      <header
        style={{
          padding: "1rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: "1rem",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/mood">Mood Tracker</Link>
        <Link to="/dashboard">Dashboard</Link>
      </header>

      {/* Page content */}
      <main style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
}