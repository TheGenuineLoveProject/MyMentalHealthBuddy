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
  Lock,
  BookOpen,
  Zap,
  Eye
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";

const healingJourneys = [
  {
    id: "self-love",
    title: "30 Days of Genuine Self-Love",
    subtitle: "Building the foundation of unconditional self-acceptance",
    duration: "4 weeks",
    icon: Heart,
    frameworks: ["Self-Compassion (Kristin Neff)", "Compassion-Focused Therapy", "IFS Self-Leadership"],
    description: "Transform your relationship with yourself through evidence-based practices of self-compassion, self-acceptance, and radical self-kindness. Grounded in Kristin Neff's research showing self-compassion is more beneficial than self-esteem, without the downsides. This journey rewires your inner critic into an inner ally.",
    outcomes: [
      "Recognize and befriend your inner critic parts (IFS approach)",
      "Develop a consistent self-care routine that honors your needs",
      "Build self-compassion using Neff's three components: kindness, common humanity, mindfulness",
      "Create lasting patterns of self-kindness that become your new default"
    ],
    weeks: [
      {
        title: "Week 1: Awareness",
        theme: "Meeting your inner critic with curiosity",
        activities: [
          { name: "Inner Critic Mapping", description: "Identify the voices, their origins, and their protective intentions (IFS approach)" },
          { name: "Self-Talk Observation", description: "Notice how you speak to yourself throughout the day—without judgment" },
          { name: "Compassion Letter", description: "Write to yourself as a loving friend would write to you" }
        ]
      },
      {
        title: "Week 2: Acceptance",
        theme: "Embracing yourself exactly as you are",
        activities: [
          { name: "Mirror Work", description: "Practice loving affirmations while maintaining eye contact with yourself" },
          { name: "Body Gratitude Practice", description: "Appreciate what your body does for you, not just how it looks" },
          { name: "Shadow Integration", description: "Accept the parts you've learned to hide—they belong here too" }
        ]
      },
      {
        title: "Week 3: Action",
        theme: "Self-care as a form of self-love",
        activities: [
          { name: "Self-Care Menu Creation", description: "Build a personalized toolkit for different emotional states" },
          { name: "Boundary Practice", description: "Learn that 'no' is a complete sentence that protects your wellbeing" },
          { name: "Joy Inventory", description: "Rediscover what brings you genuine happiness—not just productivity" }
        ]
      },
      {
        title: "Week 4: Integration",
        theme: "Making self-love your lifestyle",
        activities: [
          { name: "Morning Self-Love Ritual", description: "Create a daily practice that sets a compassionate tone" },
          { name: "Self-Love Letter to Future Self", description: "Document your growth and intentions going forward" },
          { name: "Celebration Ceremony", description: "Honor your courage and commitment to yourself" }
        ]
      }
    ]
  },
  {
    id: "anxiety-relief",
    title: "Calming the Storm Within",
    subtitle: "From chronic anxiety to embodied calm",
    duration: "6 weeks",
    icon: Shield,
    frameworks: ["Polyvagal Theory", "DBT Skills", "Cognitive Behavioral Therapy", "Somatic Approaches"],
    description: "Learn to understand, regulate, and reduce anxiety through a comprehensive program grounded in polyvagal theory and nervous system science. Move from feeling overwhelmed to experiencing genuine calm—not by fighting anxiety, but by befriending your nervous system and giving it what it needs to feel safe.",
    outcomes: [
      "Understand your anxiety patterns through polyvagal lens (fight/flight/freeze)",
      "Master breathwork, grounding, and nervous system regulation techniques",
      "Rewire anxious thought patterns using CBT principles",
      "Expand your window of tolerance for life's challenges"
    ],
    weeks: [
      {
        title: "Week 1-2: Understanding",
        theme: "Befriending your nervous system",
        activities: [
          { name: "Anxiety Mapping", description: "Identify triggers, body sensations, and typical responses" },
          { name: "Nervous System States", description: "Learn polyvagal theory—ventral vagal, sympathetic, dorsal vagal" },
          { name: "Window of Tolerance Work", description: "Map your personal capacity for arousal and regulation" }
        ]
      },
      {
        title: "Week 3-4: Techniques",
        theme: "Building your regulation toolkit",
        activities: [
          { name: "Breathwork Mastery", description: "Practice 4-7-8, box breathing, coherent breathing for different needs" },
          { name: "Grounding Practice", description: "5-4-3-2-1 senses, feet on ground, cold water, and more" },
          { name: "Cognitive Reframing", description: "Question and reframe anxious thoughts using CBT techniques" }
        ]
      },
      {
        title: "Week 5-6: Integration",
        theme: "Building a calmer life",
        activities: [
          { name: "Gradual Exposure", description: "Gently face feared situations while maintaining regulation" },
          { name: "Prevention Plan", description: "Create your personalized anxiety management strategy" },
          { name: "Lifestyle Optimization", description: "Examine sleep, movement, nutrition, and screen time" }
        ]
      }
    ]
  },
  {
    id: "trauma-healing",
    title: "The Path Through Trauma",
    subtitle: "A gentle, somatic approach to trauma recovery",
    duration: "8 weeks",
    icon: Flower2,
    frameworks: ["Somatic Experiencing (Peter Levine)", "Polyvagal Theory", "Trauma-Informed IFS", "Window of Tolerance"],
    description: "A trauma-informed journey that prioritizes safety, respects your pace, and never pushes you beyond your window of tolerance. This program combines psychoeducation with gentle somatic practices to support nervous system healing. Based on the understanding that trauma lives in the body—and so does the path to healing.",
    outcomes: [
      "Create internal and external safety for healing work",
      "Understand how trauma affects brain, body, and nervous system",
      "Release stored tension and survival energy through somatic practices",
      "Reclaim parts of yourself that trauma caused you to disconnect from"
    ],
    weeks: [
      {
        title: "Week 1-2: Safety & Stabilization",
        theme: "Building the container for healing",
        activities: [
          { name: "Safe Place Visualization", description: "Create a detailed internal refuge you can access anytime" },
          { name: "Resource Building", description: "Identify people, places, activities that help you feel safe" },
          { name: "Window of Tolerance Mapping", description: "Understand your capacity and build regulation skills" }
        ]
      },
      {
        title: "Week 3-4: Psychoeducation",
        theme: "Making sense of your experience",
        activities: [
          { name: "Trauma-Informed Education", description: "Learn how trauma affects the brain and why you react as you do" },
          { name: "Nervous System States", description: "Recognize fight/flight/freeze/fawn patterns in daily life" },
          { name: "Trigger Mapping & Planning", description: "Identify triggers and create response plans" }
        ]
      },
      {
        title: "Week 5-6: Somatic Processing",
        theme: "Releasing what's stored in the body",
        activities: [
          { name: "Body Awareness Practice", description: "Gently reconnect with body sensations, titrated for safety" },
          { name: "Pendulation", description: "Move between activation and calm, completing survival responses" },
          { name: "Discharge & Release", description: "Allow natural trembling, movement, or emotional release" }
        ]
      },
      {
        title: "Week 7-8: Integration & Growth",
        theme: "Reclaiming your life",
        activities: [
          { name: "Post-Traumatic Growth", description: "Identify meaning and strength that emerged from your journey" },
          { name: "Identity Reclamation", description: "Reconnect with who you are beyond what happened to you" },
          { name: "Future Visioning", description: "Envision the life that becomes possible as you heal" }
        ]
      }
    ]
  },
  {
    id: "inner-child",
    title: "Inner Child Reunion",
    subtitle: "Reparenting yourself with the love you deserved",
    duration: "4 weeks",
    icon: Sun,
    frameworks: ["Internal Family Systems", "Attachment Theory", "Developmental Psychology (Erikson)", "Reparenting Techniques"],
    description: "Connect with and nurture the wounded child parts within you. Through gentle IFS-informed exercises, learn to reparent yourself—giving yourself now what you needed then. This journey addresses core wounds from childhood that still affect your adult life, relationships, and self-perception.",
    outcomes: [
      "Meet and befriend your inner child parts with IFS self-energy",
      "Understand unmet developmental needs (Erikson's stages)",
      "Practice daily reparenting to give yourself what you always deserved",
      "Heal attachment wounds and develop internal secure base"
    ],
    weeks: [
      {
        title: "Week 1: Meeting",
        theme: "Making first contact",
        activities: [
          { name: "Photo Meditation", description: "Connect with your childhood self through photographs and memory" },
          { name: "Memory Exploration", description: "Recall significant childhood moments—both painful and joyful" },
          { name: "Letter to Child Self", description: "Begin the dialogue with your younger self" }
        ]
      },
      {
        title: "Week 2: Understanding",
        theme: "What did you need?",
        activities: [
          { name: "Developmental Needs Assessment", description: "Identify unmet needs from each developmental stage" },
          { name: "Core Beliefs Excavation", description: "Discover beliefs about yourself formed in childhood" },
          { name: "Wound Mapping", description: "Understand where hurt lives in your body and psyche" }
        ]
      },
      {
        title: "Week 3: Nurturing",
        theme: "Becoming your own good parent",
        activities: [
          { name: "Reparenting Meditations", description: "Give yourself the comfort, safety, and validation you needed" },
          { name: "Inner Child Play", description: "Reconnect with joy, spontaneity, and unstructured play" },
          { name: "Safe Container Creation", description: "Build internal safety for your inner child" }
        ]
      },
      {
        title: "Week 4: Integration",
        theme: "Carrying them forward with you",
        activities: [
          { name: "Integration Ritual", description: "Consciously bring inner child into your adult life" },
          { name: "Ongoing Reparenting Practice", description: "Establish daily habits of self-nurturing" },
          { name: "Celebration & Commitment", description: "Honor this profound healing work" }
        ]
      }
    ]
  },
  {
    id: "relationship-healing",
    title: "Secure in Love",
    subtitle: "Healing attachment patterns for healthier relationships",
    duration: "6 weeks",
    icon: Users,
    frameworks: ["Attachment Theory (Bowlby/Ainsworth)", "Polyvagal Theory for Relationships", "Emotionally Focused Therapy Concepts"],
    description: "Understand your attachment style and learn to create healthier relationship patterns. Whether you tend toward anxious (fear of abandonment), avoidant (fear of intimacy), or disorganized (both) attachment, this journey helps you move toward earned secure attachment—the capacity for healthy interdependence.",
    outcomes: [
      "Identify your attachment style and understand its origins",
      "Recognize relationship patterns that stem from early attachment",
      "Develop secure attachment behaviors through practice",
      "Become your own secure base while connecting healthily with others"
    ],
    weeks: [
      {
        title: "Week 1-2: Discovery",
        theme: "Understanding your attachment patterns",
        activities: [
          { name: "Attachment Style Assessment", description: "Identify your primary and secondary attachment patterns" },
          { name: "Pattern Recognition", description: "See how attachment plays out in current and past relationships" },
          { name: "Origin Story Work", description: "Connect current patterns to early childhood experiences" }
        ]
      },
      {
        title: "Week 3-4: Healing",
        theme: "Rewiring old attachment patterns",
        activities: [
          { name: "Self-Soothing for Attachment", description: "Learn to calm your own nervous system when triggered" },
          { name: "Trigger & Response Work", description: "Create space between attachment trigger and reaction" },
          { name: "Emotional Regulation Skills", description: "Manage relationship anxiety without acting it out" }
        ]
      },
      {
        title: "Week 5-6: Secure Behaviors",
        theme: "Building the capacity for healthy love",
        activities: [
          { name: "Secure Communication Practice", description: "Express needs clearly without manipulation or withdrawal" },
          { name: "Boundary Setting in Love", description: "Protect yourself while staying connected" },
          { name: "Becoming Your Own Secure Base", description: "Develop internal security that doesn't depend on others" }
        ]
      }
    ]
  },
  {
    id: "purpose-discovery",
    title: "Finding Your North Star",
    subtitle: "Discovering your authentic life purpose",
    duration: "4 weeks",
    icon: Star,
    frameworks: ["ACT Values Work", "Ikigai", "Meaning-Making Psychology", "Existential Psychology"],
    description: "Move from feeling lost or unfulfilled to discovering what truly matters to you. This journey combines ACT values clarification, strengths discovery, and vision work to help you find your unique purpose—not imposed by others, but authentically yours. Purpose isn't found; it's uncovered from within.",
    outcomes: [
      "Clarify your core values using ACT methodology",
      "Discover your unique strengths and how to apply them",
      "Create a personal mission statement that guides decisions",
      "Design a purposeful life path aligned with your authentic self"
    ],
    weeks: [
      {
        title: "Week 1: Values",
        theme: "What matters most to you?",
        activities: [
          { name: "Values Deep Dive", description: "Identify and rank your core values through multiple exercises" },
          { name: "Peak Experiences Analysis", description: "Learn from moments when you felt most alive" },
          { name: "Regret Mining", description: "What do your regrets reveal about unlived values?" }
        ]
      },
      {
        title: "Week 2: Strengths",
        theme: "What are you uniquely equipped for?",
        activities: [
          { name: "Strengths Assessment", description: "Identify your natural gifts and developed skills" },
          { name: "Flow State Mapping", description: "When do you lose track of time? What absorbs you?" },
          { name: "Feedback Synthesis", description: "How do others see your gifts? What do they come to you for?" }
        ]
      },
      {
        title: "Week 3: Vision",
        theme: "What are you building toward?",
        activities: [
          { name: "Future Self Visualization", description: "Meet the fully realized version of yourself" },
          { name: "Ideal Day Exercise", description: "Design your perfect day in detail" },
          { name: "Legacy Work", description: "What do you want to leave behind? What matters?" }
        ]
      },
      {
        title: "Week 4: Action",
        theme: "Bringing purpose into reality",
        activities: [
          { name: "Mission Statement Crafting", description: "Write your personal purpose statement" },
          { name: "Goal Alignment", description: "Ensure your goals serve your values and purpose" },
          { name: "First Steps", description: "Begin living your purpose today, not someday" }
        ]
      }
    ]
  }
];

