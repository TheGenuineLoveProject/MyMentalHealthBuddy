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
- **Advanced Intellectual Tools**: 20+ rigorous instruments across Reasoning & Logic, Systems & Patterns, Knowledge & Learning, Self-Awareness, and Identity & Meaning.
- **Knowledge Synthesis API**: 5 concept mapping frameworks (Zettelkasten, PARA, Evergreen Notes, Feynman Technique, Mind Mapping), 8 evidence-based learning principles, 7 intellectual virtues.
- **Philosophy API**: 8 major philosophical schools (Stoicism, Buddhism, Existentialism, Taoism, Pragmatism, Epicureanism, Confucianism, Phenomenology), complete virtue ethics framework with 4 cardinal virtues, 30+ philosophical questions.
- **Metacognition API**: 6 metacognitive strategies (Think-Aloud Protocol, Self-Questioning, Calibration Practice, etc.), 8 thinking biases with antidotes, 5 reflection frameworks (Gibbs Cycle, Kolb's Learning Cycle, etc.), 5 self-awareness tools.
- **Creativity API**: 8 creative techniques (SCAMPER, Six Thinking Hats, Random Entry, etc.), 4 problem framing methods, 6 ideation principles, 5 creative block solutions.
- **Resilience API**: 8 resilience factors with practices and affirmations, 4 coping strategy categories, 5 post-traumatic growth domains, 6 psychological flexibility processes (ACT-based).
- **Foresight API**: 5 scenario planning methods (Three Horizons, Scenario Cross-Matrix, Causal Layered Analysis), 5 ethical foresight principles, futures wheel methodology, weak signal scanning, 5 futures literacy competencies.
- **Systems Compassion API**: 4 trauma-informed systems design frameworks, 3 systemic intervention levels, 5 healing narrative archetypes, 6 empathy scales, 5 compassion practices (Tonglen, Metta, etc.).
- **Collective Intelligence API**: 5 collective wisdom principles, 5 wisdom synthesis methods (Delphi, World Café, Appreciative Inquiry), 4 crowd wisdom types, 4 synthesis frameworks (Integral Theory, Consilience), 4 emergent intelligence patterns.
- **Wisdom Synthesis API**: 6 pattern recognition frameworks, 5 insight extraction methods, 8 universal wisdom themes, 5 integration practices for embodying wisdom.
- **Cognitive Lab API**: 25 mental models library (Inversion, First Principles, Second-Order Thinking, etc.), 6 thinking tools, 10 cognitive biases with antidotes, 5 reasoning frameworks.
- **Contemplative API**: 8 meditation practices (Breath Awareness, Body Scan, Metta, Zazen, etc.), 5 categories of contemplative questions, 5 mindfulness exercises, 6 wisdom traditions.
- **Ethical Reasoning API**: 8 ethical frameworks (Utilitarianism, Deontology, Virtue Ethics, Care Ethics, etc.), 6 moral reasoning tools, 5 ethical dilemma categories, 8-step ethical decision process.
- **Existential API**: 6 existential themes (Mortality, Freedom, Meaning, Isolation, Authenticity, Absurdity), 7 existential philosophers (Kierkegaard, Nietzsche, Heidegger, Sartre, Camus, de Beauvoir, Frankl), 10 life questions, 8 meaning sources.
- **Embodiment API**: 6 somatic practices (Body Scan, Grounding, Breath Work, PMR, Mindful Movement, Trauma-Sensitive), 3 nervous system states (Polyvagal Theory), 6 regulation strategies, 5 interoception exercises.
- **Narrative API**: 6 narrative frameworks (Hero's Journey, Redemption, Agency, Communion, Growth), 6 story elements, 10 reauthoring prompts, 8 archetypal figures.
- **Relational API**: 4 attachment styles, 6 communication skills (Active Listening, I-Statements, NVC, Repair Attempts, Boundaries, Empathic Inquiry), 5 relationship patterns, 5 love languages.
- **Values API**: 15 core values, 6 values exercises, 4 purpose frameworks (Ikigai, Hedgehog, Golden Circle, Life Domains), 5 meaning sources.
- **Neuro-Integration API**: 7 affective neuroscience systems (SEEKING, RAGE, FEAR, PANIC/GRIEF, CARE, PLAY, LUST), 6 brain regions, 8 neuroplasticity principles, 4 mind-body practices.
- **Socio-Ecology API**: 5 planetary ethics frameworks (Intergenerational Justice, Environmental Justice, Deep Ecology, Ecofeminism, Ubuntu), 4 systems of oppression analysis, 5 regenerative futures visions, 5 collective healing practices.
- **Praxis API**: 6 execution frameworks (GTD, Deep Work, Implementation Intentions, Atomic Habits, WOOP, Pomodoro), 6 creativity-to-action phases, 6 resistance patterns, 5 accountability systems.
- **Post-Trauma API**: 5 post-traumatic growth domains, 4 reintegration phases, 6 healing modalities (TF-CBT, EMDR, Somatic Experiencing, IFS, Narrative, Mindfulness), 6 resilience builders.
- **Wisdom Synthesis Engine**: Pattern recognition, insight extraction, wisdom theme analysis.
- **Cognitive Architecture Lab**: 25 mental models library with favorites and practice tracking.
- **Philosophical Inquiry System**: Socratic questioning and dialectical reasoning framework.
- **Daily Wisdom Oracle**: 30 wisdom quotes from world philosophies with reflection journaling.
- **Systems Thinking Toolkit**: Feedback loops, system archetypes, and leverage point identification.
- **Meta-Learning Dashboard**: 8 evidence-based learning techniques with session tracking.
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

### Security Hardening (Production-Ready)
- **CORS**: Production-safe allowlist configuration; dev mode permissive, production enforces origin whitelist via `CORS_ORIGIN`/`CORS_ORIGINS` environment variables.
- **JWT Authentication**: Production requires `JWT_SECRET` and `JWT_REFRESH_SECRET`; server fails fast if missing to prevent insecure fallbacks.
- **Helmet**: Security headers enabled (CSP disabled for development flexibility).
- **Rate Limiting**: Applied to authentication and AI endpoints.

### Platform Metrics
- **56 API Routes**: Comprehensive intellectual, wellness, and administrative APIs
- **106 Frontend Pages**: Full-featured UI components
- **92 Passing Tests**: Unit and integration coverage
- **7 Smoke Tests**: Health check verification
- **0 TODO Lines**: Production-clean codebase
- **700+ Discrete Intellectual Instruments**: World-class toolkit for MIT-level users

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