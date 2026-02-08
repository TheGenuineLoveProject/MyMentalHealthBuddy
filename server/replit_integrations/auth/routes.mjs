/**
 * Auth Routes
 * Integration: blueprint:javascript_log_in_with_replit
 */

import { authStorage } from "./storage.mjs";
import { isAuthenticated, refreshUserToken } from "./replitAuth.mjs";

export function registerAuthRoutes(app) {
  app.get("/api/auth/user", async (req, res) => {
    try {
      let user = req.user;

      if (!user && req.session?.userData) {
        user = req.session.userData;
        req.user = user;
      }

      if (!user?.claims?.sub) {
        return res.json(null);
      }

      const now = Math.floor(Date.now() / 1000);
      if (user.expires_at && now > user.expires_at) {
        const refreshed = await refreshUserToken(user, req);
        if (!refreshed) {
          return res.json(null);
        }
      }

      const replitId = user.claims.sub;
      const dbUser = await authStorage.getUserByReplitId(replitId);
      res.json(dbUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(null);
    }
  });
}
