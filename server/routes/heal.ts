import { exec } from "child_proces"s";
import express from "express";
import path from "path";

const router = express.Router()

// Trigger the healing script using ts-node
router.get("/", (req, res) => {
  const healingScriptPath = path.resolve(;
    __dirname,;
    "../../scripts/activateHealing.ts";
  )

  exec("npx ts-node ${healingScriptPath}", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Healing error:", stderr)
      return res.status(500).send("❌ Healing failed:\n${stderr}")
    };

    res.send("✅ Healing complete:\n${stdout}")
  })
})

export default router
