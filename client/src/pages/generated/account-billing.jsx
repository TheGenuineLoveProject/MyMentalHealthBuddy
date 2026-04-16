// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AccountBillingPage() {
  const benefits = pickBenefits(["clarity", "agency", "calm", "selfRespect"], 4);
  
  const clarity = {
    what: "Your subscription status, payment methods, and billing history.",
    why: "Transparency about billing and easy management of your subscription.",
    who: "Subscribers managing their billing information.",
    when: "When you need to update payment info or check billing.",
    where: "Access from your account area.",
    how: "Review status. Update payment methods. Download invoices if needed."
  };

  const examples = [
    { level: "Beginner", label: "Current Plan", description: "See your subscription status and renewal date." },
    { level: "Intermediate", label: "Payment Methods", description: "Update or change your payment information." },
    { level: "Advanced", label: "Billing History", description: "View past invoices and payment history." }
  ];

  return (
    <>
      <SEO
        title="Billing & Subscription | MyMentalHealthBuddy"
        description="Manage your payment details - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Billing & Subscription"
        subtitle="Manage your payment details"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Manage your subscription with full transparency. Cancel anytime.
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
