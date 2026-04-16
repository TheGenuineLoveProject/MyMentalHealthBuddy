// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function GroundingPage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "connection"], 4);
  
  const clarity = {
    what: "Sensory-based practices that bring your attention to the here and now, reducing anxiety and overwhelm.",
    why: "When we're stressed, our mind races to the past or future. Grounding anchors you in the present where you're safe.",
    who: "Anyone experiencing anxiety, dissociation, or feeling disconnected from their body.",
    when: "During panic, after triggering events, or whenever you feel 'spaced out' or unreal.",
    where: "Anywhere you can engage your senses—feel textures, notice sounds, or focus on your surroundings.",
    how: "Use the 5-4-3-2-1 technique or any sensory focus. Name what you notice without judgment."
  };

  const examples = [
    { level: "Beginner", label: "5-4-3-2-1 Senses", description: "Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste." },
    { level: "Intermediate", label: "Body Scan", description: "Starting at your feet, slowly notice sensations moving up through your body to your head." },
    { level: "Advanced", label: "Anchor Points", description: "Press your feet firmly into the floor, notice your seat, feel your hands. Return here whenever needed." }
  ];

  return (
    <>
      <SEO
        title="Grounding Techniques | MyMentalHealthBuddy"
        description="Return to the present moment through your senses - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Grounding Techniques"
        subtitle="Return to the present moment through your senses"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Grounding helps you feel more present and less overwhelmed. Try one technique now, or explore the options below.
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
