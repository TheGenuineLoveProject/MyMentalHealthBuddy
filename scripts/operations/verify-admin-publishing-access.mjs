// Synthetic qualification only: no app boot, database, publishing file handlers, or real credentials.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import jwt from "jsonwebtoken";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dir = await fs.mkdtemp(path.resolve("node_modules/.admin-publishing-access-"));
const origin = "https://synthetic.invalid";
const publishing = "/api/admin/publishing";
const social = "/api/admin/social/enterprise";
const secret = "synthetic-qualification-secret-32-characters-long";
const previousSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = secret;

try {
  const appSource = await fs.readFile("server/app.mjs", "utf8");
  const publishingSource = await fs.readFile("server/routes/admin-publishing.mjs", "utf8");
  const socialSource = await fs.readFile("server/routes/social-enterprise.mjs", "utf8");
  assert.match(appSource, /app\.use\(["']\/api\/admin\/publishing["'],\s*adminPublishingRoutes\)/);
  assert.match(publishingSource, /router\.use\(requireAuth\);\s*router\.use\(requireAdmin\)/);
  assert.match(socialSource, /import\s*\{\s*requireAuth,\s*requireAdmin\s*\}\s*from\s*["']\.\.\/middleware\/auth\.mjs["']/);
  for (const match of socialSource.matchAll(/router\.(?:get|post|put|patch|delete)\(["'](\/[^"']*)["'],([^;\n]*)/g)) {
    if (match[1] !== "/") assert.match(match[2], /requireAuth,\s*requireAdmin/, `unprotected social route: ${match[1]}`);
  }
  assert.doesNotMatch(appSource, /app\.use\(["']\/api\/admin\/social\/enterprise["']/);
  assert.match(socialSource, /router\.get\(["']\/["'],\s*\(req,\s*res\)/);
  const appUi = await fs.readFile("client/src/App.jsx", "utf8");
  for (const route of ["/admin/social", "/admin/social/ops"]) {
    assert.ok(appUi.includes(`<Route path="${route}">`), `${route} must be present`);
    assert.match(appUi.slice(appUi.indexOf(`<Route path="${route}">`), appUi.indexOf(`<Route path="${route}">`) + 150),
      /<AdminGuard><AdminSocial \/><\/AdminGuard>/, `${route} must render AdminSocial (not NarrativeOpsConsole)`);
  }

  const { requireAuth, requireAdmin } = await import(path.resolve("server/middleware/auth.mjs"));
  const adminToken = jwt.sign({ id: "synthetic-admin", role: "admin" }, secret, { expiresIn: "1h" });
  const sessionToken = jwt.sign({ id: "synthetic-tab", role: "admin" }, secret, { expiresIn: "1h" });
  const userToken = jwt.sign({ id: "synthetic-user", role: "user" }, secret, { expiresIn: "1h" });
  const expiredToken = jwt.sign({ id: "synthetic-expired", role: "admin", exp: Math.floor(Date.now() / 1000) - 60 }, secret);
  let account = null;
  let session = null;
  globalThis.window = { location: { origin } };
  globalThis.localStorage = { getItem: key => key === "mmhb_token" ? account : null };
  globalThis.sessionStorage = { getItem: key => key === "adminSessionToken" ? session : null };

  const calls = [];
  const responseData = { ok: true, data: [] };
  let socialUnmounted = false;
  function authorize(headers) {
    const req = { headers: { authorization: new Headers(headers).get("authorization") } };
    let status = 200;
    const res = { status(code) { status = code; return this; }, json() { return this; } };
    let passed = false;
    requireAuth(req, res, () => requireAdmin(req, res, () => { passed = true; }));
    return { status, passed, user: req.user };
  }
  globalThis.fetch = async (url, options = {}) => {
    assert.ok(typeof url === "string" && (url.startsWith("/api/") || url === "/r/list"), `unexpected synthetic URL ${url}`);
    assert.equal(options.credentials, "include");
    const headers = new Headers(options.headers);
    const protectedPath = url.startsWith(publishing) || url.startsWith(social);
    const auth = protectedPath ? authorize(headers) : { status: 200, passed: true };
    const call = { url, method: options.method || "GET", headers, body: options.body, auth };
    calls.push(call);
    if (socialUnmounted && url.startsWith(social)) {
      return new Response(JSON.stringify({ error: "Synthetic unmounted route" }), { status: 404 });
    }
    if (protectedPath) {
      if (!auth.passed) return new Response(JSON.stringify({ error: "Synthetic denial" }), { status: auth.status });
    }
    if (url.startsWith(`${publishing}/draft-packs/`)) {
      return new Response(JSON.stringify({ ok: true, data: { id: "synthetic/id", title: "Synthetic preview" } }));
    }
    // No handler executes. This in-memory response is only an authorized transport fixture.
    return new Response(JSON.stringify(responseData), { headers: { "Content-Type": "application/json" } });
  };

  await build({
    entryPoints: ["client/src/lib/queryClient.js"], bundle: true, platform: "node",
    format: "esm", packages: "external", outfile: path.join(dir, "query.mjs"),
  });
  const { getRequestHeaders, apiRequest } = await import(path.join(dir, "query.mjs"));
  function checkLast(url, method, body, expectedToken, expectedStatus = 200) {
    const call = calls.at(-1);
    assert.equal(call.url, url);
    assert.equal(call.method, method);
    assert.equal(call.headers.get("authorization"), expectedToken ? `Bearer ${expectedToken}` : null);
    assert.equal(call.headers.get("x-admin-session"), url.startsWith("/api/admin/") ? session : null);
    assert.equal(call.headers.get("x-admin-token"), null);
    assert.equal(call.auth.status, expectedStatus);
    assert.equal(call.auth.passed, expectedStatus === 200);
    assert.deepEqual(call.body === undefined ? undefined : JSON.parse(call.body), body);
    return call;
  }
  session = sessionToken;
  account = userToken;
  for (const base of [publishing, social]) {
    for (const url of [base, `${base}/draft-packs?limit=1`, `${origin}${base}/featured`]) {
      const headers = new Headers(getRequestHeaders(url));
      assert.equal(headers.get("authorization"), `Bearer ${sessionToken}`, url);
      assert.equal(headers.get("x-admin-session"), sessionToken, url);
    }
    for (const url of [`${base}-other`, `https://elsewhere.invalid${base}`, `http://synthetic.invalid${base}`]) {
      const headers = new Headers(getRequestHeaders(url));
      assert.equal(headers.get("authorization"), `Bearer ${userToken}`, url);
      assert.equal(headers.get("x-admin-session"), url.startsWith("/api/admin/") ? sessionToken : null, url);
    }
  }
  // Only the two exact route families get a session bearer; other admin requests retain account bearer.
  assert.equal(new Headers(getRequestHeaders("/api/admin/another-tool")).get("authorization"), `Bearer ${userToken}`);
  for (const [token, tab, status] of [
    [adminToken, null, 200], [null, sessionToken, 200], [userToken, sessionToken, 200],
    [null, null, 401], [userToken, null, 403], [expiredToken, null, 401],
  ]) {
    account = token;
    session = tab;
    for (const url of [`${publishing}/draft-packs`, `${social}/posts`]) {
      const result = apiRequest("GET", url);
      if (status === 200) assert.deepEqual(await result, responseData);
      else await assert.rejects(result, err => err.status === status);
      checkLast(url, "GET", undefined, tab || token, status);
    }
  }

  // Render the real components; only UI dependencies and React Query hooks are replaced.
  // Inject an edit-state seed for the second render without rewriting any callback.
  const hooks = [];
  const mutations = [];
  const plugin = {
    name: "synthetic-page-hooks",
    setup(b) {
      b.onLoad({ filter: /NarrativeOpsConsole\.jsx$/ }, async ({ path: file }) => ({
        contents: (await fs.readFile(file, "utf8")).replace(
          "const [editingPost, setEditingPost] = useState(null);",
          "const [editingPost, setEditingPost] = useState(globalThis.syntheticEditingPost || null);",
        ),
        loader: "jsx",
      }));
      b.onResolve({ filter: /^@tanstack\/react-query$/ }, () => ({ path: "query", namespace: "synthetic" }));
      b.onLoad({ filter: /.*/, namespace: "synthetic" }, () => ({ contents: `
        export function useQuery(options) {
          globalThis.syntheticHooks.push(options);
          return { data: undefined, refetch() {} };
        }
        export function useMutation(options) {
          globalThis.syntheticMutations.push(options);
          return { mutate() {}, isPending: false };
        }
        export function useQueryClient() { return { invalidateQueries() {} }; }
        export class QueryClient {
          constructor() {}
          invalidateQueries() {}
        }
      ` }));
      b.onResolve({ filter: /(?:ReflectionFooter|\/SEO|AdminQueryStates|use-toast|\/ui\/button|\/ui\/card)$/ }, () => ({ path: "ui", namespace: "ui" }));
      b.onLoad({ filter: /^ui$/, namespace: "ui" }, () => ({ contents: `
        export default function Empty() { return null; }
        export const SEO = Empty;
        export const AdminErrorBanner = Empty;
        export const useToast = () => ({ toast() {} });
        export const Button = Empty;
        export const Card = Empty;
        export const CardContent = Empty;
        export const CardHeader = Empty;
        export const CardTitle = Empty;
      ` }));
      b.onResolve({ filter: /^wouter$/ }, () => ({ path: "link", namespace: "ui" }));
      b.onLoad({ filter: /^link$/, namespace: "ui" }, () => ({ contents: `
        import React from "react";
        export const Link = ({ children, ...props }) => React.createElement("a", props, children);
      ` }));
    },
  };
  for (const [file, out] of [
    ["NarrativeOpsConsole.jsx", "narrative.mjs"],
    ["AdminPublishingToday.jsx", "today.mjs"],
  ]) {
    await build({
      entryPoints: [`client/src/pages/admin/${file}`], bundle: true, platform: "node",
      format: "esm", packages: "external", external: ["react"], jsx: "automatic",
      alias: { "@": path.resolve("client/src") }, loader: { ".css": "empty" },
      outfile: path.join(dir, out), plugins: [plugin],
    });
  }
  const Narrative = (await import(path.join(dir, "narrative.mjs"))).default;
  const Today = (await import(path.join(dir, "today.mjs"))).default;
  function capture(Page, editingPost = null) {
    hooks.length = 0;
    mutations.length = 0;
    globalThis.syntheticHooks = hooks;
    globalThis.syntheticMutations = mutations;
    globalThis.syntheticEditingPost = editingPost;
    renderToStaticMarkup(React.createElement(Page));
    return { queries: [...hooks], writes: [...mutations] };
  }
  const narrative = capture(Narrative);
  const today = capture(Today);
  assert.equal(narrative.queries.length, 7);
  assert.equal(narrative.writes.length, 6);
  assert.equal(today.queries.length, 2);
  assert.equal(today.writes.length, 2);

  // The page bundles the same real apiRequest source; intercept fetch after JWT middleware,
  // proving callbacks consume parsed JSON rather than calling res.json() a second time.
  session = sessionToken;
  account = userToken;
  const readUrls = [
    `${social}/posts`, `${social}/campaigns`, `${social}/weekly-queue`,
    `${social}/signals`, `${social}/click-stats`, `${social}/audit`, "/api/blog?limit=20",
    `${publishing}/draft-packs`, `${publishing}/featured`,
  ];
  for (const [i, query] of [...narrative.queries, ...today.queries].entries()) {
    assert.deepEqual(await query.queryFn(), responseData, `read callback ${i} must return parsed JSON`);
    checkLast(readUrls[i], "GET", undefined, i === 6 ? userToken : sessionToken);
  }
  const payload = { title: "Synthetic draft", content: "Synthetic content", safetyNote: "Synthetic note" };
  const writeCases = [
    [narrative.writes[0], payload, `${social}/post`, "POST", payload],
    [narrative.writes[1], { id: "synthetic-id", action: "submit" }, `${social}/post/synthetic-id/submit`, "POST", {}],
    [narrative.writes[1], { id: "synthetic-id", action: "approve", body: { confirmed: true } }, `${social}/post/synthetic-id/approve`, "POST", { confirmed: true }],
    [narrative.writes[1], { id: "synthetic-id", action: "mark-posted", body: { platforms: ["x"] } }, `${social}/post/synthetic-id/mark-posted`, "POST", { platforms: ["x"] }],
    [narrative.writes[2], { name: "Synthetic campaign" }, `${social}/campaigns`, "POST", { name: "Synthetic campaign" }],
    [narrative.writes[3], { id: "synthetic-id", scheduledFor: "2030-01-01" }, `${social}/post/synthetic-id/schedule`, "POST", { scheduledFor: "2030-01-01" }],
    [narrative.writes[4], { baseUrl: "https://synthetic.invalid/" }, `${social}/build-utm`, "POST", { baseUrl: "https://synthetic.invalid/" }],
    [narrative.writes[5], { blogPostId: "synthetic-blog", campaignId: "synthetic-campaign" }, `${social}/generate-from-blog`, "POST", { blogPostId: "synthetic-blog", campaignId: "synthetic-campaign" }],
    [today.writes[0], "synthetic-id", `${publishing}/featured`, "POST", { date: new Date().toISOString().split("T")[0], glpId: "synthetic-id" }],
    [today.writes[1], "synthetic-id", `${publishing}/mark-posted/synthetic-id`, "POST", undefined],
  ];
  for (const [mutation, input, url, method, body] of writeCases) {
    const result = await mutation.mutationFn(input);
    assert.deepEqual(result, mutation === narrative.writes[0] ? { ...responseData, _isEdit: false } : responseData);
    checkLast(url, method, body, sessionToken);
  }
  const edit = capture(Narrative, { id: "synthetic-id" }).writes[0];
  assert.deepEqual(await edit.mutationFn(payload), { ...responseData, _isEdit: true });
  checkLast(`${social}/post/synthetic-id`, "PUT", payload, sessionToken);

  // Exercise every real protected callback under each credential mode. No request reaches
  // a publishing handler: middleware alone determines whether the fixture can respond.
  for (const [token, tab, status] of [
    [adminToken, null, 200], [null, sessionToken, 200], [userToken, sessionToken, 200],
    [null, null, 401], [userToken, null, 403], [expiredToken, null, 401],
  ]) {
    account = token;
    session = tab;
    for (const [i, query] of [...narrative.queries, ...today.queries].entries()) {
      if (i === 6) continue; // /api/blog is outside the protected publishing families.
      const result = query.queryFn();
      if (status === 200) assert.deepEqual(await result, responseData);
      else await assert.rejects(result, err => err.status === status);
      checkLast(readUrls[i], "GET", undefined, tab || token, status);
    }
    for (const [mutation, input, url, method, body] of [
      ...writeCases, [edit, payload, `${social}/post/synthetic-id`, "PUT", payload],
    ]) {
      const result = mutation.mutationFn(input);
      if (status === 200) await result;
      else await assert.rejects(result, err =>
        mutation === narrative.writes[1] ? err.message === "Action failed" : err.status === status);
      checkLast(url, method, body, tab || token, status);
    }
  }
  // Capture the real effect callbacks on the actual preview and mounted social pages.
  // The React shim only records hook scheduling/state; page fetch logic is unmodified.
  const effectPlugin = {
    name: "synthetic-effects",
    setup(b) {
      b.onResolve({ filter: /^react$/, namespace: "file" }, args => {
        if (/\/(?:BlogDraftViewer|AdminSocial)\.jsx$/.test(args.importer)) {
          return { path: "hooks", namespace: "effect" };
        }
      });
      b.onLoad({ filter: /^hooks$/, namespace: "effect" }, () => ({ contents: `
        export const useState = initial => {
          const index = globalThis.effectIndex++;
          if (!(index in globalThis.effectStates)) globalThis.effectStates[index] = initial;
          return [globalThis.effectStates[index], value => {
            globalThis.effectStates[index] = typeof value === "function" ? value(globalThis.effectStates[index]) : value;
          }];
        };
        export const useCallback = fn => fn;
        export const useEffect = fn => { globalThis.effectCallbacks.push(fn); };
      ` }));
      b.onResolve({ filter: /^wouter$/ }, () => ({ path: "route", namespace: "effect" }));
      b.onLoad({ filter: /^route$/, namespace: "effect" }, () => ({ contents: `
        import React from "react";
        export const useRoute = () => [true, { id: "synthetic/id" }];
        export const Link = ({ children, ...props }) => React.createElement("a", props, children);
      ` }));
      b.onResolve({ filter: /(?:\/SEO|ReflectionFooter|\/ui\/Button)$/ }, () => ({ path: "empty", namespace: "effect" }));
      b.onLoad({ filter: /^empty$/, namespace: "effect" }, () => ({ contents: "export default function Empty() { return null; }" }));
      b.onResolve({ filter: /^@tanstack\/react-query$/ }, () => ({ path: "query", namespace: "effect" }));
      b.onLoad({ filter: /^query$/, namespace: "effect" }, () => ({ contents: "export class QueryClient { constructor() {} }" }));
    },
  };
  for (const [entry, output] of [
    ["client/src/pages/BlogDraftViewer.jsx", "viewer.mjs"],
    ["client/src/pages/admin/AdminSocial.jsx", "mounted-social.mjs"],
  ]) {
    await build({
      entryPoints: [entry], bundle: true, platform: "node", format: "esm",
      packages: "external", external: ["react"], jsx: "automatic",
      outfile: path.join(dir, output), plugins: [effectPlugin],
    });
  }
  const Viewer = (await import(path.join(dir, "viewer.mjs"))).default;
  const MountedSocial = (await import(path.join(dir, "mounted-social.mjs"))).default;
  function captureEffect(Page) {
    globalThis.effectIndex = 0;
    globalThis.effectStates = {};
    globalThis.effectCallbacks = [];
    renderToStaticMarkup(React.createElement(Page));
    assert.equal(globalThis.effectCallbacks.length, 1);
    return { run: globalThis.effectCallbacks[0], states: globalThis.effectStates };
  }
  async function settle(check) {
    for (let i = 0; i < 25; i++) {
      if (check()) return;
      await new Promise(resolve => setImmediate(resolve));
    }
    assert.fail("synthetic effect did not settle");
  }
  for (const [token, tab, status] of [
    [adminToken, null, 200], [null, sessionToken, 200], [userToken, sessionToken, 200],
    [null, null, 401], [userToken, null, 403], [expiredToken, null, 401],
  ]) {
    account = token;
    session = tab;
    const { run, states } = captureEffect(Viewer);
    run();
    await settle(() => states[1] === false);
    const url = `${publishing}/draft-packs/synthetic%2Fid`;
    checkLast(url, "GET", undefined, tab || token, status);
    if (status === 200) {
      assert.deepEqual(states[0], { id: "synthetic/id", title: "Synthetic preview" });
      assert.equal(states[2], null);
    } else {
      assert.equal(states[0], null);
      assert.match(states[2], new RegExp(String(status)));
    }
  }

  // The actually mounted social page sends bare credentialed fetches (no Authorization);
  // even with an admin/session in storage, the declared guards reject these requests.
  account = adminToken;
  session = sessionToken;
  const mounted = captureEffect(MountedSocial);
  const start = calls.length;
  mounted.run();
  await settle(() => mounted.states[9] === false);
  const mountedCalls = calls.slice(start);
  assert.equal(mountedCalls.length, 8);
  const enterpriseCalls = mountedCalls.filter(call => call.url.startsWith(social));
  assert.equal(enterpriseCalls.length, 6);
  for (const call of enterpriseCalls) {
    assert.equal(call.headers.get("authorization"), null);
    assert.equal(call.headers.get("x-admin-session"), null);
    assert.equal(call.auth.status, 401);
  }
  // Simulate actual unmounted route separately: the response is 404, not success,
  // while the page's .json() and fallback render silently empty panels.
  socialUnmounted = true;
  const unmounted = captureEffect(MountedSocial);
  const before = calls.length;
  unmounted.run();
  await settle(() => unmounted.states[9] === false);
  assert.equal(calls.slice(before).filter(call => call.url.startsWith(social)).length, 6);
  assert.deepEqual(unmounted.states[1], []); // posts after 404 JSON without data
  socialUnmounted = false;
  console.log("PASS: synthetic publishing page reads/writes, parsed responses, JWT auth matrix, exact session scope, and static router guards");
  console.log("CURRENT ACCESS FAILURE: /admin/social and /admin/social/ops mount AdminSocial, whose fetches omit Authorization; social-enterprise router is unmounted (404). Activation and page migration require follow-up.");
} finally {
  process.env.JWT_SECRET = previousSecret;
  for (const key of ["window", "localStorage", "sessionStorage", "fetch", "syntheticHooks", "syntheticMutations", "syntheticEditingPost", "effectIndex", "effectStates", "effectCallbacks"]) delete globalThis[key];
  await fs.rm(dir, { recursive: true, force: true });
}