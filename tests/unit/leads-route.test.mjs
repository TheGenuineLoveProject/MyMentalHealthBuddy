import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

// Import the real router, Zod, schema, and response helpers. Only infrastructure
// is replaced; these tests must never connect to a database or external service.
const store = vi.hoisted(() => ({
  existing: [],
  record: null,
  select: vi.fn(),
  update: vi.fn(),
  insert: vi.fn(),
  set: vi.fn(),
  values: vi.fn(),
}));

vi.mock("../../server/db/connection.mjs", () => ({
  db: { select: store.select, update: store.update, insert: store.insert },
}));
vi.mock("../../server/middleware/rateLimit.mjs", () => ({
  authRateLimit: (_req, _res, next) => next(),
}));
vi.mock("../../server/middleware/auth.mjs", () => ({
  requireAuth: (_req, _res, next) => next(),
}));
vi.mock("../../server/utils/logger.mjs", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

import leadsRouter from "../../server/routes/leads.mjs";

const app = express();
app.use(express.json());
app.use("/api/leads", leadsRouter);

beforeEach(() => {
  vi.clearAllMocks();
  store.existing = [];
  store.record = null;
  store.select.mockImplementation(() => ({
    from: () => ({ where: () => ({ limit: async () => store.existing }) }),
  }));
  store.update.mockImplementation(() => ({ set: store.set }));
  store.set.mockImplementation((changes) => ({
    where: async () => { store.record = { ...store.record, ...changes }; },
  }));
  store.insert.mockImplementation(() => ({ values: store.values }));
  store.values.mockImplementation(async (record) => { store.record = { ...record }; });
});

describe("POST /api/leads", () => {
  it.each([
    ["invalid email", { email: "not-an-email", consent: true }],
    ["missing consent", { email: "reader@example.test" }],
    ["false consent", { email: "reader@example.test", consent: false }],
  ])("rejects %s with 400 before any database access", async (_name, body) => {
    const response = await request(app).post("/api/leads").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, message: expect.any(String) });
    expect(store.select).not.toHaveBeenCalled();
    expect(store.update).not.toHaveBeenCalled();
    expect(store.insert).not.toHaveBeenCalled();
  });

  it("persists renewed explicit consent for an existing opted-out lead", async () => {
    store.existing = [{ id: "existing-lead" }];
    store.record = { id: "existing-lead", email: "reader@example.test", consent: false };

    const response = await request(app).post("/api/leads").send({
      email: "Reader@Example.test", consent: true, source: "pricing-newsletter",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, data: { subscribed: true } });
    expect(store.set).toHaveBeenCalledWith(expect.objectContaining({ consent: true }));
    expect(store.record).toMatchObject({ consent: true, source: "pricing-newsletter" });
    expect(store.insert).not.toHaveBeenCalled();
  });

  it("inserts a new consenting lead with normalized email", async () => {
    const response = await request(app).post("/api/leads").send({
      email: "Reader@Example.test", consent: true, source: "pricing-newsletter",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ ok: true, data: { subscribed: true } });
    expect(store.record).toMatchObject({
      email: "reader@example.test", consent: true, source: "pricing-newsletter",
    });
    expect(store.values).toHaveBeenCalledTimes(1);
    expect(store.update).not.toHaveBeenCalled();
  });
});
