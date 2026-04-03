import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://jey@localhost:5432/vissar_dev',
  },
} satisfies Config;
