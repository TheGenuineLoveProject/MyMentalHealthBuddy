import { Link } from "wouter";
import SafetyFooter from "../components/SafetyFooter.jsx";

export default function AboutApproachPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400" data-testid="link-breadcrumb-home">Home</Link></li>
            <li className="before:content-['/'] before:mx-2"><Link href="/about" className="hover:text-purple-600 dark:hover:text-purple-400" data-testid="link-breadcrumb-about">About</Link></li>
            <li className="before:content-['/'] before:mx-2 text-gray-900 dark:text-white font-medium">Our Approach</li>
          </ol>
        </nav>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="heading-approach">
            Our Healing Approach
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Trauma-informed, evidence-based, and deeply compassionate wellness support
          </p>
        </header>

        <div className="space-y-12">
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Motivational Interviewing (MI)</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use Motivational Interviewing principles to create a supportive, non-judgmental space. 
              Rather than prescribing solutions, we help you discover your own wisdom and motivation for positive change.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Express empathy through reflective listening</li>
              <li>Support your autonomy and self-efficacy</li>
              <li>Roll with resistance rather than confronting it</li>
              <li>Develop discrepancy between current behaviors and goals</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Strengths-Based Approach</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We believe everyone has inherent strengths and resources. Our platform helps you identify and build upon 
              what's already working in your life rather than focusing solely on problems.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Focus on capabilities, not deficits</li>
              <li>Celebrate small wins and progress</li>
              <li>Build on existing coping skills</li>
              <li>Empower self-directed growth</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Trauma-Informed Care</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Every interaction is designed with trauma awareness. We prioritize safety, trustworthiness, 
              choice, collaboration, and empowerment in all our content and features.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Safety first - physical and emotional</li>
              <li>Transparency and trustworthiness</li>
              <li>Peer support and mutual self-help</li>
              <li>Collaboration and empowerment</li>
              <li>Cultural, historical, and gender awareness</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ethical AI Principles</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our AI companion follows strict ethical guidelines. We never use manipulative techniques 
              and always maintain clear boundaries about what AI can and cannot provide.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Transparency about AI capabilities and limitations</li>
              <li>No dark patterns or manipulative language</li>
              <li>Clear referrals to professional help when needed</li>
              <li>Privacy-first data handling</li>
            </ul>
          </section>

          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4">
              Important Reminder
            </h3>
            <p className="text-purple-800 dark:text-purple-300 mb-6">
              The Genuine Love Project is an educational wellness platform, not a substitute for professional 
              mental health treatment. If you're experiencing a mental health crisis, please seek professional help.
            </p>
            <Link 
              href="/crisis"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              data-testid="link-crisis-resources"
            >
              Crisis Resources
            </Link>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </div>
  );
}
