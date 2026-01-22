import { Link } from "wouter";
import { 
  Home, BookOpen, Heart, Brain, Sparkles, Leaf, Moon, 
  Sun, Wind, Users, Shield, Clock, Target, Compass,
  Lightbulb, Map, Star, Zap, ChevronRight, Search,
  Play, Headphones, FileText, Bookmark, Share2, Filter
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MEDIA_TYPES = {
  text: { icon: FileText, label: "Article", color: "bg-amber-100 text-amber-700" },
  video: { icon: Play, label: "Video", color: "bg-rose-100 text-rose-700" },
  audio: { icon: Headphones, label: "Audio", color: "bg-teal-100 text-teal-700" }
};

const contentCategories = [
  {
    title: "Mind Wellness",
    icon: Brain,
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    items: [
      { name: "Cognitive Tools", path: "/cognitive-tools", description: "Thought reframing and mental exercises", type: "text" },
      { name: "Emotional Intelligence", path: "/emotional-intelligence", description: "Understanding and managing emotions", type: "video" },
      { name: "Stress Response Guide", path: "/stress-response", description: "How your nervous system works", type: "text" },
      { name: "Behavior Change", path: "/behavior-change", description: "Habit science and CBT techniques", type: "text" },
      { name: "Inner Child Healing", path: "/inner-child", description: "Healing childhood wounds", type: "audio" }
    ]
  },
  {
    title: "Body Wellness",
    icon: Heart,
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    items: [
      { name: "Breathing Exercises", path: "/breathing", description: "Breathwork for calm and energy", type: "video" },
      { name: "Grounding Techniques", path: "/grounding", description: "Body-based anxiety relief", type: "audio" },
      { name: "Body Wellness Guide", path: "/body-wellness", description: "Somatic practices for healing", type: "text" },
      { name: "Sleep Guide", path: "/sleep-guide", description: "Improving sleep quality", type: "audio" },
      { name: "Daily Routines", path: "/daily-routines", description: "Morning to evening protocols", type: "text" }
    ]
  },
  {
    title: "Soul & Spirit",
    icon: Sparkles,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    items: [
      { name: "Soul Wellness", path: "/soul-wellness", description: "Meaning, purpose, and connection", type: "text" },
      { name: "Meditation Guide", path: "/meditation", description: "Mindfulness and meditation", type: "audio" },
      { name: "Affirmations", path: "/affirmations", description: "Positive self-talk practices", type: "audio" },
      { name: "Calming Scenes", path: "/calming-scenes", description: "Visual tranquility experiences", type: "video" },
      { name: "Self-Care Toolkit", path: "/self-care", description: "Nurturing practices for wellbeing", type: "text" }
    ]
  },
  {
    title: "Healing Journeys",
    icon: Map,
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    items: [
      { name: "Healing Journeys", path: "/healing-journeys", description: "Structured healing pathways", type: "video" },
      { name: "How-To Guides", path: "/how-to-guides", description: "Step-by-step tool instructions", type: "text" },
      { name: "Healing Library", path: "/healing-library", description: "Curated healing resources", type: "text" },
      { name: "Research & Evidence", path: "/research", description: "Science behind practices", type: "text" }
    ]
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    items: [
      { name: "Wellness Glossary", path: "/glossary-full", description: "A-Z of wellness terms", type: "text" },
      { name: "FAQ", path: "/faq", description: "Common questions answered", type: "text" },
      { name: "News & Updates", path: "/news", description: "Platform updates and insights", type: "text" },
      { name: "Professional Resources", path: "/professional-resources", description: "Therapist finders and support", type: "text" }
    ]
  },
  {
    title: "Wellness Hub",
    icon: Compass,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    items: [
      { name: "Wellness Hub", path: "/wellness-hub", description: "Central wellness navigation", type: "text" },
      { name: "Study Vault", path: "/study-vault", description: "Evidence-based research", type: "text" },
      { name: "Support", path: "/support", description: "Getting help and guidance", type: "text" }
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedItems, setSavedItems] = useState([]);
  const { toast } = useToast();

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

  const handleShare = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + item.path);
    toast({ title: "Link copied!", description: "Share it with someone who needs it" });
  };

  const filteredCategories = contentCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    })
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

          <div className="relative max-w-lg mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search all content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--teal-400)] focus:border-transparent shadow-sm"
              data-testid="input-search"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-8" role="tablist" aria-label="Filter content by type" data-testid="filter-tabs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === "all" 
                  ? "bg-[var(--teal-500)] text-white shadow-md" 
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--teal-300)]"
              }`}
              data-testid="filter-all"
              role="tab"
              aria-selected={activeFilter === "all"}
              aria-label="Show all content types"
            >
              <Filter className="inline h-4 w-4 mr-1" aria-hidden="true" /> All
            </button>
            {Object.entries(MEDIA_TYPES).map(([key, { icon: Icon, label, color }]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  activeFilter === key 
                    ? `${color} shadow-md` 
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[var(--teal-300)]"
                }`}
                data-testid={`filter-${key}`}
                role="tab"
                aria-selected={activeFilter === key}
                aria-label={`Filter by ${label} content`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {quickLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="card-bordered flex items-center gap-3 hover:shadow-md transition-shadow"
                data-testid={`link-quick-${idx}`}
              >
                <link.icon className={`h-5 w-5 ${link.color}`} aria-hidden="true" />
                <span className="font-medium text-sm text-gray-900 dark:text-white">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-8">
            {filteredCategories.map((category, catIdx) => (
              <section key={catIdx} data-testid={`section-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title}</h2>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">
                    {category.items.length} resources
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.items.map((item, itemIdx) => {
                    const mediaType = MEDIA_TYPES[item.type] || MEDIA_TYPES.text;
                    const MediaIcon = mediaType.icon;
                    return (
                      <Link
                        key={itemIdx}
                        href={item.path}
                        className="card-bordered group hover:shadow-md hover:border-[var(--teal-300)] transition-all relative"
                        data-testid={`link-content-${item.path.slice(1)}`}
                      >
                        {/* Media Type Badge */}
                        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${mediaType.color}`} aria-label={`Content type: ${mediaType.label}`}>
                          <MediaIcon className="h-3 w-3" aria-hidden="true" />
                          {mediaType.label}
                        </div>
                        
                        <div className="pr-16">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-[var(--teal-600)] transition">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        </div>
                        
                        {/* Save/Share Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={(e) => handleSave(item, e)}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition ${
                              savedItems.includes(item.path) 
                                ? "bg-amber-100 text-amber-700" 
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                            }`}
                            data-testid={`button-save-${item.path.slice(1)}`}
                            aria-label={savedItems.includes(item.path) ? `Remove ${item.name} from saved` : `Save ${item.name} for later`}
                            aria-pressed={savedItems.includes(item.path)}
                          >
                            <Bookmark className="h-3 w-3" aria-hidden="true" />
                            {savedItems.includes(item.path) ? "Saved" : "Save"}
                          </button>
                          <button
                            onClick={(e) => handleShare(item, e)}
                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-teal-50 hover:text-teal-600 transition"
                            data-testid={`button-share-${item.path.slice(1)}`}
                            aria-label={`Share ${item.name}`}
                          >
                            <Share2 className="h-3 w-3" aria-hidden="true" />
                            Share
                          </button>
                          <ChevronRight className="ml-auto h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-[var(--teal-500)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
                        </div>
                      </Link>
                    );
                  })}
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
              <Home className="h-4 w-4" aria-hidden="true" /> Return Home
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
