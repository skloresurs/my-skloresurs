import { NextResponse } from 'next/server';

import getSession from '@/libs/server-session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }
    return NextResponse.json(session.user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
