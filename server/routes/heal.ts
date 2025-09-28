import { Router } from "express";
import { runHealing } from "../controllers/healController";

const router = Router();

router.post("/heal", runHealing);

export default router;