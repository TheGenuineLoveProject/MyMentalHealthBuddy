import { Link } from "wouter";
import { Heart, BookOpen, Sparkles, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

export default function CreatorProfile() {
  const values = [
    {
      icon: Heart,
      title: "Genuine Love",
      description: "We believe everyone deserves to experience authentic self-love and compassion."
    },
    {
      icon: BookOpen,
      title: "Education First",
      description: "Empowering through knowledge, not prescriptions. You are the expert of your own life."
    },
    {
      icon: Sparkles,
      title: "Trauma-Informed",
      description: "Every tool and interaction is designed with sensitivity to your unique experiences."
    },
    {
      icon: Users,
      title: "Community",
      description: "Healing happens in connection. We're building a supportive community of seekers."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Story — The Genuine Love Project"
        description="Meet the heart behind The Genuine Love Project. Our mission is to make wellness accessible to everyone."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The Genuine Love Project was born from a simple belief: everyone deserves access 
            to tools that support their emotional wellbeing.
          </p>
        </header>

        <section className="mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Why We Built This</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Mental wellness support shouldn't be a luxury. Yet for many, traditional therapy 
                  remains inaccessible—whether due to cost, location, or simply not knowing where to start.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We created The Genuine Love Project to bridge that gap. Our platform offers 
                  educational tools, guided reflections, and AI-powered support that meet you 
                  where you are—24/7, at your own pace, in the privacy of your own space.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This isn't a replacement for professional care when you need it. It's a companion 
                  on your journey—a gentle nudge toward self-understanding, a safe space to explore 
                  your patterns, and a reminder that you are worthy of love, especially from yourself.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Aaliyah Draws Art LLC</h2>
              <p className="text-muted-foreground mb-2">Created by Maria Landa</p>
              <p className="text-muted-foreground max-w-lg mx-auto">
                A woman-owned business dedicated to making wellness accessible through 
                technology, art, and genuine human connection.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Your wellness journey starts with a single step. Explore our tools and 
            discover what resonates with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-explore-tools">
                Explore Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-view-pricing">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
