/**
 * Auth Routes
 * Integration: blueprint:javascript_log_in_with_replit
 */

import { authStorage } from "./storage.mjs";
import { isAuthenticated } from "./replitAuth.mjs";

export function registerAuthRoutes(app) {
  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const replitId = req.user.claims.sub;
      const user = await authStorage.getUserByReplitId(replitId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
