import express from "express";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const router = express.Router();
const blogDir = "content/blog";

// GET /api/content/evidence → list all APA-validated articles
router.get("/evidence", async (req,res) => {
  try {
    const posts = fs.readdirSync(blogDir)
      .filter(f => f.endsWith(".md") || f.endsWith(".mdx"))
      .map(f => {
        const raw = fs.readFileSync(path.join(blogDir,f),"utf8");
        const { data, content } = matter(raw);
        return {
          slug: f.replace(/\.(md|mdx)$/,""),
          ...data,
          excerpt: content.substring(0,180)+"…"
        };
      });
    res.json({count: posts.length, posts});
  } catch(err){
    console.error("Error reading content:", err);
    res.status(500).json({error: "Unable to load evidence content"});
  }
});

export default router;
