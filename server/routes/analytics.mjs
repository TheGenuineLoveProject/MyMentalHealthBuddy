import { Router } from "express";
import authGuard from "../middleware/auth.mjs";

const router = Router();

router.get("/", authGuard, (req, res) => {
  res.json({
    status: "ok",
    message: "Analytics-working!",
    user: req.user,
  });
});

export default router;