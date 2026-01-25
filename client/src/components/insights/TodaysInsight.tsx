import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

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

  if (!data?.insight) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Todays Insight — The Genuine Love Project" description="Explore todays insight tools for your wellness journey." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Todays Insight</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  return (
    <div className="p-5 rounded-xl bg-[var(--glp-sage)]/5 border border-[var(--glp-sage)]/10">
      <p className="text-xs text-[var(--glp-ink)]/40 mb-3">
        A thought you may want to sit with today
      </p>
      <blockquote 
        className="text-base leading-relaxed text-[var(--glp-ink)]/75"
        data-testid="text-daily-thought"
      >
        {data.insight}
      </blockquote>
      <p className="text-xs text-[var(--glp-ink)]/30 mt-4 italic">
        Take it or leave it. You know yourself best.
      </p>
    </div>
  );
}

export default TodaysInsight;
