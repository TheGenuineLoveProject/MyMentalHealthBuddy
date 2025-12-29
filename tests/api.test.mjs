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

describe("Metacognition API", () => {
  it("should return metacognitive strategies", async () => {
    const res = await fetch(`${BASE_URL}/api/metacognition/strategies`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.strategies)).toBe(true);
    expect(data.strategies.length).toBe(6);
  });

  it("should return thinking biases", async () => {
    const res = await fetch(`${BASE_URL}/api/metacognition/biases`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.biases)).toBe(true);
    expect(data.biases.length).toBe(8);
  });

  it("should return daily metacognition practice", async () => {
    const res = await fetch(`${BASE_URL}/api/metacognition/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Creativity API", () => {
  it("should return creative techniques", async () => {
    const res = await fetch(`${BASE_URL}/api/creativity/techniques`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.techniques)).toBe(true);
    expect(data.techniques.length).toBe(8);
  });

  it("should return problem framing methods", async () => {
    const res = await fetch(`${BASE_URL}/api/creativity/framing`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
  });

  it("should return daily creativity practice", async () => {
    const res = await fetch(`${BASE_URL}/api/creativity/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Resilience API", () => {
  it("should return resilience factors", async () => {
    const res = await fetch(`${BASE_URL}/api/resilience/factors`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.factors)).toBe(true);
    expect(data.factors.length).toBe(8);
  });

  it("should return coping strategies", async () => {
    const res = await fetch(`${BASE_URL}/api/resilience/coping`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.strategies)).toBe(true);
    expect(data.strategies.length).toBe(4);
  });

  it("should return psychological flexibility processes", async () => {
    const res = await fetch(`${BASE_URL}/api/resilience/flexibility`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.processes)).toBe(true);
    expect(data.processes.length).toBe(6);
  });

  it("should return daily resilience practice", async () => {
    const res = await fetch(`${BASE_URL}/api/resilience/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
    expect(data.daily.affirmation).toBeDefined();
  });
});

describe("Foresight API", () => {
  it("should return scenario planning methods", async () => {
    const res = await fetch(`${BASE_URL}/api/foresight/scenarios`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.methods)).toBe(true);
    expect(data.methods.length).toBe(5);
  });

  it("should return ethical foresight principles", async () => {
    const res = await fetch(`${BASE_URL}/api/foresight/ethics`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.principles)).toBe(true);
    expect(data.principles.length).toBe(5);
  });

  it("should return daily foresight practice", async () => {
    const res = await fetch(`${BASE_URL}/api/foresight/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Systems Compassion API", () => {
  it("should return compassionate systems frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/systems-compassion/frameworks`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(4);
  });

  it("should return empathy scales", async () => {
    const res = await fetch(`${BASE_URL}/api/systems-compassion/scales`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.scales)).toBe(true);
    expect(data.scales.length).toBe(6);
  });

  it("should return daily compassion practice", async () => {
    const res = await fetch(`${BASE_URL}/api/systems-compassion/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
    expect(data.daily.practiceInstruction).toBeDefined();
  });
});

describe("Collective Intelligence API", () => {
  it("should return collective wisdom principles", async () => {
    const res = await fetch(`${BASE_URL}/api/collective-intelligence/principles`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.principles)).toBe(true);
    expect(data.principles.length).toBe(5);
  });

  it("should return wisdom synthesis methods", async () => {
    const res = await fetch(`${BASE_URL}/api/collective-intelligence/synthesis`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.methods)).toBe(true);
    expect(data.methods.length).toBe(5);
  });

  it("should return emergent intelligence patterns", async () => {
    const res = await fetch(`${BASE_URL}/api/collective-intelligence/emergence`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.phenomena)).toBe(true);
    expect(data.phenomena.length).toBe(4);
  });

  it("should return daily collective wisdom practice", async () => {
    const res = await fetch(`${BASE_URL}/api/collective-intelligence/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Wisdom Synthesis API", () => {
  it("should return pattern recognition frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom-synthesis/patterns`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.patterns)).toBe(true);
    expect(data.patterns.length).toBe(6);
  });

  it("should return wisdom themes", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom-synthesis/themes`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.themes)).toBe(true);
    expect(data.themes.length).toBe(8);
  });

  it("should return daily wisdom synthesis", async () => {
    const res = await fetch(`${BASE_URL}/api/wisdom-synthesis/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Cognitive Lab API", () => {
  it("should return mental models library", async () => {
    const res = await fetch(`${BASE_URL}/api/cognitive-lab/models`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.models)).toBe(true);
    expect(data.models.length).toBe(25);
  });

  it("should return thinking tools", async () => {
    const res = await fetch(`${BASE_URL}/api/cognitive-lab/tools`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.tools)).toBe(true);
    expect(data.tools.length).toBe(6);
  });

  it("should return cognitive biases", async () => {
    const res = await fetch(`${BASE_URL}/api/cognitive-lab/biases`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.biases)).toBe(true);
    expect(data.biases.length).toBe(10);
  });

  it("should return daily cognitive practice", async () => {
    const res = await fetch(`${BASE_URL}/api/cognitive-lab/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Contemplative API", () => {
  it("should return meditation practices", async () => {
    const res = await fetch(`${BASE_URL}/api/contemplative/meditation`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.practices)).toBe(true);
    expect(data.practices.length).toBe(8);
  });

  it("should return contemplative questions", async () => {
    const res = await fetch(`${BASE_URL}/api/contemplative/inquiry`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBe(5);
  });

  it("should return wisdom traditions", async () => {
    const res = await fetch(`${BASE_URL}/api/contemplative/traditions`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.traditions)).toBe(true);
    expect(data.traditions.length).toBe(6);
  });

  it("should return daily contemplative practice", async () => {
    const res = await fetch(`${BASE_URL}/api/contemplative/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
    expect(data.daily.morningPrompt).toBeDefined();
  });
});

