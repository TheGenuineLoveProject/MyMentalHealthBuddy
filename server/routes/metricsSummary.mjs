import { Router } from "express";
import { getSummary } from "../utils/metrics.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

router.get("/summary", (_req, res) => {
  try {
    const summary = getSummary();
    res.json({ ok: true, data: summary });
  } catch (err) {
    logger.warn("Metrics summary unavailable", { error: err?.message || err });
    res.json({ ok: true, data: { counters: {}, error: "metrics_unavailable" } });
  }
});

export default router;
