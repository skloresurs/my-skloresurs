import { orderBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import axios1cMain from '@/libs/axios';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';
import IManaderOrder from '@/types/ManagerOrder';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);
    verifyPermissionServer(session.user.permissions, 'Manager');

    const params = request.nextUrl.searchParams;

    const search = params.get('search');

    let orders: IManaderOrder[] = [];

    if (session.user.id_1c_main) {
      const response = await axios1cMain
        .post(`/orders/manager`, {
          search,
        })
        .catch(() => null);
      if (!response || response.status !== 200) {
        throw ServerError;
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
    return apiErrorHandler(error);
  }
}
