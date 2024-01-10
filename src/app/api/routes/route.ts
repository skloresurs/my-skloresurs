import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import axios1cMain from '@/libs/axios';
import logger from '@/libs/logger';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';
import IRoute from '@/types/Route';

interface IResponse {
  data: IRoute[];
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, 'Driver');

    const params = req.nextUrl.searchParams;

    const page = params.get('page');

    const paramsQuery = new URLSearchParams();
    if (page) {
      paramsQuery.append('page', page);
    }

    const query = paramsQuery.toString().replaceAll('+', '%20');

    if (!session.user.id_1c) {
      throw ServerError;
    }

    const response = await axios1cMain
      .get<IResponse>(`/driver/routes?${query}`, {
        headers: {
          user: session.user.id_1c,
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
    return apiErrorHandler(req, error);
  }
}
