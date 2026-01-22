import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  Coffee,
  Bed,
  Activity,
  Wind,
  BookOpen,
  Sparkles,
  Brain,
  Heart,
  Droplets,
  Leaf,
  Music,
  Phone,
  Utensils,
  Timer,
  Star
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import RelatedNextSteps from "../components/RelatedNextSteps.jsx";

const routines = [
  {
    id: "morning",
    title: "Morning Routine",
    subtitle: "Start your day with intention and energy",
    icon: Sun,
    timeRange: "6:00 AM - 9:00 AM",
    duration: "45-90 minutes",
    overview: "How you start your day sets the tone for everything that follows. A intentional morning routine primes your nervous system for resilience, clarity, and well-being.",
    activities: [
      {
        time: "Upon waking",
        name: "Gentle Awakening",
        duration: "5 min",
        icon: Bed,
        description: "Before checking your phone, take 3 deep breaths. Stretch in bed. Set an intention: 'Today I will...'",
        why: "Immediately reaching for your phone puts you in reactive mode. Gentle waking activates your parasympathetic nervous system."
      },
      {
        time: "+5 minutes",
        name: "Hydration",
        duration: "2 min",
        icon: Droplets,
        description: "Drink a full glass of water. Add lemon for extra benefit. Your body is dehydrated after sleep.",
        why: "Hydration improves cognitive function, energy, and mood. It also kickstarts your metabolism."
      },
      {
        time: "+10 minutes",
        name: "Movement",
        duration: "10-20 min",
        icon: Activity,
        description: "Gentle stretching, yoga, or a short walk. Match intensity to your energy—no forcing.",
        why: "Morning movement increases blood flow, releases endorphins, and reduces cortisol. It wakes up your body naturally."
      },
      {
        time: "+30 minutes",
        name: "Mindfulness",
        duration: "10-15 min",
        icon: Brain,
        description: "Meditation, breathing exercises, or quiet reflection. Even 5 minutes counts.",
        why: "Morning meditation builds mental clarity and emotional regulation that lasts throughout the day."
      },
      {
        time: "+45 minutes",
        name: "Nourishment",
        duration: "15-20 min",
        icon: Utensils,
        description: "Eat a nutritious breakfast mindfully, without screens. Protein and fiber stabilize energy.",
        why: "Mindful eating improves digestion and satisfaction. Balanced breakfast prevents afternoon crashes."
      },
      {
        time: "+60 minutes",
        name: "Intention Setting",
        duration: "5 min",
        icon: Star,
        description: "Write down 1-3 priorities for the day. Review your schedule. Set one word to embody today.",
        why: "Clarity about priorities prevents overwhelm and ensures you spend time on what matters most."
      }
    ],
    tips: [
      "Prepare the night before (clothes, breakfast items, bag) to reduce morning decisions",
      "Wake 30 minutes earlier than necessary to avoid rushing",
      "Keep your phone in another room until after your routine",
      "Make it enjoyable—a rushed routine defeats the purpose"
    ]
  },
  {
    id: "midday",
    title: "Midday Reset",
    subtitle: "Restore energy and maintain focus",
    icon: Sunset,
    timeRange: "12:00 PM - 2:00 PM",
    duration: "30-60 minutes",
    overview: "Midday is when energy naturally dips. A reset routine prevents afternoon slumps and re-centers you for the second half of your day.",
    activities: [
      {
        time: "Midday",
        name: "Transition Pause",
        duration: "2 min",
        icon: Timer,
        description: "Before lunch, take 3 deep breaths. Release the morning. Check in: How am I feeling? What do I need?",
        why: "A brief pause prevents carrying morning stress into afternoon. It allows conscious transition between activities."
      },
      {
        time: "+5 minutes",
        name: "Mindful Lunch",
        duration: "20-30 min",
        icon: Utensils,
        description: "Step away from your desk. Eat without screens. Chew slowly. Notice flavors and textures.",
        why: "Eating at your desk while working impairs digestion and prevents mental rest. A proper break improves afternoon focus."
      },
      {
        time: "+35 minutes",
        name: "Movement Break",
        duration: "10-15 min",
        icon: Activity,
        description: "Walk outside if possible. Stretch. Climb stairs. Any movement that gets blood flowing.",
        why: "Movement counters the sedentary effects of desk work, boosts energy, and exposes you to natural light."
      },
      {
        time: "+50 minutes",
        name: "Social Connection",
        duration: "5-10 min",
        icon: Heart,
        description: "Brief chat with a colleague or friend. Even a short positive interaction boosts mood.",
        why: "Social connection releases oxytocin and reduces stress. It reminds us we're not alone."
      },
      {
        time: "+60 minutes",
        name: "Afternoon Intention",
        duration: "2 min",
        icon: Star,
        description: "Review remaining priorities. Choose 1-2 focus tasks for the afternoon. Clear your workspace.",
        why: "Re-centering on priorities prevents afternoon drift. A clear workspace supports clear thinking."
      }
    ],
    tips: [
      "Protect your lunch break—it's not optional",
      "Get outside, even for 5 minutes, for natural light exposure",
      "Avoid heavy meals that cause energy crashes",
      "If you can, take a 20-minute power nap (before 2 PM)"
    ]
  },
  {
    id: "evening",
    title: "Evening Wind-Down",
    subtitle: "Transition from doing to being",
    icon: Moon,
    timeRange: "7:00 PM - 10:00 PM",
    duration: "60-90 minutes",
    overview: "Evening routines prepare your body and mind for restorative sleep. They create a buffer between the day's demands and rest.",
    activities: [
      {
        time: "After dinner",
        name: "Digital Sunset",
        duration: "Ongoing",
        icon: Phone,
        description: "Reduce screen time 1-2 hours before bed. Use night mode on devices. Switch to calming activities.",
        why: "Blue light suppresses melatonin. Stimulating content keeps your mind active when it should be winding down."
      },
      {
        time: "+30 minutes",
        name: "Reflection",
        duration: "10 min",
        icon: BookOpen,
        description: "Journal about the day. What went well? What are you grateful for? What would you do differently?",
        why: "Processing the day prevents rumination at bedtime. Gratitude practice improves sleep quality."
      },
      {
        time: "+45 minutes",
        name: "Gentle Movement",
        duration: "10-15 min",
        icon: Leaf,
        description: "Gentle yoga, stretching, or a slow walk. Nothing intense—the goal is to relax your body.",
        why: "Gentle movement releases physical tension from the day and signals to your body that it's time to slow down."
      },
      {
        time: "+60 minutes",
        name: "Calming Activity",
        duration: "20-30 min",
        icon: Music,
        description: "Reading, calming music, gentle conversation, or a warm bath. Whatever helps you unwind.",
        why: "Enjoyable, low-stimulation activities transition you from doing to being, preparing for sleep."
      },
      {
        time: "+90 minutes",
        name: "Sleep Preparation",
        duration: "15 min",
        icon: Bed,
        description: "Dim lights. Cool room (65-68°F). Skincare routine. Prepare for tomorrow. Breathwork or body scan.",
        why: "Consistent pre-sleep rituals signal to your brain that sleep is coming, making it easier to fall asleep."
      }
    ],
    tips: [
      "Same bedtime daily, even weekends, for better sleep quality",
      "Keep bedroom for sleep only—not work or entertainment",
      "Avoid caffeine after 2 PM and alcohol close to bedtime",
      "If worried thoughts arise, write them down for tomorrow"
    ]
  }
];

