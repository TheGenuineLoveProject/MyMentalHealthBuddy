import { useState, useEffect, useRef } from "react";

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

export default function Reflection() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
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

  function handleSave() {
    if (!text.trim()) return;
    const entries = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    entries.unshift({ text: text.trim(), date: new Date().toISOString() });
    if (entries.length > 50) entries.length = 50;
    localStorage.setItem("glp_reflections", JSON.stringify(entries));
    localStorage.removeItem("glp_reflection_draft");
    setSaved(true);
    setSaveCount((c) => c + 1);
    setTimeout(() => setSaved(false), 3000);
    setText("");
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

        <div className="mt-3 flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: "var(--glp-sage)", opacity: 0.8 }}
            data-testid="text-word-count"
          >
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>

          <div className="flex items-center gap-3">
            {saved && (
              <span
                className="text-sm font-medium animate-in fade-in"
                style={{ color: "var(--glp-sage)" }}
                role="status"
                data-testid="text-saved-status"
              >
                Saved gently
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="rounded-xl px-5 py-2.5 font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: text.trim()
                  ? "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))"
                  : "var(--glp-sage-20)",
                boxShadow: text.trim() ? "0 4px 16px var(--glp-sage-30)" : "none",
              }}
              data-testid="button-save-reflection"
            >
              Save Reflection
            </button>
          </div>
        </div>

        <RecentReflections refreshKey={saveCount} />
      </div>
    </div>
  );
}

function RecentReflections({ refreshKey }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    setEntries(stored.slice(0, 5));
  }, [refreshKey]);

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
              {entry.text.length > 200 ? entry.text.slice(0, 200) + "…" : entry.text}
            </p>
            <time className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.7 }}>
              {new Date(entry.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
