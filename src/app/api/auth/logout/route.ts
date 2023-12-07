import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (session) {
      await auth.invalidateSession(session.sessionId);
      await auth.deleteDeadUserSessions(session.user.userId);
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
