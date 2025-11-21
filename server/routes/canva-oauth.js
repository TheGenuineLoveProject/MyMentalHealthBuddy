// ================================================
// Canva OAuth Route — CLEAN, ERROR-FREE VERSION
// ================================================

import { Router } from "express";
const router = Router();

// -----------------------------------------------
// 1. CONFIG CONSTANTS (SAFE FALLBACKS)
// -----------------------------------------------
const LOCAL_TUNNEL_URL =
  (process.env.LOCAL_TUNNEL_URL || "").trim().replace(/\/$/, "") ||
  "https://your-local-tunnel-url.example";

const CANVA_REDIRECT_URL =
  process.env.CANVA_REDIRECT_URL ||
  "https://www.canva.com/apps/oauth/authorized";

// -----------------------------------------------
// 2. AUTHORIZATION ENDPOINT (CALLED BY CANVA)
// -----------------------------------------------
router.get("/authorize", (req, res) => {
  res.json({
    success: true,
    route: "canva-oauth-authorize",
    message: "Canva authorization endpoint is active ✔️",
    authorization_server_url: `${LOCAL_TUNNEL_URL}/api/canva/authorize`,
    token_exchange_url: `${LOCAL_TUNNEL_URL}/api/canva/callback`,
    redirect_url: CANVA_REDIRECT_URL,
    info: "OAuth flow placeholder — will be implemented with real Canva credentials.",
  });
});

// -----------------------------------------------
// 3. TOKEN EXCHANGE ENDPOINT (CALLED BY CANVA)
// -----------------------------------------------
router.post("/callback", async (req, res) => {
  // Mock token data for now
  const tokenData = {
    access_token: "mock_access_token_888888888888888888",
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock_refresh_token_888888888888888888",
    created_at: new Date().toISOString(),
  };

  res.json({
    success: true,
    route: "canva-oauth-callback",
    message: "Canva token exchange succeeded (mock).",
    data: tokenData,
  });
});

// -----------------------------------------------
// 4. TOKEN REVOKE ENDPOINT (OPTIONAL)
// -----------------------------------------------
router.post("/revoke", async (req, res) => {
  res.json({
    success: true,
    route: "canva-oauth-revoke",
    message: "Token successfully revoked (mock).",
  });
});

// -----------------------------------------------
export default router;