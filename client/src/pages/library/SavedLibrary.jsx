import PageScaffold from "../../components/layout/PageScaffold";
import { listSaves } from "../../content/saves/savesStore";
import { getRouteMeta, resolveRoutePath } from "../../content/meta/routeMetaRegistry";
import { Link } from "wouter";

export default function SavedLibrary() {
  const saved = (() => {
    try {
      return listSaves();
    } catch {
      return [];
    }
  })();

  const items = saved
    .map((rk) => {
      const m = getRouteMeta(rk);
      return { routeKey: rk, title: m.title, description: m.description, href: resolveRoutePath(rk) };
    })
    .filter(Boolean);

  return (
    <PageScaffold
      title="Your saved library"
      description="Your favorite tools and pages—saved by routeKey and resolved from the registry."
      benefitsBullets={[
        "Come back to what works for you.",
        "Keep your best tools in one place.",
        "No clutter—just your personal collection.",
      ]}
    >
      <section className="mt-4 rounded-2xl border border-sage-200 dark:border-white/10 bg-sage-50 dark:bg-white/5 p-4" data-testid="section-saved-list">
        {items.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-white/80">
            Nothing saved yet. When you find a tool you like, press "Save".
          </div>
        ) : (
          <div className="grid gap-2">
            {items.map((it) => (
              <Link key={it.routeKey} href={it.href} className="block" data-testid={`link-saved-${it.routeKey}`}>
                <div className="rounded-xl border border-sage-200 dark:border-white/10 bg-white dark:bg-black/10 px-3 py-2 hover:bg-sage-50 dark:hover:bg-black/20 transition min-h-[44px]">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{it.title}</div>
                  <div className="text-xs text-gray-600 dark:text-white/70 mt-1">{it.description}</div>
                  <div className="text-xs text-gray-500 dark:text-white/60 mt-1">{it.href}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageScaffold>
  );
}
