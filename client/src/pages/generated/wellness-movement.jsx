// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessMovementPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "connection"], 4);
  
  const clarity = {
    what: "Resources for using movement and exercise to support mental wellness.",
    why: "Movement is one of the most effective natural mood regulators available.",
    who: "Anyone wanting to use physical activity for mental health benefits.",
    when: "Daily for best results. Even short bursts of movement help.",
    where: "Anywhere you can move—home, outdoors, gym, or office.",
    how: "Start where you are. Any movement counts. Find what you enjoy."
  };

  const examples = [
    { level: "Beginner", label: "Gentle Movement", description: "Low-intensity options like walking, stretching, or gentle yoga." },
    { level: "Intermediate", label: "Mood-Boosting Exercise", description: "Activities specifically designed to lift mood and reduce anxiety." },
    { level: "Advanced", label: "Movement Practice", description: "Develop a sustainable movement practice that supports long-term wellness." }
  ];

  return (
    <>
      <SEO
        title="Movement Wellness | MyMentalHealthBuddy"
        description="Moving for mental health - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Movement Wellness"
        subtitle="Moving for mental health"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your body was made to move. Find movement that feels good, not punishing.
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
