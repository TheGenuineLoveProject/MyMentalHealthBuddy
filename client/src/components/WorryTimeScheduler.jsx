import { useState, useEffect, useRef } from "react";
import { Clock, Play, Check, AlertCircle, Trash2, Plus, Brain } from 'lucide-react';

const WORRY_TIPS = [
  "Write down each worry completely - getting it out of your head helps",
  "Ask yourself: Is this worry within my control?",
  "If it's not in your control, practice accepting uncertainty",
  "If it is in your control, what's one small action you can take?",
  "Remember: worrying doesn't prevent bad things from happening",
  "Postpone worries outside of worry time - you can always worry later",
];

export default function WorryTimeScheduler() {
  const [worries, setWorries] = useState([]);
  const [newWorry, setNewWorry] = useState("");
  const [isWorryTime, setIsWorryTime] = useState(false);
  const [timer, setTimer] = useState(15 * 60);
  const [worryTimeLength, setWorryTimeLength] = useState(15);
  const [processedWorries, setProcessedWorries] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("worry_time_data");
    if (saved) {
      const data = JSON.parse(saved);
      setWorries(data.worries || []);
      setProcessedWorries(data.processed || []);
      setTotalSessions(data.sessions || 0);
      setWorryTimeLength(data.length || 15);
    }
  }, []);

  useEffect(() => {
    if (isWorryTime && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            endWorryTime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isWorryTime, timer]);

  const saveData = (data) => {
    try { localStorage.setItem("worry_time_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const addWorry = () => {
    if (!newWorry.trim()) return;
    const worry = {
      id: Date.now().toString(),
      text: newWorry.trim(),
      date: new Date().toISOString(),
      processed: false,
    };
    const updated = [...worries, worry];
    setWorries(updated);
    setNewWorry("");
    saveData({ worries: updated, processed: processedWorries, sessions: totalSessions, length: worryTimeLength });
  };

  const removeWorry = (id) => {
    const updated = worries.filter((w) => w.id !== id);
    setWorries(updated);
    saveData({ worries: updated, processed: processedWorries, sessions: totalSessions, length: worryTimeLength });
  };

  const startWorryTime = () => {
    setIsWorryTime(true);
    setTimer(worryTimeLength * 60);
    setShowTips(true);
  };

  const endWorryTime = () => {
    setIsWorryTime(false);
    clearInterval(intervalRef.current);
    
    const now = new Date().toISOString();
    const processed = worries.map((w) => ({ ...w, processedAt: now }));
    const newProcessed = [...processedWorries, ...processed].slice(-50);
    const newSessions = totalSessions + 1;
    
    setProcessedWorries(newProcessed);
    setTotalSessions(newSessions);
    setWorries([]);
    
    saveData({ worries: [], processed: newProcessed, sessions: newSessions, length: worryTimeLength });
  };

  const markProcessed = (id) => {
    const worry = worries.find((w) => w.id === id);
    if (worry) {
      const updated = worries.filter((w) => w.id !== id);
      setWorries(updated);
      
      const newProcessed = [...processedWorries, { ...worry, processedAt: new Date().toISOString() }].slice(-50);
      setProcessedWorries(newProcessed);
      
      saveData({ worries: updated, processed: newProcessed, sessions: totalSessions, length: worryTimeLength });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="worry-time-scheduler">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-slate-400/10 to-gray-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-gray-500 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-worry-title">
                Worry Time
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Contained worry periods</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-[var(--text-muted)]">{totalSessions} sessions</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <Brain className="w-4 h-4 inline mr-2" />
            <strong>How it works:</strong> Postpone worries to a scheduled time. This reduces anxiety by containing your worrying to a specific period.
          </p>
        </div>

        {!isWorryTime ? (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
                Add a worry to process later:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWorry}
                  onChange={(e) => setNewWorry(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWorry()}
                  placeholder="What's on your mind?"
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  data-testid="input-worry"
                  aria-label="Add worry"
                />
                <button
                  onClick={addWorry}
                  disabled={!newWorry.trim()}
                  className="px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-medium disabled:opacity-50"
                  data-testid="button-add-worry"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {worries.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Worries to process ({worries.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {worries.map((worry) => (
                    <div key={worry.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)]">
                      <span className="flex-1 text-sm text-[var(--text)]">{worry.text}</span>
                      <button
                        onClick={() => removeWorry(worry.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        data-testid={`button-remove-${worry.id}`}
                        aria-label="Remove worry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
                Worry time duration: {worryTimeLength} minutes
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={worryTimeLength}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setWorryTimeLength(val);
                  saveData({ worries, processed: processedWorries, sessions: totalSessions, length: val });
                }}
                className="w-full accent-[var(--primary)]"
                data-testid="input-duration"
                aria-label="Worry time duration"
              />
            </div>

            <button
              onClick={startWorryTime}
              disabled={worries.length === 0}
              className="w-full py-4 rounded-xl btn-gradient font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="button-start"
            >
              <Play className="w-5 h-5" />
              Start Worry Time ({worryTimeLength} min)
            </button>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-400 to-gray-500 text-white text-center mb-6">
              <h4 className="text-lg font-medium mb-2">Worry Time Active</h4>
              <div className="text-5xl font-bold mb-4" data-testid="text-timer">{formatTime(timer)}</div>
              <p className="text-white/80 text-sm">Focus on processing your worries now</p>
            </div>

            {showTips && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-3">Tips for processing worries:</h4>
                <ul className="space-y-2">
                  {WORRY_TIPS.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {worries.map((worry) => (
                <div key={worry.id} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--surface)]">
                  <button
                    onClick={() => markProcessed(worry.id)}
                    className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                    data-testid={`button-process-${worry.id}`}
                    aria-label="Mark as processed"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-[var(--text)]">{worry.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={endWorryTime}
              className="w-full py-4 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
              data-testid="button-end"
            >
              <Check className="w-5 h-5" />
              End Worry Time Early
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
