import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../client/src/components/ui/ReflectionFooter", () => ({ default: () => null }));
vi.mock("../../client/src/components/admin/AdminQueryStates", () => ({
  AdminErrorBanner: ({ title, onRetry }) => <div role="alert">{title}<button onClick={onRetry}>Retry</button></div>,
}));

import SocialDashboard from "../../client/src/pages/admin/SocialDashboard.jsx";
import { queryClient } from "../../client/src/lib/queryClient.js";

const FIRST = "11111111-1111-4111-8111-111111111111";
const SECOND = "22222222-2222-4222-8222-222222222222";
const defaults = queryClient.getDefaultOptions();
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const platformIds = ["youtube", "tiktok", "instagram", "facebook", "x", "threads", "pinterest", "linkedin"];
let drafts;
let manualReply;
let platformReply;
let fetchMock;
let createObjectURL;
let revokeObjectURL;
let anchorClicks;
let originalCreateDescriptor;
let originalRevokeDescriptor;

function preparation(data) {
  const draft = drafts.find(item => item.id === data.draftId);
  return {
    draftId: data.draftId,
    mode: "manual_preparation",
    status: "manual_required",
    published: false,
    successful: 0,
    prepared: data.platforms.length,
    totalPlatforms: data.platforms.length,
    results: data.platforms.map(platform => ({
      platform,
      prepared: true,
      success: false,
      status: "manual_required",
      content: { hook: draft.hook, caption: draft.caption, hashtags: "#synthetic", cta: "Review before manual upload", disclaimer: "Synthetic test content" },
    })),
    preparedAt: "2026-11-14T00:00:00.000Z",
  };
}

function postCalls() {
  return fetchMock.mock.calls.filter(([, options]) => options?.method === "POST");
}

function showDashboard() {
  render(<QueryClientProvider client={queryClient}><SocialDashboard /></QueryClientProvider>);
}

async function openPreparation(id = FIRST) {
  const card = await screen.findByTestId(`card-draft-${id}`);
  fireEvent.click(within(card).getByRole("button", { name: "Prepare upload" }));
  return screen.getByRole("dialog", { name: "Prepare for manual upload" });
}

async function prepare(id = FIRST) {
  const dialog = await openPreparation(id);
  fireEvent.click(within(dialog).getByTestId("button-confirm-publish"));
  await within(dialog).findByRole("textbox", { name: "Prepared content for youtube" });
  return dialog;
}

