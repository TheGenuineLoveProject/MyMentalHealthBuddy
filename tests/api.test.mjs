// tests/api.test.mjs
// Integration tests for API endpoints
import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = process.env.TEST_URL || "http://127.0.0.1:5000";

describe("API Health Endpoints", () => {
  it("should return 200 for root health check", async () => {
    const res = await fetch(`${BASE_URL}/healthz`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("should return 200 for API health check", async () => {
    const res = await fetch(`${BASE_URL}/api/health-check`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});

describe("Wisdom API", () => {
  it("should return daily wisdom", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.wisdom).toBeDefined();
    expect(data.wisdom.quote).toBeDefined();
    expect(data.wisdom.tradition).toBeDefined();
  });

  it("should return mental models", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom/models`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.models)).toBe(true);
    expect(data.models.length).toBeGreaterThan(0);
  });

  it("should return systems archetypes", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom/systems`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.archetypes)).toBe(true);
  });
});

describe("Dialectics API", () => {
  it("should return dialectical methods", async () => {
    const res = await fetch(`${BASE_URL}/api/dialectics/methods`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.methods)).toBe(true);
    expect(data.methods.length).toBe(6);
  });

  it("should return epistemological frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/dialectics/epistemology`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(8);
  });

  it("should return decision frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/dialectics/decisions`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(8);
  });

  it("should return daily dialectical practice", async () => {
    const res = await fetch(`${BASE_URL}/api/dialectics/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
    expect(data.daily.method).toBeDefined();
    expect(data.daily.inquiryPrompt).toBeDefined();
  });
});

describe("Practices API", () => {
  it("should return contemplative practices", async () => {
    const res = await fetch(`${BASE_URL}/api/practices/contemplative`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.practices)).toBe(true);
    expect(data.practices.length).toBe(8);
  });

  it("should return growth practices", async () => {
    const res = await fetch(`${BASE_URL}/api/practices/growth`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.practices)).toBe(true);
    expect(data.practices.length).toBe(8);
  });

  it("should return daily practice recommendation", async () => {
    const res = await fetch(`${BASE_URL}/api/practices/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
    expect(data.daily.contemplativePractice).toBeDefined();
    expect(data.daily.growthPractice).toBeDefined();
  });
});

describe("Mirror API", () => {
  it("should return reflection for valid input", async () => {
    const res = await fetch(`${BASE_URL}/api/mirror`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "I am feeling anxious about tomorrow and want to feel calmer" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.reflection).toBeDefined();
  });

  it("should reject input that is too short", async () => {
    const res = await fetch(`${BASE_URL}/api/mirror`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hi" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });
});

describe("Authentication Required Endpoints", () => {
  it("should require auth for states API", async () => {
    const res = await fetch(`${BASE_URL}/api/states`);
    expect(res.status).toBe(401);
  });

  it("should require auth for journal API", async () => {
    const res = await fetch(`${BASE_URL}/api/journal`);
    expect(res.status).toBe(401);
  });
});

describe("Insights API", () => {
  it("should return daily insights", async () => {
    const res = await fetch(`${BASE_URL}/api/insights/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.insight).toBeDefined();
    expect(typeof data.insight).toBe("string");
    expect(data.insight.length).toBeGreaterThan(0);
  });
});

describe("Knowledge API", () => {
  it("should return concept frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/knowledge/concepts`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(5);
  });

  it("should return learning principles", async () => {
    const res = await fetch(`${BASE_URL}/api/knowledge/learning`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.principles)).toBe(true);
    expect(data.principles.length).toBe(8);
  });

  it("should return intellectual virtues", async () => {
    const res = await fetch(`${BASE_URL}/api/knowledge/virtues`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.virtues)).toBe(true);
    expect(data.virtues.length).toBe(7);
  });

  it("should return daily knowledge practice", async () => {
    const res = await fetch(`${BASE_URL}/api/knowledge/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Philosophy API", () => {
  it("should return philosophical schools", async () => {
    const res = await fetch(`${BASE_URL}/api/philosophy/schools`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.schools)).toBe(true);
    expect(data.schools.length).toBe(8);
  });

  it("should return virtue ethics framework", async () => {
    const res = await fetch(`${BASE_URL}/api/philosophy/virtues`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.virtueEthics).toBeDefined();
    expect(data.virtueEthics.cardinal).toBeDefined();
  });

  it("should return cardinal virtues", async () => {
    const res = await fetch(`${BASE_URL}/api/philosophy/virtues/cardinal`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.cardinalVirtues)).toBe(true);
    expect(data.cardinalVirtues.length).toBe(4);
  });

  it("should return philosophical questions", async () => {
    const res = await fetch(`${BASE_URL}/api/philosophy/questions`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.categories).toBeDefined();
  });

  it("should return daily philosophical practice", async () => {
    const res = await fetch(`${BASE_URL}/api/philosophy/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});
