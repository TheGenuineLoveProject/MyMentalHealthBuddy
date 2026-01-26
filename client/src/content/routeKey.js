// client/src/content/routeKey.js
export function normalizePathname(pathname = "/") {
  let p = String(pathname || "/").trim();
  if (!p.startsWith("/")) p = "/" + p;
  // drop query/hash
  p = p.split("?")[0].split("#")[0];
  // normalize trailing slash
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

export function routeKeyFromPathname(pathname = "/") {
  const p = normalizePathname(pathname);
  if (p === "/") return "home";
  // routeKey is stable + deterministic: "hubs/sleep" etc
  return p.replace(/^\//, "");
}

export function routeKeyFromFilename(filePath = "") {
  // deterministic for generated pages: "GuidedJournalingPage.tsx" -> "guided-journaling"
  const base = String(filePath).split("/").pop() || "";
  const noExt = base.replace(/\.(t|j)sx?$/i, "");
  const stripPage = noExt.replace(/Page$/i, "");
  const kebab = stripPage
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
  return kebab || "page";
}

export function titleFromRouteKey(routeKey = "") {
  const s = String(routeKey || "")
    .replace(/^hubs\//, "")
    .replace(/[\/\-]+/g, " ")
    .trim();
  if (!s) return "The Genuine Love Project";
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}