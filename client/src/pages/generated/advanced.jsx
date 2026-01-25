// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AdvancedPage() {
  const benefits = pickBenefits(["clarity", "agency", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "More intensive practices for those ready to go deeper in their healing and growth work.",
    why: "After building foundations, deeper practices can catalyze breakthrough insights and lasting change.",
    who: "Those with an established practice who are ready for more intensive exploration.",
    when: "When you feel stable and resourced. Not during acute crisis. With support available if needed.",
    where: "A safe, private space where you can be fully present. Some benefit from professional guidance.",
    how: "Move slowly. Honor resistance as protection. Have support available. Integration is as important as insight."
  };

  const examples = [
    { level: "Beginner", label: "Extended Meditation", description: "Gradually increase meditation time from 10 to 30+ minutes. Notice what emerges in longer sits." },
    { level: "Intermediate", label: "Shadow Work", description: "Explore disowned parts of yourself through journaling, visualization, or with a therapist." },
    { level: "Advanced", label: "Somatic Processing", description: "Work with the body to release stored tension and trauma. Best done with trained guidance." }
  ];

  return (
    <>
      <SEO
        title="Advanced Practices | The Genuine Love Project"
        description="Deeper work for continued growth - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Advanced Practices"
        subtitle="Deeper work for continued growth"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Advanced doesn't mean better—it means more intensive. Ensure you have proper support for deeper work.
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
