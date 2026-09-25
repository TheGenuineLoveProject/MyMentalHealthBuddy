import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";

// Run ONLY through scripts/security/test-social-enterprise-isolated.sh.
// This guard runs before any SQL, and refuses external TCP connections.
const parsed = new URL(process.env.DATABASE_URL || "postgresql://invalid/");
const isolated = parsed.hostname === "localhost" &&
  parsed.searchParams.get("host")?.startsWith("/tmp/mmhb-social-") &&
  process.env.DATABASE_SSL === "false" && process.env.NODE_ENV === "test";

const app = express();
app.use(express.json());
let pool, db, socialPosts, publishingEvents, eq;
const token = (role = "admin") =>
  `Bearer ${jwt.sign({ id: "11111111-1111-4111-8111-111111111111", role }, process.env.JWT_SECRET, { expiresIn: "5m" })}`;
// Do not sign at import time: other server suites import this file without
// the runner's synthetic JWT_SECRET, and should simply skip the SQL cases.
const call = (method, path, body, authorization = token()) => {
  let req = request(app)[method](`/api/social-enterprise${path}`);
  if (authorization) req = req.set("Authorization", authorization);
  return body === undefined ? req : req.send(body);
};
const copy = {
  title: "A gentle reminder",
  content: "Take a moment to breathe and notice your needs. One small step can be enough for today. You can go at your own pace.",
  safetyNote: "Educational content only, not therapy or medical advice.",
};
const create = async (value = copy) => {
  const res = await call("post", "/post", value);
  expect(res.status, JSON.stringify(res.body)).toBe(200);
  return res.body.data;
};

beforeAll(async () => {
  if (!isolated) return;
  ({ pool, db } = await import("../db/connection.mjs"));
  ({ socialPosts, publishingEvents } = await import("../../shared/schema.mjs"));
  ({ eq } = await import("drizzle-orm"));
  const { default: router } = await import("../routes/social-enterprise.mjs");
  app.use("/api/social-enterprise", router);
  // Use the checked-in canonical DDL for the five tables exercised, not a
  // hand-built in-memory simulation. No app bootstrap or ensureSchema().
  const ddl = readFileSync(new URL("../db/schema.canonical.sql", import.meta.url), "utf8");
  for (const name of ["analytics_events", "blog_posts", "publishing_events", "social_campaigns", "social_posts"]) {
    const match = ddl.match(new RegExp(`CREATE TABLE IF NOT EXISTS "${name}" \\([\\s\\S]*?\\n\\);`));
    if (!match) throw new Error(`Canonical schema missing ${name}`);
    await pool.query(match[0]);
  }
});
beforeEach(async () => {
  if (!isolated) return;
  await pool.query("TRUNCATE analytics_events, blog_posts, publishing_events, social_campaigns, social_posts");
});
afterAll(async () => { if (pool) await pool.end(); });

