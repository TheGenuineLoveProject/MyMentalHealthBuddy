import { Link } from "wouter";
import SafetyFooter from "../components/SafetyFooter.jsx";

export default function ValuesPage() {
  const coreValues = [
    {
      title: "Compassion",
      description: "We approach every interaction with genuine care and understanding, recognizing that everyone's journey is unique.",
      icon: "💜"
    },
    {
      title: "Safety",
      description: "Physical and emotional safety is our foundation. We create spaces where vulnerability is met with gentleness.",
      icon: "🛡️"
    },
    {
      title: "Authenticity",
      description: "We encourage genuine self-expression and honest exploration of emotions without judgment.",
      icon: "✨"
    },
    {
      title: "Empowerment",
      description: "We believe in your inherent wisdom and capacity for growth. Our role is to support, not prescribe.",
      icon: "🌱"
    },
    {
      title: "Accessibility",
      description: "Mental wellness support should be available to everyone, regardless of background or ability.",
      icon: "🌍"
    },
    {
      title: "Evidence-Based",
      description: "Our approaches are grounded in research while honoring the art of human connection.",
      icon: "📚"
    },
    {
      title: "Trauma-Informed",
      description: "Every feature is designed with awareness of trauma's impact and commitment to healing.",
      icon: "🕊️"
    },
    {
      title: "Ethical AI",
      description: "We use technology responsibly, with transparency about capabilities and clear boundaries.",
      icon: "🤖"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400" data-testid="link-breadcrumb-home">Home</Link></li>
            <li className="before:content-['/'] before:mx-2 text-gray-900 dark:text-white font-medium">Our Values</li>
          </ol>
        </nav>

        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="heading-values">
            Our Core Values
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do at The Genuine Love Project
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {coreValues.map((value, index) => (
            <div 
              key={value.title}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              data-testid={`card-value-${index}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl" role="img" aria-hidden="true">{value.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-purple-900 dark:text-purple-200 mb-4 text-center">
            Living in Genuine Love
          </h2>
          <p className="text-purple-800 dark:text-purple-300 text-center max-w-2xl mx-auto mb-6">
            Our mission is to help you cultivate a deep, unconditional love for yourself—the foundation 
            for all healthy relationships and emotional well-being. When you live in genuine love, 
            you approach life with compassion, resilience, and authentic connection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/about/approach"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              data-testid="link-approach"
            >
              Our Approach
            </Link>
            <Link 
              href="/features"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-300 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 font-medium rounded-lg transition-colors"
              data-testid="link-features"
            >
              Explore Features
            </Link>
          </div>
        </section>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 text-center">
          <p className="text-amber-800 dark:text-amber-200">
            <strong>Remember:</strong> The Genuine Love Project is an educational wellness platform. 
            If you're in crisis, please reach out to professional support.
          </p>
          <Link 
            href="/crisis"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 mt-4 text-amber-700 dark:text-amber-300 underline hover:no-underline"
            data-testid="link-crisis"
          >
            View Crisis Resources →
          </Link>
        </div>
      </div>
      <SafetyFooter />
    </div>
  );
}
