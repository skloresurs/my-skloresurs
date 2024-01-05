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
    verifyPermissionServer(session.user.permissions, 'Driver');

    const params = req.nextUrl.searchParams;

    const page = params.get('page');

    const paramsQuery = new URLSearchParams();
    if (page) {
      paramsQuery.append('page', page);
    }

    const query = paramsQuery.toString().replaceAll('+', '%20');

    if (!session.user.id_1c_main) {
      throw ServerError;
    }

    const response = await axios1cMain
      .get<IResponse>(`/driver/routes?${query}`, {
        headers: {
          User: session.user.id_1c_main,
        },
      })
      .catch((error) => {
        logger.error(error.response.data);
        throw ServerError;
      });

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    return apiErrorHandler(error, '/routes');
  }
}
