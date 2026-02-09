import express from "express";
import { randomUUID } from "crypto";
import { db } from "../db/connection.mjs";
import { blogPosts, blogComments, users, leads } from "../../shared/schema.mjs";
import { eq, desc, and, ilike, or, sql, count } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100) + "-" + Date.now().toString(36);
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

router.get("/", async (req, res) => {
  try {
    const { search, tag, type, limit = 20, offset = 0 } = req.query;
    
    const conditions = [eq(blogPosts.status, "published"), eq(blogPosts.visibility, "public")];

    if (type && typeof type === "string" && type.trim()) {
      conditions.push(eq(blogPosts.contentType, type.trim()));
    }
    
    if (search && typeof search === "string" && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(blogPosts.title, searchTerm),
          ilike(blogPosts.excerpt, searchTerm)
        )
      );
    }
    
    if (tag && typeof tag === "string" && tag.trim()) {
      conditions.push(ilike(blogPosts.tags, `%${tag.trim()}%`));
    }
    
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        authorId: blogPosts.authorId,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        readingTimeMinutes: blogPosts.readingTimeMinutes,
        tags: blogPosts.tags,
        featuredImage: blogPosts.featuredImage,
        contentType: blogPosts.contentType,
        visibility: blogPosts.visibility,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(Number(limit))
      .offset(Number(offset));
    
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const authorResult = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, post.authorId))
          .limit(1);
        return {
          ...post,
          authorName: authorResult[0]?.name || "Anonymous",
        };
      })
    );

    return success(res, postsWithAuthors, "Blog posts fetched.");
  } catch (err) {
    logger.error("Failed to fetch blog posts", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to fetch posts." });
  }
});

router.get("/admin", requireAuth, requireAdmin, async (req, res) => {
  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(100);
    
    return success(res, posts);
  } catch (err) {
    logger.error("Failed to fetch admin blog posts", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to fetch posts." });
  }
});

router.get("/admin/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const postViews = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        viewCount: blogPosts.viewCount,
        contentType: blogPosts.contentType,
        status: blogPosts.status,
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.viewCount));

    const [signupCount] = await db
      .select({ total: count() })
      .from(leads);

    return success(res, {
      postViews,
      newsletterSignups: signupCount?.total || 0,
    }, "Publishing stats fetched.");
  } catch (err) {
    logger.error("Failed to fetch publishing stats", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to fetch stats." });
  }
});

