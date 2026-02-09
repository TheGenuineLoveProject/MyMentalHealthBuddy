import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.mjs";
import { narrativeDrafts } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";
import { logger } from "../utils/logger.mjs";
import { readFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

const VALID_STATUSES = ["draft", "review", "approved", "posted"];

function requireAdmin(req, res, next) {
  const header = req.headers?.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    if (payload.role !== "admin") throw new Error("Not admin");
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
}

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const filePath = resolve(__dirname, "../../content/narrative/social_posts.json");
    const raw = await readFile(filePath, "utf-8");
    const posts = JSON.parse(raw);

    const drafts = await db.select().from(narrativeDrafts);
    const draftMap = {};
    for (const d of drafts) {
      draftMap[d.postId] = d;
    }

    const merged = posts.map((post) => ({
      ...post,
      draft: draftMap[post.id] || { status: "draft", editedCaption: null, notes: null },
    }));

    res.json({ ok: true, posts: merged });
  } catch (err) {
    logger.error("[NarrativeDrafts] Error loading posts", { error: err.message });
    res.status(500).json({ ok: false, message: "Failed to load narrative posts" });
  }
});

router.patch("/:postId", requireAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    const { status, editedCaption, notes } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ ok: false, message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const existing = await db.select().from(narrativeDrafts).where(eq(narrativeDrafts.postId, postId));

    const values = {
      postId,
      status: status || "draft",
      editedCaption: editedCaption ?? null,
      notes: notes ?? null,
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      await db.update(narrativeDrafts).set(values).where(eq(narrativeDrafts.postId, postId));
    } else {
      await db.insert(narrativeDrafts).values(values);
    }

    logger.info("[NarrativeDrafts] Post updated", { postId, status: values.status });
    res.json({ ok: true, postId, status: values.status });
  } catch (err) {
    logger.error("[NarrativeDrafts] Error updating post", { error: err.message });
    res.status(500).json({ ok: false, message: "Failed to update post" });
  }
});

export default router;
