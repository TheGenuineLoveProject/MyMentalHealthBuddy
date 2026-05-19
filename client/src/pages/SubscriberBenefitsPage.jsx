import { Link } from "wouter";
import { 
  Crown, Star, Sparkles, Heart, Brain, Shield, Zap, 
  CheckCircle, ArrowRight, Clock, TrendingUp, Gift,
  MessageCircle, Feather, Moon, Eye, BookOpen, Target,
  Compass, Award, Users, Activity, Lightbulb, Play
} from "lucide-react";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import SEO from "@/components/SEO";

const PREMIUM_FEATURES = [
  { name: "AI Chat Therapy", path: "/chat", icon: MessageCircle, description: "Unlimited compassionate AI conversations" },
  { name: "Daily Wisdom Oracle", path: "/daily-wisdom", icon: Sparkles, description: "Personalized daily guidance and insights" },
  { name: "Guided Journaling", path: "/guided-journaling", icon: Feather, description: "Structured reflection with MI prompts" },
  { name: "Advanced Tools", path: "/advanced", icon: Zap, description: "Deep transformation techniques" },
  { name: "Mastery Dashboard", path: "/mastery", icon: Award, description: "Peak performance and growth tools" },
  { name: "Elite Tools", path: "/elite-tools", icon: Crown, description: "Premium cognitive enhancement" },
  { name: "Content Studio", path: "/content-studio", icon: Target, description: "Create and transform content" },
  { name: "Knowledge Synthesis", path: "/knowledge-synthesis", icon: Brain, description: "Integrate learning insights" },
  { name: "Philosophical Inquiry", path: "/philosophical-inquiry", icon: Lightbulb, description: "Deep existential exploration" },
  { name: "Collaborative Lab", path: "/collaborative-lab", icon: Users, description: "Group intelligence workspace" },
  { name: "Growth Analytics", path: "/growth-analytics", icon: TrendingUp, description: "Personal development metrics" },
  { name: "Study Vault", path: "/study-vault", icon: BookOpen, description: "Evidence-based research library" }
];

const FREE_FEATURES = [
  { name: "Breathing Exercises", path: "/breathing", icon: Moon },
  { name: "Grounding Techniques", path: "/grounding", icon: Shield },
  { name: "Affirmations", path: "/affirmations", icon: Star },
  { name: "40 Topic Hubs", path: "/hubs", icon: Compass },
  { name: "Blog & Articles", path: "/blog", icon: BookOpen },
  { name: "Crisis Resources", path: "/crisis", icon: Heart }
];

const HIDDEN_GEMS = [
  { name: "12 Practices Path", path: "/paths/12-practices", icon: Target, tip: "A complete self-alignment framework" },
  { name: "Coherence Ladder", path: "/tools/coherence", icon: TrendingUp, tip: "Move from chaos to clarity" },
  { name: "NLP Reframing", path: "/tools/reframe", icon: Brain, tip: "15 safe language patterns" },
  { name: "Perception Refinement", path: "/tools/perception-refinement", icon: Eye, tip: "Nervous system regulation" },
  { name: "Self-Worth Reflection", path: "/tools/self-worth", icon: Heart, tip: "Reclaim your inherent value" },
  { name: "Permaculture Wellness", path: "/tools/permaculture", icon: Sparkles, tip: "Ecological healing principles" }
];

const QUICK_START_STEPS = [
  { time: "1 min", action: "Check in with your mood", path: "/mood", icon: Activity },
  { time: "2 min", action: "Read today's wisdom", path: "/daily-wisdom", icon: Sparkles },
  { time: "3 min", action: "Try a breathing exercise", path: "/breathing", icon: Moon },
  { time: "5 min", action: "Write in your journal", path: "/journal", icon: Feather },
  { time: "10 min", action: "Chat with AI companion", path: "/chat", icon: MessageCircle }
];

