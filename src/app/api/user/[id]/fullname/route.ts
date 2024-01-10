import { NextRequest, NextResponse } from 'next/server';

import { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(req, session.user.allowed_ips);

    const { fullname } = await req.json();

    if (!fullname) {
      throw MissingParamsError;
    }

    await auth.updateUserAttributes(params.id, {
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
