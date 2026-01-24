import express from "express";
import { db } from "../db/connection.mjs";
import { postDrafts, contentTemplates, calendarEntries } from "../../shared/schema.mjs";
import { eq, desc, and } from "drizzle-orm";
import { success, badRequest } from "../utils/response.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const PLATFORM_SPECS = {
  instagram: { maxChars: 2200, hashtagLimit: 30, bestTimes: ["9am", "12pm", "7pm"], format: "Square/Vertical" },
  tiktok: { maxChars: 2200, hashtagLimit: 5, bestTimes: ["7pm", "8pm", "9pm"], format: "Vertical 9:16" },
  youtube: { maxChars: 5000, hashtagLimit: 15, bestTimes: ["3pm", "5pm"], format: "Horizontal 16:9" },
  x: { maxChars: 280, hashtagLimit: 3, bestTimes: ["9am", "12pm", "5pm"], format: "Any" },
  threads: { maxChars: 500, hashtagLimit: 0, bestTimes: ["12pm", "7pm"], format: "Any" },
  facebook: { maxChars: 63206, hashtagLimit: 5, bestTimes: ["1pm", "4pm"], format: "Any" },
  linkedin: { maxChars: 3000, hashtagLimit: 5, bestTimes: ["10am", "12pm"], format: "Horizontal" },
  pinterest: { maxChars: 500, hashtagLimit: 20, bestTimes: ["8pm", "9pm"], format: "Vertical 2:3" },
};

const TRAUMA_INFORMED_GUIDELINES = {
  avoid: [
    "you should", "you must", "you need to", "you have to",
    "just", "simply", "easy", "quick fix", "cure", "treat",
    "broken", "damaged", "toxic", "crazy", "insane", "psycho",
    "attention seeking", "drama", "overreacting", "too sensitive",
    "get over it", "move on", "let go", "forgive and forget"
  ],
  prefer: [
    "you might consider", "you could try", "if it feels right",
    "when you're ready", "at your own pace", "may help", "some find"
  ]
};

const router = express.Router();

/* =====================================================
 * POST DRAFTS CRUD
 * =====================================================
 */

router.get("/drafts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, platform } = req.query;
    let query = db.select().from(postDrafts).orderBy(desc(postDrafts.createdAt));
    
    const drafts = await query.limit(100);
    return success(res, drafts);
  } catch (error) {
    logger.error("Failed to fetch drafts:", error);
    return badRequest(res, "Failed to fetch drafts");
  }
});

router.get("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [draft] = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.id, id))
      .limit(1);
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to fetch draft:", error);
    return badRequest(res, "Failed to fetch draft");
  }
});

router.post("/drafts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { platform, hook, caption, cta, hashtags, disclaimer, theme } = req.body;
    
    const [draft] = await db
      .insert(postDrafts)
      .values({
        userId: req.user.id,
        platform,
        hook,
        caption,
        cta,
        hashtags,
        disclaimer,
        theme,
        status: "draft",
      })
      .returning();
    
    return success(res, draft, 201);
  } catch (error) {
    logger.error("Failed to create draft:", error);
    return badRequest(res, "Failed to create draft");
  }
});

router.patch("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [draft] = await db
      .update(postDrafts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(postDrafts.id, id))
      .returning();
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to update draft:", error);
    return badRequest(res, "Failed to update draft");
  }
});

router.delete("/drafts/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(postDrafts).where(eq(postDrafts.id, id));
    return success(res, { message: "Draft deleted" });
  } catch (error) {
    logger.error("Failed to delete draft:", error);
    return badRequest(res, "Failed to delete draft");
  }
});

router.post("/drafts/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [draft] = await db
      .update(postDrafts)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(postDrafts.id, id))
      .returning();
    
    if (!draft) {
      return badRequest(res, "Draft not found", 404);
    }
    return success(res, draft);
  } catch (error) {
    logger.error("Failed to approve draft:", error);
    return badRequest(res, "Failed to approve draft");
  }
});

/* =====================================================
 * CONTENT TEMPLATES CRUD
 * =====================================================
 */

router.get("/templates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const templates = await db
      .select()
      .from(contentTemplates)
      .where(eq(contentTemplates.isActive, true))
      .orderBy(desc(contentTemplates.createdAt));
    
    return success(res, templates);
  } catch (error) {
    logger.error("Failed to fetch templates:", error);
    return badRequest(res, "Failed to fetch templates");
  }
});

