import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/libs/prisma';
import getSession from '@/libs/server-session';
import verifyIp from '@/libs/verify-ip';
import verifyPermission from '@/libs/verify-permission';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = params.get('page') ?? 1;
    const session = await getSession();
    if (!session) {
      return NextResponse.json(null, { status: 401 });
    }

    if (
      !(await verifyIp(session.user.ip)) ||
      !verifyPermission(session.user.permissions, 'Admin')
    ) {
      return NextResponse.json(null, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: {
        fullname: 'asc',
      },
      skip: (Number(page) - 1) * 10,
      take: 10,
    });

    const total = await prisma.user.count();

    return NextResponse.json({ total, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json('Помилка сервера', { status: 500 });
  }
}
