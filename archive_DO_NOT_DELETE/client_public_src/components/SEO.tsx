import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export function SEO({
  title = "MyMentalHealthBuddy - AI-Powered Mental Health Support",
  description = "Access AI-powered therapy chat, mood tracking, journaling, and mental health resources. Professional mental wellness support available 24/7 with personalized insights and crisis resources.",
  keywords = "mental health, AI therapy, mood tracking, journaling, crisis support, mental wellness, anxiety help, depression support, mindfulness",
  ogImage = "/og-image.png",
  ogType = "website"
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'MyMentalHealthBuddy');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'MyMentalHealthBuddy', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Additional SEO
    updateMetaTag('application-name', 'MyMentalHealthBuddy');
    updateMetaTag('theme-color', '#6366f1');
    
  }, [title, description, keywords, ogImage, ogType]);

  return null;
}

// Predefined SEO configurations for each page
export const SEOConfigs = {
  home: {
    title: "MyMentalHealthBuddy - AI Mental Health Support Platform",
    description: "Transform your mental wellness journey with AI-powered therapy chat, advanced mood analytics, private journaling, and 24/7 crisis support. Start your free trial today.",
    keywords: "mental health platform, AI therapy, mood tracking app, mental wellness, digital therapy, anxiety support, depression help"
  },
  chat: {
    title: "AI Therapy Chat - MyMentalHealthBuddy",
    description: "Experience compassionate AI-powered therapy conversations anytime, anywhere. Get personalized mental health support tailored to your needs.",
    keywords: "AI therapy chat, online therapy, mental health chatbot, anxiety chat, depression support, virtual therapist"
  },
  mood: {
    title: "Mood Tracking & Analytics - MyMentalHealthBuddy",
    description: "Track your emotional well-being with advanced mood analytics. Identify patterns, triggers, and gain insights into your mental health journey.",
    keywords: "mood tracker, emotional health, mood analytics, mental health tracking, emotional patterns, mood diary"
  },
  journal: {
    title: "Private Journaling - MyMentalHealthBuddy",
    description: "Express your thoughts in a secure, private digital journal. Reflect, process emotions, and track your personal growth journey.",
    keywords: "mental health journal, private diary, emotional journaling, self-reflection, mindfulness journal"
  },
  resources: {
    title: "Mental Health Resources - MyMentalHealthBuddy",
    description: "Access curated mental health resources, articles, and tools to support your wellness journey. Evidence-based content for mental well-being.",
    keywords: "mental health resources, wellness guides, self-help tools, mental health articles, coping strategies"
  },
  crisis: {
    title: "Crisis Support - MyMentalHealthBuddy",
    description: "Access immediate crisis support and emergency mental health resources. Available 24/7 when you need help most.",
    keywords: "crisis support, mental health emergency, suicide prevention, crisis hotline, immediate help"
  },
  billing: {
    title: "Subscription Plans - MyMentalHealthBuddy",
    description: "Choose the perfect plan for your mental wellness journey. Free, Premium, and Professional tiers with flexible billing options.",
    keywords: "mental health subscription, therapy pricing, premium features, mental wellness plans"
  },
  designs: {
    title: "Design Studio - MyMentalHealthBuddy",
    description: "Create beautiful visual content with Canva integration. Design social media posts, mood boards, and inspirational quotes.",
    keywords: "mental health design, social media content, mood visualization, inspirational quotes, wellness graphics"
  }
};
