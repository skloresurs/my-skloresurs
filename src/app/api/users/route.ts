import { and, arrayOverlaps, count, like, not } from "drizzle-orm";
import { find, map } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/libs/api-error-handler";
import { db } from "@/libs/db";
import { permissionsEnum, userSchema } from "@/libs/db/schema";
import { auth } from "@/libs/lucia";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";
import type { Permission } from "@/types/User";

function getFilter(
  permission: Permission | undefined,
  filterByName: string,
  filterByEmail: string,
  filterById: string,
) {
  if (!permission) {
    return and(
      like(userSchema.fullname, `%${filterByName}%`),
      like(userSchema.email, `%${filterByEmail}%`),
      like(userSchema.id, `%${filterById}%`),
      not(arrayOverlaps(userSchema.permissions, permissionsEnum.enumValues)),
    );
  }
  return and(
    like(userSchema.fullname, `%${filterByName}%`),
    like(userSchema.email, `%${filterByEmail}%`),
    like(userSchema.id, `%${filterById}%`),
    arrayOverlaps(userSchema.permissions, [permission]),
  );
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "Admin");

    const params = req.nextUrl.searchParams;

    const pageSize = 10;
    const page = params.get("page") ?? 1;

    const filterById = params.get("filterById") ?? "";
    const filterByName = params.get("filterByName") ?? "";
    const filterByEmail = params.get("filterByEmail") ?? "";
    const filterByPermission = find(permissionsEnum.enumValues, (e) => e === params.get("permission"));

    const total = await db
      .select({ count: count() })
      .from(userSchema)
      .where(getFilter(filterByPermission, filterByName, filterByEmail, filterById));

    const users = await db
      .select()
      .from(userSchema)
      .where(getFilter(filterByPermission, filterByName, filterByEmail, filterById))
      .orderBy(userSchema.fullname)
      .limit(Number(pageSize))
      .offset((Number(page) - 1) * Number(pageSize));

    const usersWithSessions = await Promise.all(
      map(users, async (user) => ({
        ...user,
        sessions: await auth.getAllUserSessions(user.id),
      })),
    );

    return NextResponse.json({ total: total[0]?.count, users: usersWithSessions }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
