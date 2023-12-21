import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { toLower } from 'lodash';
import { nanoid } from 'nanoid';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { EmailExistsError, MissingParamsError, ServerError } from '@/classes/CustomError';
import apiErrorHandler from '@/libs/api-error-handler';
import { auth } from '@/libs/lucia';
import verifyReCaptcha from '@/libs/recaptcha';
import { setSession } from '@/libs/sessions';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullname, captcha } = await req.json();

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
          providerUserId: toLower(email),
        },
        userId: nanoid(),
      })
      .catch((error) => {
        if ((error as PrismaClientKnownRequestError) && error.code === 'P2002') {
          throw EmailExistsError;
        }
        throw ServerError;
      });
    await setSession(req, user.id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, '/auth/register');
  }
}
