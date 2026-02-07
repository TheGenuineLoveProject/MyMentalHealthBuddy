import { useState, useEffect, useRef, useMemo } from "react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import { Flame, Sparkles, Wand2 } from "lucide-react";

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

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateToDay(dateStr) {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

const ONE_DAY = 86400000;

function calcStreak(entries) {
  if (!entries.length) return { current: 0, longest: 0, reflectedToday: false };

  const dayTimestamps = [...new Set(entries.map((e) => dateToDay(e.date)))].sort((a, b) => b - a);
  const todayTs = dateToDay(new Date().toISOString());
  const reflectedToday = dayTimestamps[0] === todayTs;

  let current = 0;
  let expectedTs = reflectedToday ? todayTs : todayTs - ONE_DAY;
  for (const ts of dayTimestamps) {
    if (ts === expectedTs) {
      current++;
      expectedTs -= ONE_DAY;
    } else if (ts < expectedTs) {
      break;
    }
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dayTimestamps.length; i++) {
    if (dayTimestamps[i - 1] - dayTimestamps[i] === ONE_DAY) {
      run++;
    } else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run, current);

  return { current, longest, reflectedToday };
}

const XP_BASE = 25;
const XP_STREAK_BONUS = 5;

function calcXpEarned(streakDays, wordCount) {
  const streakBonus = Math.min(streakDays, 10) * XP_STREAK_BONUS;
  const lengthBonus = Math.min(Math.floor(wordCount / 20) * 3, 30);
  return XP_BASE + streakBonus + lengthBonus;
}

function getFlameColor(streak) {
  if (streak >= 30) return "from-amber-400 via-orange-500 to-red-600";
  if (streak >= 14) return "from-orange-400 to-red-500";
  if (streak >= 7) return "from-yellow-400 to-orange-500";
  if (streak >= 3) return "from-amber-300 to-yellow-500";
  return "from-gray-300 to-gray-400";
}

function getStreakMessage(streak, reflectedToday) {
  if (reflectedToday && streak >= 30) return "Legendary dedication!";
  if (reflectedToday && streak >= 14) return "Two weeks strong!";
  if (reflectedToday && streak >= 7) return "A whole week of showing up!";
  if (reflectedToday && streak >= 3) return "Building real momentum!";
  if (reflectedToday && streak >= 1) return "You showed up today.";
  if (streak >= 1) return "Continue your streak — reflect today.";
  return "Start your reflection streak today.";
}

export default function Reflection() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [addToJournal, setAddToJournal] = useState(false);
  const [journalStatus, setJournalStatus] = useState(null);
  const [xpAwarded, setXpAwarded] = useState(null);
  const [totalXp, setTotalXp] = useState(() => parseInt(localStorage.getItem("glp_reflection_xp") || "0", 10));
  const [aiPrompt, setAiPrompt] = useState(null);
  const [aiPromptLoading, setAiPromptLoading] = useState(false);
  const textareaRef = useRef(null);

  const allEntries = useMemo(() => {
    return JSON.parse(localStorage.getItem("glp_reflections") || "[]");
  }, [saveCount]);

  const streak = useMemo(() => calcStreak(allEntries), [allEntries]);

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
    const wc = text.trim().split(/\s+/).length;
    const entries = JSON.parse(localStorage.getItem("glp_reflections") || "[]");
    entries.unshift({ text: text.trim(), date: new Date().toISOString() });
    if (entries.length > 50) entries.length = 50;
    localStorage.setItem("glp_reflections", JSON.stringify(entries));
    localStorage.removeItem("glp_reflection_draft");
    setSaved(true);
    setSaveCount((c) => c + 1);
    setTimeout(() => setSaved(false), 3000);

    const newStreak = calcStreak(entries);
    const xp = calcXpEarned(newStreak.current, wc);
    setXpAwarded(xp);
    setTimeout(() => setXpAwarded(null), 3500);

    const newTotal = totalXp + xp;
    setTotalXp(newTotal);
    localStorage.setItem("glp_reflection_xp", String(newTotal));

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

  async function fetchAiPrompt() {
    setAiPromptLoading(true);
    try {
      const recentTexts = allEntries.slice(0, 3).map((e) => e.text);
      const res = await apiRequest("POST", "/api/reflection/prompt", {
        recentEntries: recentTexts,
      });
      if (res?.prompt) {
        setAiPrompt(res.prompt);
      }
    } catch {
      setAiPrompt(pickPrompt());
    } finally {
      setAiPromptLoading(false);
    }
  }

  function useAiPrompt() {
    if (aiPrompt && textareaRef.current) {
      setText(aiPrompt + "\n\n");
      setAiPrompt(null);
      textareaRef.current.focus();
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--glp-sage-deep)" }}
              data-testid="text-reflection-title"
            >
              Daily Reflection
            </h1>
            <p style={{ color: "var(--glp-ink)", opacity: 0.7 }}>
              Take a quiet moment to check in with yourself. There's no right or wrong —
              just honesty.
            </p>
          </div>

          <StreakBadge
            current={streak.current}
            longest={streak.longest}
            reflectedToday={streak.reflectedToday}
            totalXp={totalXp}
          />
        </div>

        {aiPrompt && (
          <div
            className="mb-4 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: "linear-gradient(135deg, var(--glp-teal-50), var(--glp-sage-10, rgba(107,142,112,0.1)))",
              border: "1px solid var(--glp-sage-15)",
            }}
            data-testid="section-ai-prompt"
          >
            <Wand2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--glp-sage)" }} aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: "var(--glp-sage-deep)" }}>
                A prompt just for you
              </p>
              <p className="text-sm" style={{ color: "var(--glp-ink)" }}>
                {aiPrompt}
              </p>
              <button
                onClick={useAiPrompt}
                className="mt-2 text-xs font-medium underline-offset-2 hover:underline transition-colors"
                style={{ color: "var(--glp-sage)" }}
                data-testid="button-use-ai-prompt"
              >
                Use this as a starting point
              </button>
            </div>
            <button
              onClick={() => setAiPrompt(null)}
              className="text-xs shrink-0"
              style={{ color: "var(--glp-sage)", opacity: 0.5 }}
              aria-label="Dismiss prompt"
              data-testid="button-dismiss-ai-prompt"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={fetchAiPrompt}
            disabled={aiPromptLoading}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
            style={{
              background: "var(--glp-sage-10, rgba(107,142,112,0.1))",
              color: "var(--glp-sage)",
            }}
            data-testid="button-get-ai-prompt"
          >
            <Wand2 className="w-3.5 h-3.5" aria-hidden="true" />
            {aiPromptLoading ? "Thinking..." : "Suggest a prompt"}
          </button>
        </div>

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
            {xpAwarded && (
              <span
                className="text-sm font-bold"
                style={{ color: "var(--glp-gold, #d4a574)" }}
                role="status"
                data-testid="text-xp-awarded"
              >
                +{xpAwarded} XP
              </span>
            )}
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

function StreakBadge({ current, longest, reflectedToday, totalXp }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shrink-0"
      style={{
        background: "var(--glp-paper)",
        border: "1px solid var(--glp-sage-15)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
      data-testid="streak-badge"
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getFlameColor(current)} flex items-center justify-center shadow-md ${current >= 3 ? "animate-pulse" : ""}`}
      >
        <Flame className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-xl font-bold"
            style={{ color: "var(--glp-ink)" }}
            data-testid="text-streak-count"
          >
            {current}
          </span>
          <span className="text-xs" style={{ color: "var(--glp-sage)" }}>
            day{current !== 1 ? "s" : ""}
          </span>
          {longest > current && (
            <span className="text-xs ml-1" style={{ color: "var(--glp-sage)", opacity: 0.6 }}>
              (best: {longest})
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.8 }} data-testid="text-streak-message">
          {getStreakMessage(current, reflectedToday)}
        </p>
      </div>
      {totalXp > 0 && (
        <div
          className="flex items-center gap-1 ml-2 px-2 py-1 rounded-lg"
          style={{ background: "var(--glp-gold-10, rgba(212,165,116,0.1))" }}
          data-testid="text-total-xp"
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--glp-gold, #d4a574)" }} aria-hidden="true" />
          <span className="text-xs font-semibold" style={{ color: "var(--glp-gold, #d4a574)" }}>
            {totalXp} XP
          </span>
        </div>
      )}
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
