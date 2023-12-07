import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';
import verifyPermission from '@/libs/verify-permission';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (
      !(await verifyIp(session.user.ip)) ||
      !verifyPermission(session.user.permissions, 'Admin')
    ) {
      return NextResponse.json(null, { status: 403 });
    }

    const { id } = await req.json();

    await auth.updateUserAttributes(params.id, {
      id_1c_secondary: id,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
