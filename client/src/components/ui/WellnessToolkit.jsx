import { theme } from './theme';
import { wellnessTools } from './wellnessToolsData';

const ToolkitSection = ({ children }) => (
  <section
    className="text-center"
    style={{
      padding: `${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal}`,
      background: theme.colors.softWhite,
    }}
  >
    {children}
  </section>
);

const Title = ({ children }) => (
  <h2
    className="mb-8"
    style={{
      fontFamily: theme.fonts.heading,
      fontSize: theme.fontSizes.h2,
      color: theme.colors.charcoal,
    }}
  >
    {children}
  </h2>
);

const ToolGrid = ({ children }) => (
  <div
    className="grid gap-8"
    style={{
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      maxWidth: theme.spacing.maxWidth,
      margin: '0 auto',
    }}
  >
    {children}
  </div>
);

const ToolCard = ({ children }) => (
  <div
    className="p-4 rounded-2xl transition-transform hover:scale-105"
    style={{
      background: theme.colors.sageGreen,
      boxShadow: theme.shadows.goldGlow,
      color: theme.colors.softWhite,
    }}
  >
    {children}
  </div>
);

const Icon = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="mb-3"
    style={{ width: 48, height: 48 }}
    onError={(e) => {
      e.target.style.display = 'none';
    }}
  />
);

const Label = ({ children }) => (
  <p
    style={{
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.body,
    }}
  >
    {children}
  </p>
);

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
