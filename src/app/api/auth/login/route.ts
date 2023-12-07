import { LuciaError } from 'lucia';
import * as context from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

import { auth } from '@/libs/lucia';
import verifyReCaptcha from '@/libs/recaptcha';

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for');
  const parser = new UAParser(request.headers.get('user-agent') ?? '');
  const { email, password, captcha } = await request.json();

  if (!(await verifyReCaptcha(captcha))) {
    return NextResponse.json(
      {
        error: 'Помилка reCaptcha',
      },
      { status: 429 }
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      {
        error: 'Відсутній один або декілька параметрів',
      },
      { status: 400 }
    );
  }

  try {
    const key = await auth.useKey('email', email.toLowerCase(), password);
    const user = await auth.getUser(key.userId);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Невірний email або пароль',
        },
        { status: 401 }
      );
    }

    if (user.ip.length > 0 && !user.ip.includes(ip)) {
      return NextResponse.json(
        {
          error: 'Вхід заблоковано з цієї IP адреси',
        },
        { status: 403 }
      );
    }
    const session = await auth.createSession({
      attributes: {
        browser: `${parser.getBrowser().name} ${parser.getBrowser().version}`,
        created_at: new Date(),
        os: parser.getOS().name,
      },
      userId: key.userId,
    });
    const authRequest = auth.handleRequest(request.method, context);
    await auth.deleteDeadUserSessions(key.userId);
    authRequest.setSession(session);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (
      error instanceof LuciaError &&
      (error.message === 'AUTH_INVALID_KEY_ID' ||
        error.message === 'AUTH_INVALID_PASSWORD')
    ) {
      return NextResponse.json(
        {
          error: 'Невірний email або пароль',
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
