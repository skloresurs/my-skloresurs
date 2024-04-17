import axios from "axios";

import { ReCatpchaError } from "@/classes/CustomError";
import { env } from "@/env.mjs";

/**
 * Verify ReCaptcha token.
 *
 * @param {string} token - The ReCaptcha token to verify
 * @return {Promise<void>} A Promise that resolves when the ReCaptcha token is verified
 */
export default async function verifyReCaptcha(token: string): Promise<void> {
  const reCaptchaKey: string = env.RECAPTCHA_SECRET_KEY;

  try {
    const { data } = await axios.post<{ success: boolean }>(
      `https://www.google.com/recaptcha/api/siteverify?secret=${reCaptchaKey}&response=${token}`,
    );

    if (!data.success) {
      throw ReCatpchaError;
    }
  } catch (error) {
    throw ReCatpchaError;
  }
}
