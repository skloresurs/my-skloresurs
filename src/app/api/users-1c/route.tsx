import { type NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const server = req.headers.get("server");

    const search = params.get("search");
    const page = params.get("page");

    const paramsQuery = new URLSearchParams();
    if (search) {
      paramsQuery.append("search", search);
    }
    if (page) {
      paramsQuery.append("page", page);
    }

    const query = paramsQuery.toString().replaceAll("+", "%20");

    const response = await axios1c(server).get(`/data/users?${query}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
