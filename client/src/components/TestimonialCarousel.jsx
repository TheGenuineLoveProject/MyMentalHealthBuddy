import { useState, useEffect } from 'react';

const testimonials = [
  { quote: "This platform changed my life. I feel safe, seen, and supported.", name: "Amara, Artist" },
  { quote: "The tools helped me reconnect with my inner peace.", name: "Kai, Therapist" },
  { quote: "Every pixel feels like a prayer. Beautiful and effective.", name: "Elena, Educator" },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const { quote, name } = testimonials[index];

  return (
    <section 
      id="testimonials" 
      className="bg-[#8fbf9f] text-white text-center py-16 px-8"
    >
      <div className="max-w-3xl mx-auto">
        <blockquote className="text-xl md:text-2xl leading-relaxed mb-4 opacity-95">
          "{quote}"
        </blockquote>
        <p className="text-amber-300 font-serif text-lg">
          — {name}
        </p>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === index ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`View testimonial ${idx + 1}`}
              data-testid={`testimonial-dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
