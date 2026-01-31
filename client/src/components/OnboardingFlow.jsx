import styled from 'styled-components';
import { theme } from './theme';
import React, { useState } from 'react';
import './OnboardingFlow.css';

const steps = [
  { title: "Welcome", message: "Welcome to The Genuine Love Project 💗" },
  { title: "Your Intention", message: "What’s your intention for healing today?" },
  { title: "Personalization", message: "We’ll personalize your experience with love." },
  { title: "Begin", message: "You're ready to begin your healing journey 🌸" }
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);

  const next = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="onboarding-container bg-gradient-to-br from-[#8fbf9f] to-[#2f5d5d] text-white p-10 rounded-xl shadow-xl max-w-xl mx-auto">
      <h2 className="text-3xl font-serif mb-4">{steps[step].title}</h2>
      <p className="text-lg mb-6">{steps[step].message}</p>
      <div className="flex gap-4">
        {step > 0 && <button onClick={back} className="btn-glow">Back</button>}
        {step < steps.length - 1 ? (
          <button onClick={next} className="btn-glow">Next</button>
        ) : (
          <button className="btn-glow">Finish</button>
        )}
      </div>
    </div>
  );
}
const Section = styled.section`
  padding: ${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal};
  background: ${theme.colors.dustyRose};
  color: ${theme.colors.charcoal};
  text-align: center;
`;

const StepGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const Step = styled.div`
  flex: 1 1 200px;
  background: ${theme.colors.softWhite};
  border-radius: ${theme.radii.soft};
  padding: 2rem;
  box-shadow: ${theme.shadows.goldGlow};
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  font-size: 2rem;
  font-family: ${theme.fonts.heading};
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h3};
`;

const StepDesc = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.body};
`;

const OnboardingFlow = () => (
  <Section>
    <h2>How It Works</h2>
    <StepGrid>
      <Step>
        <StepNumber>1</StepNumber>
        <StepTitle>Create Your Healing Space</StepTitle>
        <StepDesc>Customize your dashboard with tools, affirmations, and intentions.</StepDesc>
      </Step>
      <Step>
        <StepNumber>2</StepNumber>
        <StepTitle>Use Your Toolkit</StepTitle>
        <StepDesc>Track moods, journal, meditate, and chat with your AI guide daily.</StepDesc>
      </Step>
      <Step>
        <StepNumber>3</StepNumber>
        <StepTitle>Thrive With Support</StepTitle>
        <StepDesc>Join sacred community check-ins and monthly healing events.</StepDesc>
      </Step>
    </StepGrid>
  </Section>
);

export default OnboardingFlow;