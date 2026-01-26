// client/src/content/meta/routeMetaRegistry.ts

export type RouteMeta = {
  routeKey: string;
  title: string;
  description: string;
  benefits: string[];
  internalLinks: Array<{ label: string; href: string }>;
  noIndex?: boolean;
};

function titleCaseFromKey(key: string) {
  // hubs_self-worth -> Hubs · Self Worth
  const cleaned = key.replace(/[./]/g, "_").replace(/-+/g, "_");
  const parts = cleaned.split("_").filter(Boolean);
  return parts
    .map((p) =>
      p.length <= 3 ? p.toUpperCase() : p.charAt(0).toUpperCase() + p.slice(1)
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveRouteKeyFromPath(pathname: string) {
  // "/hubs/self-worth" -> "hubs_self-worth"
  // "/" -> "home"
  const p = (pathname || "/").split("?")[0].split("#")[0].trim();
  if (p === "/" || p === "") return "home";
  return p.replace(/^\/+/, "").replace(/\/+$/,"").replace(/\//g, "_");
}

export function deriveRouteKeyFromFilePath(filePath: string) {
  // "client/src/pages/generated/GriefHubPage.jsx" -> "generated_grief-hub-page"
  // Deterministic + stable across builds
  const normalized = filePath.replace(/\\/g, "/");
  const file = normalized.split("/").pop() || normalized;
  const base = file.replace(/\.(t|j)sx?$/, "");
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
  return `generated_${kebab}`;
}

/**
 * Minimal “benefits” fallback that stays legally safe:
 * - No therapy/diagnosis/treatment/cure/guarantee language.
 */
function defaultBenefits(routeKey: string): string[] {
  // Keep these short, varied, and “skills practice” oriented.
  const pool = [
    "Build gentle, repeatable wellness habits in minutes a day.",
    "Practice reflection tools that support emotional regulation skills.",
    "Turn insight into one small next step you can actually do today.",
    "Use clear prompts to reduce mental noise and regain focus.",
    "Track patterns over time to improve self-understanding.",
    "Strengthen boundaries and self-respect through guided practice."
  ];

  // Deterministic pick (no repetition across pages, stable)
  const hash = Array.from(routeKey).reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = (i: number) => pool[(hash + i) % pool.length];
  return [pick(0), pick(1), pick(2)];
}

function defaultInternalLinks(routeKey: string) {
  // Always give “next steps” (keeps users moving = better retention + SEO)
  return [
    { label: "Start Here", href: "/onboarding" },
    { label: "Daily Practice", href: "/today" },
    { label: "Tools", href: "/tools" },
    { label: "Hubs", href: "/hubs" }
  ];
}

/**
 * Registry entries for special/high-value routes (you can expand over time).
 * Everything else uses safe deterministic fallbacks.
 */
const registry: Record<string, Partial<RouteMeta>> = {
  home: {
    title: "The Genuine Love Project",
    description:
      "A calm, evidence-informed space for reflection, growth, and daily practice — built around genuine love, clarity, and consistency.",
    internalLinks: [
      { label: "Begin Your Healing Journey", href: "/onboarding" },
      { label: "What You Get", href: "/what-you-get" },
      { label: "Explore Hubs", href: "/hubs" },
      { label: "Try Tools", href: "/tools" }
    ]
  },

  "hubs_self-worth": {
    title: "Self-Worth Hub",
    description:
      "Tools and prompts to strengthen self-respect, reduce self-criticism, and build supportive inner language.",
    benefits: [
      "Practice healthier self-talk with simple reframes.",
      "Build boundaries that protect your energy and time.",
      "Create a steady sense of worth through daily micro-actions."
    ],
    internalLinks: [
      { label: "Boundaries Hub", href: "/hubs/boundaries" },
      { label: "Self-Compassion Hub", href: "/hubs/self-compassion" },
      { label: "Reframe Tool", href: "/tools/reframe" }
    ]
  }
};

export function getRouteMeta(routeKey: string): RouteMeta {
  const key = (routeKey || "home").trim() || "home";
  const overrides = registry[key] || {};

  const title = overrides.title || titleCaseFromKey(key);
  const description =
    overrides.description ||
    "A guided page for reflection and skill-building — designed to support your growth with calm structure and gentle next steps.";
  const benefits = overrides.benefits || defaultBenefits(key);
  const internalLinks = overrides.internalLinks || defaultInternalLinks(key);

  return {
    routeKey: key,
    title,
    description,
    benefits,
    internalLinks,
    noIndex: overrides.noIndex
  };
}