import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Utensils, 
  Moon, 
  Droplets,
  Wind,
  Footprints,
  Sparkles,
  Sun,
  Brain,
  Leaf,
  Timer,
  Music,
  Eye,
  Hand
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const bodyCategories = [
  {
    id: "movement",
    title: "Gentle Movement",
    icon: Footprints,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Movement practices that release tension and restore energy",
    practices: [
      {
        name: "Somatic Stretching",
        duration: "10-15 min",
        description: "Slow, intentional stretches that release stored tension in the body. Focus on areas that hold stress: neck, shoulders, hips, and jaw.",
        steps: [
          "Find a quiet space where you can move freely",
          "Start by noticing where you feel tension or restriction",
          "Move slowly into gentle stretches, never forcing",
          "Hold each position for 30-60 seconds, breathing deeply",
          "Notice any emotions that arise - this is normal",
          "End by standing still, feeling your feet on the ground"
        ],
        benefits: "Releases stored tension, increases body awareness, calms nervous system"
      },
      {
        name: "Shake & Release",
        duration: "5-10 min",
        description: "Animals naturally shake after stress to discharge adrenaline. This practice helps complete the stress cycle.",
        steps: [
          "Stand with feet hip-width apart, knees slightly bent",
          "Begin gently bouncing or shaking your whole body",
          "Let your arms, hands, and head shake loosely",
          "Gradually increase intensity if comfortable",
          "Continue for 2-5 minutes",
          "Slowly stop and stand still, noticing sensations"
        ],
        benefits: "Discharges stress hormones, resets nervous system, releases trapped energy"
      },
      {
        name: "Walking Meditation",
        duration: "15-20 min",
        description: "Mindful walking that connects body movement with present-moment awareness.",
        steps: [
          "Choose a safe, quiet path (indoors or outdoors)",
          "Begin walking at a natural, slow pace",
          "Notice the sensation of each foot touching ground",
          "Feel the movement of your legs, arms, and body",
          "When mind wanders, gently return to the sensation of walking",
          "End by standing still, taking three deep breaths"
        ],
        benefits: "Grounds anxiety, integrates mind-body connection, gentle exercise"
      }
    ]
  },
  {
    id: "breathwork",
    title: "Breathwork",
    icon: Wind,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Breathing practices that regulate the nervous system",
    practices: [
      {
        name: "Physiological Sigh",
        duration: "1-2 min",
        description: "The fastest way to calm your nervous system, backed by Stanford research. A double inhale followed by a long exhale.",
        steps: [
          "Take a deep breath in through your nose",
          "At the top, take another short inhale (double inhale)",
          "Exhale slowly and fully through your mouth",
          "The exhale should be longer than the inhales combined",
          "Repeat 2-3 times",
          "Notice the calming effect almost immediately"
        ],
        benefits: "Rapidly reduces stress, balances oxygen/CO2, activates relaxation response"
      },
      {
        name: "4-7-8 Breath",
        duration: "5 min",
        description: "A powerful relaxation technique that activates the parasympathetic nervous system.",
        steps: [
          "Sit or lie in a comfortable position",
          "Inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "Repeat for 4 cycles",
          "Practice twice daily for best results"
        ],
        benefits: "Reduces anxiety, aids sleep, lowers heart rate"
      },
      {
        name: "Box Breathing",
        duration: "5-10 min",
        description: "Equal-ratio breathing used by Navy SEALs for stress management and focus.",
        steps: [
          "Sit upright with feet flat on floor",
          "Inhale for 4 counts",
          "Hold for 4 counts",
          "Exhale for 4 counts",
          "Hold for 4 counts",
          "Repeat for 4-5 rounds"
        ],
        benefits: "Increases focus, regulates stress response, grounding"
      }
    ]
  },
  {
    id: "nutrition",
    title: "Nourishing Nutrition",
    icon: Utensils,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    description: "Food choices that support mental health and energy",
    practices: [
      {
        name: "Mood-Supporting Foods",
        duration: "Ongoing",
        description: "Certain foods contain nutrients that directly support brain health and mood regulation.",
        steps: [
          "Omega-3 fatty acids: salmon, walnuts, flaxseeds, chia seeds",
          "Probiotics: yogurt, kefir, sauerkraut, kimchi (gut-brain connection)",
          "Complex carbs: oats, brown rice, sweet potatoes (steady energy)",
          "Leafy greens: spinach, kale (folate for mood)",
          "Berries: blueberries, strawberries (antioxidants)",
          "Dark chocolate: 70%+ cacao (serotonin boost)"
        ],
        benefits: "Supports neurotransmitter production, reduces inflammation, stable energy"
      },
      {
        name: "Mindful Eating Practice",
        duration: "Each meal",
        description: "Eating with full attention improves digestion, satisfaction, and body awareness.",
        steps: [
          "Before eating, take 3 deep breaths",
          "Look at your food and appreciate its colors and textures",
          "Take small bites and chew slowly (20-30 times)",
          "Put down utensils between bites",
          "Notice flavors, textures, and sensations",
          "Stop when 80% full, not stuffed"
        ],
        benefits: "Better digestion, reduced overeating, increased meal satisfaction"
      },
      {
        name: "Hydration Awareness",
        duration: "Daily",
        description: "Dehydration affects mood, cognition, and energy more than most people realize.",
        steps: [
          "Aim for 8 glasses (64 oz) of water daily as baseline",
          "Start morning with a glass of water before coffee",
          "Keep water visible throughout the day",
          "Notice signs of dehydration: fatigue, headache, irritability",
          "Infuse water with lemon, cucumber, or berries for variety",
          "Reduce caffeine and alcohol which dehydrate"
        ],
        benefits: "Improved mood, better focus, increased energy, reduced headaches"
      }
    ]
  },
  {
    id: "rest",
    title: "Rest & Recovery",
    icon: Moon,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    description: "Practices for deep rest and nervous system recovery",
    practices: [
      {
        name: "Yoga Nidra (Yogic Sleep)",
        duration: "20-45 min",
        description: "A guided meditation done lying down that induces deep relaxation between waking and sleeping.",
        steps: [
          "Lie on your back in a comfortable position",
          "Use blankets for warmth, eye pillow if available",
          "Follow guided audio (many free options available)",
          "Remain still while aware of the guidance",
          "Let yourself drift between sleep and waking",
          "When complete, move slowly and gently"
        ],
        benefits: "Equivalent to 2-4 hours of sleep, trauma release, deep restoration"
      },
      {
        name: "Restorative Poses",
        duration: "10-20 min",
        description: "Supported yoga positions that allow complete relaxation without effort.",
        steps: [
          "Legs Up the Wall: lie with legs resting against wall for 5-10 min",
          "Supported Child's Pose: use pillows under chest and head",
          "Reclined Butterfly: lie back with soles of feet together, knees open",
          "Savasana: lie flat with support under knees if needed",
          "Use props (pillows, blankets) for total support",
          "Stay in each pose 5-10 minutes minimum"
        ],
        benefits: "Activates parasympathetic system, reduces cortisol, restores energy"
      },
      {
        name: "Power Rest",
        duration: "20 min",
        description: "A short rest period that restores energy without grogginess.",
        steps: [
          "Find a quiet, dark space",
          "Lie down or recline comfortably",
          "Set a timer for 20 minutes (before deep sleep begins)",
          "Close eyes and let body fully relax",
          "If thoughts arise, let them pass like clouds",
          "When timer sounds, move slowly and stretch"
        ],
        benefits: "Restores alertness, improves mood, doesn't interfere with night sleep"
      }
    ]
  },
  {
    id: "sensory",
    title: "Sensory Healing",
    icon: Eye,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "Using the senses to calm and ground the nervous system",
    practices: [
      {
        name: "Cold Water Therapy",
        duration: "1-5 min",
        description: "Brief cold exposure activates the vagus nerve and resets the stress response.",
        steps: [
          "Start with cold water on face and wrists (simplest)",
          "Progress to cold shower for last 30 seconds",
          "Or hold ice cubes in hands for 30-60 seconds",
          "Focus on breath - it will want to be shallow, keep it slow",
          "Notice the energizing effect afterward",
          "Build tolerance gradually over weeks"
        ],
        benefits: "Vagus nerve activation, mood boost, increased alertness, stress resilience"
      },
      {
        name: "Sound Bath",
        duration: "15-30 min",
        description: "Immersion in healing sounds (singing bowls, nature sounds, binaural beats) that calm brainwaves.",
        steps: [
          "Find a comfortable position lying down",
          "Use headphones for binaural beats",
          "Choose: singing bowls, nature sounds, or 432Hz music",
          "Let the sounds wash over you without analyzing",
          "Allow your body to respond naturally",
          "Rest in silence for a few minutes after"
        ],
        benefits: "Reduces anxiety, induces theta brainwaves, promotes deep relaxation"
      },
      {
        name: "Self-Massage",
        duration: "10-15 min",
        description: "Touch is healing. Self-massage releases tension and activates the relaxation response.",
        steps: [
          "Start with hands - massage palms, fingers, wrists",
          "Move to face - gentle circles on temples, jaw, forehead",
          "Neck and shoulders - squeeze and release tight muscles",
          "Feet - roll a tennis ball under foot, massage arches",
          "Use oil or lotion for smoother movements",
          "Breathe deeply throughout, moving slowly"
        ],
        benefits: "Releases muscle tension, improves circulation, self-soothing, vagus nerve activation"
      }
    ]
  }
];

