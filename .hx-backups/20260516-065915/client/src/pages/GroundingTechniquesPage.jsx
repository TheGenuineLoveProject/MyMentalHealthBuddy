import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Anchor, Eye, Hand, Heart, Footprints, Sparkles, CheckCircle2, Brain, Shield, Zap, BookOpen, AlertCircle } from 'lucide-react';
import BenefitsBlock from "@/components/BenefitsBlock";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const GROUNDING_CLARITY = {
  what: "Evidence-based grounding exercises to anchor in the present moment during anxiety, dissociation, or overwhelm.",
  who: "Anyone experiencing anxiety, flashbacks, dissociation, or feeling disconnected from the present.",
  when: "During panic, when feeling unreal or disconnected, before or after difficult conversations, or whenever you need to return to the present.",
  why: "Grounding anchors you in the one moment that is actually happening—right now—sending safety cues to your nervous system.",
  howSteps: [
    "Notice you're feeling anxious or disconnected",
    "Choose a grounding technique that feels accessible",
    "Follow the step-by-step guidance",
    "Check each step as you complete it to track progress"
  ],
  whereLinkText: "Learn about breathing exercises",
  whereHref: "/breathing-exercises"
};

const GROUNDING_EXAMPLES = [
  {
    level: "beginner",
    title: "First time grounding during mild anxiety",
    situation: "You notice racing thoughts and want to try grounding for the first time.",
    action: "Use the 5-4-3-2-1 Senses technique, naming things you can see, touch, hear, smell, and taste.",
    result: "The racing thoughts slow as your attention shifts to your immediate environment."
  },
  {
    level: "intermediate",
    title: "Grounding during a difficult moment",
    situation: "You feel overwhelmed during a stressful conversation and need quick relief.",
    action: "Excuse yourself briefly and use Feet on the Ground—press your feet firmly into the floor and feel the solid support.",
    result: "You feel more stable and present, able to return to the conversation with more clarity."
  },
  {
    level: "advanced",
    title: "Using grounding for dissociation",
    situation: "You notice signs of dissociation—feeling foggy or disconnected from your body.",
    action: "Use Ice or Cold Water (TIPP skill) to activate the dive reflex, then follow with the Butterfly Hug for self-soothing.",
    result: "The cold sensation brings you back to your body, and the bilateral stimulation helps you feel more integrated."
  }
];

