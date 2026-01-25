// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function StrategyMapsPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Visual planning tools to map out your wellness goals, obstacles, and paths forward.",
    why: "Strategic thinking applied to personal growth increases clarity and follow-through.",
    who: "Anyone wanting to be more intentional about their growth path and overcome obstacles.",
    when: "During planning periods, when facing obstacles, or when setting new goals.",
    where: "A quiet space with room to think, ideally with paper or digital tools for mapping.",
    how: "Clarify your goal. Map current obstacles. Identify resources. Plan specific next steps."
  };

  const examples = [
    { level: "Beginner", label: "Goal Clarity Map", description: "Define what you want, why it matters, and one small first step." },
    { level: "Intermediate", label: "Obstacle Analysis", description: "Map what's been blocking you. Identify which obstacles are internal vs external." },
    { level: "Advanced", label: "Systems Design", description: "Design your environment, routines, and relationships to support your goals automatically." }
  ];

  return (
    <>
      <SEO
        title="Strategy Maps | The Genuine Love Project"
        description="Planning your growth with intention - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Strategy Maps"
        subtitle="Planning your growth with intention"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Strategy without action is just dreaming. Use these maps to clarify, then take the first step.
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
