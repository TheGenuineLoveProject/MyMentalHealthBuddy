import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Sun, Moon, Cloud, Waves, Trees, Mountain, Sparkles, Heart } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import ClarityCard from "@/components/content/ClarityCard";
import ExamplesAccordion from "@/components/content/ExamplesAccordion";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";
import SafetyFooter from "../components/ui/SafetyFooter";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { MIPromptCard } from "@/components/mi/MIPromptCard";

const CALMING_CLARITY = {
  what: "Immersive nature visualizations with guided breathing and affirmations for nervous system regulation.",
  who: "Anyone needing a moment of peace, experiencing stress, or wanting to use visualization for calm.",
  when: "During breaks, before sleep, when anxious, or whenever you need to transport yourself somewhere peaceful.",
  why: "Visualization activates similar brain regions as actual experiences, allowing you to access calm without leaving your space.",
  howSteps: [
    "Choose a scene that calls to you today",
    "Let the visualization guide your imagination",
    "Follow the breath prompts to deepen the experience",
    "Carry the affirmation with you after the practice"
  ],
  whereLinkText: "Try meditation guide",
  whereHref: "/meditation"
};

const CALMING_EXAMPLES = [
  {
    level: "beginner",
    title: "Taking a quick mental escape",
    situation: "You have 2 minutes between tasks and feel stressed.",
    action: "Choose the Ocean Waves scene, close your eyes, and imagine the elements: soft breeze, warm sand, endless horizon.",
    result: "Even brief visualization shifts your nervous system toward calm."
  },
  {
    level: "intermediate",
    title: "Using scenes for sleep preparation",
    situation: "Your mind is racing at bedtime and you need help relaxing.",
    action: "Choose Gentle Rain, follow the breath prompt, and let the rhythmic imagery quiet your thoughts.",
    result: "The calming imagery becomes a sleep cue that helps you transition to rest."
  },
  {
    level: "advanced",
    title: "Building a visualization practice",
    situation: "You want to develop your ability to self-regulate through visualization.",
    action: "Practice different scenes daily, noticing which ones resonate most. Use the affirmations throughout your day.",
    result: "You develop the ability to access calm on demand by visualizing your favorite scenes anywhere."
  }
];

const scenes = [
  {
    id: "ocean",
    name: "Ocean Waves",
    description: "Gentle waves washing onto a peaceful shore, bringing calm with each breath",
    icon: Waves,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    darkGradient: "dark:from-sky-800 dark:via-blue-900 dark:to-indigo-950",
    affirmation: "I flow with life like the ocean, peaceful and strong",
    breathPrompt: "Breathe in as the wave rises... breathe out as it recedes...",
    elements: ["Soft sea breeze", "Distant seagulls", "Warm sand beneath you", "Endless horizon"]
  },
  {
    id: "forest",
    name: "Peaceful Forest",
    description: "A quiet woodland path dappled with golden sunlight filtering through leaves",
    icon: Trees,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    darkGradient: "dark:from-emerald-800 dark:via-green-900 dark:to-teal-950",
    affirmation: "I am grounded like a tree, rooted in peace and reaching toward light",
    breathPrompt: "Inhale the fresh forest air... exhale and release tension...",
    elements: ["Rustling leaves", "Birdsong", "Soft moss underfoot", "Dappled sunlight"]
  },
  {
    id: "mountain",
    name: "Mountain Sunrise",
    description: "Standing atop a misty mountain as golden light breaks over the peaks",
    icon: Mountain,
    gradient: "from-amber-300 via-orange-400 to-rose-500",
    darkGradient: "dark:from-amber-700 dark:via-orange-800 dark:to-rose-900",
    affirmation: "I rise above challenges with clarity and strength",
    breathPrompt: "Breathe in the crisp mountain air... exhale and expand your vision...",
    elements: ["Cool mountain breeze", "Distant valleys", "Eagles soaring", "Infinite sky"]
  },
  {
    id: "meadow",
    name: "Flower Meadow",
    description: "A gentle meadow filled with wildflowers swaying in a warm summer breeze",
    icon: Sun,
    gradient: "from-pink-300 via-purple-400 to-violet-500",
    darkGradient: "dark:from-pink-800 dark:via-purple-900 dark:to-violet-950",
    affirmation: "I bloom where I am planted, beautiful and full of life",
    breathPrompt: "Inhale the sweet fragrance... exhale and feel joy blossom...",
    elements: ["Butterflies dancing", "Warm sunshine", "Soft grass", "Gentle humming of bees"]
  },
  {
    id: "night",
    name: "Starlit Night",
    description: "A clear night sky filled with countless stars, connecting you to the universe",
    icon: Moon,
    gradient: "from-slate-700 via-purple-900 to-indigo-950",
    darkGradient: "dark:from-slate-800 dark:via-purple-950 dark:to-black",
    affirmation: "I am part of something infinite and beautiful",
    breathPrompt: "Breathe in the stillness of night... exhale and become one with the stars...",
    elements: ["Twinkling stars", "Gentle night breeze", "Cricket songs", "Peaceful silence"]
  },
  {
    id: "rain",
    name: "Gentle Rain",
    description: "Soft rain falling on a cozy window, washing away worries and bringing renewal",
    icon: Cloud,
    gradient: "from-slate-400 via-gray-500 to-slate-600",
    darkGradient: "dark:from-slate-700 dark:via-gray-800 dark:to-slate-900",
    affirmation: "I let go of what no longer serves me, making room for growth",
    breathPrompt: "Breathe in renewal... exhale and let worries wash away...",
    elements: ["Raindrops on glass", "Cozy warmth", "Petrichor scent", "Rhythmic patter"]
  }
];

