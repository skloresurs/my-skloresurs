import { orderBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import axios1cMain from '@/libs/axios';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';
import verifyPermission from '@/libs/verify-permission';
import IManaderOrder from '@/types/ManagerOrder';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const search = params.get('search');

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

    let orders: IManaderOrder[] = [];

    if (session.user.id_1c_main) {
      const response = await axios1cMain
        .post(`/orders/manager`, {
          search,
        })
        .catch(() => null);
      if (!response || response.status !== 200) {
        return NextResponse.json("Помилка з'єднання з основним сервером", {
          status: 500,
        });
      }
      orders = [...orders, ...response.data.data];
    }

    return NextResponse.json(
      orderBy(orders, ['locked', 'createdAt'], ['asc', 'desc']),
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
