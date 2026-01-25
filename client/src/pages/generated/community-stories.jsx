// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CommunityStoriesPage() {
  const benefits = pickBenefits(["connection", "clarity", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "Stories from community members sharing their wellness journeys.",
    why: "Hearing others' stories normalizes struggle and inspires possibility.",
    who: "Anyone seeking inspiration or feeling alone in their journey.",
    when: "When you need encouragement or want to feel less alone.",
    where: "Read at your own pace.",
    how: "Read stories that resonate. Share your own when ready."
  };

  const examples = [
    { level: "Beginner", label: "Getting Started Stories", description: "How others began their wellness journey." },
    { level: "Intermediate", label: "Overcoming Challenges", description: "Stories of working through difficult times." },
    { level: "Advanced", label: "Transformation Stories", description: "Long-term journeys of profound change." }
  ];

  return (
    <>
      <SEO
        title="Community Stories | The Genuine Love Project"
        description="Journeys of healing and growth - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Community Stories"
        subtitle="Journeys of healing and growth"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Everyone's journey is unique. These stories remind us we're not alone.
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
