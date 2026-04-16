// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ContentStudioPage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Tools to create custom prompts, practices, and content for your personal use.",
    why: "Personalized content is more powerful. Creating your own deepens engagement.",
    who: "Anyone wanting to customize their practice or create personal resources.",
    when: "When standard content doesn't quite fit, or when you want to create something personal.",
    where: "A focused space for creative work.",
    how: "Use our templates. Customize to your needs. Save and use in your practice."
  };

  const examples = [
    { level: "Beginner", label: "Custom Affirmations", description: "Create personalized affirmations that speak to your specific needs." },
    { level: "Intermediate", label: "Personal Rituals", description: "Design custom rituals and practices for your routine." },
    { level: "Advanced", label: "Full Practice Design", description: "Create comprehensive personal practices drawing on all tools." }
  ];

  return (
    <>
      <SEO
        title="Content Studio | MyMentalHealthBuddy"
        description="Create and customize your practice - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Content Studio"
        subtitle="Create and customize your practice"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            The best practices are often the ones you create yourself. Make this platform yours.
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
