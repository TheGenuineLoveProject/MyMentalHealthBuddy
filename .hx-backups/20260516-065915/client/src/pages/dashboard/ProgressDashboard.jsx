import PageScaffold from "../../components/layout/PageScaffold";
import { listWins, getStreak } from "../../content/progress/progressStore";
import { getRecommendations } from "../../content/meta/recommendations";
import { RelatedLinksBlock } from "../../components/RelatedLinksBlock";

export default function ProgressDashboard() {
  const wins = (() => {
    try {
      return listWins(25);
    } catch {
      return [];
    }
  })();

  const streak = (() => {
    try {
      return getStreak();
    } catch {
      return { current: 0, lastDay: null };
    }
  })();

  const lastRouteKey = wins[0]?.routeKey || "hubs__anxiety";
  const recs = getRecommendations(lastRouteKey, 6).map((r) => ({
    label: r.label,
    routeKey: r.routeKey,
    href: r.href,
  }));

  return (
    <PageScaffold
      title="Your progress"
      description="Tiny wins, gentle momentum. No pressure—just direction."
      benefitsBullets={[
        "See your streak grow from small wins.",
        "Return to what helped most recently.",
        "Get a calm 'next best step' suggestion.",
      ]}
    >
      <section className="mt-4 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="section-streak">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">Streak</div>
          <div className="text-sm text-gray-700 dark:text-white/90">{streak.current}</div>
        </div>
        <div className="text-xs text-gray-600 dark:text-white/70 mt-1">
          A streak is simply "you showed up today". If you miss a day, you start again with kindness.
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="section-wins">
        <div className="text-sm font-medium text-gray-900 dark:text-white">Recent wins</div>
        <div className="mt-3 grid gap-2">
          {wins.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-white/80">No wins yet. Save one tiny step on any page.</div>
          ) : (
            wins.map((w) => (
              <div key={w.id} className="rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/10 px-3 py-2">
                <div className="text-xs text-gray-500 dark:text-white/70">{new Date(w.createdAt).toLocaleString()}</div>
                <div className="text-sm text-gray-800 dark:text-white mt-1">{w.note || "Saved a win"}</div>
                <div className="text-xs text-gray-500 dark:text-white/70 mt-1">routeKey: {w.routeKey}</div>
              </div>
            ))
          )}
        </div>
      </section>

      <RelatedLinksBlock links={recs} />
    </PageScaffold>
  );
}
