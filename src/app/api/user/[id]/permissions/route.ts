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

    const { key, value } = await req.json();
    if (!key) {
      return NextResponse.json(
        { error: 'Відсутній один або декілька параметрів' },
        { status: 400 }
      );
    }

    const user = await auth.getUser(params.id);

    if (!user) {
      return NextResponse.json(null, { status: 404 });
    }

    await (value
      ? auth.updateUserAttributes(params.id, {
          permissions: [...user.permissions, key],
        })
      : auth.updateUserAttributes(params.id, {
          permissions: user.permissions.filter(
            (permission: string) => permission !== key
          ),
        }));
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
