import React from 'react';
import HeroSection from '../components/HeroSection';
import SacredNavBar from '../components/SacredNavBar';
import FloatingLotusGuide from '../components/FloatingLotusGuide';
import TestimonialCarousel from '../components/TestimonialCarousel';
import OnboardingFlow from '../components/OnboardingFlow';
import SacredBackground from '../components/SacredBackground';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden min-h-screen font-sans bg-softWhite text-charcoal">
      <SacredNavBar />
      <SacredBackground />
      <main className="space-y-24 pt-32 pb-16 px-4 sm:px-8 md:px-16">
        <HeroSection />
        <TestimonialCarousel />
        <OnboardingFlow />
      </main>
      <FloatingLotusGuide />
    </div>
  );
}