// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function ExamplesPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Real examples of how people use the tools and practices on this platform.",
    why: "Seeing examples inspires ideas and normalizes the learning process.",
    who: "Anyone wanting inspiration or guidance on how to use practices.",
    when: "When learning a new practice or seeking ideas.",
    where: "Browse anytime for inspiration.",
    how: "Read examples. Adapt ideas for your own practice. Share your own if inspired."
  };

  const examples = [
    { level: "Beginner", label: "Simple Practices", description: "Examples of 5-minute practices anyone can try." },
    { level: "Intermediate", label: "Combined Approaches", description: "How people combine multiple tools effectively." },
    { level: "Advanced", label: "Long-Term Journeys", description: "Stories of sustained practice over months and years." }
  ];

  return (
    <>
      <SEO
        title="Practice Examples | The Genuine Love Project"
        description="See how others practice - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Practice Examples"
        subtitle="See how others practice"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Learn from others' experiences. Adapt ideas for your own unique journey.
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
