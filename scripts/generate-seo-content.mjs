#!/usr/bin/env node
/**
 * Prompt 3.8 — SEO content generation
 *
 * Drafts trauma-informed, educational-only blog posts from a keyword list and
 * writes them to the existing `blog_posts` table as `status='draft'`.
 *
 * - Idempotent on slug: a keyword that already has a draft is skipped.
 * - DRY-RUN by default — pass `--write` to actually insert rows.
 * - Falls back to a deterministic outline when OPENAI_API_KEY is absent so the
 *   script never crashes in CI / on first boot.
 *
 * Usage:
 *   node scripts/generate-seo-content.mjs --keywords "anxiety, distortion, boundaries"
 *   node scripts/generate-seo-content.mjs --keywords-file keywords.txt --write
 *   node scripts/generate-seo-content.mjs --limit 3 --write
 */

import process from "node:process";
import fs from "node:fs/promises";
import { Pool } from "pg";

const DEFAULT_KEYWORDS = [
  "how to recognize cognitive distortions",
  "trauma-informed boundaries with family",
  "what is nervous system regulation",
  "gentle journaling prompts for anxiety",
  "how to spot manipulation in conversations",
  "self-compassion practice for beginners",
  "polyvagal theory in plain language",
  "PHQ-9 vs GAD-7 explained gently",
];

const SAFETY_DISCLAIMER = `\n\n---\n\n_Educational only. This article is not a diagnosis or a substitute for professional care. If you are in crisis, please visit our [crisis support](/crisis) page._`;

function arg(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith("--")) return true;
  return next;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function fallbackDraft(keyword) {
  const title = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  const body = `# ${title}

This post is a gentle, educational exploration of **${keyword}**. We will look at what it means, why it shows up, and a few small practices that may help you notice it more clearly in your own life.

## What it means

When we talk about ${keyword}, we are noticing a pattern — not making a diagnosis. Patterns are signals, not labels.

## Why it matters

Naming a pattern softens its grip. Once we can see it, we have a choice we did not have before.

## A small practice

Take one slow breath. Notice one thing in the room that is genuinely safe right now. That is enough for today.

## A gentle reminder

You do not have to fix this all at once. You are allowed to take your time.`;
  return {
    title,
    excerpt: `An educational, trauma-informed introduction to ${keyword}.`,
    content: body + SAFETY_DISCLAIMER,
    tags: keyword.split(/\s+/).slice(0, 5).join(","),
  };
}

async function aiDraft(keyword) {
  if (!process.env.OPENAI_API_KEY) return fallbackDraft(keyword);
  let OpenAI;
  try {
    ({ default: OpenAI } = await import("openai"));
  } catch {
    return fallbackDraft(keyword);
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const sys = `You are a trauma-informed wellness writer for MyMentalHealthBuddy. Write educational, non-clinical, gentle, consent-based content. Never diagnose. Never claim to treat. Always include the line "Educational only — not a diagnosis." at the end. Use plain language at a 9th-grade reading level. Use markdown headings.`;
  const user = `Draft a 450–650 word blog post on the topic: "${keyword}".
Return strict JSON with this shape:
{"title": "string (max 70 chars)", "excerpt": "string (max 160 chars)", "content": "markdown string", "tags": "comma,separated,tags"}
The content must include H2 sections, a small practice the reader can do in under 2 minutes, and a closing reminder. Do not include any external links other than /crisis. Do not give medical advice.`;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 1400,
    });
    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) return fallbackDraft(keyword);
    const parsed = JSON.parse(raw);
    const out = {
      title: String(parsed.title || keyword).slice(0, 250),
      excerpt: String(parsed.excerpt || "").slice(0, 500),
      content: String(parsed.content || "") + SAFETY_DISCLAIMER,
      tags: String(parsed.tags || "").slice(0, 250),
    };
    if (!out.content || out.content.length < 200) return fallbackDraft(keyword);
    return out;
  } catch (err) {
    console.warn(`[seo-content] OpenAI failed for "${keyword}":`, err.message);
    return fallbackDraft(keyword);
  }
}

function readingTime(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

async function loadKeywords() {
  const list = [];
  const inline = arg("keywords");
  if (typeof inline === "string") list.push(...inline.split(",").map((s) => s.trim()).filter(Boolean));
  const file = arg("keywords-file");
  if (typeof file === "string") {
    const text = await fs.readFile(file, "utf8");
    list.push(...text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean));
  }
  if (list.length === 0) list.push(...DEFAULT_KEYWORDS);
  const limit = parseInt(arg("limit", "0"), 10) || 0;
  return limit > 0 ? list.slice(0, limit) : list;
}

async function findExistingSlugs(pool, slugs) {
  if (slugs.length === 0) return new Set();
  const { rows } = await pool.query(
    "SELECT slug FROM blog_posts WHERE slug = ANY($1::text[])",
    [slugs]
  );
  return new Set(rows.map((r) => r.slug));
}

async function findOrCreateSystemAuthor(pool) {
  const email = "content-bot@mymentalhealthbuddy.local";
  const { rows: existing } = await pool.query(
    "SELECT id FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  if (existing.length > 0) return existing[0].id;
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING id`,
    [email, "!disabled-system-account!", "MMHB Content Bot", "user"]
  );
  return rows[0].id;
}

async function main() {
  const writeMode = !!arg("write", false);
  const keywords = await loadKeywords();
  console.log(`[seo-content] mode=${writeMode ? "WRITE" : "DRY-RUN"} keywords=${keywords.length}`);

  if (!process.env.DATABASE_URL) {
    console.error("[seo-content] DATABASE_URL is required.");
    process.exit(2);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const drafts = [];
    for (const kw of keywords) {
      const slug = slugify(kw);
      drafts.push({ keyword: kw, slug });
    }
    const existing = await findExistingSlugs(pool, drafts.map((d) => d.slug));
    const fresh = drafts.filter((d) => !existing.has(d.slug));
    console.log(`[seo-content] existing=${existing.size} fresh=${fresh.length}`);

    if (fresh.length === 0) {
      console.log("[seo-content] Nothing to draft. All slugs already present.");
      return;
    }

    const authorId = writeMode ? await findOrCreateSystemAuthor(pool) : null;
    let inserted = 0;
    for (const d of fresh) {
      const draft = await aiDraft(d.keyword);
      const minutes = readingTime(draft.content);
      console.log(`[seo-content] draft ready slug=${d.slug} title="${draft.title.slice(0, 60)}…" words≈${draft.content.split(/\s+/).length}`);
      if (!writeMode) continue;
      try {
        await pool.query(
          `INSERT INTO blog_posts
            (title, slug, content, excerpt, author_id, status, content_type, visibility, reading_time_minutes, tags)
           VALUES ($1, $2, $3, $4, $5, 'draft', 'blog_post', 'draft', $6, $7)
           ON CONFLICT (slug) DO NOTHING`,
          [draft.title, d.slug, draft.content, draft.excerpt, authorId, minutes, draft.tags]
        );
        inserted += 1;
      } catch (err) {
        console.warn(`[seo-content] insert failed slug=${d.slug}:`, err.message);
      }
    }
    if (writeMode) console.log(`[seo-content] inserted=${inserted}`);
    else console.log("[seo-content] dry-run complete. Re-run with --write to persist.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[seo-content] fatal:", err);
  process.exit(1);
});
