import express from "express";
import { authGuard } from "../middleware/auth.mjs";
const router = express.Router();

router.get("/ping", (req, res) => res.json({ ok: true, route: "content" }));

export default router;
