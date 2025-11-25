import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  // fetch recent mood history
  useEffect(() => {
    fetch("/mood/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.history || []))
      .catch(() => setHistory([]));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Dashboard</h1>

      <h2
        style={{
          marginTop: "2rem",
          marginBottom: "1rem",
          fontSize: "1.3rem",
          fontWeight: 600,
        }}
      >
        Recent Mood Trends
      </h2>

      {/* If no data */}
      {history.length === 0 && (
        <p style={{ color: "#888" }}>
          You have no mood history yet. Go save your first mood!
        </p>
      )}

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((entry) => {
          const date = new Date(entry.createdAt).toLocaleString();
          return (
            <li
              key={entry.id}
              style={{
                padding: "0.75rem",
                marginBottom: "0.75rem",
                borderRadius: "8px",
                background: "#fafafa",
                border: "1px solid #ddd",
              }}
            >
              <div style={{ fontWeight: 600 }}>Mood: {entry.mood}/10</div>
              <div style={{ fontSize: "0.9rem" }}>{date}</div>
              {entry.notes && (
                <div style={{ marginTop: "0.5rem", color: "#444" }}>
                  Notes: {entry.notes}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <a
        href="/mood"
        style={{
          marginTop: "2rem",
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          background: "#4e8cff",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go to Mood Tracker →
      </a>
    </div>
  );
}