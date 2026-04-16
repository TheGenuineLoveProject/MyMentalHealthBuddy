// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessCreativityPage() {
  const benefits = pickBenefits(["agency", "connection", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "Resources for using creative expression as a wellness and healing practice.",
    why: "Creativity accesses parts of us that words alone can't reach. It's a form of processing.",
    who: "Anyone wanting to explore creative expression for wellbeing. No skill required.",
    when: "When you need to process emotions, explore feelings, or just play.",
    where: "Anywhere you can create—home, outdoors, or community spaces.",
    how: "Choose a medium. Let go of outcome. Focus on the process, not the product."
  };

  const examples = [
    { level: "Beginner", label: "Creative Play", description: "Simple, pressure-free creative activities like doodling or collage." },
    { level: "Intermediate", label: "Expressive Arts", description: "Use art, music, or writing to process emotions and experiences." },
    { level: "Advanced", label: "Creative Practice", description: "Establish an ongoing creative practice as part of your wellness routine." }
  ];

  return (
    <>
      <SEO
        title="Creative Wellness | MyMentalHealthBuddy"
        description="Healing through creative expression - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Creative Wellness"
        subtitle="Healing through creative expression"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Creativity isn't about being good at art. It's about expression, play, and discovery.
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
