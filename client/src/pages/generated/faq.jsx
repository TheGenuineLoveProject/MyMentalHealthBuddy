// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function FaqPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Answers to questions we hear most often about the platform and our approach.",
    why: "Clear answers reduce confusion and help you use the platform effectively.",
    who: "Anyone with questions about how things work here.",
    when: "When you have questions or need clarification.",
    where: "Reference anytime.",
    how: "Search or browse by category to find your answer."
  };

  const examples = [
    { level: "Beginner", label: "Getting Started Questions", description: "Common questions for new users." },
    { level: "Intermediate", label: "Feature Questions", description: "How specific features and tools work." },
    { level: "Advanced", label: "Technical & Billing", description: "Account, subscription, and technical questions." }
  ];

  return (
    <>
      <SEO
        title="Frequently Asked Questions | The Genuine Love Project"
        description="Answers to common questions - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Frequently Asked Questions"
        subtitle="Answers to common questions"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Can't find your answer? Contact our support team—we're here to help.
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
