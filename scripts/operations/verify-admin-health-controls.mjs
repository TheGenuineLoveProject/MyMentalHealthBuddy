// Isolated synthetic qualification: never boots the app, contacts a service, or exercises live controls.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dir = await fs.mkdtemp(path.resolve("node_modules/.admin-health-controls-"));
const origin = "https://synthetic.invalid";
const adminSession = "synthetic-tab-session";
const ordinaryToken = "synthetic-account-token";
const deepPath = "/api/admin/health-deep";
const endpoints = [
  ["/run", { verdict: "HEALTHY", totals: { pass: 3, warn: 1, fail: 0 } }, /Re-probe complete: HEALTHY/],
  ["/self-heal", { outcome: "repaired", before: { verdict: "DEGRADED" }, after: { verdict: "HEALTHY" }, durationMs: 12 }, /Self-heal: repaired/],
  ["/ai-analyze", { diagnosis: { overall_severity: "low", summary: "Synthetic diagnosis" } }, /AI diagnosis: low severity/],
  ["/scheduler/resume", { resumed: true }, /Auto-heal scheduler resumed/],
  ["/scheduler/pause", { paused: true }, /Auto-heal scheduler paused/],
];

try {
  globalThis.window = { location: { origin } };
  globalThis.localStorage = { getItem: key => key === "mmhb_token" ? ordinaryToken : null };
  let session = adminSession;
  globalThis.sessionStorage = { getItem: key => key === "adminSessionToken" ? session : null };
  let responder = () => new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return responder(url, options);
  };
  const last = () => {
    const call = calls.at(-1);
    assert.ok(call, "expected an intercepted synthetic fetch");
    assert.equal(call.options.credentials, "include");
    return { ...call, headers: new Headers(call.options.headers) };
  };
  const checkAuth = (call, authorization, adminHeader) => {
    assert.equal(call.headers.get("authorization"), authorization);
    assert.equal(call.headers.get("x-admin-session"), adminHeader);
    assert.equal(call.headers.get("x-admin-token"), null);
  };
  const json = value => new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
  });

  await build({
    entryPoints: ["client/src/lib/queryClient.js"], bundle: true, platform: "node",
    format: "esm", packages: "external", outfile: path.join(dir, "query.mjs"),
  });
  const { apiRequest, apiDownload, getRequestHeaders, queryClient } =
    await import(path.join(dir, "query.mjs"));
  const queryFn = queryClient.getDefaultOptions().queries.queryFn;
  assert.equal(typeof getRequestHeaders, "function");
  assert.equal(typeof apiDownload, "function");
  for (const url of [
    "/api/admin/browser-health", "/api/admin/browser-health?format=json",
    deepPath, `${deepPath}/run`, `${origin}${deepPath}/export?format=json`,
  ]) {
    const headers = new Headers(getRequestHeaders(url));
    assert.equal(headers.get("x-admin-session"), adminSession, url);
    assert.equal(headers.get("authorization"), `Bearer ${adminSession}`, url);
  }
  for (const url of [
    "/api/adminish/health-deep", "/api/account/profile",
    "https://elsewhere.invalid/api/admin/health-deep",
    `${origin.replace("https:", "http:")}${deepPath}`,
  ]) {
    const headers = new Headers(getRequestHeaders(url));
    assert.equal(headers.get("x-admin-session"), null, url);
    assert.equal(headers.get("authorization"), `Bearer ${ordinaryToken}`, url);
  }
  const unrelated = await apiRequest("GET", "/api/account/profile");
  assert.deepEqual(unrelated, { ok: true });
  checkAuth(last(), `Bearer ${ordinaryToken}`, null);
  await apiRequest("GET", "https://elsewhere.invalid/api/admin/health-deep");
  checkAuth(last(), `Bearer ${ordinaryToken}`, null);
  await queryFn({ queryKey: [`${deepPath}?format=json`], signal: new AbortController().signal });
  checkAuth(last(), `Bearer ${adminSession}`, adminSession);
  assert.deepEqual(await apiRequest("GET", "/api/admin/browser-health"), { ok: true });
  checkAuth(last(), `Bearer ${adminSession}`, adminSession);
  assert.deepEqual(await apiRequest("POST", `${deepPath}/run`, { mode: "synthetic" }), { ok: true });
  const post = last();
  checkAuth(post, `Bearer ${adminSession}`, adminSession);
  assert.deepEqual(JSON.parse(post.options.body), { mode: "synthetic" });
  session = null;
  await apiRequest("POST", `${deepPath}/run`);
  checkAuth(last(), `Bearer ${ordinaryToken}`, null);
  session = adminSession;

  for (const status of [401, 403, 429, 503]) {
    responder = () => new Response(JSON.stringify({ message: "Synthetic rejection", code: `E_${status}` }), { status });
    for (const operation of [
      () => apiRequest("POST", `${deepPath}/run`, undefined, { timeoutMs: 100 }),
      () => apiDownload(`${deepPath}/export`, { timeoutMs: 100 }),
    ]) {
      await assert.rejects(operation(), error => {
        assert.equal(error.status, status);
        assert.match(error.message, new RegExp(String(status)));
        return true;
      });
    }
  }
  responder = () => new Response("{not json", { headers: { "Content-Type": "application/json" } });
  await assert.rejects(apiRequest("POST", `${deepPath}/run`), SyntaxError);
  responder = () => new Response(null, { status: 204 });
  assert.equal(await apiRequest("POST", `${deepPath}/run`), undefined);
  responder = () => new Response("", { status: 200 });
  assert.equal(await apiRequest("POST", `${deepPath}/run`), undefined);

  const hangsUntilAbort = signal => new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(new DOMException("Synthetic timeout", "AbortError")), { once: true });
  });
  responder = (_url, options) => hangsUntilAbort(options.signal);
  await assert.rejects(apiRequest("POST", `${deepPath}/run`, undefined, { timeoutMs: 20 }));
  await assert.rejects(apiDownload(`${deepPath}/export`, { timeoutMs: 20 }));
  responder = (_url, options) => {
    const response = json({ ok: true });
    response.text = () => hangsUntilAbort(options.signal);
    return response;
  };
  await assert.rejects(apiRequest("POST", `${deepPath}/run`, undefined, { timeoutMs: 20 }));
  responder = (_url, options) => {
    const response = new Response("synthetic bundle");
    response.blob = () => hangsUntilAbort(options.signal);
    return response;
  };
  await assert.rejects(apiDownload(`${deepPath}/export`, { timeoutMs: 20 }));
  responder = () => json({ recovered: true });
  assert.deepEqual(await apiRequest("POST", `${deepPath}/run`, undefined, { timeoutMs: 100 }), { recovered: true });
  responder = () => new Response('{"synthetic":true}', {
    headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="synthetic-health.json"' },
  });
  const download = await apiDownload(`${deepPath}/export`, { timeoutMs: 100 });
  assert.ok(download.blob instanceof Blob);
  assert.equal(await download.blob.text(), '{"synthetic":true}');
  assert.equal(download.filename, "synthetic-health.json");
  assert.equal(last().options.method ?? "GET", "GET");
  checkAuth(last(), `Bearer ${adminSession}`, adminSession);

  await build({
    entryPoints: ["client/src/pages/admin/HealthDashboard.jsx"],
    bundle: true, platform: "node", format: "esm", packages: "external",
    external: ["react"], jsx: "automatic", alias: { "@": path.resolve("client/src") },
    loader: { ".css": "empty" }, outfile: path.join(dir, "page.mjs"),
    plugins: [{
      name: "synthetic-hooks",
      setup(b) {
        b.onResolve({ filter: /^@tanstack\/react-query$/ }, () => ({ path: "hooks", namespace: "synthetic" }));
        b.onLoad({ filter: /.*/, namespace: "synthetic" }, () => ({ contents: `
          export function useQuery(options) {
            if (options.queryKey[0] === "/api/admin/browser-health")
              return { data: { ok: true, status: "healthy", database: {}, system: {}, environment: {} }, refetch() {} };
            if (options.queryKey[0] === "/api/admin/health-deep")
              return { data: { verdict: "HEALTHY" }, refetch() {} };
            return { data: {}, refetch() {} };
          }
          export function useMutation(options) {
            globalThis.syntheticMutations.push(options);
            return { mutate() {}, isPending: false };
          }
          export class QueryClient {
            getDefaultOptions() { return { queries: { queryFn() {} } }; }
            invalidateQueries(options) { globalThis.syntheticInvalidations.push(options); }
          }
        ` }));
        b.onResolve({ filter: /Top50ProcessTracker|ReflectionFooter/ }, () => ({ path: "panel", namespace: "stub" }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export default function Panel(){return null}" }));
        b.onResolve({ filter: /^wouter$/ }, () => ({ path: "link", namespace: "link" }));
        b.onLoad({ filter: /.*/, namespace: "link" }, () => ({ contents: `
          import React from "react";
          export const Link = ({children, ...props}) => React.createElement("a", props, children);
        ` }));
        b.onResolve({ filter: /^@\/hooks\/use-toast$/ }, () => ({ path: "toast", namespace: "toast" }));
        b.onLoad({ filter: /.*/, namespace: "toast" }, () => ({ contents: `
          export const useToast = () => ({ toast: value => globalThis.syntheticToasts.push(value) });
        ` }));
      },
    }],
  });
  globalThis.syntheticMutations = [];
  globalThis.syntheticInvalidations = [];
  globalThis.syntheticToasts = [];
  const Page = (await import(path.join(dir, "page.mjs"))).default;
  renderToStaticMarkup(React.createElement(Page));
  assert.equal(globalThis.syntheticMutations.length, endpoints.length, "all five live dashboard mutations must register");
  for (let index = 0; index < endpoints.length; index++) {
    const [suffix, payload, title] = endpoints[index];
    const mutation = globalThis.syntheticMutations[index];
    let requests = 0;
    responder = (url, options) => {
      requests++;
      assert.equal(url, `${deepPath}${suffix}`);
      assert.equal(options.method, "POST");
      assert.ok(options.signal, "mutation must carry its bounded timeout signal");
      return json(payload);
    };
    const result = await mutation.mutationFn();
    assert.deepEqual(result, payload, `${suffix} must return parsed JSON rather than a Response`);
    assert.equal(requests, 1, `${suffix} must not retry`);
    checkAuth(last(), `Bearer ${adminSession}`, adminSession);
    mutation.onSuccess(result);
    assert.deepEqual(globalThis.syntheticInvalidations.at(-1), { queryKey: [deepPath] });
    assert.match(globalThis.syntheticToasts.at(-1).title, title);
    requests = 0;
    responder = () => {
      requests++;
      return new Response("Synthetic unavailable", { status: 503 });
    };
    await assert.rejects(mutation.mutationFn(), /503/);
    assert.equal(requests, 1, `${suffix} must not retry failed controls`);
    for (const bad of [null, [], false, { ok: false }]) {
      responder = () => json(bad);
      await assert.rejects(mutation.mutationFn(), /Invalid health control response/);
    }
    responder = () => new Response(null, { status: 204 });
    await assert.rejects(mutation.mutationFn(), /Invalid health control response/);
  }
  assert.equal(globalThis.syntheticInvalidations.length, 5);
  assert.equal(globalThis.syntheticToasts.length, 5);
  console.log("PASS: synthetic admin-health session scoping, errors, fetch/body timeouts, recovery, download, and five dashboard mutation callbacks");
} finally {
  delete globalThis.window;
  delete globalThis.localStorage;
  delete globalThis.sessionStorage;
  delete globalThis.fetch;
  delete globalThis.syntheticMutations;
  delete globalThis.syntheticInvalidations;
  delete globalThis.syntheticToasts;
  await fs.rm(dir, { recursive: true, force: true });
}