// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function PremiumPage() {
  const benefits = pickBenefits(["agency", "clarity", "connection", "selfRespect"], 4);
  
  const clarity = {
    what: "An overview of premium features available with a subscription.",
    why: "Premium features enable deeper practice and more personalized support.",
    who: "Anyone ready to invest more deeply in their wellness journey.",
    when: "When you're ready for more than the free tier offers.",
    where: "Learn about and subscribe to premium features.",
    how: "Review features. Choose a plan that fits. Upgrade when ready."
  };

  const examples = [
    { level: "Beginner", label: "Feature Overview", description: "What's included in premium subscriptions." },
    { level: "Intermediate", label: "Plan Comparison", description: "Compare different subscription options." },
    { level: "Advanced", label: "Enterprise Options", description: "Options for teams and organizations." }
  ];

  return (
    <>
      <SEO
        title="Premium Features | MyMentalHealthBuddy"
        description="Unlock your full potential - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Premium Features"
        subtitle="Unlock your full potential"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Premium is optional. The free tier offers real value. Upgrade only when it makes sense for you.
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