router.post("/templates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { type, name, structure, voiceRules, level } = req.body;
    
    if (!structure) {
      return badRequest(res, "Structure is required");
    }
    
    const [template] = await db
      .insert(contentTemplates)
      .values({ type, name, structure, voiceRules, level })
      .returning();
    
    return success(res, template, 201);
  } catch (error) {
    logger.error("Failed to create template:", error);
    return badRequest(res, "Failed to create template");
  }
});

router.delete("/templates/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db
      .update(contentTemplates)
      .set({ isActive: false })
      .where(eq(contentTemplates.id, id));
    
    return success(res, { message: "Template archived" });
  } catch (error) {
    logger.error("Failed to archive template:", error);
    return badRequest(res, "Failed to archive template");
  }
});

/* =====================================================
 * CALENDAR ENTRIES CRUD
 * =====================================================
 */

router.get("/calendar", requireAuth, requireAdmin, async (req, res) => {
  try {
    const entries = await db
      .select()
      .from(calendarEntries)
      .orderBy(desc(calendarEntries.scheduledDate))
      .limit(100);
    
    return success(res, entries);
  } catch (error) {
    logger.error("Failed to fetch calendar:", error);
    return badRequest(res, "Failed to fetch calendar");
  }
});

router.post("/calendar", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { draftId, scheduledDate, platform, theme } = req.body;
    
    if (!draftId || !scheduledDate) {
      return badRequest(res, "Draft ID and scheduled date are required");
    }
    
    const [entry] = await db
      .insert(calendarEntries)
      .values({ draftId, scheduledDate: new Date(scheduledDate), platform, theme })
      .returning();
    
    await db
      .update(postDrafts)
      .set({ status: "scheduled", scheduledFor: new Date(scheduledDate) })
      .where(eq(postDrafts.id, draftId));
    
    return success(res, entry, 201);
  } catch (error) {
    logger.error("Failed to create calendar entry:", error);
    return badRequest(res, "Failed to create calendar entry");
  }
});

router.delete("/calendar/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(calendarEntries).where(eq(calendarEntries.id, id));
    return success(res, { message: "Calendar entry deleted" });
  } catch (error) {
    logger.error("Failed to delete calendar entry:", error);
    return badRequest(res, "Failed to delete calendar entry");
  }
});

/* =====================================================
 * EXPORT FUNCTIONALITY
 * =====================================================
 */

