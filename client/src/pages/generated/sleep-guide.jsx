// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SleepGuidePage() {
  const benefits = pickBenefits(["calm", "clarity", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "Evidence-based practices and gentle routines to improve sleep quality and duration.",
    why: "Quality sleep is foundational to mental health, emotional regulation, and physical wellbeing.",
    who: "Anyone struggling with falling asleep, staying asleep, or waking unrefreshed.",
    when: "Begin your wind-down 1-2 hours before bed. Consistency matters more than perfection.",
    where: "Your bedroom, ideally cool, dark, and quiet. Create a sanctuary for rest.",
    how: "Start with one change—consistent bedtime, screen limits, or a wind-down ritual. Build gradually."
  };

  const examples = [
    { level: "Beginner", label: "Screen Sunset", description: "Dim screens 1 hour before bed. Use night mode or blue light filters." },
    { level: "Intermediate", label: "Wind-Down Ritual", description: "Create a 15-minute pre-sleep routine: gentle stretching, reading, or breathing exercises." },
    { level: "Advanced", label: "Sleep Environment Optimization", description: "Cool room (65-68°F), blackout conditions, white noise if needed. Bed is for sleep only." }
  ];

  return (
    <>
      <SEO
        title="Sleep Wellness Guide | MyMentalHealthBuddy"
        description="Restful nights for restored days - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Sleep Wellness Guide"
        subtitle="Restful nights for restored days"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Better sleep often comes from small, consistent changes rather than dramatic overhauls. Start with what feels doable.
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
