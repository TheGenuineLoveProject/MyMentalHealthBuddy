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

export default router;