const techniques = [
  {
    id: "54321",
    name: "5-4-3-2-1 Senses",
    category: "sensory",
    icon: Eye,
    description: "Ground yourself by engaging all five senses to anchor in the present moment and interrupt the dissociative or anxiety spiral",
    whenToUse: "Dissociation, flashbacks, panic, feeling unreal or disconnected",
    steps: [
      { count: 5, sense: "See", instruction: "Name 5 things you can see around you", examples: "A plant, your hands, a book, light from the window, a cup" },
      { count: 4, sense: "Touch", instruction: "Name 4 things you can feel", examples: "Your feet on the floor, clothes on your skin, air on your face, your hands resting" },
      { count: 3, sense: "Hear", instruction: "Name 3 things you can hear", examples: "Your breathing, distant traffic, the hum of electronics" },
      { count: 2, sense: "Smell", instruction: "Name 2 things you can smell", examples: "Fresh air, coffee, your shampoo, a candle" },
      { count: 1, sense: "Taste", instruction: "Name 1 thing you can taste", examples: "The inside of your mouth, mint, tea you just drank" }
    ],
    scienceNote: "This technique interrupts the stress response by redirecting attention to neutral sensory information, activating the prefrontal cortex (thinking brain) and reducing amygdala (fear center) activation.",
    polyvagalNote: "Orienting to your environment through senses activates the ventral vagal social engagement system, helping shift from threat detection to safety."
  },
  {
    id: "feet",
    name: "Feet on the Ground",
    category: "body",
    icon: Footprints,
    description: "Connect with the earth beneath you to feel stable, supported, and anchored in physical reality",
    whenToUse: "Feeling untethered, anxious, overwhelmed, need for stability",
    steps: [
      { instruction: "Stand or sit with both feet flat on the floor, hip-width apart" },
      { instruction: "Press your feet firmly into the ground—feel the solid support beneath you" },
      { instruction: "Notice the sensation of your weight being held by the earth" },
      { instruction: "Wiggle your toes and feel them inside your shoes or against the floor" },
      { instruction: "Imagine roots growing from your feet deep into the earth" },
      { instruction: "Breathe deeply and feel the stability of being grounded, supported, held" }
    ],
    scienceNote: "Physical grounding activates the body's proprioceptive system—your sense of where you are in space—helping shift from 'fight or flight' to a calmer, oriented state.",
    polyvagalNote: "Feeling physical support signals safety to your nervous system. The earth is literally holding you. You don't have to hold yourself up alone."
  },
  {
    id: "ice",
    name: "Ice or Cold Water (TIPP)",
    category: "physical",
    icon: Hand,
    description: "Use cold temperature to rapidly reset your nervous system through the mammalian dive reflex—one of the fastest calming techniques available",
    whenToUse: "Panic attacks, extreme overwhelm, when you need to shift states fast, intense anxiety",
    steps: [
      { instruction: "Hold an ice cube in your hand, or splash cold water on your face" },
      { instruction: "For maximum effect: submerge your face in cold water for 30 seconds (dive reflex)" },
      { instruction: "Focus intensely on the sensation of cold—let it be the only thing you notice" },
      { instruction: "Observe how the cold spreads through your hand or face" },
      { instruction: "Breathe steadily while focusing on the sensation" },
      { instruction: "Continue until you feel your nervous system shifting toward calm" }
    ],
    scienceNote: "Cold activates the dive reflex, which slows heart rate by up to 25%, redirects blood flow to vital organs, and rapidly calms the nervous system. This is part of DBT's TIPP skills.",
    polyvagalNote: "The dive reflex is an ancient survival mechanism that overrides sympathetic activation. It's not about thinking your way calm—it's about using physiology to shift physiology."
  },
  {
    id: "object",
    name: "Grounding Object Focus",
    category: "physical",
    icon: Hand,
    description: "Focus all your attention on a physical object to anchor yourself in concrete reality and interrupt anxious thought loops",
    whenToUse: "Rumination, worry spirals, difficulty being present, need for tangible anchor",
    steps: [
      { instruction: "Pick up a small object (stone, key, pen, stress ball—anything nearby)" },
      { instruction: "Hold it in your hands and examine it as if you've never seen it before" },
      { instruction: "Notice its weight—how heavy or light it feels" },
      { instruction: "Explore its texture—smooth, rough, cool, warm?" },
      { instruction: "Trace its edges and contours with your fingers slowly" },
      { instruction: "Describe its qualities to yourself in detail (color, shape, imperfections)" },
      { instruction: "Keep your attention fully on the object for 1-2 minutes" }
    ],
    scienceNote: "Focused attention on external objects interrupts rumination by engaging different neural pathways than worry uses. It brings awareness to the present moment.",
    polyvagalNote: "Detailed sensory focus signals to your nervous system: 'There is no immediate threat. I have time to examine this object carefully.'"
  },
  {
    id: "butterfly",
    name: "Butterfly Hug",
    category: "somatic",
    icon: Heart,
    description: "Self-soothing technique using bilateral stimulation for comfort and emotional regulation—based on EMDR therapy principles",
    whenToUse: "Emotional distress, needing self-comfort, processing difficult feelings, anxiety",
    steps: [
      { instruction: "Cross your arms over your chest, hands resting on opposite shoulders" },
      { instruction: "Your fingers should point toward your neck/collarbone area" },
      { instruction: "Close your eyes or lower your gaze to reduce stimulation" },
      { instruction: "Gently tap your shoulders alternately, like a butterfly's wings—left, right, left, right" },
      { instruction: "Breathe slowly and deeply as you tap at a pace that feels calming" },
      { instruction: "Continue for 2-5 minutes, focusing on the rhythm and sensation of being held" }
    ],
    scienceNote: "Bilateral stimulation (alternating left-right) helps process difficult emotions and is based on EMDR therapy principles. It may help integrate left and right brain hemispheres.",
    polyvagalNote: "This technique combines self-touch (which releases oxytocin) with bilateral movement, creating a powerful self-soothing combination that signals safety to your system."
  },
  {
    id: "categories",
    name: "Mental Categories Game",
    category: "cognitive",
    icon: Sparkles,
    description: "Engage your thinking mind to interrupt anxiety spirals by occupying the part of your brain that would otherwise be worrying",
    whenToUse: "Worry spirals, racing thoughts, before sleep, when you need mental distraction",
    steps: [
      { instruction: "Choose a category (colors, animals, countries, foods, movies, names, etc.)" },
      { instruction: "Name as many items in that category as you can—aim for at least 10" },
      { instruction: "Try to think of items for each letter of the alphabet (A-Z)" },
      { instruction: "Focus only on this task, letting other thoughts pass without engaging them" },
      { instruction: "Switch to a new category if you run out or want more challenge" },
      { instruction: "Continue until you feel more calm and present" }
    ],
    scienceNote: "Cognitive engagement activates the prefrontal cortex, which helps regulate the emotional brain centers. You're literally using your thinking brain to calm your emotional brain.",
    polyvagalNote: "The brain cannot fully focus on both the category game and the anxiety. By occupying the verbal-cognitive system, you create space for the nervous system to settle."
  },
  {
    id: "safe-place",
    name: "Safe Place Visualization",
    category: "imagery",
    icon: Shield,
    description: "Create and visit an internal refuge where you feel completely safe, calm, and at peace—a portable sanctuary you can access anytime",
    whenToUse: "Need for safety, before processing difficult content, calming before sleep, overwhelm",
    steps: [
      { instruction: "Close your eyes and take several slow, deep breaths" },
      { instruction: "Imagine a place where you feel completely safe and at peace (real or imagined)" },
      { instruction: "Notice what you see in this safe place—colors, shapes, light" },
      { instruction: "What do you hear? (waves, birds, wind, silence)" },
      { instruction: "What do you smell? (ocean, forest, flowers, fresh air)" },
      { instruction: "What do you feel against your skin? (warmth, breeze, softness)" },
      { instruction: "Spend time here, absorbing the feeling of safety and calm" },
      { instruction: "Know you can return here whenever you need to feel safe" }
    ],
    scienceNote: "Visualization activates similar brain regions as actual experiences. Your nervous system responds to imagined safety similarly to real safety—making this a portable regulation tool.",
    polyvagalNote: "Your nervous system doesn't fully distinguish between real and vividly imagined experiences. A well-developed internal safe place can become a reliable refuge."
  }
];

