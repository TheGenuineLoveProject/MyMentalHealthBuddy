import { Link } from "wouter";
import { Map, CheckCircle, Clock, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

export default function PublicRoadmap() {
  const completed = [
    { title: "AI Chat Companion", description: "Supportive AI conversations with trauma-informed responses" },
    { title: "Mood Tracking", description: "Track your emotional state over time" },
    { title: "Journal Prompts", description: "Guided journaling for self-reflection" },
    { title: "Breathing Exercises", description: "Calming breathwork practices" },
    { title: "Body Scan Meditation", description: "Guided somatic awareness tool" },
    { title: "Crisis Resources", description: "Easy access to professional support" }
  ];

  const inProgress = [
    { title: "Micro-Courses", description: "Bite-sized learning modules on wellness topics", eta: "Q1 2026" },
    { title: "Community Features", description: "Connect with others on similar journeys", eta: "Q2 2026" },
    { title: "Mobile App", description: "Native iOS and Android apps", eta: "Q2 2026" }
  ];

  const planned = [
    { title: "Personalized Pathways", description: "AI-curated wellness journeys based on your goals" },
    { title: "Practitioner Directory", description: "Find therapists and coaches in your area" },
    { title: "Group Workshops", description: "Live virtual sessions on wellness topics" },
    { title: "Partner Integrations", description: "Connect with meditation apps and wearables" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Public Roadmap — The Genuine Love Project"
        description="See what we're building next. Our transparent roadmap shows completed features and what's coming."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Map className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            What's Next
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're constantly improving The Genuine Love Project. Here's a transparent look 
            at what we've built and what's coming next.
          </p>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Completed</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {completed.map((item, index) => (
              <Card key={index} className="border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">In Progress</h2>
          </div>
          <div className="space-y-4">
            {inProgress.map((item, index) => (
              <Card key={index} className="border-amber-200 dark:border-amber-800/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {item.eta}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Planned</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {planned.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Have Ideas?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            We'd love to hear what features would help you on your wellness journey. 
            Your feedback shapes our roadmap.
          </p>
          <Link href="/support/feedback">
            <Button size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-share-feedback">
              Share Feedback
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
