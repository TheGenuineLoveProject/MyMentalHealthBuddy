// ===== AI ROUTE (PROTECTED - 8888^) =====
import { Router } from "express";
import { runAIEmployee } from "../ai/aiHandler.mjs";
import authGuard from "../middleware/auth.mjs";

const router = Router();

router.post("/chat", authGuard, runAIEmployee);

export default router;