function blobText(blob) {
  if (typeof blob.text === "function") return blob.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

beforeEach(() => {
  queryClient.clear();
  queryClient.setDefaultOptions({
    ...defaults,
    queries: { ...defaults.queries, retry: false, gcTime: Infinity },
    mutations: { ...defaults.mutations, retry: false, gcTime: Infinity },
  });
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/admin/social");
  drafts = [
    { id: FIRST, status: "approved", platform: "youtube", hook: "First synthetic draft", caption: "First synthetic caption", createdAt: "2026-11-14T00:00:00.000Z" },
    { id: SECOND, status: "approved", platform: "youtube", hook: "Second synthetic draft", caption: "Second synthetic caption", createdAt: "2026-11-14T00:00:00.000Z" },
  ];
  manualReply = async data => json({ ok: true, data: preparation(data) });
  platformReply = () => json({ ok: true, data: { platforms: platformIds.map(id => ({ id, connected: id === "youtube" })) } });
  fetchMock = vi.fn(async (url, options = {}) => {
    if (url === "/api/admin/social/drafts" && !options.method) return json({ ok: true, data: drafts });
    if (url === "/api/admin/social/analytics" && !options.method) {
      return json({ ok: true, data: { totals: { drafts: drafts.length }, contentHealth: {}, platformBreakdown: {}, weeklyActivity: [] } });
    }
    if (url === "/api/social-posting/platforms/status" && !options.method) return platformReply();
    if (url === "/api/admin/social/publish/batch" && options.method === "POST") return manualReply(JSON.parse(options.body));
    throw new Error(`Unexpected network request in isolated DOM fixture: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  originalCreateDescriptor = Object.getOwnPropertyDescriptor(window.URL, "createObjectURL");
  originalRevokeDescriptor = Object.getOwnPropertyDescriptor(window.URL, "revokeObjectURL");
  createObjectURL = vi.fn(() => "blob:manual-preparation-fixture");
  revokeObjectURL = vi.fn();
  Object.defineProperty(window.URL, "createObjectURL", { configurable: true, value: createObjectURL });
  Object.defineProperty(window.URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
  anchorClicks = [];
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function clicked() {
    anchorClicks.push({ download: this.download, href: this.href });
  });
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  if (vi.isFakeTimers()) {
    vi.clearAllTimers();
    vi.useRealTimers();
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalCreateDescriptor) Object.defineProperty(window.URL, "createObjectURL", originalCreateDescriptor);
  else delete window.URL.createObjectURL;
  if (originalRevokeDescriptor) Object.defineProperty(window.URL, "revokeObjectURL", originalRevokeDescriptor);
  else delete window.URL.revokeObjectURL;
});

describe("manual content preparation", () => {
  it("reads wrapped responses and protects unknown publication states from editorial changes", async () => {
    drafts[0].status = "unrecognized_provider_state";
    showDashboard();
    const card = await screen.findByTestId(`card-draft-${FIRST}`);
    expect(within(card).getByText("Unknown status")).toBeTruthy();
    const deleteButton = within(card).getByTestId(`button-delete-${FIRST}`);
    expect(deleteButton.disabled).toBe(true);
    expect(deleteButton.title).toContain("Review this draft's publication status");
    fireEvent.click(deleteButton);
    expect(await screen.findByText("1/8 configured")).toBeTruthy();
    expect(screen.queryByText("API Ready")).toBeNull();
    fireEvent.click(screen.getByTestId("button-bulk-mode"));
    fireEvent.click(card);
    const approveSelected = screen.getByTestId("button-bulk-approve");
    const deleteSelected = screen.getByTestId("button-bulk-delete");
    expect(approveSelected.disabled).toBe(true);
    expect(deleteSelected.disabled).toBe(true);
    expect(screen.getByText("Review the selected drafts' publication status before approving or deleting them.")).toBeTruthy();
    fireEvent.click(approveSelected);
    fireEvent.click(deleteSelected);
    expect(fetchMock.mock.calls.filter(([, options]) => options?.method && options.method !== "GET")).toHaveLength(0);
  });

  it("keeps the manual endpoint and modal open with prepared content without requesting a download or provider post", async () => {
    showDashboard();
    const dialog = await prepare();
    expect(within(dialog).getByText(/This preparation request has not published anything/)).toBeTruthy();
    expect(within(dialog).getByRole("textbox", { name: "Prepared content for youtube" }).value).toContain("First synthetic caption");
    expect(postCalls()).toHaveLength(1);
    expect(postCalls()[0][0]).toBe("/api/admin/social/publish/batch");
    expect(JSON.parse(postCalls()[0][1].body)).toEqual({ draftId: FIRST, platforms: ["youtube"] });
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(anchorClicks).toHaveLength(0);
  });

  it("downloads the prepared text only after the explicit action and asks the owner to confirm device storage", async () => {
    showDashboard();
    const dialog = await prepare();
    expect(createObjectURL).not.toHaveBeenCalled();
    vi.useFakeTimers();
    try {
      fireEvent.click(within(dialog).getByRole("button", { name: "Download prepared text" }));
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(anchorClicks).toHaveLength(1);
      expect(anchorClicks[0].download).toMatch(/^mymentalhealthbuddy-manual-posts-\d{4}-\d{2}-\d{2}\.txt$/);
      expect(within(dialog).getByText(/Check your browser downloads to confirm the file was saved/)).toBeTruthy();
      act(() => { vi.advanceTimersByTime(1000); });
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:manual-preparation-fixture");
    } finally {
      vi.useRealTimers();
    }
    const blob = createObjectURL.mock.calls[0][0];
    expect(blob.type).toBe("text/plain;charset=utf-8");
    const text = await blobText(blob);
    expect(text).toContain("Preparing this file does not publish its contents");
    expect(text).toContain("First synthetic caption");
    expect(text).toContain("Synthetic test content");
    expect(postCalls()).toHaveLength(1);
  });

  it("does not mark a malformed or publication-claiming response as prepared", async () => {
    manualReply = async data => json({ ok: true, data: { ...preparation(data), published: true } });
    showDashboard();
    const dialog = await openPreparation();
    fireEvent.click(within(dialog).getByTestId("button-confirm-publish"));
    expect(await within(dialog).findByRole("alert")).toBeTruthy();
    expect(within(dialog).queryByRole("textbox")).toBeNull();
    expect(within(dialog).queryByText(/This preparation request has not published anything/)).toBeNull();
    expect(createObjectURL).not.toHaveBeenCalled();
    expect(postCalls()).toHaveLength(1);
  });

  it("does not replace a different draft's preview with a late response", async () => {
    let resolveFirst;
    let firstResolved = false;
    manualReply = data => data.draftId === FIRST
      ? new Promise(resolve => {
        resolveFirst = () => {
          if (firstResolved) return;
          firstResolved = true;
          resolve(json({ ok: true, data: preparation(data) }));
        };
      })
      : Promise.resolve(json({ ok: true, data: preparation(data) }));
    try {
      showDashboard();
      const firstDialog = await openPreparation();
      fireEvent.click(within(firstDialog).getByTestId("button-confirm-publish"));
      await waitFor(() => expect(typeof resolveFirst).toBe("function"));
      fireEvent.click(within(firstDialog).getAllByRole("button", { name: "Close" })[0]);
      const secondDialog = await prepare(SECOND);
      expect(within(secondDialog).getByRole("textbox").value).toContain("Second synthetic caption");
      await act(async () => { resolveFirst(); });
      await waitFor(() => {
        const firstMutation = queryClient.getMutationCache().getAll().find(mutation => mutation.state.variables?.draftId === FIRST);
        expect(firstMutation?.state.status).toBe("success");
      });
      expect(within(secondDialog).getByRole("textbox").value).toContain("Second synthetic caption");
      expect(within(secondDialog).getByRole("textbox").value).not.toContain("First synthetic caption");
      expect(createObjectURL).not.toHaveBeenCalled();
    } finally {
      if (resolveFirst) await act(async () => { resolveFirst(); });
    }
  });

  it("clears prepared content when the target selection changes and offers unconfigured networks only as manual choices", async () => {
    showDashboard();
    const dialog = await prepare();
    fireEvent.click(within(dialog).getByTestId("toggle-platform-linkedin"));
    expect(within(dialog).queryByRole("textbox")).toBeNull();
    expect(within(dialog).queryByRole("button", { name: "Download prepared text" })).toBeNull();
    expect(within(dialog).getByText(/This action does not post to your social accounts/)).toBeTruthy();
    expect(postCalls()).toHaveLength(1);
  });

  it("does not turn a failed platform read into a zero-configuration claim", async () => {
    platformReply = () => json({ ok: false, error: "Synthetic service unavailable" }, 503);
    showDashboard();
    expect(await screen.findByText("Unable to load platform connections")).toBeTruthy();
    expect(screen.queryByText("No platforms configured yet")).toBeNull();
    expect(screen.queryByText("0/0 configured")).toBeNull();
    expect(postCalls()).toHaveLength(0);
  });
});
