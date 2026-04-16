// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function MeditationPage() {
  const benefits = pickBenefits(["calm", "clarity", "connection", "agency"], 4);
  
  const clarity = {
    what: "Guided and unguided practices to quiet the mind, increase awareness, and cultivate inner stillness.",
    why: "Regular meditation builds resilience, improves focus, and creates space between stimulus and response.",
    who: "Anyone seeking calm, clarity, or a break from mental chatter. Beginners welcome.",
    when: "Morning to set your day, midday for a reset, or evening for relaxation. Even 5 minutes helps.",
    where: "A quiet spot where you won't be interrupted. Sitting or lying down, eyes open or closed.",
    how: "Start with short sessions. Focus on breath, body sensations, or a guide's voice. Let thoughts pass like clouds."
  };

  const examples = [
    { level: "Beginner", label: "3-Minute Breath Focus", description: "Simply notice your breath for 3 minutes. When your mind wanders, gently return to the breath." },
    { level: "Intermediate", label: "Body-Based Awareness", description: "Spend 10 minutes moving attention through different body parts, noticing sensations without changing them." },
    { level: "Advanced", label: "Open Awareness", description: "Sit for 15-20 minutes with no specific focus. Let thoughts, sounds, and sensations arise and pass." }
  ];

  return (
    <>
      <SEO
        title="Meditation Guides | MyMentalHealthBuddy"
        description="Quiet moments for clarity and inner peace - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Meditation Guides"
        subtitle="Quiet moments for clarity and inner peace"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            There's no perfect way to meditate. The goal is presence, not perfection. Choose a practice that feels manageable today.
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
