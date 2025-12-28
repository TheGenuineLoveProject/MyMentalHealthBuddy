import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface InsightResponse {
  insight: string;
}

export function TodaysInsight() {
  const { data, isLoading } = useQuery<InsightResponse>({
    queryKey: ["/api/insights/daily"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--glp-ink)]/30" />
      </div>
    );
  }

  if (!data?.insight) return null;

  return (
    <div className="p-5 rounded-xl bg-[var(--glp-sage)]/5 border border-[var(--glp-sage)]/10">
      <p className="text-xs uppercase tracking-wide text-[var(--glp-ink)]/40 mb-3">
        Today's Insight
      </p>
      <blockquote 
        className="text-base leading-relaxed text-[var(--glp-ink)]/75"
        data-testid="text-daily-insight"
      >
        {data.insight}
      </blockquote>
    </div>
  );
}

export default TodaysInsight;
