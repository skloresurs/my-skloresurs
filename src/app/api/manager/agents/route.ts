import { slice } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

import { ServerError } from "@/classes/CustomError";
import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";
import logger from "@/libs/logger";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";
import type Agent from "@/types/manager/Agent";

interface IResponse {
  data: Agent[];
}

const PAGE_SIZE = 48;

export async function GET(req: NextRequest) {
  try {
    const server = req.headers.get("server");
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "Manager");

    const params = req.nextUrl.searchParams;

    const search = params.get("search");
    const all = params.get("all");
    const page = Number(params.get("page") ?? 1);

    const paramsQuery = new URLSearchParams();
    if (search) {
      paramsQuery.append("search", search);
    }
    if (all) {
      paramsQuery.append("all", "true");
    }

    const query = paramsQuery.toString().replaceAll("+", "%20");

    if (!session.user.id_1c) {
      throw ServerError;
    }

    const response = await axios1c(server)
      .get<IResponse>(`/manager/agents?${query}`, {
        headers: {
          user: session.user.id_1c,
        },
      })
      .catch((error) => {
        logger.error(error.response.data);
        throw ServerError;
      });

    return NextResponse.json(
      {
        total: response.data.data.length,
        data: slice(response.data.data, (page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
