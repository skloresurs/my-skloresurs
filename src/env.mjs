import { createEnv } from '@t3-oss/env-nextjs';
// eslint-disable-next-line lodash/import-scope
import _ from 'lodash';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z
      .string({
        required_error: 'GOOGLE_MAPS_API_KEY is required [https://console.cloud.google.com/google/maps-apis/start]',
      })
      .min(1),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z
      .string({
        required_error: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required [https://www.google.com/recaptcha/admin/]',
      })
      .min(1),
    NEXT_PUBLIC_TAWK_API_KEY: z.string({
      required_error: 'NEXT_PUBLIC_TAWK_API_KEY is required [https://dashboard.tawk.to/]',
    }),
    NEXT_PUBLIC_TAWK_PROPERTY_ID: z.string({
      required_error: 'NEXT_PUBLIC_TAWK_PROPERTY_ID is required [https://dashboard.tawk.to/]',
    }),
    NEXT_PUBLIC_TAWK_WIDGET_ID: z.string({
      required_error: 'NEXT_PUBLIC_TAWK_WIDGET_ID is required [https://dashboard.tawk.to/]',
    }),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_TAWK_API_KEY: process.env.NEXT_PUBLIC_TAWK_API_KEY,
    NEXT_PUBLIC_TAWK_PROPERTY_ID: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
    NEXT_PUBLIC_TAWK_WIDGET_ID: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID,
  },
  onInvalidAccess: (error) => {
    throw new Error(`❌ Attempted to access a server-side environment variable on the client: ${error}`);
  },
  onValidationError: (error) => {
    throw new Error(
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      `❌ Invalid environment variables:\n\n${_.map(error.errors, (e, i) => `${i + 1}. ${e.message}`).join('\n')}`
    );
  },

  server: {
    API_URL_1C_MAIN: z
      .string({ required_error: 'NEXT_PUBLIC_API_URL_1C_MAIN is required' })
      .url('NEXT_PUBLIC_API_URL_1C_MAIN must be a valid URL'),
    API_KEY_1C_MAIN: z.string({
      required_error: 'API_KEY_1C_MAIN is required',
    }),
    BASE_URL: z
      .string({ required_error: 'BASE_URL is required' })
      .url('BASE_URL must be a valid URL')
      .default(process.env.URL ?? 'http://localhost:3000'),
    DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required. Database must be PostgreSQL' }),
    FACEBOOK_APP_ID: z.string({
      required_error: 'FACEBOOK_APP_ID is required [https://developers.facebook.com/apps]',
    }),
    FACEBOOK_APP_SECRET: z.string({
      required_error: 'FACEBOOK_APP_SECRET is required [https://developers.facebook.com/apps]',
    }),
    GOOGLE_CLIENT_ID: z.string({
      required_error: 'GOOGLE_CLIENT_ID is required [https://console.cloud.google.com/apis/credentials]',
    }),
    GOOGLE_CLIENT_SECRET: z.string({
      required_error: 'GOOGLE_CLIENT_SECRET is required [https://console.cloud.google.com/apis/credentials]',
    }),
    RECAPTCHA_SECRET_KEY: z.string({
      required_error: 'RECAPTCHA_SECRET_KEY is required [https://www.google.com/recaptcha/admin/]',
    }),
  },
});
