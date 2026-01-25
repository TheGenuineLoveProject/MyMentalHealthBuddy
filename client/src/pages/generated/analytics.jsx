// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AnalyticsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Visual summaries of your wellness activities, moods, and patterns over time.",
    why: "Data helps you see progress that feels invisible day-to-day. Patterns reveal what's working.",
    who: "Anyone who has been tracking practices and wants to understand their trends.",
    when: "Weekly or monthly reviews to see the bigger picture.",
    where: "When you have time to reflect on what the data reveals.",
    how: "Review your charts and summaries. Notice patterns. Adjust your approach based on insights."
  };

  const examples = [
    { level: "Beginner", label: "Weekly Summary", description: "See which days you practiced and how your mood trended." },
    { level: "Intermediate", label: "Correlation Insights", description: "Discover connections between activities (sleep, exercise, journaling) and mood." },
    { level: "Advanced", label: "Long-Term Trends", description: "View months of data to see lasting changes and areas for continued growth." }
  ];

  return (
    <>
      <SEO
        title="Wellness Analytics | The Genuine Love Project"
        description="Insights from your practice data - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Analytics"
        subtitle="Insights from your practice data"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your data tells a story. Let it guide your journey, not define it.
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
