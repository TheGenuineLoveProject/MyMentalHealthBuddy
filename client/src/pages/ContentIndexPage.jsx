import { Link } from "wouter";
import { 
  Home, BookOpen, Heart, Brain, Sparkles, Leaf, Moon, 
  Sun, Wind, Users, Shield, Clock, Target, Compass,
  Lightbulb, Map, Star, Zap, ChevronRight, Search
} from "lucide-react";
import { useState } from "react";

const contentCategories = [
  {
    title: "Mind Wellness",
    icon: Brain,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    items: [
      { name: "Cognitive Tools", path: "/cognitive-tools", description: "Thought reframing and mental exercises" },
      { name: "Emotional Intelligence", path: "/emotional-intelligence", description: "Understanding and managing emotions" },
      { name: "Stress Response Guide", path: "/stress-response", description: "How your nervous system works" },
      { name: "Behavior Change", path: "/behavior-change", description: "Habit science and CBT techniques" },
      { name: "Inner Child Healing", path: "/inner-child", description: "Healing childhood wounds" }
    ]
  },
  {
    title: "Body Wellness",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    items: [
      { name: "Breathing Exercises", path: "/breathing", description: "Breathwork for calm and energy" },
      { name: "Grounding Techniques", path: "/grounding", description: "Body-based anxiety relief" },
      { name: "Body Wellness Guide", path: "/body-wellness", description: "Somatic practices for healing" },
      { name: "Sleep Guide", path: "/sleep-guide", description: "Improving sleep quality" },
      { name: "Daily Routines", path: "/daily-routines", description: "Morning to evening protocols" }
    ]
  },
  {
    title: "Soul & Spirit",
    icon: Sparkles,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    items: [
      { name: "Soul Wellness", path: "/soul-wellness", description: "Meaning, purpose, and connection" },
      { name: "Meditation Guide", path: "/meditation", description: "Mindfulness and meditation" },
      { name: "Affirmations", path: "/affirmations", description: "Positive self-talk practices" },
      { name: "Calming Scenes", path: "/calming-scenes", description: "Visual tranquility experiences" },
      { name: "Self-Care Toolkit", path: "/self-care", description: "Nurturing practices for wellbeing" }
    ]
  },
  {
    title: "Healing Journeys",
    icon: Map,
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    items: [
      { name: "Healing Journeys", path: "/healing-journeys", description: "Structured healing pathways" },
      { name: "How-To Guides", path: "/how-to-guides", description: "Step-by-step tool instructions" },
      { name: "Healing Library", path: "/healing-library", description: "Curated healing resources" },
      { name: "Research & Evidence", path: "/research", description: "Science behind practices" }
    ]
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    items: [
      { name: "Wellness Glossary", path: "/glossary-full", description: "A-Z of wellness terms" },
      { name: "FAQ", path: "/faq", description: "Common questions answered" },
      { name: "News & Updates", path: "/news", description: "Platform updates and insights" },
      { name: "Professional Resources", path: "/professional-resources", description: "Therapist finders and support" }
    ]
  },
  {
    title: "Wellness Hub",
    icon: Compass,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    items: [
      { name: "Wellness Hub", path: "/wellness-hub", description: "Central wellness navigation" },
      { name: "Study Vault", path: "/study-vault", description: "Evidence-based research" },
      { name: "Support", path: "/support", description: "Getting help and guidance" }
    ]
  }
];

const quickLinks = [
  { name: "Start Here", path: "/wellness-hub", icon: Compass, color: "text-teal-500" },
  { name: "Crisis Support", path: "/professional-resources", icon: Shield, color: "text-rose-500" },
  { name: "Daily Practice", path: "/daily-routines", icon: Sun, color: "text-amber-500" },
  { name: "Learn Terms", path: "/glossary-full", icon: BookOpen, color: "text-purple-500" }
];

export default function ContentIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = contentCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="icon-container icon-xl icon-gradient-teal">
                <BookOpen className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-display-lg text-teal mb-2" data-testid="text-page-title">Content Library</h1>
            <p className="text-lead max-w-2xl mx-auto">
              Your complete guide to mind, body, and soul wellness. Explore evidence-based tools, 
              healing practices, and transformative resources.
            </p>
          </header>

          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent shadow-sm"
              data-testid="input-search"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {quickLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="card-bordered flex items-center gap-3 hover:shadow-md transition-shadow"
                data-testid={`link-quick-${idx}`}
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <span className="font-medium text-sm text-gray-900 dark:text-white">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-8">
            {filteredCategories.map((category, catIdx) => (
              <section key={catIdx} data-testid={`section-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title}</h2>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">
                    {category.items.length} resources
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      href={item.path}
                      className="card-bordered group hover:shadow-md hover:border-[var(--teal-300)] transition-all"
                      data-testid={`link-content-${item.path.slice(1)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[var(--teal-600)] transition">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-[var(--teal-500)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 card-bordered">
              <p className="text-gray-500 dark:text-gray-400">No content found matching your search.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-2 text-[var(--teal-600)] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          <footer className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--sage-500)] hover:text-[var(--teal-600)] transition"
            >
              <Home className="h-4 w-4" /> Return Home
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
