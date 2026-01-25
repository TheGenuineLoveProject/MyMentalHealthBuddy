// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AccountSettingsPage() {
  const benefits = pickBenefits(["agency", "clarity", "selfRespect", "calm"], 4);
  
  const clarity = {
    what: "Security settings, notifications, and account preferences.",
    why: "Control your account security and how you receive updates.",
    who: "All users managing their account settings.",
    when: "When adjusting security or notification preferences.",
    where: "Access from your account area.",
    how: "Review settings. Adjust as needed. Enable security features."
  };

  const examples = [
    { level: "Beginner", label: "Security Basics", description: "Password, email verification, and login activity." },
    { level: "Intermediate", label: "Notifications", description: "Control what notifications you receive and how." },
    { level: "Advanced", label: "Advanced Security", description: "Two-factor authentication and security audit." }
  ];

  return (
    <>
      <SEO
        title="Account Settings | The Genuine Love Project"
        description="Security and preferences - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Account Settings"
        subtitle="Security and preferences"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your security matters. Review and update these settings regularly.
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
