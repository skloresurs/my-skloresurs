import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);

    verifyPermissionServer(session.user.permissions, 'Admin');
    await verifyIp(req, session.user.ip);

    const { id } = await req.json();

    await auth.updateUserAttributes(params.id, {
      id_1c_main: id,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, `/user/${params.id}/1c/main`);
  }
}
