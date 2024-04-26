import { type NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/libs/api-error-handler";
import { auth } from "@/libs/lucia";
import { getSession } from "@/libs/sessions";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (session) {
      await auth.invalidateSession(session.id);
      await auth.deleteDeadUserSessions(session.user.id);
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
