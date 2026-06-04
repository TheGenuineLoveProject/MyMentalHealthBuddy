import { Link } from "wouter";
import { FileText, Download, Image, Palette, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

export default function PressKit() {
  const brandColors = [
    { name: "Primary Teal", hex: "#0D9488", usage: "Primary actions, links" },
    { name: "Soft Sage", hex: "#84A98C", usage: "Secondary elements, accents" },
    { name: "Warm Blush", hex: "#F9A8D4", usage: "Highlights, wellness" },
    { name: "Deep Forest", hex: "#1E3A3A", usage: "Text, headings" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Press & Media Kit — The Genuine Love Project"
        description="Download brand assets, logos, and learn about The Genuine Love Project for press coverage."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Press & Media Kit
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to write about The Genuine Love Project. 
            Brand assets, company information, and contact details.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">About Us</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>The Genuine Love Project</strong> is an AI-powered mental wellness platform 
                  designed to make emotional wellbeing support accessible to everyone. Founded by 
                  Maria Landa under Aaliyah Draws Art LLC, the platform offers trauma-informed 
                  educational tools, guided reflections, and AI companionship.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to help people "Live in Genuine Love" by providing a safe, 
                  private space for self-exploration and growth. The platform is designed for 
                  adults (18+) and emphasizes education and support over clinical intervention.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Facts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Founded", value: "2024" },
              { label: "Headquarters", value: "United States" },
              { label: "Company", value: "Aaliyah Draws Art LLC" },
              { label: "Founder", value: "Maria Landa" },
              { label: "Category", value: "Mental Wellness Tech" },
              { label: "Platform", value: "Web (Progressive Web App)" }
            ].map((fact, index) => (
              <Card key={index}>
                <CardContent className="py-4 flex justify-between items-center">
                  <span className="text-muted-foreground">{fact.label}</span>
                  <span className="font-semibold">{fact.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            Brand Colors
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {brandColors.map((color, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <h3 className="font-semibold">{color.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{color.hex}</p>
                      <p className="text-sm text-muted-foreground">{color.usage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Image className="w-8 h-8 text-primary" />
            Logo Assets
          </h2>
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-6">
                Our logo assets are brand-locked. Please contact us for approved versions.
              </p>
              <Link href="/support">
                <Button className="min-h-[44px] px-6 py-3 rounded-lg" data-testid="button-request-logos">
                  <Mail className="w-4 h-4 mr-2" />
                  Request Logo Assets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Brand Guidelines</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Use our full name: "MyMentalHealthBuddy by The Genuine Love Project"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span>Maintain logo proportions and clear space</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">✗</span>
                  <span>Do not modify, recolor, or distort our logos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">✗</span>
                  <span>Do not imply clinical or medical endorsement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-primary/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Media Contact</h2>
          <p className="text-muted-foreground mb-6">
            For press inquiries, interviews, or additional information, please reach out.
          </p>
          <Link href="/support">
            <Button size="lg" className="min-h-[48px] px-8 py-4 rounded-lg" data-testid="button-contact-press">
              <Mail className="w-5 h-5 mr-2" />
              Contact for Press
            </Button>
          </Link>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
