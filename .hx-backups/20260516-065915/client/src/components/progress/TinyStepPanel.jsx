import { useState } from "react";
import { addWin, getStreak } from "../../content/progress/progressStore";

export function TinyStepPanel({ routeKey }) {
  const [tiny, setTiny] = useState("");
  const [saved, setSaved] = useState(false);

  function save() {
    const note = tiny.trim();
    addWin(routeKey, note || undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    setTiny("");
  }

  const streak = (() => {
    try {
      return getStreak();
    } catch {
      return { current: 0, lastDay: null };
    }
  })();

  return (
    <section className="mt-6 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="tiny-step-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">One tiny next step</h2>
        <span className="text-xs text-gray-500 dark:text-white/70">streak: {streak.current}</span>
      </div>

      <div className="text-sm text-gray-600 dark:text-white/80 mt-2">
        Keep it small. Something you can do in 2 minutes.
      </div>

      <textarea
        value={tiny}
        onChange={(e) => setTiny(e.target.value)}
        placeholder="Example: '3 slow breaths', 'write one honest sentence', 'drink a glass of water'..."
        className="mt-3 w-full min-h-[84px] rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sage-500"
        data-testid="input-tiny-step"
        aria-label="Write your tiny next step"
      />

      <button
        onClick={save}
        disabled={!tiny.trim()}
        className="mt-3 rounded-xl border border-sage-300 dark:border-white/10 bg-sage-100 dark:bg-white/10 px-4 py-2 text-sm font-medium hover:bg-sage-200 dark:hover:bg-white/15 transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="button-save-win"
      >
        {saved ? "Saved ✓" : "Save as a win"}
      </button>
    </section>
  );
}

export default TinyStepPanel;
