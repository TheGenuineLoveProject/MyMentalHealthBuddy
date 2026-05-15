import { useQuery } from "@tanstack/react-query";

export default function DailyInsight() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/insights/daily"],
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="py-4 border-t border-[var(--glp-ink)]/8">
        <div className="h-4 w-48 bg-[var(--glp-ink)]/5 rounded animate-pulse motion-reduce:animate-none" />
      </div>
    );
  }

  if (!data?.insight) return null;

  return (
    <div className="py-4 border-t border-[var(--glp-ink)]/8" data-testid="daily-thought">
      <p className="text-xs text-[var(--glp-ink)]/40 mb-2">
        A thought you may want to sit with
      </p>
      <p className="text-sm text-[var(--glp-ink)]/50 italic">
        {data.insight}
      </p>
    </div>
  );
}
