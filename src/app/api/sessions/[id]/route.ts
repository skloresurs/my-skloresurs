import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);

    const sessionById = await auth.getSession(params.id);
    if (!sessionById) {
      return NextResponse.json(null, { status: 404 });
    }

    if (session.user.userId !== sessionById.user.userId) {
      verifyPermissionServer(session.user.permissions, 'Admin');
    }
    await auth.invalidateSession(params.id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
