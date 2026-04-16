// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function BodyWellnessPage() {
  const benefits = pickBenefits(["calm", "selfRespect", "agency", "clarity"], 4);
  
  const clarity = {
    what: "Practices to reconnect with your body, understand its signals, and support physical wellbeing.",
    why: "Mind and body are connected. Physical wellness supports emotional resilience and mental clarity.",
    who: "Anyone wanting to improve their relationship with their body or address physical tension.",
    when: "Daily for small practices. After periods of stress or sedentary time. Before and after exercise.",
    where: "Anywhere you can move, stretch, or tune into bodily sensations.",
    how: "Start by noticing—not judging—what your body feels. Move gently. Rest when needed."
  };

  const examples = [
    { level: "Beginner", label: "Morning Stretch", description: "Spend 2 minutes stretching gently when you wake. Notice what feels tight or tender." },
    { level: "Intermediate", label: "Movement Snacks", description: "Every hour, stand and move for 1-2 minutes. Shake, stretch, or walk in place." },
    { level: "Advanced", label: "Interoception Practice", description: "Sit quietly and notice internal sensations: heartbeat, breath, temperature, hunger. Build body awareness." }
  ];

  return (
    <>
      <SEO
        title="Body Wellness | MyMentalHealthBuddy"
        description="Listening to and caring for your physical self - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Body Wellness"
        subtitle="Listening to and caring for your physical self"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Your body holds wisdom. These practices help you listen, understand, and respond to what it's telling you.
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
