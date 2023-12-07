import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';
import verifyPermission from '@/libs/verify-permission';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (!(await verifyIp(session.user.ip))) {
      return NextResponse.json(null, { status: 403 });
    }

    const sessionById = await auth.getSession(params.id);
    if (!sessionById) {
      return NextResponse.json(null, { status: 404 });
    }

    if (
      session.user.userId !== sessionById.user.userId &&
      !verifyPermission(session.user.permissions, 'Admin')
    ) {
      return NextResponse.json(null, { status: 403 });
    }
    await auth.invalidateSession(params.id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}
