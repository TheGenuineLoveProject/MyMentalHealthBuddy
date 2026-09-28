import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { socialPosts, socialCampaigns, publishingEvents, blogPosts } from "../../shared/schema.mjs";

// Import the actual router, auth middleware and publishing rules. Only the DB and
// logger are substituted; importing server/app.mjs would open production services.
const secret = "isolated-social-console-secret-32-characters";
vi.hoisted(() => {
  process.env.JWT_SECRET = "isolated-social-console-secret-32-characters";
});
vi.mock("../utils/logger.mjs", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../db/connection.mjs", () => {
  const tables = new Map();
  const calls = [];
  let serial = 0;
  const rows = table => {
    if (!tables.has(table)) tables.set(table, []);
    return tables.get(table);
  };
  // Drizzle's eq() produces a SQL tree containing a Param with the id. Match
  // only ids here; list queries use disposable table rows (one fixture each).
  const params = expr => {
    if (!expr) return [];
    if (Array.isArray(expr)) return expr.flatMap(params);
    if ("queryChunks" in expr) return params(expr.queryChunks);
    if (expr.constructor?.name === "Param") return [expr.value];
    return [];
  };
  const db = {
    tables, calls,
    reset() { tables.clear(); calls.length = 0; serial = 0; },
    select() {
      let table;
      let clause;
      const chain = {
        from(t) { table = t; calls.push({ op: "select", table }); return chain; },
        where(q) { clause = q; return chain; },
        groupBy() { return chain; },
        orderBy() { return chain; },
        limit(n) {
          calls.push({ op: "limit", table, n, clause });
          const ids = params(clause).filter(p => typeof p === "string" && /^[a-z]+-\d+$/.test(p));
          return Promise.resolve(rows(table).filter(row => !ids.length || ids.includes(row.id)).slice(0, n));
        },
        then(resolve, reject) { return Promise.resolve(rows(table)).then(resolve, reject); },
      };
      return chain;
    },
    insert(table) {
      return {
        values(value) {
          const row = { id: `${table === socialPosts ? "post" : table === socialCampaigns ? "campaign" : "event"}-${++serial}`, ...value };
          rows(table).push(row);
          calls.push({ op: "insert", table, row });
          return {
            returning: () => Promise.resolve([row]),
            then: (resolve, reject) => Promise.resolve([row]).then(resolve, reject),
            catch: reject => Promise.resolve([row]).catch(reject),
          };
        },
      };
    },
    update(table) {
      let changes;
      return {
        set(value) {
          changes = value;
          return {
            where(expr) {
              return {
                returning() {
                  const ids = params(expr);
                  const row = rows(table).find(r => ids.includes(r.id));
                  calls.push({ op: "update", table, changes, id: ids[0] });
                  if (row) Object.assign(row, changes);
                  return Promise.resolve(row ? [row] : []);
                },
              };
            },
          };
        },
      };
    },
  };
  return { db };
});

import router from "../routes/social-enterprise.mjs";
import { db } from "../db/connection.mjs";

const app = express();
app.use(express.json());
app.use("/api/social-enterprise", router);
const base = "/api/social-enterprise";
const bearer = (role = "admin", key = secret, expiresIn = "5m") =>
  `Bearer ${jwt.sign({ id: "test-admin", role }, key, { expiresIn })}`;
const admin = bearer();
const call = (method, path, authorization = admin, body) => {
  let req = request(app)[method](`${base}${path}`);
  if (authorization) req = req.set("Authorization", authorization);
  return body === undefined ? req : req.send(body);
};
const valid = {
  title: "A gentle moment",
  content: "Pause and notice what you need today. There is space to take one small, gentle step at your own pace.",
  safetyNote: "Educational content, not medical advice.",
};
const makeDraft = async (body = valid) => {
  const res = await call("post", "/post", admin, body);
  expect(res.status).toBe(200);
  return res.body.data;
};
const events = () => db.tables.get(publishingEvents) || [];
const posts = () => db.tables.get(socialPosts) || [];
beforeEach(() => db.reset());

