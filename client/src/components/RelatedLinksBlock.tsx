import React from "react";
import { getPathForRouteKey } from "../content/routes.js";

type LinkItem = { label: string; routeKey: string };

export function RelatedLinksBlock({
  links,
  title = "Next best steps",
  subtitle = "Choose one small, supportive link (no pressure).",
}: {
  links?: LinkItem[];
  title?: string;
  subtitle?: string;
}) {
  if (!links || links.length === 0) return null;

  const resolved = links
    .map((l) => {
      const path = getPathForRouteKey(l.routeKey);
      return path ? { label: l.label, path } : null;
    })
    .filter(Boolean) as Array<{ label: string; path: string }>;

  if (resolved.length === 0) return null;

  return (
    <section 
      className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.18)] p-5"
      data-testid="section-related-links"
    >
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{subtitle}</p>
      </div>

      <ul className="grid gap-2 md:grid-cols-2">
        {resolved.map((l, idx) => (
          <li key={l.path}>
            <a
              href={l.path}
              className="group flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] px-4 py-3 transition hover:bg-[rgba(255,255,255,0.06)]"
              data-testid={`link-related-${idx}`}
            >
              <span className="text-sm font-medium">{l.label}</span>
              <span className="text-sm opacity-70 group-hover:opacity-90">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

