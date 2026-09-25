import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import fs from "fs";

const fixture = vi.hoisted(() => ({ failAt: 0, reads: 0 }));
vi.mock("../middleware/auth.mjs", () => ({
  requireAuth: (_req, _res, next) => next(),
  requireAdmin: (_req, _res, next) => next(),
}));
vi.mock("../utils/logger.mjs", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));
vi.mock("../db/client.mjs", () => ({ default: {} }));
vi.mock("../db/connection.mjs", () => ({
  db: {
    select() {
      const read = ++fixture.reads;
      const chain = {
        from: () => chain,
        where: () => chain,
        groupBy: () => chain,
        orderBy: () => chain,
        limit: () => chain,
        then(resolve, reject) {
          return (read === fixture.failAt
            ? Promise.reject(new Error("private database failure details"))
            : Promise.resolve([])).then(resolve, reject);
        },
      };
      return chain;
    },
  },
}));

import socialRouter from "../routes/social-enterprise.mjs";
import publishingRouter from "../routes/admin-publishing.mjs";

const app = express();
app.use("/social", socialRouter);
app.use("/publishing", publishingRouter);
beforeEach(() => { fixture.reads = 0; fixture.failAt = 0; });
afterEach(() => vi.restoreAllMocks());

describe("publishing database reads", () => {
  it.each([
    ["/signals", 1], ["/signals", 2], ["/signals", 3],
    ["/audit", 1], ["/click-stats", 1], ["/weekly-queue", 1],
  ])("%s returns a retryable error if query %i fails", async (route, failAt) => {
    fixture.failAt = failAt;
    const res = await request(app).get(`/social${route}`);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ ok: false, error: expect.stringMatching(/Please retry/) });
    expect(JSON.stringify(res.body)).not.toContain("private database");
    // A fresh GET after recovery returns real empty data, not a cached error.
    fixture.failAt = 0;
    expect((await request(app).get(`/social${route}`)).body.ok).toBe(true);
  });

  it.each([
    ["/signals", { topThemes: [], recentBlogActivity: [], statusCounts: {}, suggestedFocus: [] }],
    ["/audit", []], ["/click-stats", []], ["/weekly-queue", []],
  ])("%s preserves legitimate empty results", async (route, data) => {
    const res = await request(app).get(`/social${route}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, data });
  });
});

describe("publishing file reads (GET only, no filesystem writes)", () => {
  const routes = [
    ["/registry", []], ["/calendar", []], ["/pillars", []],
    ["/drafts", []], ["/draft-packs", []], ["/featured", {}], ["/status", {}],
  ];
  it.each(routes)("%s permits missing optional files and valid empty JSON", async (route, data) => {
    const read = vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    });
    let res = await request(app).get(`/publishing${route}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, data });
    read.mockReturnValue(JSON.stringify(data));
    res = await request(app).get(`/publishing${route}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, data });
  });

  it.each([...routes.map(([route]) => route), "/draft-packs/example"])(
    "%s rejects malformed, unreadable and I/O-failed existing files", async route => {
      const read = vi.spyOn(fs, "readFileSync");
      for (const failure of ["malformed", "EACCES", "EIO"]) {
        read.mockImplementation(() => {
          if (failure === "malformed") return "{invalid JSON";
          throw Object.assign(new Error("private filesystem details"), { code: failure });
        });
        const res = await request(app).get(`/publishing${route}`);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({
          ok: false, error: "Failed to load publishing data. Please retry.",
        });
      }
    },
  );

  it("keeps a genuinely absent draft as not found", async () => {
    vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    });
    const res = await request(app).get("/publishing/draft-packs/example");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ ok: false, error: "Draft not found" });
  });
});