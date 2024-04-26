import { type NextRequest, NextResponse } from "next/server";

import apiErrorHandler from "@/libs/api-error-handler";
import axios1cMain from "@/libs/axios";

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const response = await axios1cMain.get(`/data/${params.slug.join("/")}`);
    return NextResponse.json(response.data);
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
