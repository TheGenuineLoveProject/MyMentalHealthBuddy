# Database Migration Required

## Status
⚠️ **Manual Intervention Needed**

## Issue
The database contains schema drift with older tables that don't match the current `db-schema.ts`:

**Extra tables in database (not in schema):**
- analytics_events
- api_endpoints
- assessments  
- coping_strategies
- packages
- project_structure
- scripts
- services
- sessions
- subscription_plans
- system_logs
- tts_configurations

**New tables defined in schema (ready to create):**
- content_templates (Content Studio)
- content_posts (Content Studio)
- scheduled_posts (Social Calendar)
- calendar_events (Social Calendar)
- automation_rules (Productivity)
- bulk_operations (Productivity)
- analytics_snapshots (Analytics)
- user_activity (Tracking)
- audit_logs (Security)
- subscription_history (Billing)

## Resolution Required
Run: `npm run db:push` and select "create table" for all new tables.

This will:
1. Create the 10 new tables for 360-degree features
2. Maintain existing core tables (users, journals, moods, etc.)
3. Preserve all existing data

## Impact
Until migration completes, the following features will have limited functionality:
- Content Studio (will use mock data)
- Social Calendar (will use mock data)  
- Productivity Hub (will use mock data)
- Analytics Dashboard (will use existing mood/journal data)
