import { listAllRouteMeta, resolveRoutePath } from "./routeMetaRegistry";

export type SearchHit = {
  routeKey: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedMinutes?: number;
};

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

export function buildSearchIndex(): SearchHit[] {
  return listAllRouteMeta().map((m) => ({
    routeKey: m.routeKey,
    title: m.title,
    description: m.description,
    href: resolveRoutePath(m.routeKey),
    tags: (m as any).tags || [],
    category: (m as any).category,
    difficulty: (m as any).difficulty,
    estimatedMinutes: (m as any).estimatedMinutes,
  }));
}

export function searchRoutes(query: string, limit = 12): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  const index = buildSearchIndex();
  const scored = index
    .map((hit) => {
      const hay = normalize([hit.title, hit.description, hit.tags.join(" "), hit.category || ""].join(" | "));
      let score = 0;

      if (normalize(hit.title).includes(q)) score += 5;
      if (normalize(hit.description).includes(q)) score += 2;
      if (hit.tags.some((t) => normalize(t).includes(q))) score += 3;
      if (hay.includes(q)) score += 1;

      if (q.length <= 6 && hit.difficulty === "beginner") score += 1;
      if (hit.estimatedMinutes && hit.estimatedMinutes <= 5) score += 1;

      return { hit, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.hit);

  return scored;
}