router.post("/export", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { format = "json", status = "approved" } = req.body;
    
    const drafts = await db
      .select()
      .from(postDrafts)
      .where(eq(postDrafts.status, status))
      .orderBy(desc(postDrafts.createdAt));
    
    if (format === "csv") {
      const headers = ["id", "platform", "hook", "caption", "cta", "hashtags", "theme", "status"];
      const csv = [
        headers.join(","),
        ...drafts.map(d => headers.map(h => `"${(d[h] || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=social-posts-export.csv");
      return res.send(csv);
    }
    
    return success(res, drafts);
  } catch (error) {
    logger.error("Failed to export:", error);
    return badRequest(res, "Failed to export");
  }
});

/* =====================================================
 * ANALYTICS & METRICS
 * ===================================================== */

router.get("/analytics", requireAuth, requireAdmin, async (req, res) => {
  try {
    const allDrafts = await db.select().from(postDrafts);
    const allEntries = await db.select().from(calendarEntries);
    const allTemplates = await db.select().from(contentTemplates);
    
    const statusCounts = {
      draft: 0,
      review: 0,
      approved: 0,
      scheduled: 0,
      exported: 0,
      published: 0
    };
    
    const platformCounts = {};
    const weeklyPosts = {};
    
    allDrafts.forEach(draft => {
      statusCounts[draft.status] = (statusCounts[draft.status] || 0) + 1;
      platformCounts[draft.platform] = (platformCounts[draft.platform] || 0) + 1;
      
      const weekStart = getWeekStart(draft.createdAt);
      weeklyPosts[weekStart] = (weeklyPosts[weekStart] || 0) + 1;
    });
    
    const upcomingCount = allEntries.filter(e => new Date(e.scheduledDate) > new Date()).length;
    
    return success(res, {
      totals: {
        drafts: allDrafts.length,
        templates: allTemplates.length,
        scheduledEntries: allEntries.length,
        upcoming: upcomingCount
      },
      statusBreakdown: statusCounts,
      platformBreakdown: platformCounts,
      weeklyActivity: Object.entries(weeklyPosts).slice(-8).map(([week, count]) => ({ week, count })),
      contentHealth: {
        pendingReview: statusCounts.review,
        readyToPublish: statusCounts.approved,
        inPipeline: statusCounts.draft + statusCounts.review
      }
    });
  } catch (error) {
    logger.error("Failed to fetch analytics:", error);
    return badRequest(res, "Failed to fetch analytics");
  }
});

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

router.get("/analytics/content-calendar", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = month ? parseInt(month) : new Date().getMonth();
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    
    const entries = await db.select().from(calendarEntries);
    const monthEntries = entries.filter(e => {
      const entryDate = new Date(e.scheduledDate);
      return entryDate >= startDate && entryDate <= endDate;
    });
    
    const dayMap = {};
    monthEntries.forEach(entry => {
      const day = new Date(entry.scheduledDate).getDate();
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(entry);
    });
    
    return success(res, {
      month: targetMonth,
      year: targetYear,
      totalPosts: monthEntries.length,
      calendarDays: dayMap
    });
  } catch (error) {
    logger.error("Failed to fetch calendar analytics:", error);
    return badRequest(res, "Failed to fetch calendar analytics");
  }
});

/* =====================================================
 * AI CONTENT GENERATION
 * ===================================================== */

router.post("/generate", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { theme, platform, style = "warm", level = "intermediate" } = req.body;
    
    if (!theme) {
      return badRequest(res, "Theme is required");
    }
    
    const platformSpec = PLATFORM_SPECS[platform] || PLATFORM_SPECS.instagram;
    
    const systemPrompt = `You are a trauma-informed social media content creator for The Genuine Love Project, a mental wellness platform.

CORE PRINCIPLES:
- Use consent-led, autonomy-respecting language ("you might", "if you'd like", "when you're ready")
- Never use prescriptive language ("you should", "you must", "you need to")
- Avoid pathologizing terms ("broken", "toxic", "damaged", "crazy")
- Use evidence-informed phrasing ("may help", "some people find", "research suggests")
- Include gentle pacing cues ("take your time", "go at your pace")
- Educational only - no medical claims, no diagnosis, no treatment promises

PLATFORM: ${platform}
MAX CHARACTERS: ${platformSpec.maxChars}
HASHTAG LIMIT: ${platformSpec.hashtagLimit}
BEST POST TIMES: ${platformSpec.bestTimes.join(", ")}

READING LEVEL: ${level}
- beginner: Simple sentences under 10 words, warm and accessible
- intermediate: Up to 2 sentences per thought, grounded tone
- advanced: Detailed explanations with definitions, scholarly yet gentle

OUTPUT FORMAT (JSON):
{
  "hook": "2-second attention grabber (under 15 words)",
  "caption": "Main content (platform-appropriate length)",
  "cta": "Gentle call to action (consent-led)",
  "hashtags": "Comma-separated relevant hashtags (within limit)",
  "disclaimer": "Brief safety disclaimer",
  "alternativeHooks": ["2 more hook options"],
  "contentNotes": "Brief note on trauma-informed considerations"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create social media content about: ${theme}\n\nStyle: ${style}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
    });
    
    const content = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return success(res, {
      ...content,
      platform,
      theme,
      platformSpec,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error("AI generation failed:", error);
    return badRequest(res, "Failed to generate content: " + error.message);
  }
});

router.post("/generate/repurpose", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { content, sourcePlatform, targetPlatforms } = req.body;
    
    if (!content || !targetPlatforms?.length) {
      return badRequest(res, "Content and target platforms are required");
    }
    
    const repurposed = {};
    
    for (const platform of targetPlatforms) {
      const spec = PLATFORM_SPECS[platform] || PLATFORM_SPECS.instagram;
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { 
            role: "system", 
            content: `You are a trauma-informed content repurposing specialist. Adapt content for ${platform}.
MAX CHARACTERS: ${spec.maxChars}
HASHTAG LIMIT: ${spec.hashtagLimit}
MAINTAIN: Trauma-informed language, consent-led phrasing, educational framing.
OUTPUT JSON: { "hook": "...", "caption": "...", "cta": "...", "hashtags": "..." }` 
          },
          { role: "user", content: `Repurpose this content for ${platform}:\n\n${content}` }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 800,
      });
      
      repurposed[platform] = JSON.parse(response.choices[0]?.message?.content || "{}");
    }
    
    return success(res, { repurposed, generatedAt: new Date().toISOString() });
  } catch (error) {
    logger.error("Repurpose failed:", error);
    return badRequest(res, "Failed to repurpose content");
  }
});

/* =====================================================
 * COMPLIANCE CHECKER
 * ===================================================== */

