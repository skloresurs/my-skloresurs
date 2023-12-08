import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// eslint-disable-next-line import/prefer-default-export
export const env = createEnv({
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z
      .string({
        required_error: 'GOOGLE_MAPS_API_KEY is required',
      })
      .min(1),

    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z
      .string({ required_error: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required' })
      .min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  onInvalidAccess: (error) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable on the client: ${error}`
    );
  },
  onValidationError: (error) => {
    throw new Error(
      `❌ Invalid environment variables: ${error.flatten().fieldErrors}`
    );
  },

  server: {
    API_KEY_1C_MAIN: z.string({
      required_error: 'API_KEY_1C_MAIN is required',
    }),
    API_URL_1C_MAIN: z
      .string({ required_error: 'API_URL_1C_MAIN is required' })
      .url('API_URL_1C_MAIN must be a valid URL'),
    API_URL_1C_SECONDARY: z
      .string({ required_error: 'API_URL_1C_SECONDARY is required' })
      .url('API_URL_1C_SECONDARY must be a valid URL'),
    BASE_URL: z
      .string({ required_error: 'BASE_URL is required' })
      .url('BASE_URL must be a valid URL'),
    DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }),
    FACEBOOK_APP_ID: z.string({
      required_error: 'FACEBOOK_APP_ID is required',
    }),
    FACEBOOK_APP_SECRET: z.string({
      required_error: 'FACEBOOK_APP_SECRET is required',
    }),
    GOOGLE_CLIENT_ID: z.string({
      required_error: 'GOOGLE_CLIENT_ID is required',
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: 'GOOGLE_CLIENT_SECRET is required',
    }),
    RECAPTCHA_SECRET_KEY: z.string({
      required_error: 'RECAPTCHA_SECRET_KEY is required',
    }),
    TELEGRAM_BOT_TOKEN: z.string({
      required_error: 'TELEGRAM_BOT_TOKEN is required',
    }),
    TELEGRAM_CHAT_ID: z.string({
      required_error: 'TELEGRAM_CHAT_ID is required',
    }),
  },
});
