import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import CustomError, { EmailExistsError, ServerError } from '@/classes/CustomError';
import { env } from '@/env.mjs';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);

export function getDbError(error: object): CustomError {
  if (!('constraint' in error)) {
    return ServerError;
  }

  if (error.constraint === 'auth_user_email_unique') {
    return EmailExistsError;
  }

  return ServerError;
}
