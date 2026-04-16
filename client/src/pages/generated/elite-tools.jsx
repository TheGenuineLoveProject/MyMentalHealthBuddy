// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function EliteToolsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Our most sophisticated tools for those with established practices seeking cutting-edge approaches.",
    why: "Advanced practitioners benefit from refined tools that match their level of development.",
    who: "Those who have completed foundational work and seek more nuanced, powerful practices.",
    when: "After significant foundational work. When you're ready to take your practice to new levels.",
    where: "Designed for deep, focused practice sessions with adequate time and space.",
    how: "Approach with respect for the power of these tools. Move slowly. Integrate thoroughly."
  };

  const examples = [
    { level: "Beginner", label: "Advanced Breathwork", description: "Extended breathing protocols that access deeper states of awareness and release." },
    { level: "Intermediate", label: "Somato-Emotional Release", description: "Working with the body-mind connection to release stored patterns and tension." },
    { level: "Advanced", label: "Transpersonal Practices", description: "Practices that explore consciousness, interconnection, and expanded states of being." }
  ];

  return (
    <>
      <SEO
        title="Elite Wellness Tools | MyMentalHealthBuddy"
        description="Premium practices for dedicated practitioners - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Elite Wellness Tools"
        subtitle="Premium practices for dedicated practitioners"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Elite tools require a solid foundation. If you're new to wellness work, start with our foundational tools first.
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
