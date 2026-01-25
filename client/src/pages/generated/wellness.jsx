// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function WellnessPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "connection"], 4);
  
  const clarity = {
    what: "An introduction to our approach to wellness—holistic, trauma-informed, and self-directed.",
    why: "Understanding the philosophy behind the tools helps you use them more effectively.",
    who: "Anyone new to the platform or seeking to understand our approach.",
    when: "When getting started, or when you want to revisit the foundations.",
    where: "Read at your own pace, anywhere comfortable.",
    how: "Explore the different dimensions of wellness we address. Find what resonates with your needs."
  };

  const examples = [
    { level: "Beginner", label: "Quick Start", description: "Begin with one simple tool. Experience the approach before learning more about it." },
    { level: "Intermediate", label: "Dimension Deep Dive", description: "Learn about each dimension of wellness: physical, emotional, relational, spiritual." },
    { level: "Advanced", label: "Holistic Integration", description: "Understand how different practices work together for comprehensive wellbeing." }
  ];

  return (
    <>
      <SEO
        title="Wellness Overview | The Genuine Love Project"
        description="Your path to holistic wellbeing - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Overview"
        subtitle="Your path to holistic wellbeing"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Wellness isn't one-size-fits-all. We're here to help you find what works for your unique journey.
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
