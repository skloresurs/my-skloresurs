import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }
    const { id } = await req.json();

    await auth.updateUserAttributes(params.id, {
      id_1c_main: id,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
