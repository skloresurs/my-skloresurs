import { LuciaError } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';
import verifyPermission from '@/libs/verify-permission';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    const verify = verifyPermission(session.user.permissions, 'Admin');
    if (!verify) {
      return NextResponse.json(null, { status: 403 });
    }

    const user = await auth.getUser(params.id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === 'AUTH_INVALID_USER_ID'
    ) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
