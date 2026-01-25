// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function SocialPage() {
  const benefits = pickBenefits(["connection", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Links to our social media presence and community spaces.",
    why: "Connection beyond the platform for ongoing inspiration and community.",
    who: "Anyone wanting to connect with us on social platforms.",
    when: "When you want daily inspiration or community interaction.",
    where: "Follow us on your preferred social platforms.",
    how: "Follow, engage, share. Join the conversation."
  };

  const examples = [
    { level: "Beginner", label: "Follow Along", description: "Follow us for daily wellness tips and inspiration." },
    { level: "Intermediate", label: "Engage & Share", description: "Comment, share what resonates, connect with others." },
    { level: "Advanced", label: "Community Contribution", description: "Share your journey to inspire others." }
  ];

  return (
    <>
      <SEO
        title="Social Connection | The Genuine Love Project"
        description="Connect with our community - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Social Connection"
        subtitle="Connect with our community"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Join our growing community across social platforms. We'd love to connect.
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
