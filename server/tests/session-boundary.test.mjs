import assert from "node:assert/strict";
import { once } from "node:events";
import { request } from "node:http";
import test from "node:test";

// This standalone test process imports the real route and JWT middleware, never
// server/app.mjs or a database client. It only opens a loopback HTTP listener.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "synthetic-session-boundary-secret-0000000000001";
process.env.JWT_ACCESS_EXPIRES = "15m";
delete process.env.DATABASE_URL;

const [{ default: express }, { default: cookieParser }, { default: jwt }] =
  await Promise.all([import("express"), import("cookie-parser"), import("jsonwebtoken")]);
const { default: router } = await import("../routes/session-boundary.mjs");
const { csrfProtection } = await import("../security/csrf.mjs");

const userId = "11111111-1111-4111-8111-111111111111";
const valid = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, { expiresIn: "5m" });
const expired = jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, { expiresIn: -60 });
const wrongSignature = jwt.sign({ id: userId, role: "user" }, "synthetic-other-session-boundary-secret-00001", { expiresIn: "5m" });

test("actual session-boundary HTTP contracts without application services", { timeout: 12000 }, async t => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  // Match the application's order: this router precedes the global CSRF guard.
  app.use("/api/session-boundary", router);
  app.use(csrfProtection);
  const server = app.listen(0, "127.0.0.1");
  const previousHistory = Object.getOwnPropertyDescriptor(globalThis, "__guestHistory__");
  const previousDb = Object.getOwnPropertyDescriptor(globalThis, "db");
  let dbCalls = 0;

  const call = (path, { method = "POST", authorization, cookie, headers = {} } = {}) =>
    new Promise((resolve, reject) => {
      const req = request({
        hostname: "127.0.0.1",
        port: server.address().port,
        path: `/api/session-boundary${path}`,
        method,
        agent: false,
        headers: {
          ...(authorization ? { authorization } : {}),
          ...(cookie ? { cookie } : {}),
          ...headers,
        },
      }, response => {
        let raw = "";
        response.setEncoding("utf8");
        response.on("data", chunk => { raw += chunk; });
        response.on("end", () => {
          try {
            resolve({ status: response.statusCode, headers: response.headers, body: JSON.parse(raw) });
          } catch (error) {
            reject(error);
          }
        });
        response.on("error", reject);
      });
      req.setTimeout(2000, () => req.destroy(new Error("Loopback fixture request timed out")));
      req.on("error", reject);
      req.end();
    });

  try {
    await once(server, "listening");
    Object.defineProperty(globalThis, "__guestHistory__", { configurable: true, writable: true, value: new Map() });
    Object.defineProperty(globalThis, "db", {
      configurable: true,
      writable: true,
      value: { execute: async () => { dbCalls++; throw new Error("Unexpected fixture database call"); } },
    });

    for (const [name, authorization] of [
      ["valid access JWT", `Bearer ${valid}`],
      ["anonymous", undefined],
      ["malformed JWT", "Bearer invalid.jwt"],
      ["expired access JWT", `Bearer ${expired}`],
      ["wrong JWT signature", `Bearer ${wrongSignature}`],
    ]) {
      await t.test(`${name} cannot renew credentials through retired extension`, async () => {
        const response = await call("/extend", {
          authorization,
          cookie: "refresh_token=synthetic-cookie-never-stored; csrf_secret=synthetic-existing-csrf-secret-00000001",
        });
        assert.equal(response.status, 410);
        assert.equal(response.headers["cache-control"], "no-store");
        assert.equal(response.headers["set-cookie"], undefined, "retirement must not issue, rotate, or clear cookies");
        assert.equal(response.headers.location, undefined, "retirement must not redirect into a credential issuer");
        assert.deepEqual(response.body, {
          ok: false,
          code: "SESSION_EXTENSION_RETIRED",
          message: "This session extension endpoint is no longer supported. Sign in again if your session has expired.",
        });
        assert.equal(dbCalls, 0);
      });
    }

    await t.test("CSRF token issuance and existing-secret reuse remain available", async () => {
      const initial = await call("/csrf-token", { method: "GET" });
      assert.equal(initial.status, 200);
      assert.equal(initial.body.ok, true);
      assert.match(initial.body.csrfToken, /^[a-f0-9]{64}$/);
      const cookies = initial.headers["set-cookie"];
      assert.equal(cookies.length, 1);
      assert.ok(cookies[0].startsWith(`csrf_secret=${initial.body.csrfToken};`));
      assert.match(cookies[0], /; HttpOnly(?:;|$)/);
      assert.match(cookies[0], /; SameSite=Lax(?:;|$)/);
      const reused = await call("/csrf-token", {
        method: "GET", cookie: `csrf_secret=${initial.body.csrfToken}`,
      });
      assert.deepEqual(reused.body, initial.body);
      assert.equal(reused.headers["set-cookie"], undefined);
      assert.equal(dbCalls, 0);
    });

    await t.test("history upgrade still rejects absent or invalid JWTs before storage", async () => {
      for (const authorization of [undefined, "Bearer invalid.jwt", `Bearer ${expired}`, `Bearer ${wrongSignature}`]) {
        const response = await call("/upgrade-history", {
          authorization, headers: { "x-guest-id": "synthetic-guest" },
        });
        assert.equal(response.status, 401);
        assert.equal(response.headers["set-cookie"], undefined);
        assert.equal("token" in response.body, false);
      }
      assert.equal(dbCalls, 0);
    });

    await t.test("authorized history upgrade preserves its guest-header and empty-history contracts", async () => {
      const missingHeader = await call("/upgrade-history", { authorization: `Bearer ${valid}` });
      assert.equal(missingHeader.status, 400);
      assert.deepEqual(missingHeader.body, { error: "x-guest-id header required" });
      const empty = await call("/upgrade-history", {
        authorization: `Bearer ${valid}`, headers: { "x-guest-id": "synthetic-empty-guest" },
      });
      assert.equal(empty.status, 200);
      assert.deepEqual(empty.body, { ok: true, merged: 0, cleared: false });
      assert.equal(empty.headers["set-cookie"], undefined);
      assert.equal(dbCalls, 0);
    });
  } finally {
    if (previousHistory) Object.defineProperty(globalThis, "__guestHistory__", previousHistory);
    else delete globalThis.__guestHistory__;
    if (previousDb) Object.defineProperty(globalThis, "db", previousDb);
    else delete globalThis.db;
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
