import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Anchor, Eye, Hand, Ear, Heart, Footprints, Sparkles, CheckCircle2 } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const techniques = [
  {
    id: "54321",
    name: "5-4-3-2-1 Senses",
    category: "sensory",
    icon: Eye,
    description: "Ground yourself by engaging all five senses to bring you back to the present moment",
    steps: [
      { count: 5, sense: "See", instruction: "Name 5 things you can see around you", examples: "A plant, your hands, a book, light from the window, a cup" },
      { count: 4, sense: "Touch", instruction: "Name 4 things you can feel", examples: "Your feet on the floor, clothes on your skin, air on your face, your hands resting" },
      { count: 3, sense: "Hear", instruction: "Name 3 things you can hear", examples: "Your breathing, distant traffic, the hum of electronics" },
      { count: 2, sense: "Smell", instruction: "Name 2 things you can smell", examples: "Fresh air, coffee, your shampoo, a candle" },
      { count: 1, sense: "Taste", instruction: "Name 1 thing you can taste", examples: "The inside of your mouth, mint, tea you just drank" }
    ],
    scienceNote: "This technique interrupts the stress response by redirecting attention to neutral sensory information, activating the prefrontal cortex."
  },
  {
    id: "feet",
    name: "Feet on the Ground",
    category: "body",
    icon: Footprints,
    description: "Connect with the earth beneath you to feel stable and present",
    steps: [
      { instruction: "Stand or sit with both feet flat on the floor" },
      { instruction: "Press your feet firmly into the ground" },
      { instruction: "Notice the sensation of support beneath you" },
      { instruction: "Wiggle your toes and feel them inside your shoes or against the floor" },
      { instruction: "Imagine roots growing from your feet deep into the earth" },
      { instruction: "Breathe deeply and feel the stability of being grounded" }
    ],
    scienceNote: "Physical grounding activates the body's proprioceptive system, helping shift from 'fight or flight' to a calmer state."
  },
  {
    id: "ice",
    name: "Ice or Cold Water",
    category: "physical",
    icon: Hand,
    description: "Use temperature to quickly snap your nervous system back to the present",
    steps: [
      { instruction: "Hold an ice cube in your hand or splash cold water on your face" },
      { instruction: "Focus intensely on the sensation of cold" },
      { instruction: "Notice how it feels on your skin" },
      { instruction: "Observe the cold spreading through your hand or face" },
      { instruction: "Breathe steadily while focusing on the sensation" },
      { instruction: "Continue until you feel more present" }
    ],
    scienceNote: "Cold activates the dive reflex, which slows heart rate and redirects blood flow, quickly calming the nervous system."
  },
  {
    id: "object",
    name: "Grounding Object",
    category: "physical",
    icon: Hand,
    description: "Focus all your attention on a physical object to anchor yourself",
    steps: [
      { instruction: "Pick up a small object (stone, key, pen, anything nearby)" },
      { instruction: "Hold it in your hands and examine it closely" },
      { instruction: "Notice its weight, texture, temperature" },
      { instruction: "Trace its edges and contours with your fingers" },
      { instruction: "Describe its qualities to yourself in detail" },
      { instruction: "Keep your attention fully on the object for 1-2 minutes" }
    ],
    scienceNote: "Focused attention on external objects interrupts rumination and brings awareness to the present moment."
  },
  {
    id: "butterfly",
    name: "Butterfly Hug",
    category: "somatic",
    icon: Heart,
    description: "Self-soothing technique that provides comfort through bilateral stimulation",
    steps: [
      { instruction: "Cross your arms over your chest, hands resting on opposite shoulders" },
      { instruction: "Your fingers should point toward your neck" },
      { instruction: "Close your eyes or lower your gaze" },
      { instruction: "Gently tap your shoulders alternately, like a butterfly's wings" },
      { instruction: "Breathe slowly and deeply as you tap" },
      { instruction: "Continue for 2-5 minutes, focusing on the rhythm and sensation" }
    ],
    scienceNote: "Bilateral stimulation helps process difficult emotions and is based on EMDR therapy principles."
  },
  {
    id: "categories",
    name: "Mental Categories",
    category: "cognitive",
    icon: Sparkles,
    description: "Engage your thinking mind to interrupt anxiety spirals",
    steps: [
      { instruction: "Choose a category (colors, animals, countries, foods, etc.)" },
      { instruction: "Name as many items in that category as you can" },
      { instruction: "Try to think of items for each letter of the alphabet" },
      { instruction: "Focus only on this task, letting other thoughts pass" },
      { instruction: "Switch to a new category if you run out" },
      { instruction: "Continue until you feel more calm and present" }
    ],
    scienceNote: "Cognitive engagement activates the prefrontal cortex, which helps regulate the emotional brain centers."
  }
];

function TechniqueCard({ technique, onSelect, isSelected }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl transition-all ${isSelected 
        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-105" 
        : "bg-white dark:bg-slate-800 hover:shadow-md hover:scale-102"}`}
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
      <div className="flex items-start gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <technique.icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{technique.name}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{technique.description}</p>
        </div>
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
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You Did It!</h3>
          <p className="text-slate-600 dark:text-slate-400">Take a moment to notice how you feel now compared to before.</p>
          <button
            onClick={() => setCompletedSteps([])}
            className="mt-4 px-6 py-2 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            data-testid="button-reset-steps"
          >
            Start Over
          </button>
        </div>
      )}

      <div className="bg-sky-50 dark:bg-sky-950/30 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Why This Works</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{technique.scienceNote}</p>
      </div>
    </div>
  );
}

export default function GroundingTechniquesPage() {
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0]);

  useSEO({
    title: "Grounding Techniques",
    description: "Calming grounding exercises to reconnect with the present moment. 5-4-3-2-1 senses, body awareness, and anchoring practices.",
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
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Evidence-based somatic techniques to anchor yourself in the present moment when feeling 
            overwhelmed, anxious, or disconnected. Your body knows how to find calm.
          </p>
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

        <RelatedNextSteps 
          steps={[
            { title: "Breathing Exercises", description: "Calm your nervous system", path: "/breathing-exercises" },
            { title: "Calming Scenes", description: "Visualize peaceful environments", path: "/calming-scenes" },
            { title: "Crisis Resources", description: "Immediate support when needed", path: "/crisis-resources" },
          ]}
          title="Continue Your Journey"
        />

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Grounding techniques are coping tools, not treatments. If you're experiencing persistent distress, 
            please reach out to a mental health professional for personalized support.
          </p>
        </div>
      </div>
    </div>
  );
}
