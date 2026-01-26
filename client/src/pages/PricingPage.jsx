import { useState } from "react";
import { Link } from "wouter";
import { Check, Sparkles, Shield, Heart, Zap, HelpCircle } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Start your wellness journey",
    features: [
      "Basic mood tracking",
      "5 AI chat sessions/month",
      "Access to core tools",
      "Community check-ins",
      "Crisis resources"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    description: "Full access to transform your life",
    features: [
      "Everything in Free",
      "Unlimited AI chat sessions",
      "All wellness tools unlocked",
      "Personal growth pathways",
      "Progress analytics",
      "Priority support",
      "Downloadable journals",
      "Custom calm plans"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 299,
    description: "One-time payment, forever access",
    features: [
      "Everything in Premium",
      "Lifetime updates",
      "Early access to new features",
      "Exclusive content library",
      "Personal onboarding call",
      "Legacy pricing locked"
    ],
    cta: "Get Lifetime Access",
    popular: false,
    oneTime: true
  }
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Premium includes a 7-day free trial. You won't be charged until the trial ends."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards through Stripe. Your payment information is securely encrypted."
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked."
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <SEO 
        title="Pricing — The Genuine Love Project"
        description="Choose the plan that's right for your wellness journey."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Invest in Your <span className="text-primary">Wellbeing</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your journey. All plans include our core 
            wellness tools and crisis support resources.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {PLANS.map(plan => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
              data-testid={`plan-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && !plan.oneTime && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                  {plan.oneTime && (
                    <span className="text-muted-foreground"> one-time</span>
                  )}
                </div>

                <ul className="space-y-3 text-left mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.id === "free" ? "/register" : `/upgrade?plan=${plan.id}`}>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`cta-${plan.id}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mb-16">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">30-Day Guarantee</h3>
                <p className="text-sm text-muted-foreground">Not satisfied? Full refund, no questions asked.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <Heart className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Crisis Support Free</h3>
                <p className="text-sm text-muted-foreground">Crisis resources are always free for everyone.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <Zap className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Cancel Anytime</h3>
                <p className="text-sm text-muted-foreground">No long-term contracts or hidden fees.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <Card 
                key={i}
                className="cursor-pointer"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                data-testid={`faq-${i}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.q}</span>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  {expandedFaq === i && (
                    <p className="text-sm text-muted-foreground mt-3">{item.a}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground mt-12">
          This platform provides educational wellness content only. 
          It is not a substitute for professional mental health care.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
