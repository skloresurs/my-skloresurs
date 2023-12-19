import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import CustomError, { EmailExistsError, ServerError } from '@/classes/CustomError';
import { auth, facebookAuth } from '@/libs/lucia';
import oauthErrorRedirect from '@/libs/oauth-middleware';
import prisma from '@/libs/prisma';
import { getSession, setSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export const GET = async (req: NextRequest) => {
  const activeSession = await getSession(req).catch(() => null);
  const activeSessionBoolean = activeSession !== null;

  try {
    const storedState = cookies().get('facebook_oauth_state')?.value;
    const url = new URL(req.url);
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    if (!storedState || !state || storedState !== state || !code) {
      return oauthErrorRedirect('Токен авторизації недійсний', !!activeSession);
    }
    const { facebookUser } = await facebookAuth.validateCallback(code);

    const existUser = await prisma.user.findFirst({
      where: {
        facebookId: facebookUser.id,
      },
    });

    if (activeSession) {
      if (existUser) {
        return oauthErrorRedirect("Цей oauth аккаунт вже зв'язаний з іншим аккаунтом", activeSessionBoolean);
      }
      await auth.updateUserAttributes(activeSession.user.id, {
        facebook: facebookUser.name,
        facebookId: facebookUser.id,
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
      await auth.updateUserAttributes(existUser.id, {
        facebook: facebookUser.name,
      });
      await setSession(req, existUser.id);
    } else if (facebookUser.email) {
      const user = await auth
        .createUser({
          attributes: {
            email: facebookUser.email,
            facebook: facebookUser.name,
            facebookId: facebookUser.id,
            fullname: facebookUser.name,
          },
          key: {
            password: null,
            providerId: 'email',
            providerUserId: facebookUser.email.toLowerCase(),
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
    } else {
      return oauthErrorRedirect(
        'Не вдалось отримати ваш E-mail. Для створення аккаунту за допомогою Facebook у вас повинен бути зареєстрований E-mail у вашому профілі Facebook',
        activeSessionBoolean
      );
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
