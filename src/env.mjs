import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// eslint-disable-next-line import/prefer-default-export
export const env = createEnv({
  client: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z
      .string({ required_error: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required' })
      .min(1),
  },
  experimental__runtimeEnv: {
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
    API_URL: z
      .string({ required_error: 'API_URL is required' })
      .url('API_URL must be a valid URL'),
    BASE_URL: z
      .string({ required_error: 'BASE_URL is required' })
      .url('BASE_URL must be a valid URL'),
    DATABASE_URL: z
      .string({ required_error: 'DATABASE_URL is required' })
      .min(1),
    GOOGLE_CLIENT_ID: z.string({
      required_error: 'GOOGLE_CLIENT_ID is required',
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: 'GOOGLE_CLIENT_SECRET is required',
    }),
    RECAPTCHA_SECRET_KEY: z.string({
      required_error: 'RECAPTCHA_SECRET_KEY is required',
    }),
  },
});
