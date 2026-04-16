// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessSleepPage() {
  const benefits = pickBenefits(["calm", "clarity", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "Comprehensive resources for improving sleep quality and establishing healthy sleep patterns.",
    why: "Sleep is foundational to mental and physical health. Better sleep improves everything else.",
    who: "Anyone struggling with sleep or wanting to optimize their rest.",
    when: "Review during the day. Practice evening routines before bed.",
    where: "Your bedroom and evening environment.",
    how: "Start with sleep hygiene basics. Build consistent routines. Track what works."
  };

  const examples = [
    { level: "Beginner", label: "Sleep Hygiene", description: "Basic practices for better sleep: consistent times, dark room, no screens." },
    { level: "Intermediate", label: "Wind-Down Routine", description: "Create a 30-minute pre-sleep ritual to signal rest time." },
    { level: "Advanced", label: "Sleep Optimization", description: "Track and optimize all factors affecting your sleep quality." }
  ];

  return (
    <>
      <SEO
        title="Sleep Wellness | MyMentalHealthBuddy"
        description="Restoring through quality rest - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Sleep Wellness"
        subtitle="Restoring through quality rest"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Sleep is when your body and mind heal. Prioritizing rest is an act of self-care.
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
