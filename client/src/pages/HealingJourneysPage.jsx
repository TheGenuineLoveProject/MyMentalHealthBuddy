import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Circle,
  Heart,
  Shield,
  Sun,
  Brain,
  Sparkles,
  Users,
  Flower2,
  Clock,
  Star,
  ChevronRight,
  Lock
} from "lucide-react";

const healingJourneys = [
  {
    id: "self-love",
    title: "30 Days of Self-Love",
    subtitle: "Building a foundation of self-compassion",
    duration: "4 weeks",
    icon: Heart,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-200 dark:border-rose-800",
    description: "Transform your relationship with yourself through daily practices of self-compassion, self-acceptance, and self-care. This journey is designed for anyone who struggles with self-criticism or feels disconnected from self-love.",
    outcomes: [
      "Recognize and challenge your inner critic",
      "Develop a consistent self-care routine",
      "Build self-compassion through practical exercises",
      "Create lasting patterns of self-kindness"
    ],
    weeks: [
      {
        title: "Week 1: Awareness",
        theme: "Noticing your inner dialogue",
        activities: [
          { name: "Inner Critic Journal", description: "Track negative self-talk patterns" },
          { name: "Self-Talk Observation", description: "Notice how you speak to yourself" },
          { name: "Compassion Letter", description: "Write to yourself as a friend would" }
        ]
      },
      {
        title: "Week 2: Acceptance",
        theme: "Embracing yourself as you are",
        activities: [
          { name: "Mirror Work", description: "Practice loving affirmations in the mirror" },
          { name: "Body Gratitude", description: "Appreciate what your body does for you" },
          { name: "Shadow Integration", description: "Accept the parts you usually hide" }
        ]
      },
      {
        title: "Week 3: Action",
        theme: "Self-care as self-love",
        activities: [
          { name: "Self-Care Menu", description: "Create your personalized self-care toolkit" },
          { name: "Boundary Practice", description: "Say no to honor your needs" },
          { name: "Joy Inventory", description: "Rediscover what brings you happiness" }
        ]
      },
      {
        title: "Week 4: Integration",
        theme: "Making self-love a lifestyle",
        activities: [
          { name: "Morning Self-Love Ritual", description: "Create a daily practice" },
          { name: "Self-Love Letter", description: "Write to your future self" },
          { name: "Celebration", description: "Honor your growth and commitment" }
        ]
      }
    ]
  },
  {
    id: "anxiety-relief",
    title: "Calming the Storm",
    subtitle: "A journey from anxiety to peace",
    duration: "6 weeks",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Learn to understand, manage, and reduce anxiety through a structured program of evidence-based techniques. Move from feeling overwhelmed to experiencing genuine calm and resilience.",
    outcomes: [
      "Understand your anxiety patterns and triggers",
      "Master breathwork and grounding techniques",
      "Rewire anxious thought patterns",
      "Build long-term anxiety resilience"
    ],
    weeks: [
      {
        title: "Week 1-2: Understanding",
        theme: "Know your anxiety",
        activities: [
          { name: "Anxiety Mapping", description: "Identify triggers and patterns" },
          { name: "Body Awareness", description: "Recognize physical anxiety signals" },
          { name: "Nervous System Education", description: "Learn polyvagal theory basics" }
        ]
      },
      {
        title: "Week 3-4: Techniques",
        theme: "Building your toolkit",
        activities: [
          { name: "Breathwork Mastery", description: "Practice calming breathing techniques" },
          { name: "Grounding Practice", description: "Learn 5-4-3-2-1 and body-based grounding" },
          { name: "Thought Challenging", description: "Question and reframe anxious thoughts" }
        ]
      },
      {
        title: "Week 5-6: Integration",
        theme: "Living with ease",
        activities: [
          { name: "Exposure Practice", description: "Gradually face feared situations" },
          { name: "Prevention Plan", description: "Create your anxiety management strategy" },
          { name: "Lifestyle Audit", description: "Optimize sleep, movement, and nutrition" }
        ]
      }
    ]
  },
  {
    id: "trauma-healing",
    title: "Healing from Within",
    subtitle: "A gentle path through trauma recovery",
    duration: "8 weeks",
    icon: Flower2,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "A trauma-informed journey that respects your pace and prioritizes safety. This program combines psychoeducation with gentle somatic practices to support nervous system healing.",
    outcomes: [
      "Create safety within your body and mind",
      "Understand trauma's effects on your nervous system",
      "Release stored tension through somatic practices",
      "Reclaim parts of yourself lost to trauma"
    ],
    weeks: [
      {
        title: "Week 1-2: Safety First",
        theme: "Building your container",
        activities: [
          { name: "Safe Space Visualization", description: "Create an internal refuge" },
          { name: "Resource Building", description: "Identify what helps you feel safe" },
          { name: "Window of Tolerance", description: "Learn your capacity for emotions" }
        ]
      },
      {
        title: "Week 3-4: Understanding",
        theme: "Making sense of your experience",
        activities: [
          { name: "Trauma Education", description: "Learn how trauma affects brain and body" },
          { name: "Nervous System States", description: "Recognize fight/flight/freeze patterns" },
          { name: "Trigger Mapping", description: "Identify and prepare for triggers" }
        ]
      },
      {
        title: "Week 5-6: Processing",
        theme: "Releasing what's stored",
        activities: [
          { name: "Somatic Awareness", description: "Connect with body sensations safely" },
          { name: "Pendulation", description: "Move between safety and activation gently" },
          { name: "Emotional Release", description: "Allow and process frozen emotions" }
        ]
      },
      {
        title: "Week 7-8: Integration",
        theme: "Reclaiming your life",
        activities: [
          { name: "Post-Traumatic Growth", description: "Find meaning and strength" },
          { name: "Identity Reclamation", description: "Reconnect with who you truly are" },
          { name: "Future Visioning", description: "Imagine your healed life" }
        ]
      }
    ]
  },
  {
    id: "inner-child",
    title: "Inner Child Reunion",
    subtitle: "Healing your earliest wounds",
    duration: "4 weeks",
    icon: Sun,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    description: "Connect with and nurture the wounded child within you. Through gentle exercises, learn to reparent yourself and heal core wounds from childhood that still affect your adult life.",
    outcomes: [
      "Connect with your inner child",
      "Understand unmet childhood needs",
      "Practice reparenting yourself",
      "Heal attachment wounds"
    ],
    weeks: [
      {
        title: "Week 1: Meeting",
        theme: "Making first contact",
        activities: [
          { name: "Photo Meditation", description: "Connect with your childhood self" },
          { name: "Memory Exploration", description: "Recall significant childhood moments" },
          { name: "Letter to Child Self", description: "Begin the dialogue" }
        ]
      },
      {
        title: "Week 2: Understanding",
        theme: "What did you need?",
        activities: [
          { name: "Needs Assessment", description: "Identify unmet childhood needs" },
          { name: "Core Beliefs", description: "Discover beliefs formed in childhood" },
          { name: "Wound Mapping", description: "Understand where hurt lives" }
        ]
      },
      {
        title: "Week 3: Nurturing",
        theme: "Becoming your own good parent",
        activities: [
          { name: "Reparenting Practice", description: "Give yourself what you needed" },
          { name: "Inner Child Play", description: "Rediscover joy and spontaneity" },
          { name: "Safe Container", description: "Create safety for your inner child" }
        ]
      },
      {
        title: "Week 4: Integration",
        theme: "Carrying them forward",
        activities: [
          { name: "Integration Ritual", description: "Bring inner child into adult life" },
          { name: "Ongoing Practice", description: "Maintain the relationship" },
          { name: "Celebration", description: "Honor the healing journey" }
        ]
      }
    ]
  },
  {
    id: "relationship-healing",
    title: "Secure in Love",
    subtitle: "Healing attachment patterns",
    duration: "6 weeks",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Understand your attachment style and learn to create healthier relationship patterns. Whether you tend toward anxious, avoidant, or disorganized attachment, this journey helps you move toward secure attachment.",
    outcomes: [
      "Identify your attachment style",
      "Understand relationship patterns",
      "Develop secure attachment behaviors",
      "Improve communication and boundaries"
    ],
    weeks: [
      {
        title: "Week 1-2: Discovery",
        theme: "Understanding your patterns",
        activities: [
          { name: "Attachment Assessment", description: "Identify your attachment style" },
          { name: "Pattern Recognition", description: "See recurring relationship themes" },
          { name: "Origin Story", description: "Connect patterns to early experiences" }
        ]
      },
      {
        title: "Week 3-4: Healing",
        theme: "Rewiring old patterns",
        activities: [
          { name: "Self-Soothing", description: "Calm your own nervous system" },
          { name: "Triggers and Responses", description: "Pause before reacting" },
          { name: "Emotional Regulation", description: "Manage relationship anxiety" }
        ]
      },
      {
        title: "Week 5-6: Growth",
        theme: "Building secure behaviors",
        activities: [
          { name: "Communication Practice", description: "Express needs clearly" },
          { name: "Boundary Setting", description: "Protect yourself with love" },
          { name: "Secure Base", description: "Become your own secure attachment" }
        ]
      }
    ]
  },
  {
    id: "purpose-discovery",
    title: "Finding Your North Star",
    subtitle: "A journey to discover your life purpose",
    duration: "4 weeks",
    icon: Star,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    description: "Move from feeling lost or unfulfilled to discovering what truly matters to you. This journey combines values clarification, strengths discovery, and vision work to help you find your unique purpose.",
    outcomes: [
      "Clarify your core values",
      "Discover your unique strengths",
      "Create a personal mission statement",
      "Design a purposeful life path"
    ],
    weeks: [
      {
        title: "Week 1: Values",
        theme: "What matters most?",
        activities: [
          { name: "Values Exploration", description: "Identify your top 5 values" },
          { name: "Peak Experiences", description: "Learn from your best moments" },
          { name: "Regret Analysis", description: "What do your regrets reveal?" }
        ]
      },
      {
        title: "Week 2: Strengths",
        theme: "What are you uniquely good at?",
        activities: [
          { name: "Strengths Assessment", description: "Identify your natural gifts" },
          { name: "Flow Moments", description: "When do you lose track of time?" },
          { name: "Feedback Gathering", description: "How do others see your gifts?" }
        ]
      },
      {
        title: "Week 3: Vision",
        theme: "Where are you going?",
        activities: [
          { name: "Future Self Visualization", description: "Meet your best possible self" },
          { name: "Ideal Day Exercise", description: "Design your perfect day" },
          { name: "Legacy Work", description: "What do you want to leave behind?" }
        ]
      },
      {
        title: "Week 4: Action",
        theme: "Making it real",
        activities: [
          { name: "Mission Statement", description: "Craft your personal purpose statement" },
          { name: "Goal Alignment", description: "Align goals with your purpose" },
          { name: "First Steps", description: "Begin living your purpose now" }
        ]
      }
    ]
  }
];

