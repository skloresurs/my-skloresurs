import { StatusCodes } from 'http-status-codes';
import { LuciaError } from 'lucia';
import { NextRequest, NextResponse } from 'next/server';

import CustomError from '@/classes/CustomError';

import logger from './logger';

/**
 * A function that handles API errors and returns a NextResponse.
 *
 * @param {NextRequest} req - the request object
 * @param {unknown} error - the error object
 * @param {string} [key] - an optional key parameter
 * @return {NextResponse} the response object
 */

export default function apiErrorHandler(req: NextRequest, error: unknown, key?: string): NextResponse {
  if (error instanceof CustomError) {
    logger.error(`API Error: [${error.code}] - ${error} (${req.nextUrl.toString()})`);
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

  logger.error(`API Error: [500] - ${error} (${req.nextUrl.toString()})`);

  return NextResponse.json(
    {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Невідома помилка',
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
}
