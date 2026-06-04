import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dumbbell, Clock, Heart, Wind, Brain, Sparkles, Search, ArrowRight, Loader2, Smile, Notebook, RefreshCw, Compass, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const FAVORITES_KEY = "glp-practice-favorites";

export default function PracticeLibrary() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const favoriteMutation = useMutation({
    mutationFn: async ({ practiceId, action }) => {
      return apiRequest("POST", "/api/favorites", { 
        itemId: practiceId, 
        itemType: "practice",
        action 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      setTogglingId(null);
    },
    onError: (error) => {
      setTogglingId(null);
      toast({
        title: "Sync failed",
        description: "Your favorite was saved locally. It will sync when you're back online.",
        variant: "destructive"
      });
    }
  });

  const toggleFavorite = (practiceId, practiceTitle) => {
    const isFav = favorites.includes(practiceId);
    let updatedFavorites;
    
    if (isFav) {
      updatedFavorites = favorites.filter(id => id !== practiceId);
      toast({
        title: "Removed from favorites",
        description: `"${practiceTitle}" removed from your saved practices.`
      });
    } else {
      updatedFavorites = [...favorites, practiceId];
      toast({
        title: "Added to favorites",
        description: `"${practiceTitle}" saved to your favorites.`
      });
    }
    
    setFavorites(updatedFavorites);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch {}

    if (user) {
      setTogglingId(practiceId);
      favoriteMutation.mutate({ practiceId, action: isFav ? "remove" : "add" });
    }
  };

  const isFavorite = (practiceId) => favorites.includes(practiceId);

  const categories = [
    { id: "all", label: "All Practices", icon: Dumbbell },
    { id: "breathing", label: "Breathwork", icon: Wind },
    { id: "mindfulness", label: "Mindfulness", icon: Brain },
    { id: "self-compassion", label: "Self-Compassion", icon: Heart },
    { id: "grounding", label: "Grounding", icon: Sparkles }
  ];

  const practices = [
    {
      id: "box-breathing",
      title: "Box Breathing",
      description: "A calming 4-count breathing pattern for stress relief",
      duration: "5 min",
      category: "breathing",
      difficulty: "Beginner",
      link: "/breathing"
    },
    {
      id: "body-scan",
      title: "Body Scan Meditation",
      description: "Systematic awareness through each part of your body",
      duration: "10-15 min",
      category: "mindfulness",
      difficulty: "Beginner",
      link: "/tools/body-scan"
    },
    {
      id: "compassion-break",
      title: "Self-Compassion Break",
      description: "A gentle practice to offer yourself kindness in difficult moments",
      duration: "3-5 min",
      category: "self-compassion",
      difficulty: "Beginner",
      link: "/tools/compassion-break"
    },
    {
      id: "5-4-3-2-1",
      title: "5-4-3-2-1 Grounding",
      description: "Engage your senses to anchor yourself in the present",
      duration: "5 min",
      category: "grounding",
      difficulty: "Beginner",
      link: "/tools/grounding"
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness Meditation",
      description: "Cultivate feelings of goodwill toward yourself and others",
      duration: "10-20 min",
      category: "self-compassion",
      difficulty: "Intermediate",
      link: "/tools/loving-kindness"
    },
    {
      id: "4-7-8-breathing",
      title: "4-7-8 Relaxation Breath",
      description: "A powerful technique for calming the nervous system",
      duration: "3-5 min",
      category: "breathing",
      difficulty: "Beginner",
      link: "/breathing"
    },
    {
      id: "mindful-walking",
      title: "Mindful Walking",
      description: "Bring awareness to each step and sensation",
      duration: "10-20 min",
      category: "mindfulness",
      difficulty: "Beginner",
      link: "/tools/mindful-walking"
    },
    {
      id: "safe-place",
      title: "Safe Place Visualization",
      description: "Create a mental sanctuary you can return to anytime",
      duration: "10 min",
      category: "grounding",
      difficulty: "Intermediate",
      link: "/tools/visualization"
    }
  ];

  const filteredPractices = practices.filter(practice => {
    const matchesSearch = practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         practice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || practice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Practice Library — The Genuine Love Project"
        description="Explore our collection of wellness exercises including breathwork, mindfulness, and grounding techniques."
      />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight" data-testid="text-page-title">
            Practice Library
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Evidence-informed exercises to support your wellbeing. 
            Start with what feels right for you.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10" data-testid="section-core-tools">
          {[
            { title: "Mood Check-In", description: "Track how you feel", icon: Smile, href: "/mood", cardBg: "bg-amber-50 dark:bg-amber-950/40", iconBg: "bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200", borderColor: "border-amber-200 dark:border-amber-800" },
            { title: "Journal", description: "Write and reflect", icon: Notebook, href: "/journal", cardBg: "bg-emerald-50 dark:bg-emerald-950/40", iconBg: "bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200", borderColor: "border-emerald-200 dark:border-emerald-800" },
            { title: "Reframe Tool", description: "Shift your perspective", icon: RefreshCw, href: "/tools/reframe", cardBg: "bg-violet-50 dark:bg-violet-950/40", iconBg: "bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-200", borderColor: "border-violet-200 dark:border-violet-800" },
            { title: "Topic Hubs", description: "Explore by topic", icon: Compass, href: "/hubs", cardBg: "bg-sky-50 dark:bg-sky-950/40", iconBg: "bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-200", borderColor: "border-sky-200 dark:border-sky-800" },
          ].map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.href}
                role="link"
                tabIndex={0}
                onClick={() => navigate(tool.href)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), navigate(tool.href))}
                className={`group flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer border ${tool.cardBg} ${tool.borderColor} hover:shadow-lg hover:scale-[1.02] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                data-testid={`link-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`p-3 rounded-xl ${tool.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{tool.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-10 p-6 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20" data-testid="section-twelve-practices" aria-label="12 Practices for Transformation">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">12 Practices for Transformation</h2>
                <p className="text-sm text-muted-foreground">A guided path through mind, body, soul, and action</p>
              </div>
            </div>
            <Link href="/twelve-practices">
              <Button variant="default" className="min-h-[40px] rounded-lg" data-testid="link-twelve-practices">
                Explore All 12
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: "Mind", color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" },
              { label: "Body", color: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700" },
              { label: "Soul", color: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700" },
              { label: "Action", color: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700" },
            ].map(d => (
              <span key={d.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${d.color}`}>
                {d.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[
              { n: 1, name: "Willingness", domain: "mind" },
              { n: 2, name: "Clarity", domain: "mind" },
              { n: 3, name: "Values", domain: "soul" },
              { n: 4, name: "Awareness", domain: "mind" },
              { n: 5, name: "Community", domain: "action" },
              { n: 6, name: "Repair", domain: "action" },
              { n: 7, name: "Boundaries", domain: "body" },
              { n: 8, name: "Presence", domain: "body" },
              { n: 9, name: "Purpose", domain: "soul" },
              { n: 10, name: "Resilience", domain: "action" },
              { n: 11, name: "Gratitude", domain: "soul" },
              { n: 12, name: "Service", domain: "action" },
            ].map(p => {
              const domainStyles = {
                mind: { badge: "bg-blue-600 dark:bg-blue-500 text-white", hover: "hover:bg-blue-50 dark:hover:bg-blue-950/30" },
                body: { badge: "bg-green-600 dark:bg-green-500 text-white", hover: "hover:bg-green-50 dark:hover:bg-green-950/30" },
                soul: { badge: "bg-purple-600 dark:bg-purple-500 text-white", hover: "hover:bg-purple-50 dark:hover:bg-purple-950/30" },
                action: { badge: "bg-orange-600 dark:bg-orange-500 text-white", hover: "hover:bg-orange-50 dark:hover:bg-orange-950/30" },
              };
              const style = domainStyles[p.domain];
              return (
                <div
                  key={p.n}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate("/twelve-practices")}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), navigate("/twelve-practices"))}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${style.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                  data-testid={`link-practice-${p.n}`}
                >
                  <span className={`w-7 h-7 min-w-[28px] inline-flex items-center justify-center rounded-full text-xs font-bold ${style.badge}`}>
                    {p.n}
                  </span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        <h2 className="text-xl font-bold text-foreground mb-5">Wellness Exercises</h2>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 min-h-[44px]"
            data-testid="input-search-practices"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" role="group" aria-label="Filter practices by category">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className="min-h-[40px] px-3 rounded-lg whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                data-testid={`filter-${cat.id}`}
                aria-pressed={activeCategory === cat.id}
              >
                <Icon className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredPractices.map(practice => (
            <Card key={practice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{practice.title}</CardTitle>
                    <CardDescription>{practice.description}</CardDescription>
                  </div>
                  <button
                    onClick={() => toggleFavorite(practice.id, practice.title)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                    aria-label={isFavorite(practice.id) ? "Remove from favorites" : "Add to favorites"}
                    aria-busy={togglingId === practice.id}
                    disabled={togglingId === practice.id}
                    data-testid={`button-favorite-${practice.id}`}
                  >
                    {togglingId === practice.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : (
                      <Heart 
                        className={`w-5 h-5 ${isFavorite(practice.id) ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
                      />
                    )}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    {practice.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {practice.duration}
                  </span>
                  {isFavorite(practice.id) && (
                    <span className="px-2 py-1 rounded-full text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300">
                      Favorited
                    </span>
                  )}
                </div>
                <Link href={practice.link}>
                  <Button className="w-full min-h-[44px] rounded-lg" data-testid={`button-start-${practice.id}`}>
                    Start Practice
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPractices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No practices found matching your search.</p>
            <Button
              variant="link"
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}

        <section className="bg-muted/50 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Getting Started</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
            New to wellness practices? Start with simple breathing exercises 
            or grounding techniques. There's no right or wrong way.
          </p>
          <Link href="/breathing">
            <Button className="min-h-[44px] px-6 rounded-lg" data-testid="button-start-breathing">
              Try Breathwork First
            </Button>
          </Link>
        </section>

        <p className="text-center text-xs text-muted-foreground mt-6">
          All tools are educational and self-guided. Go at your own pace.
        </p>
      </main>
    </div>
  );
}
