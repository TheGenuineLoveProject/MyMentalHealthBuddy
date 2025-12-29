# The Genuine Love Project

## Overview
The Genuine Love Project is an AI-powered mental wellness platform dedicated to fostering self-love, healing, and emotional growth. It provides a private, compassionate, and 24/7 accessible environment through AI-assisted emotional guidance, mood tracking, journaling, crisis support, and evidence-based healing tools. The platform aims to offer a comprehensive wellness toolkit, with advanced features available via subscription. Our vision is to empower users to "Live in Genuine Love" by integrating cutting-edge AI with trauma-informed psychological principles to support mental well-being.

## User Preferences
- Preferred communication style: Simple, everyday language
- Engineering standards: A→Z 360° complete solutions
- Mental health approach: Trauma-informed, supportive, non-clinical language
- UX philosophy: Gentle, compassionate, accessible

## System Architecture

### UI/UX Decisions
The frontend employs a premium, Canva-inspired visual design with HSL color formatting, custom typography, enhanced gradients, and refined shadows. It supports full light/dark themes, micro-interactions, and comprehensive accessibility features including ARIA, semantic HTML, keyboard navigation, visible focus rings, and proper touch targets. Responsive typography and safe area insets ensure mobile adaptability, while `prefers-reduced-motion` and high contrast mode support diverse user needs.

### Technical Implementations
The project uses a monorepo structure with separate client and server applications. The frontend is a React 18 SPA with TypeScript, built with Vite, Wouter for routing, React Hook Form with Zod for validation, and Tailwind CSS with Lucide React for styling. The backend is a Node.js and Express application with TypeScript, providing a RESTful API. It uses middleware for CORS, security headers (Helmet), compression, logging (Morgan), and session management (Express Session). Shared types ensure consistency across the monorepo, and all modules are ESM.

### Feature Specifications
The platform offers:
- **AI-powered Chat Therapy**: Integrated with OpenAI API, providing trauma-informed responses and crisis intervention awareness.
- **State Tracker**: A 6-dimension neutral observation system (energy, clarity, openness, regulation, presence, pace).
- **Today's Insight**: 14 rotating philosophical insights grounded in psychology/systems thinking.
- **Journal Prompts**: 24 intelligent prompts across 4 categories (Awareness, Agency, Relationships, Meaning).
- **Comprehensive Wellness Toolkit**: Over 54 tools across various categories including Reflection, Wisdom, Advanced Intellectual Tools, and Mastery.
- **Reflection Tools**: Privacy-focused tools like Belief Mapping, Timed Writing, Silence Mode, Question Reflection, Growth Timeline, and Data Export.
- **Wisdom Tools**: Advanced intellectual tools such as Cognitive Frameworks Library, Dialectical Inquiry, Temporal Reflection, and Daily Wisdom.
- **Advanced Intellectual Tools**: 20 rigorous instruments across Reasoning & Logic, Systems & Patterns, Knowledge & Learning, Self-Awareness, and Identity & Meaning.
- **Mastery Tools**: 3 instruments for deep work and deliberate practice: Deep Work Tracker, Skill Forge, and Mental Models Library.
- **Navigation & Discovery**: Intellectual Atlas (central hub for tools), Strategy Maps (curated learning pathways), Collaborative Intelligence Lab (anonymous community reflection), Resilience Metrics (6-dimension growth tracking), and Adaptive Companion (AI-guided recommendations).
- **Knowledge Synthesis**: Concept Mapper for building personal knowledge bases, Learning Journal for capturing key takeaways, and Insight Extractor for synthesizing wisdom from sources.
- **Wisdom Practices**: Daily Contemplation prompts, Gratitude Practice with synthesis, and Meditation Timer with reflection journaling.
- **Growth Analytics**: Visual progress tracking across all tool categories with milestones and achievement system.
- **Security**: Rate limiting, CSP, input sanitization, CSRF protection, and account lifecycle management.
- **Gamification**: XP, levels, streaks, and daily quests.
- **Crisis Detection**: AI routes scan for self-harm intent keywords and provide crisis resources.
- **Trauma-Informed NLP Layer**: Ensures all user-facing text, crisis detection, and prompts are gentle and supportive.

### System Design Choices
The application is optimized for production with code splitting and environment variable configuration. It includes health checks, rate limiting, and graceful shutdown handlers. A unified `shared/schema.mjs` defines Drizzle ORM models, matching the Neon PostgreSQL database with UUIDs, TEXT-based IDs, serial integers, and indexed foreign key constraints.

## External Dependencies

- **OpenAI API**: AI chat therapy.
- **Vite**: Frontend build tool.
- **TypeScript**: Language.
- **React**: Frontend UI library.
- **Wouter**: Client-side routing.
- **React Hook Form**: Form management.
- **Zod**: Runtime type validation.
- **Tailwind CSS**: Styling framework.
- **Lucide React**: Icons.
- **Node.js**: Backend runtime.
- **Express**: Backend web framework.
- **Express Session**: Session management.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **Helmet**: Security headers middleware.
- **Compression**: Response compression middleware.
- **Morgan**: HTTP request logger middleware.
- **Sentry**: Error tracking and performance monitoring.
- **Drizzle ORM**: Database interactions.
- **Neon PostgreSQL**: Primary database.
- **Stripe**: Billing and payment processing.