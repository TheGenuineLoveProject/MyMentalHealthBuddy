// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SupportFeedbackPage() {
  const benefits = pickBenefits(["agency", "connection", "clarity", "selfRespect"], 4);
  
  const clarity = {
    what: "A channel for sharing your feedback, suggestions, and ideas.",
    why: "Your feedback shapes how we improve. We genuinely want to hear from you.",
    who: "Anyone with thoughts on how we can do better.",
    when: "Whenever you have feedback—positive or constructive.",
    where: "Submit feedback through this page.",
    how: "Share your thoughts. We read everything. We respond when possible."
  };

  const examples = [
    { level: "Beginner", label: "Quick Feedback", description: "Share a quick thought or reaction." },
    { level: "Intermediate", label: "Feature Suggestions", description: "Suggest new features or improvements." },
    { level: "Advanced", label: "Detailed Input", description: "Provide comprehensive feedback on your experience." }
  ];

  return (
    <>
      <SEO
        title="Share Feedback | The Genuine Love Project"
        description="Help us improve - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Share Feedback"
        subtitle="Help us improve"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            We're always improving. Your feedback helps us serve you better.
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
