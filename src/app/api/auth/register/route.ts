import { nanoid } from 'nanoid';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { PrismaClientKnownRequestError } from '@/.prisma/runtime/library';
import {
  EmailExistsError,
  MissingParamsError,
  ServerError,
} from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import verifyReCaptcha from '@/libs/recaptcha';
import generateSession from '@/libs/sessions';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullname, captcha } = await request.json();

    await verifyReCaptcha(captcha);

    if (!email || !password || !fullname) {
      throw MissingParamsError;
    }

    const user = await auth
      .createUser({
        attributes: {
          email,
          fullname,
        },
        key: {
          password,
          providerId: 'email',
          providerUserId: email.toLowerCase(),
        },
        userId: nanoid(),
      })
      .catch((error) => {
        if (
          (error as PrismaClientKnownRequestError) &&
          error.code === 'P2002'
        ) {
          throw EmailExistsError;
        }
        throw ServerError;
      });
    const session = await generateSession(request, user.userId);
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
