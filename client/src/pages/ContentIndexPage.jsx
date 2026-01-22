import { Link } from "wouter";
import { 
  Home, BookOpen, Heart, Brain, Sparkles, Leaf, Moon, 
  Sun, Wind, Users, Shield, Clock, Target, Compass,
  Lightbulb, Map, Star, Zap, ChevronRight, Search,
  Play, Headphones, FileText, Bookmark, Share2, MessageCircle,
  Activity, Eye, Layers, Award, TrendingUp, Settings,
  Palette, BarChart3, Feather, Globe, ArrowLeft
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const allContent = [
  { name: "Adaptive Companion", path: "/companion", description: "AI-powered personalized guidance", category: "Advanced Tools", icon: Users },
  { name: "Admin Dashboard", path: "/admin", description: "Platform administration", category: "System", icon: Settings, protected: true },
  { name: "Advanced Tools", path: "/advanced", description: "Deep transformation techniques", category: "Tools", icon: Zap, protected: true },
  { name: "Affirmations", path: "/affirmations", description: "Positive self-talk practices", category: "Wellness", icon: Star },
  { name: "AI Chat Therapy", path: "/chat", description: "Compassionate AI conversation", category: "AI/Chat", icon: MessageCircle, protected: true },
  { name: "Analytics", path: "/analytics", description: "Track your wellness journey", category: "Dashboard", icon: BarChart3, protected: true },
  { name: "Atlas Dashboard", path: "/atlas", description: "Intellectual navigation center", category: "Advanced Tools", icon: Globe, protected: true },
  { name: "Behavior Change", path: "/behavior-change", description: "Habit science and CBT techniques", category: "Wellness", icon: TrendingUp },
  { name: "Blog", path: "/blog", description: "Wellness articles and insights", category: "Content", icon: FileText },
  { name: "Body Wellness", path: "/body-wellness", description: "Somatic practices for healing", category: "Wellness", icon: Heart },
  { name: "Breathing Exercises", path: "/breathing", description: "Breathwork for calm and energy", category: "Wellness", icon: Wind },
  { name: "Calming Scenes", path: "/calming-scenes", description: "Visual tranquility experiences", category: "Wellness", icon: Eye },
  { name: "Cognitive Architecture", path: "/cognitive-architecture", description: "Mental framework design", category: "Mastery", icon: Layers, protected: true },
  { name: "Cognitive Tools", path: "/cognitive-tools", description: "Thought reframing exercises", category: "Wellness", icon: Brain },
  { name: "Collaborative Lab", path: "/collaborative-lab", description: "Group intelligence workspace", category: "Advanced Tools", icon: Users, protected: true },
  { name: "Community", path: "/community", description: "Connect with fellow journeyers", category: "Community", icon: Users, protected: true },
  { name: "Content Studio", path: "/content-studio", description: "Create and transform content", category: "Content", icon: Palette, protected: true },
  { name: "Crisis Resources", path: "/crisis", description: "Immediate support and hotlines", category: "Support", icon: Shield, protected: true },
  { name: "Daily Ritual", path: "/ritual", description: "Morning wellness routine", category: "Tools", icon: Sun, protected: true },
  { name: "Daily Routines", path: "/daily-routines", description: "Morning to evening protocols", category: "Wellness", icon: Clock },
  { name: "Daily Wisdom Oracle", path: "/daily-wisdom", description: "Daily inspiration and guidance", category: "Wisdom", icon: Sparkles, protected: true },
  { name: "Dashboard", path: "/dashboard", description: "Your personal wellness hub", category: "Dashboard", icon: Home, protected: true },
  { name: "Disclaimer", path: "/disclaimer", description: "Platform limitations notice", category: "Legal", icon: FileText },
  { name: "Elite Tools", path: "/elite-tools", description: "Premium advanced features", category: "Mastery", icon: Award, protected: true },
  { name: "Emotional Intelligence", path: "/emotional-intelligence", description: "Understanding emotions", category: "Wellness", icon: Heart },
  { name: "Ethics", path: "/ethics", description: "Our ethical commitments", category: "Legal", icon: Shield },
  { name: "FAQ", path: "/faq", description: "Common questions answered", category: "Support", icon: MessageCircle },
  { name: "Glossary", path: "/glossary-full", description: "A-Z of wellness terms", category: "Knowledge", icon: BookOpen },
  { name: "Grounding Techniques", path: "/grounding", description: "Body-based anxiety relief", category: "Wellness", icon: Leaf },
  { name: "Growth Analytics", path: "/growth-analytics", description: "Personal development metrics", category: "Analytics", icon: TrendingUp, protected: true },
  { name: "Guided Journaling", path: "/guided-journaling", description: "Structured reflection prompts", category: "Tools", icon: Feather, protected: true },
  { name: "Healing Journeys", path: "/healing-journeys", description: "Structured healing pathways", category: "Wellness", icon: Map },
  { name: "Healing Library", path: "/healing-library", description: "Curated healing resources", category: "Content", icon: BookOpen },
  { name: "How-To Guides", path: "/how-to-guides", description: "Step-by-step instructions", category: "Content", icon: Compass },
  { name: "Inner Child", path: "/inner-child", description: "Healing childhood wounds", category: "Wellness", icon: Heart },
  { name: "Insight Cards", path: "/insight-cards", description: "Daily wisdom insights", category: "Tools", icon: Lightbulb, protected: true },
  { name: "Journal", path: "/journal", description: "Personal reflection space", category: "Tools", icon: Feather, protected: true },
  { name: "Knowledge Synthesis", path: "/knowledge-synthesis", description: "Integrate learning insights", category: "Advanced Tools", icon: Brain, protected: true },
  { name: "Legal", path: "/legal", description: "Legal information hub", category: "Legal", icon: FileText },
  { name: "Mastery Tools", path: "/mastery", description: "Peak performance techniques", category: "Mastery", icon: Award, protected: true },
  { name: "Meditation Guide", path: "/meditation", description: "Mindfulness practices", category: "Wellness", icon: Moon },
  { name: "Meta-Learning", path: "/meta-learning", description: "Learn how to learn better", category: "Advanced Tools", icon: Brain, protected: true },
  { name: "Mirror", path: "/mirror", description: "Self-reflection exercises", category: "Tools", icon: Eye, protected: true },
  { name: "Mood Tracker", path: "/mood", description: "Track emotional patterns", category: "Tools", icon: Activity, protected: true },
  { name: "News & Updates", path: "/news", description: "Platform news and insights", category: "Content", icon: Globe },
  { name: "Philosophical Inquiry", path: "/philosophical-inquiry", description: "Deep existential exploration", category: "Wisdom", icon: Lightbulb, protected: true },
  { name: "Premium", path: "/premium", description: "Unlock premium features", category: "Account", icon: Star, protected: true },
  { name: "Pricing", path: "/pricing", description: "Subscription plans", category: "Account", icon: Award },
  { name: "Privacy Policy", path: "/privacy", description: "How we protect your data", category: "Legal", icon: Shield },
  { name: "Professional Resources", path: "/professional-resources", description: "Therapist finders and support", category: "Support", icon: Users },
  { name: "Progress Dashboard", path: "/progress", description: "Track your growth journey", category: "Analytics", icon: TrendingUp, protected: true },
  { name: "Research & Evidence", path: "/research", description: "Science behind practices", category: "Knowledge", icon: BookOpen },
  { name: "Resilience Metrics", path: "/resilience", description: "Measure emotional resilience", category: "Analytics", icon: Activity, protected: true },
  { name: "Safety", path: "/safety", description: "Safety guidelines and resources", category: "Support", icon: Shield },
  { name: "Self-Care Toolkit", path: "/self-care", description: "Nurturing practices", category: "Wellness", icon: Heart },
  { name: "Settings", path: "/settings", description: "Account preferences", category: "Account", icon: Settings, protected: true },
  { name: "Sleep Guide", path: "/sleep-guide", description: "Improve sleep quality", category: "Wellness", icon: Moon },
  { name: "Soul Wellness", path: "/soul-wellness", description: "Meaning and purpose", category: "Wellness", icon: Sparkles },
  { name: "State Tracker", path: "/state", description: "Monitor wellbeing states", category: "Tools", icon: Activity, protected: true },
  { name: "Strategy Maps", path: "/strategy-maps", description: "Personal growth planning", category: "Advanced Tools", icon: Map, protected: true },
  { name: "Stress Response Guide", path: "/stress-response", description: "Nervous system science", category: "Wellness", icon: Activity },
  { name: "Study Vault", path: "/study-vault", description: "Evidence-based research", category: "Knowledge", icon: BookOpen, protected: true },
  { name: "Support", path: "/support", description: "Get help and guidance", category: "Support", icon: MessageCircle },
  { name: "Systems Thinking", path: "/systems-thinking", description: "Holistic perspective tools", category: "Advanced Tools", icon: Layers, protected: true },
  { name: "Terms of Service", path: "/terms", description: "Usage terms and conditions", category: "Legal", icon: FileText },
  { name: "Today", path: "/today", description: "Daily wellness flow", category: "Dashboard", icon: Sun, protected: true },
  { name: "Tools", path: "/tools", description: "All wellness tools", category: "Tools", icon: Target, protected: true },
  { name: "Upgrade", path: "/upgrade", description: "Upgrade your plan", category: "Account", icon: Zap, protected: true },
  { name: "Wellness", path: "/wellness", description: "Wellness center", category: "Wellness", icon: Heart, protected: true },
  { name: "Wellness Glossary", path: "/glossary", description: "Key wellness terms", category: "Knowledge", icon: BookOpen },
  { name: "Wellness Hub", path: "/wellness-hub", description: "Central wellness navigation", category: "Wellness", icon: Compass },
  { name: "Wisdom Practices", path: "/wisdom-practices", description: "Ancient wisdom techniques", category: "Wisdom", icon: Sparkles, protected: true },
  { name: "Wisdom Synthesis", path: "/wisdom-synthesis", description: "Integrate wisdom insights", category: "Wisdom", icon: Lightbulb, protected: true },
  { name: "Wisdom Tools", path: "/wisdom", description: "Wisdom and reflection tools", category: "Wisdom", icon: Lightbulb, protected: true }
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const categoryColors = {
  "Wellness": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "Tools": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "Advanced Tools": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Mastery": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Wisdom": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Dashboard": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Analytics": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Content": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Community": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "Support": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Knowledge": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "Legal": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  "Account": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "AI/Chat": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "System": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
};

export default function ContentIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [savedItems, setSavedItems] = useState([]);
  const { toast } = useToast();

  const categories = useMemo(() => {
    const cats = [...new Set(allContent.map(item => item.category))].sort();
    return ["all", ...cats];
  }, []);

  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, selectedCategory]);

  const groupedByLetter = useMemo(() => {
    const grouped = {};
    filteredContent.forEach(item => {
      const letter = item.name[0].toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(item);
    });
    return grouped;
  }, [filteredContent]);

  const availableLetters = Object.keys(groupedByLetter).sort();

  const handleSave = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedItems.includes(item.path)) {
      setSavedItems(savedItems.filter(p => p !== item.path));
      toast({ title: "Removed from saved" });
    } else {
      setSavedItems([...savedItems, item.path]);
      toast({ title: "Saved for later", description: item.name });
    }
  };

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: 'var(--glp-sage)' }}>
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', boxShadow: '0 4px 16px var(--glp-sage-30)' }}>
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-serif mb-2" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-page-title">
            Platform Directory A–Z
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
            Find everything from Affirmations to Zen practices. 
            Your complete guide to all platform features and content.
          </p>
        </header>

        <div className="sticky top-0 z-20 py-4 mb-6" style={{ background: 'var(--glp-paper)' }}>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--glp-sage)' }} />
              <input
                type="text"
                placeholder="Search all content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-[var(--glp-sage)] focus:border-transparent"
                style={{ borderColor: 'var(--glp-sage-20)', background: 'white' }}
                data-testid="input-search"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-[var(--glp-sage)]"
              style={{ borderColor: 'var(--glp-sage-20)', background: 'white', color: 'var(--glp-sage-deep)' }}
              data-testid="select-category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-1 mt-4" role="navigation" aria-label="Alphabetical navigation">
            {alphabet.map(letter => {
              const hasContent = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => hasContent && scrollToLetter(letter)}
                  disabled={!hasContent}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    hasContent 
                      ? "hover:scale-110 cursor-pointer" 
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  style={{ 
                    background: hasContent ? 'var(--glp-sage-15)' : 'transparent',
                    color: hasContent ? 'var(--glp-sage-deep)' : 'var(--glp-sage)'
                  }}
                  aria-label={`Jump to ${letter}`}
                  data-testid={`nav-letter-${letter}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-sm mb-6 text-center" style={{ color: 'var(--glp-sage)' }}>
          Showing {filteredContent.length} items {selectedCategory !== "all" && `in ${selectedCategory}`}
        </div>

        <div className="space-y-8">
          {availableLetters.map(letter => (
            <section key={letter} id={`section-${letter}`} className="scroll-mt-48">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))' }}
                >
                  {letter}
                </div>
                <div className="flex-1 h-px" style={{ background: 'var(--glp-sage-20)' }} />
                <span className="text-sm" style={{ color: 'var(--glp-sage)' }}>
                  {groupedByLetter[letter].length} items
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedByLetter[letter].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      className="group p-4 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ 
                        background: 'white', 
                        borderColor: 'var(--glp-sage-15)'
                      }}
                      data-testid={`link-${item.path.slice(1)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg" style={{ background: 'var(--glp-sage-10)' }}>
                          <ItemIcon className="h-5 w-5" style={{ color: 'var(--glp-sage-deep)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate group-hover:text-[var(--glp-sage-deep)] transition-colors" style={{ color: 'var(--glp-charcoal)' }}>
                              {item.name}
                            </h3>
                            {item.protected && (
                              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--glp-gold-30)', color: 'var(--glp-charcoal)' }}>
                                Pro
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--glp-sage)' }}>
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[item.category] || categoryColors.Wellness}`}>
                              {item.category}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: 'var(--glp-sage)' }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'white', border: '1px solid var(--glp-sage-15)' }}>
            <Search className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--glp-sage-30)' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--glp-sage-deep)' }}>No content found</p>
            <p className="mt-2" style={{ color: 'var(--glp-sage)' }}>Try adjusting your search or filter</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="mt-4 px-6 py-2 rounded-xl font-medium transition-colors"
              style={{ background: 'var(--glp-sage)', color: 'white' }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </button>
          </div>
        )}

        <footer className="mt-16 text-center pb-8">
          <p className="text-sm mb-4" style={{ color: 'var(--glp-sage)' }}>
            360° Support from A to Z — Live in Genuine Love
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))', color: 'white' }}
            data-testid="link-return-home"
          >
            <Home className="h-4 w-4" /> Return Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
