import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = process.env.TEST_URL || "http://127.0.0.1:5000";
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = "SecurePassword123!";

let authToken = null;
let userId = null;

describe("Authentication Flow", () => {
  describe("Registration", () => {
    it("should register a new user with valid data", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          name: "Test User",
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.user.email).toBe(TEST_EMAIL);
      expect(data.user.role).toBe("user");
      authToken = data.token;
      userId = data.user.id;
    });

    it("should reject registration with existing email", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          name: "Duplicate User",
        }),
      });
      expect(res.status).toBe(409);
    });

    it("should reject registration with weak password", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `weak-${Date.now()}@example.com`,
          password: "12345",
          name: "Weak Password User",
        }),
      });
      expect(res.status).toBe(400);
    });

    it("should reject registration with invalid email", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "not-an-email",
          password: TEST_PASSWORD,
          name: "Invalid Email User",
        }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("Login", () => {
    it("should login with valid credentials", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(data.user.email).toBe(TEST_EMAIL);
      authToken = data.token;
    });

    it("should reject login with wrong password", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: "WrongPassword123!",
        }),
      });
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.message).toBe("Invalid credentials");
    });

    it("should reject login with non-existent email", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: TEST_PASSWORD,
        }),
      });
      expect(res.status).toBe(401);
    });

    it("should reject login with missing fields", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: TEST_EMAIL }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("Protected Routes", () => {
    it("should access /me with valid token", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user.email).toBe(TEST_EMAIL);
      expect(data.user.passwordHash).toBeUndefined();
      expect(data.user.password_hash).toBeUndefined();
    });

    it("should reject /me without token", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`);
      expect(res.status).toBe(401);
    });

    it("should reject /me with invalid token", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: "Bearer invalid.token.here" },
      });
      expect(res.status).toBe(401);
    });

    it("should reject /me with expired token format", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQiLCJleHAiOjB9.expired" },
      });
      expect(res.status).toBe(401);
    });
  });

  describe("Logout", () => {
    it("should logout successfully", async () => {
      const res = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.message).toBe("Logged out");
    });
  });
});

describe("Admin Access Control", () => {
  it("should block non-admin access to admin routes", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.status).toBe(403);
  });

  it("should block unauthenticated access to admin routes", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    expect(res.status).toBe(401);
  });
});

describe("Session Security", () => {
  it("should not expose sensitive data in error messages", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "doesnotexist@example.com",
        password: "wrongpassword",
      }),
    });
    const data = await res.json();
    expect(data.message).not.toMatch(/password|hash|token|secret/i);
  });

  it("should return consistent error messages for security", async () => {
    const res1 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent@x.com", password: "test" }),
    });
    const res2 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: TEST_EMAIL, password: "wrong" }),
    });
    const data1 = await res1.json();
    const data2 = await res2.json();
    expect(data1.message).toBe("Invalid credentials");
    expect(data2.message).toBe("Invalid credentials");
  });
});
