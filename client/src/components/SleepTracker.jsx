import { useState, useEffect } from "react";
import { Moon, Sun, Clock, TrendingUp, Zap, Cloud, Star, ChevronDown, ChevronUp } from "lucide-react";

const SLEEP_FACTORS = [
  { id: "caffeine", label: "Had caffeine", icon: "☕", impact: -1 },
  { id: "exercise", label: "Exercised today", icon: "🏃", impact: 1 },
  { id: "screens", label: "Screen time before bed", icon: "📱", impact: -1 },
  { id: "stress", label: "Felt stressed", icon: "😰", impact: -1 },
  { id: "relaxation", label: "Relaxation routine", icon: "🧘", impact: 1 },
  { id: "consistent", label: "Consistent bedtime", icon: "⏰", impact: 1 },
];

const QUALITY_LABELS = [
  { min: 0, max: 2, label: "Poor", color: "from-red-400 to-rose-500", emoji: "😴" },
  { min: 3, max: 4, label: "Fair", color: "from-orange-400 to-amber-500", emoji: "😐" },
  { min: 5, max: 6, label: "Good", color: "from-yellow-400 to-lime-500", emoji: "🙂" },
  { min: 7, max: 8, label: "Great", color: "from-green-400 to-emerald-500", emoji: "😊" },
  { min: 9, max: 10, label: "Excellent", color: "from-emerald-400 to-teal-500", emoji: "🌟" },
];

export default function SleepTracker() {
  const [sleepData, setSleepData] = useState({
    bedtime: "22:00",
    wakeTime: "06:00",
    quality: 7,
    factors: [],
    dreams: "",
    notes: "",
  });
  const [history, setHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("sleep_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateDuration = () => {
    const [bedH, bedM] = sleepData.bedtime.split(":").map(Number);
    const [wakeH, wakeM] = sleepData.wakeTime.split(":").map(Number);
    
    let bedMinutes = bedH * 60 + bedM;
    let wakeMinutes = wakeH * 60 + wakeM;
    
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const durationMinutes = wakeMinutes - bedMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return { hours, minutes, total: durationMinutes };
  };

  const getQualityInfo = (quality) => {
    return QUALITY_LABELS.find(q => quality >= q.min && quality <= q.max) || QUALITY_LABELS[2];
  };

  const toggleFactor = (factorId) => {
    setSleepData(prev => ({
      ...prev,
      factors: prev.factors.includes(factorId)
        ? prev.factors.filter(f => f !== factorId)
        : [...prev.factors, factorId]
    }));
  };

  const getSleepScore = () => {
    const duration = calculateDuration();
    let score = sleepData.quality * 10;
    
    if (duration.hours >= 7 && duration.hours <= 9) score += 20;
    else if (duration.hours >= 6 && duration.hours <= 10) score += 10;
    
    sleepData.factors.forEach(factorId => {
      const factor = SLEEP_FACTORS.find(f => f.id === factorId);
      if (factor) score += factor.impact * 5;
    });
    
    return Math.max(0, Math.min(100, score));
  };

  const saveSleepEntry = () => {
    const entry = {
      ...sleepData,
      date: new Date().toISOString().split("T")[0],
      duration: calculateDuration(),
      score: getSleepScore(),
    };
    
    const updatedHistory = [entry, ...history].slice(0, 30);
    setHistory(updatedHistory);
    localStorage.setItem("sleep_history", JSON.stringify(updatedHistory));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const duration = calculateDuration();
  const qualityInfo = getQualityInfo(sleepData.quality);
  const sleepScore = getSleepScore();
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
    : 0;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="sleep-tracker">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Moon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-sleep-title">
                Sleep Tracker
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Track your rest quality</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold bg-gradient-to-r ${qualityInfo.color} bg-clip-text text-transparent`} data-testid="text-sleep-score">
              {sleepScore}
            </div>
            <p className="text-xs text-[var(--text-muted)]">Sleep Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
              <Moon className="w-4 h-4" aria-hidden="true" />
              Bedtime
            </label>
            <input
              type="time"
              value={sleepData.bedtime}
              onChange={(e) => setSleepData(prev => ({ ...prev, bedtime: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[var(--border)] text-[var(--text)] text-lg font-semibold"
              data-testid="input-bedtime"
              aria-label="Bedtime"
            />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
              <Sun className="w-4 h-4" aria-hidden="true" />
              Wake Time
            </label>
            <input
              type="time"
              value={sleepData.wakeTime}
              onChange={(e) => setSleepData(prev => ({ ...prev, wakeTime: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-[var(--border)] text-[var(--text)] text-lg font-semibold"
              data-testid="input-waketime"
              aria-label="Wake time"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-[var(--surface)] mb-6">
          <Clock className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
          <span className="text-[var(--text)]">
            <span className="text-2xl font-bold" data-testid="text-sleep-duration">{duration.hours}h {duration.minutes}m</span>
            <span className="text-[var(--text-secondary)] ml-2">of sleep</span>
          </span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Sleep Quality: {qualityInfo.emoji} {qualityInfo.label}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={sleepData.quality}
            onChange={(e) => setSleepData(prev => ({ ...prev, quality: Number(e.target.value) }))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--glp-error) 0%, var(--glp-warning) 25%, var(--glp-lime) 50%, var(--glp-success) 75%, var(--glp-teal-light) 100%)`
            }}
            data-testid="slider-quality"
            aria-label="Sleep quality rating"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors mb-4"
          data-testid="button-toggle-details"
          aria-expanded={showDetails}
        >
          <span className="text-sm font-medium text-[var(--text)]">Additional Details</span>
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showDetails && (
          <div className="space-y-4 mb-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                What affected your sleep?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SLEEP_FACTORS.map((factor) => (
                  <button
                    key={factor.id}
                    onClick={() => toggleFactor(factor.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      sleepData.factors.includes(factor.id)
                        ? factor.impact > 0
                          ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-400"
                          : "bg-red-100 dark:bg-red-900/30 border-2 border-red-400"
                        : "bg-[var(--surface)] border-2 border-transparent hover:border-[var(--border)]"
                    }`}
                    data-testid={`button-factor-${factor.id}`}
                    aria-pressed={sleepData.factors.includes(factor.id)}
                  >
                    <span className="text-lg mr-2">{factor.icon}</span>
                    <span className="text-sm text-[var(--text)]">{factor.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Dreams or Notes
              </label>
              <textarea
                value={sleepData.notes}
                onChange={(e) => setSleepData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any dreams or thoughts about your sleep..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                rows={3}
                data-testid="textarea-notes"
                aria-label="Sleep notes"
              />
            </div>
          </div>
        )}

        <button
          onClick={saveSleepEntry}
          className={`w-full py-4 rounded-xl font-semibold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "btn-gradient shadow-lg hover:shadow-xl"
          }`}
          data-testid="button-save-sleep"
        >
          {saved ? "✓ Saved!" : "Log Sleep"}
        </button>

        {history.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[var(--text)]">Recent Nights</h4>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-[var(--text-secondary)]">Avg: {avgScore}</span>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {history.slice(0, 7).map((entry, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-16 p-2 rounded-xl bg-[var(--surface)] text-center"
                  data-testid={`sleep-history-${i}`}
                >
                  <div className="text-xs text-[var(--text-muted)]">
                    {new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className={`text-lg font-bold bg-gradient-to-r ${getQualityInfo(entry.score / 10).color} bg-clip-text text-transparent`}>
                    {entry.score}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {entry.duration.hours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
