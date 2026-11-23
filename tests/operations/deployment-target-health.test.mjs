import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";

const script = new URL("../../scripts/operations/verify-deployment-target-health.mjs", import.meta.url);
const healthy = {
  "/api/health": { status: "healthy", ok: true },
  "/healthz": { status: "healthy", ok: true },
  "/readyz": { status: "ready" },
  "/api/health/detailed": { status: "ok", ready: true, checks: { db: { ok: true } } },
};

function run(base, timeout = "500") {
  return new Promise((resolve, reject) => {
    // No application environment or credentials are passed to the CLI.
    const child = spawn(process.execPath, [script.pathname], {
      env: {
        ...(base === undefined ? {} : { APP_BASE_URL: base }),
        ...(timeout == null ? {} : { DEPLOYMENT_PROBE_TIMEOUT_MS: timeout }),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", chunk => { output += chunk; });
    child.stderr.on("data", chunk => { output += chunk; });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("CLI exceeded test's 5-second safety deadline"));
    }, 5000);
    child.once("error", error => { clearTimeout(timer); reject(error); });
    child.once("close", code => { clearTimeout(timer); resolve({ code, output }); });
  });
}

async function fixture(t, override = () => false) {
  const requests = [];
  const server = createServer((req, res) => {
    requests.push(req.url);
    if (override(req, res)) return;
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(healthy[req.url]));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => {
    server.closeAllConnections();
    server.close(resolve);
  }));
  return { base: `http://127.0.0.1:${server.address().port}`, requests };
}

test("accepts current JSON aliases and checks detailed database readiness", async t => {
  const f = await fixture(t);
  const result = await run(f.base, null);
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /DEPLOYMENT_TARGET_HEALTH_VERIFY_PASS/);
  assert.deepEqual(f.requests, Object.keys(healthy));
});

test("accepts legacy text healthz with a trailing-slash origin", async t => {
  const f = await fixture(t, (req, res) => {
    if (req.url !== "/healthz") return false;
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok\n");
    return true;
  });
  const result = await run(`${f.base}/`);
  assert.equal(result.code, 0, result.output);
});

test("rejects HTML SPA pages returning 200", async t => {
  const f = await fixture(t, (_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<!doctype html><title>Sign in</title>");
    return true;
  });
  const result = await run(f.base);
  assert.equal(result.code, 1, result.output);
  assert.doesNotMatch(result.output, /DEPLOYMENT_TARGET_HEALTH_VERIFY_PASS/);
});

test("rejects redirects without following them", async t => {
  const f = await fixture(t, (req, res) => {
    if (req.url !== "/api/health") return false;
    res.writeHead(302, { Location: "/login" });
    res.end();
    return true;
  });
  const result = await run(f.base);
  assert.equal(result.code, 1, result.output);
  assert.deepEqual(f.requests, ["/api/health"]);
});

for (const [name, path, status, type, body] of [
  ["non-200 success", "/api/health", 201, "application/json", '{"status":"healthy"}'],
  ["503 failure", "/api/health/detailed", 503, "application/json", JSON.stringify(healthy["/api/health/detailed"])],
  ["malformed JSON", "/api/health", 200, "application/json", "{"],
  ["wrong content type", "/api/health", 200, "text/html", '{"status":"healthy"}'],
  ["negative health status", "/api/health", 200, "application/json", '{"status":"unhealthy"}'],
  ["contradictory health result", "/api/health", 200, "application/json", '{"status":"healthy","ok":false}'],
  ["negative ready status", "/readyz", 200, "application/json", '{"status":"not_ready"}'],
  ["wrong legacy text", "/healthz", 200, "text/plain", "not ok"],
  ["wrong detailed status", "/api/health/detailed", 200, "application/json", '{"status":"error","ready":true,"checks":{"db":{"ok":true}}}'],
  ["database not ready", "/api/health/detailed", 200, "application/json", '{"status":"ok","ready":true,"checks":{"db":{"ok":false}}}'],
  ["detailed not ready", "/api/health/detailed", 200, "application/json", '{"status":"ok","ready":false,"checks":{"db":{"ok":true}}}'],
  ["missing DB check", "/api/health/detailed", 200, "application/json", '{"status":"ok","ready":true}'],
]) {
  test(`rejects ${name}`, async t => {
    const f = await fixture(t, (req, res) => {
      if (req.url !== path) return false;
      res.writeHead(status, { "Content-Type": type });
      res.end(body);
      return true;
    });
    const result = await run(f.base);
    assert.equal(result.code, 1, result.output);
    assert.doesNotMatch(result.output, /DEPLOYMENT_TARGET_HEALTH_VERIFY_PASS/);
  });
}

for (const phase of ["headers", "body"]) {
  test(`bounds a hanging ${phase} response`, async t => {
    const f = await fixture(t, (_req, res) => {
      if (phase === "body") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write('{"status":');
      }
      return true;
    });
    const result = await run(f.base, "100");
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, /timeout/i);
  });
}

for (const base of [undefined, "not-a-url", "ftp://example.invalid", "http://user:secret-marker@example.invalid", "http://example.invalid?secret-marker", "http://example.invalid#secret-marker", "http://example.invalid/path", "http://example.invalid?", "http://example.invalid#"]) {
  test(`rejects invalid origin configuration ${base === undefined ? "missing" : JSON.stringify(base)}`, async () => {
    const result = await run(base);
    assert.equal(result.code, 1);
    assert.match(result.output, /FAIL APP_BASE_URL/);
    assert.doesNotMatch(result.output, /secret-marker/);
  });
}

for (const timeout of ["", "0", "-1", "99", "30001", "100.5", "abc", "Infinity", "100ms"]) {
  test(`rejects invalid timeout ${JSON.stringify(timeout)} before requests`, async t => {
    const f = await fixture(t);
    const result = await run(f.base, timeout);
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, /FAIL DEPLOYMENT_PROBE_TIMEOUT_MS/);
    assert.deepEqual(f.requests, []);
  });
}
