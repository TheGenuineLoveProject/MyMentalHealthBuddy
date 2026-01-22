import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Anchor, Eye, Hand, Ear, Heart, Footprints, Sparkles, CheckCircle2, Brain, Shield, Zap, BookOpen, AlertCircle } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

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
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl transition-all ${isSelected 
        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-105" 
        : "bg-white dark:bg-slate-800 hover:shadow-md hover:scale-102 border border-slate-200 dark:border-slate-700"}`}
      data-testid={`button-technique-${technique.id}`}
    >
      <technique.icon className={`h-8 w-8 mb-4 ${isSelected ? "text-white" : "text-emerald-500"}`} />
      <h3 className={`font-semibold mb-2 ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {technique.name}
      </h3>
      <p className={`text-sm ${isSelected ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <technique.icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{technique.name}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{technique.description}</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-slate-900 dark:text-white text-sm">Best Used When:</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{technique.whenToUse}</p>
      </div>

      <div className="space-y-4 mb-8">
        {technique.steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => toggleStep(idx)}
            className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-4 ${
              completedSteps.includes(idx) 
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500" 
                : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            data-testid={`button-step-${idx}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              completedSteps.includes(idx) 
                ? "bg-emerald-500 text-white" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}>
              {completedSteps.includes(idx) ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
            </div>
            <div className="flex-1">
              {step.count && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full mb-2">
                  {step.count} × {step.sense}
                </span>
              )}
              <p className={`font-medium ${completedSteps.includes(idx) ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
                {step.instruction}
              </p>
              {step.examples && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Examples: {step.examples}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {allComplete && (
        <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl mb-8">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're Grounded</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-2">Take a moment to notice how you feel now compared to before.</p>
          <p className="text-sm text-teal-600 dark:text-teal-400">Each practice strengthens your nervous system's capacity to return to calm.</p>
          <button
            onClick={() => setCompletedSteps([])}
            className="mt-4 px-6 py-2 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            data-testid="button-reset-steps"
          >
            Start Over
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-sky-50 dark:bg-sky-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            The Science
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{technique.scienceNote}</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Polyvagal Perspective
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{technique.polyvagalNote}</p>
        </div>
      </div>
    </div>
  );
}

export default function GroundingTechniquesPage() {
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0]);

  useSEO({
    title: "Grounding Techniques for Anxiety & Dissociation | The Genuine Love Project",
    description: "Evidence-based grounding exercises to anchor in the present moment. 5-4-3-2-1 senses, body-based grounding, butterfly hug, and safe place visualization.",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white mb-6">
            <Anchor className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Grounding Techniques</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            When anxiety pulls you into the future, or trauma pulls you into the past, grounding anchors you in the one moment that is actually happening: right now. 
            These evidence-based techniques help your nervous system remember: <em>I am here. I am safe. This moment is okay.</em>
          </p>
        </div>

        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Why Grounding Works</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
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

        <div className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Building Your Grounding Toolkit</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5">
              <Zap className="h-6 w-6 text-amber-500 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">For Intense Moments</h3>
              <p className="text-slate-600 dark:text-slate-400">Ice/cold water, strong tastes (lemon, mint), 5-4-3-2-1 senses. These create immediate sensory input that's hard to ignore.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5">
              <Heart className="h-6 w-6 text-rose-500 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">For Gentle Grounding</h3>
              <p className="text-slate-600 dark:text-slate-400">Butterfly hug, feet on ground, safe place visualization. These are soothing and can be done anywhere, including in public.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5">
              <Brain className="h-6 w-6 text-indigo-500 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">For Cognitive Grounding</h3>
              <p className="text-slate-600 dark:text-slate-400">Categories game, counting backwards, naming objects. These engage your thinking brain to calm your emotional brain.</p>
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

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Grounding techniques are coping tools for moment-to-moment regulation. If you're experiencing persistent distress, 
            dissociation, or trauma symptoms, please reach out to a trauma-informed mental health professional for personalized support.
          </p>
        </div>
      </div>
    </div>
  );
}
