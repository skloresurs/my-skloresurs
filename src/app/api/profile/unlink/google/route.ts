import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.ip);
    await auth.updateUserAttributes(session.user.userId, {
      google: null,
      googleId: null,
    });
  } catch (error) {
    cookies().set('oauth_error', 'Помилка під час видалення Google');
  }
  return NextResponse.json(null, {
    headers: { Location: '/profile?tab=link' },
    status: 302,
  });
}
