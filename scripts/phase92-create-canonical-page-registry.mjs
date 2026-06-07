import fs from "node:fs";

const outDir = "diagnostics/phase92";
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync("docs/architecture", { recursive: true });
fs.mkdirSync("client/public", { recursive: true });

const appPath = "client/src/App.jsx";
const appSource = fs.existsSync(appPath) ? fs.readFileSync(appPath, "utf8") : "";

const canonicalRoutes = [
  {
    path: "/",
    title: "Home",
    domain: "PUBLIC",
    intent: "Primary landing page",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/pricing",
    title: "Pricing",
    domain: "BUSINESS",
    intent: "Subscription conversion",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/premium",
    title: "Premium",
    domain: "BUSINESS",
    intent: "Premium value explanation",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/safety",
    title: "Safety",
    domain: "GOVERNANCE",
    intent: "User safety and crisis boundary clarity",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/privacy",
    title: "Privacy",
    domain: "LEGAL",
    intent: "Privacy policy",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/terms",
    title: "Terms",
    domain: "LEGAL",
    intent: "Terms of service",
    priority: "P0",
    sitemap: true,
  },
  {
    path: "/glossary",
    title: "Glossary",
    domain: "SEO_CONTENT",
    intent: "Plain-language wellness definitions",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/wellness-glossary",
    title: "Wellness Glossary",
    domain: "SEO_CONTENT",
    intent: "Searchable wellness education glossary",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/research-evidence",
    title: "Research and Evidence",
    domain: "SEO_CONTENT",
    intent: "Trust, evidence, and educational credibility",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/professional-resources",
    title: "Professional Resources",
    domain: "SEO_CONTENT",
    intent: "Resources for providers and professionals",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/how-to-guides",
    title: "How-To Guides",
    domain: "SEO_CONTENT",
    intent: "Practical wellness guide hub",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/qa",
    title: "Q&A",
    domain: "SEO_CONTENT",
    intent: "Educational questions and answers",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/examples",
    title: "Examples",
    domain: "SEO_CONTENT",
    intent: "Concrete examples for comprehension",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/health",
    title: "Health",
    domain: "SEO_CONTENT",
    intent: "General health and wellness education",
    priority: "P1",
    sitemap: true,
  },
  {
    path: "/calming-scenes",
    title: "Calming Scenes",
    domain: "SEO_CONTENT",
    intent: "Calming visual wellness experience",
    priority: "P1",
    sitemap: true,
  },
];

const registry = canonicalRoutes.map((route) => ({
  ...route,
  presentInApp: appSource.includes(`path="${route.path}"`) || appSource.includes(`path='${route.path}'`),
}));

const missing = registry.filter((route) => !route.presentInApp);
const duplicatePaths = [...new Set(registry.map((route) => route.path).filter((path, index, arr) => arr.indexOf(path) !== index))];

const today = new Date().toISOString().slice(0, 10);
const siteUrl = process.env.PUBLIC_SITE_URL || process.env.VITE_PUBLIC_SITE_URL || "https://mymentalhealthbuddy.com";

const sitemapUrls = registry
  .filter((route) => route.sitemap && route.presentInApp)
  .map((route) => `  <url>
    <loc>${siteUrl}${route.path === "/" ? "" : route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.priority === "P0" ? "weekly" : "monthly"}</changefreq>
    <priority>${route.priority === "P0" ? "0.9" : "0.7"}</priority>
  </url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const md = [
  "# Canonical Page Registry",
  "",
  "## Purpose",
  "This file defines the canonical public and SEO/content page registry for route governance, sitemap generation, and zero-drift page ownership.",
  "",
  "## Rules",
  "- One canonical route path per user-facing page.",
  "- No duplicate route ownership.",
  "- SEO/content pages must remain educational and non-clinical.",
  "- Healing content must preserve crisis/safety boundaries.",
  "- Business conversion pages must not influence healing workflows.",
  "",
  "## Registered Pages",
  "",
  "| Path | Title | Domain | Priority | Present In App | Sitemap | Intent |",
  "|---|---|---:|---:|---:|---:|---|",
  ...registry.map((route) => `| ${route.path} | ${route.title} | ${route.domain} | ${route.priority} | ${route.presentInApp ? "YES" : "NO"} | ${route.sitemap ? "YES" : "NO"} | ${route.intent} |`),
  "",
  "## Missing From App.jsx",
  "",
  ...(missing.length ? missing.map((route) => `- ${route.path}`) : ["None"]),
  "",
  "## Duplicate Registry Paths",
  "",
  ...(duplicatePaths.length ? duplicatePaths.map((path) => `- ${path}`) : ["None"]),
  "",
].join("\n");

fs.writeFileSync("docs/architecture/CANONICAL_PAGE_REGISTRY.md", md);
fs.writeFileSync("docs/architecture/canonical-page-registry.json", JSON.stringify(registry, null, 2));
fs.writeFileSync("client/public/sitemap.xml", sitemap);
fs.writeFileSync("client/public/robots.txt", robots);
fs.writeFileSync(`${outDir}/canonical-page-registry.json`, JSON.stringify(registry, null, 2));
fs.writeFileSync(`${outDir}/canonical-page-registry.md`, md);
fs.writeFileSync(`${outDir}/sitemap.xml`, sitemap);
fs.writeFileSync(`${outDir}/robots.txt`, robots);

const summary = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  totalRoutes: registry.length,
  presentRoutes: registry.filter((route) => route.presentInApp).length,
  missingRoutes: missing.map((route) => route.path),
  duplicatePaths,
  sitemapUrlCount: registry.filter((route) => route.sitemap && route.presentInApp).length,
};

fs.writeFileSync(`${outDir}/registry-summary.json`, JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));

if (missing.length > 0 || duplicatePaths.length > 0) {
  process.exit(1);
}
