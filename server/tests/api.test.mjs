import { describe, it, expect } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.mjs";

const app = createTestApp();

describe("API Health", () => {
  it("GET /api/health returns 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns JSON content type", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});