describe("social-enterprise route authorization (actual JWT middleware)", () => {
  const inventory = [
    ["get", "/"],
    ["get", "/posts"], ["get", "/post/post-1"], ["post", "/post"],
    ["put", "/post/post-1"], ["post", "/post/post-1/submit"],
    ["post", "/post/post-1/approve"], ["post", "/post/post-1/mark-posted"],
    ["get", "/signals"], ["get", "/audit"], ["get", "/themes"],
    ["get", "/platforms"], ["get", "/campaigns"], ["post", "/campaigns"],
    ["put", "/campaigns/campaign-1"], ["post", "/post/post-1/schedule"],
    ["post", "/build-utm"], ["get", "/weekly-queue"],
    ["post", "/generate-from-blog"], ["get", "/click-stats"],
  ];
  it.each(inventory)("%s %s denies anonymous and non-admin before DB work", async (method, path) => {
    for (const [credential, status] of [
      [null, 401], [bearer("user"), 403], [bearer("staff"), 403],
      [bearer("admin", "wrong-secret-of-at-least-32-characters"), 401],
      [bearer("admin", secret, -60), 401],
    ]) {
      expect((await call(method, path, credential, {})).status).toBe(status);
      expect(db.calls).toHaveLength(0);
    }
  });
  it("allows admin read inventory using disposable data", async () => {
    const draft = await makeDraft();
    const campaign = await call("post", "/campaigns", admin, { name: "Gentle week" });
    expect(campaign.status).toBe(200);
    for (const path of [
      "/", "/posts", `/post/${draft.id}`, "/signals", "/audit", "/themes",
      "/platforms", "/campaigns", "/weekly-queue", "/click-stats",
    ]) {
      const res = await call("get", path);
      expect(res.status, path).toBe(200);
      expect(res.body.ok, path).toBe(true);
      if (path === "/") expect(res.body.module).toBe("social-enterprise");
    }
    expect((await call("get", "/posts")).body.data).toHaveLength(1);
    expect((await call("get", "/campaigns")).body.data).toHaveLength(1);
    expect((await call("get", "/themes")).body.data).toContain("self-compassion");
    expect((await call("get", "/platforms")).body.data).toContain("instagram");
  });
});

describe("draft workflow and safety gates (actual publishing rules)", () => {
  it("creates, edits, submits, reverts edited review to draft, approves and manually marks posted", async () => {
    const draft = await makeDraft();
    expect(draft).toMatchObject({ status: "draft", authorId: "test-admin", platform: "instagram" });
    expect(events().at(-1).type).toBe("social_draft_created");
    expect((await call("post", `/post/${draft.id}/approve`)).status).toBe(400);
    expect((await call("post", `/post/${draft.id}/mark-posted`, admin, { platforms: ["instagram"] })).status).toBe(400);
    let res = await call("post", `/post/${draft.id}/submit`);
    expect(res.body.data.status).toBe("review");
    res = await call("put", `/post/${draft.id}`, admin, { title: "A gentler moment" });
    expect(res.body.data).toMatchObject({ status: "draft", title: "A gentler moment", reviewedBy: null });
    expect((await call("post", `/post/${draft.id}/submit`)).body.data.status).toBe("review");
    res = await call("post", `/post/${draft.id}/approve`);
    expect(res.body.data.status).toBe("approved");
    expect(res.body.data.approvedBy).toBe("admin-account:test-admin");
    expect((await call("put", `/post/${draft.id}`, admin, { title: "Too late" })).status).toBe(400);
    expect((await call("post", `/post/${draft.id}/mark-posted`, admin, { platforms: ["invalid"] })).status).toBe(400);
    res = await call("post", `/post/${draft.id}/mark-posted`, admin, { platforms: ["instagram", "x", "instagram"] });
    expect(res.body.data).toMatchObject({ status: "posted", postedPlatforms: ["instagram", "x"] });
    expect(res.body.data.postedAt).toBeTruthy();
    expect(events().map(e => e.type)).toEqual([
      "social_draft_created", "social_submitted_for_review", "social_post_edited",
      "social_submitted_for_review", "social_post_approved", "social_post_marked_posted",
    ]);
    expect(db.calls.filter(c => c.op === "update" && c.table === socialPosts)).toHaveLength(5);
  });

  it("requires mandatory fields and safety note before review/approval", async () => {
    for (const field of ["title", "content", "safetyNote"]) {
      expect((await call("post", "/post", admin, { ...valid, [field]: " " })).status).toBe(400);
    }
    expect(posts()).toHaveLength(0);
    const draft = await makeDraft();
    await call("put", `/post/${draft.id}`, admin, { safetyNote: "" });
    expect((await call("post", `/post/${draft.id}/submit`)).body.message).toMatch(/Safety note/);
    // The DB fixture models an existing legacy review row lacking a note.
    posts()[0].status = "review";
    const res = await call("post", `/post/${draft.id}/approve`);
    expect(res.status).toBe(422);
    expect(res.body.errors).toContain("Safety note is required");
    expect(posts()[0].status).toBe("review");
  });

  it("blocks unsafe copy (including captions) and short content at approval without side effects", async () => {
    for (const patch of [
      { content: "This will cure everything. Try it now; the future is yours and you deserve a moment of peace today." },
      { captions: { instagram: "Guaranteed treatment for everyone" } },
      { content: "Short" },
    ]) {
      const draft = await makeDraft();
      await call("put", `/post/${draft.id}`, admin, patch);
      await call("post", `/post/${draft.id}/submit`);
      const before = events().length;
      const res = await call("post", `/post/${draft.id}/approve`);
      expect(res.status).toBe(422);
      expect(res.body.message).toBe("Content safety validation failed");
      expect(res.body.errors.length).toBeGreaterThan(0);
      expect(events()).toHaveLength(before);
      expect(posts().find(p => p.id === draft.id).status).toBe("review");
    }
  });

  it("requires crisis reference when flagged; warns on sensitive topics when not flagged", async () => {
    const body = { ...valid, content: `${valid.content} Trauma can feel overwhelming.`, crisisLinkRequired: 1 };
    const draft = await makeDraft(body);
    await call("post", `/post/${draft.id}/submit`);
    const denied = await call("post", `/post/${draft.id}/approve`);
    expect(denied.status).toBe(422);
    expect(denied.body.message).toMatch(/Crisis link required/);
    expect(posts()[0].status).toBe("review");
    await call("put", `/post/${draft.id}`, admin, { captions: { instagram: "Support: 988 Lifeline." } });
    await call("post", `/post/${draft.id}/submit`);
    expect((await call("post", `/post/${draft.id}/approve`)).body.data.status).toBe("approved");

    const another = await makeDraft({ ...body, crisisLinkRequired: 0 });
    await call("post", `/post/${another.id}/submit`);
    const warned = await call("post", `/post/${another.id}/approve`);
    expect(warned.status).toBe(200);
    expect(warned.body.data.safetyWarnings[0]).toMatch(/sensitive topics/);
  });
});

