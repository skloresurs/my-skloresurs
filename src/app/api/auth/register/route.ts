import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nanoid } from 'nanoid';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import verifyReCaptcha from '@/libs/recaptcha';

export async function POST(request: NextRequest) {
  const { email, password, fullname, captcha } = await request.json();

  if (!(await verifyReCaptcha(captcha))) {
    return NextResponse.json(
      {
        error: 'Помилка reCaptcha',
      },
      { status: 429 }
    );
  }

  if (!email || !password || !fullname) {
    return NextResponse.json(
      {
        error: 'Відсутній один або декілька параметрів',
      },
      { status: 400 }
    );
  }

  try {
    const user = await auth.createUser({
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
    });
    const session = await auth.createSession({
      attributes: {},
      userId: user.userId,
    });
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error: 'Користувач з цією електронною поштою вже існує',
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        error: 'Помилка сервера',
      },
      { status: 500 }
    );
  }
}
