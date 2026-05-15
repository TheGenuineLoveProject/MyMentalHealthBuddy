import { Link } from "wouter";
import { Scale, FileText, Shield, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const LEGAL_LINKS = [
  { title: "Terms of Service", path: "/legal/terms", description: "Our terms and conditions for using the platform." },
  { title: "Privacy Policy", path: "/legal/privacy", description: "How we collect, use, and protect your data." },
  { title: "Cookie Policy", path: "/legal/cookies", description: "Information about cookies and tracking." },
  { title: "Refund Policy", path: "/legal/refunds", description: "Our 30-day money-back guarantee details." },
  { title: "Accessibility Statement", path: "/legal/accessibility", description: "Our commitment to WCAG AA compliance." },
  { title: "DMCA Policy", path: "/legal/dmca", description: "Copyright and intellectual property." }
];

const TAX_INFO = [
  "Prices displayed are in USD.",
  "Sales tax may apply based on your location.",
  "Tax will be calculated at checkout.",
  "Business customers may be exempt with valid documentation."
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Legal & Tax Information — The Genuine Love Project"
        description="Legal policies, terms, and tax information."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Scale className="w-5 h-5" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Legal & Tax Information
          </h1>
          <p className="text-muted-foreground">
            Our policies and legal documents.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Legal Documents</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {LEGAL_LINKS.map(link => (
              <Link key={link.path} href={link.path}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {TAX_INFO.map((info, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  {info}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Business Information</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Aaliyah Draws Art LLC</strong></p>
              <p>Owner: Maria Landa</p>
              <p>The Genuine Love Project</p>
              <p>support@thegenuineloveproject.com</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
