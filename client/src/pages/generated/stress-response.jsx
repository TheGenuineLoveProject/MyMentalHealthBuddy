// @generated - Bulk patched by scripts/bulk-patch-generated.mjs
import { SEO } from "@/components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function StressResponsePage() {
  const benefits = pickBenefits(["calm", "clarity", "agency", "selfRespect"], 4);
  
  const clarity = {
    what: "Practices to recognize stress signals, regulate your nervous system, and build resilience over time.",
    why: "Chronic stress affects health, mood, and relationships. Learning to regulate stress is a life skill.",
    who: "Anyone experiencing chronic stress, anxiety, or wanting to build stress resilience.",
    when: "Daily practice for prevention, and in-the-moment tools when stress spikes.",
    where: "Wherever you are—work, home, or in between. Many techniques are invisible to others.",
    how: "First, notice stress signals in your body. Then choose a regulation technique that works for you."
  };

  const examples = [
    { level: "Beginner", label: "Stress Signal Scan", description: "Notice where stress shows up in your body: shoulders, jaw, stomach? Awareness is the first step." },
    { level: "Intermediate", label: "Physiological Sigh", description: "Double inhale through the nose, long exhale through the mouth. Quickly activates the calming system." },
    { level: "Advanced", label: "Stress Inoculation", description: "Deliberately expose yourself to mild stressors while practicing calm. Build tolerance gradually." }
  ];

  return (
    <>
      <SEO
        title="Stress Response Tools | The Genuine Love Project"
        description="Understanding and regulating your stress system - Educational wellness tools for adults 18+."
      />
      <WellnessPageShell
        title="Stress Response Tools"
        subtitle="Understanding and regulating your stress system"
        benefits={benefits}
        clarity={clarity}
        examples={examples}
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg opacity-90">
            Stress isn't bad—it's information. The goal isn't zero stress, but better recovery and regulation.
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
