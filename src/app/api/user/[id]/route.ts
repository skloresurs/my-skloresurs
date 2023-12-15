import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    verifyPermissionServer(session.user.permissions, 'Admin');

    const user = await auth.getUser(params.id);
    const sessions = await auth.getAllUserSessions(params.id);
    return NextResponse.json({ ...user, sessions }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, `/user/${params.id}`);
  }
}
