import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("../../client/src/context/AuthContext.jsx", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("../../client/src/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("../../client/src/lib/api", () => ({ getAuthToken: () => null }));
vi.mock("../../client/src/hooks/useAnalytics.mjs", () => ({ trackEvent: vi.fn() }));
vi.mock("../../client/src/components/SEO", () => ({ default: () => null }));
vi.mock("../../client/src/components/ui/ReflectionFooter", () => ({ default: () => null }));
vi.mock("../../client/src/sections/PricingFAQ.jsx", () => ({ default: () => null }));
vi.mock("../../client/src/components/benefits", () => ({ TrustSignals: () => null }));
vi.mock("../../client/src/lib/benefits", () => ({ pickBenefits: () => [] }));
vi.mock("../../client/src/components/wellness/WellnessPageShell", () => ({ WellnessPageShell: ({ children }) => <>{children}</> }));
vi.mock("wouter", () => ({ Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>, useLocation: () => ["/pricing", vi.fn()] }));

import Pricing from "@pricing-under-test";
import NewsletterSignup from "@newsletter-under-test";

let fetchMock;
const accepted = () => new Response(JSON.stringify({ ok: true, data: { subscribed: true }, message: "Saved." }), { status: 201 });
const leadCalls = () => fetchMock.mock.calls.filter(([url]) => url === "/api/leads");

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/pricing");
  fetchMock = vi.fn().mockResolvedValue(accepted());
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function pricingForm() {
  render(<Pricing />);
  const section = within(screen.getByTestId("section-email-capture"));
  const form = section.getByTestId("form-newsletter");
  fireEvent.change(section.getByRole("textbox", { name: "Stay Updated" }), { target: { value: "reader@example.invalid" } });
  return { section, form, consent: section.getByRole("checkbox"), submit: section.getByRole("button", { name: "Subscribe" }) };
}

describe("pricing lead capture", () => {
  it("requires explicit consent before contacting the lead endpoint", () => {
    const { section, form } = pricingForm();
    fireEvent.submit(form);
    expect(leadCalls()).toHaveLength(0);
    expect(section.getByRole("alert").textContent).toContain("agree to receive updates");
  });

  it("waits for accepted server persistence and sends consent and pricing attribution", async () => {
    let resolveLead;
    fetchMock.mockImplementation(url => url === "/api/leads" ? new Promise(resolve => { resolveLead = resolve; }) : Promise.resolve(accepted()));
    const { section, form, consent, submit } = pricingForm();
    fireEvent.click(consent);
    fireEvent.submit(form);
    expect(submit.disabled).toBe(true);
    expect(section.queryByRole("status")).toBeNull();
    expect(leadCalls()).toHaveLength(1);
    const [, request] = leadCalls()[0];
    expect(request.method).toBe("POST");
    expect(JSON.parse(request.body)).toEqual({ email: "reader@example.invalid", consent: true, source: "pricing" });
    expect(localStorage.getItem("mmhb-pricing-lead")).toBeNull();
    fireEvent.submit(form);
    expect(leadCalls()).toHaveLength(1);
    await act(async () => resolveLead(accepted()));
    expect(section.getByRole("status").textContent).toContain("You're subscribed!");
  });

  it.each([
    ["HTTP rejection", () => Promise.resolve(new Response(JSON.stringify({ ok: false, message: "Please try again later." }), { status: 503 }))],
    ["network failure", () => Promise.reject(new Error("Synthetic connection failure"))],
    ["malformed JSON", () => Promise.resolve(new Response("not JSON"))],
    ["unconfirmed HTTP 200", () => Promise.resolve(new Response(JSON.stringify({ ok: true })))],
    ["application rejection in HTTP 200", () => Promise.resolve(new Response(JSON.stringify({ ok: false, data: { subscribed: false } })))],
    ["null HTTP 200", () => Promise.resolve(new Response("null"))],
  ])("keeps the form retryable after %s", async (_label, failure) => {
    fetchMock.mockImplementation(url => url === "/api/leads" ? failure() : Promise.resolve(accepted()));
    const { section, form, consent, submit } = pricingForm();
    fireEvent.click(consent);
    fireEvent.submit(form);
    await waitFor(() => expect(section.getByRole("alert")).toBeTruthy());
    expect(section.queryByRole("status")).toBeNull();
    expect(submit.disabled).toBe(false);
    expect(section.getByRole("textbox").value).toBe("reader@example.invalid");
    expect(consent.checked).toBe(true);
    fetchMock.mockResolvedValue(accepted());
    fireEvent.submit(form);
    await waitFor(() => expect(section.getByRole("status")).toBeTruthy());
    expect(leadCalls()).toHaveLength(2);
  });

  it("can submit when stored tracking data is null", async () => {
    localStorage.setItem("glp_utm", "null");
    const { section, form, consent } = pricingForm();
    fireEvent.click(consent);
    fireEvent.submit(form);
    await waitFor(() => expect(section.getByRole("status")).toBeTruthy());
    expect(leadCalls()).toHaveLength(1);
  });

  it("keeps the pricing and footer email labels associated with their own inputs", () => {
    render(<><NewsletterSignup variant="inline" source="pricing" /><NewsletterSignup /></>);
    const inputs = screen.getAllByRole("textbox", { name: "Stay Updated" });
    expect(inputs).toHaveLength(2);
    expect(new Set(inputs.map(input => input.id)).size).toBe(2);
  });
});
