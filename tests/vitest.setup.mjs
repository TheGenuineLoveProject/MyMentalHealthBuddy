// tests/vitest.setup.mjs
import request from "supertest";
import { beforeAll, afterAll } from "vitest";
import app from "../server/app.mjs";

let server;
let baseUrl;
let agent;

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  // Start the Express app on a random free port
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;

  baseUrl = `http://127.0.0.1:${port}`;

  // ✅ This is what your tests use: fetch(`${BASE_URL}/api/...`)
  globalThis.BASE_URL = baseUrl;
  process.env.BASE_URL = baseUrl;

  // Supertest agent to keep cookies/sessions between calls
  agent = request.agent(app);

  // Minimal fetch shim that routes fetch() calls into supertest
  globalThis.fetch = async (input, init = {}) => {
    const method = String(init.method || "GET").toLowerCase();

    // Support absolute or relative URLs
    const u = new URL(
      typeof input === "string" ? input : input.url,
      baseUrl
    );

    const path = u.pathname + u.search;

    let req = agent[method](path);

    // headers
    if (init.headers) {
      const headers =
        init.headers instanceof Headers
          ? Object.fromEntries(init.headers.entries())
          : init.headers;

      for (const [k, v] of Object.entries(headers)) {
        if (v !== undefined) req = req.set(k, String(v));
      }
    }

    // body
    if (init.body !== undefined) {
      const ct =
        (init.headers &&
          (init.headers["Content-Type"] ||
            init.headers["content-type"])) ||
        "";

      // If JSON string, parse it for supertest
      if (typeof init.body === "string" && String(ct).includes("application/json")) {
        try {
          req = req.send(JSON.parse(init.body));
        } catch {
          req = req.send(init.body);
        }
      } else {
        req = req.send(init.body);
      }
    }

    const res = await req;

    // Response-like object for your tests
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      async json() {
        return res.body;
      },
      async text() {
        return res.text;
      },
      headers: {
        get(name) {
          if (!name) return null;
          return res.headers[String(name).toLowerCase()] ?? null;
        },
      },
    };
  };
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});