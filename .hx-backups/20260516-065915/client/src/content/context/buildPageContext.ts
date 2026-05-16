interface PageContext {
  title: string;
  description: string;
  category?: string;
  benefitKeys: string[];
  relatedRoutes: string[];
  noIndex?: boolean;
}

const routeContextMap: Record<string, PageContext> = {
  "/": {
    title: "The Genuine Love Project — Wellness Tools",
    description: "Educational wellness tools for self-reflection and personal growth. Adults 18+.",
    category: "landing",
    benefitKeys: ["agency", "calm", "clarity"],
    relatedRoutes: ["/dashboard", "/wellness", "/tools"]
  },
  "/dashboard": {
    title: "Dashboard — The Genuine Love Project",
    description: "Your personal wellness dashboard. Track your journey and access your tools.",
    category: "core",
    benefitKeys: ["progress", "awareness", "consistency"],
    relatedRoutes: ["/journal", "/mood", "/analytics"]
  },
  "/wellness": {
    title: "Wellness Hub — The Genuine Love Project",
    description: "Explore evidence-informed wellness practices and self-reflection tools.",
    category: "wellness",
    benefitKeys: ["balance", "resilience", "selfCare"],
    relatedRoutes: ["/tools", "/breathing", "/meditation"]
  },
  "/tools": {
    title: "Wellness Tools — The Genuine Love Project",
    description: "Practical tools for emotional wellness, stress relief, and personal growth.",
    category: "tools",
    benefitKeys: ["practical", "actionable", "supportive"],
    relatedRoutes: ["/breathing", "/grounding", "/affirmations"]
  },
  "/journal": {
    title: "Journal — The Genuine Love Project",
    description: "A private space for reflection and self-discovery through writing.",
    category: "core",
    benefitKeys: ["clarity", "processing", "insight"],
    relatedRoutes: ["/guided-journaling", "/mood", "/dashboard"]
  },
  "/mood": {
    title: "Mood Tracker — The Genuine Love Project",
    description: "Notice patterns in your emotional states over time.",
    category: "core",
    benefitKeys: ["awareness", "patterns", "understanding"],
    relatedRoutes: ["/state", "/analytics", "/journal"]
  },
  "/breathing": {
    title: "Breathing Exercises — The Genuine Love Project",
    description: "Gentle breathing practices to support nervous system regulation.",
    category: "wellness",
    benefitKeys: ["calm", "grounding", "presence"],
    relatedRoutes: ["/grounding", "/meditation", "/stress-response"]
  },
  "/meditation": {
    title: "Meditation Guide — The Genuine Love Project",
    description: "Guided meditation practices for mindfulness and inner peace.",
    category: "wellness",
    benefitKeys: ["stillness", "awareness", "peace"],
    relatedRoutes: ["/breathing", "/calming-scenes", "/mindfulness"]
  },
  "/crisis": {
    title: "Crisis Resources — The Genuine Love Project",
    description: "Immediate support resources and crisis helplines.",
    category: "support",
    benefitKeys: ["safety", "support", "help"],
    relatedRoutes: ["/", "/grounding"],
    noIndex: false
  }
};

const categoryDefaults: Record<string, Partial<PageContext>> = {
  landing: {
    benefitKeys: ["agency", "calm", "clarity"],
    relatedRoutes: ["/dashboard", "/wellness"]
  },
  core: {
    benefitKeys: ["progress", "awareness", "consistency"],
    relatedRoutes: ["/dashboard", "/journal"]
  },
  wellness: {
    benefitKeys: ["balance", "resilience", "selfCare"],
    relatedRoutes: ["/wellness", "/tools"]
  },
  tools: {
    benefitKeys: ["practical", "actionable", "supportive"],
    relatedRoutes: ["/tools", "/wellness"]
  },
  support: {
    benefitKeys: ["safety", "support", "help"],
    relatedRoutes: ["/crisis", "/"]
  }
};

export function buildPageContext(routeKey: string): PageContext {
  const existing = routeContextMap[routeKey];
  if (existing) {
    return existing;
  }

  const routeName = routeKey.replace(/^\//, "").replace(/-/g, " ");
  const titleCase = routeName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Page";

  return {
    title: `${titleCase} — The Genuine Love Project`,
    description: `Explore ${routeName || "wellness"} tools and practices. Educational content for adults 18+.`,
    category: "wellness",
    benefitKeys: ["agency", "calm", "clarity"],
    relatedRoutes: ["/wellness", "/tools", "/dashboard"],
    noIndex: false
  };
}

export function getRelatedRoutes(routeKey: string): string[] {
  const context = buildPageContext(routeKey);
  return context.relatedRoutes;
}

export function getCategoryDefaults(category: string): Partial<PageContext> {
  return categoryDefaults[category] || categoryDefaults.wellness;
}
