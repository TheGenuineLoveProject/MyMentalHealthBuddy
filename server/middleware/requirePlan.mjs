import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { logger } from "../utils/logger.mjs";

const PLAN_HIERARCHY = {
  free: 0,
  pro: 1,
};

async function getUserPlan(userId) {
  try {
    const result = await db.execute(sql`
      SELECT tier, status FROM subscriptions 
      WHERE user_id = ${userId} AND status IN ('active', 'trialing')
      LIMIT 1
    `);
    
    if (result.rows?.length > 0) {
      return result.rows[0].tier || "free";
    }
    return "free";
  } catch (error) {
    logger.error("Error fetching user plan", { userId, error: error.message });
    return "free";
  }
}

function hasAccess(userPlan, requiredPlan) {
  const userLevel = PLAN_HIERARCHY[userPlan] ?? 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] ?? 0;
  return userLevel >= requiredLevel;
}

export function requirePlan(requiredPlan) {
  return async (req, res, next) => {
    const userId = req.dbUserId;
    if (!userId) {
      return res.status(401).json({ 
        ok: false, 
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    const userPlan = await getUserPlan(userId);
    req.userPlan = userPlan;

    if (!hasAccess(userPlan, requiredPlan)) {
      logger.info("Plan access denied", { 
        userId, 
        userPlan, 
        requiredPlan,
        path: req.path 
      });
      
      return res.status(403).json({
        ok: false,
        error: `This feature requires a ${requiredPlan} plan or higher`,
        code: "PLAN_REQUIRED",
        requiredPlan,
        currentPlan: userPlan,
        upgradeUrl: "/billing"
      });
    }

    next();
  };
}

export const requirePro = requirePlan("pro");

export async function attachUserPlan(req, res, next) {
  if (req.dbUserId) {
    req.userPlan = await getUserPlan(req.dbUserId);
  } else {
    req.userPlan = "free";
  }
  next();
}

export function isPro(req) {
  return hasAccess(req.userPlan || "free", "pro");
}

export default {
  requirePlan,
  requirePro,
  attachUserPlan,
  isPro,
};
