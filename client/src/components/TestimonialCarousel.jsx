import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from './theme';

const Carousel = styled.section`
  background: ${theme.colors.sageGreen};
  color: ${theme.colors.softWhite};
  text-align: center;
  padding: ${theme.spacing.sectionVertical} ${theme.spacing.sectionHorizontal};
`;

const Quote = styled.blockquote`
  font-family: ${theme.fonts.body};
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 1rem;
  opacity: 0.9;
`;

const Name = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  color: ${theme.colors.metallicGoldBase};
`;

const testimonials = [
  { quote: "This platform changed my life. I feel safe, seen, and supported.", name: "Amara, Artist" },
  { quote: "The tools helped me reconnect with my inner peace.", name: "Kai, Therapist" },
  { quote: "Every pixel feels like a prayer. Beautiful and effective.", name: "Elena, Educator" },
];

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const { quote, name } = testimonials[index];

  return (
    <Carousel>
      <Quote>“{quote}”</Quote>
      <Name>— {name}</Name>
    </Carousel>
  );
}

export default TestimonialCarousel;