import React, { useState } from "react";
import { Link } from "wouter";

export default function MoodPage() {
  const [mood, setMood] = useState("");

  const submitMood = async () => {
    await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });
    alert("Mood saved!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Record Mood</h1>

      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="How are you feeling?"
        style={{ padding: "0.5rem", width: "300px" }}
      />

      <button
        onClick={submitMood}
        style={{ display: "block", marginTop: "1rem", padding: "0.5rem" }}
      >
        Save Mood
      </button>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}