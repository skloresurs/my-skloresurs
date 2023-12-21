import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { constant, toLower } from 'lodash';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import CustomError, { EmailExistsError, ServerError } from '@/classes/CustomError';
import { auth, googleAuth } from '@/libs/lucia';
import oauthErrorRedirect from '@/libs/oauth-middleware';
import prisma from '@/libs/prisma';
import { getSession, setSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export const GET = async (req: NextRequest) => {
  const activeSession = await getSession(req).catch(constant(null));
  const activeSessionBoolean = activeSession !== null;

  try {
    const storedState = cookies().get('google_oauth_state')?.value;
    const url = new URL(req.url);
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    if (!storedState || !state || storedState !== state || !code) {
      return oauthErrorRedirect('Токен авторизації недійсний', !!activeSession);
    }
    const { googleUser } = await googleAuth.validateCallback(code);

    if (!googleUser.email) {
      return oauthErrorRedirect('Не вдалось отримати ваш E-mail', activeSessionBoolean);
    }

    const existUser = await prisma.user.findFirst({
      where: {
        googleId: googleUser.sub,
      },
    });

    if (activeSession) {
      if (existUser) {
        return oauthErrorRedirect("Цей oauth аккаунт вже зв'язаний з іншим аккаунтом", activeSessionBoolean);
      }
      await auth.updateUserAttributes(activeSession.user.id, {
        google: googleUser.email,
        googleId: googleUser.sub,
      });
      return NextResponse.json(null, {
        headers: {
          Location: '/profile?tab=link',
        },
        status: 302,
      });
    }

    if (existUser) {
      verifyIp(req, existUser.ip);
      await setSession(req, existUser.id);
    } else {
      const user = await auth
        .createUser({
          attributes: {
            email: googleUser.email,
            fullname: googleUser.name,
            google: googleUser.email,
            googleId: googleUser.sub,
          },
          key: {
            password: null,
            providerId: 'email',
            providerUserId: toLower(googleUser.email),
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
    }

    return NextResponse.json(null, {
      headers: {
        Location: '/',
      },
      status: 302,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return oauthErrorRedirect(error.message, activeSessionBoolean);
    }
    return oauthErrorRedirect('Помилка сервера', activeSessionBoolean);
  }
};
