import { type NextRequest, NextResponse } from "next/server";

import { ServerError } from "@/classes/CustomError";
import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";
import logger from "@/libs/logger";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";
import type Project from "@/types/projects/Project";

interface IResponse {
  data: Project[];
}

export async function GET(req: NextRequest) {
  try {
    const server = req.headers.get("server");
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "Projects");

    const params = req.nextUrl.searchParams;

    const page = params.get("page");
    const agent = params.get("agent");
    const search = params.get("search");

    const paramsQuery = new URLSearchParams();

    if (page) {
      paramsQuery.append("page", page);
    }
    if (agent) {
      paramsQuery.append("agent", agent);
    }
    if (search) {
      paramsQuery.append("search", search);
    }

    const query = paramsQuery.toString().replaceAll("+", "%20");

    if (!session.user.id_1c) {
      throw ServerError;
    }

    const response = await axios1c(server)
      .get<IResponse>(`/projects?${query}`, {
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
