import { Link } from "wouter";
import { Users, Heart, Shield, MessageCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

export default function CommunityGuidelines() {
  const doList = [
    "Be kind and supportive to yourself and others",
    "Share experiences that may help others on their journey",
    "Respect everyone's unique path to wellness",
    "Ask for help when you need it",
    "Celebrate small wins and progress",
    "Offer encouragement without unsolicited advice"
  ];

  const dontList = [
    "Share medical or clinical advice",
    "Diagnose or suggest treatments",
    "Share content that could be triggering without warnings",
    "Pressure others about their choices",
    "Share personal information about others",
    "Use the platform for commercial promotion"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Community Guidelines — The Genuine Love Project"
        description="Our community values kindness, support, and respect. Learn how we create a safe space for growth."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Community Guidelines
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building a community rooted in genuine love, mutual respect, and supportive growth. 
            These guidelines help us maintain that safe space.
          </p>
        </header>

        <section className="mb-16">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Our Core Values</h2>
                  <p className="text-muted-foreground">
                    Every interaction on our platform is guided by compassion, authenticity, and respect. 
                    We believe everyone deserves a space to explore their wellness journey without judgment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Do
            </h2>
            <ul className="space-y-4">
              {doList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Don't
            </h2>
            <ul className="space-y-4">
              {dontList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Content Guidelines
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Supportive Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use language that uplifts and supports. Phrases like "I found it helpful..." or 
                  "Something that worked for me..." share experiences without prescribing solutions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Trigger Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If sharing content that discusses trauma, abuse, or distressing topics, 
                  please include appropriate warnings so others can choose whether to engage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Respect Boundaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Everyone moves at their own pace. Respect when others aren't ready to share 
                  or engage with certain topics. "No" is a complete sentence.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Reporting Concerns
          </h2>
          <p className="text-amber-800 dark:text-amber-200 mb-4">
            If you see content that violates these guidelines or makes you uncomfortable, 
            please report it. We review all reports and take appropriate action.
          </p>
          <Link href="/support/feedback">
            <Button variant="outline" className="min-h-[44px] px-4 py-2 rounded-lg border-amber-600 text-amber-900 dark:text-amber-100" data-testid="button-report">
              Report a Concern
            </Button>
          </Link>
        </section>

        <section className="text-center">
          <p className="text-muted-foreground mb-6">
            Thank you for helping us build a community of genuine love and support.
          </p>
          <Link href="/tools">
            <Button size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-explore-tools">
              Explore the Tools
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
