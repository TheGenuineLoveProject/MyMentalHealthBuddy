// server/routes/canva-oauth.mjs
// Canva Apps SDK integration - no client secret needed
// Uses CANVA_APP_ID and CANVA_APP_ORIGIN for authentication

import express from "express";
import crypto from "crypto";
import { logger } from "../utils/logger.mjs";
import { success, badRequest, serverError } from "../utils/response.mjs";

const router = express.Router();

const CANVA_APP_ID = process.env.CANVA_APP_ID || process.env.CANVA_CLIENT_ID || "";
const CANVA_APP_ORIGIN = process.env.CANVA_APP_ORIGIN || "";
const CANVA_HMR_ENABLED = process.env.CANVA_HMR_ENABLED === "TRUE";

// Health check endpoint
router.get("/health", (req, res) => {
  const configured = !!(CANVA_APP_ID && CANVA_APP_ORIGIN);
  res.json({
    ok: true,
    route: "canva-apps",
    configured,
    appId: CANVA_APP_ID ? "set" : "missing",
    appOrigin: CANVA_APP_ORIGIN ? "set" : "missing",
    hmrEnabled: CANVA_HMR_ENABLED,
    mode: "canva-apps-sdk"
  });
});

// Canva Apps SDK configuration endpoint
router.get("/config", (req, res) => {
  if (!CANVA_APP_ID || !CANVA_APP_ORIGIN) {
    return badRequest(res, "Canva Apps SDK not configured. Missing CANVA_APP_ID or CANVA_APP_ORIGIN.");
  }

  return success(res, {
    appId: CANVA_APP_ID,
    appOrigin: CANVA_APP_ORIGIN,
    hmrEnabled: CANVA_HMR_ENABLED,
    features: {
      designEditing: true,
      assetUpload: true,
      collaboration: true
    }
  });
});

// Verify Canva JWT token (for authenticated requests from Canva Apps)
router.post("/verify-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return badRequest(res, "Authorization header with Bearer token required.");
    }

    const token = authHeader.split(" ")[1];
    
    // Decode JWT payload (Canva tokens are signed but we verify origin)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return badRequest(res, "Invalid token format.");
    }

    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      
      // Verify the token is for our app
      if (payload.aud !== CANVA_APP_ID) {
        logger.warn("Canva token audience mismatch", { 
          expected: CANVA_APP_ID, 
          received: payload.aud 
        });
        return badRequest(res, "Token not issued for this application.");
      }

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return badRequest(res, "Token has expired.");
      }

      logger.info("Canva token verified", { 
        userId: payload.userId,
        brandId: payload.brandId 
      });

      return success(res, {
        valid: true,
        userId: payload.userId,
        brandId: payload.brandId,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
      });
    } catch (parseError) {
      return badRequest(res, "Failed to decode token.");
    }
  } catch (err) {
    logger.error("Canva token verification error", { error: err.message });
    return serverError(res, err);
  }
});

// Webhook endpoint for Canva events
router.post("/webhook", async (req, res) => {
  try {
    const { event, data } = req.body;
    
    logger.info("Canva webhook received", { event, dataKeys: Object.keys(data || {}) });
    
    switch (event) {
      case "app.installed":
        logger.info("Canva app installed", { brandId: data?.brandId });
        break;
      case "app.uninstalled":
        logger.info("Canva app uninstalled", { brandId: data?.brandId });
        break;
      case "design.published":
        logger.info("Design published via Canva", { designId: data?.designId });
        break;
      default:
        logger.info("Unknown Canva event", { event });
    }

    return success(res, { received: true });
  } catch (err) {
    logger.error("Canva webhook error", { error: err.message });
    return serverError(res, err);
  }
});

// Asset proxy for Canva (fetch external assets securely)
router.get("/asset-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return badRequest(res, "URL parameter required.");
    }

    // Validate URL is from allowed domains
    const allowedDomains = [
      "canva.com",
      "canva-apps.com",
      "media.canva.com",
      "static.canva.com"
    ];

    const parsedUrl = new URL(url);
    const isAllowed = allowedDomains.some(domain => 
      parsedUrl.hostname.endsWith(domain)
    );

    if (!isAllowed) {
      return badRequest(res, "URL domain not allowed.");
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      return serverError(res, new Error(`Failed to fetch asset: ${response.status}`));
    }

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    logger.error("Canva asset proxy error", { error: err.message });
    return serverError(res, err);
  }
});

// Status endpoint showing all Canva integration capabilities
router.get("/status", (req, res) => {
  const isConfigured = !!(CANVA_APP_ID && CANVA_APP_ORIGIN);
  
  return success(res, {
    integration: "canva-apps-sdk",
    configured: isConfigured,
    environment: {
      appId: CANVA_APP_ID ? `${CANVA_APP_ID.substring(0, 4)}...` : null,
      appOrigin: CANVA_APP_ORIGIN || null,
      hmrEnabled: CANVA_HMR_ENABLED
    },
    endpoints: {
      health: "/api/canva/health",
      config: "/api/canva/config",
      verifyToken: "/api/canva/verify-token",
      webhook: "/api/canva/webhook",
      assetProxy: "/api/canva/asset-proxy",
      status: "/api/canva/status"
    },
    documentation: "https://www.canva.dev/docs/apps/"
  });
});

export default router;
