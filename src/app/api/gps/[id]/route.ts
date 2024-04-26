import axios from "axios";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { constant } from "lodash";
import { type NextRequest, NextResponse } from "next/server";

import CustomError from "@/classes/CustomError";
import { env } from "@/env.mjs";
import apiErrorHandler from "@/libs/api-error-handler";
import { getSession } from "@/libs/sessions";
import verifyIp from "@/libs/verify-ip";
import { verifyPermissionServer } from "@/libs/verify-permission";
import type GpsData from "@/types/gps/GpsData";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req);
    await verifyIp(req, session.user.allowed_ips);
    verifyPermissionServer(session.user.permissions, "GPS");
    const data = await axios
      .get<{ items: GpsData[] }>(`${env.GPS_API}/objects/${params.id}/coordinates`, {
        params: {
          version: 1,
          api_key: env.GPS_API_KEY,
          fromDatetime: dayjs().subtract(1, "hours").toISOString(),
          toDatetime: dayjs().toISOString(),
        },
      })
      .then((res) => {
        if (res.data.items.length > 0) {
          return res.data.items.at(-1) ?? null;
        }
        return null;
      })
      .catch(constant(null));

    if (!data) throw new CustomError("Не вдалось отримати локацію", StatusCodes.BAD_REQUEST);

    const locationData = await axios
      .get("https://maps.googleapis.com/maps/api/directions/json", {
        params: {
          origin: `${data?.position.latitude},${data?.position.longitude}`,
          destination: "50.393705,25.7755833",
          key: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: "uk",
          mode: "driving",
        },
      })
      .then((res) => ({
        address: res.data.routes[0].legs[0].start_address ?? null,
        distance: res.data.routes[0].legs[0].distance?.text ?? null,
        time: res.data.routes[0].legs[0].duration?.text ?? null,
      }))
      .catch(constant(null));

    if (!locationData) throw new CustomError("Не вдалось отримати локацію", StatusCodes.BAD_REQUEST);

    return NextResponse.json(locationData);
  } catch (error) {
    return apiErrorHandler(req, error);
  }
}