const quickPractices = [
  { name: "3 Deep Breaths", time: "30 sec", icon: Wind },
  { name: "Shake for 1 Minute", time: "1 min", icon: Activity },
  { name: "Cold Water on Face", time: "30 sec", icon: Droplets },
  { name: "Self-Hug", time: "1 min", icon: Heart },
  { name: "Eye Palming", time: "2 min", icon: Eye },
  { name: "Progressive Muscle Relaxation", time: "5 min", icon: Hand }
];

export default function BodyWellnessPage() {
  const [selectedCategory, setSelectedCategory] = useState(bodyCategories[0]);
  const [expandedPractice, setExpandedPractice] = useState(null);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-green">
                <Activity className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Body Wellness</h1>
                <p className="text-lead">Somatic practices to heal through the wisdom of your body</p>
              </div>
            </div>
          </header>

          <div className="card-bordered mb-8 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-start gap-4">
              <Brain className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">The Mind-Body Connection</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your body holds wisdom and stores experiences, including trauma. Somatic (body-based) practices help release 
                  what words cannot express. When we work with the body, we access healing pathways that the mind alone cannot reach.
                  Research in neuroscience confirms: the body is not separate from mental health—it's central to it.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">Quick Body Resets</h2>
            <p className="text-body-sm text-[var(--sage-600)] mb-4">Instant practices when you need immediate relief:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickPractices.map((practice, index) => (
                <div 
                  key={index}
                  className="card-bordered text-center p-4 hover:shadow-md transition-shadow"
                  data-testid={`card-quick-${index}`}
                >
                  <practice.icon className="h-6 w-6 mx-auto mb-2 text-[var(--teal-600)]" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{practice.name}</p>
                  <p className="text-xs text-[var(--sage-500)]">{practice.time}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2 mb-8">
            {bodyCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory.id === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
                data-testid={`button-category-${category.id}`}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>

          <div className={`card-bordered ${selectedCategory.bgColor} ${selectedCategory.borderColor} mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <selectedCategory.icon className={`h-8 w-8 ${selectedCategory.color}`} />
              <div>
                <h2 className="text-heading-lg text-gray-900 dark:text-white">{selectedCategory.title}</h2>
                <p className="text-body-sm text-[var(--sage-600)]">{selectedCategory.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedCategory.practices.map((practice, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
                >
                  <button
                    onClick={() => setExpandedPractice(expandedPractice === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                    data-testid={`button-practice-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedCategory.bgColor}`}>
                        <Timer className={`h-5 w-5 ${selectedCategory.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{practice.name}</h3>
                        <p className="text-sm text-[var(--sage-500)]">{practice.duration}</p>
                      </div>
                    </div>
                    <Sparkles className={`h-5 w-5 ${selectedCategory.color}`} />
                  </button>
                  
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{practice.description}</p>
                  
                  {expandedPractice === index && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">How to Practice:</h4>
                        <ol className="space-y-2">
                          {practice.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full ${selectedCategory.bgColor} ${selectedCategory.color} flex items-center justify-center text-xs font-medium`}>
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className={`${selectedCategory.bgColor} rounded-lg p-4`}>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Benefits:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{practice.benefits}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/breathing" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-breathing">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="h-6 w-6 text-blue-500" />
                <h3 className="text-heading-md text-teal">Breathing Exercises</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                Interactive guided breathing exercises with timers and animations
              </p>
            </Link>
            <Link href="/grounding" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-grounding">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="h-6 w-6 text-green-500" />
                <h3 className="text-heading-md text-teal">Grounding Techniques</h3>
              </div>
              <p className="text-body-sm text-[var(--sage-600)]">
                Somatic practices to reconnect with your body and the present moment
              </p>
            </Link>
          </section>

          <footer className="card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              <strong>Gentle Reminder:</strong> Listen to your body. If any practice feels uncomfortable, stop and try something else. 
              For chronic pain or physical conditions, consult a healthcare provider before starting new practices.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
