import { useState } from "react";
import { Link } from "wouter";
import { Dumbbell, Clock, Star, Heart, Wind, Brain, Sparkles, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

export default function PracticeLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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
      link: "/tools/breathing"
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
      link: "/tools/breathing"
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

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className="min-h-[44px] px-4 rounded-lg whitespace-nowrap"
                data-testid={`filter-${cat.id}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPractices.map(practice => (
            <Card key={practice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{practice.title}</CardTitle>
                <CardDescription>{practice.description}</CardDescription>
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
            <Link href="/tools/breathing">
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
