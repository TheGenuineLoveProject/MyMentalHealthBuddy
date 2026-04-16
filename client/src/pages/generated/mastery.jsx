// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function MasteryPage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Long-term practices for those committed to sustained growth and deepening their wellness journey.",
    why: "True mastery comes from consistent, devoted practice over months and years, not quick fixes.",
    who: "Those with established practices seeking to deepen their commitment and refine their approach.",
    when: "As a long-term path, not a quick intervention. When you're ready for sustained commitment.",
    where: "Integrated into daily life. Mastery happens in the ordinary moments.",
    how: "Commit to consistent practice. Embrace the plateau. Trust the process. Seek guidance when stuck."
  };

  const examples = [
    { level: "Beginner", label: "100-Day Commitment", description: "Choose one practice. Do it every day for 100 days. Track your journey." },
    { level: "Intermediate", label: "Teaching Others", description: "Share what you've learned. Teaching deepens understanding and creates community." },
    { level: "Advanced", label: "Integrated Living", description: "Your practice becomes invisible—woven into how you live, work, and relate to others." }
  ];

  return (
    <>
      <SEO
        title="Mastery Practices | MyMentalHealthBuddy"
        description="Excellence through devoted practice - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Mastery Practices"
        subtitle="Excellence through devoted practice"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Mastery isn't about perfection. It's about showing up, again and again, with humility and devotion.
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
