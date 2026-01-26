// client/src/content/meta/routeMetaRegistry.ts
export type ModuleKey = "mi" | "nlp" | "12practices";

export type InternalLink = { label: string; routeKey: string };

export type RouteMeta = {
  routeKey: string;
  canonicalPath?: string;
  title: string;
  description: string;
  benefits: string[];
  internalLinks?: InternalLink[];
  modules?: ModuleKey[];
  noIndex?: boolean;
};

function titleize(input: string) {
  const cleaned = input
    .replace(/^\/+/, "")
    .replace(/__+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function safeDefaultMeta(routeKey: string): RouteMeta {
  const pretty = titleize(routeKey);
  return {
    routeKey,
    title: pretty,
    description: "A gentle, practical space to build supportive habits through reflection and skill practice.",
    benefits: [
      "Practice one small, doable step (no pressure).",
      "Turn insight into a simple plan you can repeat.",
      "Use calm tools that support self-awareness and regulation.",
    ],
    modules: [], // opt-in only by registry entry
  };
}

/**
 * ✅ SINGLE SOURCE OF TRUTH
 * Add only “special” routes here.
 * Everything else gets a safe, non-repetitive default.
 */
const REGISTRY: Record<string, Partial<RouteMeta>> = {
  // Examples (edit freely)
  "hubs__anxiety": {
    canonicalPath: "/hubs/anxiety",
    title: "Anxiety Support Hub",
    description: "Build calm skills: grounding, reframing, and tiny steps you can actually do.",
    benefits: [
      "Reduce overwhelm with 2-minute nervous system resets.",
      "Name patterns gently and choose one next step.",
      "Practice thought-balancing without judging yourself.",
    ],
    internalLinks: [
      { label: "Try: Grounding", routeKey: "grounding" },
      { label: "Try: Reframe", routeKey: "tools__reframe" },
      { label: "Try: Breathwork", routeKey: "breathing" },
    ],
    modules: ["mi", "nlp"],
  },

  "paths__12-practices": {
    canonicalPath: "/paths/12-practices",
    title: "12 Practices: Mind–Body–Soul Growth",
    description: "A modern, non-substance 12-step-inspired path for gentle transformation.",
    benefits: [
      "Build inner stability through daily practice (not perfection).",
      "Use reflection + tiny actions to change patterns over time.",
      "Stay grounded in values, compassion, and accountability.",
    ],
    modules: ["12practices", "mi", "nlp"],
  },

  "tools__reframe": {
    canonicalPath: "/tools/reframe",
    title: "Reframe Tool",
    description: "Turn a hard moment into a kinder, steadier next step.",
    benefits: [
      "Name the thought → name the feeling → choose a balanced alternative.",
      "Reduce spirals with a short, structured flow.",
      "Leave with one tiny step you can do today.",
    ],
    modules: ["mi", "nlp"],
  },
};

export function getRouteMeta(routeKey: string): RouteMeta {
  const base = safeDefaultMeta(routeKey);

  const override = REGISTRY[routeKey];
  if (!override) return base;

  return {
    ...base,
    ...override,
    // ensure required arrays exist
    benefits: override.benefits?.length ? override.benefits : base.benefits,
    modules: override.modules ?? base.modules,
  };
}

/**
 * Deterministic routeKey generator.
 * ✅ stable across the app
 * ✅ zero manual work
 */
export function deriveRouteKeyFromPath(pathname: string) {
  const p = (pathname || "/").split("?")[0].split("#")[0].trim();
  const clean = p.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return "home";

  // "/hubs/self-worth" -> "hubs__self-worth"
  return clean
    .split("/")
    .filter(Boolean)
    .map(seg => seg.replace(/:/g, "param_"))
    .join("__");
}