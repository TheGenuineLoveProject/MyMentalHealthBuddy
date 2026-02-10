// server/routes/feed.mjs
// RSS feed generation

import { Router } from "express";
import { logger } from "../utils/logger.mjs";

const router = Router();

const SITE_URL = process.env.SITE_URL || "https://genuineloveproject.com";
const SITE_NAME = "The Genuine Love Project";
const SITE_DESCRIPTION = "AI-powered mental wellness platform for self-love, healing, and emotional growth";

function escapeXml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRFC822(date) {
  return new Date(date).toUTCString();
}

router.get("/feed.xml", async (req, res) => {
  try {
    const items = [
      {
        title: "Welcome to Your Wellness Journey",
        description: "Discover tools and practices for emotional growth and healing.",
        link: `${SITE_URL}/welcome`,
        pubDate: new Date("2025-01-01"),
        category: "Beginner",
      },
      {
        title: "Understanding Your Emotions",
        description: "Learn to recognize and work with your emotional patterns.",
        link: `${SITE_URL}/emotions`,
        pubDate: new Date("2025-01-15"),
        category: "Beginner",
      },
      {
        title: "Building Healthy Boundaries",
        description: "Practical strategies for creating and maintaining boundaries.",
        link: `${SITE_URL}/boundaries`,
        pubDate: new Date("2025-01-20"),
        category: "Intermediate",
      },
    ];

    const rssItems = items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${formatRFC822(item.pubDate)}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
    </item>`
      )
      .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRFC822(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(rss);
  } catch (error) {
    logger.error("RSS generation error:", { error: error?.message || error });
    res.status(500).send("Error generating RSS feed");
  }
});

router.get("/sitemap.xml", async (req, res) => {
  try {
    const staticPages = [
      { loc: "/", priority: "1.0", changefreq: "daily" },
      { loc: "/crisis", priority: "1.0", changefreq: "monthly" },
      { loc: "/tools", priority: "0.9", changefreq: "weekly" },
      { loc: "/journal", priority: "0.8", changefreq: "daily" },
      { loc: "/wisdom", priority: "0.8", changefreq: "daily" },
      { loc: "/about", priority: "0.7", changefreq: "monthly" },
      { loc: "/contact", priority: "0.6", changefreq: "monthly" },
      { loc: "/privacy", priority: "0.5", changefreq: "yearly" },
      { loc: "/terms", priority: "0.5", changefreq: "yearly" },
      { loc: "/boundaries", priority: "0.8", changefreq: "weekly" },
      { loc: "/values-finder", priority: "0.8", changefreq: "weekly" },
      { loc: "/guided-journaling", priority: "0.8", changefreq: "weekly" },
      { loc: "/insight-cards", priority: "0.8", changefreq: "weekly" },
    ];

    const urls = staticPages
      .map(
        (page) => `
  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(sitemap);
  } catch (error) {
    logger.error("Sitemap generation error:", { error: error?.message || error });
    res.status(500).send("Error generating sitemap");
  }
});

router.get("/robots.txt", (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.set("Content-Type", "text/plain");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(robots);
});


router.get("/health", (req, res) => {
  res.json({ ok: true, module: "feed", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
