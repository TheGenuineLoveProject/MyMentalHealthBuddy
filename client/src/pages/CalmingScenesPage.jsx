import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Sun, Moon, Cloud, Waves, Trees, Mountain, Sparkles, Heart } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white mb-6">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Calming Scenes</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Immerse yourself in peaceful environments designed to reduce stress, ease anxiety, and restore inner calm. 
            Each scene combines visualization, breathing guidance, and positive affirmations.
          </p>
        </div>

        {activeScene ? (
          <div className="mb-12">
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${activeScene.gradient} ${activeScene.darkGradient} p-8 md:p-12 min-h-96`}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  data-testid="button-toggle-play"
                >
                  {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                </button>
              </div>

              <div className="text-center text-white">
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
                className="absolute bottom-4 left-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition-colors"
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
              className={`text-left rounded-2xl overflow-hidden bg-gradient-to-br ${scene.gradient} ${scene.darkGradient} p-6 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400`}
              data-testid={`button-scene-${scene.id}`}
            >
              <scene.icon className="h-10 w-10 text-white mb-4 opacity-90" />
              <h3 className="text-xl font-bold text-white mb-2">{scene.name}</h3>
              <p className="text-white/80 text-sm">{scene.description}</p>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Quick Calm Techniques</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickCalm.map((technique, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{technique.title}</h3>
                <ol className="space-y-2">
                  {technique.steps.map((step, stepIdx) => (
                    <li key={stepIdx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-medium">
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

        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800 mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            These calming experiences are designed to complement, not replace, professional mental health support.
            If you're in crisis, please reach out to a crisis helpline or mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}
