import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const sessions = await auth.getAllUserSessions(session.user.userId);
    return NextResponse.json(
      { ...session.user, sessions, thisSession: session.id },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorHandler(error, '/user');
  }
}
