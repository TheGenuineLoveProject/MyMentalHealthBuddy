import { sql } from "drizzle-orm";
import { db } from "./connection.mjs";
import { logger } from "../utils/logger.mjs";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_journals_user_id ON journals(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_journals_user_created ON journals(user_id, created_at)`,

  `CREATE TABLE IF NOT EXISTS moods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    rating VARCHAR(50) NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    score INTEGER,
    note TEXT,
    emotion VARCHAR(100),
    energy_level INTEGER,
    sleep_quality INTEGER,
    activities TEXT,
    triggers TEXT,
    weather VARCHAR(50),
    location VARCHAR(100)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_moods_user_id ON moods(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_moods_user_created ON moods(user_id, created_at)`,

  `CREATE TABLE IF NOT EXISTS gratitude_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS gratitude_entries_user_id_idx ON gratitude_entries(user_id)`,
  `CREATE INDEX IF NOT EXISTS gratitude_entries_created_at_idx ON gratitude_entries(created_at)`,

  `CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    content_type VARCHAR(30) NOT NULL DEFAULT 'blog_post',
    visibility VARCHAR(20) NOT NULL DEFAULT 'public',
    published_at TIMESTAMP,
    reading_time_minutes INTEGER DEFAULT 1,
    tags TEXT,
    featured_image TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Companion table to blog_posts — production was throwing
  // "Failed to fetch blog post" because every blog detail page joins comments.
  // Kept here as a boot-time safety net even though shared/schema.mjs is the
  // source of truth (npm run db:push handles the rest).
  `CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id)`,
  `CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id)`,

  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    source_path VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    consent BOOLEAN NOT NULL DEFAULT false,
    interests TEXT,
    source VARCHAR(100),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    user_id UUID,
    session_id VARCHAR(255),
    properties TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  // Peace Scape — Layer 2 foundation. Idempotent. Matches shared/schema.mjs::userAvatars.
  `CREATE TABLE IF NOT EXISTS user_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    palette VARCHAR(32) NOT NULL DEFAULT 'sage',
    accessory VARCHAR(32) NOT NULL DEFAULT 'none',
    peacescape_theme VARCHAR(32) NOT NULL DEFAULT 'meadow',
    evolution_stage INTEGER NOT NULL DEFAULT 1,
    journal_count_at_unlock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_user_avatars_user_id ON user_avatars(user_id)`,

  /* ===== MMHB CONSCIOUSNESS OS v2.0 — Phase 0 ============================
   * Synthetic Employee Registry (Part II §2.5), CAD-4 audit log,
   * Mirror/Epistemic content scores (Part III §3.3 / §3.6).
   * Mirrors the Drizzle definitions in shared/schema.mjs.
   * Additive only; safe to re-run.
   * ====================================================================== */
  `CREATE TABLE IF NOT EXISTS agent_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_key VARCHAR(80) NOT NULL UNIQUE,
    agent_role VARCHAR(120) NOT NULL,
    division VARCHAR(40) NOT NULL,
    persona_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    version INTEGER NOT NULL DEFAULT 1,
    human_supervisor_id UUID,
    budget_tokens_daily INTEGER NOT NULL DEFAULT 0,
    kill_switch BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_agent_registry_division ON agent_registry(division)`,
  `CREATE INDEX IF NOT EXISTS idx_agent_registry_status ON agent_registry(status)`,

  `CREATE TABLE IF NOT EXISTS agent_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL,
    decision_type VARCHAR(60) NOT NULL,
    input_digest JSONB NOT NULL DEFAULT '{}'::jsonb,
    reasoning JSONB NOT NULL DEFAULT '{}'::jsonb,
    outcome JSONB NOT NULL DEFAULT '{}'::jsonb,
    priority_escalated BOOLEAN NOT NULL DEFAULT false,
    confidence INTEGER,
    review_status VARCHAR(20) NOT NULL DEFAULT 'unreviewed',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_agent_decisions_agent ON agent_decisions(agent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_agent_decisions_created ON agent_decisions(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_agent_decisions_review ON agent_decisions(review_status)`,

  `CREATE TABLE IF NOT EXISTS content_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_source VARCHAR(32) NOT NULL,
    content_ref VARCHAR(80) NOT NULL,
    user_id UUID,
    compassion_index INTEGER,
    truth_index INTEGER,
    love_index INTEGER,
    integration_score INTEGER,
    epistemic_score INTEGER,
    signals JSONB NOT NULL DEFAULT '{}'::jsonb,
    detector_layer VARCHAR(16) NOT NULL DEFAULT 'rule',
    severity VARCHAR(10) NOT NULL DEFAULT 'info',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  // ---------- v2.0 Prompt 3.3: Protocol Execution Engine ----------
  `CREATE TABLE IF NOT EXISTS protocol_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    modality VARCHAR(32) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    target_symptoms TEXT[] NOT NULL DEFAULT '{}',
    evidence_level VARCHAR(16) NOT NULL DEFAULT 'moderate',
    duration_weeks INTEGER NOT NULL DEFAULT 8,
    sessions_per_week INTEGER NOT NULL DEFAULT 1,
    human_required BOOLEAN NOT NULL DEFAULT FALSE,
    phases JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(16) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_protocol_registry_modality ON protocol_registry(modality)`,
  `CREATE INDEX IF NOT EXISTS idx_protocol_registry_status ON protocol_registry(status)`,
  `CREATE TABLE IF NOT EXISTS protocol_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    protocol_id UUID NOT NULL,
    agent_id UUID,
    status VARCHAR(16) NOT NULL DEFAULT 'active',
    current_node_id VARCHAR(80),
    visited_node_ids TEXT[] NOT NULL DEFAULT '{}',
    node_states JSONB NOT NULL DEFAULT '{}'::jsonb,
    user_variables JSONB NOT NULL DEFAULT '{}'::jsonb,
    responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_protocol_sessions_user ON protocol_sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_protocol_sessions_protocol ON protocol_sessions(protocol_id)`,
  `CREATE INDEX IF NOT EXISTS idx_protocol_sessions_status ON protocol_sessions(status)`,
  `CREATE TABLE IF NOT EXISTS outcome_measures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_id UUID,
    measure_code VARCHAR(32) NOT NULL,
    score INTEGER NOT NULL,
    subscores JSONB NOT NULL DEFAULT '{}'::jsonb,
    severity VARCHAR(16) NOT NULL DEFAULT 'info',
    flag_items TEXT[] NOT NULL DEFAULT '{}',
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_measures_user ON outcome_measures(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_measures_session ON outcome_measures(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_outcome_measures_code ON outcome_measures(measure_code)`,
  `CREATE INDEX IF NOT EXISTS idx_content_scores_user ON content_scores(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_content_scores_source ON content_scores(content_source)`,
  `CREATE INDEX IF NOT EXISTS idx_content_scores_severity ON content_scores(severity)`,
  `CREATE INDEX IF NOT EXISTS idx_content_scores_created ON content_scores(created_at)`,
];

let bootstrapped = false;

export async function ensureSchema() {
  if (bootstrapped) return { ok: true, cached: true };
  const results = { ok: true, ran: 0, failed: [] };
  for (const stmt of STATEMENTS) {
    try {
      await db.execute(sql.raw(stmt));
      results.ran += 1;
    } catch (err) {
      results.failed.push({ stmt: stmt.split("\n")[0], message: err?.message || String(err) });
    }
  }
  if (results.failed.length > 0) {
    logger.warn("[ensureSchema] some statements failed (continuing):", results.failed);
    results.ok = false;
  } else {
    logger.info(`[ensureSchema] bootstrapped ${results.ran} statements`);
  }
  bootstrapped = true;
  return results;
}
