import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

const provider = vi.hoisted(() => ({
  discovery: vi.fn(),
  buildEndSessionUrl: vi.fn(),
  refreshTokenGrant: vi.fn(),
}));

// Real Express, Passport and session lifecycle; external provider and storage
// are fixtures. These checks must never open the configured live database.
vi.mock("openid-client", () => provider);
vi.mock("openid-client/passport", () => ({
  Strategy: class {
    constructor(options) { this.name = options.name; }
    authenticate() { this.redirect("https://provider.example.invalid/authorize"); }
  },
}));
vi.mock("connect-pg-simple", () => ({ default: session => session.MemoryStore }));
vi.mock("../replit_integrations/auth/storage.mjs", () => ({
  authStorage: { getUserByReplitId: vi.fn(), upsertUser: vi.fn() },
}));
vi.mock("../services/email.mjs", () => ({ sendWelcomeEmail: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("REPL_ID", "");
  vi.stubEnv("ISSUER_URL", "https://replit.com/oidc");
  vi.stubEnv("SESSION_SECRET", "isolated-provider-config-test-session-secret");
  provider.discovery.mockResolvedValue({ fixture: true });
  provider.buildEndSessionUrl.mockReturnValue(new URL("https://provider.example.invalid/logout"));
});
afterEach(() => vi.unstubAllEnvs());

async function application() {
  const auth = await import("../replit_integrations/auth/replitAuth.mjs");
  const app = express();
  await auth.setupAuth(app);
  app.get("/fixture/session", (req, res) => res.json({ active: !!req.session.userId }));
  app.post("/fixture/session", (req, res) => {
    req.session.userId = "synthetic-session-user";
    req.session.save(() => res.sendStatus(204));
  });
  app.get("/fixture/protected", auth.isAuthenticated, (_req, res) => res.sendStatus(200));
  return { app, auth };
}

function local(req) {
  return req.set("Host", "app.example.invalid")
    .set("X-Forwarded-Proto", "https")
    .set("Origin", "https://app.example.invalid");
}

describe("authentication outside Replit", () => {
  it("boots without discovery and rejects unavailable provider routes explicitly", async () => {
    const { app } = await application();
    expect(provider.discovery).not.toHaveBeenCalled();
    for (const path of ["/api/login", "/api/callback"]) {
      const res = await local(request(app).get(path));
      expect(res.status).toBe(503);
      expect(res.headers["cache-control"]).toBe("no-store");
      expect(res.body.error).toBe("Replit sign-in is not configured");
      expect(res.headers["set-cookie"]).toBeUndefined();
    }
    expect((await local(request(app).get("/fixture/protected"))).status).toBe(401);
  });

  it("does not discover or refresh an absent identity provider", async () => {
    const { auth } = await application();
    expect(await auth.refreshUserToken({ refresh_token: "synthetic" }, {})).toBe(false);
    expect(provider.discovery).not.toHaveBeenCalled();
    expect(provider.refreshTokenGrant).not.toHaveBeenCalled();
  });

  it("keeps GET logout read-only, blocks foreign POST, and destroys local sessions", async () => {
    const { app } = await application();
    const seeded = await local(request(app).post("/fixture/session"));
    expect(seeded.status).toBe(204);
    const cookie = seeded.headers["set-cookie"][0].split(";")[0];
    const withCookie = req => local(req).set("Cookie", cookie);
    expect((await withCookie(request(app).get("/fixture/session"))).body.active).toBe(true);
    expect((await withCookie(request(app).get("/api/logout"))).status).toBe(200);
    expect((await withCookie(request(app).get("/fixture/session"))).body.active).toBe(true);
    expect((await withCookie(request(app).post("/api/logout"))
      .set("Origin", "https://foreign.example.invalid")).status).toBe(403);
    expect((await withCookie(request(app).get("/fixture/session"))).body.active).toBe(true);
    const signedOut = await withCookie(request(app).post("/api/logout"));
    expect(signedOut.status).toBe(303);
    expect(signedOut.headers.location).toBe("/");
    expect(signedOut.headers["set-cookie"][0]).toContain("connect.sid=;");
    expect((await withCookie(request(app).get("/fixture/session"))).body.active).toBe(false);
    expect(provider.buildEndSessionUrl).not.toHaveBeenCalled();
  });

  it("preserves configured provider discovery, login and logout redirect", async () => {
    vi.stubEnv("REPL_ID", "synthetic-client-id");
    const { app } = await application();
    expect(provider.discovery).toHaveBeenCalledExactlyOnceWith(
      new URL("https://replit.com/oidc"), "synthetic-client-id",
    );
    const login = await local(request(app).get("/api/login"));
    expect(login.status).toBe(302);
    expect(login.headers.location).toBe("https://provider.example.invalid/authorize");
    const logout = await local(request(app).post("/api/logout"));
    expect(logout.status).toBe(303);
    expect(logout.headers.location).toBe("https://provider.example.invalid/logout");
    expect(provider.buildEndSessionUrl).toHaveBeenCalledOnce();
  });

  it("fails startup when a configured provider cannot be discovered", async () => {
    vi.stubEnv("REPL_ID", "synthetic-client-id");
    provider.discovery.mockRejectedValue(new Error("synthetic provider failure"));
    await expect(application()).rejects.toThrow("synthetic provider failure");
  });
});
