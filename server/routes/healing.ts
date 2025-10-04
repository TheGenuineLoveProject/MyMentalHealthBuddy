import { Router } from "express";
import runFullPlatformHealing from "../../scripts/heal";

const router = Router();

router.post("/run-healing", async (req, res) => {
  try {
    await runFullPlatformHealing();
    res.json({ status: "healing-complete ✅" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
