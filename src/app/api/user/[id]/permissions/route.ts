import { NextRequest, NextResponse } from 'next/server';

import { MissingParamsError, UserNotFoundError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(req, session.user.ip);

    const { key, value } = await req.json();

    if (!key) throw MissingParamsError;

    const user = await auth.getUser(params.id);

    if (!user) throw UserNotFoundError;

    await (value
      ? auth.updateUserAttributes(params.id, {
          permissions: [...user.permissions, key],
        })
      : auth.updateUserAttributes(params.id, {
          permissions: user.permissions.filter((permission: string) => permission !== key),
        }));
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, `/user/${params.id}/permissions`);
  }
}
