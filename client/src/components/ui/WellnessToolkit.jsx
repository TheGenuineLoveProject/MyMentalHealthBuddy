import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';
import { wellnessTools } from './wellnessToolsData';

const ToolkitSection = styled.section`
  padding: ${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal};
  background: ${theme.colors.softWhite};
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h2};
  color: ${theme.colors.charcoal};
  margin-bottom: 2rem;
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 2rem;
  max-width: ${theme.spacing.maxWidth};
  margin: 0 auto;
`;

const ToolCard = styled.div`
  background: ${theme.colors.sageGreen};
  padding: 1rem;
  border-radius: 16px;
  box-shadow: ${theme.shadows.goldGlow};
  transition: transform 0.3s, box-shadow 0.3s;
  color: ${theme.colors.softWhite};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
  }
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
`;

const Label = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.body};
`;

function WellnessToolkit() {
  return (
    <ToolkitSection>
      <Title>Your Complete Wellness Toolkit</Title>
      <ToolGrid>
        {wellnessTools.map((tool, i) => (
          <ToolCard key={i}>
            <Icon src={tool.icon} alt={tool.name} />
            <Label>{tool.name}</Label>
          </ToolCard>
        ))}
      </ToolGrid>
    </ToolkitSection>
  );
}

export default WellnessToolkit;import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';
import { wellnessTools } from './wellnessToolsData';

const ToolkitSection = styled.section`
  padding: ${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal};
  background: ${theme.colors.softWhite};
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h2};
  color: ${theme.colors.charcoal};
  margin-bottom: 2rem;
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 2rem;
  max-width: ${theme.spacing.maxWidth};
  margin: 0 auto;
`;

const ToolCard = styled.div`
  background: ${theme.colors.sageGreen};
  padding: 1rem;
  border-radius: 16px;
  box-shadow: ${theme.shadows.goldGlow};
  transition: transform 0.3s, box-shadow 0.3s;
  color: ${theme.colors.softWhite};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
  }
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
`;

const Label = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.body};
`;

function WellnessToolkit() {
  return (
    <ToolkitSection>
      <Title>Your Complete Wellness Toolkit</Title>
      <ToolGrid>
        {wellnessTools.map((tool, i) => (
          <ToolCard key={i}>
            <Icon src={tool.icon} alt={tool.name} />
            <Label>{tool.name}</Label>
          </ToolCard>
        ))}
      </ToolGrid>
    </ToolkitSection>
  );
}

export default WellnessToolkit;