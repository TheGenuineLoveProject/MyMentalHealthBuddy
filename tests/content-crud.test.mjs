import { describe, it, expect } from "vitest";

const BASE_URL = process.env.TEST_URL || "http://127.0.0.1:5000";

const VALID_ENTITY = {
  id: "550e8400-e29b-41d4-a716-446655440099",
  title: "Gentle Reset Practice",
  slug: `gentle-reset-${Date.now()}`,
  summary:
    "A short educational practice for calming your nervous system without making clinical claims or therapy replacement claims.",
  body: "## Gentle Reset\n\nPause. Name the feeling. Breathe slowly for ten seconds. Choose one kind next action. This educational content is not medical care and does not replace therapy.",
  status: "draft",
  author: "system",
  domain: "HEALING_DOMAIN",
  visibility: "public",
  updatedAt: new Date().toISOString(),
  audit: {
    created_by: "system",
    created_at: new Date().toISOString(),
    updated_by: "system",
    updated_at: new Date().toISOString(),
    version: 1,
    transitions: [],
  },
};

describe("B1 Content Entity CRUD Regression", () => {
  it("POST /api/content/validate with valid payload returns 200", async () => {
    const res = await fetch(`${BASE_URL}/api/content/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_ENTITY),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("POST /api/content/validate with invalid payload returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/content/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("POST /api/content/items with valid payload returns 201", async () => {
    const entity = {
      ...VALID_ENTITY,
      slug: `crud-test-create-${Date.now()}`,
    };
    const res = await fetch(`${BASE_URL}/api/content/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.item).toBeDefined();
    expect(data.item.slug).toBe(entity.slug);
  });

  it("GET /api/content/items lists items", async () => {
    const res = await fetch(`${BASE_URL}/api/content/items`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("duplicate slug returns 409", async () => {
    const slug = `dup-slug-${Date.now()}`;
    const entityA = {
      ...VALID_ENTITY,
      id: "550e8400-e29b-41d4-a716-446655440001",
      slug,
    };
    const entityB = {
      ...VALID_ENTITY,
      id: "550e8400-e29b-41d4-a716-446655440002",
      slug,
    };

    const first = await fetch(`${BASE_URL}/api/content/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entityA),
    });
    expect(first.status).toBe(201);

    const second = await fetch(`${BASE_URL}/api/content/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entityB),
    });
    expect(second.status).toBe(409);
  });

  it("healing CTA in HEALING_DOMAIN returns 400", async () => {
    const entity = {
      ...VALID_ENTITY,
      slug: `healing-cta-${Date.now()}`,
      body: "Buy now for a limited time discount.",
      domain: "HEALING_DOMAIN",
    };
    const res = await fetch(`${BASE_URL}/api/content/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });
    expect(res.status).toBe(400);
  });

  it("unsafe HTML returns 400", async () => {
    const entity = {
      ...VALID_ENTITY,
      slug: `unsafe-html-${Date.now()}`,
      body: '<script>alert("xss")</script>',
    };
    const res = await fetch(`${BASE_URL}/api/content/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });
    expect(res.status).toBe(400);
  });

  it("reserved slug returns 400", async () => {
    const entity = {
      ...VALID_ENTITY,
      slug: "admin",
    };
    const res = await fetch(`${BASE_URL}/api/content/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });
    expect(res.status).toBe(400);
  });

  it("PATCH /api/content/items/:id updates an existing item", async () => {
    const slug = `patch-test-${Date.now()}`;
    const entity = {
      ...VALID_ENTITY,
      id: "550e8400-e29b-41d4-a716-446655440010",
      slug,
    };

    const createRes = await fetch(`${BASE_URL}/api/content/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });
    expect(createRes.status).toBe(201);

    const patchRes = await fetch(
      `${BASE_URL}/api/content/items/${entity.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Title" }),
      },
    );
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.ok).toBe(true);
    expect(patchData.item.title).toBe("Updated Title");
    expect(patchData.item.slug).toBe(slug);
  });

  it("GET /api/content/items/:id returns a single item", async () => {
    const slug = `fetch-test-${Date.now()}`;
    const entity = {
      ...VALID_ENTITY,
      id: "550e8400-e29b-41d4-a716-446655440011",
      slug,
    };

    await fetch(`${BASE_URL}/api/content/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity),
    });

    const res = await fetch(`${BASE_URL}/api/content/items/${entity.id}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.item.slug).toBe(slug);
  });

  it("GET /api/content/formats returns exactly 10 formats", async () => {
    const res = await fetch(`${BASE_URL}/api/content/formats`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.formats.length).toBe(10);
  });

  it("POST /api/content/generate with healing monetization returns 400", async () => {
    const res = await fetch(`${BASE_URL}/api/content/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "Buy now limited time offer",
        domain: "HEALING_DOMAIN",
      }),
    });
    expect(res.status).toBe(400);
  });
});