describe("campaign, scheduling, UTM and blog tools", () => {
  it("creates and updates campaigns; validates scheduled date and exposes queue", async () => {
    expect((await call("post", "/campaigns", admin, { name: " " })).status).toBe(400);
    const campaign = (await call("post", "/campaigns", admin, { name: " Gentle week " })).body.data;
    expect(campaign).toMatchObject({ name: "Gentle week", status: "active" });
    expect((await call("put", `/campaigns/${campaign.id}`, admin, { status: "paused" })).body.data.status).toBe("paused");
    const draft = await makeDraft({ ...valid, campaignId: campaign.id });
    for (const scheduledFor of [undefined, "not-a-date", "2000-01-01T00:00:00Z"]) {
      expect((await call("post", `/post/${draft.id}/schedule`, admin, { scheduledFor })).status).toBe(400);
    }
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const res = await call("post", `/post/${draft.id}/schedule`, admin, { scheduledFor: future });
    expect(res.body.data.scheduledFor).toBe(future);
    expect(events().at(-1).type).toBe("social_post_scheduled");
    expect((await call("get", "/weekly-queue")).body.data.map(p => p.id)).toContain(draft.id);
  });

  it("builds encoded tracking URL and rejects missing inputs and malformed URLs", async () => {
    const res = await call("post", "/build-utm", admin, {
      baseUrl: "example.org/guide?ref=existing", source: "instagram", medium: "social",
      campaign: "gentle week", content: "card 1",
    });
    expect(res.status).toBe(200);
    const url = new URL(res.body.data.utmUrl);
    expect(url.origin).toBe("https://example.org");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      ref: "existing", utm_source: "instagram", utm_medium: "social",
      utm_campaign: "gentle week", utm_content: "card 1",
    });
    expect((await call("post", "/build-utm", admin, { baseUrl: "example.org" })).status).toBe(400);
    expect((await call("post", "/build-utm", admin, {
      baseUrl: "http://[", source: "x", medium: "social", campaign: "spring",
    })).status).toBe(400);
  });

  it("generates seven unpublished blog-derived drafts and does not invoke a publisher", async () => {
    expect((await call("post", "/generate-from-blog", admin, {})).status).toBe(400);
    // Fixture is local to this process: no live blog DB or external publisher.
    db.tables.set(blogPosts, [{ id: "blog-1", title: "A gentle guide", content: valid.content, category: "mindfulness" }]);
    const res = await call("post", "/generate-from-blog", admin, { blogPostId: "blog-1", campaignId: "campaign-1" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(7);
    expect(res.body.data.every(p =>
      p.status === "draft" && p.originType === "blog" && p.originId === "blog-1" &&
      p.campaignId === "campaign-1" && p.authorId === "test-admin" &&
      p.safetyNote && !p.publishedAt && !p.postedAt
    )).toBe(true);
    expect(events().at(-1).meta.draftCount).toBe(7);
    expect((await call("post", "/generate-from-blog", admin, { blogPostId: "blog-99" })).status).toBe(400);
  });
});