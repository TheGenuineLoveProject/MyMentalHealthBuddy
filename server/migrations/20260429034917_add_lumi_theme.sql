-- Migration: Add Lumi theme preferences to user_profiles
-- Created: $(date)

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS lumi_theme VARCHAR(16) DEFAULT 'sage',
ADD COLUMN IF NOT EXISTS lumi_animations_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS lumi_emotion_history JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS lumi_interaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lumi_last_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for fast theme lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_lumi_theme ON user_profiles(lumi_theme);

-- Update existing users with default theme
UPDATE user_profiles 
SET lumi_theme = 'sage', 
    lumi_animations_enabled = true 
WHERE lumi_theme IS NULL;
