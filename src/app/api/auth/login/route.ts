import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import verifyReCaptcha from '@/libs/recaptcha';
import { setSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json();

    await verifyReCaptcha(captcha);

    if (!email || !password) {
      throw MissingParamsError;
    }
    const key = await auth.useKey('email', email.toLowerCase(), password);
    const user = await auth.getUser(key.userId);

    verifyIp(user.ip);

    await setSession(request, user.id);

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
