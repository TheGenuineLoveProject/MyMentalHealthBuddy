import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, Heart, Brain, Sparkles, Target, Compass, 
  Sun, Shield, Leaf, Star, BookOpen, TrendingUp 
} from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const PATHWAYS = [
  {
    id: "self-love",
    title: "Self-Love Foundation",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    description: "Build a foundation of self-compassion and acceptance.",
    tools: ["mood", "gratitude", "affirmations"],
    duration: "4 weeks"
  },
  {
    id: "emotional-awareness",
    title: "Emotional Awareness",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    description: "Understand and navigate your emotions with clarity.",
    tools: ["mood", "journal", "reflection"],
    duration: "6 weeks"
  },
  {
    id: "calm-resilience",
    title: "Calm & Resilience",
    icon: Shield,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    description: "Develop inner calm and bounce-back strength.",
    tools: ["breathwork", "grounding", "body-scan"],
    duration: "4 weeks"
  },
  {
    id: "growth-mindset",
    title: "Growth Mindset",
    icon: TrendingUp,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    description: "Cultivate a mindset that embraces learning and growth.",
    tools: ["reframe", "goals", "reflection"],
    duration: "4 weeks"
  },
  {
    id: "purpose-meaning",
    title: "Purpose & Meaning",
    icon: Compass,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    description: "Explore what gives your life meaning and direction.",
    tools: ["values", "meaning-map", "journal"],
    duration: "6 weeks"
  },
  {
    id: "connection",
    title: "Healthy Connection",
    icon: Sparkles,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    description: "Build and nurture meaningful relationships.",
    tools: ["boundaries", "repair-script", "gratitude"],
    duration: "4 weeks"
  }
];

export default function PathwaysHome() {
  const [selectedPathway, setSelectedPathway] = useState(null);

  const { data: userProgress } = useQuery({
    queryKey: ["/api/pathways/progress"],
    enabled: false
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Personal Growth Pathways — The Genuine Love Project"
        description="Explore curated wellness journeys designed to guide your personal growth."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            <span>Personalized Journeys</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Choose Your <span className="text-primary">Growth Path</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Curated wellness journeys to guide you through meaningful transformation. 
            Each pathway combines tools, practices, and insights tailored to your goals.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {PATHWAYS.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <Card 
                key={pathway.id}
                className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                data-testid={`card-pathway-${pathway.id}`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${pathway.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${pathway.color}`} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {pathway.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {pathway.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pathway.duration}</span>
                    <span>{pathway.tools.length} tools</span>
                  </div>
                  <Link href={`/pathways/${pathway.id}`}>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4 min-h-[44px] px-6 py-3 text-base font-medium group-hover:bg-primary group-hover:text-white transition-all"
                      data-testid={`button-start-${pathway.id}`}
                    >
                      Start Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <section className="bg-muted/50 rounded-3xl p-10 md:p-12 text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
            Take our quick assessment to discover which pathway aligns with your current needs and goals.
          </p>
          <Link href="/pathways/onboarding">
            <Button 
              className="min-h-[48px] px-8 py-4 text-base font-semibold"
              data-testid="button-take-assessment"
            >
              Take the Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
