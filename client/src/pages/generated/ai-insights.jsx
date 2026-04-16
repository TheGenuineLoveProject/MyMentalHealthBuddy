// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AiInsightsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "AI-generated insights based on your patterns, practices, and progress.",
    why: "Pattern recognition can reveal insights you might miss on your own.",
    who: "Users with enough data for meaningful analysis.",
    when: "Review periodically to discover patterns and insights.",
    where: "Access from your dashboard.",
    how: "Review insights. Reflect on what resonates. Apply what's helpful."
  };

  const examples = [
    { level: "Beginner", label: "Pattern Highlights", description: "Simple observations about your wellness patterns." },
    { level: "Intermediate", label: "Trend Analysis", description: "How your patterns have changed over time." },
    { level: "Advanced", label: "Predictive Insights", description: "Suggestions based on what's worked for you." }
  ];

  return (
    <>
      <SEO
        title="AI Insights | MyMentalHealthBuddy"
        description="Personalized wisdom from your data - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="AI Insights"
        subtitle="Personalized wisdom from your data"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            AI helps surface patterns. You decide what the insights mean for your life.
          </p>
          <p className="text-sm opacity-70 mt-6">
            Adults 18+ only. Educational wellness tools, not medical care or mental health treatment.
            You may pause or stop at any time.
          </p>
        </div>
      </WellnessPageShell>
    </>
  );
}
