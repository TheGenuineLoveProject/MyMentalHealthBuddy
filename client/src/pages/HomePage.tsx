import { Link } from "wouter";
import { FaHeart, FaBook, FaStar, FaChartLine, FaShieldAlt, FaBolt } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 animate-bounce">
            <FaHeart className="w-16 h-16 text-pink-500" />
          </div>
          
          <h1 data-testid="text-hero-title" className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6">
            MyMentalHealthBuddy
          </h1>
          
          <p data-testid="text-hero-description" className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Your AI-powered companion for mental well-being, available 24/7 with compassion and support 💚
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/ai"
              data-testid="link-start-chat"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaStar className="w-5 h-5" />
              Start Chat
            </Link>
            <Link
              to="/mood"
              data-testid="link-track-mood"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-purple-200 flex items-center gap-2"
            >
              <FaChartLine className="w-5 h-5" />
              Track Mood
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 data-testid="text-features-heading" className="text-3xl font-bold text-center mb-12 text-gray-800">
          Everything You Need for Mental Wellness
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* AI Chat Feature */}
          <Link
            to="/ai"
            data-testid="card-feature-ai"
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaStar className="w-7 h-7 text-white" />
            </div>
            <h3 data-testid="text-feature-title-ai" className="text-2xl font-bold mb-3 text-gray-800">AI Companion</h3>
            <p data-testid="text-feature-description-ai" className="text-gray-600 leading-relaxed">
              Chat with your compassionate AI buddy anytime. Get support, guidance, and a listening ear 24/7.
            </p>
          </Link>

          {/* Mood Tracker Feature */}
          <Link
            to="/mood"
            data-testid="card-feature-mood"
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaChartLine className="w-7 h-7 text-white" />
            </div>
            <h3 data-testid="text-feature-title-mood" className="text-2xl font-bold mb-3 text-gray-800">Mood Tracking</h3>
            <p data-testid="text-feature-description-mood" className="text-gray-600 leading-relaxed">
              Log your feelings and emotions. Discover patterns and insights to better understand yourself.
            </p>
          </Link>

          {/* Journal Feature */}
          <Link
            to="/journal"
            data-testid="card-feature-journal"
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-pink-100"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <FaBook className="w-7 h-7 text-white" />
            </div>
            <h3 data-testid="text-feature-title-journal" className="text-2xl font-bold mb-3 text-gray-800">Personal Journal</h3>
            <p data-testid="text-feature-description-journal" className="text-gray-600 leading-relaxed">
              Express yourself freely in your private journal. Write, reflect, and track your growth journey.
            </p>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div data-testid="badge-privacy" className="flex flex-col items-center">
              <FaShieldAlt className="w-12 h-12 text-green-600 mb-3" />
              <h4 data-testid="text-badge-title-privacy" className="font-semibold text-gray-800 mb-2">100% Private</h4>
              <p data-testid="text-badge-description-privacy" className="text-sm text-gray-600">Your conversations and data are completely confidential</p>
            </div>
            <div data-testid="badge-availability" className="flex flex-col items-center">
              <FaBolt className="w-12 h-12 text-yellow-600 mb-3" />
              <h4 data-testid="text-badge-title-availability" className="font-semibold text-gray-800 mb-2">Always Available</h4>
              <p data-testid="text-badge-description-availability" className="text-sm text-gray-600">Get support whenever you need it, day or night</p>
            </div>
            <div data-testid="badge-compassion" className="flex flex-col items-center">
              <FaHeart className="w-12 h-12 text-pink-600 mb-3" />
              <h4 data-testid="text-badge-title-compassion" className="font-semibold text-gray-800 mb-2">Compassionate AI</h4>
              <p data-testid="text-badge-description-compassion" className="text-sm text-gray-600">Powered by advanced AI trained for empathy and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}