import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import prisma from '@/libs/prisma';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    await verifyIp(session.user.ip);
    verifyPermissionServer(session.user.permissions, 'Admin');

    const params = request.nextUrl.searchParams;
    const page = params.get('page') ?? 1;

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
    return apiErrorHandler(error);
  }
}
