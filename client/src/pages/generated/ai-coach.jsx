// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AiCoachPage() {
  const benefits = pickBenefits(["connection", "clarity", "agency", "calm"], 4);
  
  const clarity = {
    what: "An AI coaching companion offering personalized guidance and encouragement.",
    why: "Having a supportive presence available anytime can help you stay on track.",
    who: "Anyone wanting additional support and guidance in their wellness journey.",
    when: "Daily check-ins, when facing challenges, or when you need encouragement.",
    where: "Available whenever you need support.",
    how: "Share what's happening. Receive personalized guidance. Apply what helps."
  };

  const examples = [
    { level: "Beginner", label: "Daily Check-In", description: "Brief daily conversations about how you're doing." },
    { level: "Intermediate", label: "Goal Support", description: "Guidance and accountability for your wellness goals." },
    { level: "Advanced", label: "Deep Reflection", description: "Extended conversations for processing challenges." }
  ];

  return (
    <>
      <SEO
        title="AI Wellness Coach | The Genuine Love Project"
        description="Personalized guidance and support - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="AI Wellness Coach"
        subtitle="Personalized guidance and support"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your AI coach is here to support, not replace, human connection and professional help.
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
