// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function GrowthAnalyticsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Deeper analysis of your growth across different wellness dimensions over time.",
    why: "Understanding which areas are developing helps you celebrate progress and identify focus areas.",
    who: "Those interested in data-driven self-improvement and long-term tracking.",
    when: "Monthly or quarterly deep-dives into your development.",
    where: "When you have time for thoughtful reflection on your growth trajectory.",
    how: "Review dimension-by-dimension progress. Set intentions based on insights."
  };

  const examples = [
    { level: "Beginner", label: "Dimension Overview", description: "See a simple breakdown of activity across emotional, physical, and mental wellness." },
    { level: "Intermediate", label: "Growth Rate Analysis", description: "Compare your pace of growth across different areas and time periods." },
    { level: "Advanced", label: "Predictive Insights", description: "Based on your patterns, see where you might focus for maximum impact." }
  ];

  return (
    <>
      <SEO
        title="Growth Analytics | The Genuine Love Project"
        description="Measuring your personal development - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Growth Analytics"
        subtitle="Measuring your personal development"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Growth isn't always linear. These insights help you see the bigger picture.
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
