import { describe, it, expect } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.mjs";

const app = createTestApp();

describe("AI API", () => {
  it("POST /api/ai/chat returns a response", async () => {
    const res = await request(app)
      .post("/api/ai/chat")
      .send({ message: "Hello" });
    expect(res.status).toBe(200);
    expect(res.body.response).toBeDefined();
  });
});
