import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { includes, orderBy } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

import CustomError, { UserNotFoundError } from "@/classes/CustomError";
import apiErrorHandler from "@/libs/api-error-handler";
import { db } from "@/libs/db";
import { userSchema } from "@/libs/db/schema";
import { auth } from "@/libs/lucia";
import { getSession } from "@/libs/sessions";
import { verifyPermissionServer } from "@/libs/verify-permission";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    verifyPermissionServer(session.user.permissions, "Admin");

    const user = await auth.getUser(params.id);
    const sessions = await auth.getAllUserSessions(params.id);
    return NextResponse.json({ ...user, sessions: orderBy(sessions, ["created_at"], ["desc"]) }, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    verifyPermissionServer(session.user.permissions, "Admin");
    const userSearch = await db.select().from(userSchema).where(eq(userSchema.id, params.id)).limit(1).execute();
    if (userSearch.length === 0) {
      return UserNotFoundError;
    }
    const user = userSearch[0];

    if (!user) {
      return UserNotFoundError;
    }

    if (includes(user.permissions, "Admin") || includes(user.permissions, "SuperAdmin")) {
      throw new CustomError("Неможливо видалити адміністратора", StatusCodes.BAD_REQUEST);
    }

    await auth.deleteUser(params.id);
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
