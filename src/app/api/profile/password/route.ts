import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);

    const { password } = await request.json();
    if (!password) {
      throw MissingParamsError;
    }

    await auth.invalidateAllUserSessions(session.user.userId);
    await auth.updateKeyPassword(
      'email',
      session.user.email.toLowerCase(),
      password
    );

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
