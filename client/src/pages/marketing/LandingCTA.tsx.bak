import { Link } from "wouter";
import { Heart, ArrowRight, Sparkles, Gift } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-sage-700" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Sparkles className="w-4 h-4 text-gold-300" />
          <span className="text-sm font-medium text-white">Start Your Healing Journey Today</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          You Deserve to
          <span className="block text-gold-300">Live in Genuine Love</span>
        </h2>

        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands who have discovered a gentler path to healing. 
          No pressure, no judgment — just compassionate support when you need it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link 
            href="/register"
            className="group flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            data-testid="link-cta-start"
          >
            <Heart className="w-5 h-5 text-rose-500" />
            Begin Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/pricing"
            className="flex items-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all"
            data-testid="link-cta-pricing"
          >
            <Gift className="w-5 h-5" />
            View Plans
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center" data-testid="stat-members">
            <div className="text-3xl font-bold text-white mb-1">10,000+</div>
            <div className="text-white/60 text-sm">Active Members</div>
          </div>
          <div className="text-center" data-testid="stat-rating">
            <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-white/60 text-sm">User Rating</div>
          </div>
          <div className="text-center" data-testid="stat-tools">
            <div className="text-3xl font-bold text-white mb-1">148+</div>
            <div className="text-white/60 text-sm">Wellness Tools</div>
          </div>
        </div>

        <p className="mt-12 text-white/50 text-sm">
          No credit card required for free trial • Cancel anytime • Your data stays private
        </p>
      </div>
    </section>
  );
}
