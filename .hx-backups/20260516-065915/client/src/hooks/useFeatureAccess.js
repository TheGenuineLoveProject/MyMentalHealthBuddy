import { useAuth } from "@/context/AuthContext";
import { FEATURE_ACCESS } from "@/config/featureAccess";

export function useFeatureAccess(featureKey) {
  const { subscriptionStatus, isPro } = useAuth();

  const feature = FEATURE_ACCESS[featureKey];

  if (!feature) {
    return {
      allowed: true,
      reason: "unknown_feature",
      feature: null,
      subscriptionStatus,
    };
  }

  const requiredPlan = feature.requiredPlan || "free";
  const allowed =
    requiredPlan === "free" ||
    (requiredPlan === "pro" && isPro);

  return {
    allowed,
    reason: allowed ? "access_granted" : "upgrade_required",
    feature,
    subscriptionStatus,
    isPro,
    requiredPlan,
    freeLimit: feature.freeLimit ?? null,
    proLimit: feature.proLimit ?? null,
  };
}

export function checkFeatureAccess(featureKey, subscriptionStatus) {
  const feature = FEATURE_ACCESS[featureKey];
  if (!feature) return { allowed: true, reason: "unknown_feature" };

  const isPro = subscriptionStatus === "pro";
  const requiredPlan = feature.requiredPlan || "free";
  const allowed = requiredPlan === "free" || (requiredPlan === "pro" && isPro);

  return {
    allowed,
    reason: allowed ? "access_granted" : "upgrade_required",
    requiredPlan,
  };
}
