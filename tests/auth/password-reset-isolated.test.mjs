import { beforeAll, afterAll, beforeEach, test, expect, vi } from "vitest";
import express from "express";
import request from "supertest";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { getTableConfig } from "drizzle-orm/pg-core";
import * as schema from "../../shared/schema.mjs";
import { apiRequest } from "../../client/src/lib/queryClient.js";
import { passwordResetErrorMessage } from "../../client/src/lib/passwordResetError.js";
import { csrfProtection } from "../../server/security/csrf.mjs";

// Never import either production connection (one loads dotenv).
const fixture = vi.hoisted(() => ({ emails: [] }));
vi.mock("../../server/db/connection.mjs", async () => {
  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const path = process.env.RESET_TEST_SOCKET;
  if (!path?.startsWith("/tmp/mmhb-reset-") || process.env.DATABASE_URL) {
    throw new Error("Isolated socket required; DATABASE_URL forbidden");
  }
  const pool = new Pool({ host: path, database: "reset_fixture", user: "reset_fixture", ssl: false });
  return { pool, db: drizzle(pool) };
});
vi.mock("../../server/db/client.mjs", async () => {
  const { pool, db } = await import("../../server/db/connection.mjs");
  return { pool, db, default: db };
});
vi.mock("../../server/utils/email.mjs", () => ({
  sendTransactionalEmail: async (email) => {
    fixture.emails.push(email);
    return { ok: true, result: { data: { id: "synthetic-delivery" } } };
  },
}));

const { pool } = await import("../../server/db/connection.mjs");
const { default: account } = await import("../../server/routes/account.mjs");
const { default: auth } = await import("../../server/routes/auth.mjs");
function application() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => { req.requestId = "fixture-request"; next(); });
  app.use(csrfProtection);
  app.use("/api/account", account);
  app.use("/api/auth", auth);
  return app;
}
let app = application();
const email = "fixture@example.invalid";
const oldPassword = "Old-fixture-password-1";
const newPassword = "New-fixture-password-2";
let userId;
const confirm = (token, password = newPassword) =>
  request(app).post("/api/account/password-reset/confirm").send({ token, password });
async function issue() {
  const response = await request(app).post("/api/account/password-reset/request").send({ email });
  expect(response.status).toBe(200);
  const html = fixture.emails.at(-1).html;
  const url = new URL(html.match(/href="([^"]+)"/)[1]);
  expect(url.origin).toBe("https://reset.example.invalid");
  expect(url.pathname).toBe("/reset-password");
  return { url, token: new URLSearchParams(url.search).get("token") };
}
async function state() {
  return (await pool.query("SELECT password_hash FROM users WHERE id=$1", [userId])).rows[0].password_hash;
}
beforeAll(async () => {
  // Only this fresh disposable database is initialized. No application migrations.
  for (const table of [schema.users, schema.passwordResetTokens, schema.auditLog]) {
    const config = getTableConfig(table);
    const columns = config.columns.map(c => {
      let defaults = "";
      if (c.name === "id") defaults = " DEFAULT gen_random_uuid() PRIMARY KEY";
      if (c.name === "created_at" || c.name === "updated_at") defaults = " DEFAULT now()";
      if (c.name === "timezone") defaults = " DEFAULT 'UTC'";
      return `"${c.name}" ${c.getSQLType()}${defaults}${c.notNull ? " NOT NULL" : ""}`;
    });
    await pool.query(`CREATE TABLE "${config.name}" (${columns.join(",")})`);
  }
});
beforeEach(async () => {
  await pool.query("DROP TRIGGER IF EXISTS reset_failure ON password_reset_tokens");
  await pool.query("DROP TRIGGER IF EXISTS reset_failure ON users");
  await pool.query("TRUNCATE users, password_reset_tokens, audit_log");
  userId = crypto.randomUUID();
  await pool.query("INSERT INTO users(id,email,name,password_hash) VALUES($1,$2,'Fixture',$3)",
    [userId, email, await bcrypt.hash(oldPassword, 10)]);
  fixture.emails.length = 0;
});
afterAll(async () => { await pool.end(); });

test("issuance, URL parsing, hash/expiry, fresh reset and actual login compatibility", async () => {
  const { token } = await issue();
  const row = (await pool.query("SELECT * FROM password_reset_tokens")).rows[0];
  expect(row.token_hash === crypto.createHash("sha256").update(token).digest("hex")).toBe(true);
  expect(Math.abs(row.expires_at.getTime() - Date.now() - 3600000)).toBeLessThan(5000);
  expect((await confirm(token)).status).toBe(200);
  expect((await request(app).post("/api/auth/login").set("Sec-Fetch-Site", "same-origin")
    .send({ email, password: newPassword })).status).toBe(200);
  expect((await request(app).post("/api/auth/login").set("Sec-Fetch-Site", "same-origin")
    .send({ email, password: oldPassword })).status).toBe(401);
});

