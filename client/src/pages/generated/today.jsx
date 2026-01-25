// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function TodayPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "connection"], 4);
  
  const clarity = {
    what: "A daily selection of practices, prompts, and insights tailored to support your wellbeing today.",
    why: "Daily consistency builds lasting change. Small, focused practices compound over time.",
    who: "Anyone wanting a guided daily practice without having to decide what to do.",
    when: "Each morning to set your day, or whenever you need direction.",
    where: "Wherever you start your day or take a wellness break.",
    how: "Review today's offerings. Choose what resonates. Complete at least one practice."
  };

  const examples = [
    { level: "Beginner", label: "One Thing Today", description: "Just do one practice from today's selection. That's enough." },
    { level: "Intermediate", label: "Morning + Evening", description: "One practice to start your day, one to close it." },
    { level: "Advanced", label: "Full Daily Flow", description: "Morning intention, midday check-in, evening reflection." }
  ];

  return (
    <>
      <SEO
        title="Today's Practice | The Genuine Love Project"
        description="Your daily wellness focus - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Today's Practice"
        subtitle="Your daily wellness focus"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Today is a fresh start. What one small thing will you do to care for yourself?
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
