import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);

    const sessions = await auth.getAllUserSessions(session.user.userId);
    return NextResponse.json(
      { sessions, thisSession: session.id },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorHandler(error);
  }
}
