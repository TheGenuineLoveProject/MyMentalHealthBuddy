import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/connection.mjs";
import { leads } from "../db/schema.mjs";
import { success, badRequest } from "../utils/response.mjs";
import { authRateLimit } from "../middleware/rateLimit.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";
import { z } from "zod";

const router = express.Router();

const leadSchema = z.object({
  email: z.string().email("Valid email required"),
  consent: z.boolean().refine(v => v === true, "Consent is required"),
  interests: z.array(z.string()).optional(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

router.post("/", authRateLimit, async (req, res) => {
  try {
    const validation = leadSchema.safeParse(req.body);
    if (!validation.success) {
      return badRequest(res, validation.error.errors[0].message);
    }

    const { email, consent, interests, source, utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = validation.data;

    const existing = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(leads)
        .set({
          interests: interests || [],
          source: source || "newsletter",
          utmSource,
          utmMedium,
          utmCampaign,
          utmContent,
          utmTerm,
          updatedAt: new Date(),
        })
        .where(eq(leads.email, email.toLowerCase()));
      
      return success(res, { subscribed: true }, "Thank you! Your preferences have been updated.");
    }

    await db.insert(leads).values({
      email: email.toLowerCase(),
      consent,
      interests: interests || [],
      source: source || "newsletter",
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    });

    logger.info("New lead captured", { email: email.substring(0, 3) + "***", source });

    return res.status(201).json({
      ok: true,
      data: { subscribed: true },
      message: "Thank you for subscribing! Check your email for wellness tips.",
    });
  } catch (error) {
    logger.error("Lead capture failed", { error: error.message, requestId: req.requestId });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

const isAdmin = (req, res, next) => {
  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = req.headers.authorization;
  
  if (!adminToken || !authHeader) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  
  const token = authHeader.replace("Bearer ", "");
  if (token !== adminToken) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  
  next();
};

router.get("/export", isAdmin, async (req, res) => {
  try {
    const allLeads = await db.select().from(leads).orderBy(leads.createdAt);

    const csv = [
      ["Email", "Consent", "Interests", "Source", "UTM Source", "UTM Medium", "UTM Campaign", "Created At"].join(","),
      ...allLeads.map(lead => [
        lead.email,
        lead.consent,
        (lead.interests || []).join(";"),
        lead.source || "",
        lead.utmSource || "",
        lead.utmMedium || "",
        lead.utmCampaign || "",
        lead.createdAt?.toISOString() || "",
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`);
    return res.send(csv);
  } catch (error) {
    logger.error("Lead export failed", { error: error.message });
    return res.status(500).json({ ok: false, message: "Export failed" });
  }
});

router.get("/", isAdmin, async (req, res) => {
  try {
    const allLeads = await db.select().from(leads).orderBy(leads.createdAt);
    return success(res, { leads: allLeads, count: allLeads.length });
  } catch (error) {
    logger.error("Lead list failed", { error: error.message });
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
