import { getTodaysInsight } from "@/intelligence/insightEngine";
import { tokens } from "@/brand/tokens";

export function TodaysInsight() {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        padding: tokens.spacing.lg,
        borderRadius: tokens.radius.md,
        border: `1px solid ${tokens.colors.border}`,
      }}
    >
      <h3>Today’s Insight</h3>
      <p style={{ color: tokens.colors.textSecondary }}>
        {getTodaysInsight()}
      </p>
    </div>
  );
}