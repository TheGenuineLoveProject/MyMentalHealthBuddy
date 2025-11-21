import { Router } from "express";
import authGuard from "../middleware/auth.mjs";

const router = Router();

router.get("/", authGuard, (req, res) => {
  res.json({
    route: "ai-dashboard",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;