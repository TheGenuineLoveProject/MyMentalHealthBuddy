/**
 * SEO Head Component
 * Comprehensive meta tags for search engines and social media
 */

import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const siteName = 'MyMentalHealthBuddy';
  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = url || `${window.location.origin}${window.location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, type: 'name' | 'property' = 'name') => {
      let meta = document.querySelector(`meta[${type}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(type, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }
    if (author) {
      updateMetaTag('author', author);
    }

    // Open Graph / Facebook
    updateMetaTag('og:title', fullTitle, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', imageUrl, 'property');
    updateMetaTag('og:url', canonicalUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', siteName, 'property');
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, 'property');
    }
    if (modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, 'property');
    }

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [fullTitle, description, keywords, imageUrl, canonicalUrl, type, author, publishedTime, modifiedTime]);

  return null;
}

/**
 * Predefined SEO configurations for common pages
 */
export const seoConfig = {
  dashboard: {
    title: 'Dashboard',
    description: 'Track your mental health journey with personalized insights, mood trends, and AI-powered support. Your safe space for emotional wellness.',
    keywords: ['mental health dashboard', 'mood tracking', 'wellness insights', 'mental health app'],
  },
  chat: {
    title: 'AI Chat Support',
    description: 'Get compassionate AI-powered mental health support 24/7. Safe, confidential conversations to help you through difficult moments.',
    keywords: ['AI therapy', 'mental health chat', 'emotional support', 'AI counseling'],
  },
  mood: {
    title: 'Mood Tracker',
    description: 'Log and analyze your moods with intelligent tracking. Discover patterns, triggers, and insights to improve your emotional well-being.',
    keywords: ['mood tracker', 'emotion tracking', 'mood analysis', 'mental health tracking'],
  },
  journal: {
    title: 'Private Journal',
    description: 'Express your thoughts in a secure, private journal. Reflect on your feelings and track your mental health progress over time.',
    keywords: ['mental health journal', 'private diary', 'journaling app', 'emotional journaling'],
  },
  crisis: {
    title: 'Crisis Resources',
    description: 'Immediate access to crisis helplines and emergency mental health support. Free, confidential help available 24/7 worldwide.',
    keywords: ['crisis helpline', 'suicide prevention', 'mental health emergency', 'crisis support'],
  },
  resources: {
    title: 'Mental Health Resources',
    description: 'Curated articles, videos, exercises, and expert guidance for managing anxiety, depression, stress, and other mental health challenges.',
    keywords: ['mental health resources', 'coping strategies', 'self-help', 'mental wellness'],
  },
  studio: {
    title: 'Content Studio',
    description: 'Professional content creation and management tools for mental health advocates. Create, schedule, and publish with AI assistance.',
    keywords: ['content studio', 'content creation', 'mental health content', 'AI writing'],
  },
  social: {
    title: 'Social Calendar',
    description: 'Schedule and manage social media posts across platforms. Amplify your mental health advocacy with intelligent scheduling.',
    keywords: ['social media scheduler', 'content calendar', 'social media management'],
  },
  analytics: {
    title: 'Analytics Dashboard',
    description: 'Comprehensive performance insights and engagement metrics. Understand your audience and optimize your mental health content strategy.',
    keywords: ['analytics', 'performance metrics', 'engagement tracking', 'content analytics'],
  },
  productivity: {
    title: 'Productivity Hub',
    description: 'Advanced tools for bulk operations, AI content generation, automation, and data export. Streamline your mental health content workflow.',
    keywords: ['productivity tools', 'automation', 'bulk operations', 'workflow optimization'],
  },
};
