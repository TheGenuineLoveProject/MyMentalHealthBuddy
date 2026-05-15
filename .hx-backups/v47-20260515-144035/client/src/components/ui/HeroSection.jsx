import { theme } from './theme';

const HeroWrapper = ({ children }) => (
  <section
    className="text-center mx-auto"
    style={{
      background: theme.colors.sageGreen,
      padding: `${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal}`,
      maxWidth: theme.spacing.maxWidth,
    }}
  >
    {children}
  </section>
);

const HeroHeading = ({ children }) => (
  <h1
    style={{
      fontFamily: theme.fonts.heading,
      fontSize: theme.fontSizes.h1,
      color: theme.colors.charcoal,
    }}
  >
    {children}
  </h1>
);

const HeroSubheading = ({ children }) => (
  <h2
    className="mb-6"
    style={{
      fontFamily: theme.fonts.heading,
      fontSize: theme.fontSizes.h2,
      background: theme.colors.metallicGoldGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    {children}
  </h2>
);

const HeroText = ({ children }) => (
  <p
    className="mb-8 mx-auto"
    style={{
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.body,
      color: theme.colors.charcoal,
      maxWidth: 700,
    }}
  >
    {children}
  </p>
);

const CTAButton = ({ href, children, testId }) => (
  <a
    href={href}
    className="inline-block transition-transform hover:scale-105"
    data-testid={testId}
    style={{
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSizes.button,
      padding: '1rem 2rem',
      background: theme.colors.metallicGoldGradient,
      color: theme.colors.softWhite,
      border: 'none',
      borderRadius: theme.radii.pill,
      boxShadow: theme.shadows.goldGlow,
      cursor: 'pointer',
      textDecoration: 'none',
    }}
  >
    {children}
  </a>
);

function HeroSection() {
  return (
    <HeroWrapper>
      <HeroHeading>A Private Space for</HeroHeading>
      <HeroSubheading>Honest Reflection</HeroSubheading>
      <HeroText>
        Mood tracking, journaling, and AI reflection tools — private by design, free to start.
      </HeroText>
      <CTAButton href="/login" testId="link-register-cta">Try It Free →</CTAButton>
    </HeroWrapper>
  );
}

export default HeroSection;
export { HeroSection };
