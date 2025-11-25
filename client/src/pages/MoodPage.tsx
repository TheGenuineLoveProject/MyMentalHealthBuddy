import React, { useState, useEffect } from "react";

type MoodEntry = {
  id: string;
  mood: number;
  notes: string;
  createdAt: string;
};

export default function MoodPage() {
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  async function submitMood() {
    if (mood === null) return;

    setIsSaving(true);

    await fetch("/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, notes }),
    });

    setIsSaving(false);
    setMood(null);
    setNotes("");

    loadHistory();
  }

  async function loadHistory() {
    const res = await fetch("/mood/history");
    const data = await res.json();
    if (data.history) {
      setHistory(data.history);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  // Label for moods
  const moodLabels = [
    { emo: "😢", text: "Very Low", color: "#d9534f" },
    { emo: "☹️", text: "Low", color: "#d98b4f" },
    { emo: "😐", text: "Okay", color: "#f0ad4e" },
    { emo: "🙂", text: "Good", color: "#5bc0de" },
    { emo: "😁", text: "Great", color: "#5cb85c" },
  ];

  function getLabel(m: number) {
    if (m <= 2) return moodLabels[0];
    if (m === 3 || m === 4) return moodLabels[1];
    if (m === 5 || m === 6) return moodLabels[2];
    if (m === 7 || m === 8) return moodLabels[3];
    return moodLabels[4];
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Mood Tracker</h1>

      {/* LEFT SIDE — INPUT CARD */}
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
            value={mood ?? 5}
            style={{ width: "100%", margin: "0.75rem 0" }}
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
                style={{
                  fontWeight: 600,
                  color: getLabel(mood).color,
                }}
              >
                {getLabel(mood).text}
              </span>
            </div>
          )}

          <label style={{ fontWeight: 600 }}>Want to add a note?</label>
          <textarea
            placeholder="Example: Felt really anxious this morning, but talking to a friend helped."
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

        {/* RIGHT SIDE — HISTORY */}
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
              No check-ins yet. Your next save will appear here so you can start
              seeing patterns.
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((entry) => {
              const lbl = getLabel(entry.mood);
              const date = new Date(entry.createdAt);
              const dateLabel = date.toLocaleString(undefined, {
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span style={{ fontSize: "1.7rem" }}>{lbl.emo}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: lbl.color,
                          fontSize: "0.95rem",
                        }}
                      >
                        {lbl.text} ({entry.mood}/10)
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                      }}
                    >
                      {dateLabel}
                    </span>
                  </div>

                  {entry.notes && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#4b5563",
                        margin: 0,
                      }}
                    >
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