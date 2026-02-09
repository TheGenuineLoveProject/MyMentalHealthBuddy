import express from "express";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

let speakeasy = null;
let QRCode = null;

try {
  speakeasy = (await import("speakeasy")).default;
  QRCode = (await import("qrcode")).default;
} catch {
  logger.warn("MFA dependencies (speakeasy/qrcode) not installed - MFA routes disabled");
}

router.get("/status", (req, res) => {
  res.json({ 
    ok: true, 
    mfaAvailable: !!(speakeasy && QRCode),
    message: speakeasy ? "MFA system operational" : "MFA dependencies not installed"
  });
});

router.post("/setup", (req, res) => {
  if (!speakeasy || !QRCode) {
    return res.status(503).json({ error: "MFA dependencies not installed" });
  }
  res.status(401).json({ error: "Authentication required" });
});

router.post("/verify", (req, res) => {
  if (!speakeasy) {
    return res.status(503).json({ error: "MFA dependencies not installed" });
  }
  res.status(401).json({ error: "Authentication required" });
});

router.post("/disable", (req, res) => {
  if (!speakeasy) {
    return res.status(503).json({ error: "MFA dependencies not installed" });
  }
  res.status(401).json({ error: "Authentication required" });
});

export default router;
