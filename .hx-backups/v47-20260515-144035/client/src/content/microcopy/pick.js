// @generated
// /content/microcopy/pick.js
// Deterministic hash-based picker for route-specific microcopy

export function hashString(input = "") {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

export function pickByRoute(route, list, salt = "") {
  if (!Array.isArray(list) || list.length === 0) return "";
  const idx = hashString(`${route}::${salt}`) % list.length;
  return list[idx];
}
