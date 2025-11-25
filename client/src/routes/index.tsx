import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MoodPage from "../pages/MoodPage";
import Dashboard from "../pages/Dashboard";

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

// This component only defines the top-level routes
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

export default function MoodTracker() {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  async function submitMood() {
    if (mood === null) return;

    await fetch("/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, notes })
    });

    alert("Mood saved!");
    setMood(null);
    setNotes("");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mood Tracker</h1>

      <div style={{ margin: "1rem 0" }}>
        <label>Your mood today:</label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood ?? 5}
          onChange={(e) => setMood(Number(e.target.value))}
        />
        <div>Selected: {mood}</div>
      </div>

      <textarea
        placeholder="Write notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />

      <button onClick={submitMood}>Save Mood</button>
    </div>
  );
}