import type { Config } from 'drizzle-kit';

import { env } from '@/env.mjs';

export default {
  schema: './src/libs/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
