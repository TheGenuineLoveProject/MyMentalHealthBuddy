// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function PhilosophicalInquiryPage() {
  const benefits = pickBenefits(["clarity", "connection", "selfRespect", "agency"], 4);
  
  const clarity = {
    what: "Guided exploration of philosophical questions about meaning, purpose, ethics, and existence.",
    why: "Philosophical reflection deepens understanding of yourself and your place in the world.",
    who: "Anyone curious about the deeper questions of life and meaning.",
    when: "During contemplative periods, when facing major decisions, or as ongoing practice.",
    where: "A quiet space for deep thinking, ideally with journaling available.",
    how: "Sit with questions without rushing to answers. Let the inquiry itself be valuable."
  };

  const examples = [
    { level: "Beginner", label: "Values Exploration", description: "What matters most to you? Why? How do you know?" },
    { level: "Intermediate", label: "Meaning Questions", description: "What gives your life meaning? Has this changed over time?" },
    { level: "Advanced", label: "Existential Inquiry", description: "Sit with profound questions about freedom, death, purpose, and connection." }
  ];

  return (
    <>
      <SEO
        title="Philosophical Inquiry | The Genuine Love Project"
        description="Exploring life's meaningful questions - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Philosophical Inquiry"
        subtitle="Exploring life's meaningful questions"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            The unexamined life may not be worth living—but the examined life is rarely comfortable.
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
