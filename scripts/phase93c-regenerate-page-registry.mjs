import fs from "node:fs";

fs.mkdirSync("docs/architecture", { recursive: true });
fs.mkdirSync("client/public", { recursive: true });
fs.mkdirSync("diagnostics/phase93c", { recursive: true });

const app = fs.readFileSync("client/src/App.jsx", "utf8");
const today = new Date().toISOString().slice(0, 10);
const siteUrl = process.env.PUBLIC_SITE_URL || process.env.VITE_PUBLIC_SITE_URL || "https://mymentalhealthbuddy.com";

const routes = [
  ["/", "Home", "PUBLIC", "P0", "Primary landing page"],
  ["/pricing", "Pricing", "BUSINESS", "P0", "Subscription conversion"],
  ["/premium", "Premium", "BUSINESS", "P0", "Premium value explanation"],
  ["/safety", "Safety", "GOVERNANCE", "P0", "User safety and crisis boundary clarity"],
  ["/privacy", "Privacy", "LEGAL", "P0", "Privacy policy"],
  ["/terms", "Terms", "LEGAL", "P0", "Terms of service"],
  ["/glossary", "Glossary", "SEO_CONTENT", "P1", "Plain-language wellness definitions"],
  ["/wellness-glossary", "Wellness Glossary", "SEO_CONTENT", "P1", "Searchable wellness education glossary"],
  ["/research-evidence", "Research and Evidence", "SEO_CONTENT", "P1", "Trust, evidence, and educational credibility"],
  ["/professional-resources", "Professional Resources", "SEO_CONTENT", "P1", "Resources for providers and professionals"],
  ["/how-to-guides", "How-To Guides", "SEO_CONTENT", "P1", "Practical wellness guide hub"],
  ["/qa", "Q&A", "SEO_CONTENT", "P1", "Educational questions and answers"],
  ["/examples", "Examples", "SEO_CONTENT", "P1", "Concrete examples for comprehension"],
  ["/health", "Health", "SEO_CONTENT", "P1", "General health and wellness education"],
  ["/calming-scenes", "Calming Scenes", "SEO_CONTENT", "P1", "Calming visual wellness experience"],
];

const registry = routes.map(([path, title, domain, priority, intent]) => ({
  path,
  title,
  domain,
  priority,
  intent,
  sitemap: true,
  presentInApp: path === "/" ? app.includes('path="/"') || app.includes("index") : app.includes(`path="${path}"`) || app.includes(`path='${path}'`),
}));

const missing = registry.filter((route) => !route.presentInApp);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${registry.filter((route) => route.presentInApp).map((route) => `  <url>
    <loc>${siteUrl}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.priority === "P0" ? "weekly" : "monthly"}</changefreq>
    <priority>${route.priority === "P0" ? "0.9" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const md = [
  "# Canonical Page Registry",
  "",
  "| Path | Title | Domain | Priority | Present In App | Sitemap | Intent |",
  "|---|---|---:|---:|---:|---:|---|",
  ...registry.map((route) => `| ${route.path} | ${route.title} | ${route.domain} | ${route.priority} | ${route.presentInApp ? "YES" : "NO"} | YES | ${route.intent} |`),
  "",
  "## Missing From App.jsx",
  "",
  ...(missing.length ? missing.map((route) => `- ${route.path}`) : ["None"]),
  "",
].join("\n");

fs.writeFileSync("docs/architecture/CANONICAL_PAGE_REGISTRY.md", md);
fs.writeFileSync("docs/architecture/canonical-page-registry.json", JSON.stringify(registry, null, 2));
fs.writeFileSync("client/public/sitemap.xml", sitemap);
fs.writeFileSync("client/public/robots.txt", robots);
fs.writeFileSync("diagnostics/phase93c/canonical-page-registry.json", JSON.stringify(registry, null, 2));
fs.writeFileSync("diagnostics/phase93c/registry-summary.json", JSON.stringify({ siteUrl, missing, total: registry.length }, null, 2));

console.log(JSON.stringify({ siteUrl, missing, total: registry.length }, null, 2));

if (missing.length) process.exit(1);
