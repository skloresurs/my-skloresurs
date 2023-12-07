import { NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (!(await verifyIp(session.user.ip))) {
      return NextResponse.json(null, { status: 403 });
    }

    const sessions = await auth.getAllUserSessions(session.user.userId);
    return NextResponse.json(
      { sessions, thisSession: session.id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
