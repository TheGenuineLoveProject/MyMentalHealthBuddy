import { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown, Minus, Plus, BarChart3, Zap } from 'lucide-react';

const STRESS_LEVELS = [
  { level: 1, label: "Calm", color: "bg-emerald-400", emoji: "😌" },
  { level: 2, label: "Relaxed", color: "bg-green-400", emoji: "🙂" },
  { level: 3, label: "Mild", color: "bg-lime-400", emoji: "😐" },
  { level: 4, label: "Noticeable", color: "bg-yellow-400", emoji: "😕" },
  { level: 5, label: "Moderate", color: "bg-amber-400", emoji: "😟" },
  { level: 6, label: "Elevated", color: "bg-orange-400", emoji: "😰" },
  { level: 7, label: "High", color: "bg-orange-500", emoji: "😫" },
  { level: 8, label: "Very High", color: "bg-red-400", emoji: "😣" },
  { level: 9, label: "Severe", color: "bg-red-500", emoji: "😩" },
  { level: 10, label: "Extreme", color: "bg-red-600", emoji: "🆘" },
];

const STRESS_TRIGGERS = [
  "Work/School",
  "Relationships",
  "Health",
  "Finances",
  "Family",
  "News/World Events",
  "Lack of Sleep",
  "Overwhelm",
  "Uncertainty",
  "Conflict",
  "Time Pressure",
  "Other",
];

const COPING_SUGGESTIONS = {
  low: ["Great job maintaining calm!", "Keep up your healthy habits", "Share your calm energy with others"],
  medium: ["Try some deep breathing", "Take a short walk", "Listen to calming music", "Drink water", "Stretch your body"],
  high: ["Practice 4-7-8 breathing", "Use the 5-4-3-2-1 grounding technique", "Call a supportive friend", "Consider stepping away temporarily"],
  severe: ["Focus only on the next breath", "Seek support immediately", "Remove yourself from stressors if possible", "Consider professional help"],
};

export default function StressMonitor() {
  const [currentLevel, setCurrentLevel] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("stress_monitor_data");
    if (saved) {
      const data = JSON.parse(saved);
      setHistory(data.history || []);
      if (data.lastCheck) {
        const last = data.history[data.history.length - 1];
        if (last && new Date().getTime() - new Date(last.timestamp).getTime() < 3600000) {
          setCurrentLevel(last.level);
        }
      }
    }
  }, []);

  const toggleTrigger = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const logStressLevel = () => {
    const entry = {
      level: currentLevel,
      triggers: selectedTriggers,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };
    
    const newHistory = [...history, entry].slice(-100);
    setHistory(newHistory);
    
    localStorage.setItem("stress_monitor_data", JSON.stringify({
      history: newHistory,
      lastCheck: new Date().toISOString(),
    }));
    
    setSelectedTriggers([]);
    setNotes("");
  };

  const getAverageLevel = () => {
    if (history.length === 0) return null;
    const recent = history.slice(-7);
    const avg = recent.reduce((sum, h) => sum + h.level, 0) / recent.length;
    return avg.toFixed(1);
  };

  const getTrend = () => {
    if (history.length < 2) return "stable";
    const recent = history.slice(-3);
    const older = history.slice(-6, -3);
    if (older.length === 0) return "stable";
    
    const recentAvg = recent.reduce((s, h) => s + h.level, 0) / recent.length;
    const olderAvg = older.reduce((s, h) => s + h.level, 0) / older.length;
    
    if (recentAvg < olderAvg - 0.5) return "improving";
    if (recentAvg > olderAvg + 0.5) return "worsening";
    return "stable";
  };

  const getSuggestions = () => {
    if (currentLevel <= 3) return COPING_SUGGESTIONS.low;
    if (currentLevel <= 5) return COPING_SUGGESTIONS.medium;
    if (currentLevel <= 7) return COPING_SUGGESTIONS.high;
    return COPING_SUGGESTIONS.severe;
  };

  const levelData = STRESS_LEVELS[currentLevel - 1];
  const trend = getTrend();
  const avgLevel = getAverageLevel();

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="stress-monitor">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-stress-title">
                Stress Monitor
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Track your stress levels</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-colors ${showHistory ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] text-[var(--text-muted)]"}`}
            data-testid="button-history"
            aria-label="View history"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>

        {!showHistory ? (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-2" data-testid="text-emoji">{levelData.emoji}</div>
              <div className="text-2xl font-bold text-[var(--text)]" data-testid="text-level">
                Level {currentLevel}: {levelData.label}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Adjust your stress level:</span>
                <span className="text-sm font-bold text-[var(--text)]">{currentLevel}/10</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))}
                  className="p-2 rounded-xl bg-[var(--surface)] text-[var(--text)]"
                  data-testid="button-decrease"
                  aria-label="Decrease stress level"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(parseInt(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                    data-testid="input-level"
                    aria-label="Stress level slider"
                  />
                  <div className="flex justify-between mt-1">
                    {STRESS_LEVELS.map((l) => (
                      <div
                        key={l.level}
                        className={`w-2 h-2 rounded-full ${l.level === currentLevel ? l.color : "bg-[var(--surface)]"}`}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentLevel((l) => Math.min(10, l + 1))}
                  className="p-2 rounded-xl bg-[var(--surface)] text-[var(--text)]"
                  data-testid="button-increase"
                  aria-label="Increase stress level"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
                What's contributing? (optional)
              </span>
              <div className="flex flex-wrap gap-2">
                {STRESS_TRIGGERS.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedTriggers.includes(trigger)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-400"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-2 border-transparent"
                    }`}
                    data-testid={`button-trigger-${trigger.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes? (optional)"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                rows={2}
                data-testid="textarea-notes"
                aria-label="Additional notes"
              />
            </div>

            <button
              onClick={logStressLevel}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg mb-6"
              data-testid="button-log"
            >
              Log Stress Level
            </button>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Suggestions for you:
              </h4>
              <ul className="space-y-1">
                {getSuggestions().map((suggestion, i) => (
                  <li key={i} className="text-sm text-blue-600 dark:text-blue-400">• {suggestion}</li>
                ))}
              </ul>
            </div>

            {avgLevel && (
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-[var(--text-muted)]">
                <span>7-day avg: {avgLevel}</span>
                <span className="flex items-center gap-1">
                  {trend === "improving" && <><TrendingDown className="w-4 h-4 text-emerald-500" /> Improving</>}
                  {trend === "worsening" && <><TrendingUp className="w-4 h-4 text-red-500" /> Rising</>}
                  {trend === "stable" && <><Minus className="w-4 h-4" /> Stable</>}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4">Stress History</h4>
            {history.length === 0 ? (
              <p className="text-center text-[var(--text-muted)] py-8">No entries yet. Start tracking!</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.slice(-20).reverse().map((entry, i) => {
                  const level = STRESS_LEVELS[entry.level - 1];
                  return (
                    <div key={i} className="p-3 rounded-xl bg-[var(--surface)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{level.emoji}</span>
                          <span className="font-medium text-[var(--text)]">Level {entry.level}</span>
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.triggers.map((t) => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-[var(--text-secondary)] mt-2 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => setShowHistory(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)]"
              data-testid="button-back"
            >
              Back to Monitor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
