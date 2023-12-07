import { NextRequest, NextResponse } from 'next/server';

import axios1c from '@/libs/axios';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';
import verifyPermission from '@/libs/verify-permission';

// TODO: Rewrite on POST request

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const search = params.get('search');
    const all = params.get('all');

    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (
      !(await verifyIp(session.user.ip)) ||
      !verifyPermission(session.user.permissions, 'Manager')
    ) {
      return NextResponse.json(null, { status: 403 });
    }

    const allUsersOrder = session.user.permissions.includes('ManagerAllOrders');
    const paramsQuery = new URLSearchParams();
    paramsQuery.set('manadgerId', session.user.id_1c_main);

    if (all) {
      paramsQuery.set('all', 'true');
    }
    if (allUsersOrder) {
      paramsQuery.set('allUsersOrders', 'true');
    }
    if (search) {
      paramsQuery.set('search', search);
    }

    const { data } = await axios1c.get(
      `/orders?${paramsQuery.toString().replaceAll('+', '%20')}`
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
