import { prisma } from '@lucia-auth/adapter-prisma';
import { google } from '@lucia-auth/oauth/providers';
import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';

import { env } from '@/env.mjs';
import client from '@/libs/prisma';

export const auth = lucia({
  adapter: prisma(client),
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  getSessionAttributes: (data) => ({ ...data }),
  getUserAttributes: (data) => ({ ...data }),
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

export type Auth = typeof auth;