function TechniqueCard({ technique, onSelect, isSelected }) {
  return (
  <WellnessPageShell
    title="GroundingTechniquesPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Grounding Techniques — MyMentalHealthBuddy" description="Methods for staying present and centered." />


    <button
      onClick={onSelect}
      className="text-left p-6 rounded-2xl transition-all hover:shadow-md"
      style={isSelected 
        ? { background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)', boxShadow: 'var(--glp-shadow-lg)', transform: 'scale(1.05)' }
        : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
      data-testid={`button-technique-${technique.id}`}
    >
      <technique.icon className="h-8 w-8 mb-4" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-sage)' }} />
      <h3 className="font-semibold mb-2" style={{ color: isSelected ? 'var(--glp-paper)' : 'var(--glp-ink)' }}>
        {technique.name}
      </h3>
      <p className="text-sm" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--glp-sage)' }}>
        {technique.description}
      </p>
    </button>
  );
}

function TechniqueDetail({ technique }) {
  const [completedSteps, setCompletedSteps] = useState([]);

  const toggleStep = (idx) => {
    setCompletedSteps(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const allComplete = completedSteps.length === technique.steps.length;

  return (
    <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'var(--glp-paper)' }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
          <technique.icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-ink)' }}>{technique.name}</h2>
          <p className="mt-1" style={{ color: 'var(--glp-sage)' }}>{technique.description}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--glp-gold-30)' }}>
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4" style={{ color: 'var(--glp-gold-dark)' }} />
          <span className="font-medium text-sm" style={{ color: 'var(--glp-ink)' }}>Best Used When:</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{technique.whenToUse}</p>
      </div>

      <div className="space-y-4 mb-8">
        {technique.steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => toggleStep(idx)}
            className="w-full text-left p-4 rounded-xl transition-all flex items-start gap-4"
            style={completedSteps.includes(idx) 
              ? { background: 'var(--glp-sage-10)', border: '2px solid var(--glp-sage)' } 
              : { background: 'var(--glp-sage-10)', border: '1px solid transparent' }}
            data-testid={`button-step-${idx}`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={completedSteps.includes(idx) 
                ? { background: 'var(--glp-sage)', color: 'var(--glp-paper)' } 
                : { background: 'var(--glp-sage-15)', color: 'var(--glp-sage)' }}>
              {completedSteps.includes(idx) ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
            </div>
            <div className="flex-1">
              {step.count && (
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-dark)' }}>
                  {step.count} × {step.sense}
                </span>
              )}
              <p className="font-medium" style={{ color: completedSteps.includes(idx) ? 'var(--glp-sage-deep)' : 'var(--glp-ink)' }}>
                {step.instruction}
              </p>
              {step.examples && (
                <p className="text-sm mt-1" style={{ color: 'var(--glp-sage)' }}>Examples: {step.examples}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {allComplete && (
        <div className="text-center py-8 rounded-xl mb-8" style={{ background: 'var(--glp-sage-10)' }}>
          <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--glp-rose)' }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--glp-ink)' }}>You're Grounded</h3>
          <p className="mb-2" style={{ color: 'var(--glp-sage)' }}>Take a moment to notice how you feel now compared to before.</p>
          <p className="text-sm" style={{ color: 'var(--glp-sage-deep)' }}>Each practice strengthens your nervous system's capacity to return to calm.</p>
          <button
            onClick={() => setCompletedSteps([])}
            className="mt-4 px-6 py-2 rounded-full font-medium transition-colors"
            style={{ background: 'var(--glp-sage)', color: 'var(--glp-paper)' }}
            data-testid="button-reset-steps"
          >
            Start Over
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <BookOpen className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
            The Science
          </h3>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{technique.scienceNote}</p>
        </div>
        <div className="rounded-xl p-6" style={{ background: 'var(--glp-sage-10)' }}>
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
            <Brain className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
            Polyvagal Perspective
          </h3>
          <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{technique.polyvagalNote}</p>
        </div>
      </div>
    </div>
  );
}

export default function GroundingTechniquesPage() {
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0]);

  useSEO({
    title: "Grounding Techniques for Anxiety & Dissociation | MyMentalHealthBuddy",
    description: "Evidence-based grounding exercises to anchor in the present moment. 5-4-3-2-1 senses, body-based grounding, butterfly hug, and safe place visualization.",
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-paper), var(--glp-sage-10))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
            <Anchor className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Grounding Techniques</h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            When anxiety pulls you into the future, or trauma pulls you into the past, grounding anchors you in the one moment that is actually happening: right now. 
            These evidence-based techniques help your nervous system remember: <em>I am here. I am safe. This moment is okay.</em>
          </p>
        </div>

        <BenefitsBlock
          benefits={[
            "8 evidence-based grounding techniques for anxiety and dissociation",
            "Step-by-step interactive guidance for each technique",
            "Polyvagal-informed exercises grounded in neuroscience"
          ]}
          duration="5–15 min per technique"
          control="Pause or switch techniques anytime"
          disclaimer="Educational grounding practice—not therapy. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

        <MIPromptCard context="reflection" className="mb-8" />

        <ClarityCard {...GROUNDING_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={GROUNDING_EXAMPLES} 
          title="See how others use grounding techniques"
          className="mb-8"
        />

        <div className="rounded-2xl p-6 mb-12" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage-deep)' }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Why Grounding Works</h3>
              <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                <strong>Polyvagal insight:</strong> Your nervous system is designed to scan for danger. When you're anxious or dissociating, 
                your neuroception (unconscious threat detection) is activated. Grounding techniques orient you to the present environment, 
                sending safety cues through your senses that tell your brain: "Right now, in this moment, I am not in danger."
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 grid gap-4">
            {techniques.map((t) => (
              <TechniqueCard 
                key={t.id} 
                technique={t} 
                isSelected={selectedTechnique.id === t.id}
                onSelect={() => setSelectedTechnique(t)} 
              />
            ))}
          </div>
          <div className="lg:col-span-2">
            <TechniqueDetail technique={selectedTechnique} />
          </div>
        </div>

        <div className="mt-16 rounded-2xl p-8" style={{ background: 'var(--glp-gold-30)' }}>
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Building Your Grounding Toolkit</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Zap className="h-6 w-6 mb-3" style={{ color: 'var(--glp-gold)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>For Intense Moments</h3>
              <p style={{ color: 'var(--glp-sage)' }}>Ice/cold water, strong tastes (lemon, mint), 5-4-3-2-1 senses. These create immediate sensory input that's hard to ignore.</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Heart className="h-6 w-6 mb-3" style={{ color: 'var(--glp-rose)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>For Gentle Grounding</h3>
              <p style={{ color: 'var(--glp-sage)' }}>Butterfly hug, feet on ground, safe place visualization. These are soothing and can be done anywhere, including in public.</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
              <Brain className="h-6 w-6 mb-3" style={{ color: 'var(--glp-sage-deep)' }} />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>For Cognitive Grounding</h3>
              <p style={{ color: 'var(--glp-sage)' }}>Categories game, counting backwards, naming objects. These engage your thinking brain to calm your emotional brain.</p>
            </div>
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Breathing Exercises", description: "Combine with breathwork for deeper regulation", path: "/breathing-exercises" },
            { title: "Crisis Resources", description: "Immediate support when grounding isn't enough", path: "/crisis-resources" },
            { title: "Inner Child Healing", description: "Address the roots of dysregulation", path: "/inner-child" },
          ]}
          title="Continue Your Healing Journey"
        />

        <div className="mt-12 rounded-2xl p-6" style={{ background: 'var(--glp-gold-30)', border: '1px solid var(--glp-gold)' }}>
          <h4 className="font-semibold mb-2 text-center" style={{ color: 'var(--glp-gold-dark)' }}>How to Use These Tools Safely</h4>
          <ul className="text-sm space-y-2 max-w-2xl mx-auto" style={{ color: 'var(--glp-sage-deep)' }}>
            <li>• Grounding techniques are <strong>coping tools</strong>, not treatments. They help in the moment but don't address root causes.</li>
            <li>• If a technique causes increased distress, <strong>stop and try a different approach</strong>. Not every tool works for every person.</li>
            <li>• For persistent distress, dissociation, or trauma symptoms, please reach out to a trauma-informed mental health professional.</li>
            <li>• These tools are not a substitute for professional care if you're experiencing a mental health crisis.</li>
          </ul>
        </div>
        <SafetyFooter variant="prominent" />
      </div>
    </div>
  </WellnessPageShell>
  );
}
