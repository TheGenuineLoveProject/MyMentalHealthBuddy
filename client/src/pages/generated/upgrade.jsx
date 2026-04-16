// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function UpgradePage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "connection"], 4);
  
  const clarity = {
    what: "Options to upgrade your subscription for additional features.",
    why: "Upgrading unlocks more tools and personalized support.",
    who: "Free users ready for more, or existing subscribers wanting to upgrade.",
    when: "When you're ready for more features and willing to invest.",
    where: "Complete your upgrade here.",
    how: "Choose your plan. Complete payment. Access new features immediately."
  };

  const examples = [
    { level: "Beginner", label: "Choose Your Plan", description: "Compare plans and select what fits your needs." },
    { level: "Intermediate", label: "Secure Checkout", description: "Complete your subscription securely." },
    { level: "Advanced", label: "Manage Subscription", description: "Change, pause, or cancel your subscription anytime." }
  ];

  return (
    <>
      <SEO
        title="Upgrade Your Plan | MyMentalHealthBuddy"
        description="Access more features - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Upgrade Your Plan"
        subtitle="Access more features"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            There's no pressure to upgrade. Only do so if premium features genuinely serve your journey.
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
