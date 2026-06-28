import { useMemo, useState } from "react";
import { Link } from "wouter";
import { searchRoutes } from "../../content/meta/routeSearchIndex";

export function RouteSearchBox({ placeholder = "Search tools, hubs, paths..." }) {
  const [q, setQ] = useState("");

  const hits = useMemo(() => searchRoutes(q, 10), [q]);

  return (
    <section className="mt-4 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="search-box">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Find what you need</h2>
        <span className="text-xs text-gray-500 dark:text-white/70">registry-driven</span>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sage-500 min-h-[44px]"
        data-testid="input-search"
        aria-label="Search tools and resources"
      />

      {!!q && (
        <div className="mt-3 grid gap-2" role="listbox" aria-label="Search results">
          {hits.length === 0 && (
            <div className="text-sm text-gray-600 dark:text-white/75">No matches yet. Try "anxiety", "sleep", "boundaries", "reframe".</div>
          )}

          {hits.map((h) => (
            <Link key={h.routeKey} href={h.href} className="block" role="option">
              <div className="rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/10 px-3 py-2 hover:bg-sage-50 dark:hover:bg-black/20 transition min-h-[44px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{h.title}</div>
                  <div className="text-xs text-gray-500 dark:text-white/70">
                    {h.difficulty || ""}{h.estimatedMinutes ? ` • ${h.estimatedMinutes}m` : ""}
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-white/70 mt-1">{h.description}</div>
                {!!h.tags?.length && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {h.tags.slice(0, 5).map((t) => (
                      <span key={t} className="text-xs rounded-full border border-sage-200 dark:border-white/10 bg-sage-100 dark:bg-white/5 px-2 py-0.5 text-gray-600 dark:text-white/80">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default RouteSearchBox;
