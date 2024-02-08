import { StatusCodes } from 'http-status-codes';
import { constant } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import CustomError from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import axios1cMain from '@/libs/axios';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(req, session.user.allowed_ips);

    const { id } = await req.json();

    const fullname = await axios1cMain
      .get(`/data/users/${id}`)
      .then((res) => res.data.name)
      .catch(constant(null));

    if (!fullname && id) {
      throw new CustomError(
        "Не вдалося отримати ФІО користувача. Можливо користувач не має зв'язаної Фіз особи",
        StatusCodes.BAD_REQUEST
      );
    }

    await auth.updateUserAttributes(params.id, {
      id_1c: id,
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
