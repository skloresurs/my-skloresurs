import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import CustomError, { MissingParamsError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);

    const { fullname } = await req.json();

    if (!fullname) {
      throw MissingParamsError;
    }

    const validate = await z.string().max(100).safeParseAsync(fullname);
    if (!validate.success) {
      throw new CustomError("Повне ім'я має бути не більше 100 символів", StatusCodes.BAD_REQUEST);
    }

    await auth.updateUserAttributes(session.user.id, {
      fullname,
    });
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
