/**
 * Auth Routes
 * Integration: blueprint:javascript_log_in_with_replit
 */

import { authStorage } from "./storage.mjs";
import { isAuthenticated, refreshUserToken } from "./replitAuth.mjs";
import { logger } from "../../utils/logger.mjs";
import { JWT_SECRET } from "../../config/secrets.mjs";
import jwt from "jsonwebtoken";

export function registerAuthRoutes(app) {
  app.get("/api/auth/user", async (req, res) => {
    try {
      let user = req.user;

      if (!user && req.session?.userData) {
        user = req.session.userData;
        req.user = user;
      }

      if (user?.claims?.sub) {
        const now = Math.floor(Date.now() / 1000);
        if (user.expires_at && now > user.expires_at) {
          const refreshed = await refreshUserToken(user, req);
          if (!refreshed) {
            return res.json(null);
          }
        }

        const replitId = user.claims.sub;
        const dbUser = await authStorage.getUserByReplitId(replitId);
        return res.json(dbUser);
      }

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ") && JWT_SECRET) {
        const token = authHeader.substring(7);
        try {
          const payload = jwt.verify(token, JWT_SECRET);
          if (payload?.id) {
            const dbUser = await authStorage.getUser(payload.id);
            return res.json(dbUser || null);
          }
        } catch {
          return res.json(null);
        }
      }

      return res.json(null);
    } catch (error) {
      logger.error("[Auth] Error fetching user", { error: error?.message || error });
      res.json(null);
    }
  });
}
