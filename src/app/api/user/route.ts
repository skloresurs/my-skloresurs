import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { getSession } from '@/libs/sessions';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    return NextResponse.json(session.user, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
