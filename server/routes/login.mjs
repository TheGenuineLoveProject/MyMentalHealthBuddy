import express from "express";
import { signToken } from "../auth/jwt.mjs";

const router = express.Router();

router.post("/login", (req, res) => {
  const token = signToken({
    id: "admin-1",
    role: "admin",
  });

  res.json({ token });
});


// Health check endpoint for admin daily tools monitoring
router.get("/", (req, res) => {
  res.json({ ok: true, module: "login", status: "operational", timestamp: new Date().toISOString() });
});

export default router;
