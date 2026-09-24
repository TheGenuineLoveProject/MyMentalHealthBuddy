import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { EventEmitter } from "node:events";

// Synthetic credentials only; never load the application or its databases.
const secret = "isolated-deep-health-test-secret-32-characters";
vi.hoisted(() => {
  process.env.JWT_SECRET = "isolated-deep-health-test-secret-32-characters";
});
vi.mock("../utils/logger.mjs", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../lib/healScheduler.mjs", () => ({
  getSchedulerState: vi.fn(() => ({ enabled: false, paused: true })),
  resumeScheduler: vi.fn(),
  pauseScheduler: vi.fn(),
}));
vi.mock("../lib/healAI.mjs", () => ({
  PROMPT_VERSION: "test",
  diagnoseHealthReport: vi.fn(async () => ({
    ok: true, diagnosis: { overall_severity: "info" }, model: "isolated-test",
  })),
}));
vi.mock("node:fs", () => ({
  existsSync: vi.fn(() => true),
  readFileSync: vi.fn(() => JSON.stringify({
    timestamp: new Date().toISOString(), verdict: "HEALTHY", totals: {},
  })),
}));
vi.mock("node:child_process", () => ({ spawn: vi.fn() }));

import router from "../routes/admin.mjs";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { diagnoseHealthReport } from "../lib/healAI.mjs";
import { getSchedulerState, resumeScheduler, pauseScheduler } from "../lib/healScheduler.mjs";

const app = express();
app.use(express.json());
app.use("/api/admin", router);
const reads = [
  "/health-deep", "/health-deep/alerts", "/health-deep/metrics",
  "/health-deep/metrics?format=json", "/health-deep/export",
];
const controls = [
  "/health-deep/run", "/health-deep/self-heal", "/health-deep/ai-analyze",
  "/health-deep/scheduler/resume", "/health-deep/scheduler/pause",
];
const routes = [
  ...reads.map(path => ["get", path]),
  ...controls.map(path => ["post", path]),
];
const effects = [spawn, existsSync, readFileSync, diagnoseHealthReport,
  getSchedulerState, resumeScheduler, pauseScheduler];
const token = (role, expiresIn = "5m", key = secret) =>
  jwt.sign({ id: "test-user", role }, key, { expiresIn });

beforeAll(() => {
  spawn.mockImplementation(() => {
    const child = new EventEmitter();
    child.kill = vi.fn();
    queueMicrotask(() => child.emit("close", 0));
    return child;
  });
});
beforeEach(() => vi.clearAllMocks());

describe("deep-health namespace authorization", () => {
  for (const [identity, authorization, status] of [
    ["anonymous", null, 401],
    ["member", `Bearer ${token("user")}`, 403],
    ["staff", `Bearer ${token("staff")}`, 403],
    ["expired admin", `Bearer ${token("admin", -60)}`, 401],
    ["forged admin", `Bearer ${token("admin", "5m", "wrong-test-key")}`, 401],
  ]) {
    it.each(routes)(`${identity}: %s %s rejects before any diagnostic work`, async (method, path) => {
      let req = request(app)[method](`/api/admin${path}`);
      if (authorization) req = req.set("Authorization", authorization);
      const res = await req;
      expect(res.status).toBe(status);
      expect(res.headers["cache-control"]).toBe("no-store");
      for (const effect of effects) expect(effect).not.toHaveBeenCalled();
    });
  }

  it.each(routes)("admin: %s %s succeeds with isolated dependencies", async (method, path) => {
    const res = await request(app)[method](`/api/admin${path}`)
      .set("Authorization", `Bearer ${token("admin")}`);
    expect(res.status).toBe(200);
    expect(res.headers["cache-control"]).toBe("no-store");
    if (path.endsWith("/run") || path.endsWith("/self-heal")) expect(spawn).toHaveBeenCalledOnce();
    if (path.endsWith("/ai-analyze")) expect(diagnoseHealthReport).toHaveBeenCalledOnce();
    if (path.endsWith("/resume")) expect(resumeScheduler).toHaveBeenCalledOnce();
    if (path.endsWith("/pause")) expect(pauseScheduler).toHaveBeenCalledOnce();
  });

  it.each(["/health-deep/", "/HEALTH-DEEP/alerts", "/health-deep/future-route"])(
    "covers namespace variations and future additions: %s", async path => {
      expect((await request(app).get(`/api/admin${path}`)).status).toBe(401);
    },
  );

  it("does not accept internal headers as an admin session", async () => {
    const res = await request(app).get("/api/admin/health-deep")
      .set("x-admin-token", "synthetic-internal-token");
    expect(res.status).toBe(401);
  });

  it("also protects implicit HEAD reads", async () => {
    expect((await request(app).head("/api/admin/health-deep")).status).toBe(401);
  });
});