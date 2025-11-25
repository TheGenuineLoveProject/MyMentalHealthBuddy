import { useState, useEffect } from "react";
import { apiGet, apiPost, ApiError } from "../utils/api";
import { Heart, Sparkles, Clock, PenLine } from "lucide-react";

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
      setSuccess("Your mood has been saved!");
      setMood(5);
      setNotes("");
      loadHistory();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to save. Please try again.");
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
    <div data-testid="page-mood" className="min-h-screen" style={{ background: "var(--background)" }}>
      <div 
        className="py-12 px-6 mb-8 animate-fade-in"
        style={{ 
          background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-white" />
            <h1 
              data-testid="text-page-title"
              className="text-3xl font-bold text-white"
            >
              Mood Tracker
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Check in with yourself and track how you're feeling
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h2
                data-testid="text-section-title"
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                How are you feeling today?
              </h2>
            </div>

            {error && (
              <div
                data-testid="text-error"
                role="alert"
                className="p-3 rounded-xl mb-4 flex items-center gap-2"
                style={{ background: "#fef2f2", color: "#dc2626" }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div
                data-testid="text-success"
                role="status"
                className="p-3 rounded-xl mb-4 flex items-center gap-2"
                style={{ background: "#f0fdf4", color: "#16a34a" }}
              >
                <Sparkles className="w-4 h-4" /> {success}
              </div>
            )}

            <div className="mb-6">
              <label 
                htmlFor="mood-slider"
                className="font-semibold block mb-3"
                style={{ color: "var(--text-primary)" }}
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
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={mood}
                aria-valuetext={currentLabel.text}
                className="w-full cursor-pointer"
              />

              <div
                data-testid="text-mood-label"
                className="flex items-center gap-3 mt-4 p-4 rounded-xl"
                style={{ background: "var(--background)" }}
              >
                <span className="text-5xl animate-pulse">{currentLabel.emo}</span>
                <div>
                  <span 
                    className="text-xl font-bold block"
                    style={{ color: currentLabel.color }}
                  >
                    {currentLabel.text}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {mood <= 4 ? "It's okay to not be okay" : mood >= 8 ? "That's wonderful!" : "Keep going"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label 
                htmlFor="mood-notes"
                className="flex items-center gap-2 font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                <PenLine className="w-4 h-4" />
                Notes (optional)
              </label>
              <textarea
                id="mood-notes"
                data-testid="input-mood-notes"
                placeholder="What's on your mind? Any thoughts you'd like to capture..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
                aria-describedby="notes-count"
                className="w-full p-4 rounded-xl border-0 resize-y"
                style={{
                  background: "var(--background)",
                  color: "var(--text-primary)",
                  minHeight: "120px",
                }}
              />
              <div 
                id="notes-count"
                className="text-right text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {notes.length}/1,000
              </div>
            </div>

            <button
              data-testid="button-save-mood"
              onClick={submitMood}
              disabled={isSaving}
              aria-busy={isSaving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Heart className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Mood"}
            </button>
          </div>

          <div className="card p-6 animate-fade-in stagger-1">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" style={{ color: "var(--primary)" }} />
              <h2
                data-testid="text-history-title"
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Recent Check-ins
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-20 rounded-xl" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div
                data-testid="text-empty-history"
                className="p-6 rounded-xl text-center"
                style={{ background: "var(--background)" }}
              >
                <div className="text-4xl mb-3">📝</div>
                <p style={{ color: "var(--text-secondary)" }}>
                  No check-ins yet. Your mood entries will appear here.
                </p>
              </div>
            ) : (
              <ul 
                data-testid="list-mood-history" 
                className="space-y-3 max-h-96 overflow-y-auto pr-2"
                aria-label="Mood history"
              >
                {history.map((entry, index) => {
                  const lbl = getLabel(entry.mood);
                  const date = new Date(entry.createdAt);

                  return (
                    <li
                      key={entry.id}
                      data-testid={`item-mood-entry-${index}`}
                      className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                      style={{ background: "var(--background)" }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lbl.emo}</span>
                          <div>
                            <span 
                              className="font-semibold"
                              style={{ color: lbl.color }}
                            >
                              {lbl.text}
                            </span>
                            <span 
                              className="text-sm ml-2"
                              style={{ color: "var(--text-muted)" }}
                            >
                              ({entry.mood}/10)
                            </span>
                          </div>
                        </div>
                        <time 
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                          dateTime={entry.createdAt}
                        >
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </time>
                      </div>
                      {entry.notes && (
                        <p 
                          className="text-sm mt-2 line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
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
    </div>
  );
}