router.get("/rss", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.visibility, "public")))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(20);

    const items = posts.map(p => `
      <item>
        <title><![CDATA[${p.title}]]></title>
        <link>https://thegenuineloveproject.com/blog/${p.slug}</link>
        <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
        <description><![CDATA[${p.excerpt || ""}]]></description>
      </item>
    `).join("");

    res.type("application/rss+xml").send(`<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>The Genuine Love Project Blog</title>
    <link>https://thegenuineloveproject.com/blog</link>
    <description>Mental wellness insights and reflections</description>
    ${items}
  </channel>
</rss>`);
  } catch (err) {
    logger.error("Failed to generate RSS feed", { error: err.message });
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: "Something went wrong" });
    }
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, "published"),
        eq(blogPosts.visibility, "public")
      ))
      .limit(1);

    if (posts.length === 0) {
      return res.status(404).json({ ok: false, message: "Post not found." });
    }

    const post = posts[0];

    db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, post.id))
      .catch(err => logger.error("Failed to increment view count", { error: err.message }));
    
    const authorResult = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, post.authorId))
      .limit(1);

    const comments = await db
      .select({
        id: blogComments.id,
        content: blogComments.content,
        userId: blogComments.userId,
        parentId: blogComments.parentId,
        createdAt: blogComments.createdAt,
      })
      .from(blogComments)
      .where(eq(blogComments.postId, post.id))
      .orderBy(desc(blogComments.createdAt));

    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const userResult = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, comment.userId))
          .limit(1);
        return {
          ...comment,
          authorName: userResult[0]?.name || "Anonymous",
        };
      })
    );

    return success(res, {
      ...post,
      authorName: authorResult[0]?.name || "Anonymous",
      comments: commentsWithAuthors,
    }, "Post fetched.");
  } catch (err) {
    logger.error("Failed to fetch blog post", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to fetch post." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { title, content, excerpt, tags, featuredImage, status = "draft", contentType = "blog_post", visibility = "public" } = req.body;

    if (!title || !content) {
      return badRequest(res, "Title and content are required.");
    }

    const validContentTypes = ["blog_post", "newsletter", "reflection", "essay", "note"];
    const validVisibilities = ["public", "private", "draft"];
    const safeContentType = validContentTypes.includes(contentType) ? contentType : "blog_post";
    const safeVisibility = validVisibilities.includes(visibility) ? visibility : "public";

    const slug = generateSlug(title);
    const readingTimeMinutes = calculateReadingTime(content);
    const publishedAt = status === "published" ? new Date() : null;

    const inserted = await db
      .insert(blogPosts)
      .values({
        id: randomUUID(),
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200) + "...",
        authorId: userId,
        status,
        contentType: safeContentType,
        visibility: safeVisibility,
        publishedAt,
        readingTimeMinutes,
        tags: tags || "",
        featuredImage: featuredImage || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return success(res, inserted[0], "Blog post created.");
  } catch (err) {
    logger.error("Failed to create blog post", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to create post." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { id } = req.params;
    const { title, content, excerpt, tags, featuredImage, status } = req.body;

    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ ok: false, message: "Post not found." });
    }

    if (existing[0].authorId !== userId) {
      return res.status(403).json({ ok: false, message: "Not authorized." });
    }

    const updateValues = { updatedAt: new Date() };
    if (title) {
      updateValues.title = title;
      updateValues.slug = generateSlug(title);
    }
    if (content) {
      updateValues.content = content;
      updateValues.readingTimeMinutes = calculateReadingTime(content);
    }
    if (excerpt !== undefined) updateValues.excerpt = excerpt;
    if (tags !== undefined) updateValues.tags = tags;
    if (featuredImage !== undefined) updateValues.featuredImage = featuredImage;
    if (req.body.contentType) {
      const validContentTypes = ["blog_post", "newsletter", "reflection", "essay", "note"];
      if (validContentTypes.includes(req.body.contentType)) {
        updateValues.contentType = req.body.contentType;
      }
    }
    if (req.body.visibility) {
      const validVisibilities = ["public", "private", "draft"];
      if (validVisibilities.includes(req.body.visibility)) {
        updateValues.visibility = req.body.visibility;
      }
    }
    if (status) {
      updateValues.status = status;
      if (status === "published" && !existing[0].publishedAt) {
        updateValues.publishedAt = new Date();
      }
    }

    const updated = await db
      .update(blogPosts)
      .set(updateValues)
      .where(eq(blogPosts.id, id))
      .returning();

    return success(res, updated[0], "Blog post updated.");
  } catch (err) {
    logger.error("Failed to update blog post", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to update post." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { id } = req.params;

    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (existing.length === 0 || existing[0].authorId !== userId) {
      return badRequest(res, "Post not found or access denied.");
    }

    await db.delete(blogComments).where(eq(blogComments.postId, id));
    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return success(res, { id }, "Blog post deleted.");
  } catch (err) {
    logger.error("Failed to delete blog post", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to delete post." });
  }
});

router.post("/:postId/comments", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { postId } = req.params;
    const { content, parentId } = req.body;

    if (!content) {
      return badRequest(res, "Comment content is required.");
    }

    const postExists = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .limit(1);

    if (postExists.length === 0) {
      return res.status(404).json({ ok: false, message: "Post not found." });
    }

    const inserted = await db
      .insert(blogComments)
      .values({
        id: randomUUID(),
        postId,
        userId,
        content,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const userResult = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return success(res, {
      ...inserted[0],
      authorName: userResult[0]?.name || "Anonymous",
    }, "Comment added.");
  } catch (err) {
    logger.error("Failed to add comment", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to add comment." });
  }
});

router.delete("/comments/:commentId", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    const { commentId } = req.params;

    const existing = await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.id, commentId))
      .limit(1);

    if (existing.length === 0 || existing[0].userId !== userId) {
      return badRequest(res, "Comment not found or access denied.");
    }

    await db.delete(blogComments).where(eq(blogComments.parentId, commentId));
    await db.delete(blogComments).where(eq(blogComments.id, commentId));

    return success(res, { id: commentId }, "Comment deleted.");
  } catch (err) {
    logger.error("Failed to delete comment", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to delete comment." });
  }
});

router.get("/user/drafts", requireAuth, async (req, res) => {
  try {
    const userId = req.dbUserId;
    
    const drafts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.authorId, userId), eq(blogPosts.status, "draft")))
      .orderBy(desc(blogPosts.updatedAt));

    return success(res, drafts, "Drafts fetched.");
  } catch (err) {
    logger.error("Failed to fetch drafts", { error: err.message });
    return res.status(500).json({ ok: false, message: "Failed to fetch drafts." });
  }
});

export default router;
