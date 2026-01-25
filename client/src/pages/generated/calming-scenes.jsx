// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CalmingScenesPage() {
  const benefits = pickBenefits(["calm", "clarity", "connection", "agency"], 4);
  
  const clarity = {
    what: "Peaceful images and sounds from nature to help you relax and reset your nervous system.",
    why: "Visual calm activates your parasympathetic nervous system, reducing stress and promoting relaxation.",
    who: "Anyone needing a quick mental escape or visual break from stress.",
    when: "During breaks, before sleep, or when feeling overwhelmed.",
    where: "Anywhere you can view a screen and ideally use headphones.",
    how: "Choose a scene. Breathe slowly. Let your eyes soften. Stay for at least 2-3 minutes."
  };

  const examples = [
    { level: "Beginner", label: "2-Minute Nature Break", description: "Watch gentle waves, forest scenes, or clouds passing. Just observe and breathe." },
    { level: "Intermediate", label: "Guided Visual Journey", description: "Follow a narrated visualization through peaceful landscapes." },
    { level: "Advanced", label: "Visualization Practice", description: "Close your eyes and mentally construct your own peaceful scene in detail." }
  ];

  return (
    <>
      <SEO
        title="Calming Scenes | The Genuine Love Project"
        description="Visual escapes for mental rest - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Calming Scenes"
        subtitle="Visual escapes for mental rest"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Let your mind rest. These scenes are here whenever you need a moment of peace.
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
