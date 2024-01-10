import { NextRequest, NextResponse } from 'next/server';

import { ServerError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import axios1cMain from '@/libs/axios';
import logger from '@/libs/logger';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';
import { IGoods } from '@/types/ManagerOrder';

interface IResponse {
  data: IGoods[];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, 'Manager');

    const response = await axios1cMain.get<IResponse>(`/manager/order/${params.id}`).catch((error) => {
      logger.error(error.response.data);
      throw ServerError;
    });
    return NextResponse.json(response.data.data, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
