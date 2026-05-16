import { Link } from "wouter";
import { HelpCircle, ArrowLeft, Mail, MessageCircle, Clock, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const REFUND_STEPS = [
  "We offer a 30-day money-back guarantee on all paid plans.",
  "Contact our support team with your request.",
  "We'll process your refund within 5-7 business days.",
  "You'll receive a confirmation email when complete."
];

const FAQ = [
  {
    q: "How long does a refund take?",
    a: "Refunds are typically processed within 5-7 business days. Your bank may take additional time to reflect the credit."
  },
  {
    q: "Will I lose access immediately?",
    a: "You'll retain access until the end of your current billing period, even after requesting a refund."
  },
  {
    q: "Can I get a partial refund?",
    a: "Yes, we can prorate refunds based on your remaining subscription time."
  },
  {
    q: "What about lifetime purchases?",
    a: "Lifetime purchases are also covered by our 30-day guarantee."
  }
];

export default function RefundHelp() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Refund & Billing Help — The Genuine Love Project"
        description="Get help with refunds and billing questions."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/help">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help
          </Button>
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Support</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Refund & Billing Help
          </h1>
          <p className="text-muted-foreground">
            We're here to help with any billing concerns. Our process is calm, clear, and respectful.
          </p>
        </header>

        <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              30-Day Money-Back Guarantee
            </h2>
            <ol className="space-y-3">
              {REFUND_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Common Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium mb-1">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Need help with a refund or billing issue? We're here for you.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="mailto:support@genuinelove.app">
                <Button variant="outline" className="justify-start w-full" data-testid="button-email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" className="justify-start w-full" data-testid="button-chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              Typical response time: 24 hours
            </div>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
