import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROUTES_FILE = path.join(ROOT, "client", "src", "content", "allRoutes.json");
const OUT_FILE = path.join(ROOT, "client", "src", "content", "meta", "routeMeta.autogen.ts");
const LOCK_FILE = path.join(ROOT, "client", "src", "content", "meta", "routeMeta.lock.json");

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

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function main() {
  const routes = readJson(ROUTES_FILE, []);
  if (!Array.isArray(routes) || routes.length === 0) {
    console.error(`Missing or empty ${ROUTES_FILE}. Create it first.`);
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
  for (const canonicalPath of routes) {
    const rk = deriveRouteKeyFromPath(canonicalPath);
    if (lockedSet.has(rk)) continue;

    autogen[rk] = {
      canonicalPath,
      title: titleizeFromPath(canonicalPath),
      description: "A gentle, practical space to build supportive habits through reflection and skill practice.",
      benefits: DEFAULT_BENEFITS,
      internalLinks: [],
      modules: [],
    };
  }

  const lines = [];
  lines.push(`// AUTO-GENERATED FILE. DO NOT EDIT BY HAND.`);
  lines.push(`// Run: node scripts/gen-route-registry.mjs`);
  lines.push(`// To keep manual overrides, add routeKeys to routeMeta.lock.json`);
  lines.push(``);
  lines.push(`export const AUTOGEN_REGISTRY = ${JSON.stringify(autogen, null, 2)} as const;`);
  lines.push(``);

  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");
  console.log(`Wrote ${Object.keys(autogen).length} auto-generated entries -> ${OUT_FILE}`);
  console.log(`Locked (manual overrides preserved): ${lockedSet.size} entries`);
}

main();
