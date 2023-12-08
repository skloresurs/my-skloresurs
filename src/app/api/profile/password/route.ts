import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(session.user.ip);

    const { old, password } = await req.json();
    if (!old || !password) {
      throw MissingParamsError;
    }

    await auth.useKey('email', session.user.email.toLowerCase(), old);

    await auth.invalidateAllUserSessions(session.user.userId);
    await auth.updateKeyPassword(
      'email',
      session.user.email.toLowerCase(),
      password
    );

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, 'old-password');
  }
}
