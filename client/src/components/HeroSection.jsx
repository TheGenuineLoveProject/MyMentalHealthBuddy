import React from 'react';
import HeroSection from './HeroSection';
import WellnessToolkit from './WellnessToolkit';
import Footer from './Footer';
import SacredBackground from './SacredBackground';
import styled from 'styled-components';
import { theme } from './theme';

export default function HeroSection() {
  return (
    <section className="text-center py-20 relative z-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-deepTeal leading-tight">
          Begin Your Healing <br />
          <span className="text-[length:theme(colors.metallicGold.light)]">Journey Today</span>
        </h1>
        <p className="mt-6 text-lg text-charcoal font-sans">
          Join thousands who have found peace, growth, and genuine love within themselves.
        </p>
        <div className="mt-8 space-x-4">
          <button className="px-6 py-3 bg-gradient-to-r from-metallicGold to-metallicGold-light text-white font-semibold rounded-sacred shadow-glow hover:scale-105 transition">
            Start Free Today →
          </button>
          <button className="px-6 py-3 border border-metallicGold text-metallicGold font-semibold rounded-sacred hover:bg-softWhite transition">
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
}
const HeroWrapper = styled.section`
  background: ${theme.colors.sageGreen};
  padding: ${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal};
  text-align: center;
  max-width: ${theme.spacing.maxWidth};
  margin: 0 auto;
`;

const HeroHeading = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h1};
  color: ${theme.colors.charcoal};
`;

const HeroSubheading = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h2};
  background: ${theme.colors.metallicGoldGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const HeroText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.body};
  color: ${theme.colors.charcoal};
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.a`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.button};
  padding: 1rem 2rem;
  background: ${theme.colors.metallicGoldGradient};
  color: ${theme.colors.softWhite};
  border: none;
  border-radius: ${theme.radii.pill};
  box-shadow: ${theme.shadows.goldGlow};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
  }
`;

function HeroSection() {
  return (
    <HeroWrapper>
      <HeroHeading>Begin Your Healing</HeroHeading>
      <HeroSubheading>Journey Today</HeroSubheading>
      <HeroText>
        Join thousands who have found peace, growth, and genuine love within themselves.
      </HeroText>
      <CTAButton href="#start">Begin Your Healing Journey →</CTAButton>
    </HeroWrapper>
  );
}

export default HeroSection;
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