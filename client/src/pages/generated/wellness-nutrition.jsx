// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessNutritionPage() {
  const benefits = pickBenefits(["clarity", "calm", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "Resources for understanding how nutrition affects mental wellness and energy.",
    why: "What we eat directly affects how we feel, think, and cope with stress.",
    who: "Anyone wanting to understand the food-mood connection.",
    when: "When planning meals or noticing food-mood patterns.",
    where: "In your kitchen and daily food choices.",
    how: "Notice how different foods affect you. Make small, sustainable changes."
  };

  const examples = [
    { level: "Beginner", label: "Food-Mood Basics", description: "Understanding how nutrition affects mental state." },
    { level: "Intermediate", label: "Energy Eating", description: "Foods that support stable energy and mood throughout the day." },
    { level: "Advanced", label: "Mindful Eating", description: "Develop a healthy, intuitive relationship with food." }
  ];

  return (
    <>
      <SEO
        title="Nutrition Wellness | The Genuine Love Project"
        description="Nourishing body and mind - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Nutrition Wellness"
        subtitle="Nourishing body and mind"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Nourishment is more than calories. Discover how food supports your wellbeing.
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
