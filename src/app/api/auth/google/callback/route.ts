import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { PrismaClientKnownRequestError } from '@/.prisma/runtime/library';
import CustomError, {
  EmailExistsError,
  ServerError,
} from '@/classes/CustomError';
import { auth, googleAuth } from '@/libs/lucia';
import oauthErrorRedirect from '@/libs/oauth-middleware';
import prisma from '@/libs/prisma';
import { getSession, setSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export const GET = async (request: NextRequest) => {
  try {
    const storedState = cookies().get('google_oauth_state')?.value;
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    const activeSession = await getSession(request).catch(() => null);

    if (!storedState || !state || storedState !== state || !code) {
      return oauthErrorRedirect('Помилка авторизації');
    }
    const { googleUser } = await googleAuth.validateCallback(code);

    if (!googleUser.email) {
      return oauthErrorRedirect('Помилка авторизації');
    }

    const existUser = await prisma.user.findFirst({
      where: {
        google: googleUser.email,
      },
    });

    if (activeSession) {
      if (existUser) {
        return oauthErrorRedirect(
          "Цей oauth аккаунт вже зв'язаний з іншим аккаунтом",
          '/profile?tab=link'
        );
      }
      await auth.updateUserAttributes(activeSession.user.id, {
        google: googleUser.email,
      });
      return NextResponse.json(null, {
        headers: {
          Location: '/profile?tab=link',
        },
        status: 302,
      });
    }

    if (existUser) {
      verifyIp(existUser.ip);
      await setSession(request, existUser.id);
    } else {
      const user = await auth
        .createUser({
          attributes: {
            email: googleUser.email,
            fullname: googleUser.name,
            google: googleUser.email,
          },
          key: {
            password: null,
            providerId: 'email',
            providerUserId: googleUser.email.toLowerCase(),
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
      await setSession(request, user.id);
    }

    return NextResponse.json(null, {
      headers: {
        Location: '/',
      },
      status: 302,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return oauthErrorRedirect(error.message);
    }
    return oauthErrorRedirect('Помилка сервера');
  }
};
