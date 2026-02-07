import { useState, useEffect, useRef } from "react";
import { apiRequest, queryClient } from "../lib/queryClient.js";

const PROMPTS = [
  "What's on your mind today?",
  "What are you grateful for right now?",
  "What would feel like a gentle next step?",
  "What does your body need right now?",
  "What boundary would protect your peace today?",
  "What small kindness can you offer yourself?",
  "What emotion is asking for your attention?",
  "What would your wisest self say to you right now?",
];

function pickPrompt() {
  const idx = new Date().getDate() % PROMPTS.length;
  return PROMPTS[idx];
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Reflection() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [addToJournal, setAddToJournal] = useState(false);
  const [journalStatus, setJournalStatus] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const draft = localStorage.getItem("glp_reflection_draft");
    if (draft) setText(draft);
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  useEffect(() => {
    if (text) {
      localStorage.setItem("glp_reflection_draft", text);
    } else {
      localStorage.removeItem("glp_reflection_draft");
    }
  }, [text]);

  async function handleSave() {
    if (!text.trim()) return;
    const entries = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    entries.unshift({ text: text.trim(), date: new Date().toISOString() });
    if (entries.length > 50) entries.length = 50;
    localStorage.setItem("glp_reflections", JSON.stringify(entries));
    localStorage.removeItem("glp_reflection_draft");
    setSaved(true);
    setSaveCount((c) => c + 1);
    setTimeout(() => setSaved(false), 3000);

    if (addToJournal) {
      await syncToJournal(text.trim());
    }

    setText("");
  }

  async function syncToJournal(content) {
    try {
      setJournalStatus("saving");
      await apiRequest("POST", "/api/journal", {
        title: `Reflection — ${todayLabel()}`,
        content,
        mood: "neutral",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setJournalStatus("saved");
      setTimeout(() => setJournalStatus(null), 3000);
    } catch {
      setJournalStatus("error");
      setTimeout(() => setJournalStatus(null), 4000);
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--glp-sage-deep)" }}
          data-testid="text-reflection-title"
        >
          Daily Reflection
        </h1>

        <p className="mb-6" style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
          Take a quiet moment to check in with yourself. There's no right or wrong —
          just honesty.
        </p>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); setSaved(false); }}
          className="w-full min-h-[200px] rounded-xl p-4 focus:outline-none focus:ring-2 resize-y"
          style={{
            background: "var(--glp-paper)",
            border: "1px solid var(--glp-sage-20)",
            color: "var(--glp-ink)",
          }}
          placeholder={pickPrompt()}
          aria-label="Write your reflection"
          data-testid="input-reflection"
        />

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span
              className="text-sm"
              style={{ color: "var(--glp-sage)", opacity: 0.8 }}
              data-testid="text-word-count"
            >
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>

            <label
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              style={{ color: "var(--glp-sage)" }}
              data-testid="label-add-to-journal"
            >
              <input
                type="checkbox"
                checked={addToJournal}
                onChange={(e) => setAddToJournal(e.target.checked)}
                className="rounded"
                data-testid="checkbox-add-to-journal"
              />
              Also save to journal
            </label>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span
                className="text-sm font-medium"
                style={{ color: "var(--glp-sage)" }}
                role="status"
                data-testid="text-saved-status"
              >
                Saved gently
              </span>
            )}
            {journalStatus === "saved" && (
              <span
                className="text-sm font-medium"
                style={{ color: "var(--glp-sage)" }}
                role="status"
                data-testid="text-journal-status"
              >
                Added to journal
              </span>
            )}
            {journalStatus === "error" && (
              <span
                className="text-sm font-medium"
                style={{ color: "var(--glp-blush)" }}
                role="alert"
                data-testid="text-journal-error"
              >
                Could not save to journal — try again later
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!text.trim() || journalStatus === "saving"}
              className="rounded-xl px-5 py-2.5 font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: text.trim()
                  ? "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))"
                  : "var(--glp-sage-20)",
                boxShadow: text.trim() ? "0 4px 16px var(--glp-sage-30)" : "none",
              }}
              data-testid="button-save-reflection"
            >
              {journalStatus === "saving" ? "Saving..." : "Save Reflection"}
            </button>
          </div>
        </div>

        <RecentReflections refreshKey={saveCount} onSyncToJournal={syncToJournal} />
      </div>
    </div>
  );
}

function RecentReflections({ refreshKey, onSyncToJournal }) {
  const [entries, setEntries] = useState([]);
  const [syncingIdx, setSyncingIdx] = useState(null);
  const [syncedSet, setSyncedSet] = useState(new Set());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    setEntries(stored.slice(0, 5));
  }, [refreshKey]);

  async function handleSync(entry, idx) {
    setSyncingIdx(idx);
    try {
      await onSyncToJournal(entry.text);
      setSyncedSet((prev) => new Set([...prev, idx]));
    } finally {
      setSyncingIdx(null);
    }
  }

  if (entries.length === 0) return null;

  return (
    <section className="mt-10" aria-label="Recent reflections" data-testid="section-recent-reflections">
      <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--glp-ink)" }}>
        Recent Reflections
      </h2>
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <article
            key={idx}
            className="rounded-xl p-4"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
            data-testid={`card-reflection-${idx}`}
          >
            <p className="text-sm mb-2" style={{ color: "var(--glp-ink)" }}>
              {entry.text.length > 200 ? entry.text.slice(0, 200) + "\u2026" : entry.text}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.7 }}>
                {new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {syncedSet.has(idx) ? (
                <span className="text-xs font-medium" style={{ color: "var(--glp-sage)" }} data-testid={`text-synced-${idx}`}>
                  In your journal
                </span>
              ) : (
                <button
                  onClick={() => handleSync(entry, idx)}
                  disabled={syncingIdx === idx}
                  className="text-xs font-medium underline-offset-2 hover:underline transition-colors disabled:opacity-50"
                  style={{ color: "var(--glp-sage)" }}
                  data-testid={`button-sync-journal-${idx}`}
                >
                  {syncingIdx === idx ? "Saving..." : "Save to journal"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
