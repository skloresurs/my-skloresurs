import { StatusCodes } from 'http-status-codes';
import { LuciaError } from 'lucia';
import { NextResponse } from 'next/server';

import CustomError from '@/classes/CustomError';
import { env } from '@/env.mjs';

import logger from './logger';

/**
 * Handles errors thrown by the API.
 *
 * @param {unknown} error - The error object.
 * @param {string} [key] - Optional key parameter.
 * @return {NextResponse} The response object.
 */
export default function apiErrorHandler(error: unknown, url: string, key?: string): NextResponse {
  if (error instanceof CustomError) {
    logger.error(`API Error: [${error.code}] - ${error} (${env.BASE_URL}/api${url})`);
    return NextResponse.json(
      {
        code: error.code,
        error: error.message,
      },
      { status: error.code }
    );
  }

  if (error instanceof LuciaError) {
    if (error.message === 'AUTH_INVALID_USER_ID') {
      return NextResponse.json(
        { code: StatusCodes.NOT_FOUND, error: 'Користувача не знайдено' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD') {
      if (key === 'old-password') {
        return NextResponse.json(
          { code: StatusCodes.BAD_REQUEST, error: 'Невірний старий пароль' },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
      return NextResponse.json(
        { code: StatusCodes.UNAUTHORIZED, error: 'Невірний логін або пароль' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
  }

  logger.error(`API Error: [500] - ${error} (${env.BASE_URL}/api${url})`);

  return NextResponse.json(
    {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Невідома помилка',
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
