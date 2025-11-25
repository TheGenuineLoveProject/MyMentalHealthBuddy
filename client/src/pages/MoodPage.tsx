import React, { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

type MoodEntry = {
  id: string;
  mood: number;
  notes: string;
  createdAt: string;
};

export default function MoodPage() {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<MoodEntry[]>([]);

  // -----------------------------
  //  SAVE MOOD
  // -----------------------------
  async function submitMood() {
    if (mood === null) return;

    setIsSaving(true);

    const newEntry = await apiFetch("/mood", {
      method: "POST",
      body: JSON.stringify({ mood, notes }),
    });

    setIsSaving(false);
    setMood(null);
    setNotes("");

    loadHistory(); // refresh entries after save
  }

  // -----------------------------
  //  LOAD HISTORY
  // -----------------------------
  async function loadHistory() {
    const data = await apiFetch("/mood/history");

    if (data && Array.isArray(data.history)) {
      setHistory(data.history);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  // -----------------------------
  //  Mood Labels
  // -----------------------------
  const moodLabels = [
    { emo: "😞", text: "Very Low", color: "#d9534f" },
    { emo: "😕", text: "Low", color: "#d9b48f" },
    { emo: "😐", text: "Okay", color: "#f0ad4e" },
    { emo: "🙂", text: "Good", color: "#5bc0de" },
    { emo: "😄", text: "Great", color: "#5cb85c" },
  ];

  function getLabel(n: number) {
    if (n <= 2) return moodLabels[0];
    if (n === 3) return moodLabels[1];
    if (n === 4 || n === 5) return moodLabels[2];
    if (n === 6 || n === 7) return moodLabels[3];
    return moodLabels[4];
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Mood Tracker</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* LEFT SIDE — INPUT */}
        <div
          style={{
            padding: "1.25rem",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: ".75rem" }}>
            How are you feeling today?
          </h2>

          <label style={{ fontWeight: 600 }}>Your mood:</label>
          <input
            type="range"
            min={1}
            max={10}
            value={mood ?? ""}
            onChange={(e) => setMood(Number(e.target.value))}
            style={{ width: "100%", margin: "0.75rem 0" }}
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
              <span style={{ fontWeight: 600, color: getLabel(mood).color }}>
                {getLabel(mood).text}
              </span>
            </div>
          )}

          <label style={{ fontWeight: 600 }}>Want to add a note?</label>
          <textarea
            placeholder="Example: Felt anxious this morning, but breathing exercises helped."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              marginTop: ".75rem",
              padding: ".75rem",
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
              padding: ".75rem",
              borderRadius: "8px",
              background: "#4a90e2",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {isSaving ? "Saving..." : "Save Mood"}
          </button>
        </div>

        {/* RIGHT SIDE — HISTORY */}
        <div
          style={{
            padding: "1.25rem",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: ".75rem" }}>
            Recent check-ins
          </h2>

          {history.length === 0 && (
            <p style={{ fontSize: ".9rem", color: "#667280" }}>
              No check-ins yet. Your first save will appear here.
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((entry) => {
              const lbl = getLabel(entry.mood);
              const dateLabel = new Date(entry.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <li
                  key={entry.id}
                  style={{
                    padding: "0.75rem",
                    marginBottom: ".75rem",
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
                      {dateLabel}
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