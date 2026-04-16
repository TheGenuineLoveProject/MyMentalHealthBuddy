// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessNaturePage() {
  const benefits = pickBenefits(["calm", "connection", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "Resources for connecting with nature as a wellness practice.",
    why: "Time in nature reduces stress, improves mood, and restores mental clarity.",
    who: "Anyone seeking the healing benefits of the natural world.",
    when: "Daily if possible. Even brief nature exposure helps.",
    where: "Outdoors—parks, gardens, forests, water, or even houseplants.",
    how: "Get outside. Engage your senses. Let nature do the work."
  };

  const examples = [
    { level: "Beginner", label: "Nature Breaks", description: "Short outdoor breaks during your day for stress relief." },
    { level: "Intermediate", label: "Forest Bathing", description: "Slow, sensory immersion in natural environments." },
    { level: "Advanced", label: "Nature Connection", description: "Develop a deep, ongoing relationship with the natural world." }
  ];

  return (
    <>
      <SEO
        title="Nature Wellness | MyMentalHealthBuddy"
        description="Healing through the natural world - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Nature Wellness"
        subtitle="Healing through the natural world"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Nature heals. Even a few minutes outside can shift your nervous system toward calm.
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