function JourneyCard({ journey, onSelect }) {
  return (
    <button
      onClick={() => onSelect(journey)}
      className={`w-full text-left p-6 rounded-2xl ${journey.bgColor} ${journey.borderColor} border-2 hover:shadow-lg transition-all group`}
      data-testid={`card-journey-${journey.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
          <journey.icon className={`h-8 w-8 ${journey.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[var(--teal-600)] transition-colors">
              {journey.title}
            </h3>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[var(--teal-600)] transition-colors" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{journey.subtitle}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {journey.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {journey.weeks.length} milestones
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function JourneyDetail({ journey, onBack }) {
  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[var(--sage-500)] hover:text-[var(--teal-600)] transition"
        data-testid="button-back-to-journeys"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all journeys
      </button>

      <div className={`p-8 rounded-2xl ${journey.bgColor} ${journey.borderColor} border-2`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
            <journey.icon className={`h-10 w-10 ${journey.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{journey.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{journey.subtitle}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {journey.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {journey.weeks.length} milestones
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{journey.description}</p>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What You'll Achieve:</h3>
          <ul className="space-y-2">
            {journey.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className={`h-5 w-5 ${journey.color} flex-shrink-0 mt-0.5`} />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Journey Roadmap</h3>
        
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-6">
            {journey.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="relative pl-16">
                <div className={`absolute left-0 top-0 w-12 h-12 rounded-full ${journey.bgColor} ${journey.borderColor} border-2 flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${journey.color}`}>{weekIndex + 1}</span>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{week.title}</h4>
                  <p className="text-sm text-[var(--sage-500)] mb-4">{week.theme}</p>
                  
                  <div className="space-y-3">
                    {week.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start gap-3">
                        <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{activity.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/dashboard" 
          className="flex-1 py-4 px-6 rounded-xl bg-[var(--teal-600)] text-white text-center font-semibold hover:bg-[var(--teal-700)] transition-colors"
          data-testid="button-start-journey"
        >
          Start This Journey
        </Link>
        <button 
          onClick={onBack}
          className="py-4 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          data-testid="button-explore-more"
        >
          Explore Other Journeys
        </button>
      </div>
    </div>
  );
}

export default function HealingJourneysPage() {
  const [selectedJourney, setSelectedJourney] = useState(null);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          {!selectedJourney ? (
            <>
              <header className="mb-8">
                <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
                  <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
                </Link>
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-xl icon-gradient-teal">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-display-lg text-teal" data-testid="text-page-title">Healing Journeys</h1>
                    <p className="text-lead">Structured multi-week pathways for deep transformation</p>
                  </div>
                </div>
              </header>

              <div className="card-bordered mb-8 bg-indigo-50 dark:bg-indigo-900/20">
                <div className="flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Path to Healing</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Each journey is designed with intentional pacing, allowing you to go deep while staying grounded. 
                      Choose a path that resonates with your current needs. You can always pause, restart, or switch journeys. 
                      Healing is not linear—honor your unique process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {healingJourneys.map(journey => (
                  <JourneyCard 
                    key={journey.id} 
                    journey={journey} 
                    onSelect={setSelectedJourney} 
                  />
                ))}
              </div>

              <footer className="mt-8 card-bordered bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                  <strong>Important:</strong> These journeys are supportive wellness tools, not therapy. 
                  For trauma healing especially, we recommend working with a qualified therapist alongside these resources. 
                  Go at your own pace and prioritize your safety.
                </p>
              </footer>
            </>
          ) : (
            <JourneyDetail journey={selectedJourney} onBack={() => setSelectedJourney(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
