import { type NextRequest, NextResponse } from "next/server";

import { ServerError } from "@/classes/CustomError";
import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";
import logger from "@/libs/logger";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";
import type { FullOrder } from "@/types/manager/Order";

interface IResponse {
  data: FullOrder[];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const server = req.headers.get("server");
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "Manager");

    const response = await axios1c(server)
      .get<IResponse>(`/manager/orders/${params.id}`, {
        headers: { user: session.user.id_1c },
      })
      .catch((error) => {
        logger.error(error.response.data);
        throw ServerError;
      });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
