import { eq } from 'drizzle-orm';
import { constant, filter } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { MissingParamsError, UserNotFoundError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { db } from '@/libs/db';
import { userSchema } from '@/libs/db/schema';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(req, session.user.allowed_ips);

    const { key, value } = await req.json();

    if (!key) throw MissingParamsError;

    const user = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, params.id))
      .execute()
      .then((res) => res[0])
      .catch(constant(null));

    if (!user) throw UserNotFoundError;

    await db
      .update(userSchema)
      .set({
        permissions: value
          ? [...user.permissions, key]
          : filter(user.permissions, (permission: string) => permission !== key),
      })
      .where(eq(userSchema.id, params.id))
      .execute();
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
