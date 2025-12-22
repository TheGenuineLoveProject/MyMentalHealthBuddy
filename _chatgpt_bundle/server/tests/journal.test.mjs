import { describe, it, expect } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.mjs";

const app = createTestApp();

describe("Journal API", () => {
  it("GET /api/journal returns journal entries", async () => {
    const res = await request(app).get("/api/journal");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/journal creates a new entry", async () => {
    const res = await request(app)
      .post("/api/journal")
      .send({ title: "Test Entry", content: "Test content" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Entry");
  });
});
