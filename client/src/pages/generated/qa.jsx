// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function QaPage() {
  const benefits = pickBenefits(["clarity", "connection", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Recorded and live Q&A sessions addressing community questions.",
    why: "Your questions matter. Hearing others' questions often helps you too.",
    who: "Anyone with questions or wanting to learn from others' questions.",
    when: "Watch recordings anytime. Join live sessions as scheduled.",
    where: "Available on the platform.",
    how: "Watch recordings. Submit questions for future sessions. Join live when available."
  };

  const examples = [
    { level: "Beginner", label: "Getting Started Q&A", description: "Common questions for those new to wellness practice." },
    { level: "Intermediate", label: "Topic Q&As", description: "Deep dives on specific topics based on community interest." },
    { level: "Advanced", label: "Submit Questions", description: "Contribute your questions for future sessions." }
  ];

  return (
    <>
      <SEO
        title="Q&A Sessions | The Genuine Love Project"
        description="Your questions answered - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Q&A Sessions"
        subtitle="Your questions answered"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            No question is too simple. Asking is how we learn.
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