export default function SubscriberBenefitsPage() {
  return (
    <>
      <SEO 
        title="What You Get | Your Subscription Benefits"
        description="Discover all the features, tools, and resources included in your Genuine Love Project subscription."
        noIndex={true}
      />
      <WellnessPageShell
        title="What You Get"
        subtitle="Your complete guide to everything included in your subscription"
        benefits={pickBenefits(["agency", "clarity", "calm", "growth", "meaning"], 5)}
        clarity={{
          what: "A complete overview of your subscription benefits.",
          why: "So you can discover and use all the tools available to you.",
          who: "For subscribers who want to explore everything available to them.",
          when: "Whenever you want to explore new features.",
          where: "Right here - your personal benefits dashboard.",
          how: "Browse, click, and explore at your own pace."
        }}
        examples={[
          { label: "Beginner", examples: ["Start with the Quick Start Guide", "Try one new feature today"] },
          { label: "Intermediate", examples: ["Explore the Hidden Gems section", "Build a daily routine"] },
          { label: "Advanced", examples: ["Use all 12 Practices", "Master the advanced tools"] }
        ]}
      >
        <div className="min-h-screen v28-paper-bg py-8">
          <div className="content-wrapper">
            <div className="max-w-5xl mx-auto space-y-12">

              {/* Your Plan Section */}
              <section className="card-bordered bg-gradient-to-br from-[var(--gold-50)] to-[var(--cream-100)] dark:from-[var(--sage-900)] dark:to-[var(--sage-800)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="icon-container icon-xl icon-gradient-gold">
                    <Crown className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-teal" data-testid="text-plan-title">Premium Subscriber</h2>
                    <p className="text-body text-[var(--sage-600)]">Full access to all features and tools</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                    <div className="text-display-md text-teal">178+</div>
                    <div className="text-body-sm text-[var(--sage-600)]">Total Pages</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                    <div className="text-display-md text-teal">40</div>
                    <div className="text-body-sm text-[var(--sage-600)]">Topic Hubs</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                    <div className="text-display-md text-teal">25+</div>
                    <div className="text-body-sm text-[var(--sage-600)]">Wellness Tools</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                    <div className="text-display-md text-teal">∞</div>
                    <div className="text-body-sm text-[var(--sage-600)]">AI Sessions</div>
                  </div>
                </div>
              </section>

              {/* Premium Features Grid */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container icon-lg icon-gradient-blush">
                    <Star className="h-6 w-6" />
                  </div>
                  <h2 className="text-heading-lg text-teal" data-testid="text-premium-features">Premium Features Unlocked</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PREMIUM_FEATURES.map((feature) => (
                    <Link 
                      key={feature.path} 
                      href={feature.path}
                      className="card-bordered hover:shadow-lg transition-all group"
                      data-testid={`link-feature-${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="icon-container icon-md icon-soft-teal group-hover:icon-gradient-teal transition-all">
                          <feature.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-heading-sm text-teal group-hover:text-[var(--teal-700)]">{feature.name}</h3>
                          <p className="text-body-sm text-[var(--sage-600)]">{feature.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--sage-400)] group-hover:text-[var(--teal-500)] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Hidden Gems */}
              <section className="card-bordered bg-gradient-to-br from-[var(--blush-50)] to-[var(--cream-100)] dark:from-[var(--sage-900)] dark:to-[var(--sage-800)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container icon-lg icon-gradient-sage">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-teal" data-testid="text-hidden-gems">Hidden Gems</h2>
                    <p className="text-body-sm text-[var(--sage-600)]">Powerful features you might not have discovered yet</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {HIDDEN_GEMS.map((gem) => (
                    <Link 
                      key={gem.path} 
                      href={gem.path}
                      className="flex items-center gap-4 p-4 bg-white/70 dark:bg-black/20 rounded-xl hover:bg-white dark:hover:bg-black/30 transition-all group"
                      data-testid={`link-gem-${gem.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="icon-container icon-md icon-soft-blush group-hover:icon-gradient-blush">
                        <gem.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-heading-sm text-teal">{gem.name}</h3>
                        <p className="text-body-sm text-[var(--sage-500)]">{gem.tip}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--sage-400)] group-hover:text-[var(--blush-500)]" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Quick Start Guide */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container icon-lg icon-gradient-teal">
                    <Play className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-teal" data-testid="text-quick-start">5-Minute Daily Routine</h2>
                    <p className="text-body-sm text-[var(--sage-600)]">A simple way to start each day</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {QUICK_START_STEPS.map((step, index) => (
                    <Link 
                      key={step.path} 
                      href={step.path}
                      className="flex items-center gap-4 card-bordered hover:shadow-md transition-all group"
                      data-testid={`link-step-${index + 1}`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--teal-100)] dark:bg-[var(--teal-900)] text-teal font-semibold">
                        {index + 1}
                      </div>
                      <div className="icon-container icon-md icon-soft-sage group-hover:icon-gradient-sage">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-heading-sm text-teal">{step.action}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-[var(--sage-500)]">
                        <Clock className="h-4 w-4" />
                        {step.time}
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--sage-400)] group-hover:text-[var(--teal-500)]" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Free Features Included */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="icon-container icon-lg icon-soft-sage">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h2 className="text-heading-lg text-teal" data-testid="text-free-features">Always Free</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {FREE_FEATURES.map((feature) => (
                    <Link 
                      key={feature.path} 
                      href={feature.path}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--sage-100)] dark:bg-[var(--sage-800)] rounded-full hover:bg-[var(--sage-200)] dark:hover:bg-[var(--sage-700)] transition-colors"
                      data-testid={`link-free-${feature.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <feature.icon className="h-4 w-4 text-[var(--teal-600)]" />
                      <span className="text-body-sm text-teal">{feature.name}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Explore More CTAs */}
              <section className="grid md:grid-cols-3 gap-4">
                <Link href="/hubs" className="card-bordered text-center hover:shadow-lg transition-all group" data-testid="link-explore-hubs">
                  <div className="icon-container icon-xl icon-gradient-blush mx-auto mb-4">
                    <Compass className="h-7 w-7" />
                  </div>
                  <h3 className="text-heading-md text-teal mb-2">40 Topic Hubs</h3>
                  <p className="text-body-sm text-[var(--sage-600)]">Deep-dive into any wellness topic</p>
                </Link>
                <Link href="/content-index" className="card-bordered text-center hover:shadow-lg transition-all group" data-testid="link-explore-content">
                  <div className="icon-container icon-xl icon-gradient-sage mx-auto mb-4">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <h3 className="text-heading-md text-teal mb-2">Content Directory</h3>
                  <p className="text-body-sm text-[var(--sage-600)]">Browse all 178+ pages</p>
                </Link>
                <Link href="/paths/12-practices" className="card-bordered text-center hover:shadow-lg transition-all group" data-testid="link-explore-path">
                  <div className="icon-container icon-xl icon-gradient-teal mx-auto mb-4">
                    <Target className="h-7 w-7" />
                  </div>
                  <h3 className="text-heading-md text-teal mb-2">12 Practices Path</h3>
                  <p className="text-body-sm text-[var(--sage-600)]">Complete transformation framework</p>
                </Link>
              </section>

            </div>
          </div>
        </div>
        <SafetyFooter />
      </WellnessPageShell>
    </>
  );
}
