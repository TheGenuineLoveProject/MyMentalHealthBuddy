# ⚠️ CRITICAL: Database Migration Required

## Schema Changes Made

The following schema changes have been made and require database synchronization:

### 1. Added `isAdmin` Field to Users Table
- **Table**: `users`
- **Column**: `is_admin` (boolean, default: false)
- **Purpose**: Enables proper role-based access control for administrator functions
- **Impact**: Required for `requireAdmin` middleware to function

## Required Action

**BEFORE DEPLOYING OR TESTING ADMIN FEATURES**, you must synchronize the database schema:

```bash
npm run db:push
```

This command will:
1. Push the schema changes to your connected database
2. Add the `is_admin` column to the `users` table
3. Set default value of `false` for all existing users

## Post-Migration Steps

### Making a User an Admin

After running the migration, you can manually set admin privileges for specific users:

**Option 1: Using Drizzle Studio (Recommended)**
```bash
npm run db:studio
```
Then navigate to the `users` table and set `is_admin = true` for the desired user.

**Option 2: Using SQL**
```sql
UPDATE users 
SET is_admin = true 
WHERE username = 'your-admin-username';
```

## Production Deployment Checklist

- [ ] Run `npm run db:push` in development
- [ ] Test admin authentication with a test admin user
- [ ] Run `npm run db:push` in production (or configure auto-push in deployment)
- [ ] Set initial admin user(s) in production database
- [ ] Verify `/api/health` endpoint shows database connectivity

## What Happens Without Migration?

❌ **CRITICAL ERROR**: If you don't run the migration:
- All user queries will fail with SQL errors (column doesn't exist)
- `requireAdmin` middleware will crash
- Most endpoints that fetch user data will return 500 errors
- Application will be completely non-functional

## Database Connection

Make sure your `DATABASE_URL` environment variable is set before running migrations.

For local development:
```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# If not set, configure it in your .env file or Replit Secrets
```

## Questions?

If you encounter issues running the migration, check:
1. DATABASE_URL is configured correctly
2. Database is accessible
3. User has CREATE TABLE / ALTER TABLE permissions
