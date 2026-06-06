// client/src/content/routeMetaRegistry.js
import { titleFromRouteKey } from "./routeKey";

// Keep bullets legally safe: educational + self-reflection + skills practice.
// No therapy/diagnosis/treatment/is designed to support.
const DEFAULT_BENEFITS = [
  "Practice a small, realistic next step you can repeat.",
  "Build self-awareness through gentle reflection prompts.",
  "Strengthen daily habits that support steadiness and clarity.",
];

const DEFAULT_DESCRIPTION =
  "A calm, evidence-informed space for self-reflection and skill-building through genuine love.";

const META = {
  // Examples (add only the ones you want to be custom; everything else auto-falls back)
  "hubs/sleep": {
    title: "Sleep Support Hub",
    description: "Wind down with gentle routines, thought-lightening tools, and steady sleep-friendly habits.",
    benefits: [
      "Create a simple wind-down routine you can actually keep.",
      "Reduce mental noise with a short reframe + release practice.",
      "Track what helps your sleep without pressure or perfection.",
    ],
    internalLinks: ["hubs/stress", "breathing", "grounding"],
    modules: ["nlp"], // optional
  },

  "tools/reframe": {
    title: "Reframe Tool",
    description: "Shift from stuck thoughts into kinder, truer alternatives—one step at a time.",
    benefits: [
      "Name the thought, name the feeling, and choose a balanced alternative.",
      "Build a repeatable pattern for calmer self-talk.",
      "End with a tiny commitment you can complete today.",
    ],
    internalLinks: ["hubs/self-worth", "hubs/confidence", "breathing"],
    modules: ["mi", "nlp"],
  },

  "paths/12-practices": {
    title: "12 Practices",
    description: "A modern, non-substance transformation path for mind, body, and soul—built as daily practices.",
    benefits: [
      "Turn growth into daily practices instead of vague goals.",
      "Create repair, boundaries, and meaning with gentle structure.",
      "Build integrity with a kind daily review (no shame).",
    ],
    internalLinks: ["journal", "hubs/self-care", "hubs/inner-work"],
    modules: ["12practices"],
  },
};

function uniq(arr) {
  return Array.from(new Set((arr || []).filter(Boolean)));
}

export function getRouteMeta(routeKey) {
  const key = String(routeKey || "").trim() || "home";
  const base = META[key] || {};

  const title = base.title || titleFromRouteKey(key);
  const description = base.description || DEFAULT_DESCRIPTION;

  const benefits = uniq((base.benefits && base.benefits.length ? base.benefits : DEFAULT_BENEFITS));
  const internalLinks = uniq(base.internalLinks || []);
  const modules = uniq(base.modules || []);

  return { routeKey: key, title, description, benefits, internalLinks, modules };
}

export function setRouteMeta(routeKey, patch) {
  // optional helper if you ever want runtime additions (safe no-op usage)
  META[routeKey] = { ...(META[routeKey] || {}), ...(patch || {}) };
  return META[routeKey];
}