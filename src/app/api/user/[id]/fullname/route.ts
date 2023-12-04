import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';
import verifyPermission from '@/libs/verify-permission';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { fullname } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    const validate = verifyPermission(session.user.permissions, 'Admin');
    if (!validate) {
      return NextResponse.json(null, { status: 403 });
    }

    if (!fullname) {
      return NextResponse.json(
        { error: 'Відсутній один або декілька параметрів' },
        { status: 400 }
      );
    }
    await auth.updateUserAttributes(params.id, {
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
