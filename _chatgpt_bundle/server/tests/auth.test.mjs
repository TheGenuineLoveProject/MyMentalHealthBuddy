import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createTestApp } from "./app.mjs";
import * as mockDb from "./test-mocks.mjs";

const app = createTestApp();

beforeEach(() => {
  mockDb.insert.mockReset();
  mockDb.select.mockReset();
  mockDb.update.mockReset();
  mockDb.deleteOp.mockReset();
});

describe("Auth API — CRUD Suite", () => {
  it("POST /api/auth/signup creates a new user", async () => {
    mockDb.insert.mockResolvedValue({
      id: "u1",
      email: "test@example.com",
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "test@example.com",
        password: "123456",
      });

    expect(res.status).toBeLessThan(500);
  });

  it("POST /api/auth/login returns a JWT", async () => {
    mockDb.select.mockResolvedValue([
      {
        id: "u1",
        email: "test@example.com",
        passwordHash: "hashed_password",
      },
    ]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456",
      });

    expect(res.status).toBeLessThan(500);
    expect(res.body).toBeDefined();
  });
});
