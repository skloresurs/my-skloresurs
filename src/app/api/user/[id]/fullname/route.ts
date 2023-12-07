import { NextRequest, NextResponse } from 'next/server';

import { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(session.user.ip);

    const { fullname } = await request.json();

    if (!fullname) {
      throw MissingParamsError;
    }

    await auth.updateUserAttributes(params.id, {
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