const quickCalm = [
  {
    title: "5-4-3-2-1 Grounding",
    steps: ["5 things you see", "4 things you feel", "3 things you hear", "2 things you smell", "1 thing you taste"]
  },
  {
    title: "Box Breathing",
    steps: ["Breathe in for 4 counts", "Hold for 4 counts", "Breathe out for 4 counts", "Hold for 4 counts"]
  },
  {
    title: "Body Scan",
    steps: ["Notice your feet", "Relax your legs", "Soften your belly", "Drop your shoulders", "Release your jaw"]
  }
];

export default function CalmingScenesPage() {
  const [activeScene, setActiveScene] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useSEO({
    title: "Calming Scenes",
    description: "Immersive visual environments for relaxation and stress relief. Ocean waves, peaceful forests, mountain sunrises, and more calming scenes.",
  });

  return (
  <WellnessPageShell
    title="CalmingScenesPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
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
      <SEO title="Calming Scenes — The Genuine Love Project" description="Visual and audio environments for relaxation and grounding." />


    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--glp-paper), var(--glp-sage-10))' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 transition-colors mb-8" style={{ color: 'var(--glp-sage)' }} data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'var(--glp-paper)' }}>
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Calming Scenes</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Immerse yourself in peaceful environments designed to reduce stress, ease anxiety, and restore inner calm. 
            Each scene combines visualization, breathing guidance, and positive affirmations.
          </p>
        </div>

        <BenefitsBlock
          benefits={[
            "6 immersive calming scenes with visualization guidance",
            "Breathing prompts and positive affirmations for each scene",
            "Quick calm techniques for immediate relief"
          ]}
          duration="5–15 min per scene"
          control="Pause or switch scenes anytime"
          disclaimer="Relaxation visualization—not therapy. If you need crisis help, visit"
          crisisLink="/crisis"
          variant="minimal"
          className="mb-8"
        />

        <ClarityCard {...CALMING_CLARITY} variant="compact" className="mb-6" />

        <ExamplesAccordion 
          examples={CALMING_EXAMPLES} 
          title="See how others use calming scenes"
          className="mb-8"
        />

        {activeScene ? (
          <div className="mb-12">
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${activeScene.gradient} ${activeScene.darkGradient} p-8 md:p-12 min-h-96`}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  data-testid="button-toggle-play"
                >
                  {isPlaying ? <Pause className="h-5 w-5" style={{ color: 'var(--glp-paper)' }} /> : <Play className="h-5 w-5" style={{ color: 'var(--glp-paper)' }} />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" style={{ color: 'var(--glp-paper)' }} /> : <Volume2 className="h-5 w-5" style={{ color: 'var(--glp-paper)' }} />}
                </button>
              </div>

              <div className="text-center" style={{ color: 'var(--glp-paper)' }}>
                <activeScene.icon className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl font-bold mb-4">{activeScene.name}</h2>
                <p className="text-xl opacity-90 mb-8 max-w-xl mx-auto">{activeScene.description}</p>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 max-w-md mx-auto">
                  <p className="text-lg font-medium mb-2">Breathing Guide</p>
                  <p className="text-xl opacity-90">{activeScene.breathPrompt}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                  <Heart className="h-6 w-6 mx-auto mb-3 opacity-80" />
                  <p className="text-lg italic">"{activeScene.affirmation}"</p>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {activeScene.elements.map((element, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white/10 rounded-full text-sm">
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveScene(null)}
                className="absolute bottom-4 left-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                style={{ color: 'var(--glp-paper)' }}
                data-testid="button-close-scene"
              >
                Close Scene
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene)}
              className={`text-left rounded-2xl overflow-hidden bg-gradient-to-br ${scene.gradient} ${scene.darkGradient} p-6 transition-transform hover:scale-105 focus:outline-none focus:ring-2`}
              style={{ '--tw-ring-color': 'var(--glp-gold)' }}
              data-testid={`button-scene-${scene.id}`}
            >
              <scene.icon className="h-10 w-10 mb-4 opacity-90" style={{ color: 'var(--glp-paper)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--glp-paper)' }}>{scene.name}</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{scene.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl p-8 mb-12" style={{ background: 'var(--glp-gold-30)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--glp-sage-deep)' }}>Quick Calm Techniques</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickCalm.map((technique, idx) => (
              <div key={idx} className="rounded-xl p-6 shadow-sm" style={{ background: 'var(--glp-paper)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--glp-ink)' }}>{technique.title}</h3>
                <ol className="space-y-2">
                  {technique.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-3 text-sm" style={{ color: 'var(--glp-sage)' }}>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-gold-dark)' }}>
                        {stepIdx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <RelatedNextSteps 
          steps={[
            { title: "Breathing Exercises", description: "Add breathwork to your practice", path: "/breathing" },
            { title: "Grounding Techniques", description: "Sensory grounding for deeper calm", path: "/grounding" },
            { title: "Journal Your Experience", description: "Reflect on what helped most", path: "/guided-journaling" },
          ]}
          title="Continue Your Journey"
        />

        <MIPromptCard context="general" className="mb-6" />

        <SafetyFooter variant="default" />
      </div>
    </div>
  </WellnessPageShell>
  );
}
