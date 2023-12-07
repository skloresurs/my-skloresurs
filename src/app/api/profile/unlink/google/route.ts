import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);
    await auth.updateUserAttributes(session.user.userId, {
      google: null,
    });
  } catch (error) {
    cookies().set('oauth_error', 'Помилка під час видалення Google');
  }
  return NextResponse.json(null, {
    headers: { Location: '/profile?tab=link' },
    status: 302,
  });
}
