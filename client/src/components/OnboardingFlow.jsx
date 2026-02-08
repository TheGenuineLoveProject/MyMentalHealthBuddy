import { useState } from 'react';
import { Link } from 'wouter';

const steps = [
  { title: "Welcome", message: "Welcome to The Genuine Love Project 💗" },
  { title: "Your Intention", message: "What's your intention for healing today?" },
  { title: "Personalization", message: "We'll personalize your experience with love." },
  { title: "Begin", message: "You're ready to begin your healing journey 🌸" }
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);

  const next = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep(prev => Math.max(prev - 1, 0));

  const isLastStep = step === steps.length - 1;

  return (
    <section id="onboarding" className="py-16">
      <div className="max-w-xl mx-auto">
        <div className="bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d] text-white p-10 rounded-xl shadow-xl">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    idx <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-white/70">Step {step + 1} of {steps.length}</p>
          </div>
          
          <h2 className="text-3xl font-serif mb-4">{steps[step].title}</h2>
          <p className="text-lg mb-8">{steps[step].message}</p>
          
          <div className="flex gap-4">
            {step > 0 && (
              <button 
                onClick={back} 
                className="px-6 py-2.5 rounded-lg border border-white/50 text-white hover:bg-white/10 transition-colors"
                data-testid="btn-onboarding-back"
              >
                Back
              </button>
            )}
            {!isLastStep ? (
              <button 
                onClick={next} 
                className="px-6 py-2.5 rounded-lg bg-white text-[#2f5d5d] font-medium hover:bg-white/90 transition-colors"
                data-testid="btn-onboarding-next"
              >
                Next
              </button>
            ) : (
              <a 
                href="/api/login"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium hover:opacity-90 transition-opacity inline-block"
                data-testid="btn-onboarding-finish"
              >
                Create Your Account
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl mb-3">1</div>
            <h3 className="font-serif text-lg font-semibold text-[#2f5d5d] mb-2">Create Your Space</h3>
            <p className="text-sm text-gray-600">Customize your dashboard with tools and intentions.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl mb-3">2</div>
            <h3 className="font-serif text-lg font-semibold text-[#2f5d5d] mb-2">Use Your Toolkit</h3>
            <p className="text-sm text-gray-600">Track moods, journal, and chat with your AI guide.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl mb-3">3</div>
            <h3 className="font-serif text-lg font-semibold text-[#2f5d5d] mb-2">Thrive With Support</h3>
            <p className="text-sm text-gray-600">Join community check-ins and healing events.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
