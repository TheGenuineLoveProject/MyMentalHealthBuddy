// Synthetic only: no application bootstrap, database, provider, or real credential.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import http from "node:http";

const dir = await fs.mkdtemp(path.resolve("node_modules/.admin-health-test-"));
const fixture = {
  ok: true, status: "healthy", buildVersion: "synthetic", uptime: "2m",
  uptimeSeconds: 120, database: { status: "connected", latencyMs: 3 },
  environment: { NODE_ENV: true, DATABASE_URL: true, JWT_SECRET: true,
    OPENAI_API_KEY: false, STRIPE_SECRET_KEY: false },
  system: { nodeVersion: "synthetic", platform: "linux", heapUsed: "20 MB",
    heapTotal: "40 MB", freeMemory: "100 MB", totalMemory: "200 MB" },
};
try {
  await build({
    entryPoints: ["client/src/lib/adminHealthQuery.js"], bundle: true,
    platform: "node", format: "esm", packages: "external",
    outfile: path.join(dir, "query.mjs"),
  });
  const { boundedHealthQuery, HEALTH_REQUEST_TIMEOUT_MS } = await import(path.join(dir, "query.mjs"));
  globalThis.window = { location: { origin: "https://synthetic.invalid" } };
  let accountToken = null;
  let adminSession = "synthetic-admin-session";
  globalThis.localStorage = { getItem: key => key === "mmhb_token" ? accountToken : null };
  globalThis.sessionStorage = { getItem: () => adminSession };
  let mode = "success";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/admin/browser-health");
    assert.equal(options.headers.Authorization, `Bearer ${adminSession || accountToken}`);
    assert.equal(options.headers["x-admin-session"], adminSession || undefined);
    assert.equal(options.credentials, "include");
    assert.ok(!("x-admin-token" in options.headers));
    if (mode === "hang") return new Promise((_, reject) =>
      options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }));
    if (mode === "invalid") return new Response(JSON.stringify({ uptime: {} }));
    if (mode === "empty") return new Response(null, { status: 204 });
    if (typeof mode === "number") return new Response("unavailable", { status: mode });
    return new Response(JSON.stringify(fixture));
  };
  const context = { queryKey: ["/api/admin/browser-health", 0] };
  assert.deepEqual(await boundedHealthQuery(context), fixture);
  accountToken = "synthetic-ordinary-account";
  assert.deepEqual(await boundedHealthQuery(context), fixture);
  adminSession = null;
  accountToken = "synthetic-admin-account";
  assert.deepEqual(await boundedHealthQuery(context), fixture);
  for (mode of [401, 403, 404, 503, "invalid", "empty"]) {
    await assert.rejects(boundedHealthQuery(context));
  }
  mode = "hang";
  const started = Date.now();
  await assert.rejects(boundedHealthQuery(context), /aborted/);
  assert.ok(Date.now() - started < HEALTH_REQUEST_TIMEOUT_MS + 1500);
  mode = "success";
  assert.equal((await boundedHealthQuery(context)).status, "healthy");
  delete globalThis.window;

  await build({
    entryPoints: ["client/src/pages/admin/HealthDashboard.jsx"],
    bundle: true, platform: "node", format: "esm", packages: "external", external: ["react"],
    jsx: "automatic", alias: { "@": path.resolve("client/src") },
    loader: { ".css": "empty" }, outfile: path.join(dir, "page.mjs"),
    plugins: [{
      name: "synthetic-page-context",
      setup(b) {
        b.onResolve({ filter: /^@tanstack\/react-query$/ }, () => ({ path: "query", namespace: "fixture" }));
        b.onLoad({ filter: /.*/, namespace: "fixture" }, () => ({ contents: `
          export function useQuery(options) {
            globalThis.healthQueryKeys.push(options.queryKey[0]);
            return options.queryKey[0] === "/api/admin/browser-health"
              ? globalThis.healthState
              : { error: new Error("Synthetic optional section unavailable"), refetch() {} };
          }
          export function useMutation() { return {}; }
          export class QueryClient { constructor() {} }
        ` }));
        b.onResolve({ filter: /Top50ProcessTracker|ReflectionFooter/ }, () => ({ path: "panel", namespace: "stub" }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export default function Panel(){return null}" }));
        b.onResolve({ filter: /^wouter$/ }, () => ({ path: "link", namespace: "link" }));
        b.onLoad({ filter: /.*/, namespace: "link" }, () => ({ contents: `
          import React from "react";
          export const Link = ({children, ...props}) => React.createElement("a", props, children);
        ` }));
      },
    }],
  });
  const Page = (await import(path.join(dir, "page.mjs"))).default;
  function render(state) {
    globalThis.healthQueryKeys = [];
    globalThis.healthState = { refetch() {}, ...state };
    const html = renderToStaticMarkup(React.createElement(Page));
    assert.ok(!globalThis.healthQueryKeys.includes("/api/admin/health"));
    assert.ok(!globalThis.healthQueryKeys.includes("/api/admin/diagnostics"));
    return html;
  }
  const healthyHtml = render({ data: fixture });
  assert.match(healthyHtml, /System Health/);
  assert.match(healthyHtml, /2m/);
  assert.match(healthyHtml, /deep-health-error/);
  assert.doesNotMatch(healthyHtml, /metric-pass/);
  assert.match(render({ isLoading: true }), /Loading health data/);
  const failed = render({ error: new Error("synthetic") });
  assert.match(failed, /Unable to load health data/);
  assert.match(failed, /Try Again/);
  assert.doesNotMatch(failed, /Loading health data/);
  assert.match(render({ data: { ...fixture, ok: false, status: "degraded",
    database: { status: "disconnected", latencyMs: null } } }), /Unavailable/);
  console.log("PASS: bounded requests, session headers, error/empty/malformed responses, recovery, and dashboard render states");
  if (process.argv.includes("--preview")) {
    const server = http.createServer((_req, res) => {
      res.setHeader("Content-Type", "text/html");
      res.end(`<!doctype html><html><head><style>body{font-family:system-ui;margin:32px;background:#f8faf9;color:#173d37}svg{width:20px;height:20px}button{padding:12px} .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}.glp-pane{padding:20px}h1{font-size:28px}</style></head><body><p>ISOLATED SYNTHETIC HEALTH SUMMARY — NOT LIVE DATA</p>${healthyHtml}</body></html>`);
    });
    server.listen(5001, "0.0.0.0", () => console.log("Synthetic health visual on 5001"));
    await new Promise(resolve => process.once("SIGTERM", () => server.close(resolve)));
  }
} finally {
  await fs.rm(dir, { recursive: true, force: true });
}