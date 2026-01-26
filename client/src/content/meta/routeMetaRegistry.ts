// client/src/content/meta/routeMetaRegistry.ts

export type ModuleKey = "mi" | "nlp" | "12practices";

export type InternalLink = {
  label: string;
  routeKey: string; // <-- routeKey ONLY (no raw paths)
};

export type RouteMeta = {
  routeKey: string;
  canonicalPath: string; // <-- single source of truth for URL
  title: string;
  description: string;
  benefits: string[];
  internalLinks: InternalLink[];
  modules: ModuleKey[]; // opt-in modules
};

function titleizeFromRouteKey(routeKey: string) {
  const cleaned = String(routeKey || "")
    .replace(/^home$/, "home")
    .replace(/__+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\bparam\b/gi, "")
    .trim();

  const base = cleaned || "The Genuine Love Project";
  return base
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferPathFromRouteKey(routeKey: string) {
  const key = String(routeKey || "").trim();
  if (!key || key === "home") return "/";

  // convert routeKey back into path:
  // hubs__anxiety -> /hubs/anxiety
  // blog__param_slug -> /blog/:slug
  const path = key
    .split("__")
    .filter(Boolean)
    .map((seg) => seg.replace(/^param_/, ":"))
    .join("/");

  return "/" + path;
}

function safeDefaultMeta(routeKey: string): RouteMeta {
  const pretty = titleizeFromRouteKey(routeKey);
  return {
    routeKey,
    canonicalPath: inferPathFromRouteKey(routeKey),
    title: pretty,
    description: "Supportive, evidence-informed tools — one small step at a time.",
    benefits: [
      "Choose one tiny, doable next step (no pressure).",
      "Turn insight into a simple plan you can repeat.",
      "Use calm tools that support self-awareness and regulation.",
    ],
    internalLinks: [],
    modules: [],
  };
}

/**
 * ✅ SINGLE SOURCE OF TRUTH
 * Add only special routes here.
 * Everything else gets a safe non-repetitive default.
 */
const REGISTRY: Record<string, Partial<RouteMeta>> = {
  // EXAMPLE (keep/edit):
  hubs__anxiety: {
    canonicalPath: "/hubs/anxiety",
    title: "Anxiety Support Hub",
    description: "Build calm skills: grounding, reframing, breathwork, and tiny steps you can actually do.",
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
    title: "12 Practices: Mind-Body-Soul Growth",
    description: "A modern, gentle 12-step-inspired path for sustainable growth.",
    benefits: [
      "Build inner stability through daily practice (not perfection).",
      "Use reflection + tiny actions to change patterns over time.",
      "Stay grounded in values, compassion, and accountability.",
    ],
    modules: ["12practices", "mi", "nlp"],
    internalLinks: [
      { label: "Start: Tiny Step", routeKey: "tools__reframe" },
      { label: "Support: Anxiety Hub", routeKey: "hubs__anxiety" },
    ],
  },

  tools__reframe: {
    canonicalPath: "/tools/reframe",
    title: "Reframe Tool",
    description: "Turn a hard moment into a kinder, steadier next step.",
    benefits: [
      "Name the thought → name the feeling → choose a balanced alternative.",
      "Reduce spirals with a short, structured flow.",
      "Leave with one tiny step you can do today.",
    ],
    modules: ["mi", "nlp"],
    internalLinks: [
      { label: "Next: Grounding", routeKey: "grounding" },
      { label: "Explore: 12 Practices", routeKey: "paths__12-practices" },
    ],
  },
};

export function deriveRouteKeyFromPath(pathname: string) {
  const p = (pathname || "/").split("?")[0].split("#")[0].trim();
  const clean = p.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return "home";

  // "/hubs/self-worth" -> "hubs__self-worth"
  // "/blog/:slug" -> "blog__param_slug" (if you ever pass pattern paths)
  return clean
    .split("/")
    .filter(Boolean)
    .map((seg) => (seg.startsWith(":") ? seg.replace(":", "param_") : seg))
    .join("__");
}

export function getRouteMeta(routeKey: string): RouteMeta {
  const key = String(routeKey || "home").trim() || "home";
  const base = safeDefaultMeta(key);
  const override = REGISTRY[key] || {};

  // Ensure canonicalPath always exists (registry wins, otherwise inferred)
  const canonicalPath = override.canonicalPath || base.canonicalPath;

  return {
    ...base,
    ...override,
    routeKey: key,
    canonicalPath,
    benefits: override.benefits || base.benefits,
    internalLinks: override.internalLinks || base.internalLinks,
    modules: override.modules || base.modules,
  };
}

export function resolveRoutePath(routeKey: string) {
  return getRouteMeta(routeKey).canonicalPath;
}

/**
 * For UI blocks that want ready-to-use hrefs.
 */
export function resolveInternalLinks(routeKey: string) {
  const meta = getRouteMeta(routeKey);
  return (meta.internalLinks || []).map((l) => ({
    ...l,
    href: resolveRoutePath(l.routeKey),
  }));
}