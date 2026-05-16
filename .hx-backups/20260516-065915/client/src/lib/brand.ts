import { BRAND } from "@shared/brand.mjs";

export { BRAND };

export function applyBrandToDocument(): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  root.style.setProperty("--gl-primary", BRAND.colors.primary);
  root.style.setProperty("--gl-secondary", BRAND.colors.secondary);
  root.style.setProperty("--gl-accent", BRAND.colors.accent);
  root.style.setProperty("--gl-gold", BRAND.colors.gold);
  root.style.setProperty("--gl-bg", BRAND.colors.background);
  root.style.setProperty("--gl-text", BRAND.colors.text);

  document.title = BRAND.seo?.title || BRAND.name;

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", BRAND.seo.description);

  const ensureMeta = (name: string, content: string): void => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  ensureMeta("description", BRAND.seo?.description || BRAND.mission);
}

export const applyBrand = applyBrandToDocument;
