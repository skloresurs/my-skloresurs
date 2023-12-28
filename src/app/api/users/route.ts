import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import prisma from '@/libs/prisma';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.ip);
    verifyPermissionServer(session.user.permissions, 'Admin');

    const params = req.nextUrl.searchParams;

    const page = params.get('page') ?? 1;
    const pageSize = params.get('pageSize') ?? 10;
    const sortBy = params.get('sortBy') ?? 'fullname';
    const sortDirection = params.get('sortDirection') ?? 'asc';

    const filterById = params.get('filterById') ?? '';
    const filterByName = params.get('filterByName') ?? '';
    const filterByEmail = params.get('filterByEmail') ?? '';

    const where = {
      AND: [
        {
          id: {
            contains: filterById,
          },
        },
        {
          fullname: {
            contains: filterByName,
          },
        },
        {
          email: {
            contains: filterByEmail,
          },
        },
      ],
    };

    const users = await prisma.user.findMany({
      where,
      orderBy: {
        [sortBy]: sortDirection,
      },
      skip: (Number(page) - 1) * +pageSize,
      take: +pageSize,
    });

    const total = await prisma.user.count({
      where,
    });

    return NextResponse.json({ total, users }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(error, '/users');
  }
}
