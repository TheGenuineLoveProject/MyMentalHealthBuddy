import React from 'react';
import HeroSection from './HeroSection';
import WellnessToolkit from './WellnessToolkit';
import Footer from './Footer';
import SacredBackground from './SacredBackground';

function LandingPage() {
  return (
    <>
      <SacredBackground />
      <HeroSection />
      <WellnessToolkit />
      <Footer />
    </>
  );
}

export default LandingPage;