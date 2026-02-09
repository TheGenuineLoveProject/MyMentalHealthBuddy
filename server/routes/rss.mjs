import { Router } from 'express';
import { db } from '../db/connection.mjs';
import { blogPosts } from '../../shared/schema.mjs';
import { eq, desc } from 'drizzle-orm';
import { logger } from '../utils/logger.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/', async (req, res) => {
  try {
    let items = [];
    const siteUrl = `${req.protocol}://${req.get('host')}`;

    try {
      const posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.createdAt))
        .limit(50);

      items = posts.map(p => ({
        title: p.title,
        slug: p.slug,
        description: p.excerpt || p.content?.substring(0, 200) || '',
        date: p.createdAt ? new Date(p.createdAt).toUTCString() : new Date().toUTCString(),
        tags: p.tags || [],
      }));
    } catch {
      const indexPath = path.join(__dirname, '../../content/blog/index.json');
      if (fs.existsSync(indexPath)) {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        items = index.map(p => ({
          title: p.title,
          slug: p.slug,
          description: p.summary || '',
          date: p.publishDate ? new Date(p.publishDate).toUTCString() : new Date().toUTCString(),
          tags: Array.isArray(p.tags) ? p.tags : [],
        }));
      }
    }

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Genuine Love Project — Blog</title>
    <link>${escapeXml(siteUrl)}/blog</link>
    <description>Gentle reflections on self-awareness, emotional resilience, and personal growth.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml" />
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(siteUrl)}/blog/${escapeXml(item.slug)}</link>
      <guid isPermaLink="true">${escapeXml(siteUrl)}/blog/${escapeXml(item.slug)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.date}</pubDate>
${item.tags.map(t => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`).join('\n')}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/rss+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(rssXml);
  } catch (err) {
    logger.error('RSS feed error', { error: err.message });
    res.status(500).send('<?xml version="1.0"?><rss version="2.0"><channel><title>Error</title></channel></rss>');
  }
});

export default router;
