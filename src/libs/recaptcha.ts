import axios from 'axios';

import { ReCatpchaError } from '@/classes/CustomError';
import { env } from '@/env.mjs';

export default async function verifyReCaptcha(token: string): Promise<void> {
  const reCaptchaKey: string = env.RECAPTCHA_SECRET_KEY;

  try {
    const { data } = await axios.post<{ success: boolean }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${reCaptchaKey}&response=${token}`
    );

    if (!data.success) {
      throw ReCatpchaError;
    }
  } catch (error) {
    throw ReCatpchaError;
  }
}
