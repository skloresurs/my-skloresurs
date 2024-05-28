import { type NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/libs/api-error-handler";
import axios1c from "@/libs/axios";
import { constant } from "lodash";

async function getServerStatus(server: string) {
  return await axios1c(server).get("/status").then(constant(true)).catch(constant(false));
}

export async function GET(req: NextRequest) {
  try {
    const dubno = await getServerStatus("dubno");
    const tlymach = await getServerStatus("tlymach");

    return NextResponse.json({ dubno, tlymach });
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