router.post("/compliance/check", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return badRequest(res, "Text is required");
    }
    
    const issues = [];
    const suggestions = [];
    const lowerText = text.toLowerCase();
    
    TRAUMA_INFORMED_GUIDELINES.avoid.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        issues.push({
          type: "avoid",
          phrase,
          severity: phrase.includes("should") || phrase.includes("must") ? "high" : "medium",
          suggestion: `Consider replacing "${phrase}" with more autonomy-respecting language`
        });
      }
    });
    
    const hasAutonomyLanguage = TRAUMA_INFORMED_GUIDELINES.prefer.some(
      phrase => lowerText.includes(phrase.toLowerCase())
    );
    
    if (!hasAutonomyLanguage && text.length > 50) {
      suggestions.push({
        type: "enhance",
        message: "Consider adding autonomy-respecting phrases like 'you might', 'if you'd like', or 'when you're ready'"
      });
    }
    
    if (!lowerText.includes("988") && !lowerText.includes("crisis") && text.length > 200) {
      suggestions.push({
        type: "safety",
        message: "For longer posts about mental wellness, consider including crisis resources (988 Lifeline)"
      });
    }
    
    const medicalClaims = ["cure", "treat", "heal", "fix", "diagnose", "therapy", "clinical"];
    medicalClaims.forEach(term => {
      if (lowerText.includes(term) && !lowerText.includes("not a substitute") && !lowerText.includes("educational")) {
        suggestions.push({
          type: "disclaimer",
          message: `Content includes "${term}" - ensure educational disclaimer is present`
        });
      }
    });
    
    const score = Math.max(0, 100 - (issues.length * 15) - (suggestions.length * 5));
    
    return success(res, {
      score,
      status: score >= 80 ? "pass" : score >= 60 ? "review" : "revise",
      issues,
      suggestions,
      guidelines: {
        avoid: TRAUMA_INFORMED_GUIDELINES.avoid.slice(0, 10),
        prefer: TRAUMA_INFORMED_GUIDELINES.prefer
      }
    });
  } catch (error) {
    logger.error("Compliance check failed:", error);
    return badRequest(res, "Failed to check compliance");
  }
});

