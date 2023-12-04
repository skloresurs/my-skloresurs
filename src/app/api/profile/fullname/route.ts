import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';

export async function POST(req: NextRequest) {
  try {
    const { fullname } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (!fullname) {
      return NextResponse.json(
        { error: 'Відсутній один або декілька параметрів' },
        { status: 400 }
      );
    }
    await auth.updateUserAttributes(session.user.userId, {
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
