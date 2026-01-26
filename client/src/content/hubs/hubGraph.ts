import { HUBS } from "./topicHubs";
import { listAllRouteMeta, resolveRoutePath } from "../meta/routeMetaRegistry";

export type HubLink = { label: string; routeKey: string; href: string; reason?: string };

function overlap(a: string[] = [], b: string[] = []) {
  const A = new Set(a.map((x) => x.toLowerCase()));
  return b.reduce((n, x) => n + (A.has(x.toLowerCase()) ? 1 : 0), 0);
}

export function getHubMeta(topic: string) {
  return HUBS.find((h) => h.topic === topic);
}

export function getHubLinks(topic: string, limit = 18): HubLink[] {
  const hub = getHubMeta(topic);
  if (!hub) return [];

  const all = listAllRouteMeta();

  const scored = all
    .filter((m) => !(m as any).isHub)
    .map((m) => ({
      m,
      score: overlap(hub.tags || [], (m as any).tags || []),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => ((b.m as any).priority || 0) - ((a.m as any).priority || 0) || b.score - a.score)
    .slice(0, limit)
    .map((x) => ({
      label: x.m.title,
      routeKey: x.m.routeKey,
      href: resolveRoutePath(x.m.routeKey),
      reason: "Matches hub topic",
    }));

  return scored;
}
