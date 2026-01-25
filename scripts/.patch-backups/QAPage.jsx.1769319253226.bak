import { Link } from "wouter";
import { 
  ArrowLeft, HelpCircle, ChevronDown, ChevronUp, 
  Search, MessageCircle, BookOpen, Heart, Brain,
  Shield, Sparkles, Users
} from "lucide-react";
import { useState, useMemo } from "react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const qaCategories = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "healing-basics", label: "Healing Basics", icon: Heart },
  { id: "mental-health", label: "Mental Health", icon: Brain },
  { id: "practices", label: "Practices & Tools", icon: Sparkles },
  { id: "crisis", label: "Crisis Support", icon: Shield },
  { id: "community", label: "Community", icon: Users }
];

const qaItems = [
  {
    category: "getting-started",
    question: "Where should I start on this platform?",
    answer: "Start with the Wellness Hub - it's your central navigation point. From there, we recommend beginning with Daily Routines for structure, then exploring Breathing or Grounding for immediate stress relief. The How-To Guides provide step-by-step instructions for every tool."
  },
  {
    category: "getting-started",
    question: "Do I need any experience with therapy or meditation?",
    answer: "No experience needed! All our content is designed for beginners. Each practice includes clear instructions, and we use simple language without jargon. Start with whatever feels most accessible to you - many find breathing exercises to be a gentle entry point."
  },
  {
    category: "getting-started",
    question: "How much time do I need to spend each day?",
    answer: "Even 5 minutes daily can make a difference. We recommend starting with one small practice (like 3 deep breaths) and gradually building. Consistency matters more than duration. Our Daily Routines page has protocols from 5 minutes to 30+ minutes."
  },
  {
    category: "healing-basics",
    question: "What is trauma and how do I know if I have it?",
    answer: "Trauma is any experience that overwhelms your nervous system's ability to cope. It's not about the event itself, but how your body and mind processed it. Signs may include: intrusive memories, avoidance of reminders, feeling on edge, emotional numbness, or difficulty trusting. Only a qualified professional can provide diagnosis."
  },
  {
    category: "healing-basics",
    question: "Why does healing feel non-linear?",
    answer: "Healing isn't a straight line because the brain processes trauma in layers. You might feel great one day and struggle the next - this is normal. Progress often looks like: feeling a trigger and recovering faster, having more good days, or noticing old patterns with new awareness. Trust the process."
  },
  {
    category: "healing-basics",
    question: "What is nervous system regulation?",
    answer: "Your nervous system has different states: fight-flight (activated), freeze (shutdown), and rest-digest (calm). Regulation means having the ability to move between states flexibly. When dysregulated, you might feel stuck in anxiety or numbness. Practices like breathing, grounding, and movement help restore balance."
  },
  {
    category: "healing-basics",
    question: "Can I heal without a therapist?",
    answer: "Self-guided healing can support your journey significantly. However, for trauma, persistent mental health challenges, or severe symptoms, professional support is recommended. Think of our tools as complementary to professional care, not a replacement. We provide resources to help you find affordable therapy options."
  },
  {
    category: "mental-health",
    question: "What's the difference between anxiety and just being stressed?",
    answer: "Stress is a response to an external pressure and usually eases when the situation resolves. Anxiety involves persistent worry, often about future possibilities, and can occur without an obvious trigger. Both involve similar physical sensations, but anxiety tends to be more chronic and may require targeted strategies."
  },
  {
    category: "mental-health",
    question: "How do I know if I'm depressed or just sad?",
    answer: "Sadness is a normal emotion that passes. Depression involves persistent low mood (2+ weeks), loss of interest in things you used to enjoy, changes in sleep/appetite, difficulty concentrating, and sometimes hopelessness. If you're experiencing these symptoms, please reach out to a mental health professional."
  },
  {
    category: "mental-health",
    question: "Why do I keep repeating the same patterns?",
    answer: "Patterns often form as protective responses to past experiences. Your brain learned these behaviors for survival. The first step is awareness - noticing the pattern without judgment. Then, with tools like cognitive reframing and behavioral strategies (covered in our Behavior Change guide), you can gradually create new neural pathways."
  },
  {
    category: "mental-health",
    question: "What are intrusive thoughts and are they normal?",
    answer: "Intrusive thoughts are unwanted, involuntary thoughts that pop into your mind. They can be disturbing but are completely normal - most people have them. Having a thought doesn't mean you believe it or will act on it. The goal isn't to stop them but to change how you respond to them."
  },
  {
    category: "practices",
    question: "What's the difference between meditation and mindfulness?",
    answer: "Mindfulness is the practice of present-moment awareness. Meditation is a formal practice that often cultivates mindfulness, but there are many types (loving-kindness, visualization, body scan). You can be mindful without meditating (like eating mindfully), but meditation helps strengthen mindfulness skills."
  },
  {
    category: "practices",
    question: "Why does breathing help with anxiety?",
    answer: "Slow, deep breathing activates your vagus nerve, which signals your brain that you're safe. This shifts your nervous system from sympathetic (fight-flight) to parasympathetic (rest-digest). Extended exhales are particularly effective because they engage this calming response. It's a direct line to your body's relaxation system."
  },
  {
    category: "practices",
    question: "What is grounding and when should I use it?",
    answer: "Grounding is using your senses to anchor yourself in the present moment. It's especially helpful during anxiety, dissociation, flashbacks, or when emotions feel overwhelming. Techniques include the 5-4-3-2-1 method (naming things you see, hear, feel), holding ice, or pressing your feet into the floor."
  },
  {
    category: "practices",
    question: "Do affirmations actually work?",
    answer: "Research shows affirmations work best when they're believable and connected to your values. Generic positive statements may not help if they feel false. More effective: bridge statements ('I'm learning to...'), evidence-based affirmations ('I have overcome challenges before'), and self-compassion phrases."
  },
  {
    category: "practices",
    question: "How long until I see results from these practices?",
    answer: "Some practices offer immediate relief (breathing, grounding). Deeper changes in thought patterns typically take 6-8 weeks of consistent practice. Neuroplasticity research shows the brain begins forming new pathways with regular repetition. Focus on small, daily efforts rather than quick fixes."
  },
  {
    category: "crisis",
    question: "What should I do if I'm having thoughts of self-harm?",
    answer: "Please reach out immediately: Call/text 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or go to your nearest emergency room. These services are free, confidential, and available 24/7. You deserve support, and help is available."
  },
  {
    category: "crisis",
    question: "How do I help someone who is struggling?",
    answer: "Listen without judgment, validate their feelings ('That sounds really hard'), and avoid trying to fix or minimize. Ask directly if they're thinking of hurting themselves - it won't plant the idea. Encourage professional help and offer to help them connect. Take care of yourself too - supporting others is difficult."
  },
  {
    category: "crisis",
    question: "What if I can't afford therapy?",
    answer: "Options include: Open Path Collective ($30-80 sessions), community mental health centers (sliding scale), university training clinics (low-cost), peer support groups (often free), and some apps offer free basic features. Our Professional Resources page has links to affordable care directories."
  },
  {
    category: "community",
    question: "Is my information private?",
    answer: "Yes, we take privacy seriously. Personal journal entries and data are encrypted and never shared. We don't sell user data. Any community features are optional, and you control what you share publicly. Review our Privacy Policy for complete details."
  },
  {
    category: "community",
    question: "Can I share my experience with others?",
    answer: "Community features allow anonymous sharing of reflections and insights. Sharing can be healing and helps others feel less alone. However, never feel pressured to share - your healing journey is personal. Use what feels right for you."
  }
];

