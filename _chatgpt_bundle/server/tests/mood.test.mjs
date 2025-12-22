import { describe, it, expect } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.mjs";

const app = createTestApp();

describe("Mood API", () => {
  it("GET /api/mood returns mood entries", async () => {
    const res = await request(app).get("/api/mood");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
