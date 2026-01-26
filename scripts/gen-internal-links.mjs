import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROUTES_FILE = path.join(ROOT, "client", "src", "content", "allRoutes.json");
const OUT_FILE = path.join(ROOT, "client", "src", "content", "meta", "routeMeta.autogen.ts");
const LOCK_FILE = path.join(ROOT, "client", "src", "content", "meta", "routeMeta.lock.json");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function deriveRouteKeyFromPath(p) {
  const clean = (p || "/")
    .split("?")[0]
    .split("#")[0]
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!clean) return "home";
  return clean
    .split("/")
    .filter(Boolean)
    .map((seg) => (seg.startsWith(":") ? seg.replace(":", "param_") : seg))
    .join("__");
}

function titleizeFromPath(p) {
  const clean = (p || "/")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!clean) return "Home";
  return clean
    .split("/")
    .filter(Boolean)
    .map((s) => s.replace(/[-_]+/g, " "))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" - ");
}

function categoryFromPath(p) {
  if (!p || p === "/") return "home";
  if (p.startsWith("/hubs/")) return "hub";
  if (p.startsWith("/tools/")) return "tool";
  if (p.startsWith("/paths/")) return "path";
  if (p.startsWith("/practices/")) return "practice";
  if (p.startsWith("/wellness/")) return "wellness";
  return "page";
}

function pickNextLinks({ canonicalPath, allPaths }) {
  const rk = deriveRouteKeyFromPath(canonicalPath);
  const cat = categoryFromPath(canonicalPath);

  const hubs = allPaths.filter((p) => p.startsWith("/hubs/"));
  const tools = allPaths.filter((p) => p.startsWith("/tools/"));
  const paths = allPaths.filter((p) => p.startsWith("/paths/"));

  const toLink = (p, label) => ({ label, routeKey: deriveRouteKeyFromPath(p) });

  const hubDefault = hubs[0] || "/hubs/anxiety";
  const tool1 = tools.find(t => t.includes("reframe")) || tools[0] || "/tools/reframe";
  const tool2 = tools.find(t => t.includes("grounding")) || tools[1] || tools[0] || "/tools/values";
  const path1 = paths[0] || "/paths/12-practices";

  if (cat === "hub") {
    return [
      toLink(tool1, "Try: Reframe Tool"),
      toLink(tool2, "Try: Another Tool"),
      toLink(path1, "Explore: 12 Practices"),
    ].filter((l) => l.routeKey !== rk);
  }

  if (cat === "tool") {
    return [
      toLink(hubDefault, "Return to Hub"),
      toLink(tool2, "Try Another Tool"),
      toLink(path1, "Build a Path"),
    ].filter((l) => l.routeKey !== rk);
  }

  if (cat === "path" || cat === "practice") {
    return [
      toLink(hubDefault, "Start at a Hub"),
      toLink(tool1, "Use a Tool"),
      toLink(tool2, "Add a Second Tool"),
    ].filter((l) => l.routeKey !== rk);
  }

  if (cat === "wellness") {
    return [
      toLink(hubDefault, "Explore a Hub"),
      toLink(tool1, "Try: Reframe Tool"),
      toLink(path1, "Explore: 12 Practices"),
    ].filter((l) => l.routeKey !== rk);
  }

  return [
    toLink(hubDefault, "Start at a Hub"),
    toLink(tool1, "Try: Reframe Tool"),
    toLink(path1, "Explore: 12 Practices"),
  ].filter((l) => l.routeKey !== rk);
}

function main() {
  const allRoutes = readJson(ROUTES_FILE, []);
  if (!Array.isArray(allRoutes) || allRoutes.length === 0) {
    console.error(`Missing/empty ${ROUTES_FILE}. Add canonical paths first.`);
    process.exit(1);
  }

  const locked = readJson(LOCK_FILE, { locked: [] });
  const lockedSet = new Set((locked.locked || []).map(String));

  const DEFAULT_BENEFITS = [
    "Practice one small, doable step (no pressure).",
    "Turn insight into a simple plan you can repeat.",
    "Use calm tools that support self-awareness and regulation.",
  ];

  const autogen = {};
  for (const canonicalPath of allRoutes) {
    const routeKey = deriveRouteKeyFromPath(canonicalPath);
    if (lockedSet.has(routeKey)) continue;

    const suggestedLinks = pickNextLinks({ canonicalPath, allPaths: allRoutes }).slice(0, 3);

    autogen[routeKey] = {
      canonicalPath,
      title: titleizeFromPath(canonicalPath),
      description: "A gentle, practical space to build supportive habits through reflection and skill practice.",
      benefits: DEFAULT_BENEFITS,
      internalLinks: suggestedLinks,
      modules: [],
    };
  }

  const lines = [];
  lines.push(`// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.`);
  lines.push(`// Run: node scripts/gen-route-registry.mjs`);
  lines.push(`// Run: node scripts/gen-internal-links.mjs`);
  lines.push(`// Manual overrides live in routeMetaRegistry.ts (MANUAL_REGISTRY).`);
  lines.push(`// To protect a route from autogen, add its routeKey to routeMeta.lock.json`);
  lines.push(``);
  lines.push(`export const AUTOGEN_REGISTRY = ${JSON.stringify(autogen, null, 2)} as const;`);
  lines.push(``);

  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
  console.log(`Wrote internalLinks for ${Object.keys(autogen).length} routes -> ${OUT_FILE}`);
}

main();
