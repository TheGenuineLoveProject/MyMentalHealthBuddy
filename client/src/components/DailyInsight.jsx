import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export default function DailyInsight() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/insights/daily"],
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="py-4 border-t border-[var(--glp-ink)]/8">
        <div className="h-4 w-48 bg-[var(--glp-ink)]/5 rounded animate-pulse" />
      </div>
    );
  }

  if (!data?.insight) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Daily Insight — The Genuine Love Project" description="Explore daily insight tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Daily Insight</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

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
