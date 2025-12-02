import { Link } from "wouter";
import { Heart, MessageCircle, BarChart3, Notebook, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <header className="py-6 px-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-pink-500" />
          <span className="text-xl font-bold">MyMentalHealthBuddy</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-neutral-400 hover:text-white transition" data-testid="link-login">
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            data-testid="link-register"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="px-6">
        <section className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Your Daily Companion for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Mental Wellness
            </span>
          </h1>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Track your mood, journal your thoughts, and chat with an AI companion designed to support your mental health journey.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition text-lg font-medium"
              data-testid="link-get-started"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition text-lg"
              data-testid="link-signin"
            >
              Sign In
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Features designed for your wellbeing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700" data-testid="feature-mood">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
              <p className="text-neutral-400">
                Track your emotional patterns over time with intuitive mood logging and insightful analytics.
              </p>
            </div>

            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700" data-testid="feature-journal">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Notebook className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Journal</h3>
              <p className="text-neutral-400">
                Write freely and reflect on your thoughts in a private, secure journal space.
              </p>
            </div>

            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700" data-testid="feature-chat">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Companion</h3>
              <p className="text-neutral-400">
                Chat with a compassionate AI companion that listens without judgment and offers support.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center" data-testid="benefit-privacy">
              <Shield className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">100% Private</h3>
              <p className="text-sm text-neutral-400">Your data stays secure and confidential</p>
            </div>
            <div className="flex flex-col items-center" data-testid="benefit-available">
              <Clock className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="font-semibold mb-2">24/7 Available</h3>
              <p className="text-sm text-neutral-400">Support whenever you need it</p>
            </div>
            <div className="flex flex-col items-center" data-testid="benefit-care">
              <Heart className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="font-semibold mb-2">Built with Care</h3>
              <p className="text-sm text-neutral-400">Designed by mental health advocates</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} MyMentalHealthBuddy. All rights reserved.</p>
          <p>
            <a href="mailto:support@mymentalhealthbuddy.com" className="hover:text-white transition">
              support@mymentalhealthbuddy.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