router.post("/compliance/rewrite", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { text, issues } = req.body;
    
    if (!text) {
      return badRequest(res, "Text is required");
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { 
          role: "system", 
          content: `You are a trauma-informed content editor. Rewrite the given text to be more trauma-informed and consent-led.

RULES:
- Replace prescriptive language ("should", "must", "need to") with autonomy language ("might", "could", "if you'd like")
- Remove pathologizing terms ("broken", "toxic", "damaged")
- Use evidence-informed phrasing ("may help", "some find", "research suggests")
- Maintain the original message and intent
- Keep a warm, supportive tone

OUTPUT JSON: { "rewritten": "...", "changes": ["list of key changes made"] }` 
        },
        { role: "user", content: `Rewrite this content:\n\n${text}\n\nIssues to address: ${JSON.stringify(issues || [])}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 800,
    });
    
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return success(res, result);
  } catch (error) {
    logger.error("Rewrite failed:", error);
    return badRequest(res, "Failed to rewrite content");
  }
});

/* =====================================================
 * IMAGE GENERATION
 * ===================================================== */

router.post("/generate/image", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { theme, platform, style = "minimalist" } = req.body;
    
    if (!theme) {
      return badRequest(res, "Theme is required");
    }
    
    const platformSpec = PLATFORM_SPECS[platform] || PLATFORM_SPECS.instagram;
    const sizeMap = {
      instagram: "1024x1024",
      tiktok: "1024x1024",
      youtube: "1024x1024",
      pinterest: "1024x1024",
      default: "1024x1024"
    };
    
    const imagePrompt = `Create a calming, trauma-informed wellness social media graphic for The Genuine Love Project.

THEME: ${theme}
STYLE: ${style} - gentle, warm, non-triggering imagery
AESTHETIC: Soft earth tones, sage green, warm gold, gentle gradients
MOOD: Peaceful, supportive, grounding, safe

REQUIREMENTS:
- Abstract or nature-inspired (no people/faces to avoid triggers)
- Clean, uncluttered composition
- Professional quality for ${platform}
- No text overlay (captions added separately)
- Soothing color palette that evokes safety and warmth
- Subtle, calming visual elements`;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: imagePrompt,
      n: 1,
      size: sizeMap[platform] || sizeMap.default,
    });
    
    const imageData = response.data[0]?.b64_json;
    
    return success(res, {
      image: imageData ? `data:image/png;base64,${imageData}` : null,
      prompt: imagePrompt,
      platform,
      theme,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Image generation failed:", error);
    return badRequest(res, "Failed to generate image: " + error.message);
  }
});

/* =====================================================
 * BATCH CONTENT GENERATION
 * ===================================================== */

router.post("/generate/batch", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { themes, platform, style = "warm", level = "intermediate" } = req.body;
    
    if (!themes?.length) {
      return badRequest(res, "Themes array is required");
    }
    
    if (themes.length > 5) {
      return badRequest(res, "Maximum 5 themes per batch");
    }
    
    const platformSpec = PLATFORM_SPECS[platform] || PLATFORM_SPECS.instagram;
    const results = [];
    
    for (const theme of themes) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { 
              role: "system", 
              content: `You are a trauma-informed social media content creator. Create content for ${platform}.
PLATFORM: ${platform}, MAX CHARS: ${platformSpec.maxChars}, HASHTAGS: ${platformSpec.hashtagLimit}
READING LEVEL: ${level}
Use consent-led language, avoid prescriptive terms, use evidence-informed phrasing.
OUTPUT JSON: { "hook": "...", "caption": "...", "cta": "...", "hashtags": "...", "disclaimer": "..." }` 
            },
            { role: "user", content: `Create content about: ${theme}\nStyle: ${style}` }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 800,
        });
        
        const content = JSON.parse(response.choices[0]?.message?.content || "{}");
        results.push({ theme, success: true, content, platform });
      } catch (e) {
        results.push({ theme, success: false, error: e.message });
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    return success(res, { 
      processed: results.length,
      successful: results.filter(r => r.success).length,
      results,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Batch generation failed:", error);
    return badRequest(res, "Failed to generate batch content");
  }
});

/* =====================================================
 * CONTENT ENHANCEMENT SUGGESTIONS
 * ===================================================== */

router.post("/enhance", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { text, type = "engagement" } = req.body;
    
    if (!text) {
      return badRequest(res, "Text is required");
    }
    
    const enhancePrompts = {
      engagement: "Suggest 3 ways to make this content more engaging while maintaining trauma-informed principles",
      accessibility: "Suggest 3 ways to make this content more accessible (reading level, clarity, inclusivity)",
      emotional: "Suggest 3 ways to enhance the emotional resonance while keeping it safe and grounding",
      crisis: "Suggest appropriate crisis resources and safety disclaimers to add"
    };
    
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { 
          role: "system", 
          content: `You are a trauma-informed content enhancement specialist.
${enhancePrompts[type] || enhancePrompts.engagement}
Maintain consent-led language and avoid prescriptive terms.
OUTPUT JSON: { "suggestions": [{ "title": "...", "description": "...", "example": "..." }], "enhancedVersion": "..." }` 
        },
        { role: "user", content: `Enhance this content:\n\n${text}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
    });
    
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return success(res, { ...result, type, original: text });
  } catch (error) {
    logger.error("Enhancement failed:", error);
    return badRequest(res, "Failed to enhance content");
  }
});

/* =====================================================
 * PLATFORM SPECIFICATIONS
 * ===================================================== */

router.get("/platforms/specs", requireAuth, requireAdmin, async (req, res) => {
  return success(res, PLATFORM_SPECS);
});

/* =====================================================
 * BULK OPERATIONS
 * ===================================================== */

router.post("/drafts/bulk/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids?.length) {
      return badRequest(res, "Draft IDs are required");
    }
    
    const results = [];
    for (const id of ids) {
      try {
        const [draft] = await db
          .update(postDrafts)
          .set({ status: "approved", updatedAt: new Date() })
          .where(eq(postDrafts.id, id))
          .returning();
        results.push({ id, success: true, draft });
      } catch (e) {
        results.push({ id, success: false, error: e.message });
      }
    }
    
    return success(res, { processed: results.length, results });
  } catch (error) {
    logger.error("Bulk approve failed:", error);
    return badRequest(res, "Failed to bulk approve");
  }
});

router.post("/drafts/bulk/delete", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids?.length) {
      return badRequest(res, "Draft IDs are required");
    }
    
    for (const id of ids) {
      await db.delete(postDrafts).where(eq(postDrafts.id, id));
    }
    
    return success(res, { deleted: ids.length });
  } catch (error) {
    logger.error("Bulk delete failed:", error);
    return badRequest(res, "Failed to bulk delete");
  }
});

export default router;
