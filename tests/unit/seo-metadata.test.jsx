import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SEO, { SITE_URL } from "@seo-under-test";

function pageIdentity() {
  return {
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    openGraph: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    structuredData: JSON.parse(document.querySelector('script[data-seo]')?.textContent || "{}").url,
  };
}

function expectIdentity(url) {
  expect(pageIdentity()).toEqual({ canonical: url, openGraph: url, structuredData: url });
}

beforeEach(() => {
  document.head.innerHTML = '<link rel="canonical" href="https://mymentalhealthbuddy.com/">';
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  cleanup();
  document.head.innerHTML = "";
});

describe("public-page SEO identity", () => {
  it("uses one production URL for relative tools canonical, Open Graph and JSON-LD", () => {
    window.history.replaceState({}, "", "/tools/all?utm_source=campaign#calm");
    render(<SEO title="All Free Wellness Tools" route="/tools/all" canonicalUrl="/tools/all" />);
    expectIdentity(`${SITE_URL}/tools/all`);
  });

  it("removes tracking queries and fragments from the default current page URL", () => {
    window.history.replaceState({}, "", "/pricing?utm_campaign=launch#plans");
    render(<SEO title="Pricing" />);
    expectIdentity(`${SITE_URL}/pricing`);
  });

  it("removes a fragment even when the current URL has no query", () => {
    window.history.replaceState({}, "", "/features#journal");
    render(<SEO title="Features" />);
    expectIdentity(`${SITE_URL}/features`);
  });

  it("uses an explicit route for every metadata format", () => {
    window.history.replaceState({}, "", "/alternate-path");
    render(<SEO title="Tools" route="/tools/all" />);
    expectIdentity(`${SITE_URL}/tools/all`);
  });

  it("preserves an explicit external canonical while removing tracking and fragments", () => {
    render(<SEO title="Syndicated Article" route="/blog/local-copy"
      canonicalUrl="https://publisher.example/articles/wellbeing?utm_source=mmhb#read" />);
    expectIdentity("https://publisher.example/articles/wellbeing");
  });

  it("updates every metadata format on client navigation without duplicates", () => {
    const view = render(<SEO title="Tools" canonicalUrl="/tools/all" />);
    window.history.replaceState({}, "", "/pricing?utm_source=tools#plans");
    view.rerender(<SEO title="Pricing" />);
    expectIdentity(`${SITE_URL}/pricing`);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:url"]')).toHaveLength(1);
    expect(document.querySelectorAll('script[data-seo]')).toHaveLength(1);
  });

  it("refreshes the default URL when a reused SEO component rerenders with the same props", () => {
    window.history.replaceState({}, "", "/features");
    const view = render(<SEO title="Wellness" />);
    window.history.replaceState({}, "", "/pricing#plans");
    view.rerender(<SEO title="Wellness" />);
    expectIdentity(`${SITE_URL}/pricing`);
  });
});
