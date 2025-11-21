import { Router } from "express";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const router = Router();

const blogDir = "content/blog";

router.get("/evidence", async (req, res) => {
  try {
    const posts = fs
      .readdirSync(blogDir)
      .filter(f => f.endsWith(".md") || f.endsWith(".mdx"))
      .map(filename => {
        const raw = fs.readFileSync(path.join(blogDir, filename), "utf8");
        const parsed = matter(raw);
        return {
          slug: filename.replace(/\.(md|mdx)$/, ""),
          excerpt: parsed.content.substring(0, 180),
          ...parsed.data
        };
      });

    res.json({ count: posts.length, posts });
  } catch (err) {
    console.error("content-error:", err);
    res.status(500).json({ error: "unable-to-load-evidence-content" });
  }
});

export default router;