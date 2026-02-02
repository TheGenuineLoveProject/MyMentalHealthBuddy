import React from 'react';
import SacredNav from '../sacred/SacredNav';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="bg-softWhite min-h-screen">
      <SacredNav />
      <HeroSection />
      <Footer />
    </div>
  );
}