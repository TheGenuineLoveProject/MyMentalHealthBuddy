#!/usr/bin/env node
/**
 * Sitemap Generator for The Genuine Love Project
 * Generates sitemap.xml from allowlist of public indexable routes
 * Run: npm run seo:sitemap
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOMAIN = 'https://thegenuineloveproject.com';
const OUTPUT_PATH = join(__dirname, '..', 'client', 'public', 'sitemap.xml');

const PUBLIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/home', priority: '0.9', changefreq: 'weekly' },
  { path: '/healing-library', priority: '0.9', changefreq: 'weekly' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/faq', priority: '0.7', changefreq: 'monthly' },
  { path: '/glossary', priority: '0.6', changefreq: 'monthly' },
  { path: '/glossary-full', priority: '0.6', changefreq: 'monthly' },
  { path: '/research', priority: '0.7', changefreq: 'monthly' },
  { path: '/how-to-guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/daily-routines', priority: '0.7', changefreq: 'monthly' },
  { path: '/cognitive-tools', priority: '0.7', changefreq: 'monthly' },
  { path: '/breathing', priority: '0.8', changefreq: 'monthly' },
  { path: '/grounding', priority: '0.8', changefreq: 'monthly' },
  { path: '/calming-scenes', priority: '0.7', changefreq: 'monthly' },
  { path: '/stress-response', priority: '0.7', changefreq: 'monthly' },
  { path: '/sleep-guide', priority: '0.7', changefreq: 'monthly' },
  { path: '/guided-journaling', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/support', priority: '0.6', changefreq: 'monthly' },
  { path: '/crisis', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly' },
];

const lastmod = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(OUTPUT_PATH, sitemapXml);
console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
console.log(`   ${PUBLIC_ROUTES.length} URLs included`);
console.log(`   Last modified: ${lastmod}`);
