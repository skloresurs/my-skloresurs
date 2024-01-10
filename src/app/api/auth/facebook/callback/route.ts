import { eq } from 'drizzle-orm';
import { constant, toLower } from 'lodash';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

import CustomError from '@/classes/CustomError';
import { db, getDbError } from '@/libs/db';
import { userSchema } from '@/libs/db/schema';
import { auth, facebookAuth } from '@/libs/lucia';
import oauthRedirect, { oauthErrorRedirect } from '@/libs/oauth-middleware';
import { getSession, setSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export const GET = async (req: NextRequest) => {
  const activeSession = await getSession(req).catch(constant(null));
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

    if (!facebookUser.email) {
      return oauthErrorRedirect('Не вдалось отримати ваш E-mail', activeSessionBoolean);
    }

    const userByFacebookId = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.facebook_id, facebookUser.id))
      .limit(1)
      .execute()
      .then((data) => data[0])
      .catch(constant(null));

    if (activeSession && userByFacebookId) {
      return oauthErrorRedirect("Цей oauth аккаунт вже зв'язаний з іншим аккаунтом", activeSessionBoolean);
    }

    if (activeSession) {
      await auth.updateUserAttributes(activeSession.user.id, {
        facebook_id: facebookUser.id,
      });
      return oauthRedirect(activeSessionBoolean);
    }

    if (userByFacebookId) {
      verifyIp(req, userByFacebookId.allowed_ips);
      await setSession(req, userByFacebookId.id);
      return oauthRedirect(activeSessionBoolean);
    }

    const user = await auth
      .createUser({
        attributes: {
          email: facebookUser.email,
          facebook_id: facebookUser.id,
          fullname: facebookUser.name,
        },
        key: {
          password: null,
          providerId: 'email',
          providerUserId: toLower(facebookUser.email),
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
