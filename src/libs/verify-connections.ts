import { eq } from 'drizzle-orm';
import { constant } from 'lodash';

import { RequiredOneConnections, UserNotFoundError } from '@/classes/CustomError';

import { db } from './db';
import { userSchema } from './db/schema';

export default async function verifyConnections(id: string): Promise<void> {
  const user = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, id))
    .limit(1)
    .execute()
    .then((data) => data[0])
    .catch(constant(null));

  if (!user) {
    throw UserNotFoundError;
  }

  let count = 0;

  if (user.google_id) count += 1;
  if (user.facebook_id) count += 1;

  if (count <= 1) throw RequiredOneConnections;
}
