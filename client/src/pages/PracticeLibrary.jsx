import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dumbbell, Clock, Star, Heart, Wind, Brain, Sparkles, Search, ArrowRight, Loader2, Smile, Notebook, RefreshCw, Compass, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const FAVORITES_KEY = "glp-practice-favorites";

export default function PracticeLibrary() {
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

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Practice Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of evidence-informed exercises to support your wellbeing. 
            Start with what feels right for you.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" data-testid="section-core-tools">
          {[
            { title: "Mood Check-In", description: "Track how you feel", icon: Smile, href: "/mood", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300" },
            { title: "Journal", description: "Write and reflect", icon: Notebook, href: "/journal", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300" },
            { title: "Reframe Tool", description: "Shift your perspective", icon: RefreshCw, href: "/tools/reframe", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300" },
            { title: "Topic Hubs", description: "Explore by topic", icon: Compass, href: "/hubs", color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300" },
          ].map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all bg-card"
                data-testid={`link-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`p-3 rounded-xl ${tool.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{tool.title}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mb-12 p-6 rounded-2xl border border-primary/20 bg-primary/5" data-testid="section-twelve-practices">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">12 Practices for Transformation</h2>
                <p className="text-sm text-muted-foreground">A guided path through mind, body, soul, and action</p>
              </div>
            </div>
            <Link href="/twelve-practices">
              <Button variant="outline" className="min-h-[40px] rounded-lg" data-testid="link-twelve-practices">
                Explore All 12
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
            ].map(p => (
              <Link
                key={p.n}
                href="/twelve-practices"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                data-testid={`link-practice-${p.n}`}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex-shrink-0">{p.n}</span>
                <span className="text-sm text-foreground truncate">{p.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <h2 className="text-2xl font-bold text-foreground mb-6">Wellness Exercises</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
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
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8" role="group" aria-label="Filter practices by category">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className="min-h-[44px] px-4 rounded-lg whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                data-testid={`filter-${cat.id}`}
                aria-pressed={activeCategory === cat.id}
              >
                <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

        <section className="bg-muted/50 rounded-xl p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-6">
              New to wellness practices? We recommend starting with simple breathing exercises 
              or grounding techniques. There's no right or wrong way—just begin where you are.
            </p>
            <Link href="/breathing">
              <Button size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-start-breathing">
                Try Breathwork First
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
