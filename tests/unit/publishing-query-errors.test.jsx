import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../client/src/lib/queryClient.js";
import { validatePublishingResponse } from "../../client/src/lib/publishingResponses";
import { readFileSync } from "node:fs";

const state = vi.hoisted(() => ({ panel: "pipeline", queries: new Map(), options: new Map(), blogToggle: false }));
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
  useQuery: (options) => {
    state.options.set(options.queryKey.join("|"), options);
    return state.queries.get(options.queryKey.join("|")) || { refetch: vi.fn() };
  },
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
  ["publishing today", "pipeline", ["/api/admin/publishing/draft-packs"], AdminPublishingToday, "panel-stats"],
  ["featured publishing", "pipeline", ["/api/admin/publishing/featured"], AdminPublishingToday, "featured-card"],
  ["posts", "pipeline", [base, "/posts", "all", "all"], NarrativeOpsConsole, ">No posts<"],
  ["campaigns", "campaigns", [base, "/campaigns"], NarrativeOpsConsole, "No campaigns yet."],
  ["weekly queue", "weekly", [base, "/weekly-queue"], NarrativeOpsConsole, ">No posts<"],
  ["performance signals", "signals", [base, "/signals"], NarrativeOpsConsole, "No posted themes yet."],
  ["UTM click stats", "signals", [base, "/click-stats"], NarrativeOpsConsole, "No UTM click data yet."],
  ["audit log", "audit", [base, "/audit"], NarrativeOpsConsole, "No audit events yet."],
  ["blog posts", "pipeline", ["/api/blog"], NarrativeOpsConsole, "No blog posts found."],
];

afterEach(() => { vi.unstubAllGlobals(); state.queries.clear(); state.options.clear(); state.blogToggle = false; });

const emptySignals = { statusCounts: {}, topThemes: [], recentBlogActivity: [], suggestedFocus: [] };
const validPayload = section => ({
  ok: true,
  data: section === "featured publishing" ? {} : section === "performance signals" ? emptySignals : [],
});

describe("publishing read contracts", () => {
  const post = { id: "post-1", content: "Example", status: "draft", createdAt: "2026-09-25T00:00:00Z" };
  const populated = {
    posts: [{ ...post, captions: { instagram: "Caption" }, title: null }],
    weekly: [{ ...post, scheduledFor: "2026-09-25T10:00:00Z" }],
    campaigns: [{ id: "campaign-1", name: "Example", status: "active", goal: null }],
    featured: { "2026-09-25": { glpId: "draft-1", setAt: post.createdAt, setBy: "admin" } },
    signals: { statusCounts: { draft: 2 }, topThemes: [{ theme: null, count: 1 }], recentBlogActivity: [{ path: null, eventName: "view", count: 1 }], suggestedFocus: ["Review drafts"] },
    clicks: [{ path: "/blog", count: 1 }],
    audit: [{ id: "event-1", type: "social_created", createdAt: post.createdAt, meta: { source: "test" } }],
    blogs: [{ id: "blog-1", title: "Example" }],
  };
  it.each(Object.entries(populated))("accepts populated %s without dropping fields", (contract, data) => {
    expect(validatePublishingResponse(contract, { ok: true, data })).toEqual({ ok: true, data });
  });
  it.each(["social", "blog", "newsletter"])("accepts shipped %s draft packs", (type) => {
    const data = JSON.parse(readFileSync(`content/publishing/drafts/${type}Pack_v2_1.json`, "utf8"));
    expect(validatePublishingResponse("drafts", { ok: true, data }).data).toEqual(data);
  });
  it.each([
    ["posts", [{ ...post, status: "unknown" }]],
    ["posts", [{ ...post, captions: { instagram: {} } }]],
    ["weekly", [post]],
    ["campaigns", [{ id: "c", name: {}, status: "active" }]],
    ["featured", { "2026-09-25": { glpId: null } }],
    ["signals", { ...emptySignals, statusCounts: { draft: "2" } }],
    ["signals", { ...emptySignals, topThemes: [null] }],
    ["signals", { ...emptySignals, recentBlogActivity: [{}] }],
    ["signals", { ...emptySignals, suggestedFocus: [{}] }],
    ["clicks", [{ path: "/blog", count: -1 }]],
    ["audit", [{ id: "a", type: "social_created", createdAt: "invalid" }]],
    ["blogs", [{ id: "b", title: {} }]],
  ])("rejects malformed nested %s", (contract, data) => {
    expect(() => validatePublishingResponse(contract, { ok: true, data })).toThrow(/Invalid .* response/);
  });
});

// Execute the page's actual queryFn, not a parallel copy of its fetch logic.
describe.each([
  undefined, null, {}, [], "unexpected", { ok: true }, { ok: false, data: [] },
  { success: true, data: [] }, { ok: true, data: null },
  { ok: true, data: "unexpected" }, { ok: true, data: [null] },
  { ok: true, data: [{}] }, { ok: true, data: { unexpected: {} } },
])("malformed HTTP 200 payload %#", (payload) => {
  it.each(cases)("%s shows retry instead of empty data", async (section, panel, key, Page, emptyText) => {
    state.panel = panel;
    renderToStaticMarkup(<Page />);
    const options = { ...state.options.get(key.join("|")), retry: false };
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(payload === undefined ? "" : JSON.stringify(payload)));
    vi.stubGlobal("fetch", fetchMock);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    const refetch = async () => {
      try { await client.fetchQuery(options); } catch {}
      state.queries.set(key.join("|"), { ...client.getQueryState(key), refetch });
    };
    await refetch();
    state.blogToggle = false;
    const html = renderToStaticMarkup(<Page />);
    expect(html).toContain(`Unable to load ${section}`);
    expect(html).not.toContain(emptyText);
    expect(html).toMatch(/button-(inline-)?retry/);
    fetchMock.mockImplementation(async () => new Response(JSON.stringify(validPayload(section))));
    await refetch();
    state.blogToggle = false;
    expect(renderToStaticMarkup(<Page />)).not.toContain(`Unable to load ${section}`);
    expect(fetchMock.mock.calls.every(([, init]) => init.method === "GET")).toBe(true);
    client.clear();
  });
});

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
    expect(html).toMatch(/button-(inline-)?retry/);
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
    if (section !== "publishing today") expect(renderToStaticMarkup(<Page />)).toContain(`Retrying ${section}`);
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true, data: [] })));
    await refetch();
    state.blogToggle = false;
    expect(renderToStaticMarkup(<Page />)).not.toContain(`Unable to load ${section}`);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([, init]) => init.method === "GET")).toBe(true);
    client.clear();
  });
});