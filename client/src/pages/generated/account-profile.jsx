// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AccountProfilePage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Your account information and profile settings.",
    why: "Keep your information current and manage your account.",
    who: "Logged-in users managing their account.",
    when: "When you need to update information or check your profile.",
    where: "Access from your account area.",
    how: "Review information. Update as needed. Changes save automatically."
  };

  const examples = [
    { level: "Beginner", label: "View Profile", description: "See your current profile information." },
    { level: "Intermediate", label: "Update Information", description: "Change your name, email, or other details." },
    { level: "Advanced", label: "Data Export", description: "Download your data or request account deletion." }
  ];

  return (
    <>
      <SEO
        title="Your Profile | MyMentalHealthBuddy"
        description="Manage your account information - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Your Profile"
        subtitle="Manage your account information"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your account, your control. Update your information anytime.
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