const quickWins = [
  { name: "3 Deep Breaths", time: "30 sec", icon: Wind, when: "Anytime stressed" },
  { name: "Glass of Water", time: "1 min", icon: Droplets, when: "Upon waking" },
  { name: "Gratitude Thought", time: "30 sec", icon: Heart, when: "Morning or night" },
  { name: "5 Min Walk", time: "5 min", icon: Activity, when: "After sitting 1 hour" },
  { name: "Phone-Free Meal", time: "15 min", icon: Utensils, when: "At least once daily" },
  { name: "2-Minute Stretch", time: "2 min", icon: Leaf, when: "Throughout the day" }
];

export default function DailyRoutinesPage() {
  const [selectedRoutine, setSelectedRoutine] = useState(routines[0]);
  const [completedActivities, setCompletedActivities] = useState({});

  useSEO({
    title: "Daily Routines",
    description: "Wellness routines for morning, afternoon, and evening. Build sustainable daily habits for mental and emotional wellbeing.",
  });

  const toggleActivity = (routineId, activityIndex) => {
    const key = `${routineId}-${activityIndex}`;
    setCompletedActivities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">Daily Wellness Routines</h1>
                <p className="text-lead">Structured practices for morning, midday, and evening wellbeing</p>
              </div>
            </div>
          </header>

          <section className="mb-10">
            <h2 className="text-heading-md mb-4" style={{ color: 'var(--glp-sage-deep)' }}>Quick Wins (No Routine Required)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickWins.map((item, index) => (
                <div 
                  key={index}
                  className="card-bordered text-center p-4 rounded-xl"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-quick-${index}`}
                >
                  <item.icon className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--glp-teal)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{item.time}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--glp-sage)' }}>{item.when}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex gap-2 mb-8">
            {routines.map(routine => (
              <button
                key={routine.id}
                onClick={() => setSelectedRoutine(routine)}
                className="flex-1 py-4 px-6 rounded-xl border-2 transition-all"
                style={selectedRoutine.id === routine.id 
                  ? { background: 'var(--glp-sage-10)', border: '2px solid var(--glp-sage)' } 
                  : { background: 'var(--glp-paper)', border: '2px solid var(--glp-sage-15)' }
                }
                data-testid={`button-routine-${routine.id}`}
              >
                <routine.icon className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--glp-sage-deep)' }} />
                <p className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{routine.title}</p>
                <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{routine.timeRange}</p>
              </button>
            ))}
          </div>

          <div className="card-bordered mb-8 p-6 rounded-2xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
            <div className="flex items-center gap-3 mb-4">
              <selectedRoutine.icon className="h-8 w-8" style={{ color: 'var(--glp-sage-deep)' }} />
              <div>
                <h2 className="text-heading-lg" style={{ color: 'var(--glp-sage-deep)' }}>{selectedRoutine.title}</h2>
                <p className="text-sm" style={{ color: 'var(--glp-sage)' }}>{selectedRoutine.subtitle} • {selectedRoutine.duration}</p>
              </div>
            </div>

            <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>{selectedRoutine.overview}</p>

            <div className="space-y-4">
              {selectedRoutine.activities.map((activity, index) => {
                const isCompleted = completedActivities[`${selectedRoutine.id}-${index}`];
                
                return (
                  <div 
                    key={index}
                    className="rounded-xl p-5 transition-all"
                    style={isCompleted 
                      ? { background: 'var(--glp-sage-15)', border: '1px solid var(--glp-sage)' }
                      : { background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }
                    }
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleActivity(selectedRoutine.id, index)}
                        className="flex-shrink-0 mt-1"
                        data-testid={`button-activity-${index}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--glp-sage)' }} />
                        ) : (
                          <Circle className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <activity.icon className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
                          <h3 
                            className={`font-semibold ${isCompleted ? 'line-through' : ''}`}
                            style={{ color: isCompleted ? 'var(--glp-sage)' : 'var(--glp-ink)' }}
                          >
                            {activity.name}
                          </h3>
                          <span className="text-xs" style={{ color: 'var(--glp-sage)' }}>{activity.duration}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--glp-sage)' }}>{activity.description}</p>
                        <p className="text-xs italic" style={{ color: 'var(--glp-sage)' }}>Why: {activity.why}</p>
                      </div>
                      
                      <span className="text-xs whitespace-nowrap" style={{ color: 'var(--glp-sage)' }}>{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--glp-ink)' }}>Tips for Success</h3>
              <ul className="space-y-2">
                {selectedRoutine.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm" style={{ color: 'var(--glp-sage)' }}>
                    <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage-deep)' }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <RelatedNextSteps 
            steps={[
              { title: "Behavior Change", description: "Science-backed habit building", path: "/behavior-change" },
              { title: "Body Wellness", description: "Physical wellbeing practices", path: "/body-wellness" },
              { title: "Meditation Guide", description: "Deepen your mindfulness practice", path: "/meditation-guide" },
            ]}
            title="Continue Your Journey"
          />

          <footer className="card-bordered mt-8 p-6 rounded-xl" style={{ background: 'var(--glp-gold-30)', border: '1px solid var(--glp-gold)' }}>
            <p className="text-sm text-center" style={{ color: 'var(--glp-gold-dark)' }}>
              <strong>Start Small:</strong> Don't try to implement everything at once. Pick 1-2 activities from one routine 
              and practice consistently for 2 weeks before adding more. Consistency beats perfection.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
