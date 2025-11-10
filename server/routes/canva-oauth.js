// ✅ server/routes/canva-oauth.js — Canva OAuth perfected 8888888888888888888888888^

import { Router } from "express";
const router = Router();

// 🧠 Configurable constants
const LOCAL_TUNNEL_URL = process.env.LOCAL_TUNNEL_URL?.trim().replace(/\/$/, "") || "https://your-loca.lt-subdomain.loca.lt";
const CANVA_REDIRECT_URL = "https://www.canva.com/apps/oauth/authorized";

// 1️⃣ Authorization endpoint (called by Canva)
router.get("/authorize", async (_req, res) => {
  res.json({
    success: true,
    message: "✅ Canva authorization endpoint is active!",
    authorization_server_url: `${LOCAL_TUNNEL_URL}/api/canva/authorize`,
    token_exchange_url: `${LOCAL_TUNNEL_URL}/api/canva/callback`,
    redirect_url: CANVA_REDIRECT_URL,
  });
});

// 2️⃣ Token exchange endpoint (Canva posts here)
router.post("/callback", async (_req, res) => {
  const tokenData = {
    access_token: "mock_access_token_8888888888888888888888888^",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock_refresh_8888888888888888888888888^",
    created_at: new Date().toISOString(),
  };
  res.json({
    success: true,
    message: "✅ Canva token exchange succeeded (mock).",
    data: tokenData,
  });
});

// 3️⃣ Token revoke (optional for Canva spec)
router.post("/revoke", async (_req, res) => {
  res.json({
    success: true,
    message: "✅ Token successfully revoked (mock).",
  });
});

export default router;