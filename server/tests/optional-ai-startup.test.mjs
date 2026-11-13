import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

// No database is needed for import, offline fallback or capability rejection.
vi.mock("../db/connection.mjs", () => ({ db: {} }));
const secret = "isolated-optional-ai-test-access-secret";
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", "");
  vi.stubEnv("AI_INTEGRATIONS_OPENAI_BASE_URL", "");
  vi.stubEnv("JWT_SECRET", secret);
});
afterEach(() => vi.unstubAllEnvs());

describe("optional AI credentials", () => {
  it("imports awareness without credentials and constructs the real SDK when configured", async () => {
    expect((await import("../ai/openaiClient.mjs")).openai).toBeNull();
    vi.stubEnv("OPENAI_API_KEY", "synthetic-not-a-service-credential");
    vi.resetModules();
    const { openai } = await import("../ai/openaiClient.mjs");
    expect(typeof openai.chat.completions.create).toBe("function");
    // Constructing a client performs no remote request.
  });

  it("keeps the existing clearly labeled local mirror fallback available", async () => {
    const router = (await import("../routes/mirror.mjs")).default;
    const app = express();
    app.use(express.json(), router);
    const response = await request(app).post("/").send({ text: "An illustrative thought for an offline check." });
    expect(response.status).toBe(200);
    expect(response.body.mode).toBe("local_fallback");
    expect(response.body.tokens).toBe(0);
    expect(typeof response.body.reflection).toBe("string");
  });

  it("authenticates admin AI endpoints before returning explicit capability unavailability", async () => {
    const router = (await import("../routes/admin-social-studio.mjs")).default;
    const app = express();
    app.use(express.json(), router);
    expect((await request(app).post("/generate")).status).toBe(401);
    const user = jwt.sign({ id: "synthetic", role: "user" }, secret);
    expect((await request(app).post("/generate").auth(user, { type: "bearer" })).status).toBe(403);
    const admin = jwt.sign({ id: "synthetic", role: "admin" }, secret);
    for (const path of ["/generate", "/generate/repurpose", "/compliance/rewrite",
      "/generate/image", "/generate/batch", "/enhance"]) {
      const response = await request(app).post(path).auth(admin, { type: "bearer" }).send({});
      expect(response.status).toBe(503);
      expect(response.body.error).toBe("AI generation is not configured");
      expect(response.headers["cache-control"]).toBe("no-store");
    }
    // Non-AI functionality is still available to authorized administrators.
    expect((await request(app).get("/platforms/specs").auth(admin, { type: "bearer" })).status).toBe(200);
  });

  it("keeps integration-key configuration enabled without making a remote request", async () => {
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_API_KEY", "synthetic-not-a-service-credential");
    vi.stubEnv("AI_INTEGRATIONS_OPENAI_BASE_URL", "https://provider.example.invalid/v1");
    const router = (await import("../routes/admin-social-studio.mjs")).default;
    const app = express();
    app.use(express.json(), router);
    const admin = jwt.sign({ id: "synthetic", role: "admin" }, secret);
    // Invalid input reaches the existing validation, never a provider request.
    expect((await request(app).post("/generate").auth(admin, { type: "bearer" }).send({})).status).toBe(400);
    expect((await import("../routes/mirror.mjs")).default).toBeDefined();
  });
});
