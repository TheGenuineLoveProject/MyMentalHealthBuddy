import { useState, useEffect } from "react";
import { apiGet, apiPost, ApiError } from "../utils/api";

type MoodEntry = {
  id: string;
  mood: number;
  notes?: string;
  createdAt: string;
};

export default function MoodPage() {
  const [mood, setMood] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const moodLabels = [
    { emo: "😢", text: "Very Low", color: "#dc2626" },
    { emo: "😞", text: "Low", color: "#ea580c" },
    { emo: "😐", text: "Okay", color: "#ca8a04" },
    { emo: "🙂", text: "Good", color: "#16a34a" },
    { emo: "😊", text: "Great", color: "#059669" },
  ];

  const getLabel = (m: number) => {
    if (m <= 2) return moodLabels[0];
    if (m <= 4) return moodLabels[1];
    if (m <= 6) return moodLabels[2];
    if (m <= 8) return moodLabels[3];
    return moodLabels[4];
  };

  async function loadHistory() {
    try {
      setIsLoading(true);
      const data = await apiGet<{ history: MoodEntry[] }>("/api/mood/history");
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to load mood history:", err);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitMood() {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await apiPost("/api/mood", { mood, notes: notes.trim() || undefined });
      setSuccess("Mood saved successfully!");
      setMood(5);
      setNotes("");
      loadHistory();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to save mood. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const currentLabel = getLabel(mood);

  return (
    <div data-testid="page-mood" style={{ padding: "1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 
        data-testid="text-page-title"
        style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#1f2937" }}
      >
        Mood Tracker
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            data-testid="text-section-title"
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem", color: "#374151" }}
          >
            How are you feeling today?
          </h2>

          {error && (
            <div
              data-testid="text-error"
              role="alert"
              style={{
                padding: "0.75rem",
                background: "#fef2f2",
                color: "#dc2626",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              data-testid="text-success"
              role="status"
              style={{
                padding: "0.75rem",
                background: "#f0fdf4",
                color: "#16a34a",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: "1.5rem" }}>
            <label 
              htmlFor="mood-slider"
              style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem", color: "#374151" }}
            >
              Your mood: {mood}/10
            </label>
            <input
              id="mood-slider"
              type="range"
              data-testid="input-mood-slider"
              min={1}
              max={10}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              style={{ width: "100%", cursor: "pointer" }}
            />

            <div
              data-testid="text-mood-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>{currentLabel.emo}</span>
              <span style={{ fontWeight: 600, color: currentLabel.color, fontSize: "1.1rem" }}>
                {currentLabel.text}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label 
              htmlFor="mood-notes"
              style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem", color: "#374151" }}
            >
              Notes (optional)
            </label>
            <textarea
              id="mood-notes"
              data-testid="input-mood-notes"
              placeholder="What's on your mind? Any thoughts or feelings you'd like to capture..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={1000}
              style={{
                width: "100%",
                height: "120px",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "0.95rem",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#9ca3af" }}>
              {notes.length}/1000
            </div>
          </div>

          <button
            data-testid="button-save-mood"
            onClick={submitMood}
            disabled={isSaving}
            aria-busy={isSaving}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "10px",
              border: "none",
              background: isSaving ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: isSaving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isSaving ? "Saving..." : "Save Mood"}
          </button>
        </div>

        <div
          style={{
            padding: "1.5rem",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            data-testid="text-history-title"
            style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem", color: "#374151" }}
          >
            Recent Check-ins
          </h2>

          {isLoading ? (
            <div data-testid="loading-history" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
              Loading your mood history...
            </div>
          ) : history.length === 0 ? (
            <p data-testid="text-empty-history" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              No check-ins yet. Your mood entries will appear here after you save them.
            </p>
          ) : (
            <ul data-testid="list-mood-history" style={{ listStyle: "none", padding: 0, maxHeight: "400px", overflowY: "auto" }}>
              {history.map((entry, index) => {
                const lbl = getLabel(entry.mood);
                const date = new Date(entry.createdAt).toLocaleString();

                return (
                  <li
                    key={entry.id}
                    data-testid={`item-mood-entry-${index}`}
                    style={{
                      padding: "0.75rem",
                      marginBottom: "0.75rem",
                      borderRadius: "8px",
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>{lbl.emo}</span>
                        <span style={{ fontWeight: 600, color: lbl.color }}>{lbl.text}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>({entry.mood}/10)</span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{date}</span>
                    </div>
                    {entry.notes && (
                      <p style={{ fontSize: "0.85rem", color: "#4b5563", margin: "0.5rem 0 0 0" }}>
                        {entry.notes}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
