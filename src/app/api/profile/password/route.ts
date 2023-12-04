import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Відсутній один або декілька параметрів' },
        { status: 400 }
      );
    }

    await auth.invalidateAllUserSessions(session.user.userId);
    await auth.updateKeyPassword(
      'email',
      session.user.email.toLowerCase(),
      password
    );

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
