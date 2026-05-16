import { Link } from "wouter";
import { Shield, Heart, Phone, AlertTriangle, BookOpen, Users, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

export default function SafetyCenter() {
  const resources = [
    {
      title: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "Free, confidential support 24/7",
      url: "https://988lifeline.org"
    },
    {
      title: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free crisis counseling via text",
      url: "https://www.crisistextline.org"
    },
    {
      title: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "Support for abuse situations",
      url: "https://www.thehotline.org"
    },
    {
      title: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Substance abuse support",
      url: "https://www.samhsa.gov/find-help/national-helpline"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Safety Center — The Genuine Love Project"
        description="Your safety matters. Find crisis resources, understand our platform scope, and access professional support."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Safety Center
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your wellbeing is our priority. If you're in crisis or need immediate support, 
            please reach out to these professional resources.
          </p>
        </header>

        <section className="mb-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">
                  If You're in Immediate Danger
                </h2>
                <p className="text-red-800 dark:text-red-200 mb-4">
                  If you or someone you know is in immediate danger, please call emergency services (911) 
                  or go to your nearest emergency room.
                </p>
                <a
                  href="tel:911"
                  className="inline-flex items-center min-h-[48px] px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                  data-testid="button-call-911"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call 911
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Crisis Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">{resource.phone}</p>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Visit website <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Platform Scope & Disclaimers
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Educational Purpose Only</h3>
                    <p className="text-muted-foreground">
                      The Genuine Love Project provides educational wellness tools for self-reflection 
                      and personal growth. Our platform is designed to support your journey, not replace 
                      professional mental health care.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Not Therapy or Medical Advice</h3>
                    <p className="text-muted-foreground">
                      Our AI companions and wellness tools are not licensed therapists or medical 
                      professionals. They cannot diagnose conditions, prescribe treatments, or provide 
                      clinical care. For mental health concerns, please consult a qualified professional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">For Adults 18+</h3>
                    <p className="text-muted-foreground">
                      This platform is designed for adults aged 18 and older. By using our services, 
                      you confirm that you meet this age requirement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Your Privacy Matters</h3>
                    <p className="text-muted-foreground">
                      We take your privacy seriously. Your journal entries and personal reflections 
                      are encrypted and never shared. See our{" "}
                      <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      {" "}for details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <Link href="/tools">
            <Button
              size="lg"
              className="min-h-[48px] px-8 py-4 rounded-lg"
              data-testid="button-explore-tools"
            >
              Explore Wellness Tools
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
