-- server/db/schema.canonical.sql
-- AUTO-GENERATED canonical schema bootstrap (idempotent, IF NOT EXISTS).
-- Source of truth: shared/schema.mjs (the Drizzle models the app queries).
-- Applied non-blocking at boot by server/db/ensureSchema.mjs so a fresh
-- database / disaster-recovery restore self-heals to the full schema.
-- Statements are separated by drizzle statement breakpoint markers.
--
-- REGENERATE after any shared/schema.mjs change:
--   node scripts/generate-canonical-schema.mjs
-- (wraps: drizzle-kit generate --dialect postgresql --schema ./shared/schema.mjs)
--
CREATE TABLE IF NOT EXISTS "achievements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_decisions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "agent_id" uuid NOT NULL,
        "decision_type" varchar(60) NOT NULL,
        "input_digest" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "reasoning" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "outcome" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "priority_escalated" boolean DEFAULT false NOT NULL,
        "confidence" integer,
        "review_status" varchar(20) DEFAULT 'unreviewed' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_registry" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "agent_key" varchar(80) NOT NULL,
        "agent_role" varchar(120) NOT NULL,
        "division" varchar(40) NOT NULL,
        "persona_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "version" integer DEFAULT 1 NOT NULL,
        "human_supervisor_id" uuid,
        "budget_tokens_daily" integer DEFAULT 0 NOT NULL,
        "kill_switch" boolean DEFAULT false NOT NULL,
        "notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "agent_registry_agent_key_unique" UNIQUE("agent_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_messages" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "session_id" text,
        "role" text NOT NULL,
        "content" text NOT NULL,
        "flow_type" text,
        "is_crisis" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_recommendations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics" (
        "id" integer PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "user_id" uuid,
        "session_id" varchar(64),
        "event_name" varchar(100) NOT NULL,
        "event_category" varchar(50) NOT NULL,
        "path" varchar(500),
        "meta" jsonb,
        "privacy_level" varchar(20) DEFAULT 'minimal' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anonymous_reflections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "content" text NOT NULL,
        "mood" text DEFAULT 'neutral',
        "display_name" text,
        "is_anonymous" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_log" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid,
        "action" varchar(100) NOT NULL,
        "resource_type" varchar(50),
        "resource_id" varchar(255),
        "metadata" text,
        "ip_address" varchar(45),
        "user_agent" varchar(500),
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "awareness_detections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid,
        "content_source" varchar(32) NOT NULL,
        "content_ref" varchar(80),
        "rule_key" varchar(64),
        "tactic" varchar(64),
        "category" varchar(24),
        "severity" varchar(12) DEFAULT 'info' NOT NULL,
        "ensemble_confidence_x100" integer DEFAULT 0 NOT NULL,
        "flagged" boolean DEFAULT false NOT NULL,
        "detector_layer" varchar(16) DEFAULT 'rule' NOT NULL,
        "layers" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "awareness_rules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "rule_key" varchar(64) NOT NULL,
        "tactic" varchar(64) NOT NULL,
        "category" varchar(24) NOT NULL,
        "severity" varchar(12) DEFAULT 'low' NOT NULL,
        "pattern_type" varchar(16) NOT NULL,
        "pattern_source" text NOT NULL,
        "base_confidence_x100" integer NOT NULL,
        "active" boolean DEFAULT true NOT NULL,
        "teaching" text,
        "notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "awareness_rules_rule_key_unique" UNIQUE("rule_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "badges" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "badge_id" varchar(100) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "biometric_connections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "device_source" varchar(32) NOT NULL,
        "status" varchar(16) DEFAULT 'connected' NOT NULL,
        "encrypted_access_token" text,
        "encrypted_refresh_token" text,
        "token_expires_at" timestamp,
        "scopes" text[] DEFAULT '{}' NOT NULL,
        "external_account_id" varchar(128),
        "last_sync_at" timestamp,
        "last_sync_error" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "biometric_readings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "device_source" varchar(32) NOT NULL,
        "metric_type" varchar(48) NOT NULL,
        "value" text NOT NULL,
        "unit" varchar(24) NOT NULL,
        "quality_score" integer DEFAULT 50 NOT NULL,
        "recorded_at" timestamp NOT NULL,
        "ingested_at" timestamp DEFAULT now() NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_comments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "post_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "content" text NOT NULL,
        "parent_id" uuid,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL,
        "content" text NOT NULL,
        "excerpt" text,
        "author_id" uuid NOT NULL,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "content_type" varchar(30) DEFAULT 'blog_post' NOT NULL,
        "visibility" varchar(20) DEFAULT 'public' NOT NULL,
        "published_at" timestamp,
        "reading_time_minutes" integer DEFAULT 1,
        "tags" text,
        "featured_image" text,
        "view_count" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boundary_scripts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "situation" text,
        "boundary_type" varchar(50),
        "script" text,
        "soft_version" text,
        "practice_notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "draft_id" uuid NOT NULL,
        "scheduled_date" timestamp NOT NULL,
        "platform" varchar(50),
        "theme" varchar(100),
        "status" varchar(20) DEFAULT 'scheduled',
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "circle_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coherence_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "alignment_level" integer,
        "body_state" text,
        "mind_state" text,
        "heart_state" text,
        "integration_notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_affirmations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid,
        "content" text NOT NULL,
        "is_anonymous" boolean DEFAULT true NOT NULL,
        "heart_count" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "concepts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text,
        "tags" text,
        "linked_journals" text,
        "linked_insights" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_drafts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid,
        "title" varchar(255) NOT NULL,
        "source_content" text NOT NULL,
        "outputs" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_scores" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "content_source" varchar(32) NOT NULL,
        "content_ref" varchar(80) NOT NULL,
        "user_id" uuid,
        "compassion_index" integer,
        "truth_index" integer,
        "love_index" integer,
        "integration_score" integer,
        "epistemic_score" integer,
        "signals" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "detector_layer" varchar(16) DEFAULT 'rule' NOT NULL,
        "severity" varchar(10) DEFAULT 'info' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_templates" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "type" varchar(50),
        "name" varchar(100),
        "structure" text NOT NULL,
        "voice_rules" text,
        "level" varchar(20),
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_quests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "quest_type" varchar(100) NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "target_count" integer NOT NULL,
        "current_count" integer DEFAULT 0 NOT NULL,
        "xp_reward" integer NOT NULL,
        "is_completed" integer DEFAULT 0 NOT NULL,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_reflections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "content" text NOT NULL,
        "mood" text,
        "gratitude" text,
        "intention" text,
        "shared_to_community" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_rituals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "date" timestamp NOT NULL,
        "state_id" uuid,
        "reflection_id" uuid,
        "prompt_used" text,
        "insight_id" text,
        "completed_steps" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL,
        "description" text,
        "long_description" text,
        "type" varchar(50) NOT NULL,
        "price" integer DEFAULT 0 NOT NULL,
        "cover_image" text,
        "download_url" text,
        "preview_url" text,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "featured" integer DEFAULT 0 NOT NULL,
        "category" varchar(100),
        "tags" text,
        "author_id" uuid NOT NULL,
        "sales_count" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "digital_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discernment_attempts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "lesson_id" uuid NOT NULL,
        "selected_option_id" varchar(32) NOT NULL,
        "correct" boolean NOT NULL,
        "points_earned" integer DEFAULT 0 NOT NULL,
        "time_ms" integer,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discernment_lessons" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "belt" varchar(16) NOT NULL,
        "sequence" integer NOT NULL,
        "title" varchar(160) NOT NULL,
        "category" varchar(24) NOT NULL,
        "scenario" text NOT NULL,
        "options" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "correct_option_id" varchar(32) NOT NULL,
        "awareness_rule_id" varchar(64),
        "teaching" text NOT NULL,
        "learn_more_url" varchar(256),
        "points_award" integer DEFAULT 10 NOT NULL,
        "active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discernment_user_progress" (
        "user_id" uuid PRIMARY KEY NOT NULL,
        "current_belt" varchar(16) DEFAULT 'WHITE' NOT NULL,
        "points_total" integer DEFAULT 0 NOT NULL,
        "lessons_passed" integer DEFAULT 0 NOT NULL,
        "real_world_detections" integer DEFAULT 0 NOT NULL,
        "last_advanced_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gratitude_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "prompt" text NOT NULL,
        "response" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "healing_journeys" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "sender_id" uuid NOT NULL,
        "email" varchar(255) NOT NULL,
        "status" varchar(50) DEFAULT 'pending',
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "title" varchar(255) NOT NULL,
        "text" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journey_steps" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" varchar(255) NOT NULL,
        "consent" boolean DEFAULT false NOT NULL,
        "interests" text,
        "source" varchar(100),
        "utm_source" varchar(255),
        "utm_medium" varchar(255),
        "utm_campaign" varchar(255),
        "utm_content" varchar(255),
        "utm_term" varchar(255),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moods" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "rating" varchar(50) NOT NULL,
        "content" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "score" integer,
        "note" text,
        "emotion" varchar(100),
        "energy_level" integer,
        "sleep_quality" integer,
        "activities" text,
        "triggers" text,
        "weather" varchar(50),
        "location" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movement_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "movement_type" varchar(50),
        "duration_seconds" integer,
        "energy_before" integer,
        "energy_after" integer,
        "notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "narrative_drafts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "post_id" varchar(20) NOT NULL,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "edited_caption" text,
        "notes" text,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "narrative_drafts_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nervous_system_states" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "state" varchar(24) NOT NULL,
        "confidence" integer DEFAULT 0 NOT NULL,
        "drivers" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "window_start" timestamp NOT NULL,
        "window_end" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" varchar(255) NOT NULL,
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "source_path" varchar(500),
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outcome_measures" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "session_id" uuid,
        "measure_code" varchar(32) NOT NULL,
        "score" integer NOT NULL,
        "subscores" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "severity" varchar(16) DEFAULT 'info' NOT NULL,
        "flag_items" text[] DEFAULT '{}' NOT NULL,
        "recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "token_hash" varchar(64) NOT NULL,
        "expires_at" timestamp NOT NULL,
        "used_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_drafts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "platform" varchar(50),
        "hook" text,
        "caption" text,
        "cta" text,
        "hashtags" text,
        "disclaimer" text,
        "status" varchar(20) DEFAULT 'draft',
        "scheduled_for" timestamp,
        "theme" varchar(100),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_purchases" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "product_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "price_paid" integer NOT NULL,
        "payment_method" varchar(50),
        "transaction_id" varchar(255),
        "downloaded_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protocol_registry" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "code" varchar(64) NOT NULL,
        "name" varchar(200) NOT NULL,
        "modality" varchar(32) NOT NULL,
        "description" text DEFAULT '' NOT NULL,
        "target_symptoms" text[] DEFAULT '{}' NOT NULL,
        "evidence_level" varchar(16) DEFAULT 'moderate' NOT NULL,
        "duration_weeks" integer DEFAULT 8 NOT NULL,
        "sessions_per_week" integer DEFAULT 1 NOT NULL,
        "human_required" boolean DEFAULT false NOT NULL,
        "phases" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "status" varchar(16) DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "protocol_registry_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "protocol_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "protocol_id" uuid NOT NULL,
        "agent_id" uuid,
        "status" varchar(16) DEFAULT 'active' NOT NULL,
        "current_node_id" varchar(80),
        "visited_node_ids" text[] DEFAULT '{}' NOT NULL,
        "node_states" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "user_variables" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "responses" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "started_at" timestamp DEFAULT now() NOT NULL,
        "last_activity_at" timestamp DEFAULT now() NOT NULL,
        "completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishing_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "type" varchar(50) NOT NULL,
        "meta" jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "redirects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" varchar(100) NOT NULL,
        "url" text NOT NULL,
        "clicks" integer DEFAULT 0 NOT NULL,
        "campaign_id" uuid,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "redirects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reflections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "text" text NOT NULL,
        "mode" varchar(50) DEFAULT 'narrative',
        "tags" text,
        "insight_cards" text,
        "state_snapshot" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scheduled_reminders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
        "sid" varchar PRIMARY KEY NOT NULL,
        "sess" jsonb NOT NULL,
        "expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared_questions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "question" text NOT NULL,
        "active_date" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shared_reflections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "journal_id" uuid,
        "content" text NOT NULL,
        "emotion" varchar(50),
        "is_anonymous" boolean DEFAULT true NOT NULL,
        "display_name" varchar(100),
        "heart_count" integer DEFAULT 0 NOT NULL,
        "is_blessed" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "goal" text,
        "start_date" timestamp,
        "end_date" timestamp,
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(255),
        "content" text NOT NULL,
        "platform" varchar(50) NOT NULL,
        "media_url" text,
        "scheduled_at" timestamp,
        "published_at" timestamp,
        "status" varchar(20) DEFAULT 'draft' NOT NULL,
        "hashtags" text,
        "author_id" uuid NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "theme" varchar(100),
        "origin_type" varchar(30) DEFAULT 'standalone',
        "origin_id" uuid,
        "captions" jsonb,
        "gentle_cta_url" text,
        "safety_note" text,
        "crisis_link_required" integer DEFAULT 0,
        "posted_platforms" jsonb,
        "reviewed_at" timestamp,
        "approved_at" timestamp,
        "posted_at" timestamp,
        "created_by" varchar(255),
        "reviewed_by" varchar(255),
        "approved_by" varchar(255),
        "audience" varchar(100),
        "campaign_id" uuid,
        "scheduled_for" timestamp,
        "canva_url" text,
        "media_asset_url" text,
        "utm_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "soft_launch_feedback" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "category" varchar(50) NOT NULL,
        "message" text NOT NULL,
        "contact_email" varchar(255),
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "states" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "energy" varchar(20) NOT NULL,
        "clarity" varchar(20) NOT NULL,
        "openness" varchar(20) NOT NULL,
        "regulation" varchar(20) NOT NULL,
        "presence" varchar(20) NOT NULL,
        "pace" varchar(20),
        "note" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_circles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "therapy_sessions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" uuid NOT NULL,
        "flow_type" text DEFAULT 'general' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tool_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "tool_name" varchar(100) NOT NULL,
        "duration_seconds" integer NOT NULL,
        "xp_earned" integer NOT NULL,
        "completed_at" timestamp DEFAULT now() NOT NULL,
        "metadata" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_achievements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_avatars" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "palette" varchar(32) DEFAULT 'sage' NOT NULL,
        "accessory" varchar(32) DEFAULT 'none' NOT NULL,
        "peacescape_theme" varchar(32) DEFAULT 'meadow' NOT NULL,
        "evolution_stage" integer DEFAULT 1 NOT NULL,
        "journal_count_at_unlock" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "user_avatars_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_favorites" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "item_type" varchar(50) NOT NULL,
        "item_content" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_journey_progress" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_preferences" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "onboarding_completed" boolean DEFAULT false,
        "wellness_goals" text,
        "support_mode" varchar(50) DEFAULT 'reflection',
        "reminder_time" varchar(10),
        "reminder_days" text,
        "disclaimer_accepted" boolean DEFAULT false,
        "disclaimer_accepted_at" timestamp,
        "theme" varchar(20) DEFAULT 'system',
        "notifications" boolean DEFAULT true,
        "preferences" jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD COLUMN IF NOT EXISTS "preferences" jsonb;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_progress" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "total_xp" integer DEFAULT 0 NOT NULL,
        "level" integer DEFAULT 1 NOT NULL,
        "current_streak" integer DEFAULT 0 NOT NULL,
        "longest_streak" integer DEFAULT 0 NOT NULL,
        "last_activity_date" timestamp,
        "tools_used_today" integer DEFAULT 0 NOT NULL,
        "total_tools_used" integer DEFAULT 0 NOT NULL,
        "total_session_minutes" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "reminders" jsonb,
        "preferences" jsonb,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255),
        "name" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "role" text DEFAULT 'user',
        "refresh_token_hash" text,
        "mfa_enabled" boolean DEFAULT false,
        "mfa_secret" text,
        "mfa_backup_codes" text,
        "stripe_customer_id" text,
        "subscription_status" text DEFAULT 'free',
        "subscription_expires_at" timestamp,
        "github_id" text,
        "replit_id" text,
        "profile_image_url" text,
        CONSTRAINT "users_email_unique" UNIQUE("email"),
        CONSTRAINT "users_replit_id_unique" UNIQUE("replit_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "values_entries" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL,
        "core_values" text,
        "reflections" text,
        "priority_ranking" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_events" (
        "id" text PRIMARY KEY NOT NULL,
        "event_type" varchar(100) NOT NULL,
        "status" varchar(50) DEFAULT 'processed' NOT NULL,
        "processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wellness_goals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wellness_insights" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wellness_streaks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_decisions_agent" ON "agent_decisions" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_decisions_created" ON "agent_decisions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_decisions_review" ON "agent_decisions" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_registry_division" ON "agent_registry" USING btree ("division");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_agent_registry_status" ON "agent_registry" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_messages_user_id" ON "ai_messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_messages_user_created" ON "ai_messages" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_analytics_events_created" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_analytics_events_name" ON "analytics_events" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_analytics_events_category" ON "analytics_events" USING btree ("event_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_detections_user_created" ON "awareness_detections" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_detections_severity" ON "awareness_detections" USING btree ("severity");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_detections_rule" ON "awareness_detections" USING btree ("rule_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_detections_flagged" ON "awareness_detections" USING btree ("flagged");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_rules_active" ON "awareness_rules" USING btree ("active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_awareness_rules_category" ON "awareness_rules" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_biometric_connections_user" ON "biometric_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uniq_biometric_connections_user_source" ON "biometric_connections" USING btree ("user_id","device_source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_biometric_readings_user_recorded" ON "biometric_readings" USING btree ("user_id","recorded_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_biometric_readings_user_metric" ON "biometric_readings" USING btree ("user_id","metric_type","recorded_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "community_affirmations_created_at_idx" ON "community_affirmations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_scores_user" ON "content_scores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_scores_source" ON "content_scores" USING btree ("content_source");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_scores_severity" ON "content_scores" USING btree ("severity");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_content_scores_created" ON "content_scores" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_reflections_user_id_idx" ON "daily_reflections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_reflections_created_at_idx" ON "daily_reflections" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_discernment_attempts_user_created" ON "discernment_attempts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_discernment_attempts_user_lesson" ON "discernment_attempts" USING btree ("user_id","lesson_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_discernment_lessons_belt_seq" ON "discernment_lessons" USING btree ("belt","sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uniq_discernment_lessons_belt_seq" ON "discernment_lessons" USING btree ("belt","sequence");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gratitude_entries_user_id_idx" ON "gratitude_entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gratitude_entries_created_at_idx" ON "gratitude_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_journals_user_id" ON "journals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_journals_user_created" ON "journals" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_moods_user_id" ON "moods" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_moods_user_created" ON "moods" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_nervous_system_states_user_created" ON "nervous_system_states" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outcome_measures_user" ON "outcome_measures" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outcome_measures_session" ON "outcome_measures" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_outcome_measures_code" ON "outcome_measures" USING btree ("measure_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_protocol_registry_modality" ON "protocol_registry" USING btree ("modality");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_protocol_registry_status" ON "protocol_registry" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_protocol_sessions_user" ON "protocol_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_protocol_sessions_protocol" ON "protocol_sessions" USING btree ("protocol_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_protocol_sessions_status" ON "protocol_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_publishing_events_type" ON "publishing_events" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_publishing_events_created" ON "publishing_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_redirects_slug" ON "redirects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shared_reflections_user_id_idx" ON "shared_reflections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shared_reflections_emotion_idx" ON "shared_reflections" USING btree ("emotion");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shared_reflections_created_at_idx" ON "shared_reflections" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_campaigns_status" ON "social_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_posts_status" ON "social_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_posts_origin" ON "social_posts" USING btree ("origin_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_posts_theme" ON "social_posts" USING btree ("theme");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_posts_campaign" ON "social_posts" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_social_posts_scheduled" ON "social_posts" USING btree ("scheduled_for");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_therapy_sessions_user" ON "therapy_sessions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_avatars_user_id" ON "user_avatars" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_favorites_user_id_idx" ON "user_favorites" USING btree ("user_id");