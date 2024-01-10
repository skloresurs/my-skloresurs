import { eq } from 'drizzle-orm';
import { constant, toLower } from 'lodash';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

import CustomError from '@/classes/CustomError';
import { db, getDbError } from '@/libs/db';
import { userSchema } from '@/libs/db/schema';
import { auth, googleAuth } from '@/libs/lucia';
import oauthRedirect, { oauthErrorRedirect } from '@/libs/oauth-middleware';
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

    const userByGoogleId = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.google_id, googleUser.sub))
      .limit(1)
      .execute()
      .then((data) => data[0])
      .catch(constant(null));

    if (activeSession && userByGoogleId) {
      return oauthErrorRedirect("Цей oauth аккаунт вже зв'язаний з іншим аккаунтом", activeSessionBoolean);
    }

    if (activeSession) {
      await auth.updateUserAttributes(activeSession.user.id, {
        google_id: googleUser.sub,
      });
      return oauthRedirect(activeSessionBoolean);
    }

    if (userByGoogleId) {
      verifyIp(req, userByGoogleId.allowed_ips);
      await setSession(req, userByGoogleId.id);
      return oauthRedirect(activeSessionBoolean);
    }

    const user = await auth
      .createUser({
        attributes: {
          email: googleUser.email,
          google_id: googleUser.sub,
          fullname: googleUser.name,
        },
        key: {
          password: null,
          providerId: 'email',
          providerUserId: toLower(googleUser.email),
        },
        userId: nanoid(12),
      })
      .catch((error) => {
        throw getDbError(error);
      });

    await setSession(req, user.id);
    return oauthRedirect(activeSessionBoolean);
  } catch (error) {
    if (error instanceof CustomError) {
      return oauthErrorRedirect(error.message, activeSessionBoolean);
    }
    return oauthErrorRedirect('Помилка сервера', activeSessionBoolean);
  }
};
