import { getRouteMeta, listAllRouteMeta, resolveInternalLinks, resolveRoutePath } from "./routeMetaRegistry";

export type RecommendedLink = { label: string; routeKey: string; href: string; reason?: string };

function overlap(a: string[] = [], b: string[] = []) {
  const A = new Set(a.map((x) => x.toLowerCase()));
  return b.reduce((n, x) => n + (A.has(x.toLowerCase()) ? 1 : 0), 0);
}

export function getRecommendations(routeKey: string, limit = 6): RecommendedLink[] {
  const meta = getRouteMeta(routeKey);
  if (!meta) return [];

  const curated = resolveInternalLinks(routeKey).map((l) => ({
    label: l.label,
    routeKey: l.routeKey,
    href: l.href,
    reason: "Curated next step",
  }));

  const metaTags = (meta as any).tags || [];
  const all = listAllRouteMeta()
    .filter((m) => m.routeKey !== routeKey)
    .map((m) => ({
      m,
      score: overlap(metaTags, (m as any).tags || []),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((x) => ({
      label: x.m.title,
      routeKey: x.m.routeKey,
      href: resolveRoutePath(x.m.routeKey),
      reason: "Similar topic",
    }));

  const combined = [...curated];
  for (const s of all) {
    if (combined.length >= limit) break;
    if (!combined.some((c) => c.routeKey === s.routeKey)) combined.push(s);
  }

  return combined.slice(0, limit);
}
