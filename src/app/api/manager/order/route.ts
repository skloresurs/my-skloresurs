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
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, 'Manager');

    const params = req.nextUrl.searchParams;

    const search = params.get('search');
    const all = params.get('all');
    const page = params.get('page');
    const agent = params.get('agent');
    const storage = params.get('storage');
    const bill = params.get('bill');

    const paramsQuery = new URLSearchParams();
    if (search) {
      paramsQuery.append('search', search);
    }
    if (all) {
      paramsQuery.append('all', 'true');
    }
    if (page) {
      paramsQuery.append('page', page);
    }
    if (agent) {
      paramsQuery.append('agent', agent);
    }
    if (storage) {
      paramsQuery.append('storage', 'true');
    }
    if (bill) {
      paramsQuery.append('bill', bill);
    }

    const query = paramsQuery.toString().replaceAll('+', '%20');

    if (!session.user.id_1c) {
      throw ServerError;
    }

    const response = await axios1cMain
      .get<IResponse>(`/manager/order?${query}`, {
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