function JourneyCard({ journey, onSelect }) {
  return (
    <button
      onClick={() => onSelect(journey)}
      className="w-full text-left p-6 rounded-2xl hover:shadow-lg transition-all group"
      style={{ background: 'var(--glp-sage-10)', border: '2px solid var(--glp-sage-20)' }}
      data-testid={`card-journey-${journey.id}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl shadow-sm" style={{ background: 'var(--glp-paper)' }}>
          <journey.icon className="h-8 w-8" style={{ color: 'var(--glp-sage-deep)' }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold transition-colors" style={{ color: 'var(--glp-sage-deep)' }}>
              {journey.title}
            </h3>
            <ChevronRight className="h-5 w-5 transition-colors" style={{ color: 'var(--glp-sage)' }} />
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--glp-sage)' }}>{journey.subtitle}</p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--glp-ink)' }}>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {journey.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {journey.weeks.length} phases
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
        className="inline-flex items-center gap-2 transition hover:opacity-80"
        style={{ color: 'var(--glp-sage)' }}
        data-testid="button-back-to-journeys"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all journeys
      </button>

      <div className="p-8 rounded-2xl" style={{ background: 'var(--glp-sage-10)', border: '2px solid var(--glp-sage-20)' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-xl shadow-sm" style={{ background: 'var(--glp-paper)' }}>
            <journey.icon className="h-10 w-10" style={{ color: 'var(--glp-sage-deep)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{journey.title}</h2>
            <p style={{ color: 'var(--glp-sage)' }}>{journey.subtitle}</p>
            <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'var(--glp-ink)' }}>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {journey.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {journey.weeks.length} phases
              </span>
            </div>
          </div>
        </div>

        <p className="mb-6" style={{ color: 'var(--glp-ink)' }}>{journey.description}</p>

        <div className="rounded-xl p-5 mb-4" style={{ background: 'var(--glp-paper)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
            <BookOpen className="h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
            Therapeutic Frameworks
          </h3>
          <div className="flex flex-wrap gap-2">
            {journey.frameworks.map((framework, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-xs" style={{ background: 'var(--glp-sage-15)', color: 'var(--glp-sage-deep)' }}>
                {framework}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--glp-sage-deep)' }}>
            <Sparkles className="h-5 w-5" style={{ color: 'var(--glp-gold)' }} />
            What You'll Achieve
          </h3>
          <ul className="space-y-2">
            {journey.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3 text-sm" style={{ color: 'var(--glp-ink)' }}>
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage)' }} />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>Your Journey Roadmap</h3>
        
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: 'var(--glp-sage-20)' }} />
          
          <div className="space-y-6">
            {journey.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="relative pl-16">
                <div 
                  className="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--glp-sage-15)', border: '2px solid var(--glp-sage-30)' }}
                >
                  <span className="text-lg font-bold" style={{ color: 'var(--glp-sage-deep)' }}>{weekIndex + 1}</span>
                </div>
                
                <div className="rounded-xl p-5" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--glp-sage-deep)' }}>{week.title}</h4>
                  <p className="text-sm mb-4 italic" style={{ color: 'var(--glp-sage)' }}>{week.theme}</p>
                  
                  <div className="space-y-3">
                    {week.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start gap-3">
                        <Circle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--glp-sage-30)' }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>{activity.name}</p>
                          <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{activity.description}</p>
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
          className="flex-1 py-4 px-6 rounded-xl text-white text-center font-semibold hover:opacity-90 transition-colors"
          style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
          data-testid="button-start-journey"
        >
          Begin This Journey
        </Link>
        <button 
          onClick={onBack}
          className="py-4 px-6 rounded-xl font-semibold transition-colors hover:opacity-80"
          style={{ border: '2px solid var(--glp-sage-20)', color: 'var(--glp-sage-deep)' }}
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

  useSEO({
    title: "Healing Journeys | Structured Therapeutic Programs | The Genuine Love Project",
    description: "Multi-week healing programs grounded in IFS, polyvagal theory, attachment science, and somatic approaches. Self-love, trauma healing, inner child work, and relationship repair."
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-teal-50) 100%)' }}>
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          {!selectedJourney ? (
            <>
              <header className="mb-8">
                <Link 
                  href="/wellness-hub" 
                  className="inline-flex items-center gap-2 text-body-sm mb-4 transition hover:opacity-80" 
                  style={{ color: 'var(--glp-sage)' }}
                  data-testid="link-back"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
                </Link>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                  >
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-display-lg" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">Healing Journeys</h1>
                    <p className="text-lead">Structured multi-week pathways for deep, lasting transformation</p>
                  </div>
                </div>
              </header>

              <div className="card-bordered mb-8 p-6 rounded-2xl" style={{ background: 'var(--glp-sage-10)', border: '1px solid var(--glp-sage-20)' }}>
                <div className="flex items-start gap-4">
                  <Brain className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage-deep)' }} />
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Evidence-Based Therapeutic Frameworks</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--glp-ink)' }}>
                      Each journey integrates proven therapeutic approaches—Internal Family Systems, polyvagal theory, 
                      attachment science, somatic experiencing, and more. These aren't pop psychology exercises; 
                      they're structured programs based on what research shows actually creates lasting change.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--glp-ink)' }}>
                      Healing is not linear—honor your unique pace. You can pause, restart, or switch journeys at any time.
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

              <footer className="mt-8 card-bordered p-6 rounded-2xl" style={{ background: 'var(--glp-gold-10)', border: '1px solid var(--glp-gold-30)' }}>
                <p className="text-sm text-center" style={{ color: 'var(--glp-gold-dark)' }}>
                  <strong>Important:</strong> These journeys are supportive wellness programs, not therapy. 
                  For trauma healing especially, we strongly recommend working with a qualified therapist alongside these resources. 
                  Always prioritize your safety—if content feels too activating, pause and ground yourself.
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