function QAItem({ item, isOpen, onToggle }) {
  return (
  <WellnessPageShell
    title="QAPage"
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

    <div 
      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
      data-testid={`qa-item-${item.question.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`}
    >
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-start justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition px-2 rounded"
      >
        <span className="font-medium text-gray-900 dark:text-white pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 px-2">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function QAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredItems = useMemo(() => {
    return qaItems.filter(item => {
      const matchesSearch = 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href="/wellness-hub" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Wellness Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-teal">
                <MessageCircle className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Questions & Answers</h1>
                <p className="text-lead">Common questions about healing, practices, and mental wellness</p>
              </div>
            </div>
          </header>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent"
              data-testid="input-search"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                activeCategory === "all"
                  ? "bg-[var(--teal-600)] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <HelpCircle className="h-4 w-4" /> All
            </button>
            {qaCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                  activeCategory === cat.id
                    ? "bg-[var(--teal-600)] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon className="h-4 w-4" /> {cat.label}
              </button>
            ))}
          </div>

          <div className="card-bordered">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No questions found matching your search.</p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <QAItem
                  key={index}
                  item={item}
                  isOpen={openItems[index]}
                  onToggle={() => toggleItem(index)}
                />
              ))
            )}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Link
              href="/faq"
              className="card-bordered hover:shadow-md transition-shadow text-center"
              data-testid="link-faq"
            >
              <HelpCircle className="h-8 w-8 text-[var(--teal-500)] mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Full FAQ</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">30+ categorized questions</p>
            </Link>
            <Link
              href="/professional-resources"
              className="card-bordered hover:shadow-md transition-shadow text-center"
              data-testid="link-resources"
            >
              <Shield className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Crisis Resources</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">24/7 support available</p>
            </Link>
          </div>

          <footer className="mt-8 card-bordered bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Can't find your answer? Our content is continuously expanding. For clinical questions, 
              please consult with a qualified mental health professional.
            </p>
          </footer>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