describe.skipIf(!isolated)("real SQL and handler qualification (no publisher)", () => {
  it("denies non-admin inventory before SQL mutations, admits authenticated admin reads", async () => {
    const routes = [
      ["get", "/"],
      ["get", "/posts"], ["get", "/post/11111111-1111-4111-8111-111111111111"],
      ["post", "/post"], ["put", "/post/11111111-1111-4111-8111-111111111111"],
      ["post", "/post/11111111-1111-4111-8111-111111111111/submit"],
      ["post", "/post/11111111-1111-4111-8111-111111111111/approve"],
      ["post", "/post/11111111-1111-4111-8111-111111111111/mark-posted"],
      ["get", "/signals"], ["get", "/audit"], ["get", "/themes"], ["get", "/platforms"],
      ["get", "/campaigns"], ["post", "/campaigns"],
      ["put", "/campaigns/11111111-1111-4111-8111-111111111111"],
      ["post", "/post/11111111-1111-4111-8111-111111111111/schedule"],
      ["post", "/build-utm"], ["get", "/weekly-queue"], ["post", "/generate-from-blog"],
      ["get", "/click-stats"],
    ];
    for (const [method, path] of routes) {
      expect((await call(method, path, {}, null)).status).toBe(401);
      expect((await call(method, path, {}, token("staff"))).status).toBe(403);
    }
    expect((await pool.query("SELECT count(*)::int AS total FROM publishing_events")).rows[0].total).toBe(0);
    const draft = await create();
    expect(draft).toMatchObject({
      authorId: "11111111-1111-4111-8111-111111111111",
      createdBy: "admin-account:11111111-1111-4111-8111-111111111111",
    });
    for (const path of ["/", "/posts", `/post/${draft.id}`, "/signals", "/audit", "/themes", "/platforms", "/campaigns", "/weekly-queue", "/click-stats"]) {
      const res = await call("get", path);
      expect(res.status, `${path}: ${JSON.stringify(res.body)}`).toBe(200);
      expect(res.body.ok).toBe(true);
      if (path === "/") expect(res.body.module).toBe("social-enterprise");
      if (path === "/posts") expect(res.body.data.map(p => p.id)).toContain(draft.id);
      if (path === "/signals") expect(res.body.data.statusCounts.draft).toBe(1);
      if (path === "/audit") expect(res.body.data.map(e => e.type)).toContain("social_draft_created");
    }
  });

  it("excludes null themes from actual SQL signals while counting all posted rows", async () => {
    await pool.query(
      "INSERT INTO social_posts (content, platform, author_id, status, theme) VALUES ($1, $2, $3, $4, $5), ($1, $2, $3, $4, $6)",
      [copy.content, "instagram", "11111111-1111-4111-8111-111111111111", "posted", null, "mindfulness"],
    );
    const signals = await call("get", "/signals");
    expect(signals.status).toBe(200);
    expect(signals.body.data.statusCounts.posted).toBe(2);
    expect(signals.body.data.topThemes).toEqual([{ theme: "mindfulness", count: 1 }]);
  });

  it("attributes no-id verify-token sessions consistently across draft, approval and blog generation", async () => {
    // Exact claim shape issued by /api/admin/verify-token: role, timestamp,
    // plus jsonwebtoken-generated iat/exp; deliberately no account id.
    const session = `Bearer ${jwt.sign(
      { role: "admin", timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: "4h" },
    )}`;
    const decoded = jwt.verify(session.slice(7), process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ role: "admin", timestamp: expect.any(Number), iat: expect.any(Number), exp: expect.any(Number) });
    expect(decoded).not.toHaveProperty("id");

    const first = await call("post", "/post", copy, session);
    const second = await call("post", "/post", { ...copy, title: "Another gentle reminder" }, session);
    expect(first.status, JSON.stringify(first.body)).toBe(200);
    expect(second.status, JSON.stringify(second.body)).toBe(200);
    const author = first.body.data.authorId;
    expect(author).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(second.body.data.authorId).toBe(author);
    expect(first.body.data.createdBy).toBe(`admin-token-session:${author}`);
    expect(second.body.data.createdBy).toBe(first.body.data.createdBy);

    const id = first.body.data.id;
    expect((await call("post", `/post/${id}/submit`, undefined, session)).body.data.reviewedBy).toBe(`admin-token-session:${author}`);
    const approval = await call("post", `/post/${id}/approve`, undefined, session);
    expect(approval.status, JSON.stringify(approval.body)).toBe(200);
    expect(approval.body.data).toMatchObject({ status: "approved", approvedBy: `admin-token-session:${author}` });

    const blogId = "33333333-3333-4333-8333-333333333333";
    await pool.query(
      "INSERT INTO blog_posts (id, title, slug, content, author_id) VALUES ($1, $2, $3, $4, $5)",
      [blogId, "A mindful guide", "mindful-guide", copy.content, author],
    );
    const generated = await call("post", "/generate-from-blog", { blogPostId: blogId }, session);
    expect(generated.status, JSON.stringify(generated.body)).toBe(200);
    expect(generated.body.data).toHaveLength(7);
    expect(generated.body.data.every(p =>
      p.authorId === author && p.createdBy === `admin-token-session:${author}` &&
      p.status === "draft" && !p.postedAt && !p.publishedAt
    )).toBe(true);
    const persisted = await pool.query(
      "SELECT author_id, created_by, status FROM social_posts WHERE origin_id = $1", [blogId],
    );
    expect(persisted.rows).toHaveLength(7);
    expect(persisted.rows.every(p =>
      p.author_id === author && p.created_by === `admin-token-session:${author}` && p.status === "draft"
    )).toBe(true);
  });

  it("rejects malformed no-id administrator tokens missing timestamp without creating rows", async () => {
    const malformed = `Bearer ${jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "4h" })}`;
    expect((await call("post", "/post", copy, malformed)).status).toBe(400);
    expect((await pool.query("SELECT count(*)::int AS total FROM social_posts")).rows[0].total).toBe(0);
    expect((await pool.query("SELECT count(*)::int AS total FROM publishing_events")).rows[0].total).toBe(0);
  });

  it("persists transitions and audit events; rejects unsafe/short/crisis-missing approval", async () => {
    const draft = await create();
    expect((await call("post", `/post/${draft.id}/approve`)).status).toBe(400);
    expect((await call("post", `/post/${draft.id}/submit`)).body.data.status).toBe("review");
    expect((await call("put", `/post/${draft.id}`, { title: "A kinder reminder" })).body.data.status).toBe("draft");
    await call("post", `/post/${draft.id}/submit`);
    expect((await call("post", `/post/${draft.id}/approve`)).body.data.status).toBe("approved");
    expect((await call("post", `/post/${draft.id}/mark-posted`, { platforms: ["instagram", "x"] })).body.data.status).toBe("posted");
    const saved = await db.select().from(socialPosts).where(eq(socialPosts.id, draft.id));
    expect(saved[0].postedPlatforms).toEqual(["instagram", "x"]);
    expect(saved[0].publishedAt).toBeInstanceOf(Date);
    const unsafe = await create({ ...copy, content: "This will cure everyone. " + copy.content });
    await call("post", `/post/${unsafe.id}/submit`);
    expect((await call("post", `/post/${unsafe.id}/approve`)).status).toBe(422);
    const crisis = await create({ ...copy, crisisLinkRequired: 1 });
    await call("post", `/post/${crisis.id}/submit`);
    expect((await call("post", `/post/${crisis.id}/approve`)).body.message).toMatch(/Crisis link required/);
    await call("put", `/post/${crisis.id}`, { captions: { x: "Call 988 Lifeline for support." } });
    await call("post", `/post/${crisis.id}/submit`);
    expect((await call("post", `/post/${crisis.id}/approve`)).status).toBe(200);
    const short = await create({ ...copy, content: "Short" });
    await call("post", `/post/${short.id}/submit`);
    expect((await call("post", `/post/${short.id}/approve`)).status).toBe(422);
    const audit = await db.select().from(publishingEvents);
    expect(audit.map(e => e.type)).toContain("social_post_marked_posted");
    expect(audit.filter(e => e.type === "social_post_approved")).toHaveLength(2);
  });

  it("persists campaigns/schedule, encodes UTM, generates seven draft-only blog posts", async () => {
    const campaign = await call("post", "/campaigns", { name: " Gentle week " });
    expect(campaign.status).toBe(200);
    const campaignId = campaign.body.data.id;
    expect((await call("put", `/campaigns/${campaignId}`, { status: "paused" })).body.data.status).toBe("paused");
    const draft = await create({ ...copy, campaignId });
    const future = new Date(Date.now() + 86_400_000).toISOString();
    expect((await call("post", `/post/${draft.id}/schedule`, { scheduledFor: "2000-01-01" })).status).toBe(400);
    expect((await call("post", `/post/${draft.id}/schedule`, { scheduledFor: future })).status).toBe(200);
    expect((await call("get", "/weekly-queue")).body.data.map(p => p.id)).toContain(draft.id);
    const utm = await call("post", "/build-utm", {
      baseUrl: "example.org/guide", source: "instagram", medium: "social", campaign: "gentle week",
    });
    expect(new URL(utm.body.data.utmUrl).searchParams.get("utm_campaign")).toBe("gentle week");
    const blogId = "22222222-2222-4222-8222-222222222222";
    await pool.query(
      "INSERT INTO blog_posts (id, title, slug, content, author_id) VALUES ($1, $2, $3, $4, $5)",
      [blogId, "A gentle guide", "a-gentle-guide", copy.content, "11111111-1111-4111-8111-111111111111"],
    );
    const generated = await call("post", "/generate-from-blog", { blogPostId: blogId, campaignId });
    expect(generated.status, JSON.stringify(generated.body)).toBe(200);
    expect(generated.body.data).toHaveLength(7);
    const rows = await pool.query("SELECT status, origin_type, origin_id, posted_at, published_at FROM social_posts WHERE origin_id = $1", [blogId]);
    expect(rows.rows).toHaveLength(7);
    expect(rows.rows.every(p => p.status === "draft" && p.origin_type === "blog" && p.posted_at === null && p.published_at === null)).toBe(true);
  });
});