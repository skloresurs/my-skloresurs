import axios from 'axios';

import { env } from '@/env.mjs';

/**
 * Validates the given ReCaptcha token via the ReCaptcha API.
 *
 * @param {string} token - The ReCaptcha token to be verified.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the token is valid.
 */
export default async function verifyReCaptcha(token: string): Promise<boolean> {
  const reCaptchaKey: string = env.RECAPTCHA_SECRET_KEY;

  try {
    const { data } = await axios.post<{ success: boolean }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${reCaptchaKey}&response=${token}`
    );

    return data.success;
  } catch (error) {
    return false;
  }
}
