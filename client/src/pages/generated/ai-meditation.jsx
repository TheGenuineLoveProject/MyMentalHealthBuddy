// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function AiMeditationPage() {
  const benefits = pickBenefits(["calm", "clarity", "connection", "agency"], 4);
  
  const clarity = {
    what: "AI-customized meditation sessions based on your current needs and preferences.",
    why: "Personalized meditation can be more effective than generic sessions.",
    who: "Anyone wanting meditation tailored to their current state and goals.",
    when: "Whenever you need a meditation practice suited to the moment.",
    where: "A quiet space for meditation practice.",
    how: "Share how you're feeling. Receive a customized meditation. Practice and reflect."
  };

  const examples = [
    { level: "Beginner", label: "State-Based Sessions", description: "Meditations customized to your current emotional state." },
    { level: "Intermediate", label: "Goal-Oriented Practice", description: "Sessions designed for specific outcomes like sleep or focus." },
    { level: "Advanced", label: "Deep Practice", description: "Extended, highly personalized meditation experiences." }
  ];

  return (
    <>
      <SEO
        title="AI-Guided Meditation | The Genuine Love Project"
        description="Personalized meditation experiences - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="AI-Guided Meditation"
        subtitle="Personalized meditation experiences"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Meditation meets you where you are. These personalized sessions adapt to your needs.
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
