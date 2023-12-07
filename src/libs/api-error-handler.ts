import { LuciaError } from 'lucia';
import { NextResponse } from 'next/server';

import CustomError from '@/classes/CustomError';

export default function apiErrorHandler(error: unknown): NextResponse {
  if (error instanceof CustomError) {
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
        { code: 404, error: 'Користувача не знайдено' },
        { status: 404 }
      );
    }

    if (
      error.message === 'AUTH_INVALID_KEY_ID' ||
      error.message === 'AUTH_INVALID_PASSWORD'
    ) {
      return NextResponse.json(
        { code: 401, error: 'Невірний логін або пароль' },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    {
      code: 500,
      error: 'Невідома помилка',
    },
    { status: 500 }
  );
}
