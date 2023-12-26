import { orderBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import axios1cMain from '@/libs/axios';
import logger from '@/libs/logger';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';
import IManaderOrder from '@/types/ManagerOrder';

interface IResponse {
  data: IManaderOrder[];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.ip);
    verifyPermissionServer(session.user.permissions, 'Manager');

    const params = req.nextUrl.searchParams;

    const search = params.get('search');
    const all = params.get('all');

    let orders: IManaderOrder[] = [];

    if (session.user.id_1c_main) {
      const response = await axios1cMain
        .get<IResponse>(`/manager/order/`, {
          headers: {
            ManagerId: session.user.id_1c_main,
          },
          params: {
            search,
            all,
          },
        })
        .catch((error) => {
          logger.error(error.response.data);
          throw ServerError;
        });

      orders = [...response.data.data];
    }

    // TODO: add orders from secondary server 1C

    return NextResponse.json(orderBy(orders, ['locked', 'createdAt'], ['asc', 'desc']), {
      status: 200,
    });
  } catch (error) {
    return apiErrorHandler(error, '/orders/manager');
  }
}
