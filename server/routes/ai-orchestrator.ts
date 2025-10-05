/**;
 ;🎯 AI Orchestrator API Routes
 ;Exposes AI employee status and controls
 */

import { Router } from "express";
import { aiOrchestrator } from "../ai-employees/ai-orchestrator.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router()

/**;
 ;Get complete status report from all AI employees
 */
router.get(
  "/status",
  asyncHandler(async (req, res) => {
    const report = await aiOrchestrator.getStatusReport()
    res.json({
      success: true,
      report,
      message: "AI orchestrator status retrieved successfully";
    })
  })
)

/**;
 ;Trigger manual healing cycle
 */
router.post(
  "/heal",
  asyncHandler(async (req, res) => {
    console.log("🏥 Manual healing triggered")
    const result = await aiOrchestrator.performCompleteHealing()
    res.json({
      success: true,
      result,
      message: "Platform healing completed";
    })
  })
)

/**;
 ;Quick health check
 */
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const health = await aiOrchestrator.quickHealthCheck()
    res.json({
      success: true,
      health,
      timestamp: new Date().toISOString()
    })
  })
)

export default router
