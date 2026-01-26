import { Link } from "wouter";
import { Database, Clock, Trash2, Shield, Download, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

export default function DataRetention() {
  const retentionPolicies = [
    {
      category: "Account Information",
      retention: "Until account deletion",
      details: "Your name, email, and profile settings are kept as long as your account is active.",
      icon: Shield
    },
    {
      category: "Journal Entries",
      retention: "Until you delete them",
      details: "Your private journal entries remain encrypted and under your control. Delete anytime.",
      icon: Database
    },
    {
      category: "Chat Conversations",
      retention: "90 days",
      details: "AI chat history is automatically deleted after 90 days to protect your privacy.",
      icon: Clock
    },
    {
      category: "Usage Analytics",
      retention: "12 months",
      details: "Anonymous usage data helps us improve the platform. No personal content is stored.",
      icon: Database
    },
    {
      category: "Payment Records",
      retention: "7 years",
      details: "Financial records are kept as required by law. Payment details are stored by Stripe.",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Data Retention Policy — The Genuine Love Project"
        description="Understand how we store, protect, and delete your data. Your privacy matters to us."
      />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
            Data Retention Policy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We believe in transparency. Here's exactly how long we keep your data 
            and what happens when you choose to delete it.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2026
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Retention Periods
          </h2>
          <div className="space-y-6">
            {retentionPolicies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{policy.category}</h3>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                            {policy.retention}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{policy.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Your Rights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Download a copy of all your data at any time from your account settings.
                </p>
                <Link href="/account/export">
                  <Button variant="outline" className="min-h-[44px] px-4 py-2 rounded-lg" data-testid="button-export-data">
                    Export Data
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-primary" />
                  Delete Your Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <Link href="/account/delete">
                  <Button variant="outline" className="min-h-[44px] px-4 py-2 rounded-lg text-destructive hover:text-destructive" data-testid="button-delete-account">
                    Delete Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-muted/50 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Questions?
          </h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about our data practices or want to exercise your privacy rights, 
            please contact us.
          </p>
          <Link href="/support">
            <Button className="min-h-[44px] px-6 py-3 rounded-lg" data-testid="button-contact-support">
              Contact Support
            </Button>
          </Link>
        </section>

        <section className="text-center text-sm text-muted-foreground">
          <p>
            See also:{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            {" "}·{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}·{" "}
            <Link href="/safety" className="text-primary hover:underline">Safety Center</Link>
          </p>
        </section>
      </main>

      <SafetyFooter />
    </div>
  );
}
