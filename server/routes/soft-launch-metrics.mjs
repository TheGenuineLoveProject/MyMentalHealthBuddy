import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET as ACCESS_SECRET } from "../config/secrets.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const metrics = {
  public_page_views_total: 0,
  views_by_route: {},
  funnel: {
    landing_cta_click: 0,
    auth_start: 0,
    auth_success: 0,
    first_tool_use: 0,
    checkout_start: 0,
    checkout_success: 0,
  },
  started_at: new Date().toISOString(),
};

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

export function recordPageView(route) {
  metrics.public_page_views_total++;
  metrics.views_by_route[route] = (metrics.views_by_route[route] || 0) + 1;
}

export function recordFunnel(step) {
  if (step in metrics.funnel) {
    metrics.funnel[step]++;
  }
}

router.get("/", requireAdmin, (_req, res) => {
  res.json({
    ok: true,
    metrics: {
      ...metrics,
      uptime_since: metrics.started_at,
      captured_at: new Date().toISOString(),
    },
    privacy_notice: "Aggregate counts only. No PII, no IPs, no fingerprinting.",
  });
});

router.post("/funnel", (req, res) => {
  // Intentionally public: client-side calls this to record funnel steps.
  // Write-only, fixed keys, aggregate counts only — no PII, no data exposure.
  const { step } = req.body;
  if (!step || !(step in metrics.funnel)) {
    return res.status(400).json({ ok: false, message: "Invalid funnel step" });
  }
  recordFunnel(step);
  res.json({ ok: true });
});

export default router;
