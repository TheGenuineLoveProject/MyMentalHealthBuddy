import { useState } from "react";
import { Link } from "wouter";
import SafetyFooter from "../components/ui/SafetyFooter";
import BenefitsBlock from "@/components/BenefitsBlock";
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Sun, 
  Moon, 
  Star,
  Compass,
  Feather,
  Flame,
  TreePine,
  Waves,
  Eye,
  Book,
  Lightbulb,
  Users,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const soulCategories = [
  {
    id: "meaning",
    title: "Finding Meaning",
    icon: Compass,
    colorStyle: { color: 'var(--glp-sage-deep)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
    description: "Discovering purpose and significance in your life journey",
    practices: [
      {
        name: "Values Clarification",
        description: "Understanding your core values helps you make aligned decisions and live authentically.",
        reflection: "What matters most to you? What would you stand up for even if no one agreed? What do you want your life to represent?",
        exercise: "Write down 10 things you value most. Narrow it to 5. Then to 3. These are your core values. Notice how your current life aligns with them."
      },
      {
        name: "Ikigai Exploration",
        description: "Ikigai is the Japanese concept of 'reason for being' - the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.",
        reflection: "Where do passion, mission, vocation, and profession overlap in your life?",
        exercise: "Draw four overlapping circles. Label them: What I Love, What I'm Good At, What the World Needs, What I Can Be Paid For. Where they all overlap is your ikigai."
      },
      {
        name: "Legacy Reflection",
        description: "Considering the mark you want to leave helps clarify what truly matters.",
        reflection: "How do you want to be remembered? What impact do you want to have? What would you regret not doing or being?",
        exercise: "Write a letter from your future self at 90, looking back at your life. What advice would they give you? What are they proud of?"
      }
    ]
  },
  {
    id: "gratitude",
    title: "Gratitude Practices",
    icon: Heart,
    colorStyle: { color: 'var(--glp-rose)' },
    bgColorStyle: { background: 'var(--glp-rose-15)' },
    description: "Cultivating appreciation that transforms perspective",
    practices: [
      {
        name: "Morning Gratitude",
        description: "Starting the day with appreciation sets a positive tone and primes your brain to notice good things.",
        reflection: "What are you grateful for right now, in this moment? What small blessing might you usually overlook?",
        exercise: "Before getting out of bed, name 3 things you're grateful for. One about yourself, one about someone else, one about your life."
      },
      {
        name: "Gratitude Letter",
        description: "Expressing gratitude to others strengthens relationships and increases happiness for both giver and receiver.",
        reflection: "Who has positively impacted your life that you've never properly thanked?",
        exercise: "Write a detailed letter to someone who made a difference in your life. Describe specifically what they did and how it affected you. Consider reading it to them."
      },
      {
        name: "Difficult Gratitude",
        description: "Finding gratitude even in challenges builds resilience and reframes suffering.",
        reflection: "What difficult experience taught you something valuable? What strength did hardship reveal?",
        exercise: "Choose a past struggle. List 3 things you learned, 3 ways you grew, and 3 unexpected gifts that came from it."
      }
    ]
  },
  {
    id: "connection",
    title: "Sacred Connection",
    icon: Users,
    colorStyle: { color: 'var(--glp-sage)' },
    bgColorStyle: { background: 'var(--glp-sage-10)' },
    description: "Deepening connection with yourself, others, and something greater",
    practices: [
      {
        name: "Self-Compassion Practice",
        description: "Treating yourself with the kindness you'd offer a good friend. Self-compassion is not weakness—it's a source of strength and resilience.",
        reflection: "How do you speak to yourself when you make a mistake? Would you speak that way to someone you love?",
        exercise: "Place your hand on your heart. Acknowledge your suffering ('This is hard'). Recognize you're not alone ('Everyone struggles'). Offer kindness ('May I be gentle with myself')."
      },
      {
        name: "Loving-Kindness Meditation",
        description: "An ancient practice of directing well-wishes to yourself and others, expanding the circle of compassion.",
        reflection: "Can you wish well to yourself? To someone you love? To someone neutral? To someone difficult?",
        exercise: "Repeat silently: 'May I be happy. May I be healthy. May I be safe. May I live with ease.' Then extend to loved ones, acquaintances, difficult people, and all beings."
      },
      {
        name: "Nature Communion",
        description: "Connecting with the natural world reminds us we're part of something larger and ancient.",
        reflection: "When did you last feel truly awed by nature? How does being in nature change your inner state?",
        exercise: "Spend 20 minutes in nature without devices. Notice details: textures, sounds, smells. Feel your place in the ecosystem. Let the natural world remind you of life's cycles."
      }
    ]
  },
  {
    id: "presence",
    title: "Present Moment",
    icon: Sun,
    colorStyle: { color: 'var(--glp-gold)' },
    bgColorStyle: { background: 'var(--glp-gold-30)' },
    description: "Finding peace and aliveness in the here and now",
    practices: [
      {
        name: "Mindful Awareness",
        description: "Training attention to rest in present experience rather than past regrets or future worries.",
        reflection: "How much of your day are you truly present? Where does your mind usually wander?",
        exercise: "Set 3 random alarms during your day. When they ring, pause and notice: What am I seeing? Hearing? Feeling in my body? Thinking? This builds present-moment awareness."
      },
      {
        name: "Savoring",
        description: "Intentionally prolonging and appreciating positive experiences increases happiness and creates lasting positive memories.",
        reflection: "Do you rush through good moments? Do you truly taste your food, feel the sun, appreciate laughter?",
        exercise: "Choose one positive experience today and fully savor it. Notice every detail. Tell someone about it. Replay it in your mind. Create a photo or memento."
      },
      {
        name: "Acceptance Practice",
        description: "Acceptance doesn't mean approval—it means not fighting reality. What we resist persists; what we accept, we can work with.",
        reflection: "What are you fighting that cannot be changed? What would it feel like to accept it?",
        exercise: "Identify something you're struggling to accept. Acknowledge the pain of resistance. Say: 'This is how it is right now.' Feel the release that comes from stopping the fight."
      }
    ]
  },
  {
    id: "wonder",
    title: "Awe & Wonder",
    icon: Star,
    colorStyle: { color: 'var(--glp-sage-deep)' },
    bgColorStyle: { background: 'var(--glp-sage-15)' },
    description: "Cultivating experiences of vastness that expand perspective",
    practices: [
      {
        name: "Awe Walk",
        description: "Intentionally seeking experiences of awe—things that feel vast and require accommodation—reduces stress and increases well-being.",
        reflection: "When did you last feel genuine awe? What experiences make you feel small in a good way?",
        exercise: "Take a 15-minute walk with the intention of finding awe. Look up at trees, clouds, architecture. Notice details you usually miss. Let yourself be surprised by ordinary wonders."
      },
      {
        name: "Cosmic Perspective",
        description: "Contemplating the vastness of the universe can paradoxically make personal problems feel more manageable.",
        reflection: "Consider: You are made of atoms forged in stars. What does that perspective change?",
        exercise: "On a clear night, look at the stars for 10 minutes. Consider the light traveled millions of years to reach you. Feel your connection to the cosmos and the brevity of human worries."
      },
      {
        name: "Beauty Practice",
        description: "Training yourself to notice beauty—in art, nature, faces, moments—enriches daily life.",
        reflection: "Where do you find beauty? Do you take time to really see it?",
        exercise: "Today, find 5 beautiful things and pause with each for 30 seconds. They can be simple: light through a window, a stranger's smile, a perfectly ripe fruit."
      }
    ]
  },
  {
    id: "rituals",
    title: "Sacred Rituals",
    icon: Flame,
    colorStyle: { color: 'var(--glp-gold)' },
    bgColorStyle: { background: 'var(--glp-gold-30)' },
    description: "Creating meaningful practices that mark time and transitions",
    practices: [
      {
        name: "Morning Intention",
        description: "Beginning the day with intention transforms routine into ritual and increases purposeful action.",
        reflection: "How do you want to show up today? What quality do you want to embody?",
        exercise: "Each morning, choose one word or phrase as your intention. Write it down. Return to it throughout the day. In the evening, reflect on how you lived it."
      },
      {
        name: "Evening Review",
        description: "Reflecting on the day cultivates wisdom and self-awareness over time.",
        reflection: "What went well today? What was challenging? What did you learn?",
        exercise: "Before sleep, replay your day like a movie. Notice moments of kindness, growth, and difficulty. Thank yourself for showing up. Release the day and let it go."
      },
      {
        name: "Threshold Rituals",
        description: "Marking transitions—entering/leaving home, beginning/ending work—creates mindful boundaries.",
        reflection: "How do you transition between roles and spaces? Do you carry stress from one to another?",
        exercise: "Create a simple ritual for a threshold you cross daily. Pause, take 3 breaths, set an intention, then cross. Example: Before entering home, take a breath and say 'I leave work behind.'"
      }
    ]
  }
];

const dailyPractices = [
  { name: "Sunrise Gratitude", time: "Morning", icon: Sun, description: "Name 3 things you're grateful for" },
  { name: "Intention Setting", time: "Morning", icon: Compass, description: "Choose one word to embody today" },
  { name: "Midday Pause", time: "Afternoon", icon: Clock, description: "3 breaths and a moment of presence" },
  { name: "Evening Reflection", time: "Evening", icon: Moon, description: "Review the day with kindness" },
  { name: "Stargazing", time: "Night", icon: Star, description: "Connect with the vastness above" },
  { name: "Gratitude Journal", time: "Night", icon: Book, description: "Write what you're thankful for" }
];

export default function SoulWellnessPage() {
  const [selectedCategory, setSelectedCategory] = useState(soulCategories[0]);

  return (
  <WellnessPageShell
    title="SoulWellnessPage"
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
      <SEO title="Soul Wellness — The Genuine Love Project" description="Nurture your spiritual and inner wellbeing." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm mb-4 transition" style={{ color: 'var(--glp-sage)' }} data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-gold">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Soul Wellness</h1>
                <p className="text-lead">Nurturing your spirit through meaning, connection, and transcendence</p>
              </div>
            </div>
          </header>

          <BenefitsBlock
            benefits={[
              "Explore practices for meaning, awe, and transcendence",
              "Gratitude, purpose, and connection exercises",
              "Spiritual wellness without religious requirements"
            ]}
            duration="5–20 min per practice"
            control="Pause or stop anytime—only do what feels safe"
            disclaimer="Educational soul wellness—not religious guidance. If you need crisis help, visit"
            crisisLink="/crisis"
            variant="minimal"
            className="mb-6"
          />

          <div className="card-bordered mb-8" style={{ background: 'var(--glp-sage-10)' }}>
            <div className="flex items-start gap-4">
              <Feather className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: 'var(--glp-sage-deep)' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--glp-ink)' }}>Beyond Mind and Body</h3>
                <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>
                  Soul wellness encompasses the parts of human experience that transcend the physical—our search for meaning, 
                  our need for connection, our capacity for awe, and our relationship with something larger than ourselves. 
                  Whether you call it spirit, consciousness, or simply the deeper self, nurturing this dimension is essential 
                  for complete wellbeing.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-heading-md text-teal mb-4">Daily Soul Practices</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dailyPractices.map((practice, index) => (
                <div 
                  key={index}
                  className="card-bordered text-center p-4 hover:shadow-md transition-shadow"
                  data-testid={`card-daily-${index}`}
                >
                  <practice.icon className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--glp-gold)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>{practice.name}</p>
                  <p className="text-xs mb-1" style={{ color: 'var(--glp-sage)' }}>{practice.time}</p>
                  <p className="text-xs" style={{ color: 'var(--glp-sage)' }}>{practice.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2 mb-8">
            {soulCategories.map(category => (
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

          <div className="card-bordered mb-8" style={selectedCategory.bgColorStyle}>
            <div className="flex items-center gap-3 mb-6">
              <selectedCategory.icon className="h-8 w-8" style={selectedCategory.colorStyle} />
              <div>
                <h2 className="text-heading-lg" style={{ color: 'var(--glp-ink)' }}>{selectedCategory.title}</h2>
                <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>{selectedCategory.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {selectedCategory.practices.map((practice, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-5"
                  style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
                  data-testid={`card-practice-${index}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5" style={selectedCategory.colorStyle} />
                    <h3 className="font-semibold" style={{ color: 'var(--glp-ink)' }}>{practice.name}</h3>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: 'var(--glp-sage)' }}>{practice.description}</p>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg p-3" style={{ background: 'var(--glp-sage-10)' }}>
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--glp-sage)' }}>Reflection:</p>
                      <p className="text-sm italic" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>{practice.reflection}</p>
                    </div>
                    
                    <div className="rounded-lg p-3" style={selectedCategory.bgColorStyle}>
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--glp-sage)' }}>Exercise:</p>
                      <p className="text-sm" style={{ color: 'var(--glp-ink)', opacity: 0.8 }}>{practice.exercise}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/meditation" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-meditation">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-6 w-6" style={{ color: 'var(--glp-sage-deep)' }} />
                <h3 className="text-heading-md text-teal">Meditation Guide</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
                Guided practices for stillness, awareness, and inner peace
              </p>
            </Link>
            <Link href="/affirmations" className="card-bordered hover:shadow-md transition-shadow" data-testid="link-affirmations">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-6 w-6" style={{ color: 'var(--glp-rose)' }} />
                <h3 className="text-heading-md text-teal">Affirmations Library</h3>
              </div>
              <p className="text-body-sm" style={{ color: 'var(--glp-sage)' }}>
                Positive statements to rewire thought patterns and beliefs
              </p>
            </Link>
          </section>

          <SafetyFooter variant="default" />
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
