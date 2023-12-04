import { NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await auth.invalidateSession(session.sessionId);
      await auth.deleteDeadUserSessions(session.user.userId);
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
