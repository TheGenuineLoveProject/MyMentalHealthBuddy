import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MoodEntry = {
  id: string;
  mood: number;
  notes?: string;
  createdAt: string;
};

export default function Dashboard() {
  const [history, setHistory] = useState<MoodEntry[]>([]);

  // ---- FETCH RECENT MOOD HISTORY ----
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const res = await fetch("/mood/history", { headers });
        const data = await res.json();
        
        // Ensure history is always an array
        if (data && Array.isArray(data.history)) {
          setHistory(data.history);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Failed to load mood history:", err);
        setHistory([]);
      }
    };
    
    fetchHistory();
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

      {/* ---- IF NO DATA ---- */}
      {history.length === 0 && (
        <p style={{ color: "#888" }}>
          You have no mood history yet. Go save your first mood!
        </p>
      )}

      {/* ---- LIST ---- */}
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
              <div style={{ fontWeight: 600 }}>
                Mood: {entry.mood}/10
              </div>
              <div style={{ fontSize: "0.9rem", color: "#444" }}>{date}</div>

              {entry.notes && (
                <div style={{ marginTop: "0.5rem", color: "#444", fontSize: "0.85rem" }}>
                  Notes: {entry.notes}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* ---- FIXED BUTTON: ALWAYS GOES TO /mood ---- */}
      <Link
        to="/mood"
        style={{
          marginTop: "2rem",
          display: "inline-block",
          padding: "0.75rem 1.25rem",
          background: "#4e86ff",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go to Mood Tracker →
      </Link>
    </div>
  );
}