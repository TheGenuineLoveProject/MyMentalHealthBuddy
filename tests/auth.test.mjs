import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server/app.mjs";

describe("Session Security", () => {
  it("should not expose sensitive data in error messages", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "notreal@example.com", password: "badpassword" });

    expect([400, 401]).toContain(res.status);

    const bodyText = JSON.stringify(res.body || {}).toLowerCase();
    expect(bodyText).not.toContain("jwt");
    expect(bodyText).not.toContain("token");
    expect(bodyText).not.toContain("stack");
    expect(bodyText).not.toContain("postgres");
    expect(bodyText).not.toContain("drizzle");
    expect(bodyText).not.toContain("select");
  });

  it("should return consistent error messages for security", async () => {
    const res1 = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "notreal@example.com", password: "badpassword" });

    const res2 = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: "notreal@example.com", password: "badpassword" });

    expect(res1.status).toBe(res2.status);

    const m1 = res1.body?.message ?? res1.body?.error ?? "";
    const m2 = res2.body?.message ?? res2.body?.error ?? "";
    expect(String(m1)).toBe(String(m2));
  });
});

describe("Admin Access Control", () => {
  it("should block unauthenticated access to admin routes", async () => {
    const res = await request(app).get("/api/admin/stats");
    expect(res.status).toBe(401);
  });
});