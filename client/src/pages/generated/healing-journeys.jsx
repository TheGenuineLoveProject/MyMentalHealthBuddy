// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function HealingJourneysPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Structured programs that guide you through specific healing themes over days or weeks.",
    why: "Sustained focus on one area creates deeper change than scattered efforts.",
    who: "Anyone ready for focused healing work on specific themes like grief, self-worth, or relationships.",
    when: "When you're ready for deeper work and can commit to a daily practice.",
    where: "A consistent space where you can journal, reflect, and practice regularly.",
    how: "Choose a journey. Commit to the daily practice. Allow the process to unfold over time."
  };

  const examples = [
    { level: "Beginner", label: "7-Day Self-Compassion", description: "One week of daily practices to cultivate kindness toward yourself." },
    { level: "Intermediate", label: "21-Day Emotional Release", description: "Three weeks of guided journaling and exercises to process stuck emotions." },
    { level: "Advanced", label: "90-Day Transformation", description: "A comprehensive program integrating multiple healing modalities over three months." }
  ];

  return (
    <>
      <SEO
        title="Healing Journeys | MyMentalHealthBuddy"
        description="Guided paths toward wholeness - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Healing Journeys"
        subtitle="Guided paths toward wholeness"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Healing takes time. These structured journeys provide guidance while honoring your unique pace and path.
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
