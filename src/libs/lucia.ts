import { pg } from '@lucia-auth/adapter-postgresql';
import { facebook, google } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';

import { env } from '@/env.mjs';
import ISession from '@/types/Session';
import IUser from '@/types/User';

import { pool } from './db';

export const auth = lucia({
  adapter: pg(pool, {
    user: 'auth_user',
    session: 'user_session',
    key: 'user_key',
  }),
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  getSessionAttributes: (data: ISession) => ({ ...data }),
  getUserAttributes: (data: IUser) => ({ ...data }),
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
});

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${env.BASE_URL}/api/auth/google/callback`,
  scope: ['profile', 'email'],
});

export const facebookAuth = facebook(auth, {
  clientId: env.FACEBOOK_APP_ID,
  clientSecret: env.FACEBOOK_APP_SECRET,
  redirectUri: `${env.BASE_URL}/api/auth/facebook/callback`,
  scope: ['public_profile', 'email'],
});

export type Auth = typeof auth;
