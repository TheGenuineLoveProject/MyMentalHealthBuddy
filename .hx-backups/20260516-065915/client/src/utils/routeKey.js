// client/src/utils/routeKey.js

function kebab(s) {
  return String(s || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")     // camelCase -> kebab
    .replace(/[_\s]+/g, "-")                   // underscores/spaces -> -
    .replace(/[^a-zA-Z0-9/-]+/g, "-")          // clean weird chars
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/**
 * Deterministic routeKey from a route path.
 * - "/" -> "home"
 * - "/hubs/self-worth" -> "hubs/self-worth"
 * - "/tools/reframe/" -> "tools/reframe"
 */
export function routeKeyFromRoute(route) {
  const raw = String(route || "").trim();
  if (!raw || raw === "/") return "home";
  const cleaned = raw.replace(/^\/+/, "").replace(/\/+$/, "");
  return kebab(cleaned);
}

/**
 * Deterministic routeKey from a file path (generated pages / import.meta.glob paths).
 * Example:
 *  "client/src/pages/hubs/SelfWorthHubPage.jsx" -> "hubs/self-worth-hub"
 *
 * Rules:
 * - strips folders up to "/pages/"
 * - strips extension
 * - strips trailing "Page" suffix
 */
export function routeKeyFromFilePath(filePath) {
  const p = String(filePath || "");
  const afterPages = p.includes("/pages/") ? p.split("/pages/")[1] : p;
  const noExt = afterPages.replace(/\.[a-zA-Z0-9]+$/, "");
  const parts = noExt.split("/").filter(Boolean);

  // last segment is filename
  const filename = parts.pop() || "unknown";
  const withoutSuffix = filename.replace(/Page$/i, "");

  const folder = parts.join("/");
  const key = folder ? `${folder}/${withoutSuffix}` : withoutSuffix;

  return kebab(key);
}