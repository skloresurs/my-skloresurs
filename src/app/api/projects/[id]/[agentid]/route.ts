import { type NextRequest, NextResponse } from "next/server";

import { ServerError } from "@/classes/CustomError";
import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";
import logger from "@/libs/logger";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";

export async function GET(req: NextRequest, { params }: { params: { id: string; agentid: string } }) {
  try {
    const server = req.headers.get("server");
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "Projects");

    if (!session.user.id_1c) {
      throw ServerError;
    }

    const response = await axios1c(server)
      .get(`/projects/${params.id}/${params.agentid}`, {
        headers: {
          user: session.user.id_1c,
        },
      })
      .catch((error) => {
        logger.error(error.response.data);
        throw ServerError;
      });

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
