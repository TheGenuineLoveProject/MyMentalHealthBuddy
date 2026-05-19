import { useState, useMemo } from "react";
import { Link } from "wouter";
import { 
  Newspaper, Calendar, Heart, Brain, Sparkles, 
  BookOpen, ArrowRight, Clock, Star, TrendingUp
} from "lucide-react";
import { BRAND } from "@shared/brand";
import { useSEO, createArticleSchema } from "../hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const NEWS_CATEGORIES = [
  { id: "all", label: "All Updates", icon: Newspaper },
  { id: "wellness", label: "Wellness Tips", icon: Heart },
  { id: "research", label: "Research Insights", icon: Brain },
  { id: "features", label: "New Features", icon: Sparkles },
  { id: "community", label: "Community", icon: Star }
];

const NEWS_ARTICLES = [
  {
    id: 1,
    category: "research",
    title: "The Science of Self-Compassion: New Research Findings",
    summary: "Recent studies show that practicing self-compassion can reduce anxiety by up to 40% and improve emotional resilience. Learn evidence-based techniques you can start today.",
    date: "2026-01-20",
    readTime: "5 min",
    featured: true,
    link: "/resources"
  },
  {
    id: 2,
    category: "wellness",
    title: "5 Grounding Techniques for Moments of Overwhelm",
    summary: "When emotions feel too big, these simple body-based practices can help you return to the present moment and find calm.",
    date: "2026-01-18",
    readTime: "4 min",
    featured: true,
    link: "/wellness"
  },
  {
    id: 3,
    category: "features",
    title: "Introducing the Mindscape Navigator",
    summary: "Map your inner landscape with our new tool. Track emotional states, discover transition patterns, and navigate your mental terrain with intention.",
    date: "2026-01-15",
    readTime: "3 min",
    featured: false,
    link: "/wisdom"
  },
  {
    id: 4,
    category: "research",
    title: "How Journaling Rewires the Brain",
    summary: "Neuroscience reveals that expressive writing can strengthen neural pathways associated with emotional regulation and reduce activity in the amygdala.",
    date: "2026-01-12",
    readTime: "6 min",
    featured: false,
    link: "/journal"
  },
  {
    id: 5,
    category: "wellness",
    title: "The Power of Morning Rituals",
    summary: "Starting your day with intention sets the tone for everything that follows. Discover rituals that support mental clarity and emotional balance.",
    date: "2026-01-10",
    readTime: "4 min",
    featured: false,
    link: "/tools"
  },
  {
    id: 6,
    category: "community",
    title: "Stories of Healing: Community Reflections",
    summary: "Members share their journeys of growth and transformation. These anonymous stories remind us we're not alone on the path to wellness.",
    date: "2026-01-08",
    readTime: "7 min",
    featured: false,
    link: "/blog"
  },
  {
    id: 7,
    category: "research",
    title: "Understanding Trauma-Informed Care",
    summary: "What does it mean for a platform to be trauma-informed? Learn about the principles that guide our approach to supporting your healing journey.",
    date: "2026-01-05",
    readTime: "5 min",
    featured: false,
    link: "/resources"
  },
  {
    id: 8,
    category: "features",
    title: "Study Vault: Evidence-Based Resources",
    summary: "Explore our curated collection of research summaries on topics like attachment theory, nervous system regulation, and cognitive behavioral approaches.",
    date: "2026-01-03",
    readTime: "3 min",
    featured: false,
    link: "/study-vault"
  }
];

const WELLNESS_TIPS = [
  "Take three deep breaths before responding to stress",
  "Practice naming emotions without judgment",
  "Move your body for at least 10 minutes daily",
  "Connect with someone who makes you feel seen",
  "Celebrate small wins - they add up"
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [tipIndex] = useState(() => Math.floor(Math.random() * WELLNESS_TIPS.length));

  const latestArticle = NEWS_ARTICLES[0];
  const newsJsonLd = useMemo(() => {
    if (!latestArticle) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="News — MyMentalHealthBuddy" description="Latest updates from MyMentalHealthBuddy." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">News</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
    return createArticleSchema(
      latestArticle.title,
      latestArticle.summary,
      latestArticle.date
    );
  }, []);

  useSEO({
    title: "News & Updates",
    description: "Latest wellness tips, research insights, and platform updates from MyMentalHealthBuddy. Stay informed about mental health and healing practices.",
    ogType: "article",
    jsonLd: newsJsonLd,
  });

  const filteredArticles = activeCategory === "all" 
    ? NEWS_ARTICLES 
    : NEWS_ARTICLES.filter(a => a.category === activeCategory);

  const featuredArticles = NEWS_ARTICLES.filter(a => a.featured);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryIcon = (category) => {
    const cat = NEWS_CATEGORIES.find(c => c.id === category);
    return cat ? cat.icon : Newspaper;
  };

  return (
  <WellnessPageShell
    title="NewsPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
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
      <SEO title="News — MyMentalHealthBuddy" description="Latest updates from MyMentalHealthBuddy." />


    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="h-8 w-8" style={{ color: BRAND.colors.primary }} />
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
            News & Insights
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Stay informed with the latest wellness research, platform updates, and healing insights
        </p>

        <div className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 rounded-2xl p-6 mb-8 border border-rose-100 dark:border-rose-800/30">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <TrendingUp className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Daily Wellness Tip</h3>
              <p className="text-gray-700 dark:text-gray-300 italic">"{WELLNESS_TIPS[tipIndex]}"</p>
            </div>
          </div>
        </div>

        {featuredArticles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredArticles.map(article => {
                const Icon = getCategoryIcon(article.category);
                return (
                  <Link 
                    key={article.id} 
                    href={article.link}
                    className="group block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-700 transition-all"
                    data-testid={`link-featured-${article.id}`}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{article.category}</span>
                      <span className="mx-1">•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {article.readTime} read
                      </span>
                      <span className="flex items-center gap-1 text-sm text-rose-600 dark:text-rose-400 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {NEWS_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              data-testid={`button-category-${cat.id}`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredArticles.map(article => {
            const Icon = getCategoryIcon(article.category);
            return (
              <Link
                key={article.id}
                href={article.link}
                className="group flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-700 transition-all"
                data-testid={`link-article-${article.id}`}
              >
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 transition-colors">
                  <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-rose-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="capitalize">{article.category}</span>
                    <span>•</span>
                    <span>{formatDate(article.date)}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-rose-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-purple-100 dark:border-purple-800/30">
          <BookOpen className="h-10 w-10 mx-auto mb-4 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Explore Our Evidence-Based Library
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-lg mx-auto">
            Dive deeper into the research behind our tools. Our Study Vault contains curated summaries of peer-reviewed studies on healing, wellness, and personal growth.
          </p>
          <Link
            href="/study-vault"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors"
            data-testid="link-study-vault-cta"
          >
            Visit Study Vault <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
