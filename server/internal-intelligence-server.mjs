/**
 * PHASE116Z43_INTERNAL_INTELLIGENCE_SERVER
 *
 * Internal Intelligence Server for MyMentalHealthBuddy + The Genuine Love Project.
 *
 * Purpose:
 * - Provides safe internal platform-status intelligence.
 * - Classifies visual, content, monetization, avatar, deployment, and completion gaps.
 * - Exposes deterministic JSON only.
 * - Does not expose secrets.
 * - Does not call external services.
 * - Does not mutate files.
 */

const PLATFORM_VERSION = "phase116z43";
const GENERATED_AT = new Date().toISOString();

const BRAND_SYSTEM = Object.freeze({
  name: "MyMentalHealthBuddy + The Genuine Love Project",
  mission: "Live in Genuine Love",
  palette: {
    serenitySage: "#8FBF9F",
    warmBlossomPink: "#F4C7C3",
    deepTeal: "#2F5D5D",
    ivoryLight: "#FAF9F7",
    charcoalDeep: "#3A3A3A",
    eternalGold: "#D4AF37",
  },
  typography: {
    heading: "Playfair Display or serif fallback",
    body: "Inter, Source Sans 3, or system sans fallback",
    mobileRule: "Use clamp() and protect buttons from oversized label overflow.",
  },
});

const GOVERNANCE_RULES = Object.freeze([
  {
    id: "visual-palette-cohesion",
    priority: "critical",
    classification: "visual-system",
    rule: "Replace red, orange, amber, random white panels, slate drift, and visible square avatar shells with brand-tokenized sage, teal, ivory, blossom, and gold surfaces.",
  },
  {
    id: "button-readability",
    priority: "critical",
    classification: "interaction",
    rule: "Every button must have visible text, sufficient contrast, rounded brand styling, hover/focus states, and a real route/action.",
  },
  {
    id: "mobile-typography-safety",
    priority: "critical",
    classification: "typography",
    rule: "Mobile headings and buttons must use bounded clamp sizes and avoid overflow.",
  },
  {
    id: "official-avatar-system",
    priority: "critical",
    classification: "avatar-intelligence",
    rule: "Exactly seven official avatars should render consistently, without duplicated carousel entries, visible red squares, or visible box backgrounds.",
  },
  {
    id: "deployment-pickup",
    priority: "critical",
    classification: "infrastructure",
    rule: "Local assets must match live assets before declaring completion. If stale, deploy latest source and verify root, health, JS, CSS, and target pages.",
  },
  {
    id: "monetization-alignment",
    priority: "high",
    classification: "business-system",
    rule: "Pricing, premium, onboarding, dashboard, and content value ladder must be aligned to user outcomes and client success.",
  },
  {
    id: "content-completion",
    priority: "high",
    classification: "content-system",
    rule: "Content modules must connect to matching components, calls-to-action, analytics, and completion pathways.",
  },
  {
    id: "continuous-evolution",
    priority: "high",
    classification: "automation",
    rule: "Platform should continuously audit design drift, route gaps, content gaps, monetization gaps, and deployment readiness.",
  },
]);

const COMPLETION_AREAS = Object.freeze([
  "deployment-health",
  "palette-cohesion",
  "button-link-integrity",
  "mobile-typography",
  "official-avatar-carousel",
  "dashboard-success-path",
  "wellness-content-path",
  "pricing-premium-path",
  "admin-content-generation",
  "analytics-readiness",
  "monetization-readiness",
  "client-success-readiness",
  "continuous-optimization",
]);

function buildPlatformStatus() {
  return {
    ok: true,
    service: "internal-intelligence-server",
    version: PLATFORM_VERSION,
    generatedAt: GENERATED_AT,
    status: "active",
    mode: "deterministic-read-only",
    brand: BRAND_SYSTEM,
    completionAreas: COMPLETION_AREAS,
    safeguards: [
      "No secrets exposed",
      "No file mutation from API",
      "No external calls",
      "No diagnosis claims without verification",
      "Designed for platform audit and guided execution",
    ],
  };
}

function buildRecommendations() {
  return {
    ok: true,
    service: "internal-intelligence-server",
    nextExecutionOrder: [
      {
        phase: "visual-drift-source-audit",
        goal: "Identify highest remaining live drift source after deployment pickup.",
        reason: "Current live checks show recurring red/orange/amber/white/square drift across admin and shared bundles.",
      },
      {
        phase: "avatar-carousel-proof",
        goal: "Verify seven unique official avatars, same size, transparent backgrounds, no duplicate entry.",
        reason: "User reports one avatar repeats and visible square/red shells remain.",
      },
      {
        phase: "button-route-integrity-audit",
        goal: "List all buttons and verify route/action presence.",
        reason: "User requested button labels visible and linked to correct components/content/processes.",
      },
      {
        phase: "monetization-path-audit",
        goal: "Verify pricing, premium, signup, dashboard, and user-success flow.",
        reason: "Platform success depends on coherent value ladder and conversion path.",
      },
      {
        phase: "content-component-map",
        goal: "Map content modules to pages, CTAs, analytics, and completion workflows.",
        reason: "Content and components must align from A to Z before final publication confidence.",
      },
    ],
  };
}

function classifySignal(signal = "") {
  const text = String(signal).toLowerCase();

  if (text.includes("red") || text.includes("orange") || text.includes("amber") || text.includes("palette")) {
    return "visual-palette-cohesion";
  }

  if (text.includes("button") || text.includes("link") || text.includes("route")) {
    return "button-readability";
  }

  if (text.includes("font") || text.includes("typography") || text.includes("mobile")) {
    return "mobile-typography-safety";
  }

  if (text.includes("avatar") || text.includes("lumi") || text.includes("square") || text.includes("carousel")) {
    return "official-avatar-system";
  }

  if (text.includes("deploy") || text.includes("stale") || text.includes("bundle") || text.includes("asset")) {
    return "deployment-pickup";
  }

  if (text.includes("premium") || text.includes("pricing") || text.includes("monetization")) {
    return "monetization-alignment";
  }

  return "continuous-evolution";
}

export function registerInternalIntelligenceServer(app) {
  if (!app || typeof app.get !== "function") {
    throw new Error("registerInternalIntelligenceServer requires an Express app instance");
  }

  app.get("/api/internal-intelligence/health", (_req, res) => {
    res.json({
      ok: true,
      service: "internal-intelligence-server",
      version: PLATFORM_VERSION,
      status: "healthy",
      generatedAt: new Date().toISOString(),
    });
  });

  app.get("/api/internal-intelligence/status", (_req, res) => {
    res.json(buildPlatformStatus());
  });

  app.get("/api/internal-intelligence/rules", (_req, res) => {
    res.json({
      ok: true,
      service: "internal-intelligence-server",
      rules: GOVERNANCE_RULES,
    });
  });

  app.get("/api/internal-intelligence/recommendations", (_req, res) => {
    res.json(buildRecommendations());
  });

  app.get("/api/internal-intelligence/classify", (req, res) => {
    const signal = req.query.signal || "";
    const ruleId = classifySignal(signal);
    const rule = GOVERNANCE_RULES.find((item) => item.id === ruleId);

    res.json({
      ok: true,
      service: "internal-intelligence-server",
      signal,
      classification: ruleId,
      rule,
    });
  });

  console.log("[internal-intelligence] registered /api/internal-intelligence/*");
}
