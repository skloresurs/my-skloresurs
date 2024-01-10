import { and, count, desc, like } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import apiErrorHandler from '@/libs/api-error-handler';
import { db } from '@/libs/db';
import { userSchema } from '@/libs/db/schema';
import { getSession } from '@/libs/sessions';
import verifyIp from '@/libs/verify-ip';
import { verifyPermissionServer } from '@/libs/verify-permission';

function getSortByVariable(key: string) {
  switch (key) {
    case 'id': {
      return userSchema.id;
    }
    case 'fullname': {
      return userSchema.fullname;
    }
    case 'email': {
      return userSchema.email;
    }
    default: {
      return userSchema.fullname;
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, 'Admin');

    const params = req.nextUrl.searchParams;

    const page = params.get('page') ?? 1;
    const pageSize = params.get('pageSize') ?? 10;
    const sortBy = params.get('sortBy') ?? 'fullname';
    const sortDirection = params.get('sortDirection') ?? 'asc';

    const filterById = params.get('filterById') ?? '';
    const filterByName = params.get('filterByName') ?? '';
    const filterByEmail = params.get('filterByEmail') ?? '';

    const total = await db
      .select({ count: count() })
      .from(userSchema)
      .where(
        and(
          like(userSchema.fullname, `%${filterByName}%`),
          like(userSchema.email, `%${filterByEmail}%`),
          like(userSchema.id, `%${filterById}%`)
        )
      );

    const users = await db
      .select()
      .from(userSchema)
      .where(
        and(
          like(userSchema.fullname, `%${filterByName}%`),
          like(userSchema.email, `%${filterByEmail}%`),
          like(userSchema.id, `%${filterById}%`)
        )
      )
      .orderBy(sortDirection === 'desc' ? desc(getSortByVariable(sortBy)) : getSortByVariable(sortBy))
      .limit(Number(pageSize))
      .offset((Number(page) - 1) * Number(pageSize));

    return NextResponse.json({ total: total[0].count, users }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
