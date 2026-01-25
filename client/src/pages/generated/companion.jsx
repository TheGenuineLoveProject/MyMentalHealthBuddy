// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function CompanionPage() {
  const benefits = pickBenefits(["connection", "calm", "clarity", "agency"], 4);
  
  const clarity = {
    what: "A supportive AI companion that offers encouragement, prompts, and gentle guidance.",
    why: "Sometimes we need a gentle presence to check in, reflect with, or receive encouragement from.",
    who: "Anyone wanting daily support, a reflection partner, or gentle accountability.",
    when: "Daily check-ins, when processing thoughts, or when you need encouragement.",
    where: "Available whenever you need support, on any device.",
    how: "Share what's on your mind. Receive supportive responses. Use prompts for deeper reflection."
  };

  const examples = [
    { level: "Beginner", label: "Morning Check-In", description: "Share how you're feeling this morning. Receive a supportive response and intention prompt." },
    { level: "Intermediate", label: "Processing Partner", description: "Talk through a challenge or decision. Receive reflective questions to clarify your thinking." },
    { level: "Advanced", label: "Growth Accountability", description: "Set intentions, track progress, and receive gentle check-ins on your growth journey." }
  ];

  return (
    <>
      <SEO
        title="Wellness Companion | The Genuine Love Project"
        description="Your supportive guide through each day - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Wellness Companion"
        subtitle="Your supportive guide through each day"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your companion is here to support, not replace human connection. Use it as one tool in your wellness toolkit.
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
