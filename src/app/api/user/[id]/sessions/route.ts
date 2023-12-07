import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(session.user.ip);

    const sessions = await auth.getAllUserSessions(params.id);
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
