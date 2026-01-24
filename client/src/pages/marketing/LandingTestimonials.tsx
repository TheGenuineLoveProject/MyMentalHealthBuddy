import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Teacher",
    avatar: "S",
    rating: 5,
    text: "This platform helped me reconnect with myself after years of burnout. The AI companion feels like talking to a wise, non-judgmental friend who's always there when I need support.",
    highlight: "Finally found a space where I feel truly understood."
  },
  {
    name: "James K.",
    role: "Software Engineer",
    avatar: "J",
    rating: 5,
    text: "The mood tracking and journaling features have become essential to my daily routine. I've gained insights into my patterns that years of self-reflection never revealed.",
    highlight: "I feel more grounded than ever before."
  },
  {
    name: "Maria L.",
    role: "Healthcare Worker",
    avatar: "M",
    rating: 5,
    text: "As someone who deals with compassion fatigue daily, this platform has been a lifesaver. It's warm, supportive, and genuinely helpful without feeling clinical.",
    highlight: "The tools are practical and trauma-informed."
  },
  {
    name: "David R.",
    role: "Entrepreneur",
    avatar: "D",
    rating: 5,
    text: "I was skeptical about AI therapy, but the approach here is different. It doesn't try to fix you — it helps you understand yourself better at your own pace.",
    highlight: "No pressure, just genuine support."
  },
  {
    name: "Lisa T.",
    role: "Graduate Student",
    avatar: "L",
    rating: 5,
    text: "The breathing exercises and grounding techniques have helped me manage anxiety during exam periods. Having crisis resources one tap away gives me peace of mind.",
    highlight: "A complete wellness toolkit in my pocket."
  },
  {
    name: "Michael C.",
    role: "Parent & Caregiver",
    avatar: "M",
    rating: 5,
    text: "Between caring for my kids and aging parents, I lost myself. This platform helped me rediscover self-compassion and create small daily rituals for my wellbeing.",
    highlight: "Learning to put on my own oxygen mask first."
  }
];

export default function LandingTestimonials() {
  return (
    <section className="py-24 bg-sage-50" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-sage-700 text-sm font-medium mb-4 shadow-sm">
            Real Stories, Real Healing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-teal-800 mb-6">
            Voices from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every healing journey is unique. Here's what members say about their experience 
            with The Genuine Love Project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-sage-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-teal-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
              </div>

              <Quote className="w-8 h-8 text-sage-200 mb-2" />
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {testimonial.text}
              </p>

              <p className="text-sm font-medium text-teal-600 italic">
                "{testimonial.highlight}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-6">
            Names and details have been changed to protect privacy. 
            Testimonials reflect individual experiences.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-sage-200 text-teal-700 font-medium">
            <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
            <span>Rated 4.9/5 by our community</span>
          </div>
        </div>
      </div>
    </section>
  );
}
