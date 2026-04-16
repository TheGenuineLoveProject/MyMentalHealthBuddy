// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function BehaviorChangePage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Evidence-based strategies for changing habits and creating lasting behavioral shifts.",
    why: "Lasting change comes from understanding how habits work and designing for success.",
    who: "Anyone wanting to build new habits, break old patterns, or align actions with intentions.",
    when: "When you're ready to make a specific change. Start with one habit at a time.",
    where: "In your daily environment. Design your space to support the change you want.",
    how: "Start impossibly small. Stack new habits onto existing routines. Celebrate tiny wins."
  };

  const examples = [
    { level: "Beginner", label: "Tiny Habit", description: "After [existing habit], I will [new tiny action]. Example: After I brush my teeth, I will do one stretch." },
    { level: "Intermediate", label: "Environment Design", description: "Make the desired behavior easy and visible. Remove friction from good habits, add friction to unwanted ones." },
    { level: "Advanced", label: "Identity Shift", description: "Instead of 'I want to exercise,' try 'I am someone who moves their body.' Align identity with action." }
  ];

  return (
    <>
      <SEO
        title="Behavior Change | MyMentalHealthBuddy"
        description="Building habits that align with your values - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Behavior Change"
        subtitle="Building habits that align with your values"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Change is hard. That's normal. Focus on systems, not willpower. Small, consistent steps lead to lasting transformation.
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
