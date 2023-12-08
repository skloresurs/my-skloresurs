import { prisma } from '@lucia-auth/adapter-prisma';
import { facebook, google, twitter } from '@lucia-auth/oauth/providers';
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

export const facebookAuth = facebook(auth, {
  clientId: env.FACEBOOK_APP_ID,
  clientSecret: env.FACEBOOK_APP_SECRET,
  redirectUri: `${env.BASE_URL}/api/auth/facebook/callback`,
  scope: ['public_profile', 'email'],
});

export const twitterAuth = twitter(auth, {
  clientId: env.TWITTER_CLIENT_ID,
  clientSecret: env.TWITTER_CLIENT_SECRET,
  redirectUri: `${env.BASE_URL}/api/auth/twitter/callback`,
});

export type Auth = typeof auth;
