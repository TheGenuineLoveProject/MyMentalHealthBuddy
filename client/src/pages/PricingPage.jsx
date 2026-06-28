import { useState } from "react";
import { Link } from "wouter";
import { Check, Sparkles, Shield, Heart, Zap, HelpCircle } from "lucide-react";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";
import NewsletterSignup from "../components/NewsletterSignup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Core wellness tools, always free",
    features: [
      "Mood tracking & journaling",
      "5 AI chat sessions per day",
      "Daily reflection prompts",
      "Community affirmation wall",
      "Crisis support resources",
      "Daily wisdom & insights"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    period: "one-time",
    description: "A gentle step up — unlock deeper tools with a single payment",
    features: [
      "Everything in Free",
      "25 AI chat sessions per day",
      "Journal insights & patterns",
      "Guided reflection exercises"
    ],
    cta: "Get Starter",
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 12.99,
    period: "/month",
    description: "Unlimited AI sessions and the full wellness toolkit",
    features: [
      "Everything in Starter",
      "Expanded AI-guided reflection sessions",
      "Advanced emotional insights",
      "Guided healing journeys",
      "Content studio access",
      "Progress analytics",
      "Priority support"
    ],
    cta: "Upgrade to Pro",
    popular: true
  },
  {
    id: "elite",
    name: "Elite",
    price: 29.99,
    period: "/month",
    description: "The complete experience with premium tools and early access",
    features: [
      "Everything in Pro",
      "Voice affirmations",
      "1-on-1 onboarding session",
      "Early access to new features",
      "Elite community access"
    ],
    cta: "Go Elite",
    popular: false
  }
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    q: "Is there a free trial?",
    a: "The free plan is yours forever — no trial needed. If you choose Pro, you can cancel anytime and keep access through the end of your paid period."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards through Stripe. Your payment information is securely encrypted."
  },
  {
    q: "What if I change my mind?",
    a: "You can cancel anytime from your billing page. You'll keep full access through the end of your paid period — no penalties, no hassle."
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <SEO 
        title="Pricing — MyMentalHealthBuddy"
        description="Free core tools or Pro with unlimited AI sessions. No lock-in, cancel anytime."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Choose What Feels <span className="text-primary">Right</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Core tools are free, always. Step up at your own pace — from a one-time Starter unlock
            to unlimited Pro or the full Elite experience. Cancel anytime.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-20">
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
                  <span className="text-4xl font-bold">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
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

                <a href={plan.id === "free" ? "/login" : `/account/billing?plan=${plan.id}&period=${billingPeriod}`}>
                  <Button 
                    className="w-full min-h-[48px] px-6 py-3 text-base font-semibold rounded-lg" 
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`cta-${plan.id}`}
                  >
                    {plan.cta}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mb-16">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">No Lock-In</h3>
                <p className="text-sm text-muted-foreground">Cancel anytime. Keep access through the end of your paid period.</p>
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

        <section className="max-w-2xl mx-auto mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
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

        <section className="mt-16 max-w-lg mx-auto" data-testid="section-pricing-newsletter">
          <NewsletterSignup source="/pricing" />
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
