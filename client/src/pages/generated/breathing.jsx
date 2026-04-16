// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function BreathingPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Simple breathing techniques that help regulate your nervous system and bring you back to a calmer state.",
    why: "When we're stressed, our breath becomes shallow. Intentional breathing signals safety to your body and mind.",
    who: "Anyone feeling anxious, overwhelmed, or wanting a quick reset. No experience needed.",
    when: "Anytime you notice tension, before difficult conversations, or as a daily practice.",
    where: "Anywhere quiet enough to focus for a few minutes—home, office, or outdoors.",
    how: "Follow the guided pace. Breathe in through your nose, out through your mouth. Start with 2-3 minutes."
  };

  const examples = [
    { level: "Beginner", label: "4-4 Box Breath", description: "Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 3 times." },
    { level: "Intermediate", label: "Extended Exhale", description: "Inhale for 4 counts, exhale for 6-8 counts. The longer exhale activates your calming response." },
    { level: "Advanced", label: "Coherent Breathing", description: "5 breaths per minute for 10 minutes. This rhythm synchronizes heart and brain for deep calm." }
  ];

  return (
    <>
      <SEO
        title="Breathing Exercises | MyMentalHealthBuddy"
        description="Gentle breath practices to calm your nervous system - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Breathing Exercises"
        subtitle="Gentle breath practices to calm your nervous system"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Choose a breathing exercise below, or simply close your eyes and take three slow, deep breaths. There's no wrong way to start.
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
