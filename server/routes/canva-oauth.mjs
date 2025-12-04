// server/routes/canva-oauth.mjs
// Canva OAuth 2.0 integration for design embeds

import express from "express";
import crypto from "crypto";
import { logger } from "../utils/logger.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { success, badRequest, serverError } from "../utils/response.mjs";

const router = express.Router();

const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID || "";
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET || "";
const CANVA_APP_ORIGIN = process.env.CANVA_APP_ORIGIN || "";
const CANVA_REDIRECT_URI = process.env.CANVA_REDIRECT_URI || "";

const pendingStates = new Map();

function generateState() {
  return crypto.randomBytes(32).toString("hex");
}

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
}

router.get("/health", (req, res) => {
  const configured = !!(CANVA_CLIENT_ID && CANVA_APP_ORIGIN);
  res.json({
    ok: true,
    route: "canva-oauth",
    configured,
    clientId: CANVA_CLIENT_ID ? "set" : "missing",
    clientSecret: CANVA_CLIENT_SECRET ? "set" : "missing",
    appOrigin: CANVA_APP_ORIGIN ? "set" : "missing"
  });
});

router.get("/authorize", requireAuth, (req, res) => {
  try {
    if (!CANVA_CLIENT_ID) {
      return badRequest(res, "Canva integration not configured. Missing CANVA_CLIENT_ID.");
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    pendingStates.set(state, {
      userId: req.user.id,
      codeVerifier,
      createdAt: Date.now()
    });

    setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);

    const redirectUri = CANVA_REDIRECT_URI || `${req.protocol}://${req.get("host")}/api/canva/callback`;
    
    const authUrl = new URL("https://www.canva.com/api/oauth/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", CANVA_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "design:content:read design:content:write");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", codeChallenge);
    authUrl.searchParams.set("code_challenge_method", "S256");

    logger.info("Canva OAuth initiated", { userId: req.user.id });

    return success(res, { 
      authUrl: authUrl.toString(),
      message: "Redirect user to this URL to authorize Canva access"
    });
  } catch (err) {
    logger.error("Canva authorize error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      logger.warn("Canva OAuth error", { error, error_description });
      return res.redirect(`/?canva_error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code || !state) {
      return res.redirect("/?canva_error=missing_parameters");
    }

    const pending = pendingStates.get(state);
    if (!pending) {
      return res.redirect("/?canva_error=invalid_state");
    }

    pendingStates.delete(state);

    if (!CANVA_CLIENT_SECRET) {
      logger.warn("CANVA_CLIENT_SECRET not configured");
      return res.redirect("/?canva_error=server_configuration");
    }

    const redirectUri = CANVA_REDIRECT_URI || `${req.protocol}://${req.get("host")}/api/canva/callback`;

    const tokenResponse = await fetch("https://www.canva.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CANVA_CLIENT_ID,
        client_secret: CANVA_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code_verifier: pending.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error("Canva token exchange failed", { status: tokenResponse.status, error: errorData });
      return res.redirect("/?canva_error=token_exchange_failed");
    }

    const tokens = await tokenResponse.json();
    
    logger.info("Canva OAuth successful", { userId: pending.userId });

    return res.redirect(`/?canva_connected=true`);
  } catch (err) {
    logger.error("Canva callback error", { error: err.message });
    return res.redirect("/?canva_error=server_error");
  }
});

router.post("/revoke", requireAuth, async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return badRequest(res, "Access token is required for revocation.");
    }

    if (!CANVA_CLIENT_SECRET) {
      return serverError(res, new Error("CANVA_CLIENT_SECRET not configured."));
    }

    const revokeResponse = await fetch("https://www.canva.com/api/oauth/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CANVA_CLIENT_ID,
        client_secret: CANVA_CLIENT_SECRET,
        token: accessToken,
      }),
    });

    if (!revokeResponse.ok) {
      const errorData = await revokeResponse.text();
      logger.error("Canva token revocation failed", { error: errorData });
      return serverError(res, new Error("Failed to revoke Canva access."));
    }

    logger.info("Canva access revoked", { userId: req.user.id });

    return success(res, { message: "Canva access has been revoked." });
  } catch (err) {
    logger.error("Canva revoke error", { error: err.message });
    return serverError(res, err);
  }
});

router.post("/refresh", requireAuth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return badRequest(res, "Refresh token is required.");
    }

    if (!CANVA_CLIENT_SECRET) {
      return serverError(res, new Error("CANVA_CLIENT_SECRET not configured."));
    }

    const tokenResponse = await fetch("https://www.canva.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CANVA_CLIENT_ID,
        client_secret: CANVA_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error("Canva token refresh failed", { error: errorData });
      return serverError(res, new Error("Failed to refresh Canva tokens."));
    }

    const tokens = await tokenResponse.json();

    logger.info("Canva tokens refreshed", { userId: req.user.id });

    return success(res, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });
  } catch (err) {
    logger.error("Canva refresh error", { error: err.message });
    return serverError(res, err);
  }
});

export default router;