test("missing/malformed/expired/reused tokens and weak passwords reject without mutation", async () => {
  const original = await state();
  for (const token of [undefined, "", "not-a-token", "a".repeat(64)]) {
    const response = await confirm(token);
    expect(response.status).toBe(400);
    expect(response.body.code).toBe("RESET_TOKEN_INVALID");
    expect(response.body.requestId).toBe("fixture-request");
    expect((await state()) === original).toBe(true);
  }
  const { token } = await issue();
  expect((await confirm(token, "short")).status).toBe(400);
  await pool.query("UPDATE password_reset_tokens SET expires_at=now()-interval '1 second'");
  expect((await confirm(token)).status).toBe(400);
  expect((await state()) === original).toBe(true);
  await pool.query("UPDATE password_reset_tokens SET expires_at=now()+interval '1 hour'");
  expect((await confirm(token)).status).toBe(200);
  const updated = await state();
  expect((await confirm(token, "Another-fixture-password")).status).toBe(400);
  expect((await state()) === updated).toBe(true);
});

test("concurrent HTTP confirmations have exactly one winner", async () => {
  const { token } = await issue();
  const responses = await Promise.all(Array.from({ length: 4 }, () => confirm(token)));
  expect(responses.map(r => r.status).sort()).toEqual([200, 400, 400, 400]);
});

test("database failure consuming token rolls back password replacement", async () => {
  const { token } = await issue();
  const original = await state();
  await pool.query(`CREATE OR REPLACE FUNCTION fail_reset_fixture() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN RAISE EXCEPTION 'synthetic reset failure'; END $$`);
  await pool.query(`CREATE TRIGGER reset_failure BEFORE UPDATE ON password_reset_tokens
    FOR EACH ROW EXECUTE FUNCTION fail_reset_fixture()`);
  expect((await confirm(token)).status).toBe(500);
  expect((await state()) === original).toBe(true);
  expect((await pool.query("SELECT used_at FROM password_reset_tokens")).rows[0].used_at).toBeNull();
});

test("failure replacing password rolls back token claim and permits retry", async () => {
  const { token } = await issue();
  const original = await state();
  await pool.query(`CREATE OR REPLACE FUNCTION fail_reset_fixture() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN RAISE EXCEPTION 'synthetic reset failure'; END $$`);
  await pool.query(`CREATE TRIGGER reset_failure BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fail_reset_fixture()`);
  const response = await confirm(token);
  expect(response.status).toBe(500);
  expect(response.body.code).toBe("RESET_CONFIRM_FAILED");
  expect((await state()) === original).toBe(true);
  expect((await pool.query("SELECT used_at FROM password_reset_tokens")).rows[0].used_at).toBeNull();
  await pool.query("DROP TRIGGER reset_failure ON users");
  expect((await confirm(token)).status).toBe(200);
});

test("GET does not consume; recreated HTTP application retains stored token", async () => {
  const { url, token } = await issue();
  await request(app).get(`${url.pathname}${url.search}`);
  expect((await request(app).get(`/api/account/password-reset/confirm${url.search}`)).status).toBe(404);
  expect((await pool.query("SELECT used_at FROM password_reset_tokens")).rows[0].used_at).toBeNull();
  app = application();
  expect((await confirm(token)).status).toBe(200);
});

test("forgot-password response is generic for nonexistent account", async () => {
  const missing = await request(app).post("/api/account/password-reset/request")
    .send({ email: "missing@example.invalid" });
  const existing = await request(app).post("/api/account/password-reset/request").send({ email });
  expect(missing.status).toBe(200);
  expect(missing.body).toEqual(existing.body);
  expect(fixture.emails.length).toBe(1);
});

test("invalid email returns validation response rather than Zod v4 TypeError", async () => {
  const response = await request(app).post("/api/account/password-reset/request").send({ email: "bad" });
  expect(response.status).toBe(400);
  expect(response.body.code).toBe("RESET_INPUT_INVALID");
  expect(fixture.emails.length).toBe(0);
});

test("global CSRF and same-origin login protection remain enforced", async () => {
  expect((await request(app).post("/api/account/onboarding").send({ goal: "test" })).status).toBe(403);
  const response = await request(app).post("/api/auth/login").set("Sec-Fetch-Site", "cross-site")
    .send({ email, password: oldPassword });
  expect(response.status).toBe(403);
  expect(response.body.code).toBe("AUTH_ORIGIN_REQUIRED");
});

test("client uses structured codes, not unrelated invalid/expired text", async () => {
  expect(passwordResetErrorMessage({ message: "invalid password" })).not.toContain("reset link");
  expect(passwordResetErrorMessage({ message: "expired session", status: 500 })).not.toContain("reset link");
  expect(passwordResetErrorMessage({ code: "RESET_TOKEN_INVALID" })).toContain("reset link");
  expect(passwordResetErrorMessage({ code: "RESET_PASSWORD_INVALID" })).toContain("8 characters");
  expect(passwordResetErrorMessage({ status: 429 })).toContain("wait");
  // Exercise the real API helper and real mounted handler over HTTP.
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  try {
    await expect(apiRequest("POST",
      `http://127.0.0.1:${server.address().port}/api/account/password-reset/confirm`,
      { token: "malformed", password: newPassword }
    )).rejects.toMatchObject({
      status: 400, code: "RESET_TOKEN_INVALID", requestId: "fixture-request",
    });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});