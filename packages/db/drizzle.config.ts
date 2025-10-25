import 'dotenv/config';

export default {
  schema: './shared/types.ts',
  out: './.drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL || '' }
};