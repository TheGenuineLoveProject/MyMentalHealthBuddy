// server/routes/telemetry.mjs
// Lightweight client-event sink for the launch surface.
// Intentionally append-only; never logs message bodies.

import express from "express";
import { logEvent } from "../ai/aiTelemetry.mjs";

const router = express.Router();

router.post("/event", express.json({ limit: "4kb" }), (req, res) => {
  try {
    const guestId = req.headers["x-guest-id"] || null;
    const { type, metadata } = req.body || {};
    if (!type || typeof type !== "string") {
      return res.status(400).json({ error: "Missing or invalid type" });
    }
    logEvent({ type, guestId, metadata: metadata && typeof metadata === "object" ? metadata : {} });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Telemetry failed" });
  }
});

export default router;
