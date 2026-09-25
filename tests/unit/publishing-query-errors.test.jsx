import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../client/src/lib/queryClient.js";

const state = vi.hoisted(() => ({ panel: "pipeline", queries: new Map(), blogToggle: false }));
vi.mock("react", async (original) => {
  const actual = await original();
  return { ...actual, useState: (initial) => {
    if (initial === "instagram") state.blogToggle = true;
    const value = initial === "pipeline" ? state.panel : initial === false && state.blogToggle ? true : initial;
    return [value, vi.fn()];
  }};
});
vi.mock("@tanstack/react-query", async (original) => ({
  ...await original(),
  useQuery: ({ queryKey }) => state.queries.get(queryKey.join("|")) || { data: [], refetch: vi.fn() },
  useQueryClient: () => ({}),
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("../../client/src/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("../../client/src/components/SEO", () => ({ SEO: () => null }));
vi.mock("../../client/src/components/ui/ReflectionFooter", () => ({ default: () => null }));
vi.mock("wouter", () => ({ Link: ({ children }) => <a>{children}</a> }));

import NarrativeOpsConsole from "../../client/src/pages/admin/NarrativeOpsConsole";
import AdminPublishingToday from "../../client/src/pages/admin/AdminPublishingToday";

const base = "/api/admin/social/enterprise";
const cases = [
  ["featured publishing", "pipeline", ["/api/admin/publishing/featured"], AdminPublishingToday, "featured-card"],
  ["posts", "pipeline", [base, "/posts", "all", "all"], NarrativeOpsConsole, ">No posts<"],
  ["campaigns", "campaigns", [base, "/campaigns"], NarrativeOpsConsole, "No campaigns yet."],
  ["weekly queue", "weekly", [base, "/weekly-queue"], NarrativeOpsConsole, ">No posts<"],
  ["performance signals", "signals", [base, "/signals"], NarrativeOpsConsole, "No posted themes yet."],
  ["UTM click stats", "signals", [base, "/click-stats"], NarrativeOpsConsole, "No UTM click data yet."],
  ["audit log", "audit", [base, "/audit"], NarrativeOpsConsole, "No audit events yet."],
  ["blog posts", "pipeline", ["/api/blog"], NarrativeOpsConsole, "No blog posts found."],
];

afterEach(() => { vi.unstubAllGlobals(); state.queries.clear(); state.blogToggle = false; });

describe.each([401, 403, 503])("publishing HTTP %s", (status) => {
  it.each(cases)("%s is not represented as empty and can recover", async (section, panel, key, Page, emptyText) => {
    state.panel = panel;
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Synthetic failure" }), { status }));
    vi.stubGlobal("fetch", fetchMock);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    const options = { queryKey: key, queryFn: () => apiRequest("GET", "/synthetic-publishing") };
    const refetch = async () => {
      try { await client.fetchQuery(options); } catch {}
      const query = client.getQueryState(key);
      state.queries.set(key.join("|"), { ...query, refetch, isFetching: false });
    };
    await refetch();
    const html = renderToStaticMarkup(<Page />);
    expect(html).toContain(`Unable to load ${section}`);
    expect(html).toContain("button-inline-retry");
    expect(html).not.toContain(emptyText);
    if (section === "featured publishing") {
      expect(html).toContain('stat-featured">Unavailable');
      expect(html).toContain("panel-drafts-list");
    }
    if (section === "posts") expect(html).toContain("tab-audit");
    if (section === "performance signals") expect(html).toContain("No UTM click data yet.");
    if (section === "UTM click stats") expect(html).toContain("No posted themes yet.");
    state.blogToggle = false;
    state.queries.get(key.join("|")).isFetching = true;
    expect(renderToStaticMarkup(<Page />)).toContain(`Retrying ${section}`);
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true, data: [] })));
    await refetch();
    state.blogToggle = false;
    expect(renderToStaticMarkup(<Page />)).not.toContain(`Unable to load ${section}`);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([, init]) => init.method === "GET")).toBe(true);
    client.clear();
  });
});