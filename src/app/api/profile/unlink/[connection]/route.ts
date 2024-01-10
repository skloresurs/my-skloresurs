import { capitalize } from 'lodash';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';
import verifyConnections from '@/libs/verify-connections';
import verifyIp from '@/libs/verify-ip';

export async function GET(req: NextRequest, { params }: { params: { connection: string } }) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.ip);
    await verifyConnections(session.user.userId);

    await auth.updateUserAttributes(session.user.userId, {
      [`${params.connection}_id`]: null,
    });
  } catch (error) {
    cookies().set('oauth_error', `Помилка під час видалення ${capitalize(params.connection)}`);
  }
  return NextResponse.json(null, {
    headers: { Location: '/profile?tab=link' },
    status: 302,
  });
}
