import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fixture = vi.hoisted(() => ({ auth: { subscriptionStatus: "free", isPro: false, isLoading: false } }));
vi.mock("../../client/src/context/AuthContext.jsx", () => ({ useAuth: () => fixture.auth }));
vi.mock("../../client/src/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("../../client/src/hooks/useSEO", () => ({ useSEO: () => {} }));
vi.mock("../../client/src/lib/benefits", () => ({ pickBenefits: () => [] }));
vi.mock("../../client/src/components/wellness/WellnessPageShell", () => ({ WellnessPageShell: ({ children }) => <>{children}</> }));
vi.mock("wouter", () => ({ Link: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>, useLocation: () => ["/account/billing", vi.fn()] }));

import Billing from "@billing-under-test";
import { queryClient as applicationQueryClient } from "../../client/src/lib/queryClient.js";

const paid = (plan = "pro", overrides = {}) => ({
  success: true, plan, status: "active", currentPeriodEnd: "2099-01-01T00:00:00.000Z", cancelAtPeriodEnd: false,
  ...overrides,
});
const free = () => ({ success: true, plan: "free", status: "none", currentPeriodEnd: null, cancelAtPeriodEnd: false });
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
let subscriptionReply;
let portalReply;
let fetchMock;
let clients;

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/account/billing");
  fixture.auth = { subscriptionStatus: "free", isPro: false, isLoading: false };
  subscriptionReply = () => json(paid());
  portalReply = () => json({ success: true, url: "#billing-portal-fixture" });
  fetchMock = vi.fn(async url => {
    if (url === "/api/billing/subscription-status") return subscriptionReply();
    if (url === "/api/billing/invoices") return json({ success: true, invoices: [] });
    if (url === "/api/billing/portal") return portalReply();
    throw new Error(`Unexpected billing request: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  clients = [];
});
afterEach(() => {
  cleanup();
  clients.forEach(client => client.clear());
  vi.unstubAllGlobals();
});

function showBilling() {
  const defaults = applicationQueryClient.getDefaultOptions();
  // Real hooks and the application's real queryFn/apiRequest run against
  // synthetic HTTP responses. Retry is explicit here to keep outcomes bounded.
  const client = new QueryClient({ defaultOptions: {
    ...defaults, queries: { ...defaults.queries, retry: false, gcTime: Infinity },
  } });
  clients.push(client);
  render(<QueryClientProvider client={client}><Billing /></QueryClientProvider>);
  return client;
}

function expectNoBillingActions() {
  expect(screen.queryByTestId("section-plans")).toBeNull();
  for (const id of ["button-upgrade-pro", "button-resubscribe", "button-manage-subscription", "button-manage-subscription-plan", "button-view-all-invoices", "button-update-payment"]) {
    expect(screen.queryByTestId(id)).toBeNull();
  }
}

describe("confirmed billing display", () => {
  it("uses confirmed active Pro instead of the stale free auth snapshot", async () => {
    showBilling();
    const current = within(await screen.findByTestId("section-current-plan"));
    expect(current.getByRole("heading", { name: /pro plan/i })).toBeTruthy();
    expect(current.getByText(/renews on/i)).toBeTruthy();
    expect(current.getByRole("button", { name: "Manage Subscription" })).toBeTruthy();
    expect(screen.queryByTestId("button-upgrade-pro")).toBeNull();
  });

  it("uses confirmed free instead of stale paid authentication", async () => {
    fixture.auth = { subscriptionStatus: "pro", isPro: true, isLoading: false };
    subscriptionReply = () => json(free());
    showBilling();
    const current = within(await screen.findByTestId("section-current-plan"));
    expect(current.getByRole("heading", { name: "Free Plan" })).toBeTruthy();
    expect(screen.getByTestId("button-upgrade-pro")).toBeTruthy();
    expect(screen.queryByTestId("button-manage-subscription")).toBeNull();
  });

  it("does not let stale isPro reactivate an expired plan", async () => {
    fixture.auth = { subscriptionStatus: "pro", isPro: true, isLoading: false };
    subscriptionReply = () => json(paid("pro", { status: "none", currentPeriodEnd: "2020-01-01T00:00:00.000Z" }));
    showBilling();
    const current = within(await screen.findByTestId("section-current-plan"));
    expect(current.getByRole("heading", { name: /pro plan.*inactive/i })).toBeTruthy();
    expect(current.queryByText(/renews on/i)).toBeNull();
    expect(screen.queryByTestId("button-manage-subscription")).toBeNull();
    expect(screen.getByTestId("button-resubscribe")).toBeTruthy();
    expect(within(screen.getByTestId("plan-pro")).queryByText("Your Plan")).toBeNull();
  });

  it("shows confirmed Elite without falsely selecting the Pro comparison card", async () => {
    subscriptionReply = () => json(paid("elite", { cancelAtPeriodEnd: true }));
    showBilling();
    const current = within(await screen.findByTestId("section-current-plan"));
    expect(current.getByRole("heading", { name: /elite plan/i })).toBeTruthy();
    expect(current.getByText(/cancels on/i)).toBeTruthy();
    expect(within(screen.getByTestId("plan-pro")).queryByText("Your Plan")).toBeNull();
    expect(screen.queryByTestId("button-upgrade-pro")).toBeNull();
  });

  it("describes confirmed Starter as one-time access without recurring-date claims", async () => {
    subscriptionReply = () => json(paid("starter", { currentPeriodEnd: null }));
    showBilling();
    const current = within(await screen.findByTestId("section-current-plan"));
    expect(current.getByRole("heading", { name: /starter plan/i })).toBeTruthy();
    expect(current.getByText("One-time access")).toBeTruthy();
    expect(current.queryByText(/renews on|cancels on/i)).toBeNull();
    expect(within(screen.getByTestId("plan-pro")).queryByText("Your Plan")).toBeNull();
  });

  it("waits for billing confirmation before exposing checkout or portal actions", async () => {
    let resolveSubscription;
    subscriptionReply = () => new Promise(resolve => { resolveSubscription = resolve; });
    showBilling();
    expect(screen.getByRole("status").textContent).toMatch(/loading.*billing/i);
    expectNoBillingActions();
    await act(async () => resolveSubscription(json(paid())));
    expect(await screen.findByTestId("button-manage-subscription")).toBeTruthy();
  });

  it.each([
    ["HTTP failure", () => json({ success: false, error: "Synthetic unavailable response" }, 503)],
    ["network failure", () => Promise.reject(new Error("Synthetic transport failure"))],
    ["malformed response", () => new Response("not-json")],
    ["unconfirmed HTTP success", () => json({ success: true })],
    ["application rejection", () => json({ success: false, plan: "pro", status: "active" })],
    ["unknown plan", () => json(paid("unknown-plan"))],
    ["unknown status", () => json(paid("pro", { status: "unknown-status" }))],
  ])("shows a retryable state without speculative actions after %s", async (_name, reply) => {
    fixture.auth = { subscriptionStatus: "pro", isPro: true, isLoading: false };
    subscriptionReply = reply;
    showBilling();
    expect((await screen.findByRole("alert")).textContent).toMatch(/billing/i);
    expect(screen.queryByTestId("section-current-plan")).toBeNull();
    expectNoBillingActions();
    subscriptionReply = () => json(paid());
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByTestId("button-manage-subscription")).toBeTruthy();
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/billing/subscription-status")).toHaveLength(2);
  });

  it("opens the existing billing portal after confirmed paid status", async () => {
    fixture.auth = { subscriptionStatus: "pro", isPro: true, isLoading: false };
    let resolvePortal;
    portalReply = () => new Promise(resolve => { resolvePortal = resolve; });
    showBilling();
    const manage = await screen.findByTestId("button-manage-subscription");
    fireEvent.click(manage);
    await waitFor(() => expect(manage.getAttribute("aria-busy")).toBe("true"));
    fireEvent.click(manage);
    const portalCalls = fetchMock.mock.calls.filter(([url]) => url === "/api/billing/portal");
    expect(portalCalls).toHaveLength(1);
    expect(portalCalls[0][1]).toMatchObject({ method: "POST", credentials: "include" });
    await act(async () => resolvePortal(json({ success: true, url: "#billing-portal-fixture" })));
    await waitFor(() => expect(window.location.hash).toBe("#billing-portal-fixture"));
  });
});