describe("Ethical Reasoning API", () => {
  it("should return ethical frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/ethical-reasoning/frameworks`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(8);
  });

  it("should return moral reasoning tools", async () => {
    const res = await fetch(`${BASE_URL}/api/ethical-reasoning/tools`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.tools)).toBe(true);
    expect(data.tools.length).toBe(6);
  });

  it("should return ethical dilemmas", async () => {
    const res = await fetch(`${BASE_URL}/api/ethical-reasoning/dilemmas`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.dilemmas)).toBe(true);
    expect(data.dilemmas.length).toBe(5);
  });

  it("should return daily ethical practice", async () => {
    const res = await fetch(`${BASE_URL}/api/ethical-reasoning/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Existential API", () => {
  it("should return existential themes", async () => {
    const res = await fetch(`${BASE_URL}/api/existential/themes`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.themes)).toBe(true);
    expect(data.themes.length).toBe(6);
  });

  it("should return existential philosophers", async () => {
    const res = await fetch(`${BASE_URL}/api/existential/philosophers`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.philosophers)).toBe(true);
    expect(data.philosophers.length).toBe(7);
  });

  it("should return meaning sources", async () => {
    const res = await fetch(`${BASE_URL}/api/existential/meaning`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.sources)).toBe(true);
    expect(data.sources.length).toBe(8);
  });

  it("should return daily existential practice", async () => {
    const res = await fetch(`${BASE_URL}/api/existential/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Embodiment API", () => {
  it("should return somatic practices", async () => {
    const res = await fetch(`${BASE_URL}/api/embodiment/somatic`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.practices)).toBe(true);
    expect(data.practices.length).toBe(6);
  });

  it("should return nervous system states", async () => {
    const res = await fetch(`${BASE_URL}/api/embodiment/nervous-system`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.states)).toBe(true);
    expect(data.states.length).toBe(3);
  });

  it("should return regulation strategies", async () => {
    const res = await fetch(`${BASE_URL}/api/embodiment/regulation`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.strategies)).toBe(true);
    expect(data.strategies.length).toBe(6);
  });

  it("should return daily embodiment practice", async () => {
    const res = await fetch(`${BASE_URL}/api/embodiment/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Narrative API", () => {
  it("should return narrative frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/narrative/frameworks`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(6);
  });

  it("should return archetypal figures", async () => {
    const res = await fetch(`${BASE_URL}/api/narrative/archetypes`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.archetypes)).toBe(true);
    expect(data.archetypes.length).toBe(8);
  });

  it("should return daily narrative practice", async () => {
    const res = await fetch(`${BASE_URL}/api/narrative/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Relational API", () => {
  it("should return attachment styles", async () => {
    const res = await fetch(`${BASE_URL}/api/relational/attachment`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.styles)).toBe(true);
    expect(data.styles.length).toBe(4);
  });

  it("should return communication skills", async () => {
    const res = await fetch(`${BASE_URL}/api/relational/communication`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.skills)).toBe(true);
    expect(data.skills.length).toBe(6);
  });

  it("should return love languages", async () => {
    const res = await fetch(`${BASE_URL}/api/relational/love-languages`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.languages)).toBe(true);
    expect(data.languages.length).toBe(5);
  });

  it("should return daily relational practice", async () => {
    const res = await fetch(`${BASE_URL}/api/relational/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Values API", () => {
  it("should return core values", async () => {
    const res = await fetch(`${BASE_URL}/api/values/core`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.values)).toBe(true);
    expect(data.values.length).toBe(15);
  });

  it("should return purpose frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/values/purpose`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(4);
  });

  it("should return meaning sources", async () => {
    const res = await fetch(`${BASE_URL}/api/values/meaning`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.sources)).toBe(true);
    expect(data.sources.length).toBe(5);
  });

  it("should return daily values practice", async () => {
    const res = await fetch(`${BASE_URL}/api/values/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Neuro-Integration API", () => {
  it("should return affective neuroscience systems", async () => {
    const res = await fetch(`${BASE_URL}/api/neuro-integration/affective-systems`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.systems)).toBe(true);
    expect(data.systems.length).toBe(7);
  });

  it("should return neuroplasticity principles", async () => {
    const res = await fetch(`${BASE_URL}/api/neuro-integration/neuroplasticity`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.principles)).toBe(true);
    expect(data.principles.length).toBe(8);
  });

  it("should return daily neuro practice", async () => {
    const res = await fetch(`${BASE_URL}/api/neuro-integration/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Socio-Ecology API", () => {
  it("should return planetary ethics frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/socio-ecology/planetary-ethics`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(5);
  });

  it("should return regenerative futures visions", async () => {
    const res = await fetch(`${BASE_URL}/api/socio-ecology/regenerative`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.visions)).toBe(true);
    expect(data.visions.length).toBe(5);
  });

  it("should return daily socio-ecology practice", async () => {
    const res = await fetch(`${BASE_URL}/api/socio-ecology/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Praxis API", () => {
  it("should return execution frameworks", async () => {
    const res = await fetch(`${BASE_URL}/api/praxis/execution`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.frameworks)).toBe(true);
    expect(data.frameworks.length).toBe(6);
  });

  it("should return resistance patterns", async () => {
    const res = await fetch(`${BASE_URL}/api/praxis/resistance`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.patterns)).toBe(true);
    expect(data.patterns.length).toBe(6);
  });

  it("should return daily praxis practice", async () => {
    const res = await fetch(`${BASE_URL}/api/praxis/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});

describe("Post-Trauma API", () => {
  it("should return post-traumatic growth domains", async () => {
    const res = await fetch(`${BASE_URL}/api/post-trauma/growth-domains`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.domains)).toBe(true);
    expect(data.domains.length).toBe(5);
  });

  it("should return healing modalities", async () => {
    const res = await fetch(`${BASE_URL}/api/post-trauma/modalities`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.modalities)).toBe(true);
    expect(data.modalities.length).toBe(6);
  });

  it("should return daily post-trauma practice", async () => {
    const res = await fetch(`${BASE_URL}/api/post-trauma/daily`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.daily).toBeDefined();
  });
});
