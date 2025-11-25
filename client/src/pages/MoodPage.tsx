import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

/* ---------------------------------------------
   Types
--------------------------------------------- */
type MoodEntry = {
  id: number;
  mood: number;
  notes: string;
  createdAt: string;
};

/* ---------------------------------------------
   Component
--------------------------------------------- */
export default function MoodPage() {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------------------------------------
     Save mood entry
  --------------------------------------------- */
  const submitMood = async () => {
    if (mood === null) return;

    setIsSaving(true);

    try {
      await fetch("/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ mood, notes }),
      });

      setMood(null);
      setNotes("");
      loadHistory();
    } catch (err) {
      console.error("Failed to save mood:", err);
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------------------------------
     Load history
  --------------------------------------------- */
  const loadHistory = async () => {
    try {
      const res = await fetch("/mood/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to load mood history:", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  /* ---------------------------------------------
     Mood labels
  --------------------------------------------- */
  const moodLabels = [
    { emo: "😢", text: "Very Low", color: "#d9534f" },
    { emo: "😞", text: "Low", color: "#d98b4f" },
    { emo: "😐", text: "Okay", color: "#f0ad4e" },
    { emo: "😊", text: "Good", color: "#5bc0de" },
    { emo: "😁", text: "Great", color: "#5cb85c" },
  ];

  const getLabel = (m: number) => {
    if (m <= 2) return moodLabels[0];
    if (m === 3) return moodLabels[1];
    if (m === 4 || m === 5) return moodLabels[2];
    if (m === 6 || m === 7) return moodLabels[3];
    return moodLabels[4];
  };

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Mood Tracker</h1>

      {/* --- LEFT SIDE (INPUT) --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "1.25rem",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            How are you feeling today?
          </h2>

          <label style={{ fontWeight: 600 }}>Your mood:</label>
          <input
            type="range"
            min={1}
            max={10}
            style={{ width: "100%", margin: "0.75rem 0" }}
            value={mood ?? ""}
            onChange={(e) => setMood(Number(e.target.value))}
          />

          {mood && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{getLabel(mood).emo}</span>
              <span
                style={{ fontWeight: 600, color: getLabel(mood).color }}
              >
                {getLabel(mood).text}
              </span>
            </div>
          )}

          <label style={{ fontWeight: 600 }}>Want to add a note?</label>
          <textarea
            placeholder="Example: Felt anxious this morning…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: "100%",
              height: "120px",
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "0.95rem",
            }}
          />

          <button
            onClick={submitMood}
            disabled={isSaving}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Mood"}
          </button>
        </div>

        {/* --- RIGHT SIDE (HISTORY) --- */}
        <div
          style={{
            padding: "1.25rem",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Recent check-ins
          </h2>

          {history.length === 0 && (
            <p style={{ fontSize: "0.9rem", color: "#667280" }}>
              No check-ins yet. Your next save will appear here.
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((entry) => {
              const lbl = getLabel(entry.mood);
              const date = new Date(entry.createdAt).toLocaleString();

              return (
                <li
                  key={entry.id}
                  style={{
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                    borderRadius: "8px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "1.7rem" }}>{lbl.emo}</span>
                      <span
                        style={{ fontWeight: 600, color: lbl.color, fontSize: "0.95rem" }}
                      >
                        {lbl.text} ({entry.mood}/10)
                      </span>
                    </div>

                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {date}
                    </span>
                  </div>

                  {entry.notes && (
                    <p style={{ fontSize: "0.85rem", color: "#4b5563", margin: 0 }}>
                      {entry.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}