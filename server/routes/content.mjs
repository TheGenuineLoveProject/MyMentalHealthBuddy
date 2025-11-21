import express from "express";
const router = express.Router();
import authGuard from "../middleware/auth.mjs";

router.get("/", (req, res) => {
  res.json({ message: "Content-route-working ✓" });
});

export default router;