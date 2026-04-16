// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function BlogPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Our collection of articles exploring wellness topics, research, and practical guidance.",
    why: "Reading helps you learn, gain perspective, and feel less alone in your experiences.",
    who: "Anyone seeking information, inspiration, or new perspectives on wellness.",
    when: "During learning time, when exploring a topic, or when you need inspiration.",
    where: "Read at your own pace, anywhere comfortable.",
    how: "Browse by topic or interest. Read what calls to you. Apply what resonates."
  };

  const examples = [
    { level: "Beginner", label: "Quick Reads", description: "Short articles you can read in 5 minutes or less." },
    { level: "Intermediate", label: "Deep Dives", description: "Comprehensive explorations of specific topics." },
    { level: "Advanced", label: "Research Summaries", description: "Evidence-based articles with practical applications." }
  ];

  return (
    <>
      <SEO
        title="Wellness Blog | MyMentalHealthBuddy"
        description="Articles for your journey - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Blog"
        subtitle="Articles for your journey"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Our blog grows regularly with new insights to support your journey.
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
