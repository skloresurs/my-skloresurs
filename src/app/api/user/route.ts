import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';
import { orderBy } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { db } from '@/libs/db';
import { userSchema } from '@/libs/db/schema';
import { auth } from '@/libs/lucia';
import { getSession } from '@/libs/sessions';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const sessions = await auth.getAllUserSessions(session.user.id);

    const now = dayjs(new Date()).format('YYYY-MM-DD');

    const active_days = [...new Set([...session.user.active_days, now])];

    await db.update(userSchema).set({ active_days }).where(eq(userSchema.id, session.user.id)).execute();
    return NextResponse.json(
      {
        ...session.user,
        sessions: orderBy(sessions, ['created_at'], ['desc']),
        thisSession: session.id,
      },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
