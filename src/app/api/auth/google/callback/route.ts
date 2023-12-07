import { OAuthRequestError } from '@lucia-auth/oauth';
import { nanoid } from 'nanoid';
import { cookies, headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

import { auth, googleAuth } from '@/libs/lucia';

export const GET = async (request: NextRequest) => {
  const ip =
    request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for');
  const parser = new UAParser(request.headers.get('user-agent') ?? '');
  const storedState = cookies().get('google_oauth_state')?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return NextResponse.json(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, createUser, googleUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      return createUser({
        attributes: {
          account_type: 'Google',
          email: googleUser.email,
          fullname: googleUser.name,
        },
        userId: nanoid(),
      });
    };

    const user = await getUser();

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
      userId: user.userId,
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return new Response(null, {
      headers: {
        Location: '/',
      },
      status: 302,
    });
  } catch (error) {
    if (error instanceof OAuthRequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
